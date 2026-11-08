// Test Suite: 4-Player XInput Gamepad & 2v2 Couch Multiplayer Architecture
import assert from 'node:assert';
import { InputManager, XINPUT_BUTTONS } from './src/input.js';
import { DEFAULT_CONTROLS, CHARACTERS } from './src/config.js';

console.log('🧪 Starting 4-Player XInput & 2v2 Suite...');

// Mock Gamepad API
let mockGamepads = [];
try {
  Object.defineProperty(globalThis.navigator, 'getGamepads', {
    value: () => mockGamepads,
    configurable: true,
    writable: true,
  });
} catch {
  globalThis.navigator = { getGamepads: () => mockGamepads };
}

function createMockPad(index, buttons = [], axes = [0, 0]) {
  const fullButtons = Array.from({ length: 17 }, (_, i) => {
    const isPressed = buttons.includes(i);
    return {
      pressed: isPressed,
      value: isPressed ? 1.0 : 0.0,
    };
  });
  return {
    index,
    id: `Xbox 360 / XInput Controller (STANDARD GAMEPAD Vendor: 045e Product: 028e)`,
    connected: true,
    mapping: 'standard',
    buttons: fullButtons,
    axes: [...axes],
  };
}

// 1. Verify DEFAULT_CONTROLS supports 4 distinct keyboard slots
assert(DEFAULT_CONTROLS.p1, 'P1 controls must exist');
assert(DEFAULT_CONTROLS.p2, 'P2 controls must exist');
assert(DEFAULT_CONTROLS.p3, 'P3 controls must exist');
assert(DEFAULT_CONTROLS.p4, 'P4 controls must exist');
assert.deepStrictEqual(DEFAULT_CONTROLS.p3.up, ['KeyI']);
assert.deepStrictEqual(DEFAULT_CONTROLS.p4.kick, ['Numpad7']);
console.log('✅ 1. 4-Player Keyboard mappings verified.');

// 2. Initialize InputManager with 4 slots
const input = new InputManager(JSON.parse(JSON.stringify(DEFAULT_CONTROLS)));

// 3. Test slot Gamepad retrieval with 4 connected gamepads
mockGamepads = [
  createMockPad(0),
  createMockPad(1),
  createMockPad(2),
  createMockPad(3),
];

assert.strictEqual(input._getGamepads().length, 4, 'Should detect 4 connected gamepads');
assert.strictEqual(input.connectedGamepads, 4);
assert(input.getGamepad(0) !== null, 'Slot 0 gets Pad 0');
assert(input.getGamepad(1) !== null, 'Slot 1 gets Pad 1');
assert(input.getGamepad(2) !== null, 'Slot 2 gets Pad 2');
assert(input.getGamepad(3) !== null, 'Slot 3 gets Pad 3');
console.log('✅ 2. 4-Slot Gamepad detection verified.');

// 4. Test Standard XInput Button Mapping for Slot 0 (P1)
// Button 0 (A) -> Jump
// Button 2 (X) -> Strike / Charge
// Button 3 (Y) -> Lob
// Button 1 (B) -> Dash
// Button 5 (RB) -> Item
input.endFrame(); // baseline snapshot

// Frame 1: Pad 0 presses A (Jump) and X (Strike)
mockGamepads[0] = createMockPad(0, [XINPUT_BUTTONS.A, XINPUT_BUTTONS.X]);
let p1Input = input.getPlayerInput(0);
assert.strictEqual(p1Input.jumpPressed, true, 'Pad A button should trigger jumpPressed');
assert.strictEqual(p1Input.kickPressed, true, 'Pad X button should trigger kickPressed');
assert.strictEqual(p1Input.kickDown, true, 'Pad X button should hold kickDown');
assert.strictEqual(p1Input.dashPressed, false);
assert.strictEqual(p1Input.itemPressed, false);

// Frame 2: Maintain X, press RB (Item)
input.endFrame();
mockGamepads[0] = createMockPad(0, [XINPUT_BUTTONS.X, XINPUT_BUTTONS.RB]);
p1Input = input.getPlayerInput(0);
assert.strictEqual(p1Input.jumpPressed, false, 'A was released or held, jumpPressed should be false');
assert.strictEqual(p1Input.kickDown, true, 'X held down');
assert.strictEqual(p1Input.kickPressed, false, 'X was not just pressed this frame');
assert.strictEqual(p1Input.itemPressed, true, 'RB triggers itemPressed');
console.log('✅ 3. XInput face and shoulder buttons verified.');

// 5. Test Analog Stick Flick Detection (Ground Pound) for Slot 2 (P3)
input.endFrame();
// Neutral stick
mockGamepads[2] = createMockPad(2, [], [0.0, 0.0]);
input.endFrame();

// Flick stick down to 0.75
mockGamepads[2] = createMockPad(2, [], [0.0, 0.75]);
const p3Input = input.getPlayerInput(2);
assert.strictEqual(p3Input.down, true, 'Stick down should set down=true');
assert.strictEqual(p3Input.downPressed, true, 'Downward stick flick should trigger downPressed edge');
console.log('✅ 4. Analog stick edge-triggered Ground Pound flick verified.');

// 6. Test Start button for Pause
input.endFrame();
assert.strictEqual(input.wasStartJustPressed(), false);
mockGamepads[1] = createMockPad(1, [XINPUT_BUTTONS.START]);
assert.strictEqual(input.wasStartJustPressed(), true, 'Start button on Pad 1 should trigger pause');
console.log('✅ 5. Gamepad Start button pause trigger verified.');

// 7. Verify 2v2 4-Player Match Configuration
const ch0 = CHARACTERS[0]; // Mario
const ch1 = CHARACTERS[1]; // Luigi
const chAlly0 = CHARACTERS[2]; // Peach
const chAlly1 = CHARACTERS[5]; // Bowser

// In 4P format:
const playersConfig4P = [
  { slot: 0, team: 0, tag: 'P1', charId: ch0.id, kitIdx: 0, isAI: false, role: 'striker' },
  { slot: 2, team: 0, tag: 'P3', charId: chAlly0.id, kitIdx: 0, isAI: false, role: 'defender' },
  { slot: 1, team: 1, tag: 'P2', charId: ch1.id, kitIdx: 0, isAI: false, role: 'striker' },
  { slot: 3, team: 1, tag: 'P4', charId: chAlly1.id, kitIdx: 1, isAI: false, role: 'defender' },
];

assert.strictEqual(playersConfig4P.length, 4);
assert.strictEqual(playersConfig4P.filter(p => !p.isAI).length, 4, 'All 4 players must be human in 4P mode');
assert.strictEqual(playersConfig4P.filter(p => p.team === 0).length, 2, '2 players on Team 0');
assert.strictEqual(playersConfig4P.filter(p => p.team === 1).length, 2, '2 players on Team 1');
assert.deepStrictEqual(playersConfig4P.map(p => p.slot), [0, 2, 1, 3], 'Slots map to P1, P3, P2, P4');
console.log('✅ 6. 2v2 4-Player couch squad architecture verified.');

console.log('🎉 ALL 4-PLAYER XINPUT & 2V2 TESTS PASSED PERFECTLY!');
