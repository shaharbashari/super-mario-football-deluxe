import { test, expect } from '@playwright/test';

async function player(browser, name, errors, charId = 'mario') {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
  await page.addInitScript(() => localStorage.setItem('super_kick_kingdom_deluxe_v2', JSON.stringify({ settings: { muted: true, showTips: false } })));
  await page.goto('http://127.0.0.1:8766/');
  await page.waitForFunction(() => window.app && app.art.pendingAssets === 0);
  await page.locator('#btn-mode-online').click();
  await page.locator('#online-name').fill(name);
  await page.locator('#online-char').selectOption(charId);
  return { context, page };
}

async function create(host) {
  await host.locator('#online-create').click();
  await expect(host.locator('#online-room-code')).toHaveText(/^[A-HJ-NP-Z2-9]{6}$/, { timeout: 30000 });
  return host.locator('#online-room-code').textContent();
}

async function join(page, code) {
  await page.locator('#online-code-input').fill(code.toLowerCase());
  await page.locator('#online-join').click();
  await expect(page.locator('#online-room-code')).toHaveText(code, { timeout: 30000 });
}

async function ready(page) {
  await page.waitForFunction(() => app.art.pendingAssets === 0);
  await page.locator('#online-ready').click();
}

test('real room-code 1v1 synchronizes input, pauses, results, rematches and disconnects', async ({ browser }, info) => {
  const errors = [];
  const host = await player(browser, 'Host', errors);
  const guest = await player(browser, 'Guest', errors, 'luigi');
  try {
    await host.page.evaluate(() => { app._startPractice(); app.online.open(); });
    const code = await create(host.page);
    await join(guest.page, code);
    await expect(guest.page.locator('#online-arena')).toBeDisabled();
    await expect(host.page.locator('.online-player')).toHaveCount(2);
    await ready(host.page);
    await ready(guest.page);
    await expect(host.page.locator('#online-start')).toBeEnabled();
    await host.page.screenshot({ path: info.outputPath('room-lobby.png') });
    await host.page.locator('#online-start').click();
    await host.page.waitForFunction(() => app.match?.phase === 'playing');
    await guest.page.waitForFunction(() => app.match?.phase === 'playing');
    await expect(host.page.locator('#practice-coach')).toBeHidden();
    await expect(guest.page.locator('#controls-toast')).toContainText('P2');
    await guest.page.locator('#btn-coach').click();
    await expect(guest.page.locator('#coach-dialogue')).toContainText('P2 and P4 defend the right');
    await expect(guest.page.locator('#btn-coach-practice')).toBeHidden();
    await expect.poll(() => host.page.evaluate(() => app.paused)).toBe(true);
    await guest.page.locator('#btn-coach-ready').click();
    await expect.poll(() => guest.page.evaluate(() => app.paused)).toBe(false);
    const startX = await host.page.evaluate(() => app.match.players[1].x);
    await guest.page.keyboard.down('KeyA');
    await expect.poll(() => host.page.evaluate(() => app.match.players[1].x)).toBeLessThan(startX - 40);
    await guest.page.keyboard.up('KeyA');
    await expect.poll(async () => {
      const [a, b] = await Promise.all([
        host.page.evaluate(() => app.match.players[1].x),
        guest.page.evaluate(() => app.match.players[1].x),
      ]);
      return Math.abs(a - b);
    }).toBeLessThan(80);
    await guest.page.locator('#btn-pause').click();
    await expect.poll(() => host.page.evaluate(() => app.paused)).toBe(true);
    await host.page.locator('#btn-pause').click();
    await guest.page.locator('#btn-resume').click();
    await expect.poll(() => guest.page.evaluate(() => app.paused)).toBe(true);
    await host.page.locator('#btn-resume').click();
    await expect.poll(() => guest.page.evaluate(() => app.paused)).toBe(false);
    await guest.page.screenshot({ path: info.outputPath('online-guest-match.png') });
    await host.page.evaluate(() => {
      const match = app.match;
      match.scores[0] = 4;
      const ball = match.balls[0];
      ball.lastKicker = match.players[0];
      ball.lastTeam = 0;
      match._handleGoalScored(0, ball);
    });
    await expect(host.page.locator('#online-result')).toContainText('5 — 0');
    await expect(guest.page.locator('#online-result')).toContainText('5 — 0');
    for (const page of [host.page, guest.page]) {
      expect(await page.evaluate(() => app.save.coins)).toBe(150);
      expect(await page.evaluate(() => app.save.stats.matchesPlayed)).toBe(0);
      await ready(page);
    }
    await host.page.locator('#online-start').click();
    await expect.poll(() => guest.page.evaluate(() => app.online.room.matchId)).toBe(2);
    await guest.context.close();
    await expect(host.page.locator('#modal-online')).toBeVisible({ timeout: 11000 });
    await expect(host.page.locator('#online-status')).toContainText('canceled');
    await host.page.locator('#online-leave').click();
    await expect(host.page.locator('#screen-menu')).toBeVisible();
    expect(errors).toEqual([]);
  } finally {
    await host.context.close();
    await guest.context.close();
  }
});

test('four real peers share a 2v2 room and control their assigned striker', async ({ browser }, info) => {
  const errors = [], clients = [];
  try {
    for (const [name, charId] of [['Host', 'mario'], ['Guest Two', 'luigi'], ['Guest Three', 'peach'], ['Guest Four', 'yoshi']]) {
      clients.push(await player(browser, name, errors, charId));
    }
    const host = clients[0].page;
    const code = await create(host);
    await host.locator('#online-format').selectOption('doubles');
    for (const client of clients.slice(1)) await join(client.page, code);
    await expect(host.locator('.online-player')).toHaveCount(4);
    for (const client of clients) await ready(client.page);
    await expect(host.locator('#online-start')).toBeEnabled();
    await host.screenshot({ path: info.outputPath('online-2v2-lobby.png') });
    await host.locator('#online-start').click();
    for (const client of clients) await client.page.waitForFunction(() => app.match?.phase === 'playing' && app.match.players.length === 4);
    expect(await host.evaluate(() => app.match.players.every(player => !player.isAI))).toBe(true);
    await host.evaluate(() => { app.match.players.find(player => player.slot === 2).heldItem = 'SuperStar'; });
    await clients[2].page.waitForFunction(() => app.match.players.find(player => player.slot === 2)?.heldItem === 'SuperStar');
    await clients[2].page.keyboard.press('KeyE');
    await expect.poll(() => host.evaluate(() => app.match.players.find(player => player.slot === 2).stats.itemsUsed)).toBe(1);
    await expect(clients[2].page.locator('#controls-toast')).toContainText('P3');
    await clients[3].page.screenshot({ path: info.outputPath('online-2v2-match.png') });
    await host.locator('#btn-pause').click();
    await host.locator('#btn-pause-quit').click();
    await expect(host.locator('#screen-menu')).toBeVisible();
    for (const client of clients.slice(1)) {
      await expect(client.page.locator('#modal-online')).toBeVisible({ timeout: 11000 });
      await expect(client.page.locator('#online-status')).toContainText(/host/i);
    }
    expect(errors).toEqual([]);
  } finally {
    for (const client of clients) await client.context.close();
  }
});
