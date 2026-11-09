import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSaveData, normalizeSettings, loadSaveData, saveData, STORAGE_KEY } from '../src/config.js';

test('malformed saves retain valid unlocks without trusting field shapes', () => {
  const save = normalizeSaveData({
    coins: -50, unlockedChars: ['toad', 'missing'], trophies: 'bad',
    stats: { keepUpBestTime: 'NaN', matchesPlayed: 9 },
    settings: { musicVolume: 42, activeMutators: 'bad', ballPreset: 'missing', muted: 'yes' },
    controls: { p1: { up: 'bad', kick: ['KeyZ', '<script>', 'KeyZ'] } },
  });
  assert.ok(save.unlockedChars.includes('toad'));
  assert.equal(save.unlockedChars.includes('missing'), false);
  assert.deepEqual(save.trophies, []);
  assert.equal(save.coins, 0);
  assert.equal(save.stats.matchesPlayed, 9);
  assert.equal(save.stats.keepUpBestTime, 0);
  assert.equal(save.settings.musicVolume, 1);
  assert.equal(save.settings.ballPreset, 'balanced');
  assert.equal(save.settings.muted, false);
  assert.deepEqual(save.controls.p1.kick, ['KeyZ']);
});

test('settings contain independent audio, help and motion options', () => {
  const settings = normalizeSettings({ musicStyle: 'chill', soundPalette: 'soft', motion: 'reduced', showTips: false });
  assert.equal(settings.musicStyle, 'chill');
  assert.equal(settings.motion, 'reduced');
  assert.equal(settings.showTips, false);
  assert.ok(settings.ambienceVolume >= 0 && settings.ambienceVolume <= 1);
});

test('invalid JSON is reported and backed up before a replacement save', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const store = new Map([[STORAGE_KEY, '{broken']]);
  const warnings = [];
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: key => store.get(key), setItem: (key, value) => store.set(key, value) },
  });
  try {
    const save = loadSaveData(message => warnings.push(message));
    assert.equal(warnings.length, 1);
    assert.equal(saveData(save), true);
    assert.equal(store.get(`${STORAGE_KEY}_recovery`), '{broken');
    assert.equal(JSON.parse(store.get(STORAGE_KEY)).coins, 150);
    globalThis.localStorage.setItem = () => { throw new Error('Storage blocked'); };
    assert.equal(saveData(save, message => warnings.push(message)), false);
    assert.match(warnings.at(-1), /could not be saved/);
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else delete globalThis.localStorage;
  }
});
