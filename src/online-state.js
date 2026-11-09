import { CHARACTERS, ARENAS, ITEMS, DEFAULT_SETTINGS, BALL_SKINS, GOAL_EXPLOSIONS, getCharacter, getArena } from './config.js';

export const ONLINE_VERSION = 1;
export const ONLINE_PREFIX = 'smfd-room-v1-';
export const ROOM_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const ONLINE_INPUT_KEYS = ['left', 'right', 'up', 'down', 'jumpHeld', 'kickDown', 'lobDown',
  'upPressed', 'downPressed', 'downReleased', 'jumpPressed', 'jumpReleased', 'kickPressed',
  'kickReleased', 'lobPressed', 'dashPressed', 'itemPressed'];
export const ONLINE_EDGE_KEYS = ONLINE_INPUT_KEYS.filter(key => key.endsWith('Pressed') || key.endsWith('Released'));
export const ONLINE_DEFAULTS = {
  mode: 'duel', arenaId: 'meadow', matchDuration: 120, scoreLimit: 5,
  itemMode: 'standard', stageHazards: true, hyperStrikes: true,
  equippedBallSkin: 'classic', equippedGoalExplosion: 'confetti',
};
const MAX_PACKET_LENGTH = 60000;
const PLAYER_STATS = 'goals powerShots saves parries hyperStrikes comboPasses itemsUsed kos meteorSpikes wallJumps meteorGoals lavaTouches jumps touches dashes ownGoals';
const schemas = {
  player: ['slot team bossScale x y vx vy halfW halfH visualScale squashX squashY shadowY animPhase runPhase strideBounce animLean spinAngle groundPoundTimer kickTimer kickDuration kickPowerRatio chargeTime stunTimer invulnTimer starTimer magnetTimer parryFlashTimer dashTimer jumpsLeft hoverFuel', 'onGround bigHead isClone isHovering hyperReady isHyperSwing fastFalling isAI', 'tag kickType animState groundPoundState heldItem teamColor'],
  ball: ['id x y vx vy angle angVel spin radius baseRadius targetScale squashX squashY lastKickTime lastTeam freezeTimer burnTimer vanishTimer zeroGTimer scaleTimer', 'hyperActive comboBoosted hyperVoltage', 'auraColor hyperStyle'],
  courier: ['x y vx vy bubbleX bubbleY', 'active', 'heldItemId'],
  shell: ['x y vx vy radius timer ownerTeam', '', ''],
  banana: ['x y vx vy timer ownerTeam', '', ''],
  torpedo: ['x y vx warnTimer ownerTeam', '', ''],
  keeper: ['x y baseY timer maxTimer recoilTimer', '', 'side color'],
  hound: ['anchorX anchorY x y vx vy radius chainLen lungeTimer timer ownerTeam', '', ''],
  particle: ['x y vx vy size life maxLife rot rotVel gravity', '', 'shape color text'],
  shockwave: ['x y radius maxRadius lineWidth alpha', '', 'color'],
  portal: ['x y', '', 'side'],
  drum: ['x y w bounceTimer', '', ''],
  icicle: ['x y vy timer', 'active', 'state'],
  vent: ['x timer', '', 'state'],
  ring: ['x y r flashTimer', '', ''],
  bumper: ['x y r flashTimer', '', ''],
};
const collections = {
  players: ['player', 8], balls: ['ball', 16], shells: ['shell', 12], bananas: ['banana', 24],
  torpedoes: ['torpedo', 24], keepers: ['keeper', 2], hounds: ['hound', 8],
  particles: ['particle', 24], shockwaves: ['shockwave', 8],
  portals: ['portal', 2], drumPads: ['drum', 2], icicles: ['icicle', 3],
  lavaVents: ['vent', 2], bumpers: ['bumper', 3],
};
const topSchema = ['time phaseTimer timeRemaining bannerTimer netRippleLeft netRippleRight powLeftTimer powRightTimer shakeMag shakeX shakeY cameraZoom cameraFocusX cameraFocusY', 'unlimitedTime suddenDeath', 'phase bannerText bannerSub bannerColor leftTeamColor rightTeamColor'];
const numeric = value => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 1e7;
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const assertOnline = (condition, message) => { if (!condition) throw new Error(`Invalid online data: ${message}`); };
const words = text => text ? text.split(' ') : [];

export function normalizeRoomCode(value) {
  const code = String(value ?? '').toUpperCase().replace(/[\s-]/g, '');
  return code.length === 6 && [...code].every(char => ROOM_ALPHABET.includes(char)) ? code : null;
}

export function createRoomCode() {
  return [...crypto.getRandomValues(new Uint8Array(6))].map(byte => ROOM_ALPHABET[byte & 31]).join('');
}

export function onlineInviteUrl(pageUrl, roomCode) {
  const code = normalizeRoomCode(roomCode);
  assertOnline(code, 'invite code');
  let url = new URL(pageUrl);
  // Local paths and development addresses must not leak into invitations.
  if (url.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    url = new URL('https://shaharbashari.github.io/super-mario-football-deluxe/');
  }
  url.username = '';
  url.password = '';
  url.search = '';
  url.hash = `room=${code}`;
  return url.href;
}

export function onlineName(value) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, '').trim().slice(0, 20) || 'Player';
}

export function validatePick(value) {
  assertOnline(record(value) && typeof value.name === 'string' && value.name.length <= 20, 'player name');
  assertOnline(CHARACTERS.some(character => character.id === value.charId), 'striker');
  assertOnline(Number.isInteger(value.kitIdx) && value.kitIdx >= 0 && value.kitIdx <= 2, 'kit');
  return { name: onlineName(value.name), charId: value.charId, kitIdx: value.kitIdx };
}

export function validateRoomConfig(value) {
  assertOnline(record(value), 'room rules');
  const choices = {
    mode: ['duel', 'doubles'], arenaId: ARENAS.filter(arena => !arena.isRandom).map(arena => arena.id),
    matchDuration: [60, 120, 180], scoreLimit: [0, 3, 5, 7],
    itemMode: ['standard', 'competitive', 'off'],
    equippedBallSkin: BALL_SKINS.map(skin => skin.id), equippedGoalExplosion: GOAL_EXPLOSIONS.map(effect => effect.id),
  };
  const result = {};
  for (const [key, values] of Object.entries(choices)) {
    assertOnline(values.includes(value[key]), key);
    result[key] = value[key];
  }
  for (const key of ['stageHazards', 'hyperStrikes']) {
    assertOnline(typeof value[key] === 'boolean', key);
    result[key] = value[key];
  }
  return result;
}

export function onlineSettings(config, local = DEFAULT_SETTINGS) {
  return { ...local, ...config, activeMutators: [], ballPreset: 'balanced', aiDifficulty: 'striker', suddenDeathMode: 'golden' };
}

export function validateLobby(value) {
  assertOnline(record(value) && normalizeRoomCode(value.code), 'room code');
  const config = validateRoomConfig(value.config);
  assertOnline(['lobby', 'match'].includes(value.phase), 'room phase');
  assertOnline(Array.isArray(value.players) && value.players.length >= 1 && value.players.length <= (config.mode === 'duel' ? 2 : 4), 'room capacity');
  const slots = new Set();
  const players = value.players.map(player => {
    const pick = validatePick(player);
    assertOnline(Number.isInteger(player.slot) && player.slot >= 0 && player.slot < (config.mode === 'duel' ? 2 : 4) && !slots.has(player.slot), 'player slot');
    assertOnline(typeof player.ready === 'boolean', 'ready status');
    slots.add(player.slot);
    return { ...pick, slot: player.slot, ready: player.ready };
  });
  assertOnline(slots.has(0), 'room host');
  return { code: value.code, config, players, phase: value.phase };
}

export function validateOnlineInput(value) {
  assertOnline(record(value), 'input frame');
  const input = {};
  for (const key of ONLINE_INPUT_KEYS) {
    assertOnline(typeof value[key] === 'boolean', `input ${key}`);
    input[key] = value[key];
  }
  return input;
}

export function encodeOnlinePacket(type, data) {
  const raw = JSON.stringify({ v: ONLINE_VERSION, type, data });
  assertOnline(raw.length <= MAX_PACKET_LENGTH, 'packet too large');
  return raw;
}

export function decodeOnlinePacket(raw) {
  assertOnline(typeof raw === 'string' && raw.length <= MAX_PACKET_LENGTH, 'packet size/type');
  let packet;
  try { packet = JSON.parse(raw); } catch { throw new Error('Invalid online data: malformed JSON'); }
  assertOnline(record(packet) && packet.v === ONLINE_VERSION && typeof packet.type === 'string' && record(packet.data), 'protocol version/envelope');
  return packet;
}

function primitives(source, schema) {
  assertOnline(record(source), 'entity');
  const result = {};
  for (const key of words(schema[0])) {
    if (source[key] === undefined) continue;
    assertOnline(numeric(source[key]), key);
    if (['radius', 'r', 'halfW', 'halfH', 'visualScale', 'size', 'maxLife', 'maxTimer', 'maxRadius', 'lineWidth', 'cameraZoom'].includes(key)) {
      assertOnline(source[key] > 0 && source[key] < 10000, key);
    }
    result[key] = Math.round(source[key] * 1000) / 1000;
  }
  for (const key of words(schema[1])) {
    if (source[key] === undefined) continue;
    assertOnline(typeof source[key] === 'boolean', key);
    result[key] = source[key];
  }
  for (const key of words(schema[2])) {
    if (source[key] == null) continue;
    assertOnline(typeof source[key] === 'string' && source[key].length <= 128, key);
    if (/color$/i.test(key)) assertOnline(/^#[0-9a-f]{6}$/i.test(source[key]), key);
    if (key === 'heldItemId' || key === 'heldItem') assertOnline(ITEMS.some(item => item.id === source[key]), key);
    result[key] = source[key];
  }
  return result;
}

function entityState(source, kind) {
  const result = primitives(source, schemas[kind]);
  assertOnline(numeric(source.netId), 'entity identity');
  result.netId = source.netId;
  for (const coordinate of ['x', 'y']) {
    if (words(schemas[kind][0]).includes(coordinate)) assertOnline(numeric(result[coordinate]), 'entity position');
  }
  if (kind === 'player') {
    assertOnline(CHARACTERS.some(character => character.id === source.charId), 'player character');
    assertOnline(Number.isInteger(source.kitIdx) && source.kitIdx >= 0 && source.kitIdx < 3, 'player kit');
    assertOnline(Number.isInteger(result.slot) && result.slot >= 0 && (result.team === 0 || result.team === 1), 'player identity/team');
    assertOnline(numeric(result.halfW) && numeric(result.halfH) && numeric(result.visualScale), 'player geometry');
    result.charId = source.charId;
    result.kitIdx = source.kitIdx;
    result.stats = primitives(source.stats, [PLAYER_STATS, '', '']);
    result.dashGhosts = boundedPoints(source.dashGhosts, 8, 'x y alpha');
  } else if (kind === 'ball') {
    assertOnline(numeric(result.radius) && numeric(result.x) && numeric(result.y), 'ball geometry');
    result.trail = boundedPoints(source.trail, 10, 'x y');
  }
  return result;
}

function boundedPoints(source, limit, fields) {
  assertOnline(Array.isArray(source) && source.length <= limit, 'effect points');
  return source.map(point => primitives(point, [fields, '', '']));
}

export class OnlineStateEncoder {
  constructor() { this.ids = new WeakMap(); this.nextId = 1; this.sequence = 0; }

  entity(source, kind) {
    if (!this.ids.has(source)) this.ids.set(source, this.nextId++);
    const value = { ...source, netId: this.ids.get(source) };
    if (kind === 'player') {
      value.charId = source.char.id;
      value.kitIdx = source.char.kitIdx || 0;
      value.dashGhosts = source.dashGhosts.slice(-8);
    }
    if (kind === 'ball') value.trail = source.trail.slice(-10);
    return entityState(value, kind);
  }

  capture(match) {
    const state = { ...primitives(match, topSchema), sequence: this.sequence++,
      scores: [...match.scores], hype: [...match.hype], courier: this.entity(match.courier, 'courier'),
      gravityRing: match.gravityRing ? this.entity(match.gravityRing, 'ring') : null,
      hyperCutIn: match.hyperCutIn?.timer > 0 ? {
        charId: match.hyperCutIn.char.id, kitIdx: match.hyperCutIn.char.kitIdx || 0, timer: match.hyperCutIn.timer,
      } : null,
    };
    for (const [key, [kind, cap]] of Object.entries(collections)) {
      state[key] = (match[key] || []).slice(-cap).map(entity => this.entity(entity, kind));
    }
    return state;
  }
}

export function validateOnlineState(source) {
  const result = primitives(source, topSchema);
  for (const field of ['time', 'timeRemaining', 'cameraZoom', 'cameraFocusX', 'cameraFocusY', 'shakeX', 'shakeY', 'bannerTimer']) {
    assertOnline(numeric(result[field]), field);
  }
  assertOnline(Number.isInteger(source.sequence) && source.sequence >= 0, 'state sequence');
  assertOnline(['countdown', 'playing', 'goal_celebration', 'sudden_death_intro', 'ended'].includes(result.phase), 'match phase');
  result.sequence = source.sequence;
  for (const key of ['scores', 'hype']) {
    assertOnline(Array.isArray(source[key]) && source[key].length === 2 &&
      source[key].every(value => numeric(value) && value >= 0 && value <= (key === 'hype' ? 100 : 9999)), key);
    result[key] = [...source[key]];
  }
  for (const [key, [kind, cap]] of Object.entries(collections)) {
    assertOnline(Array.isArray(source[key]) && source[key].length <= cap, key);
    result[key] = source[key].map(entity => entityState(entity, kind));
  }
  assertOnline(result.players.length >= 2 && result.players.length <= 8 && result.balls.length <= 16, 'match entities');
  result.courier = entityState(source.courier, 'courier');
  result.gravityRing = source.gravityRing ? entityState(source.gravityRing, 'ring') : null;
  result.hyperCutIn = null;
  if (source.hyperCutIn) {
    const cut = source.hyperCutIn;
    assertOnline(CHARACTERS.some(character => character.id === cut.charId) &&
      Number.isInteger(cut.kitIdx) && cut.kitIdx >= 0 && cut.kitIdx < 3 && numeric(cut.timer) && cut.timer >= 0 && cut.timer <= 1, 'hyper cut-in');
    result.hyperCutIn = { timer: cut.timer, char: getCharacter(cut.charId, cut.kitIdx) };
  }
  result.players = result.players.map(player => ({ ...player, char: getCharacter(player.charId, player.kitIdx) }));
  return result;
}

export class RemoteMatchView {
  constructor(config, settings) {
    this.arena = getArena(config.arenaId);
    this.settings = onlineSettings(config, settings);
    this.mode = 'online';
    this.targets = [];
    this.gauntletCannon = null;
    this.phase = 'countdown';
    this.time = 0;
    this.timeRemaining = config.matchDuration;
    this.scores = [0, 0];
    this.hype = [0, 0];
    this.courier = { active: false, x: 960, y: 335 };
    this.cameraZoom = 1;
    this.cameraFocusX = 960;
    this.cameraFocusY = 540;
    this.shakeX = this.shakeY = 0;
    this.netRippleLeft = this.netRippleRight = this.powLeftTimer = this.powRightTimer = 0;
    this.bannerTimer = 0;
    this.suddenDeath = false;
    this.unlimitedTime = false;
    this.hyperCutIn = null;
    this.gravityRing = null;
    this.leftTeamColor = '#e63946';
    this.rightTeamColor = '#22c55e';
    this.lastSequence = -1;
    for (const key of Object.keys(collections)) this[key] = [];
  }

  hasMutator() { return false; }
  dispose() { this.target = null; }

  receive(state) {
    if (state.sequence <= this.lastSequence) return false;
    this.lastSequence = state.sequence;
    this.from = {};
    for (const key of Object.keys(collections)) this.from[key] = this[key];
    this.target = state;
    this.age = 0;
    const collectionsSet = new Set(Object.keys(collections));
    for (const [key, value] of Object.entries(state)) if (!collectionsSet.has(key)) this[key] = value;
    if (!this.players.length) for (const key of Object.keys(collections)) this[key] = state[key];
    return true;
  }

  update(dt) {
    if (!this.target) return;
    this.age = Math.min(0.05, this.age + dt);
    const blend = this.age / 0.05;
    for (const key of Object.keys(collections)) {
      if (['particles', 'shockwaves'].includes(key)) { this[key] = this.target[key]; continue; }
      const previous = new Map(this.from[key].map(entity => [entity.netId, entity]));
      this[key] = this.target[key].map(entity => {
        const from = previous.get(entity.netId);
        if (!from || !numeric(entity.x) || Math.hypot(entity.x - from.x, entity.y - from.y) > 250) return entity;
        const rendered = { ...entity };
        for (const field of ['x', 'y', 'angle', 'squashX', 'squashY', 'visualScale']) {
          if (numeric(from[field]) && numeric(entity[field])) rendered[field] = from[field] + (entity[field] - from[field]) * blend;
        }
        return rendered;
      });
    }
    if (this.settings.reducedMotion) {
      this.shakeX = this.shakeY = 0;
      this.cameraZoom = 1;
      this.cameraFocusX = 960;
      this.cameraFocusY = 540;
    }
  }
}
