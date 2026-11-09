import test from 'node:test';
import assert from 'node:assert/strict';
import { InputManager } from '../src/input.js';
import { DEFAULT_CONTROLS, ARENAS, DEFAULT_SETTINGS } from '../src/config.js';
import { controlHints, ARENA_GUIDES, PracticeCoach } from '../src/coach.js';
import { MatchSimulation } from '../src/physics.js';

test('control hints use the actual rebind and the active input method', () => {
  const input = new InputManager(structuredClone(DEFAULT_CONTROLS));
  input.controls.p1.kick = ['KeyZ'];
  assert.equal(controlHints(input).kick, 'Z');
  input.activeSource = 'gamepad';
  assert.equal(controlHints(input).kick, 'X');
  input.activeSource = 'touch';
  assert.equal(controlHints(input).kick, 'STRIKE');
});

test('each real stadium has an actionable briefing', () => {
  for (const arena of ARENAS.filter(arena => !arena.isRandom)) {
    assert.ok(ARENA_GUIDES[arena.id]?.tip.length > 30);
    assert.ok(ARENA_GUIDES[arena.id]?.hazard);
  }
});

test('practice steps require real successful actions', () => {
  const match = new MatchSimulation({
    mode: 'practice', arenaId: 'meadow', settings: DEFAULT_SETTINGS,
    playersConfig: [{ charId: 'mario', team: 0 }],
    isAttract: true,
  });
  const coach = new PracticeCoach(match);
  const step = input => { match.update(1 / 120, [input || {}]); coach.update(); };
  assert.equal(coach.update(), false);
  for (let frame = 0; frame < 60 && coach.step === 0; frame++) step({ right: true });
  assert.equal(coach.step, 1);
  step({ jumpPressed: true, jumpHeld: true });
  assert.equal(coach.step, 2);
  step({ kickPressed: true, kickDown: true });
  step({ kickReleased: true });
  assert.equal(coach.step, 3);
  step({ dashPressed: true });
  assert.equal(coach.step, 4);
  step({ itemPressed: true });
  assert.equal(coach.complete, true);
});
