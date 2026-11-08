import assert from 'node:assert/strict';
import path from 'node:path';

const projectRoot = '/Users/shbashar/.gemini/antigravity/scratch/super-kick-kingdom';
const { MatchSimulation } = await import(path.join(projectRoot, 'src/physics.js'));
const {
  CHARACTERS,
  DEFAULT_SETTINGS,
  STRIKER_TRIALS,
  TROPHIES,
} = await import(path.join(projectRoot, 'src/config.js'));
const { CHAR_SPRITE_METRICS } = await import(path.join(projectRoot, 'src/art.js'));

console.log('Testing Character Proportions, Striker Trials & Physics Mutators...');

// Test 1: Canonical Character Height & Turf Baseline
{
  const bowser = CHARACTERS.find((c) => c.id === 'bowser');
  const waluigi = CHARACTERS.find((c) => c.id === 'waluigi');
  const mario = CHARACTERS.find((c) => c.id === 'mario');
  const toad = CHARACTERS.find((c) => c.id === 'toad');

  assert.equal(bowser.stats.size, 1.38, 'Bowser should have canonical boss size 1.38');
  assert.equal(waluigi.stats.size, 1.25, 'Waluigi should have towering lanky size 1.25');
  assert.equal(mario.stats.size, 1.0, 'Mario should have baseline size 1.0');
  assert.equal(toad.stats.size, 0.84, 'Toad should have nimble size 0.84');

  // Verify drawSizes and unified footY baseline
  assert.equal(CHAR_SPRITE_METRICS.bowser.drawSize, 228);
  assert.equal(CHAR_SPRITE_METRICS.waluigi.drawSize, 210);
  assert.equal(CHAR_SPRITE_METRICS.mario.drawSize, 164);
  assert.equal(CHAR_SPRITE_METRICS.toad.drawSize, 138);

  for (const [id, metric] of Object.entries(CHAR_SPRITE_METRICS)) {
    if (id === 'king_boo') {
      assert.equal(metric.footY, 0.880, 'King Boo should float as an ethereal ghost');
    } else {
      assert.equal(metric.footY, 0.968, `Character ${id} must share unified turf baseline footY 0.968`);
    }
  }
  console.log('✓ Canonical character proportions & ground baseline verified');
}

// Test 2: Trial 1 - Meteor Spike Master
{
  const trial1 = STRIKER_TRIALS.find((t) => t.id === 'trial_meteor');
  assert.ok(trial1, 'Trial 1 should exist');

  const sim = new MatchSimulation({
    playersConfig: [
      { charId: 'mario', team: 0, tag: 'P1' },
      { charId: 'luigi', team: 1, tag: 'CPU' },
    ],
    arenaId: trial1.arenaId,
    mode: 'trial',
    trial: trial1,
    settings: DEFAULT_SETTINGS,
    isAttract: true,
  });

  const p1 = sim.players[0];

  // Scoring without meteor spike should NOT count toward trial goals
  sim.scores[0] = 2;
  p1.stats.goals = 2;
  p1.stats.meteorSpikes = 1; // only 1 spike
  let summary = sim.getSummary();
  assert.equal(summary.trialSuccess, false, 'Should fail trial if target meteor spikes not met');

  // Meeting 2 meteor spikes
  p1.stats.meteorSpikes = 2;
  summary = sim.getSummary();
  assert.equal(summary.trialSuccess, true, 'Should succeed trial when 2 meteor spikes achieved');
  console.log('✓ Trial 1 (Meteor Spike Master) objective validation verified');
}

// Test 3: Trial 2 - Wall-Jump Acrobatics
{
  const trial2 = STRIKER_TRIALS.find((t) => t.id === 'trial_walljump');
  assert.ok(trial2, 'Trial 2 should exist');

  const sim = new MatchSimulation({
    playersConfig: [
      { charId: 'waluigi', team: 0, tag: 'P1' },
      { charId: 'yoshi', team: 1, tag: 'CPU' },
    ],
    arenaId: trial2.arenaId,
    mode: 'trial',
    trial: trial2,
    settings: DEFAULT_SETTINGS,
    isAttract: true,
  });

  const p1 = sim.players[0];
  sim.scores[0] = 3;
  sim.scores[1] = 1;
  p1.stats.wallJumps = 2; // only 2 wall jumps
  let summary = sim.getSummary();
  assert.equal(summary.trialSuccess, false, 'Should fail trial if < 3 wall jumps');

  p1.stats.wallJumps = 3;
  summary = sim.getSummary();
  assert.equal(summary.trialSuccess, true, 'Should succeed trial when >= 3 wall jumps & win');
  console.log('✓ Trial 2 (Wall-Jump Acrobatics) objective validation verified');
}

// Test 4: Trial 3 - Golden Wall (Parry Shutout)
{
  const trial3 = STRIKER_TRIALS.find((t) => t.id === 'trial_parry');
  assert.ok(trial3, 'Trial 3 should exist');

  const sim = new MatchSimulation({
    playersConfig: [
      { charId: 'peach', team: 0, tag: 'P1' },
      { charId: 'bowser', team: 1, tag: 'CPU' },
    ],
    arenaId: trial3.arenaId,
    mode: 'trial',
    trial: trial3,
    settings: DEFAULT_SETTINGS,
    isAttract: true,
  });

  const p1 = sim.players[0];
  sim.scores[0] = 2;
  sim.scores[1] = 1; // conceded a goal!
  p1.stats.parries = 4;
  let summary = sim.getSummary();
  assert.equal(summary.trialSuccess, false, 'Should fail trial if conceded > 0 goals');

  sim.scores[1] = 0; // shutout!
  summary = sim.getSummary();
  assert.equal(summary.trialSuccess, true, 'Should succeed trial with shutout and 3+ parries');
  console.log('✓ Trial 3 (The Golden Wall) objective validation verified');
}

// Test 5: Mutators Physics - Iron Ball & Magnus Mayhem
{
  const sim = new MatchSimulation({
    playersConfig: [
      { charId: 'mario', team: 0, tag: 'P1' },
      { charId: 'luigi', team: 1, tag: 'CPU' },
    ],
    arenaId: 'meadow',
    mode: '1v1_cpu',
    settings: {
      ...DEFAULT_SETTINGS,
      activeMutators: ['ironBall', 'curvedWorld'],
    },
    isAttract: true,
  });

  assert.ok(sim.hasMutator('ironBall'), 'Iron Ball mutator should be active');
  assert.ok(sim.hasMutator('curvedWorld'), 'Curved World mutator should be active');

  const ball = sim.balls[0];
  ball.x = 800;
  ball.y = 500;
  ball.vx = 800;
  ball.vy = 0;
  ball.spin = 1.0;

  // Run a physical step
  sim.update(0.016, [{ left: false }, { left: false }]);

  // Ball should experience heavy gravity and curve downward with magnified spin
  assert.ok(ball.vy > 10, 'Iron Ball with spin should rapidly accelerate downward');
  console.log('✓ Iron Ball & Magnus Mayhem physics verified');
}

// Test 6: Trophy Count
{
  assert.equal(TROPHIES.length, 26, 'Should have exactly 26 trophies in config');
  assert.ok(TROPHIES.some((t) => t.id === 'trial_initiate'), 'trial_initiate trophy must exist');
  assert.ok(TROPHIES.some((t) => t.id === 'trial_grandmaster'), 'trial_grandmaster trophy must exist');
  console.log('✓ All 26 Trophies verified');
}

console.log('🎉 ALL STRIKER TRIALS, CANONICAL PROPORTIONS & MUTATOR TESTS PASSED!');
