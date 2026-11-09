import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { MatchSimulation } from '../src/physics.js';
import { AIController } from '../src/ai.js';
import { ARENAS, ITEMS, DEFAULT_SETTINGS } from '../src/config.js';
import { OnlineRoom } from '../src/online.js';
import {
  ONLINE_DEFAULTS, ONLINE_INPUT_KEYS, normalizeRoomCode, onlineName, onlineInviteUrl, validateRoomConfig,
  validateOnlineInput, encodeOnlinePacket, decodeOnlinePacket, OnlineStateEncoder,
  validateOnlineState, RemoteMatchView,
} from '../src/online-state.js';

const settle = () => new Promise(resolve => setImmediate(resolve));
const pick = (name = 'Player', charId = 'mario') => ({ name, charId, kitIdx: 0 });
const input = values => Object.fromEntries(ONLINE_INPUT_KEYS.map(key => [key, Boolean(values?.[key])]));

function fakePeers() {
  const peers = new Map();
  let serial = 0;
  class Connection extends EventEmitter {
    constructor(peer, metadata) {
      super(); this.peer = peer; this.metadata = metadata; this.open = false;
      this.dataChannel = { bufferedAmount: 0 };
    }
    send(data) {
      if (!this.open) throw new Error('Closed fake connection');
      queueMicrotask(() => { if (this.other.open) this.other.emit('data', data); });
    }
    close() {
      if (this.closed) return;
      this.closed = true; this.open = false;
      this.emit('close');
      this.other?.close();
    }
  }
  class Peer extends EventEmitter {
    constructor(id) {
      super(); this.id = id || `guest-${++serial}`; this.connections = [];
      peers.set(this.id, this);
      queueMicrotask(() => { if (!this.destroyed) this.emit('open', this.id); });
    }
    connect(id, options) {
      const target = peers.get(id);
      if (!target) {
        queueMicrotask(() => this.emit('error', { type: 'peer-unavailable' }));
        return new Connection(id, options.metadata);
      }
      const ours = new Connection(id, options.metadata);
      const theirs = new Connection(this.id, options.metadata);
      ours.other = theirs; theirs.other = ours;
      this.connections.push(ours); target.connections.push(theirs);
      queueMicrotask(() => {
        target.emit('connection', theirs);
        ours.open = theirs.open = true;
        theirs.emit('open'); ours.emit('open');
      });
      return ours;
    }
    destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      peers.delete(this.id);
      this.connections.forEach(connection => connection.close());
      this.emit('close');
    }
  }
  return (id, options) => new Peer(id, options);
}

async function roomPair() {
  const peerFactory = fakePeers();
  const events = [];
  const host = new OnlineRoom({ peerFactory, onEvent: (type, data) => events.push(['host', type, data]) });
  const guest = new OnlineRoom({ peerFactory, onEvent: (type, data) => events.push(['guest', type, data]) });
  await host.create(pick('Host'));
  await guest.join(host.code.toLowerCase(), pick('Guest', 'luigi'));
  await settle();
  return { host, guest, events, peerFactory };
}

test('room codes, rules and input frames reject malformed values', () => {
  assert.equal(normalizeRoomCode('ab-cd 23'), 'ABCD23');
  assert.equal(normalizeRoomCode('<script>'), null);
  assert.equal(normalizeRoomCode('ABC012'), null);
  assert.equal(onlineName('\u202eHost\u0000'), 'Host');
  assert.throws(() => validateRoomConfig({ ...ONLINE_DEFAULTS, arenaId: '__proto__' }));
  assert.throws(() => validateOnlineInput({ ...input(), kickPressed: 'true' }));
  assert.throws(() => decodeOnlinePacket('x'.repeat(60001)));
  assert.throws(() => decodeOnlinePacket('{"v":99,"type":"hello","data":{}}'));
  assert.throws(() => decodeOnlinePacket('{broken'));
});

test('invite links never expose local paths, credentials or query parameters', () => {
  assert.equal(onlineInviteUrl('file:///C:/Users/Example/private/index.html', 'abcd23'),
    'https://shaharbashari.github.io/super-mario-football-deluxe/#room=ABCD23');
  assert.equal(onlineInviteUrl('http://127.0.0.1:8766/', 'ABCD23'),
    'https://shaharbashari.github.io/super-mario-football-deluxe/#room=ABCD23');
  assert.equal(onlineInviteUrl('https://name:password@example.com/game/?token=private#old', 'ABCD23'),
    'https://example.com/game/#room=ABCD23');
});

test('snapshots cover every stage and item without cycles or oversized packets', () => {
  for (const arena of ARENAS.filter(arena => !arena.isRandom)) {
    const match = new MatchSimulation({
      mode: 'online', arenaId: arena.id, settings: { ...DEFAULT_SETTINGS, hitstop: false },
      playersConfig: [{ slot: 0, charId: 'mario', team: 0 }, { slot: 1, charId: 'luigi', team: 1 }],
      isAttract: true,
    });
    const encoder = new OnlineStateEncoder(), ai = new AIController();
    for (const item of ITEMS) {
      match.players[0].heldItem = item.id;
      match._activatePlayerItem(match.players[0]);
      for (let frame = 0; frame < 5; frame++) match.update(1 / 120, match.players.map(player => ai.computeInput(player, match, 1 / 120)));
      const raw = encodeOnlinePacket('state', { matchId: 1, state: encoder.capture(match) });
      assert.ok(raw.length < 60000, `${arena.id}/${item.id}`);
      const state = validateOnlineState(decodeOnlinePacket(raw).data.state);
      assert.deepEqual(state.scores, match.scores);
      assert.equal(state.players[0].char.id, 'mario');
      const view = new RemoteMatchView({ ...ONLINE_DEFAULTS, arenaId: arena.id }, DEFAULT_SETTINGS);
      assert.equal(view.receive(state), true);
      view.update(0.05);
      assert.equal(view.players[0].x, state.players[0].x);
      assert.equal(view.receive(state), false, 'duplicate state must be ignored');
      assert.equal(view.settings.activeMutators.length, 0);
    }
    match.dispose();
  }
});

test('snapshot validation preserves items but rejects unsafe geometry and unknown characters', () => {
  const match = new MatchSimulation({
    mode: 'online', arenaId: 'meadow', settings: DEFAULT_SETTINGS,
    playersConfig: [{ charId: 'mario', team: 0 }, { charId: 'luigi', team: 1 }],
  });
  match.players[0].heldItem = 'SuperStar';
  const valid = new OnlineStateEncoder().capture(match);
  assert.equal(validateOnlineState(valid).players[0].heldItem, 'SuperStar');
  const badRadius = structuredClone(valid);
  badRadius.balls[0].radius = -2;
  assert.throws(() => validateOnlineState(badRadius), /radius/);
  const badPosition = structuredClone(valid);
  delete badPosition.players[0].x;
  assert.throws(() => validateOnlineState(badPosition), /position/);
  const badCharacter = structuredClone(valid);
  badCharacter.players[0].charId = '<img>';
  assert.throws(() => validateOnlineState(badCharacter), /character/);
  match.dispose();
});

test('room membership, ready gating and host-only rules synchronize', async () => {
  const { host, guest } = await roomPair();
  try {
    assert.equal(guest.slot, 1);
    assert.equal(host.players.length, 2);
    assert.equal(guest.players.length, 2);
    assert.throws(() => host.start(), /ready/);
    assert.throws(() => guest.setConfig(ONLINE_DEFAULTS), /host/);
    host.setReady(true); guest.setReady(true); await settle();
    assert.equal(host.canStart, true);
    host.setConfig({ ...ONLINE_DEFAULTS, arenaId: 'castle' }); await settle();
    assert.equal(guest.config.arenaId, 'castle');
    assert.ok(host.players.every(player => !player.ready));
    guest.setPick(pick('Changed', 'peach')); await settle();
    assert.equal(host.players[1].charId, 'peach');
    host.setReady(true); guest.setReady(true); await settle();
    host.start(); await settle();
    assert.equal(guest.phase, 'match');
    assert.equal(guest.matchId, host.matchId);
  } finally { host.close(); guest.close(); }
});

test('remote inputs are slot-owned, edge-buffered, sequenced and expire safely', async () => {
  const { host, guest } = await roomPair();
  try {
    host.setReady(true); guest.setReady(true); await settle(); host.start(); await settle();
    guest.sendInput(input({ right: true, jumpPressed: true })); await settle();
    assert.equal(host.takeInput(1).jumpPressed, true);
    assert.equal(host.takeInput(1).jumpPressed, false);
    assert.equal(host.takeInput(1).right, true);
    const info = [...host.connections.values()][0];
    host._hostPacket(info, { type: 'input', data: { matchId: host.matchId, sequence: 0, input: input({ left: true }) } });
    assert.equal(host.takeInput(1).right, true, 'stale input must not overwrite held state');
    host.remoteInputs.get(1).at -= 401;
    assert.deepEqual(host.takeInput(1), {});
    assert.deepEqual(host.takeInput(0), {});
  } finally { host.close(); guest.close(); }
});

test('a full 1v1 room rejects an extra guest without disturbing its players', async () => {
  const { host, guest, peerFactory } = await roomPair();
  const errors = [];
  const extra = new OnlineRoom({ peerFactory, onEvent: (type, message) => { if (type === 'error') errors.push(message); } });
  try {
    await extra.join(host.code, pick('Extra')); await settle();
    assert.equal(host.players.length, 2);
    assert.equal(extra.phase, 'idle');
    assert.match(errors[0], /full/);
  } finally { extra.close(); host.close(); guest.close(); }
});

test('each player must clear their own pause, and disconnects cancel the round', async () => {
  const { host, guest, events } = await roomPair();
  try {
    host.setReady(true); guest.setReady(true); await settle(); host.start(); await settle();
    host.requestPause(true); guest.requestPause(true); await settle();
    assert.equal(host.pausedSlots.size, 2);
    guest.requestPause(false); await settle();
    assert.equal(host.paused, true);
    host.requestPause(false); await settle();
    assert.equal(guest.paused, false);
    guest.close(); await settle();
    assert.equal(host.phase, 'lobby');
    assert.equal(host.players.length, 1);
    assert.ok(events.some(([owner, event]) => owner === 'host' && event === 'abort'));
  } finally { host.close(); guest.close(); }
});

test('guests cannot send authoritative snapshots', async () => {
  const { host, guest } = await roomPair();
  try {
    guest.hostConnection.send(encodeOnlinePacket('state', { state: {} }));
    await settle();
    assert.equal(host.players.length, 1);
    assert.equal(guest.phase, 'idle');
  } finally { host.close(); guest.close(); }
});

test('oversized guest control packets are rejected before room state is changed', async () => {
  const { host, guest } = await roomPair();
  try {
    guest.hostConnection.send(encodeOnlinePacket('ready', { ready: true, extra: 'x'.repeat(3000) }));
    await settle();
    assert.equal(host.players.length, 1);
    assert.equal(guest.phase, 'idle');
  } finally { host.close(); guest.close(); }
});

test('a crashed peer cancels the round after eight seconds without heartbeat', async () => {
  const { host, guest } = await roomPair();
  try {
    host.setReady(true); guest.setReady(true); await settle(); host.start(); await settle();
    [...host.connections.values()][0].lastSeen = performance.now() - 8001;
    host._tickHeartbeat();
    assert.equal(host.phase, 'lobby');
    assert.equal(host.players.length, 1);
  } finally { host.close(); guest.close(); }
});

test('canceling an unopened connection settles the operation and destroys its peer', async () => {
  const peer = new EventEmitter();
  peer.destroy = () => { peer.destroyed = true; };
  const room = new OnlineRoom({ peerFactory: () => peer });
  const creating = room.create(pick());
  room.close();
  await creating;
  assert.equal(room.phase, 'idle');
  assert.equal(peer.destroyed, true);
});
