import { formatKeyCode } from './input.js';

export const MODE_BRIEFINGS = {
  practice: ['Welcome to the pitch.', 'No opponent. No clock. Just you and the ball. I will walk you through five quick skills, one at a time.'],
  '1v1_cpu': ['Your first rivalry.', 'Defend the left goal and attack the right. A jump and a well-timed strike will lift the ball onto the raised goal ledge. Start with Rookie if you are finding your feet.'],
  '1v1_pvp': ['Settle it on the pitch.', 'Player 1 defends the left; Player 2 defends the right. Share a keyboard or use separate controllers. Take a moment to check both players can move.'],
  '2v2': ['Better together.', 'Check the squad format before kickoff. Pass between teammates to build Voltage. One striker attacking and one covering the raised goal is a good starting shape.'],
  cup: ['One round at a time.', 'Win to advance through the cup. Your rival and stadium are fixed for each round. In co-op, both human players defend the left goal together.'],
  tourney: ['Every goal matters.', 'The bracket tells you who plays next. Controller players keep their player number; keyboard players use the side shown in the match briefing. Ties go to a decider.'],
  trial: ['A challenge with a purpose.', 'Winning is only part of the task. Watch the objective tracker. Trial rules are fixed: no random items or extra party modifiers. Retry as often as you like.'],
  target_blitz: ['Find your rhythm.', 'You have sixty seconds. Strike the floating targets to build a scoring chain. The right goal earns a bonus; your left goal is sealed.'],
  keep_up: ['Keep your eyes on the ball.', 'The floor is safe for you, but not for the ball. Lob it high and move underneath it. An extra ball joins every twenty seconds.'],
  goalie_gauntlet: ['Make the save.', 'Guard the left goal against the cannon. You have three lives. Strike the ball away, or time a dash just before contact for a perfect parry.'],
};

export const ARENA_GUIDES = {
  meadow: { label: 'The classic pitch', tip: 'Goals sit above the field. Jump, then strike across the raised ledge.', hazard: 'No environmental hazards' },
  sky: { label: 'Own the air', tip: 'Jump up through the cloud decks; land on top. Descending balls bounce off them too.', hazard: 'One-way aerial platforms' },
  castle: { label: 'Read the warning', tip: 'Glowing marked lanes warn before the lava erupts. Use the central platform to stay above it.', hazard: 'Telegraphed lava vents' },
  manor: { label: 'Watch both portals', tip: 'A high ball entering a portrait reappears at the opposite portrait. Watch the exit, not just the shot.', hazard: 'Paired ball portals' },
  jungle: { label: 'Catch the bounce', tip: 'The two golden drums launch players and balls. Keep a second jump ready for the follow-up.', hazard: 'Spring drums' },
  glacier: { label: 'Brake a little earlier', tip: 'Ice carries your momentum. The warning lane marks where an icicle is about to fall.', hazard: 'Ice drift and falling icicles' },
  cosmos: { label: 'Give yourself space', tip: 'Lower gravity extends every jump. The central hoop accelerates balls, so allow extra reaction time.', hazard: 'Low gravity and accelerator ring' },
};

export function controlHints(input, slot = 0, source = input.activeSource) {
  if (source === 'gamepad') return {
    move: 'Left stick / D-pad', jump: 'A', kick: 'X', lob: 'Y / Up + X',
    down: 'Stick down', dash: 'B / LB', item: 'RB / RT', pause: 'Start',
  };
  if (source === 'touch') return {
    move: 'Drag stick / arrows', jump: 'JUMP', kick: 'STRIKE', lob: 'LOB',
    down: 'Down arrow', dash: 'DASH', item: 'ITEM', pause: 'Pause',
  };
  const keys = input.controls[`p${slot + 1}`] || input.controls.p1;
  const label = action => (keys[action] || []).slice(0, 2).map(formatKeyCode).join(' / ');
  return {
    move: `${label('left')} / ${label('right')}`, jump: label('up'), kick: label('kick'),
    lob: label('lob'), down: label('down'), dash: label('dash'), item: label('item'), pause: 'Esc',
  };
}

export const PRACTICE_STEPS = [
  { title: 'Find your feet', dialogue: 'Coach: Move across the grass. A little space makes the next touch much easier.', actions: ['move'] },
  { title: 'Take to the air', dialogue: 'Coach: Good. Now jump. Tap again in the air for a second jump; release early for a shorter hop.', actions: ['jump'] },
  { title: 'Make contact', dialogue: 'Coach: The ball is beside you. Tap and release Strike to kick it. Hold a little longer for a charged shot.', actions: ['kick', 'lob'] },
  { title: 'Change the pace', dialogue: 'Coach: Nice touch. Dash to close a gap. Time it just before a fast enemy shot to parry.', actions: ['dash'] },
  { title: 'Use your advantage', dialogue: 'Coach: I have put a Star in your item slot. Use it now. In a match, collect items from the floating courier.', actions: ['item'] },
];

export class PracticeCoach {
  constructor(match) {
    this.match = match;
    this.step = 0;
    this.complete = false;
    this.enterStep();
  }

  enterStep() {
    const player = this.match.players[0];
    this.startX = player.x;
    this.baseline = { ...player.stats };
    if (this.step === 2) {
      const ball = this.match.balls[0];
      Object.assign(player, { x: 700, y: this.match.arena.pitchFloorY - player.halfH, vx: 0, vy: 0, facing: 1 });
      if (ball) Object.assign(ball, { x: 780, y: player.y - 12, vx: 0, vy: -80, freezeTimer: 0 });
    } else if (this.step === 4) player.heldItem = 'SuperStar';
  }

  update() {
    if (this.complete || this.match.phase !== 'playing') return false;
    const player = this.match.players[0];
    const passed = [
      () => Math.abs(player.x - this.startX) >= 140,
      () => player.stats.jumps > this.baseline.jumps,
      () => player.stats.touches > this.baseline.touches,
      () => player.stats.dashes > this.baseline.dashes,
      () => player.stats.itemsUsed > this.baseline.itemsUsed,
    ][this.step]();
    if (!passed) return false;
    this.step++;
    this.complete = this.step === PRACTICE_STEPS.length;
    if (!this.complete) this.enterStep();
    return true;
  }
}

export function trialProgress(match) {
  if (!match.trial) return '';
  const player = match.players.find(player => player.team === 0 && !player.isClone);
  if (!player) return '';
  const trial = match.trial;
  const score = `Goals ${match.scores[0]}/${trial.targetScore}`;
  if (trial.specialRule === 'meteor_spikes') return `Meteor goals ${player.stats.meteorGoals}/${trial.targetScore}`;
  if (trial.specialRule === 'wall_jumps') return `${score} · Wall jumps ${player.stats.wallJumps}/${trial.requiredWallJumps}`;
  if (trial.specialRule === 'parry_shutout') return `${score} · Parries ${player.stats.parries}/${trial.requiredParries} · Conceded ${match.scores[1]}`;
  if (trial.specialRule === 'no_lava') return `${score} · Lava touches ${player.stats.lavaTouches}${player.stats.lavaTouches ? ' — retry for the star' : ''}`;
  return score;
}
