// Super Kick Kingdom — Mobile Device, Orientation & Touch Controls Manager
// Handles mobile detection, rotate-to-landscape overlay, glassmorphic virtual controls & tactile touch input

export class TouchController {
  constructor(inputManager, mainApp) {
    this.input = inputManager;
    this.app = mainApp;

    const ua = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '';
    const platform = typeof navigator !== 'undefined' ? (navigator.platform || '') : '';
    const maxTouchPoints = typeof navigator !== 'undefined' ? (navigator.maxTouchPoints || 0) : 0;

    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Silk/i.test(ua);
    const isIPadOS = platform === 'MacIntel' && maxTouchPoints > 1;
    const hasTouchScreen =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || maxTouchPoints > 0);

    const hasMobileDimensions =
      typeof window !== 'undefined' &&
      Math.min(window.screen?.width || window.innerWidth, window.screen?.height || window.innerHeight) <= 950;

    this.isMobile = Boolean(isMobileUA || isIPadOS || (hasTouchScreen && hasMobileDimensions));
    this.isTouch = Boolean(hasTouchScreen || this.isMobile);

    this.dismissedPortrait = false;
    this.stickPointerId = null;
    this.stickCenter = null;

    if (typeof document !== 'undefined' && (this.isTouch || this.isMobile)) {
      document.body.classList.add('is-touch-device');
    }

    if (typeof window !== 'undefined') {
      this._bindOrientationEvents();
      this._bindTouchButtons();
      this.checkOrientation();
    }
  }

  _bindOrientationEvents() {
    window.addEventListener('resize', () => this.checkOrientation());
    window.addEventListener('orientationchange', () => this.checkOrientation());
    if (screen && screen.orientation) {
      screen.orientation.addEventListener('change', () => this.checkOrientation());
    }

    // Cross-browser Fullscreen Change Listeners
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach((evt) => {
      document.addEventListener(evt, () => this._updateFullscreenUI());
    });

    const btnForce = document.getElementById('btn-force-landscape');
    if (btnForce) {
      btnForce.addEventListener('click', async (e) => {
        e.preventDefault();
        await this.toggleFullscreen();
        this.checkOrientation();
      });
    }

    const btnTopFullscreen = document.getElementById('btn-fullscreen');
    if (btnTopFullscreen) {
      btnTopFullscreen.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleFullscreen();
      });
    }

    const btnDismiss = document.getElementById('btn-dismiss-rotate');
    if (btnDismiss) {
      btnDismiss.addEventListener('click', (e) => {
        e.preventDefault();
        this.dismissedPortrait = true;
        const overlay = document.getElementById('rotate-overlay');
        if (overlay) overlay.classList.add('hidden');
      });
    }

    this._updateFullscreenUI();
  }

  isFullscreen() {
    if (typeof document === 'undefined') return false;
    return Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      document.body.classList.contains('fullscreen-mode')
    );
  }

  async toggleFullscreen() {
    if (typeof document === 'undefined') return;

    const isFull = this.isFullscreen();
    const doc = document;
    const el = document.documentElement;

    if (!isFull) {
      try {
        const req =
          el.requestFullscreen ||
          el.webkitRequestFullscreen ||
          el.mozRequestFullScreen ||
          el.msRequestFullscreen;
        if (req) {
          await req.call(el);
        }
      } catch (err) {
        console.warn('Native fullscreen request blocked:', err);
      }

      try {
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock('landscape').catch(() => {});
        }
      } catch {}

      // Pseudo-fullscreen fallback for iOS Safari
      document.body.classList.add('fullscreen-mode');
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 1);
      }
    } else {
      try {
        const exit =
          doc.exitFullscreen ||
          doc.webkitExitFullscreen ||
          doc.mozCancelFullScreen ||
          doc.msExitFullscreen;
        if (exit) {
          await exit.call(doc);
        }
      } catch (err) {
        console.warn('Native exit fullscreen failed:', err);
      }
      document.body.classList.remove('fullscreen-mode');
    }

    this._updateFullscreenUI();
  }

  _updateFullscreenUI() {
    if (typeof document === 'undefined') return;
    const isFull = this.isFullscreen();
    const buttons = document.querySelectorAll('.fullscreen-toggle-btn, #btn-fullscreen');
    buttons.forEach((btn) => {
      btn.textContent = isFull ? '🗗 WINDOW' : '⛶ FULLSCREEN';
      btn.classList.toggle('active', isFull);
    });
  }

  checkOrientation() {
    if (typeof window === 'undefined') return;

    const overlay = document.getElementById('rotate-overlay');
    if (!overlay) return;

    const isPortrait = window.innerHeight > window.innerWidth;

    // Show rotate overlay only on mobile/touch devices when in portrait orientation
    if (this.isMobile && isPortrait && !this.dismissedPortrait) {
      overlay.classList.remove('hidden');
    } else {
      overlay.classList.add('hidden');
      if (!isPortrait) {
        this.dismissedPortrait = false; // Reset dismiss flag once device rotates to landscape
      }
    }

    this.updateVisibility();
  }

  async _requestFullscreenAndLandscape() {
    return this.toggleFullscreen();
  }

  _bindTouchButtons() {
    const bindBtn = (id, onDown, onUp) => {
      const el = document.getElementById(id);
      if (!el) return;

      const handleDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          if (el.setPointerCapture) el.setPointerCapture(e.pointerId);
        } catch {}
        el.classList.add('active');
        if (navigator.vibrate) {
          try { navigator.vibrate(12); } catch {}
        }
        onDown();
      };

      const handleUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          if (el.releasePointerCapture) el.releasePointerCapture(e.pointerId);
        } catch {}
        el.classList.remove('active');
        onUp();
      };

      el.addEventListener('pointerdown', handleDown, { passive: false });
      el.addEventListener('pointerup', handleUp, { passive: false });
      el.addEventListener('pointercancel', handleUp, { passive: false });
    };

    // Right Action Cluster
    bindBtn(
      'touch-btn-jump',
      () => this.input.setTouchAction('jump', true),
      () => this.input.setTouchAction('jump', false)
    );

    bindBtn(
      'touch-btn-strike',
      () => this.input.setTouchAction('strike', true),
      () => this.input.setTouchAction('strike', false)
    );

    bindBtn(
      'touch-btn-lob',
      () => this.input.setTouchAction('lob', true),
      () => this.input.setTouchAction('lob', false)
    );

    bindBtn(
      'touch-btn-dash',
      () => this.input.setTouchAction('dash', true),
      () => this.input.setTouchAction('dash', false)
    );

    bindBtn(
      'touch-btn-item',
      () => this.input.setTouchAction('item', true),
      () => this.input.setTouchAction('item', false)
    );

    // Left Directional D-Pad buttons
    document.querySelectorAll('.dpad-btn').forEach((btn) => {
      const dir = btn.dataset.dir;
      bindBtn(
        btn.id,
        () => this.input.setTouchDirection(dir, true),
        () => this.input.setTouchDirection(dir, false)
      );
    });

    // Pause Shortcut
    const touchPause = document.getElementById('touch-btn-pause');
    if (touchPause) {
      touchPause.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.app && typeof this.app._togglePause === 'function') {
          this.app._togglePause();
        }
      });
    }

    // Left Analog Drag Touch Zone (Smooth virtual joystick & swipe gestures)
    const stickZone = document.getElementById('touch-stick-zone');
    const stickNub = document.getElementById('touch-stick-nub');

    if (stickZone) {
      stickZone.addEventListener(
        'pointerdown',
        (e) => {
          if (e.target.closest('.dpad-btn')) return; // Allow direct d-pad taps
          e.preventDefault();
          this.stickPointerId = e.pointerId;
          const rect = stickZone.getBoundingClientRect();
          this.stickCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
          this._handleStickMove(e.clientX, e.clientY, stickNub);
        },
        { passive: false }
      );

      stickZone.addEventListener(
        'pointermove',
        (e) => {
          if (e.pointerId !== this.stickPointerId || !this.stickCenter) return;
          e.preventDefault();
          this._handleStickMove(e.clientX, e.clientY, stickNub);
        },
        { passive: false }
      );

      const releaseStick = (e) => {
        if (e.pointerId !== this.stickPointerId) return;
        this.stickPointerId = null;
        this.stickCenter = null;
        this.input.setTouchVector(0, 0);
        if (stickNub) {
          stickNub.style.transform = 'translate(-50%, -50%) translate(0px, 0px)';
        }
      };

      stickZone.addEventListener('pointerup', releaseStick, { passive: false });
      stickZone.addEventListener('pointercancel', releaseStick, { passive: false });
    }
  }

  _handleStickMove(clientX, clientY, stickNub) {
    if (!this.stickCenter) return;
    const dx = clientX - this.stickCenter.x;
    const dy = clientY - this.stickCenter.y;
    const dist = Math.hypot(dx, dy);
    const maxRadius = 55;
    const normDist = Math.min(1, dist / maxRadius);
    const normX = dist > 0 ? (dx / dist) * normDist : 0;
    const normY = dist > 0 ? (dy / dist) * normDist : 0;

    this.input.setTouchVector(normX, normY);

    if (stickNub) {
      const offsetX = normX * 36;
      const offsetY = normY * 36;
      stickNub.style.transform = `translate(-50%, -50%) translate(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px)`;
    }
  }

  updateVisibility(currentScreen = this.app?.screen, touchSetting = this.app?.settings?.touchControls || 'auto') {
    const layer = document.getElementById('touch-controls');
    if (!layer) return;

    let shouldShow = false;
    if (currentScreen === 'match') {
      if (touchSetting === 'on') {
        shouldShow = true;
      } else if (touchSetting === 'off') {
        shouldShow = false;
      } else {
        // 'auto': Show if touch/mobile device
        shouldShow = this.isTouch;
      }
    }

    layer.classList.toggle('hidden', !shouldShow);
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('is-touch-device', shouldShow || this.isTouch || this.isMobile);
    }
  }
}
