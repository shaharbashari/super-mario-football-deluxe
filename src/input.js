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
          if (e.code !== 'Escape') {
            this.rebindingCallback(e.code);
          } else {
            this.rebindingCallback(null);
          }
          this.rebindingCallback = null;
          return;
        }

        // Prevent arrow keys / space from scrolling page during gameplay
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
          if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'SELECT') {
            e.preventDefault();
          }
        }

        if (!this.keysDown.has(e.code)) {
          this.keysJustPressed.add(e.code);
        }
        this.keysDown.add(e.code);
      });

      window.addEventListener('keyup', (e) => {
        this.keysDown.delete(e.code);
        this.keysJustReleased.add(e.code);
      });

      window.addEventListener('blur', () => {
        this.keysDown.clear();
      });
    }
  }

  startRebind(callback) {
    this.rebindingCallback = callback;
  }

  cancelRebind() {
    this.rebindingCallback = null;
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
    if (dir === 'left') this.touchState.left = isDown;
    if (dir === 'right') this.touchState.right = isDown;
    if (dir === 'up') {
      if (isDown && !this.touchState.up) {
        this.touchState.upPressed = true;
        this.touchState.jumpPressed = true;
      }
      if (!isDown && this.touchState.up) {
        this.touchState.jumpReleased = true;
      }
      this.touchState.up = isDown;
    }
    if (dir === 'down') {
      if (isDown && !this.touchState.down) {
        this.touchState.downPressed = true; // Air flick -> Ground Pound!
      }
      if (!isDown && this.touchState.down) {
        this.touchState.downReleased = true;
      }
      this.touchState.down = isDown;
    }
  }

  setTouchAction(action, isDown) {
    if (action === 'jump') {
      if (isDown && !this.touchState.up) {
        this.touchState.jumpPressed = true;
        this.touchState.upPressed = true;
      }
      if (!isDown && this.touchState.up) {
        this.touchState.jumpReleased = true;
      }
      this.touchState.up = isDown;
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
    const deadzone = 0.22;
    const prevDown = this.touchState.down;
    const prevUp = this.touchState.up;

    this.touchState.left = x < -deadzone;
    this.touchState.right = x > deadzone;
    this.touchState.up = y < -0.32;
    this.touchState.down = y > 0.35;

    if (this.touchState.up && !prevUp) {
      this.touchState.upPressed = true;
      this.touchState.jumpPressed = true;
    }
    if (!this.touchState.up && prevUp) {
      this.touchState.jumpReleased = true;
    }
    if (this.touchState.down && !prevDown) {
      this.touchState.downPressed = true;
    }
    if (!this.touchState.down && prevDown) {
      this.touchState.downReleased = true;
    }
  }

  _getGamepads() {
    if (typeof navigator === 'undefined' || !navigator.getGamepads) return [];
    const raw = navigator.getGamepads();
    if (!raw) return [];
    const list = [];
    for (let i = 0; i < raw.length; i++) {
      if (raw[i] && raw[i].connected) list.push(raw[i]);
    }
    this.connectedGamepads = list.length;
    return list;
  }

  getGamepad(slotIndex) {
    if (typeof navigator === 'undefined' || !navigator.getGamepads) return null;
    const raw = navigator.getGamepads();
    if (!raw) return null;
    // Prefer direct port index if valid and connected
    if (raw[slotIndex] && raw[slotIndex].connected) {
      return raw[slotIndex];
    }
    // Fall back to active connected list
    const active = [];
    for (let i = 0; i < raw.length; i++) {
      if (raw[i] && raw[i].connected) active.push(raw[i]);
    }
    return active[slotIndex] || null;
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
      if (this._padJustPressed(pad, XINPUT_BUTTONS.START) || this._padJustPressed(pad, XINPUT_BUTTONS.BACK)) {
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
      downReleased,
      jumpPressed,
      jumpReleased,
      kickDown,
      kickPressed,
      kickReleased,
      lobDown,
      lobPressed,
      itemPressed,
      dashPressed,
    };
  }
}
