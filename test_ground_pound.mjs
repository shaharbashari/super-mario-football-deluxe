import assert from 'node:assert/strict';
import path from 'node:path';

const projectRoot = '/Users/shbashar/.gemini/antigravity/scratch/super-kick-kingdom';
const { MatchSimulation } = await import(path.join(projectRoot, 'src/physics.js'));
const { DEFAULT_SETTINGS } = await import(path.join(projectRoot, 'src/config.js'));

const neutralInput = () => ({
  left: false,
  right: false,
  up: false,
  down: false,
  upPressed: false,
  downPressed: false,
  downReleased: false,
  jumpPressed: false,
  jumpReleased: false,
  kickDown: false,
  kickPressed: false,
  kickReleased: false,
  lobDown: false,
  lobPressed: false,
  dashPressed: false,
  itemPressed: false,
});

console.log('Testing Ground Pound mechanics...');

// Test 1: Ground Pound Trigger & Stall
{
  const sim = new MatchSimulation({
    playersConfig: [
      { charId: 'mario', team: 0, tag: 'P1' },
      { charId: 'bowser', team: 1, tag: 'P2' },
    ],
    arenaId: 'meadow',
    mode: 'exhibition',
    settings: DEFAULT_SETTINGS,
    isAttract: true,
  });

  const p1 = sim.players[0];
  // Put p1 in the air
  p1.y = 500;
  p1.onGround = false;
  p1.vy = -200;

  // Input downPressed
  const inp = neutralInput();
  inp.downPressed = true;
  inp.down = true;

  sim.update(0.016, [inp, neutralInput()]);

  assert.equal(p1.groundPoundState, 'stall', 'Should enter stall phase');
  assert.equal(p1.vx, 0, 'Horizontal velocity should freeze in stall');
  assert.equal(p1.vy, 0, 'Vertical velocity should freeze in stall');
  console.log('✓ Ground Pound Trigger & Stall verified');

  // Advance stall duration (0.12s)
  for (let i = 0; i < 8; i++) {
    sim.update(0.016, [neutralInput(), neutralInput()]);
  }

  assert.equal(p1.groundPoundState, 'plunge', 'Should enter plunge phase after stall');
  assert.equal(p1.vy, 2200, 'Vertical velocity should rocket to 2200 during plunge');
  console.log('✓ Plunge rocket descent verified');
}

// Test 2: Meteor Spike on Ball
{
  const sim = new MatchSimulation({
    playersConfig: [
      { charId: 'mario', team: 0, tag: 'P1' },
      { charId: 'bowser', team: 1, tag: 'P2' },
    ],
    arenaId: 'meadow',
    mode: 'exhibition',
    settings: DEFAULT_SETTINGS,
    isAttract: true,
  });

  const p1 = sim.players[0];
  const ball = sim.balls[0];

  p1.x = 800;
  p1.y = 400;
  p1.onGround = false;
  p1.groundPoundState = 'plunge';
  p1.vy = 2200;

  // Place ball directly below p1
  ball.x = 800;
  ball.y = 440;
  ball.vx = 0;
  ball.vy = 0;

  sim.update(0.016, [neutralInput(), neutralInput()]);

  assert.ok(ball.vy >= 1850, `Ball should be spiked downward at vy>=1850, got ${ball.vy}`);
  assert.equal(ball.lastTeam, 0, 'Ball lastTeam should be P1 team');
  assert.equal(p1.groundPoundState, 'none', 'Player bounces off ball spike');
  assert.ok(p1.vy < 0, 'Player should bounce upward after meteor spike');
  console.log('✓ Meteor Spike on Ball verified');
}

// Test 3: Stomp Stun on Opponent
{
  const sim = new MatchSimulation({
    playersConfig: [
      { charId: 'mario', team: 0, tag: 'P1' },
      { charId: 'bowser', team: 1, tag: 'P2' },
    ],
    arenaId: 'meadow',
    mode: 'exhibition',
    settings: DEFAULT_SETTINGS,
    isAttract: true,
  });

  const p1 = sim.players[0];
  const foe = sim.players[1];

  p1.x = 900;
  p1.y = 650;
  p1.onGround = false;
  p1.groundPoundState = 'plunge';
  p1.vy = 2200;

  foe.x = 900;
  foe.y = 720;
  foe.onGround = true;

  sim.update(0.016, [neutralInput(), neutralInput()]);

  assert.ok(foe.stunTimer > 1.0, 'Foe should be stunned for over 1 second');
  assert.equal(p1.groundPoundState, 'none', 'Player bounces up after stomping opponent');
  assert.ok(p1.vy < 0, 'Player should bounce upward after stomp');
  console.log('✓ Opponent Stomp Stun verified');
}

// Test 4: Floor Impact Shockwave & Ball Pop
{
  const sim = new MatchSimulation({
    playersConfig: [
      { charId: 'mario', team: 0, tag: 'P1' },
      { charId: 'bowser', team: 1, tag: 'P2' },
    ],
    arenaId: 'meadow',
    mode: 'exhibition',
    settings: DEFAULT_SETTINGS,
    isAttract: true,
  });

  const p1 = sim.players[0];
  const ball = sim.balls[0];

  p1.x = 900;
  p1.y = sim.arena.pitchFloorY - 70;
  p1.onGround = false;
  p1.groundPoundState = 'plunge';
  p1.vy = 2200;

  // Ball is resting on pitch near impact point (outside direct body reach 92px, inside shockwave 220px)
  ball.x = 1030;
  ball.y = sim.arena.pitchFloorY - ball.radius;
  ball.vy = 0;

  sim.update(0.016, [neutralInput(), neutralInput()]);

  assert.equal(p1.groundPoundState, 'impact', 'Player should enter impact recovery');
  assert.ok(ball.vy <= -1000, `Ball should pop upward from shockwave, got ${ball.vy}`);
  assert.ok(sim.shockwaves.length > 0, 'Impact shockwave should spawn');
  console.log('✓ Floor Impact Shockwave & Ball Pop verified');
}

// Test 5: Simplified Control - Up + Kick = Lob
{
  const sim = new MatchSimulation({
    playersConfig: [
      { charId: 'mario', team: 0, tag: 'P1' },
      { charId: 'bowser', team: 1, tag: 'P2' },
    ],
    arenaId: 'meadow',
    mode: 'exhibition',
    settings: DEFAULT_SETTINGS,
    isAttract: true,
  });

  const p1 = sim.players[0];
  const inp = neutralInput();
  inp.up = true;
  inp.kickPressed = true;

  sim.update(0.016, [inp, neutralInput()]);

  assert.equal(p1.kickType, 'up', 'Up + Kick should trigger Lob strike without needing dedicated lob key');
  console.log('✓ Simplified Directional Lob (Up + Kick) verified');
}

// Test 6: Wall-Jump Mechanics
{
  const sim = new MatchSimulation({
    playersConfig: [
      { charId: 'mario', team: 0, tag: 'P1' },
      { charId: 'bowser', team: 1, tag: 'P2' },
    ],
    arenaId: 'meadow',
    mode: 'exhibition',
    settings: DEFAULT_SETTINGS,
    isAttract: true,
  });

  const p1 = sim.players[0];
  // Position p1 against left boundary wall in the air
  p1.x = sim.arena.goalBackLeftX + p1.halfW + 2;
  p1.y = 500;
  p1.onGround = false;
  p1.vy = 200;

  // First frame detects wall contact
  sim.update(0.016, [neutralInput(), neutralInput()]);
  assert.equal(p1.touchingWallDir, 1, 'Should detect left wall contact');

  // Second frame inputs jump
  const inp = neutralInput();
  inp.jumpPressed = true;
  inp.up = true;
  sim.update(0.016, [inp, neutralInput()]);

  assert.ok(p1.vx > 500, `Wall-jump should propel striker rightward away from wall, got vx=${p1.vx}`);
  assert.ok(p1.vy < -1000, `Wall-jump should launch striker upward, got vy=${p1.vy}`);
  assert.equal(p1.facing, 1, 'Facing should flip away from wall');
  console.log('✓ Pro Movement Tech: Wall-Jump verified');
}

console.log('🎉 ALL GROUND POUND, WALL-JUMP & SIMPLIFIED CONTROL TESTS PASSED!');
