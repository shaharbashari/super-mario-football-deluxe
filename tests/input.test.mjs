import test from 'node:test';
import assert from 'node:assert/strict';
import { InputManager } from '../src/input.js';
import { DEFAULT_CONTROLS } from '../src/config.js';

const make = () => new InputManager(structuredClone(DEFAULT_CONTROLS));
const pad = (index, pressed = []) => ({
  index, connected: true, mapping: 'standard', axes: [0, 0],
  buttons: Array.from({ length: 17 }, (_, i) => ({ pressed: pressed.includes(i), value: pressed.includes(i) ? 1 : 0 })),
});

test('sparse gamepad ports are distinct and assignments survive another pad disconnecting', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  let pads = [null, pad(1), null, pad(3)];
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { getGamepads: () => pads } });
  try {
    const input = make();
    assert.equal(input.getGamepad(0).index, 1);
    assert.equal(input.getGamepad(1).index, 3);
    assert.equal(input.getGamepad(2), null);
    input.endFrame();
    pads = [null, null, null, pad(3, [0])];
    assert.equal(input.getGamepad(0), null);
    assert.equal(input.getGamepad(1).index, 3);
    assert.equal(input.getPlayerInput(1).jumpPressed, true);
    assert.equal(input.getPlayerInput(0).jumpPressed, false);
    pads[1] = pad(1);
    assert.equal(input.getGamepad(0).index, 1);
    assert.equal(input.getGamepad(1).index, 3);
  } finally {
    if (original) Object.defineProperty(globalThis, 'navigator', original);
    else delete globalThis.navigator;
  }
});

test('touch jump, joystick and D-pad have independent ownership', () => {
  const input = make();
  input.setTouchAction('jump', true);
  input.endFrame();
  input.setTouchVector(1, 0);
  assert.equal(input.getPlayerInput(0).jumpHeld, true);
  assert.equal(input.getPlayerInput(0).jumpReleased, false);
  assert.equal(input.getPlayerInput(0).up, false);
  input.setTouchDirection('right', true);
  input.setTouchVector(0, 0);
  assert.equal(input.getPlayerInput(0).right, true);
  input.setTouchDirection('up', true);
  input.setTouchAction('jump', false);
  assert.equal(input.getPlayerInput(0).jumpHeld, true);
  assert.equal(input.getPlayerInput(0).jumpReleased, false);
  input.clearAll();
  assert.ok(Object.values(input.getPlayerInput(0)).every(value => value === false));
});

test('releasing one strike alias does not release another held alias', () => {
  const input = make();
  input.keysDown.add('KeyF');
  input.keysJustReleased.add('Space');
  assert.equal(input.getPlayerInput(0).kickReleased, false);
});

test('rebinding identifies conflicts and reserves navigation', () => {
  const input = make();
  assert.match(input.bindingConflict('p1', 'kick', 'KeyP'), /P3 item/);
  assert.match(input.bindingConflict('p1', 'kick', 'Escape'), /reserved/);
  assert.equal(input.bindingConflict('p1', 'kick', 'KeyZ'), null);
  assert.equal(input.isBound('KeyP', [0, 2]), true);
  assert.equal(input.isBound('KeyP', [0, 1]), false);
});
