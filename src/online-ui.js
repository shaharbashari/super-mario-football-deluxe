import { CHARACTERS, ARENAS, getCharacter, isCharUnlocked } from './config.js';
import { MatchSimulation } from './physics.js';
import { AIController } from './ai.js';
import { OnlineRoom } from './online.js';
import { ONLINE_DEFAULTS, ONLINE_INPUT_KEYS, ONLINE_EDGE_KEYS, onlineName, onlineInviteUrl, normalizeRoomCode, onlineSettings, OnlineStateEncoder, RemoteMatchView } from './online-state.js';

export class OnlineController {
  constructor(app) {
    this.app = app;
    this.room = new OnlineRoom({ onEvent: (type, data) => this._event(type, data) });
    this.inMatch = false;
    this.navigating = false;
    this.localPause = false;
    this.pendingInput = {};
    this.inputAge = 0;
    this.snapshotAge = 0;
    this.lastState = null;
    this.result = null;
    this.notice = '';
    this.readyPending = false;
    this._bind();
    window.addEventListener('pagehide', () => this.room.close());
    window.addEventListener('hashchange', () => this._readInvite());
    queueMicrotask(() => this._readInvite());
  }

  get activeMatch() { return this.inMatch; }
  get guestMatch() { return this.inMatch && !this.room.isHost; }
  _element(id) { return document.getElementById(id); }

  _readInvite() {
    const raw = new URLSearchParams(location.hash.slice(1)).get('room');
    if (raw === null) return;
    const code = normalizeRoomCode(raw);
    if (this.room.phase !== 'idle') {
      if (code !== this.room.code) this.app._pushToast('Another room invite', 'Leave your current room before joining a different one.', '🌐');
      return;
    }
    this.open();
    this._element('online-code-input').value = code || raw.slice(0, 12);
    this._element('online-code-input').focus();
    if (!code) this._status('This invite has an invalid room code. Enter a six-character code from your host.', true);
  }

  _status(message, error = false) {
    const status = this._element('online-status');
    status.textContent = message;
    status.classList.toggle('error', error);
    this._element('online-connect-actions').inert = this.room.phase === 'connecting';
    this._element('online-player-pick').inert = this.inMatch || this.room.phase === 'connecting';
    this._element('online-cancel').classList.toggle('hidden', this.room.phase !== 'connecting');
  }

  async _run(action) {
    this.notice = '';
    try { await action(); }
    catch (error) {
      console.warn('Online action:', error.message);
      this._status(error.message, true);
    }
  }

  _bind() {
    this._element('btn-mode-online').addEventListener('click', () => this.open());
    this._element('online-create').addEventListener('click', () => this._run(() => {
      if (typeof window.Peer !== 'function') throw new Error('The online library did not load. Refresh the game; offline modes remain available.');
      return this.room.create(this._pick(), {
        ...ONLINE_DEFAULTS, equippedBallSkin: this.app.settings.equippedBallSkin,
        equippedGoalExplosion: this.app.settings.equippedGoalExplosion,
      });
    }));
    this._element('online-join').addEventListener('click', () => this._run(() => {
      if (typeof window.Peer !== 'function') throw new Error('The online library did not load. Refresh the game; offline modes remain available.');
      return this.room.join(this._element('online-code-input').value, this._pick());
    }));
    this._element('online-code-input').addEventListener('keydown', event => {
      if (event.key === 'Enter' && this.room.phase === 'idle') {
        event.preventDefault();
        this._element('online-join').click();
      }
    });
    this._element('online-cancel').addEventListener('click', () => { this.room.close(); this._render(); this._status('Connection canceled.'); });
    this._element('online-leave').addEventListener('click', () => this.leave());
    this._element('online-copy').addEventListener('click', () => this._run(async () => {
      const link = onlineInviteUrl(location.href, this.room.code);
      try {
        await navigator.clipboard.writeText(link);
        this._status('Invite link copied. Your friend can also enter the room code.');
      } catch (error) {
        console.info('Clipboard unavailable:', error.message);
        this._status(`Clipboard unavailable. Share room code ${this.room.code} manually.`);
      }
    }));
    this._element('online-ready').addEventListener('click', () => this._run(async () => {
      const player = this.room.players.find(player => player.slot === this.room.slot);
      if (!player || this.readyPending) return;
      if (!player.ready) {
        const generation = this.room.generation;
        this.readyPending = true;
        this._element('online-ready').disabled = true;
        try {
          const deadline = performance.now() + 15000;
          while (this.room.players.some(member => !this.app.art._getCharSheet(getCharacter(member.charId, member.kitIdx)))) {
            if (generation !== this.room.generation) return;
            if (performance.now() > deadline || this.room.players.some(member => this.app.art.failedAssets.includes(`char_${member.charId}`))) {
              throw new Error('Striker artwork could not load. Check your connection and refresh before playing.');
            }
            this._status('Loading striker artwork before readying up…');
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          if (generation !== this.room.generation) return;
        } finally {
          this.readyPending = false;
          this._element('online-ready').disabled = false;
        }
      }
      this.room.setReady(!player.ready);
    }));
    this._element('online-start').addEventListener('click', () => this._run(() => this.room.start()));
    this._element('online-char').replaceChildren(...CHARACTERS.map(character => {
      const option = document.createElement('option');
      option.value = character.id;
      option.textContent = character.name;
      option.disabled = !isCharUnlocked(this.app.save, character.id);
      return option;
    }));
    this._element('online-arena').replaceChildren(...ARENAS.filter(arena => !arena.isRandom).map(arena => {
      const option = document.createElement('option');
      option.value = arena.id;
      option.textContent = arena.name;
      return option;
    }));
    for (const id of ['online-name', 'online-char', 'online-kit']) {
      this._element(id).addEventListener('change', () => this._run(() => {
        if (id === 'online-char') this._updateKits();
        if (this.room.active) this.room.setPick(this._pick());
      }));
    }
    for (const id of ['online-format', 'online-arena', 'online-duration', 'online-score', 'online-items', 'online-hazards', 'online-hyper']) {
      this._element(id).addEventListener('change', () => this._run(() => this.room.setConfig({
        ...this.room.config,
        mode: this._element('online-format').value,
        arenaId: this._element('online-arena').value,
        matchDuration: Number(this._element('online-duration').value),
        scoreLimit: Number(this._element('online-score').value),
        itemMode: this._element('online-items').value,
        stageHazards: this._element('online-hazards').checked,
        hyperStrikes: this._element('online-hyper').checked,
      })));
    }
    this._updateKits();
  }

  _updateKits() {
    const character = getCharacter(this._element('online-char').value);
    const previous = this._element('online-kit').value || '0';
    this._element('online-kit').replaceChildren(...character.kits.map((kit, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = kit.name;
      return option;
    }));
    this._element('online-kit').value = previous;
  }

  _pick() {
    return {
      name: onlineName(this._element('online-name').value),
      charId: this._element('online-char').value,
      kitIdx: Number(this._element('online-kit').value),
    };
  }

  open() {
    this._render();
    this.app._openModal('modal-online');
    if (this.room.phase === 'idle') {
      this._status('Create a room, or enter a friend’s six-character code. Each device controls one striker.');
      this._element('online-create').focus();
    } else this._element('online-ready').focus();
  }

  _render() {
    const active = this.room.active;
    this._element('online-entry').classList.toggle('hidden', active);
    this._element('online-lobby').classList.toggle('hidden', !active);
    this._element('online-player-pick').inert = this.inMatch || this.room.phase === 'connecting';
    for (const option of this._element('online-char').options) option.disabled = !isCharUnlocked(this.app.save, option.value);
    if (!active) return;
    this._element('online-room-code').textContent = this.room.code;
    this._element('online-slot-label').textContent = `YOU ARE P${this.room.slot + 1} · ${this.room.isHost ? 'HOST' : 'GUEST'} · USE YOUR P1 CONTROLS`;
    const players = this._element('online-players');
    players.replaceChildren();
    for (let slot = 0; slot < this.room.capacity; slot++) {
      const member = this.room.players.find(player => player.slot === slot);
      const card = document.createElement('div');
      card.className = `online-player ${slot % 2 ? 'away' : 'home'}`;
      const title = document.createElement('strong');
      title.textContent = member ? `P${slot + 1} · ${member.name}${slot === 0 ? ' (Host)' : ''}`
        : `P${slot + 1} · ${this.room.capacity === 4 ? 'CPU if empty' : 'Waiting for a player'}`;
      const detail = document.createElement('span');
      detail.textContent = member ? `${getCharacter(member.charId).name} · ${member.ready ? 'READY' : 'Not ready'}` : 'Open slot · share the room code';
      const team = document.createElement('small');
      team.textContent = `TEAM ${slot % 2 + 1}`;
      card.append(title, detail, team);
      players.append(card);
      if (member) this.app.art._getCharSheet(getCharacter(member.charId, member.kitIdx));
    }
    const own = this.room.players.find(player => player.slot === this.room.slot);
    this._element('online-ready').textContent = own?.ready ? 'NOT READY' : 'READY';
    this._element('online-ready').setAttribute('aria-pressed', String(Boolean(own?.ready)));
    this._element('online-ready').disabled = this.readyPending;
    this._element('online-start').classList.toggle('hidden', !this.room.isHost);
    this._element('online-start').disabled = !this.room.canStart;
    this._element('online-rules').disabled = !this.room.isHost;
    const config = this.room.config;
    for (const [id, value] of Object.entries({
      'online-format': config.mode, 'online-arena': config.arenaId,
      'online-duration': config.matchDuration, 'online-score': config.scoreLimit, 'online-items': config.itemMode,
    })) this._element(id).value = String(value);
    this._element('online-hazards').checked = config.stageHazards;
    this._element('online-hyper').checked = config.hyperStrikes;
    const result = this._element('online-result');
    result.classList.toggle('hidden', !this.result);
    if (this.result) result.textContent = `TEAM ${this.result.scores[0] > this.result.scores[1] ? 1 : 2} WINS · ${this.result.scores[0]} — ${this.result.scores[1]} · Ready up for a rematch.`;
    if (this.room.phase === 'lobby') this._status(this.room.canStart ? 'Everyone is ready. The host can kick off.' : 'At least two players must be ready. Empty 2v2 slots use CPU teammates.');
    if (this.notice) this._status(this.notice, true);
  }

  _event(type, data) {
    if (type === 'status') this._status(data);
    else if (type === 'lobby') this._render();
    else if (type === 'start') this._start(data);
    else if (type === 'state') {
      if (!this.guestMatch) return;
      if (this.remote.receive(data)) {
        this._remoteSounds(this.lastState, data);
        this.lastState = data;
      }
    } else if (type === 'pause') this._applyPause();
    else if (type === 'finish') this._finish(data);
    else if (type === 'abort') {
      this.notice = data;
      this._stopMatch();
      this.app._openModal('modal-online');
      this._status(data, true);
    } else if (type === 'error') {
      this.leave();
      this.open();
      this._status(data, true);
    } else if (type === 'latency') this._updateBadge();
  }

  _start({ config, players }) {
    const app = this.app;
    this.inMatch = true;
    this.navigating = true;
    this.localPause = false;
    this.result = null;
    this.notice = '';
    this.lastState = null;
    this.pendingInput = {};
    this.inputAge = this.snapshotAge = 0;
    app.match?.dispose();
    app.practice = null;
    app.selectedMode = 'online';
    app.ai = new AIController();
    const settings = { ...onlineSettings(config, app.settings), reducedMotion: app.reducedMotion };
    if (this.room.isHost) {
      this.encoder = new OnlineStateEncoder();
      const playersConfig = Array.from({ length: this.room.capacity }, (_, slot) => {
        const member = players.find(player => player.slot === slot);
        return {
          slot, controlSlot: slot, team: slot % 2, tag: member ? `P${slot + 1}` : `CPU${slot + 1}`,
          isAI: !member, charId: member?.charId || CHARACTERS[(slot + 1) % 6].id,
          kitIdx: member?.kitIdx || 0, role: slot >= 2 ? 'defender' : 'striker',
        };
      });
      app.match = new MatchSimulation({
        mode: 'online', arenaId: config.arenaId, playersConfig, settings, audio: app.audio,
        introTitle: 'ONLINE FRIENDLY · P1 CONTROLS ON EACH DEVICE',
        onGoal: () => app._syncHUD(),
        onMatchEnd: () => { if (this.inMatch && this.room.isHost) this.room.finish(this.encoder.capture(app.match)); },
      });
      app.match.leftTeamColor = '#fb818a';
      app.match.rightTeamColor = '#84e2bb';
      for (const player of app.match.players) player.teamColor = player.team === 0 ? app.match.leftTeamColor : app.match.rightTeamColor;
    } else {
      this.remote = new RemoteMatchView(config, settings);
      app.match = this.remote;
    }
    app._showScreen('match');
    this.navigating = false;
    this._element('controls-toast').classList.remove('hidden');
    this._element('controls-toast').style.opacity = '1';
    app.toastFadeTimer = 12;
    const teamName = team => players.filter(player => player.slot % 2 === team).map(player => player.name).join(' + ') || `TEAM ${team + 1}`;
    this._element('hud-left-name').textContent = teamName(0);
    this._element('hud-right-name').textContent = teamName(1);
    this._element('hud-left-sub').textContent = config.mode === 'duel' ? 'P1 · LEFT GOAL' : 'P1 + P3 · LEFT GOAL';
    this._element('hud-right-sub').textContent = config.mode === 'duel' ? 'P2 · RIGHT GOAL' : 'P2 + P4 · RIGHT GOAL';
    this._element('hud-mode-tag').textContent = config.mode === 'duel' ? 'ONLINE 1V1' : 'ONLINE 2V2';
    this._element('hud-hype-row').classList.toggle('hidden', !config.hyperStrikes);
    this._element('hype-box-1').style.visibility = 'visible';
    this._element('btn-pause-restart').classList.add('hidden');
    app._syncHUD();
    this._updateBadge();
    if (document.hidden) app.togglePause(true);
  }

  _stopMatch() {
    this.inMatch = false;
    this.localPause = false;
    this.app.match?.dispose();
    this.app.pendingInputs.clear();
    this.pendingInput = {};
    this.app._closeAllModals();
    this.app.paused = true;
    this.app.audio.setPaused(true);
    this._element('online-pause-notice').classList.add('hidden');
    this._element('btn-pause-restart').classList.remove('hidden');
  }

  _finish(state) {
    this.result = { scores: state.scores };
    if (this.remote) { this.remote.receive(state); this.remote.update(0.05); }
    this.app._syncHUD();
    this._stopMatch();
    this.app._openModal('modal-online');
    this._render();
  }

  leave(showMenu = true) {
    this.navigating = true;
    this.room.close();
    this._stopMatch();
    this.result = null;
    this.remote = null;
    this.encoder = null;
    this._element('online-match-badge').classList.add('hidden');
    if (showMenu) this.app._showScreen('menu');
    this.navigating = false;
    this._render();
  }

  syncPauseFromUi() {
    if (!this.inMatch || this.navigating) return;
    const paused = this.app.modalStack.length > 0 || document.hidden;
    if (paused !== this.localPause) {
      this.localPause = paused;
      this.room.requestPause(paused);
    }
    this.app.paused = this.localPause || this.room.paused;
  }

  _applyPause() {
    if (!this.inMatch) return;
    this.app.paused = this.localPause || this.room.paused;
    this.app.pendingInputs.clear();
    this.pendingInput = {};
    this.app.input.clearAll();
    this.app.accumulator = 0;
    this.app.input.gameplayActive = !this.app.paused;
    this.app.touch.updateVisibility();
    this.app.audio.setPaused(this.app.paused);
    const notice = this._element('online-pause-notice');
    notice.classList.toggle('hidden', !this.app.paused);
    notice.textContent = this.app.paused ? `PAUSED · ${[...this.room.pausedSlots].map(slot => `P${slot + 1}`).join(', ') || 'YOU'} · Each player resumes from their pause menu` : '';
  }

  inputFor(player) {
    return player.slot === this.room.slot ? this.app.input.getPlayerInput(0) : this.room.takeInput(player.slot);
  }

  beforeFrame(dt) {
    if (!this.inMatch) return;
    if (this.guestMatch) {
      this.remote.update(dt);
      this.app._syncHUD();
      const current = this.app.paused ? {} : this.app.input.getPlayerInput(0);
      for (const key of ONLINE_INPUT_KEYS) {
        this.pendingInput[key] = ONLINE_EDGE_KEYS.includes(key)
          ? Boolean(this.pendingInput[key] || current[key]) : Boolean(current[key]);
      }
      this.inputAge += dt;
      if (this.inputAge >= 1 / 30) {
        this.inputAge %= 1 / 30;
        try { this.room.sendInput(this.pendingInput); }
        catch (error) { this.room._fail(error.message); return; }
        for (const key of ONLINE_EDGE_KEYS) this.pendingInput[key] = false;
      }
    }
  }

  afterFrame(dt) {
    if (!this.inMatch || !this.room.isHost) return;
    this.snapshotAge += dt;
    if (this.snapshotAge >= 0.05) {
      this.snapshotAge %= 0.05;
      try { this.room.sendState(this.encoder.capture(this.app.match)); }
      catch (error) { this.room._fail(error.message); }
    }
  }

  _updateBadge() {
    const badge = this._element('online-match-badge');
    badge.classList.toggle('hidden', !this.inMatch);
    badge.textContent = `ONLINE · P${this.room.slot + 1} · ${this.room.isHost ? 'HOST' : `${this.room.latency} ms`}`;
  }

  _remoteSounds(previous, state) {
    if (!previous) return;
    const audio = this.app.audio;
    if (state.scores.some((score, team) => score > previous.scores[team])) audio.playGoal();
    if (state.phase === 'playing' && previous.phase === 'countdown') audio.playCountdownTick(true);
    if (state.phase === 'countdown' && state.bannerText !== previous.bannerText) audio.playCountdownTick(false);
    if (state.phase === 'sudden_death_intro' && previous.phase !== state.phase) audio.playSuddenDeath();
    for (const player of state.players) {
      const old = previous.players.find(other => other.slot === player.slot);
      if (!old) continue;
      if (player.stats.jumps > old.stats.jumps) audio.playJump(player.char);
      if (player.stats.touches > old.stats.touches) audio.playBallKick(player.kickPowerRatio, player.kickPowerRatio > 0.78);
      if (player.stats.parries > old.stats.parries) audio.playParry();
      if (player.stats.dashes > old.stats.dashes) audio.playDash();
      if (player.stats.itemsUsed > old.stats.itemsUsed && old.heldItem) audio.playItemUse(old.heldItem);
    }
  }
}
