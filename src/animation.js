export const ANIMATION_CLIPS = {
  idle: { row: 0, count: 24, fps: 24 },
  run: { row: 1, count: 24, fps: 24 },
  jump: { row: 2, count: 16, fps: 24 },
  kickside: { row: 3, count: 12, fps: 24 },
  kickup: { row: 4, count: 12, fps: 24 },
  ouch: { row: 5, count: 16, fps: 24 },
};

export function advanceCharacterAnimation(player, dt) {
  const speed = Math.abs(player.vx);
  const state = player.stunTimer > 0 ? 'ouch'
    : player.groundPoundState !== 'none' ? 'jump'
    : player.kickTimer > 0 ? (player.kickType === 'up' ? 'kickup' : 'kickside')
    : !player.onGround ? 'jump' : speed > 38 ? 'run' : 'idle';
  if (state !== player.animState) {
    player.animState = state;
    player.animPhase = 0;
  }
  const cadence = state === 'run' ? Math.max(0.65, Math.min(1.8, speed / 360)) : 1;
  player.animPhase = (player.animPhase || 0) + dt * cadence;
  player.runPhase = (player.runPhase || 0) + (state === 'run' ? dt * cadence * Math.PI * 4 : 0);
  player.strideBounce = state === 'run' ? -Math.abs(Math.sin(player.runPhase)) * 2.5 : 0;
  const targetLean = state === 'run' ? Math.max(-0.09, Math.min(0.09, player.vx / 8000)) : 0;
  player.animLean = (player.animLean || 0) + (targetLean - (player.animLean || 0)) * (1 - Math.exp(-14 * dt));
}

export function characterFrame(player, time = 0) {
  const phase = player.animPhase ?? time;
  if (player.stunTimer > 0) return { col: Math.floor(phase * 24) % 16, row: 5 };
  const pound = { stall: 7, plunge: 11, impact: 14 }[player.groundPoundState];
  if (pound !== undefined) return { col: pound, row: 2 };
  if (player.kickTimer > 0) {
    const progress = Math.max(0, Math.min(1, 1 - player.kickTimer / (player.kickDuration || 0.21)));
    return { col: Math.min(11, Math.floor(progress * 12)), row: player.kickType === 'up' ? 4 : 3 };
  }
  if (!player.onGround) {
    const progress = Math.max(0, Math.min(1, ((player.vy || 0) + 1230) / 2460));
    return { col: Math.min(13, 3 + Math.floor(progress * 11)), row: 2 };
  }
  const running = Math.abs(player.vx || 0) > 38;
  return { col: Math.floor(phase * 24) % 24, row: running ? 1 : 0 };
}

export function itemMotion(itemId, time) {
  let seed = 0;
  for (const char of itemId) seed += char.charCodeAt(0);
  const phase = time * (2.4 + (seed % 5) * 0.28) + seed;
  return {
    rotation: Math.sin(phase) * (itemId === 'SuperStar' ? 0.16 : 0.055),
    scaleX: 1 + Math.sin(phase * 0.8) * 0.025,
    scaleY: 1 - Math.sin(phase * 0.8) * 0.025,
    y: Math.sin(phase) * 1.5,
  };
}
