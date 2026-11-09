// Unit & Integration Test Suite for Mobile Touch Controls & Orientation
import assert from 'node:assert';
import { InputManager } from './src/input.js';
import { DEFAULT_CONTROLS } from './src/config.js';
import { TouchController } from './src/touch.js';

console.log('--- Testing InputManager Touch Controls Integration ---');

const input = new InputManager(DEFAULT_CONTROLS);

// Test 1: touchState initialization
assert(input.touchState, 'touchState should exist');
assert.strictEqual(input.touchState.left, false);
assert.strictEqual(input.touchState.right, false);
assert.strictEqual(input.touchState.up, false);
assert.strictEqual(input.touchState.down, false);
console.log('✓ Test 1 Passed: Initial touchState cleanly configured');

// Test 2: Directional Touch Events & Edge Triggers
input.setTouchDirection('up', true);
assert.strictEqual(input.touchState.up, true);
assert.strictEqual(input.touchState.upPressed, true);
assert.strictEqual(input.touchState.jumpPressed, true);

let p1Input = input.getPlayerInput(0);
assert.strictEqual(p1Input.up, true);
assert.strictEqual(p1Input.jumpPressed, true);

// Verify P2/P3/P4 don't get P1's touch
let p2Input = input.getPlayerInput(1);
assert.strictEqual(p2Input.up, false);
assert.strictEqual(p2Input.jumpPressed, false);

input.endFrame();
assert.strictEqual(input.touchState.up, true, 'Sustained hold remains true');
assert.strictEqual(input.touchState.jumpPressed, false, 'Edge trigger cleared after frame');

input.setTouchDirection('up', false);
assert.strictEqual(input.touchState.up, false);
assert.strictEqual(input.touchState.jumpReleased, true);
input.endFrame();
console.log('✓ Test 2 Passed: Directional up/jump press and release working');

// Test 3: Downward Flick (Ground Pound Trigger)
input.setTouchDirection('down', true);
assert.strictEqual(input.touchState.down, true);
assert.strictEqual(input.touchState.downPressed, true, 'Down press triggered for Ground Pound');
p1Input = input.getPlayerInput(0);
assert.strictEqual(p1Input.down, true);
assert.strictEqual(p1Input.downPressed, true);
input.endFrame();
assert.strictEqual(input.touchState.downPressed, false);
input.setTouchDirection('down', false);
assert.strictEqual(input.touchState.downReleased, true);
input.endFrame();
console.log('✓ Test 3 Passed: Downward flick triggers Ground Pound input edge');

// Test 4: Action Buttons (Jump, Strike, Lob, Dash, Item)
input.setTouchAction('jump', true);
assert.strictEqual(input.touchState.jumpHeld, true);
assert.strictEqual(input.touchState.up, false, 'Jump button should not also aim a lob');
assert.strictEqual(input.touchState.jumpPressed, true);
input.endFrame();
input.setTouchAction('jump', false);

input.setTouchAction('strike', true);
assert.strictEqual(input.touchState.kickDown, true);
assert.strictEqual(input.touchState.kickPressed, true);
input.endFrame();
input.setTouchAction('strike', false);
assert.strictEqual(input.touchState.kickReleased, true);

input.setTouchAction('lob', true);
assert.strictEqual(input.touchState.lobDown, true);
assert.strictEqual(input.touchState.lobPressed, true);
input.endFrame();
input.setTouchAction('lob', false);

input.setTouchAction('dash', true);
assert.strictEqual(input.touchState.dashPressed, true);
input.endFrame();

input.setTouchAction('item', true);
assert.strictEqual(input.touchState.itemPressed, true);
input.endFrame();
console.log('✓ Test 4 Passed: Action buttons (Jump, Strike, Lob, Dash, Item) working correctly');

// Test 5: Analog Vector Handling
input.setTouchVector(-0.8, 0); // Left tilt
assert.strictEqual(input.touchState.left, true);
assert.strictEqual(input.touchState.right, false);

input.setTouchVector(0.7, 0.6); // Right + Down tilt
assert.strictEqual(input.touchState.right, true);
assert.strictEqual(input.touchState.down, true);
assert.strictEqual(input.touchState.downPressed, true);
input.endFrame();

input.setTouchVector(0, 0); // Released stick center
assert.strictEqual(input.touchState.left, false);
assert.strictEqual(input.touchState.right, false);
assert.strictEqual(input.touchState.down, false);
assert.strictEqual(input.touchState.downReleased, true);
input.endFrame();
console.log('✓ Test 5 Passed: Analog vector properly updates directions and triggers');

// Test 6: TouchController in simulated environment
const mockApp = {
  screen: 'menu',
  settings: { touchControls: 'auto' },
  togglePause() { this.paused = !this.paused; },
  paused: false
};

const controller = new TouchController(input, mockApp);
assert(controller, 'TouchController should instantiate cleanly');
assert.strictEqual(controller.dismissedPortrait, false);
console.log('✓ Test 6 Passed: TouchController instantiated without DOM errors');

// Test 7: Random Stage Selection in ARENAS
import { ARENAS, CHARACTERS, isCharUnlocked } from './src/config.js';
const randomArena = ARENAS.find((a) => a.id === 'random' || a.isRandom);
assert(randomArena, 'Mystery / Random Stadium should be present in ARENAS');
assert.strictEqual(randomArena.isRandom, true);
assert.strictEqual(ARENAS.length, 8, 'ARENAS should have 8 total options (7 biomes + 1 random)');
console.log('✓ Test 7 Passed: Random Stadium properly configured in ARENAS');

// Test 8: Random Player Selection Logic
const unlocked = CHARACTERS.filter((c) => isCharUnlocked({ unlockedChars: ['mario', 'luigi', 'peach'] }, c.id));
assert(unlocked.length > 0, 'Should have unlocked characters available');
const randomChar = unlocked[Math.floor(Math.random() * unlocked.length)];
assert(['mario', 'luigi', 'peach'].includes(randomChar.id), 'Random picker must respect save unlocks');
console.log('✓ Test 8 Passed: Random Striker selection properly filters unlocked roster');

// Test 9: Fullscreen Toggle Availability
assert.strictEqual(typeof controller.toggleFullscreen, 'function');
assert.strictEqual(typeof controller.isFullscreen, 'function');
console.log('✓ Test 9 Passed: Fullscreen toggle methods verified');

console.log('\nALL 9 MOBILE TOUCH, FULLSCREEN & RANDOM SELECTION TESTS PASSED PERFECTLY!\n');
