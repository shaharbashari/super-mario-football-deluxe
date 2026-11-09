import {
  ONLINE_VERSION, ONLINE_PREFIX, ONLINE_INPUT_KEYS, ONLINE_EDGE_KEYS, ONLINE_DEFAULTS,
  createRoomCode, normalizeRoomCode, validatePick, validateRoomConfig, validateLobby,
  validateOnlineInput, encodeOnlinePacket, decodeOnlinePacket, validateOnlineState,
} from './online-state.js';

const onlineErrorText = error => {
  const messages = {
    'peer-unavailable': 'Room not found. Check the code and make sure the host has the room open.',
    'unavailable-id': 'That room code is already in use. Create a new room.',
    'browser-incompatible': 'This browser cannot use WebRTC data connections. Try a current browser.',
    'network': 'The connection service is unavailable. Check your connection and try again.',
    'server-error': 'The connection service is unavailable. Try again shortly.',
    'socket-error': 'The connection to the room service failed. Check your network.',
    'socket-closed': 'The room service disconnected. Reopen the room to reconnect.',
    'webrtc': 'The peer connection failed. A firewall or restricted network may be blocking it.',
  };
  return messages[error?.type] || error?.message || 'The online connection failed.';
};

export class OnlineRoom {
  constructor({ peerFactory = (id, options) => new window.Peer(id, options), onEvent = () => {} } = {}) {
    this.peerFactory = peerFactory;
    this.onEvent = onEvent;
    this.generation = 0;
    this.phase = 'idle';
    this.connections = new Map();
    this.players = [];
    this.config = { ...ONLINE_DEFAULTS };
    this.pausedSlots = new Set();
    this.remoteInputs = new Map();
    this.timers = new Set();
    this.slot = -1;
    this.matchId = 0;
    this.inputSequence = 0;
    this.latency = 0;
  }

  get active() { return this.phase !== 'idle' && this.phase !== 'connecting'; }
  get isHost() { return this.slot === 0; }
  get paused() { return this.pausedSlots.size > 0; }
  get capacity() { return this.config.mode === 'doubles' ? 4 : 2; }
  get canStart() { return this.isHost && this.phase === 'lobby' && this.players.length >= 2 && this.players.every(player => player.ready); }

  _later(callback, ms) {
    const timer = setTimeout(() => { this.timers.delete(timer); callback(); }, ms);
    this.timers.add(timer);
    return timer;
  }

  _cancel(timer) { clearTimeout(timer); this.timers.delete(timer); }
  _event(type, data) { this.onEvent(type, data); }

  async _open(id) {
    const generation = this.generation;
    if (typeof window !== 'undefined' && !window.RTCPeerConnection) throw new Error('This browser does not support WebRTC.');
    const peer = this.peerFactory(id, { secure: true, debug: 0 });
    this.peer = peer;
    return new Promise((resolve, reject) => {
      this.pendingOpenReject = reject;
      let opened = false;
      const timeout = this._later(() => reject(new Error('Connection service timed out. Check your network and try again.')), 20000);
      peer.on('open', () => {
        if (generation !== this.generation) { peer.destroy(); return; }
        opened = true;
        this.pendingOpenReject = null;
        this._cancel(timeout);
        resolve(peer);
      });
      peer.on('error', error => {
        if (generation !== this.generation) return;
        this._cancel(timeout);
        const message = onlineErrorText(error);
        if (!opened) { this.pendingOpenReject = null; reject(new Error(message)); }
        else this._fail(message);
      });
      peer.on('disconnected', () => {
        if (generation === this.generation && opened) this._fail('The room service disconnected. Reopen the room to reconnect.');
      });
      peer.on('close', () => {
        if (generation === this.generation && opened) this._fail('The online room connection closed.');
      });
    });
  }

  async create(pick, config = ONLINE_DEFAULTS) {
    this.close();
    this.phase = 'connecting';
    this._event('status', 'Creating room…');
    const generation = this.generation;
    try {
      this.config = validateRoomConfig(config);
      this.code = createRoomCode();
      const peer = await this._open(ONLINE_PREFIX + this.code);
      if (generation !== this.generation) return;
      this.slot = 0;
      this.phase = 'lobby';
      this.players = [{ ...validatePick(pick), slot: 0, ready: false }];
      peer.on('connection', connection => this._accept(connection, generation));
      this._heartbeat();
      this._publishLobby();
    } catch (error) {
      if (generation === this.generation) this._fail(error.message);
    }
  }

  async join(code, pick) {
    const normalized = normalizeRoomCode(code);
    if (!normalized) throw new Error('Enter the six-character room code. Letters are not case-sensitive.');
    this.close();
    this.phase = 'connecting';
    this.code = normalized;
    this.pick = validatePick(pick);
    this._event('status', 'Connecting to the room…');
    const generation = this.generation;
    try {
      const peer = await this._open(undefined);
      if (generation !== this.generation) return;
      const connection = peer.connect(ONLINE_PREFIX + normalized, {
        label: 'smfd-room', serialization: 'json', reliable: true,
        metadata: { app: ONLINE_PREFIX, version: ONLINE_VERSION },
      });
      this.hostConnection = connection;
      this.lastHostMessage = performance.now();
      this.joinTimeout = this._later(() => this._fail('Could not reach the host. Check the code, or try a different network; some networks block peer-to-peer connections.'), 25000);
      connection.on('open', () => {
        if (generation !== this.generation) return;
        this._send(connection, 'hello', this.pick);
      });
      connection.on('data', raw => {
        if (generation !== this.generation) return;
        this.lastHostMessage = performance.now();
        try { this._guestPacket(decodeOnlinePacket(raw)); } catch (error) { this._fail(error.message); }
      });
      connection.on('close', () => { if (generation === this.generation) this._fail('The host left or disconnected. Create or join another room.'); });
      connection.on('error', error => { if (generation === this.generation) this._fail(onlineErrorText(error)); });
    } catch (error) {
      if (generation === this.generation) this._fail(error.message);
    }
  }

  _accept(connection, generation) {
    if (generation !== this.generation || !this.isHost) { connection.close(); return; }
    if (this.connections.size >= 6 || this.connections.has(connection.peer)) { connection.close(); return; }
    const info = { connection, slot: -1, lastSeen: performance.now(), sequence: -1, rateAt: performance.now(), rate: 0 };
    this.connections.set(connection.peer, info);
    info.timeout = this._later(() => this._drop(info, 'Player handshake timed out.'), 15000);
    connection.on('data', raw => {
      if (generation !== this.generation) return;
      try {
        const now = performance.now();
        if (now - info.rateAt >= 1000) { info.rateAt = now; info.rate = 0; }
        if (++info.rate > 120) throw new Error('Too many messages from a player.');
        if (typeof raw !== 'string' || raw.length > 2048) throw new Error('Player control packet is too large.');
        info.lastSeen = now;
        this._hostPacket(info, decodeOnlinePacket(raw));
      } catch (error) { this._drop(info, error.message); }
    });
    connection.on('close', () => { if (generation === this.generation) this._drop(info, 'A player disconnected.'); });
    connection.on('error', error => { if (generation === this.generation) this._drop(info, onlineErrorText(error)); });
  }

  _hostPacket(info, packet) {
    const { type, data } = packet;
    if (info.slot < 0) {
      if (type !== 'hello') throw new Error('A room handshake is required.');
      if (info.connection.metadata?.app !== ONLINE_PREFIX || info.connection.metadata?.version !== ONLINE_VERSION) {
        throw new Error('Game versions do not match. Refresh both game tabs.');
      }
      const pick = validatePick(data);
      if (this.phase !== 'lobby') { this._reject(info, 'A match is in progress. Join after the round ends.'); return; }
      if (this.players.length >= this.capacity) { this._reject(info, 'This room is full.'); return; }
      info.slot = [1, 2, 3].find(slot => slot < this.capacity && !this.players.some(player => player.slot === slot));
      this._cancel(info.timeout);
      this.players.push({ ...pick, slot: info.slot, ready: false });
      this.players.sort((a, b) => a.slot - b.slot);
      this._send(info.connection, 'welcome', { slot: info.slot, lobby: this._lobby() });
      this._publishLobby();
      return;
    }
    if (type === 'ping') { this._send(info.connection, 'pong', this._ping(data)); return; }
    if (type === 'leave') { this._drop(info, 'A player left the room.'); return; }
    if (type === 'pick') {
      if (this.phase !== 'lobby') return;
      Object.assign(this.players.find(player => player.slot === info.slot), validatePick(data), { ready: false });
      this._publishLobby();
    } else if (type === 'ready') {
      if (typeof data.ready !== 'boolean') throw new Error('Invalid ready status.');
      if (this.phase !== 'lobby') return;
      this.players.find(player => player.slot === info.slot).ready = data.ready;
      this._publishLobby();
    } else if (type === 'input') {
      if (this.phase !== 'match' || data.matchId !== this.matchId) return;
      if (!Number.isInteger(data.sequence) || data.sequence < 0) throw new Error('Invalid input sequence.');
      if (data.sequence <= info.sequence) return;
      const input = validateOnlineInput(data.input);
      info.sequence = data.sequence;
      const old = this.remoteInputs.get(info.slot);
      for (const key of ONLINE_EDGE_KEYS) input[key] ||= old?.input[key] || false;
      this.remoteInputs.set(info.slot, { input, at: performance.now() });
    } else if (type === 'pause') {
      if (typeof data.paused !== 'boolean') throw new Error('Invalid pause request.');
      if (this.phase === 'match' && data.matchId === this.matchId) this._setPause(info.slot, data.paused);
    } else throw new Error('Unsupported player message.');
  }

  _guestPacket({ type, data }) {
    if (type === 'error') {
      if (typeof data.message !== 'string' || data.message.length > 200) throw new Error('Invalid room error.');
      this._fail(data.message); return;
    }
    if (type === 'welcome') {
      if (this.slot >= 0 || !Number.isInteger(data.slot) || data.slot < 1 || data.slot > 3) throw new Error('Invalid room assignment.');
      const lobby = validateLobby(data.lobby);
      if (lobby.code !== this.code || !lobby.players.some(player => player.slot === data.slot)) throw new Error('Room assignment mismatch.');
      this.slot = data.slot;
      this._cancel(this.joinTimeout);
      this._applyLobby(lobby);
      this._heartbeat();
      return;
    }
    if (this.slot < 0) throw new Error('The host has not assigned a player slot.');
    if (type === 'lobby') this._applyLobby(validateLobby(data));
    else if (type === 'start') {
      const lobby = validateLobby(data.lobby);
      if (lobby.code !== this.code || !Number.isInteger(data.matchId) || data.matchId <= this.matchId) throw new Error('Invalid match start.');
      this._applyLobby(lobby);
      this.matchId = data.matchId;
      this.phase = 'match';
      this.pausedSlots.clear();
      this._event('start', { matchId: this.matchId, config: this.config, players: this.players });
    } else if (type === 'state' || type === 'finish') {
      if (data.matchId !== this.matchId || this.phase !== 'match') return;
      const state = validateOnlineState(data.state);
      this._event(type, state);
      if (type === 'finish') {
        this.phase = 'lobby';
        this.pausedSlots.clear();
        this.players.forEach(player => { player.ready = false; });
        this._event('lobby', this._lobby());
      }
    } else if (type === 'pause') {
      if (data.matchId !== this.matchId || this.phase !== 'match') return;
      if (!Array.isArray(data.slots) || data.slots.length > 4 || data.slots.some(slot => !this.players.some(player => player.slot === slot))) throw new Error('Invalid pause state.');
      this.pausedSlots = new Set(data.slots);
      this._event('pause', [...this.pausedSlots]);
    } else if (type === 'abort') {
      if (data.matchId !== this.matchId || typeof data.message !== 'string' || data.message.length > 200) throw new Error('Invalid round cancellation.');
      this.phase = 'lobby';
      this.pausedSlots.clear();
      this._event('abort', data.message);
    } else if (type === 'pong') {
      const ping = this._ping(data);
      this.latency = Math.max(0, Math.min(9999, Math.round(performance.now() - ping.at)));
      this._event('latency', this.latency);
    } else throw new Error('Unsupported host message.');
  }

  _ping(data) {
    if (typeof data.at !== 'number' || !Number.isFinite(data.at) || data.at < 0) throw new Error('Invalid heartbeat.');
    return { at: data.at };
  }

  _applyLobby(lobby) {
    if (lobby.code !== this.code || !lobby.players.some(player => player.slot === this.slot)) throw new Error('Room membership changed unexpectedly.');
    this.config = lobby.config;
    this.players = lobby.players;
    this.phase = lobby.phase;
    this._event('lobby', lobby);
  }

  _lobby() { return { code: this.code, config: this.config, players: this.players, phase: this.phase }; }
  _publishLobby() { const lobby = this._lobby(); this._broadcast('lobby', lobby); this._event('lobby', lobby); }

  setPick(pick) {
    const valid = validatePick(pick);
    if (this.phase !== 'lobby') throw new Error('Selections are locked during a match.');
    if (this.isHost) {
      Object.assign(this.players[0], valid, { ready: false });
      this._publishLobby();
    } else this._send(this.hostConnection, 'pick', valid);
  }

  setReady(ready) {
    if (this.phase !== 'lobby') return;
    if (this.isHost) {
      this.players[0].ready = Boolean(ready);
      this._publishLobby();
    } else this._send(this.hostConnection, 'ready', { ready: Boolean(ready) });
  }

  setConfig(config) {
    if (!this.isHost || this.phase !== 'lobby') throw new Error('Only the host can change room rules in the lobby.');
    const valid = validateRoomConfig(config);
    if (valid.mode === 'duel' && this.players.some(player => player.slot > 1)) throw new Error('Players 3 and 4 must leave before switching to 1v1.');
    this.config = valid;
    this.players.forEach(player => { player.ready = false; });
    this._publishLobby();
  }

  start() {
    if (!this.canStart) throw new Error('At least two connected players must be ready.');
    this.phase = 'match';
    this.matchId++;
    this.pausedSlots.clear();
    this.remoteInputs.clear();
    for (const info of this.connections.values()) info.sequence = -1;
    const data = { matchId: this.matchId, lobby: this._lobby() };
    this._broadcast('start', data);
    this._event('start', { matchId: this.matchId, config: this.config, players: this.players });
  }

  sendInput(input) {
    if (this.phase !== 'match' || this.isHost) return;
    const frame = Object.fromEntries(ONLINE_INPUT_KEYS.map(key => [key, Boolean(input[key])]));
    this._send(this.hostConnection, 'input', { matchId: this.matchId, sequence: this.inputSequence++, input: frame });
  }

  takeInput(slot) {
    const entry = this.remoteInputs.get(slot);
    if (!entry || this.paused || performance.now() - entry.at > 400) return {};
    const input = { ...entry.input };
    for (const key of ONLINE_EDGE_KEYS) entry.input[key] = false;
    return input;
  }

  requestPause(paused) {
    if (this.phase !== 'match') return;
    if (this.isHost) this._setPause(0, paused);
    else this._send(this.hostConnection, 'pause', { matchId: this.matchId, paused: Boolean(paused) });
  }

  _setPause(slot, paused) {
    if (paused) this.pausedSlots.add(slot);
    else this.pausedSlots.delete(slot);
    this.remoteInputs.clear();
    this._broadcast('pause', { matchId: this.matchId, slots: [...this.pausedSlots] });
    this._event('pause', [...this.pausedSlots]);
  }

  sendState(state) {
    if (this.isHost && this.phase === 'match') this._broadcast('state', { matchId: this.matchId, state }, true);
  }

  finish(state) {
    if (!this.isHost || this.phase !== 'match') return;
    this._broadcast('finish', { matchId: this.matchId, state });
    this.phase = 'lobby';
    this.pausedSlots.clear();
    this.remoteInputs.clear();
    this.players.forEach(player => { player.ready = false; });
    this._event('finish', validateOnlineState(state));
    this._publishLobby();
  }

  _send(connection, type, data, disposable = false) {
    if (!connection?.open) {
      if (disposable) return false;
      throw new Error('The peer connection is no longer open.');
    }
    const buffered = connection.dataChannel?.bufferedAmount || 0;
    if (disposable && buffered > 96000) return false;
    if (buffered > 2000000) throw new Error('The connection is too slow to keep the room synchronized.');
    connection.send(encodeOnlinePacket(type, data));
    return true;
  }

  _broadcast(type, data, disposable = false) {
    for (const info of [...this.connections.values()]) {
      if (info.slot < 0) continue;
      try { this._send(info.connection, type, data, disposable); }
      catch (error) { this._drop(info, error.message); }
    }
  }

  _reject(info, message) {
    this._send(info.connection, 'error', { message });
    this._later(() => this._drop(info, message), 150);
  }

  _drop(info, message) {
    if (!this.connections.has(info.connection.peer)) return;
    this.connections.delete(info.connection.peer);
    this._cancel(info.timeout);
    info.connection.close();
    if (info.slot < 0) {
      console.warn('Online connection rejected:', message);
      return;
    }
    this.players = this.players.filter(player => player.slot !== info.slot);
    this.remoteInputs.delete(info.slot);
    this.pausedSlots.delete(info.slot);
    if (this.phase === 'match') {
      this._broadcast('abort', { matchId: this.matchId, message: `${message} The round was canceled; ready up again.` });
      this.phase = 'lobby';
      this.pausedSlots.clear();
      this.players.forEach(player => { player.ready = false; });
      this._event('abort', `${message} The round was canceled; ready up again.`);
    }
    this._publishLobby();
  }

  _heartbeat() {
    clearInterval(this.heartbeat);
    this.heartbeat = setInterval(() => this._tickHeartbeat(), 1000);
  }

  _tickHeartbeat() {
    const now = performance.now();
    if (this.isHost) {
      for (const info of [...this.connections.values()]) {
        if (info.slot >= 0 && now - info.lastSeen > 8000) this._drop(info, 'A player stopped responding.');
      }
    } else {
      if (now - this.lastHostMessage > 8000) { this._fail('The host stopped responding. The room has closed.'); return; }
      try { this._send(this.hostConnection, 'ping', { at: now }); } catch (error) { this._fail(error.message); }
    }
  }

  _fail(message) {
    console.warn('Online room:', message);
    this.close();
    this._event('error', message);
  }

  close() {
    this.generation++;
    this.pendingOpenReject?.(new Error('Room connection canceled.'));
    this.pendingOpenReject = null;
    clearInterval(this.heartbeat);
    for (const timer of this.timers) clearTimeout(timer);
    this.timers.clear();
    for (const info of this.connections.values()) info.connection.close();
    this.connections.clear();
    this.hostConnection?.close();
    this.peer?.destroy();
    this.peer = null;
    this.hostConnection = null;
    this.players = [];
    this.phase = 'idle';
    this.slot = -1;
    this.pausedSlots.clear();
    this.remoteInputs.clear();
    this.matchId = 0;
    this.latency = 0;
  }
}
