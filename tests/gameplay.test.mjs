import test from 'node:test';
import assert from 'node:assert/strict';
import { MatchSimulation } from '../src/physics.js';
import { AIController } from '../src/ai.js';
import { CHARACTERS, ARENAS, ITEMS, DEFAULT_SETTINGS, STRIKER_TRIALS, COURIER_LAYOUT } from '../src/config.js';
import { characterFrame, itemMotion } from '../src/animation.js';

const make = (arenaId = 'meadow', extra = {}) => new MatchSimulation({
  mode: '1v1_cpu', arenaId, immediateEnd: true,
  playersConfig: [{ charId: 'mario', team: 0 }, { charId: 'luigi', team: 1 }],
  settings: { ...DEFAULT_SETTINGS, hitstop: false, itemMode: 'off' },
  isAttract: true, ...extra,
});

test('lower risers reflect a ball instead of teleporting it onto the goal floor', () => {
  for (const direction of [-1, 1]) {
    const match = make();
    const ball = match.balls[0];
    Object.assign(ball, { x: direction < 0 ? 332 : 1588, y: 870, vx: direction * 1000, vy: 0 });
    match._stepBall(ball, 0.01, false);
    assert.ok(ball.y > 850);
    assert.equal(Math.sign(ball.vx), -direction);
  }
});

test('floating decks bounce descending balls and allow ascent', () => {
  const match = make('sky');
  const ball = match.balls[0];
  Object.assign(ball, { x: 640, y: 610, vx: 0, vy: 900 });
  match._stepBall(ball, 0.01, false);
  assert.ok(ball.vy < 0);
  assert.equal(ball.y + ball.radius, 650);
  Object.assign(ball, { x: 640, y: 680, vx: 0, vy: -900 });
  match._stepBall(ball, 0.01, false);
  assert.ok(ball.vy < 0);
});

test('an embedded ball is separated from a player', () => {
  const match = make();
  const player = match.players[0];
  Object.assign(player, { x: 700, y: 600, vx: 0, vy: 0 });
  const ball = match.balls[0];
  Object.assign(ball, { x: 700, y: 600, vx: 0, vy: 0 });
  match._stepBall(ball, 0, false);
  assert.ok(Math.abs(ball.x - player.x) > player.halfW || Math.abs(ball.y - player.y) > player.halfH);
});

test('meteor provenance is cleared by a normal rival strike', () => {
  const match = make();
  const ball = match.balls[0];
  ball.lastWasMeteorSpike = true;
  match._applyKickToBall(match.players[1], ball);
  assert.equal(ball.lastWasMeteorSpike, false);
});

test('a strike opens a perfect-parry window in the same simulation step', () => {
  const match = make();
  const player = match.players[0];
  Object.assign(player, { x: 700, y: 600 });
  Object.assign(match.balls[0], { x: 770, y: 600, vx: -1000, vy: 0, lastTeam: 1 });
  match._updatePlayer(player, { kickPressed: true, kickDown: true }, 1 / 120);
  assert.equal(player.stats.parries, 1);
  assert.ok(match.balls[0].vx > 0);
});

test('shells and banana projectiles cannot teleport up the lower goal ledge', () => {
  const match = make();
  match.shells.push({ x: 332, y: 870, vx: -900, vy: 0, radius: 32, ownerTeam: 0, timer: 5 });
  match.bananas.push({ x: 332, y: 870, vx: -900, vy: 0, ownerTeam: 0, timer: 5 });
  match._updateShells(0.01);
  match._updateBananas(0.01);
  for (const entity of [match.shells[0], match.bananas[0]]) {
    assert.ok(entity.y > 850);
    assert.ok(entity.vx > 0);
  }
});

test('courier pickup follows the enlarged bubble instead of the old item position', () => {
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const match = make('meadow', { settings: { ...DEFAULT_SETTINGS, itemMode: 'standard' } });
    match._updateCourier(0);
    assert.equal(match.courier.bubbleY - match.courier.y, COURIER_LAYOUT.itemOffsetY);
    const player = match.players[0];
    match.courier.heldItemId = 'SuperStar';
    const reachX = player.halfW + COURIER_LAYOUT.bubbleRadius;
    const reachY = player.halfH + COURIER_LAYOUT.bubbleRadius;
    Object.assign(player, {
      x: match.courier.bubbleX + dx * (reachX + 1),
      y: match.courier.bubbleY + dy * (reachY + 1),
      vx: 0, vy: 0, onGround: false,
    });
    match._updatePlayer(player, {}, 0);
    assert.equal(player.heldItem, null, 'Outside the visible bubble must not collect');
    player.x -= dx * 2;
    player.y -= dy * 2;
    match._updatePlayer(player, {}, 0);
    assert.equal(player.heldItem, 'SuperStar', 'Touching the visible bubble must collect');
    assert.equal(match.courier.heldItemId, null);
  }
});

test('own goals do not fabricate scorer stats for an untouched opponent', () => {
  const match = make('meadow', { isAttract: false });
  const ball = match.balls[0];
  ball.lastKicker = match.players[1];
  match._handleGoalScored(0, ball);
  assert.equal(match.scores[0], 1);
  assert.equal(match.players[0].stats.goals, 0);
  assert.equal(match.players[1].stats.ownGoals, 1);
  assert.equal(match.bannerText, 'OWN GOAL');
});

test('trial goals, party isolation and lava contacts enforce the advertised objectives', () => {
  const meteor = STRIKER_TRIALS.find(trial => trial.id === 'trial_meteor');
  const match = make('meadow', { mode: 'trial', trial: meteor });
  match.scores = [2, 0];
  match.players[0].stats.meteorSpikes = 20;
  assert.equal(match.getSummary().trialSuccess, false);
  match.players[0].stats.meteorGoals = 2;
  assert.equal(match.getSummary().trialSuccess, true);
  match.players[0].heldItem = '1UP';
  match._activatePlayerItem(match.players[0]);
  assert.deepEqual(match.scores, [2, 0]);
  const lava = STRIKER_TRIALS.find(trial => trial.id === 'trial_lava');
  const lavaMatch = make('castle', {
    mode: 'trial', trial: lava,
    settings: { ...DEFAULT_SETTINGS, activeMutators: ['multiBall', 'turboMode'], itemMode: 'frantic' },
  });
  const player = lavaMatch.players[0];
  assert.equal(player.y + player.halfH, lavaMatch.arena.platforms[0].y);
  assert.deepEqual(lavaMatch.settings.activeMutators, ['floorIsLava']);
  assert.equal(lavaMatch.courier.active, false);
  lavaMatch.scores = [3, 0];
  assert.equal(lavaMatch.getSummary().trialSuccess, true);
  Object.assign(player, { x: 1000, y: 950, vy: 500 });
  lavaMatch._moveAndCollidePlayer(player, 0.01, true);
  assert.equal(player.stats.lavaTouches, 1);
  assert.equal(lavaMatch.getSummary().trialSuccess, false);
});

test('stun and ground-pound animation clocks advance for all twelve characters', () => {
  for (const character of CHARACTERS) {
    const match = make('meadow', { playersConfig: [{ charId: character.id, team: 0 }] });
    const player = match.players[0];
    Object.assign(player, { stunTimer: 0.5, y: 500 });
    match.update(1 / 60, [{}]);
    const phase = player.animPhase;
    match.update(1 / 60, [{}]);
    assert.ok(player.animPhase > phase, character.id);
    assert.equal(characterFrame(player).row, 5);
    for (const state of ['stall', 'plunge', 'impact']) {
      Object.assign(player, { stunTimer: 0, groundPoundState: state, groundPoundTimer: 1, y: 500 });
      match.update(1 / 120, [{}]);
      const frame = characterFrame(player);
      assert.equal(frame.row, 2);
      assert.ok(frame.col >= 0 && frame.col < 16);
    }
  }
});

test('all eighteen item animation curves are continuous and finite', () => {
  for (const item of ITEMS) {
    const before = itemMotion(item.id, 0.5);
    const after = itemMotion(item.id, 0.5 + 1 / 120);
    for (const key of Object.keys(before)) {
      assert.ok(Number.isFinite(after[key]));
      assert.ok(Math.abs(after[key] - before[key]) < 0.1);
    }
  }
});

test('tied mayhem proceeds to golden goal', () => {
  const match = make();
  match.suddenDeath = true;
  match.settings.suddenDeathMode = 'mayhem';
  match._handleTimeExpired();
  assert.equal(match.phase, 'sudden_death_intro');
  assert.equal(match.settings.suddenDeathMode, 'golden');
});

test('disposing an ended match cancels its pending result callback', () => {
  const match = make('meadow', { immediateEnd: false, onMatchEnd: () => assert.fail('stale callback') });
  match._finishMatch();
  assert.notEqual(match.endTimer, null);
  match.dispose();
  assert.equal(match.endTimer, null);
  assert.equal(match.disposed, true);
});

test('every stadium and item remains finite in an AI-driven simulation', () => {
  for (const arena of ARENAS.filter(arena => !arena.isRandom)) {
    const match = make(arena.id);
    const ai = new AIController();
    for (let frame = 0; frame < 600; frame++) {
      if (frame % 30 === 0 && frame / 30 < ITEMS.length) {
        match.players[0].heldItem = ITEMS[frame / 30].id;
        match._activatePlayerItem(match.players[0]);
      }
      match.update(1 / 120, match.players.map(player => ai.computeInput(player, match, 1 / 120)));
      for (const entity of [...match.players, ...match.balls]) {
        for (const key of ['x', 'y', 'vx', 'vy']) assert.ok(Number.isFinite(entity[key]), `${arena.id}: ${key}`);
      }
      assert.ok(match.particles.length <= 380);
    }
    match.dispose();
  }
});
