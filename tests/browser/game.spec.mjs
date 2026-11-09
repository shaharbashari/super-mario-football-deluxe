import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

let errors;
test.beforeEach(async ({ page }) => {
  errors = [];
  page.on('pageerror', error => errors.push(error.message));
});
test.afterEach(() => expect(errors).toEqual([]));

async function boot(page, settings = {}) {
  await page.addInitScript(settings => {
    localStorage.setItem('super_kick_kingdom_deluxe_v2', JSON.stringify({
      settings: { showTips: false, muted: true, ...settings },
    }));
  }, settings);
  await page.goto('/');
  await page.waitForFunction(() => window.app && app.art.pendingAssets === 0);
}

async function start(page, mode = '1v1_cpu') {
  await page.evaluate(mode => {
    app.selectedMode = mode;
    app.startMatch();
  }, mode);
  await page.waitForFunction(() => app.art.pendingAssets === 0);
}

async function overlaps(page, first, second) {
  return page.evaluate(([first, second]) => {
    const a = document.querySelector(first).getBoundingClientRect();
    const b = document.querySelector(second).getBoundingClientRect();
    return a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
  }, [first, second]);
}

for (const viewport of [
  { width: 1920, height: 1080 }, { width: 1280, height: 720 },
  { width: 1024, height: 768 }, { width: 844, height: 390 },
  { width: 667, height: 375 }, { width: 390, height: 844 },
]) {
  test(`layout remains usable at ${viewport.width}x${viewport.height}`, async ({ page }, info) => {
    await page.setViewportSize(viewport);
    await boot(page);
    expect(await overlaps(page, '#top-utility-bar', '.title-hero')).toBe(false);
    expect(await page.locator('#screen-menu').evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    await expect(page.locator('.quick-mode-btn')).toHaveCount(3);
    await page.screenshot({ path: info.outputPath('menu.png') });
    await page.locator('[data-mode="1v1_cpu"]').click();
    expect(await overlaps(page, '#top-utility-bar', '.select-header')).toBe(false);
    expect(await page.locator('#screen-select').evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    await expect(page.locator('#roster-strip-0 button')).toHaveCount(12);
    await page.waitForFunction(() => app.art.pendingAssets === 0);
    await page.screenshot({ path: info.outputPath('select.png') });
    await page.locator('#btn-start-match').click();
    expect(await overlaps(page, '#top-utility-bar', '.hud-board')).toBe(false);
    const bounds = await page.locator('#game-canvas').boundingBox();
    expect(bounds.width / bounds.height).toBeCloseTo(16 / 9, 2);
    await expect(page.locator('#game-canvas')).toHaveCSS('object-fit', 'contain');
    await page.screenshot({ path: info.outputPath('match.png') });
  });
}

test('nested dialogs pause play, contain focus and restore the previous level', async ({ page }) => {
  await boot(page);
  await start(page);
  await page.locator('#btn-pause').click();
  await page.locator('#btn-pause-options').click();
  const time = await page.evaluate(() => app.match.time);
  await page.waitForTimeout(120);
  expect(await page.evaluate(() => app.match.time)).toBe(time);
  for (let i = 0; i < 24; i++) await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement.closest('.modal-backdrop')?.id)).toBe('modal-options');
  await page.keyboard.press('Escape');
  await expect(page.locator('#modal-options')).toBeHidden();
  await expect(page.locator('#modal-pause')).toBeVisible();
  expect(await page.evaluate(() => app.paused)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('#modal-pause')).toBeHidden();
  expect(await page.evaluate(() => app.paused)).toBe(false);
  await page.evaluate(() => app._openLockerModal());
  expect(await page.evaluate(() => app.paused)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('#modal-locker')).toBeHidden();
  await expect.poll(() => page.evaluate(() => app.paused)).toBe(false);
});

test('first-time coach pauses countdown, follows rebinds and can be replayed', async ({ page }, info) => {
  await boot(page, { showTips: true });
  await page.locator('[data-mode="1v1_cpu"]').click();
  await page.locator('#btn-start-match').click();
  await expect(page.locator('#modal-coach')).toBeVisible();
  const timer = await page.evaluate(() => app.match.phaseTimer);
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => app.match.phaseTimer)).toBe(timer);
  await page.evaluate(() => { app.controls.p1.kick = ['KeyZ']; app._updateControlPrompts(true); });
  await expect(page.locator('#coach-controls')).toContainText('Z');
  await page.screenshot({ path: info.outputPath('coach.png') });
  await page.locator('#btn-coach-ready').click();
  expect(await page.evaluate(() => app.save.onboarding.seenModes)).toContain('1v1_cpu');
  await page.locator('#btn-coach').click();
  await expect(page.locator('#modal-coach')).toBeVisible();
  await page.locator('[data-close="modal-coach"]').click();
  expect(await page.evaluate(() => app.paused)).toBe(false);
});

test('P3 uses an item without pausing, and 2v2 labels identify the actual squad', async ({ page }) => {
  await boot(page);
  await start(page, '2v2');
  await page.evaluate(() => {
    app.match.phase = 'playing';
    app.match.players.find(player => player.controlSlot === 2).heldItem = 'SuperStar';
  });
  await page.keyboard.press('KeyP');
  await expect.poll(() => page.evaluate(() => app.match.players.find(player => player.controlSlot === 2).stats.itemsUsed)).toBe(1);
  expect(await page.evaluate(() => app.paused)).toBe(false);
  await expect(page.locator('#hud-right-sub')).toContainText('P2 & P4');
  await expect(page.locator('#hud-mode-tag')).toHaveText('4P COUCH 2v2');
});

test('a brief input at 240Hz is preserved until the next physics step', async ({ page }) => {
  await boot(page);
  await start(page);
  const result = await page.evaluate(() => {
    const player = app.match.players[0];
    app.match.phase = 'playing';
    player.onGround = true;
    player.y = app.match.arena.pitchFloorY - player.halfH;
    app.accumulator = 0;
    app.input.clearAll();
    app.input.keysJustPressed.add('KeyW');
    app.input.keysDown.add('KeyW');
    const before = player.stats.jumps;
    app._stepMatch(1 / 240);
    app.input.endFrame();
    app._stepMatch(1 / 240);
    const after = player.stats.jumps;
    app.input.endFrame();
    app._stepMatch(1 / 60);
    return { before, after, final: player.stats.jumps };
  });
  expect(result.after).toBe(result.before + 1);
  expect(result.final).toBe(result.after);
});

test('leaving or restarting an ended match cannot receive stale results', async ({ page }) => {
  await boot(page);
  await start(page);
  await page.evaluate(() => {
    app.match._finishMatch();
    app.startMatch();
  });
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => app.screen)).toBe('match');
  expect(await page.evaluate(() => app.save.stats.matchesPlayed)).toBe(0);
});

test('hitstop buffers a press instead of discarding it', async ({ page }) => {
  await boot(page);
  await start(page);
  const count = await page.evaluate(() => {
    app.match.phase = 'playing';
    app.match.hitstopTimer = 0.025;
    app.accumulator = 0;
    app.input.clearAll();
    app.input.keysJustPressed.add('ShiftLeft');
    app._stepMatch(1 / 120);
    app.input.endFrame();
    for (let frame = 0; frame < 5; frame++) app._stepMatch(1 / 120);
    return app.match.players[0].stats.dashes;
  });
  expect(count).toBe(1);
});

test('keyboard prompts switch to the player who is actually pressing keys', async ({ page }) => {
  await boot(page);
  await start(page, '1v1_pvp');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#controls-toast')).toContainText('KEYBOARD / P2');
  await expect(page.locator('#controls-toast')).toContainText('ENTER');
});

test('gameplay captures mapped shortcuts without breaking Space activation in dialogs', async ({ page }) => {
  await boot(page);
  await start(page);
  expect(await page.evaluate(() => {
    const event = new KeyboardEvent('keydown', { code: 'KeyW', ctrlKey: true, cancelable: true, bubbles: true });
    window.dispatchEvent(event);
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyW', bubbles: true }));
    return event.defaultPrevented;
  })).toBe(true);
  await page.locator('#btn-pause').click();
  await page.locator('#btn-resume').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#modal-pause')).toBeHidden();
  expect(await page.evaluate(() => app.paused)).toBe(false);
});

test('native fullscreen exit does not leave a fake fullscreen state behind', async ({ page }) => {
  await boot(page);
  await page.locator('#btn-fullscreen').click();
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(true);
  await page.evaluate(() => document.exitFullscreen());
  await expect.poll(() => page.evaluate(() => app.touch.isFullscreen())).toBe(false);
  expect(await page.locator('body').evaluate(body => body.classList.contains('fullscreen-mode'))).toBe(false);
});

test('reduced motion is live and preserves visible expiring hazards', async ({ page }) => {
  await boot(page);
  await start(page);
  const result = await page.evaluate(() => {
    app.match.addShake(24);
    app.match.cameraZoom = 1.12;
    app.match.cameraFocusX = 1180;
    app.settings.motion = 'reduced';
    app._applyPreferences();
    app.match.addShake(24);
    const calls = [];
    const original = app.art.drawItemIcon;
    app.art.drawItemIcon = (...args) => { calls.push(args[1]); };
    app.art.drawShellEntity(app.ctx, { x: 400, y: 800, radius: 32, timer: 1 }, 0);
    app.art.drawItemIcon = original;
    return { shake: app.match.shakeMag, shellVisible: calls.includes('GreenShell'),
      motion: document.body.dataset.motion, zoom: app.match.cameraZoom, focus: app.match.cameraFocusX };
  });
  expect(result).toEqual({ shake: 0, shellVisible: true, motion: 'reduced', zoom: 1, focus: 960 });
});

test('all dialogs remain horizontally contained on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await boot(page);
  for (const id of ['btn-mode-cups', 'btn-mode-tourney', 'btn-mode-trials', 'btn-mode-arcade',
    'btn-mode-mutators', 'btn-open-locker', 'btn-open-options', 'btn-open-controls', 'btn-open-codex']) {
    await page.locator(`#${id}`).click();
    const overflow = await page.locator('.modal-backdrop:not(.hidden) .modal-box').evaluate(box => box.scrollWidth > box.clientWidth + 1);
    expect(overflow, id).toBe(false);
    await page.keyboard.press('Escape');
    await expect(page.locator('.modal-backdrop:not(.hidden)')).toHaveCount(0);
  }
});

test('practice completion uses real movement, jump, kick, dash and item actions without rewards', async ({ page }, info) => {
  await boot(page);
  const coins = await page.evaluate(() => app.save.coins);
  await page.locator('#btn-start-practice').click();
  await page.waitForFunction(() => app.match.phase === 'playing');
  await page.keyboard.down('KeyD');
  await expect.poll(() => page.evaluate(() => app.practice.step)).toBe(1);
  await page.keyboard.up('KeyD');
  await page.keyboard.press('KeyW', { delay: 70 });
  await expect.poll(() => page.evaluate(() => app.practice.step)).toBe(2);
  await page.keyboard.press('Space', { delay: 70 });
  await expect.poll(() => page.evaluate(() => app.practice.step)).toBe(3);
  await page.keyboard.press('ShiftLeft');
  await expect.poll(() => page.evaluate(() => app.practice.step)).toBe(4);
  await page.keyboard.press('KeyE');
  await expect.poll(() => page.evaluate(() => app.practice.complete)).toBe(true);
  expect(await page.evaluate(() => app.save.onboarding.completed)).toBe(true);
  expect(await page.evaluate(() => app.save.coins)).toBe(coins);
  expect(await page.evaluate(() => app.save.stats.matchesPlayed)).toBe(0);
  await page.waitForFunction(() => app.match.bannerTimer <= 0);
  expect(await overlaps(page, '#practice-coach', '#pitch-viewport')).toBe(false);
  await page.screenshot({ path: info.outputPath('practice.png') });
  await page.locator('#btn-finish-practice').click();
  await expect(page.locator('#screen-select')).toBeVisible();
});

test('all stadiums, characters, kits and moving entities render with bounded caches', async ({ page }, info) => {
  await boot(page);
  await start(page);
  for (let index = 0; index < 12; index++) {
    await page.evaluate(index => {
      app.charIdx0 = index;
      app.kitIdx0 = index % 3;
      app.arenaIdx = index % 7;
      app.startMatch();
      app.match.phase = 'playing';
      app.match.bannerTimer = 0;
      app.match.players[0].hyperReady = true;
      if (app.match.icicles) app.match.icicles[0].state = 'warn';
      if (app.match.lavaVents) app.match.lavaVents[0].state = 'warn';
    }, index);
    await page.waitForFunction(() => app.art.pendingAssets === 0);
    await page.evaluate(() => {
      const player = app.match.players[0];
      for (let frame = 0; frame < 200; frame++) {
        player.animPhase = frame / 24;
        player.onGround = true;
        player.vx = 300;
        player.dashGhosts = [{ x: player.x - 12, y: player.y, alpha: 0.6 }];
        app._renderMatchCanvas();
      }
    });
    expect(await page.evaluate(() => app.art._frameCache.size)).toBeLessThanOrEqual(192);
    expect(await page.evaluate(() => app.art._charUse.size)).toBeLessThanOrEqual(6);
  }
  expect(await page.evaluate(() => app.art.failedAssets)).toEqual([]);
  await page.screenshot({ path: info.outputPath('stadium.png') });
});

test('field proportions shrink the roster without shrinking previews or their foot anchors', async ({ page }, info) => {
  await boot(page);
  await start(page);
  const measurements = await page.evaluate(async () => {
    const { CHARACTERS } = await import('/src/config.js');
    const { CHAR_SPRITE_METRICS } = await import('/src/art.js');
    const art = app.art;
    const originalSheet = art._getCharSheet;
    const originalFrame = art._drawCharFrame;
    const records = [];
    try {
      art._getCharSheet = () => ({});
      for (const character of CHARACTERS) {
        const player = { ...app.match.players[0], char: character, onGround: true,
          vx: 0, vy: 0, visualScale: 1, squashX: 1, squashY: 1,
          chargeTime: 0, hyperReady: false, dashGhosts: [], kickTimer: 0, stunTimer: 0 };
        const calls = [];
        art._drawCharFrame = (ctx, ch, col, row, x, y, width, height) => calls.push({ y, width, height });
        art.drawCharacterPuppet(app.ctx, player, [], 0, { onField: true });
        const field = calls.at(-1);
        art.drawCharacterPuppet(app.ctx, player, [], 0);
        const preview = calls.at(-1);
        records.push({ id: character.id, field: field.width, preview: preview.width,
          foot: field.y + field.height * CHAR_SPRITE_METRICS[character.id].footY });
      }
    } finally {
      art._getCharSheet = originalSheet;
      art._drawCharFrame = originalFrame;
    }
    return records;
  });
  for (const measurement of measurements) {
    expect(measurement.field, measurement.id).toBe(128);
    expect(measurement.field, measurement.id).toBeLessThan(measurement.preview);
    expect(measurement.foot, measurement.id).toBeCloseTo(52);
  }
  await page.evaluate(() => {
    app.charIdx1 = 5;
    app.startMatch();
    app.paused = true;
    const match = app.match;
    match.phase = 'playing';
    match.bannerTimer = 0;
    match.time = 0;
    match.players.forEach(player => {
      player.y = match.arena.pitchFloorY - player.halfH;
      player.onGround = true;
      player.vx = 0;
      player.vy = 0;
    });
    match.players[0].heldItem = 'RedMushroom';
    match.players[1].heldItem = 'TinyMushroom';
    match._updateCourier(0);
    match.courier.heldItemId = 'TinyMushroom';
    Object.assign(match.balls[0], { x: 960, y: 750, vx: 0, vy: 0 });
    app._renderMatchCanvas();
  });
  await page.waitForFunction(() => app.art.pendingAssets === 0);
  await page.screenshot({ path: info.outputPath('field-proportions-desktop.png') });
});

test('item artwork fills its intended radius and Lakitu is fifty percent larger', async ({ page }) => {
  await boot(page);
  const result = await page.evaluate(async () => {
    const { ITEMS } = await import('/src/config.js');
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const dimensions = [];
    for (const item of ITEMS) {
      ctx.clearRect(0, 0, 128, 128);
      app.art.drawItemIcon(ctx, item.id, 64, 64, 40, 0);
      const pixels = ctx.getImageData(0, 0, 128, 128).data;
      let left = 128, right = 0, top = 128, bottom = 0;
      for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
        if (pixels[(y * 128 + x) * 4 + 3] > 20) {
          left = Math.min(left, x); right = Math.max(right, x);
          top = Math.min(top, y); bottom = Math.max(bottom, y);
        }
      }
      dimensions.push({ id: item.id, size: Math.max(right - left + 1, bottom - top + 1) });
    }
    let courierWidth = 0;
    const draw = ctx.drawImage.bind(ctx);
    ctx.drawImage = (image, ...args) => {
      if (image === app.art.sprites.props_atlas) courierWidth = args[6] * ctx.getTransform().a;
      draw(image, ...args);
    };
    app.art.drawCloudCourier(ctx, { active: true, x: 64, y: 64, vx: 0, heldItemId: null }, 0);
    return { dimensions, courierWidth };
  });
  for (const item of result.dimensions) {
    expect(item.size, item.id).toBeGreaterThanOrEqual(70);
    expect(item.size, item.id).toBeLessThanOrEqual(86);
  }
  expect(result.courierWidth).toBe(180);
});

test('all existing mode families launch through their menu flows', async ({ page }) => {
  await boot(page);
  await page.locator('#btn-mode-cups').click();
  await page.locator('.cup-card').first().getByRole('button', { name: 'ENTER' }).click();
  await page.locator('#btn-start-match').click();
  expect(await page.evaluate(() => app.match.mode)).toBe('cup');
  await page.evaluate(() => app._showScreen('menu'));
  await page.locator('#btn-mode-trials').click();
  await page.locator('.trial-card').nth(4).getByRole('button', { name: 'PLAY' }).click();
  expect(await page.evaluate(() => app.match.trial.id)).toBe('trial_lava');
  await expect(page.locator('#trial-objective')).toContainText('Lava touches 0');
  await page.evaluate(() => app._showScreen('menu'));
  await page.locator('#btn-mode-tourney').click();
  await page.locator('#btn-play-tourney-match').click();
  expect(await page.evaluate(() => app.match.mode)).toBe('tourney');
  for (const mode of ['target_blitz', 'keep_up', 'goalie_gauntlet']) {
    await page.evaluate(() => app._showScreen('menu'));
    await page.locator('#btn-mode-arcade').click();
    await page.locator(`[data-minigame="${mode}"] button`).click();
    await page.locator('#btn-start-match').click();
    expect(await page.evaluate(() => app.match.mode)).toBe(mode);
  }
});

test('all five 2v2 formats preserve distinct human input slots', async ({ page }) => {
  await boot(page);
  for (const [format, humans] of [['4p', 4], ['3p', 3], ['duel', 2], ['coop', 2], ['solo', 1]]) {
    const slots = await page.evaluate(format => {
      app.selectedMode = '2v2';
      app.twoVsTwoFormat = format;
      app.startMatch();
      return app.match.players.filter(player => !player.isAI).map(player => player.controlSlot);
    }, format);
    expect(slots).toHaveLength(humans);
    expect(new Set(slots).size).toBe(humans);
  }
});

test('gamepad-only menus and sparse ports work together', async ({ page }) => {
  await boot(page);
  await page.evaluate(() => {
    window.testPad = { index: 3, connected: true, mapping: 'standard', axes: [0, 0],
      buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) };
    Object.defineProperty(navigator, 'getGamepads', { configurable: true, value: () => [null, null, null, window.testPad] });
  });
  const press = async index => {
    await page.evaluate(index => { testPad.buttons[index] = { pressed: true, value: 1 }; }, index);
    await page.waitForTimeout(60);
    await page.evaluate(index => { testPad.buttons[index] = { pressed: false, value: 0 }; }, index);
    await page.waitForTimeout(40);
  };
  await press(0);
  await expect(page.locator('#screen-select')).toBeVisible();
  await press(9);
  expect(await page.evaluate(() => app.screen)).toBe('match');
  await expect(page.locator('#controls-toast')).toContainText('GAMEPAD');
  await press(9);
  await expect(page.locator('#modal-pause')).toBeVisible();
  await press(0);
  await expect(page.locator('#modal-pause')).toBeHidden();
  await page.evaluate(() => { testPad.connected = false; });
  await expect(page.locator('#modal-pause')).toBeVisible();
});

test('music arrangements, ambience, palettes and audio voice limits work in Web Audio', async ({ page }) => {
  await boot(page, { muted: false });
  await page.locator('[data-mode="1v1_cpu"]').click();
  await page.locator('#btn-start-match').click();
  await expect.poll(() => page.evaluate(() => app.audio.ctx?.state)).toBe('running');
  const result = await page.evaluate(() => {
    const audio = app.audio;
    for (const style of ['stadium', 'club', 'chill']) {
      audio.settings.musicStyle = style;
      for (const track of ['menu', 'victory', 'meadow', 'sky', 'castle', 'manor', 'jungle', 'glacier', 'cosmos']) {
        for (let step = 0; step < 32; step++) {
          audio.phrase = Math.floor(step / 8);
          audio._playMusicStep(track, step);
          audio._playArrangement(track, step);
        }
      }
    }
    for (const palette of ['arcade', 'punchy', 'soft']) {
      audio.settings.soundPalette = palette;
      audio.playBallKick(1, true);
      audio.playGroundPoundImpact();
      audio.playCoachCue();
    }
    audio.syncVolumes();
    const voices = audio.voices.size;
    audio.setPaused(true);
    const musicAfterPause = [...audio.voices].filter(voice => voice.music).length;
    audio.setPaused(false);
    return { voices, musicAfterPause, ambience: audio.ambienceGain !== null };
  });
  expect(result.voices).toBeLessThanOrEqual(64);
  expect(result.musicAfterPause).toBe(0);
  expect(result.ambience).toBe(true);
});

test('missing assets produce a visible error instead of silently appearing loaded', async ({ page }) => {
  await page.route('**/assets/sprites/char_mario.png', route => route.abort());
  await boot(page);
  await page.locator('[data-mode="1v1_cpu"]').click();
  await expect(page.locator('#asset-status')).toContainText('Could not load char_mario');
});

test('offline file launch has no external font or runtime dependency', async ({ page }) => {
  const remoteRequests = [];
  page.on('request', request => { if (/^https?:/.test(request.url())) remoteRequests.push(request.url()); });
  await page.context().setOffline(true);
  await page.goto(pathToFileURL(path.resolve('index.html')).href);
  await page.waitForFunction(() => window.app && app.art.pendingAssets === 0);
  await page.locator('[data-mode="1v1_cpu"]').click();
  await page.waitForFunction(() => app.art.pendingAssets === 0);
  expect(await page.evaluate(() => app.art.failedAssets)).toEqual([]);
  expect(remoteRequests).toEqual([]);
});

test.describe('touch play', () => {
  test.use({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });

  test('controls stay outside the field, release after a captured drag, and pause correctly', async ({ page }, info) => {
    await boot(page, { touchControls: 'on' });
    await start(page);
    await expect(page.locator('#touch-controls')).toBeVisible();
    expect(await overlaps(page, '#touch-stick-zone', '#pitch-viewport')).toBe(false);
    expect(await overlaps(page, '#touch-action-cluster', '#pitch-viewport')).toBe(false);
    const stick = await page.locator('#touch-stick-zone').boundingBox();
    await page.mouse.move(stick.x + stick.width / 2, stick.y + stick.height / 2);
    await page.mouse.down();
    await page.mouse.move(stick.x + stick.width + 90, stick.y + 40);
    await page.mouse.up();
    expect(await page.evaluate(() => app.input.touchState.right)).toBe(false);
    await page.evaluate(() => {
      app.match.courier.heldItemId = 'TinyMushroom';
      app.match.players[0].heldItem = 'RedMushroom';
    });
    await page.screenshot({ path: info.outputPath('touch-match.png') });
    await page.locator('#touch-btn-pause').dispatchEvent('pointerdown', { pointerId: 7, pointerType: 'touch' });
    await expect(page.locator('#modal-pause')).toBeVisible();
    await page.locator('#btn-resume').click();
    expect(await page.evaluate(() => app.paused)).toBe(false);
    await page.evaluate(() => {
      app.input.setTouchAction('strike', true);
      app.settings.touchControls = 'off';
      app.touch.updateVisibility();
    });
    expect(await page.evaluate(() => app.input.touchState.kickDown)).toBe(false);
    await expect(page.locator('#btn-pause')).toBeVisible();
  });
});
