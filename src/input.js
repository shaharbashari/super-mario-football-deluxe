// Super Kick Kingdom — Unified Keyboard & Gamepad Input Manager
// Supports 4-Player XInput Couch Multiplayer (P1, P2, P3, P4),
// edge-triggered buffering, analog stick flick detection, charge hold & live rebinding

export const XINPUT_BUTTONS = {
  A: 0,          // Jump / Wall-jump / Accept
  B: 1,          // Dash / Parry / Cancel
  X: 2,          // Strike / Charge
  Y: 3,          // Lob / Uppercut / Kit cycle
  LB: 4,         // Dash / Parry
  RB: 5,         // Power-Up Item
  LT: 6,         // Dash / Parry (analog threshold)
  RT: 7,         // Power-Up Item (analog threshold)
  BACK: 8,       // Select / View / Cancel
  START: 9,      // Pause / Kickoff
  L3: 10,        // Left Stick Click -> Dash
  R3: 11,        // Right Stick Click -> Item
  UP: 12,        // D-Pad Up
  DOWN: 13,      // D-Pad Down
  LEFT: 14,      // D-Pad Left
  RIGHT: 15,     // D-Pad Right
  GUIDE: 16,     // Xbox Home
};

const KEY_LABELS = {
  KeyA: 'A', KeyB: 'B', KeyC: 'C', KeyD: 'D', KeyE: 'E', KeyF: 'F',
  KeyG: 'G', KeyH: 'H', KeyI: 'I', KeyJ: 'J', KeyK: 'K', KeyL: 'L',
  KeyM: 'M', KeyN: 'N', KeyO: 'O', KeyP: 'P', KeyQ: 'Q', KeyR: 'R',
  KeyS: 'S', KeyT: 'T', KeyU: 'U', KeyV: 'V', KeyW: 'W', KeyX: 'X',
  KeyY: 'Y', KeyZ: 'Z',
  ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→',
  Space: 'SPACE', Enter: 'ENTER', ShiftLeft: 'L-SHIFT', ShiftRight: 'R-SHIFT',
  Backslash: '\\', Slash: '/', Comma: ',', Period: '.', Quote: "'", Semicolon: ';',
  ControlLeft: 'L-CTRL', ControlRight: 'R-CTRL',
  Numpad0: 'NUM0', Numpad1: 'NUM1', Numpad2: 'NUM2', Numpad3: 'NUM3',
  Numpad4: 'NUM4', Numpad5: 'NUM5', Numpad6: 'NUM6', Numpad7: 'NUM7',
  Numpad8: 'NUM8', Numpad9: 'NUM9', NumpadAdd: 'NUM+', NumpadDecimal: 'NUM.',
};

export function formatKeyCode(code) {
  if (!code) return '—';
  return KEY_LABELS[code] || code.replace('Key', '').replace('Digit', '');
}

export class InputManager {
  constructor(controls) {
    this.controls = controls;
    this.keysDown = new Set();
    this.keysJustPressed = new Set();
    this.keysJustReleased = new Set();
    this.prevPadButtons = new Map();
    this.prevPadAxes = new Map();
    this.rebindingCallback = null;
    this.connectedGamepads = 0;
    this.padSlots = [null, null, null, null];
    this.disconnectedSlots = [];
    this.activeSource = 'keyboard';
    this.activeSlot = 0;
    this.gameplayActive = false;
    this.touchDirections = new Set();
    this.touchVector = { x: 0, y: 0 };
    this.touchJump = false;

    // Mobile / Tablet Touch Controls State for P1
    this.touchState = {
      left: false,
      right: false,
      up: false,
      down: false,
      upPressed: false,
      downPressed: false,
      downReleased: false,
      jumpPressed: false,
      jumpReleased: false,
      jumpHeld: false,
      kickDown: false,
      kickPressed: false,
      kickReleased: false,
      lobDown: false,
      lobPressed: false,
      dashPressed: false,
      itemPressed: false,
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        if (this.rebindingCallback) {
          e.preventDefault();
          const callback = this.rebindingCallback;
          this.rebindingCallback = null;
          if (e.code !== 'Escape') {
            callback(e.code);
          } else {
            callback(null);
          }
          return;
        }

        if (this.isEditingField() && !['Escape', 'F11'].includes(e.code) && !(e.altKey && e.code === 'Enter')) return;
        this.activeSource = 'keyboard';
        const owner = [0, 1, 2, 3].find(slot => this.isBound(e.code, [slot]));
        if (owner !== undefined) this.activeSlot = owner;
        if ((this.gameplayActive && this.isBound(e.code)) ||
            e.code === 'F11' || (e.altKey && e.code === 'Enter')) e.preventDefault();
        if (!e.repeat && !this.keysDown.has(e.code)) {
          this.keysJustPressed.add(e.code);
        }
        this.keysDown.add(e.code);
      });

      window.addEventListener('keyup', (e) => {
        this.keysDown.delete(e.code);
        this.keysJustReleased.add(e.code);
      });

      window.addEventListener('blur', () => {
        this.clearAll();
      });
      window.addEventListener('pointerdown', event => {
        if (event.pointerType === 'touch') this.activeSource = 'touch';
      }, { passive: true });
    }
  }

  startRebind(callback) {
    this.rebindingCallback = callback;
  }

  cancelRebind() {
    this.rebindingCallback = null;
  }

  isEditingField() {
    return typeof document !== 'undefined' &&
      Boolean(document.activeElement?.closest('input, select, textarea, [contenteditable="true"]'));
  }

  clearAll() {
    this.keysDown.clear();
    this.keysJustPressed.clear();
    this.keysJustReleased.clear();
    this.clearTouch();
    this._snapshotGamepads();
  }

  clearTouch() {
    this.touchDirections.clear();
    this.touchVector = { x: 0, y: 0 };
    this.touchJump = false;
    for (const key of Object.keys(this.touchState)) this.touchState[key] = false;
  }

  bindingConflict(playerKey, action, code) {
    if (['Escape', 'Tab', 'F11', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight'].includes(code)) {
      return 'That key is reserved for navigation or fullscreen.';
    }
    for (const [slot, actions] of Object.entries(this.controls)) {
      for (const [name, codes] of Object.entries(actions)) {
        if ((slot !== playerKey || name !== action) && codes.includes(code)) {
          return `${formatKeyCode(code)} is already assigned to ${slot.toUpperCase()} ${name}.`;
        }
      }
    }
    return null;
  }

  isBound(code, slots = [0, 1, 2, 3]) {
    return slots.some(slot => Object.values(this.controls[`p${slot + 1}`] || {})
      .some(codes => codes.includes(code)));
  }

  wasKeyJustPressed(code) {
    return this.keysJustPressed.has(code);
  }

  endFrame() {
    this.keysJustPressed.clear();
    this.keysJustReleased.clear();
    this._snapshotGamepads();

    // Reset edge-triggered touch events
    this.touchState.upPressed = false;
    this.touchState.downPressed = false;
    this.touchState.downReleased = false;
    this.touchState.jumpPressed = false;
    this.touchState.jumpReleased = false;
    this.touchState.kickPressed = false;
    this.touchState.kickReleased = false;
    this.touchState.lobPressed = false;
    this.touchState.dashPressed = false;
    this.touchState.itemPressed = false;
  }

  setTouchDirection(dir, isDown) {
    if (isDown) this.activeSource = 'touch';
    if (dir === 'up' && isDown && !this.touchDirections.has(dir)) this.touchState.jumpPressed = true;
    if (isDown) this.touchDirections.add(dir);
    else this.touchDirections.delete(dir);
    this._syncTouchDirections();
  }

  setTouchAction(action, isDown) {
    if (isDown) this.activeSource = 'touch';
    if (action === 'jump') {
      if (isDown && !this.touchJump) this.touchState.jumpPressed = true;
      this.touchJump = isDown;
      this._syncTouchDirections();
    } else if (action === 'strike') {
      if (isDown && !this.touchState.kickDown) this.touchState.kickPressed = true;
      if (!isDown && this.touchState.kickDown) this.touchState.kickReleased = true;
      this.touchState.kickDown = isDown;
    } else if (action === 'lob') {
      if (isDown && !this.touchState.lobDown) this.touchState.lobPressed = true;
      this.touchState.lobDown = isDown;
    } else if (action === 'dash') {
      if (isDown) this.touchState.dashPressed = true;
    } else if (action === 'item') {
      if (isDown) this.touchState.itemPressed = true;
    }
  }

  setTouchVector(x, y) {
    if (Math.hypot(x, y) > 0.22) this.activeSource = 'touch';
    if (y < -0.32 && this.touchVector.y >= -0.32) this.touchState.jumpPressed = true;
    this.touchVector = { x, y };
    this._syncTouchDirections();
  }

  _syncTouchDirections() {
    const state = this.touchState;
    const wasUp = state.up, wasDown = state.down, wasJump = state.jumpHeld;
    state.left = this.touchDirections.has('left') || this.touchVector.x < -0.22;
    state.right = this.touchDirections.has('right') || this.touchVector.x > 0.22;
    state.up = this.touchDirections.has('up') || this.touchVector.y < -0.32;
    state.down = this.touchDirections.has('down') || this.touchVector.y > 0.35;
    state.jumpHeld = state.up || this.touchJump;
    if (state.up && !wasUp) state.upPressed = true;
    if (!state.jumpHeld && wasJump) state.jumpReleased = true;
    if (state.down && !wasDown) state.downPressed = true;
    if (!state.down && wasDown) state.downReleased = true;
  }

  _getGamepads() {
    let raw = [];
    if (typeof navigator !== 'undefined' && navigator.getGamepads) {
      try {
        raw = navigator.getGamepads() || [];
      } catch (error) {
        if (error.name !== 'SecurityError') throw error;
        if (!this.padAccessWarning) console.warn('Gamepad access is unavailable in this browser context.', error);
        this.padAccessWarning = true;
      }
    }
    const list = Array.from(raw).filter(pad => pad?.connected && (!pad.mapping || pad.mapping === 'standard'));
    for (let slot = 0; slot < this.padSlots.length; slot++) {
      const index = this.padSlots[slot];
      if (index !== null && !list.some(pad => pad.index === index)) {
        this.padSlots[slot] = null;
        this.prevPadButtons.delete(index);
        this.prevPadAxes.delete(index);
        this.disconnectedSlots.push(slot);
      }
    }
    for (const pad of list) {
      if (!this.padSlots.includes(pad.index)) {
        const free = this.padSlots.indexOf(null);
        if (free !== -1) this.padSlots[free] = pad.index;
      }
      const changed = pad.buttons.some((_, i) => this._padJustPressed(pad, i)) ||
        [0, 1].some(axis => this._padAxisCrossed(pad, axis, 0.38, 1) || this._padAxisCrossed(pad, axis, -0.38, -1));
      if (changed) {
        this.activeSource = 'gamepad';
        this.activeSlot = this.padSlots.indexOf(pad.index);
      }
    }
    this.connectedGamepads = Math.min(4, list.length);
    return list;
  }

  getGamepad(slotIndex) {
    return this._getGamepads().find(pad => pad.index === this.padSlots[slotIndex]) || null;
  }

  _snapshotGamepads() {
    const pads = this._getGamepads();
    for (const pad of pads) {
      this.prevPadButtons.set(
        pad.index,
        pad.buttons.map((b) => Boolean(b && (b.pressed || b.value > 0.25)))
      );
      this.prevPadAxes.set(pad.index, pad.axes ? Array.from(pad.axes) : []);
    }
  }

  _padBtnIsDown(pad, btnIdx) {
    if (!pad || !pad.buttons || !pad.buttons[btnIdx]) return false;
    const b = pad.buttons[btnIdx];
    return Boolean(b.pressed || b.value > 0.25);
  }

  _padJustPressed(pad, btnIdx) {
    if (!pad) return false;
    const now = this._padBtnIsDown(pad, btnIdx);
    const prevArr = this.prevPadButtons.get(pad.index);
    const prev = prevArr ? Boolean(prevArr[btnIdx]) : false;
    return now && !prev;
  }

  _padJustReleased(pad, btnIdx) {
    if (!pad) return false;
    const now = this._padBtnIsDown(pad, btnIdx);
    const prevArr = this.prevPadButtons.get(pad.index);
    const prev = prevArr ? Boolean(prevArr[btnIdx]) : false;
    return !now && prev;
  }

  _padAxisCrossed(pad, axisIdx, threshold, dir) {
    if (!pad || !pad.axes || pad.axes[axisIdx] === undefined) return false;
    const now = pad.axes[axisIdx] || 0;
    const prevArr = this.prevPadAxes.get(pad.index);
    const prev = prevArr && prevArr[axisIdx] !== undefined ? prevArr[axisIdx] : 0;
    if (dir > 0) {
      return now >= threshold && prev < threshold;
    } else {
      return now <= threshold && prev > threshold;
    }
  }

  wasStartJustPressed() {
    const pads = this._getGamepads();
    for (const pad of pads) {
      if (this._padJustPressed(pad, XINPUT_BUTTONS.START)) {
        return true;
      }
    }
    return false;
  }

  wasGamepadButtonJustPressed(slotIndex, btnIdx) {
    const pad = this.getGamepad(slotIndex);
    if (!pad) return false;
    return this._padJustPressed(pad, btnIdx);
  }

  getGamepadTapDirection(slotIndex) {
    const pad = this.getGamepad(slotIndex);
    if (!pad) return { x: 0, y: 0 };
    let x = 0;
    let y = 0;
    // D-Pad or Left Stick flick
    if (this._padJustPressed(pad, XINPUT_BUTTONS.LEFT) || this._padAxisCrossed(pad, 0, -0.32, -1)) x = -1;
    if (this._padJustPressed(pad, XINPUT_BUTTONS.RIGHT) || this._padAxisCrossed(pad, 0, 0.32, 1)) x = 1;
    if (this._padJustPressed(pad, XINPUT_BUTTONS.UP) || this._padAxisCrossed(pad, 1, -0.38, -1)) y = -1;
    if (this._padJustPressed(pad, XINPUT_BUTTONS.DOWN) || this._padAxisCrossed(pad, 1, 0.38, 1)) y = 1;
    return { x, y };
  }

  getPlayerInput(slotIndex) {
    // slotIndex: 0 = P1, 1 = P2, 2 = P3, 3 = P4
    const keySlotMap =
      slotIndex === 0
        ? this.controls.p1
        : slotIndex === 1
        ? this.controls.p2
        : slotIndex === 2
        ? this.controls.p3
        : slotIndex === 3
        ? this.controls.p4
        : null;

    const checkDown = (codes) => (codes ? codes.some((c) => this.keysDown.has(c)) : false);
    const checkPressed = (codes) => (codes ? codes.some((c) => this.keysJustPressed.has(c)) : false);
    const checkReleased = (codes) => (codes ? codes.some((c) => this.keysJustReleased.has(c)) : false);

    let left = keySlotMap ? checkDown(keySlotMap.left) : false;
    let right = keySlotMap ? checkDown(keySlotMap.right) : false;
    let up = keySlotMap ? checkDown(keySlotMap.up) : false;
    let down = keySlotMap ? checkDown(keySlotMap.down) : false;

    let upPressed = keySlotMap ? checkPressed(keySlotMap.up) : false;
    let downPressed = keySlotMap ? checkPressed(keySlotMap.down) : false;
    let downReleased = keySlotMap ? checkReleased(keySlotMap.down) : false;

    let jumpPressed = keySlotMap ? checkPressed(keySlotMap.up) : false;
    let jumpReleased = keySlotMap ? checkReleased(keySlotMap.up) : false;
    let jumpHeld = up;

    let kickDown = keySlotMap ? checkDown(keySlotMap.kick) : false;
    let kickPressed = keySlotMap ? checkPressed(keySlotMap.kick) : false;
    let kickReleased = keySlotMap ? checkReleased(keySlotMap.kick) : false;

    let lobDown = keySlotMap ? checkDown(keySlotMap.lob) : false;
    let lobPressed = keySlotMap ? checkPressed(keySlotMap.lob) : false;

    let itemPressed = keySlotMap ? checkPressed(keySlotMap.item) : false;
    let dashPressed = keySlotMap ? checkPressed(keySlotMap.dash) : false;

    // Layer XInput Gamepad input seamlessly for this slot!
    const pad = this.getGamepad(slotIndex);
    if (pad) {
      const axX = pad.axes && pad.axes[0] !== undefined ? pad.axes[0] : 0;
      const axY = pad.axes && pad.axes[1] !== undefined ? pad.axes[1] : 0;

      const dLeft = this._padBtnIsDown(pad, XINPUT_BUTTONS.LEFT);
      const dRight = this._padBtnIsDown(pad, XINPUT_BUTTONS.RIGHT);
      const dUp = this._padBtnIsDown(pad, XINPUT_BUTTONS.UP);
      const dDown = this._padBtnIsDown(pad, XINPUT_BUTTONS.DOWN);

      // Deadzone 0.22 for analog stick drift protection
      if (axX < -0.22 || dLeft) left = true;
      if (axX > 0.22 || dRight) right = true;
      if (axY < -0.32 || dUp) up = true;
      if (axY > 0.35 || dDown) down = true;

      // Stick flick or D-pad tap triggers edge events
      if (this._padJustPressed(pad, XINPUT_BUTTONS.UP) || this._padAxisCrossed(pad, 1, -0.35, -1)) {
        upPressed = true;
      }
      if (this._padJustPressed(pad, XINPUT_BUTTONS.DOWN) || this._padAxisCrossed(pad, 1, 0.38, 1)) {
        downPressed = true;
      }
      if (this._padJustReleased(pad, XINPUT_BUTTONS.DOWN) || this._padAxisCrossed(pad, 1, 0.25, -1)) {
        downReleased = true;
      }

      // Button 0 (A / Cross): Primary Jump / Wall-Jump
      if (this._padJustPressed(pad, XINPUT_BUTTONS.A) || this._padJustPressed(pad, XINPUT_BUTTONS.UP)) {
        jumpPressed = true;
      }
      if (this._padJustReleased(pad, XINPUT_BUTTONS.A) || this._padJustReleased(pad, XINPUT_BUTTONS.UP)) {
        jumpReleased = true;
      }
      jumpHeld ||= this._padBtnIsDown(pad, XINPUT_BUTTONS.A) || dUp;

      // Button 2 (X / Square): Strike & Charge Kick
      if (this._padBtnIsDown(pad, XINPUT_BUTTONS.X)) kickDown = true;
      if (this._padJustPressed(pad, XINPUT_BUTTONS.X)) kickPressed = true;
      if (this._padJustReleased(pad, XINPUT_BUTTONS.X)) kickReleased = true;

      // Button 3 (Y / Triangle): High Lob / Uppercut Volley
      if (this._padBtnIsDown(pad, XINPUT_BUTTONS.Y)) lobDown = true;
      if (this._padJustPressed(pad, XINPUT_BUTTONS.Y)) lobPressed = true;

      // Shoulder & Face Dash: Button 1 (B / Circle), Button 4 (LB), Button 6 (LT), Button 10 (L3)
      if (
        this._padJustPressed(pad, XINPUT_BUTTONS.B) ||
        this._padJustPressed(pad, XINPUT_BUTTONS.LB) ||
        this._padJustPressed(pad, XINPUT_BUTTONS.LT) ||
        this._padJustPressed(pad, XINPUT_BUTTONS.L3)
      ) {
        dashPressed = true;
      }

      // Shoulder & Stick Item: Button 5 (RB), Button 7 (RT), Button 11 (R3)
      if (
        this._padJustPressed(pad, XINPUT_BUTTONS.RB) ||
        this._padJustPressed(pad, XINPUT_BUTTONS.RT) ||
        this._padJustPressed(pad, XINPUT_BUTTONS.R3)
      ) {
        itemPressed = true;
      }
    }

    // Merge Touch Controls for Player 1 (Mobile / Tablet / Touchscreen)
    if (slotIndex === 0 && this.touchState) {
      if (this.touchState.left) left = true;
      if (this.touchState.right) right = true;
      if (this.touchState.up) up = true;
      if (this.touchState.down) down = true;
      if (this.touchState.upPressed) upPressed = true;
      if (this.touchState.downPressed) downPressed = true;
      if (this.touchState.downReleased) downReleased = true;
      if (this.touchState.jumpPressed) jumpPressed = true;
      if (this.touchState.jumpReleased) jumpReleased = true;
      if (this.touchState.jumpHeld) jumpHeld = true;
      if (this.touchState.kickDown) kickDown = true;
      if (this.touchState.kickPressed) kickPressed = true;
      if (this.touchState.kickReleased) kickReleased = true;
      if (this.touchState.lobDown) lobDown = true;
      if (this.touchState.lobPressed) lobPressed = true;
      if (this.touchState.itemPressed) itemPressed = true;
      if (this.touchState.dashPressed) dashPressed = true;
    }

    return {
      left,
      right,
      up,
      down,
      upPressed,
      downPressed,
      downReleased: downReleased && !down,
      jumpPressed,
      jumpReleased: jumpReleased && !jumpHeld,
      jumpHeld,
      kickDown,
      kickPressed,
      kickReleased: kickReleased && !kickDown,
      lobDown,
      lobPressed,
      itemPressed,
      dashPressed,
    };
  }
}
