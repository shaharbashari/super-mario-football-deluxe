// App lifecycle, accessible menus, local-player input, coaching and the fixed-step render loop.

import {
  VIRTUAL_WIDTH,
  VIRTUAL_HEIGHT,
  CHARACTERS,
  ARENAS,
  ITEMS,
  MUTATORS,
  GRAND_PRIX_CUPS,
  STRIKER_TRIALS,
  BALL_SKINS,
  GOAL_EXPLOSIONS,
  TROPHIES,
  DEFAULT_SETTINGS,
  DEFAULT_CONTROLS,
  loadSaveData,
  saveData,
  getCharacter,
  isCharUnlocked,
} from './config.js';
import { AudioEngine } from './audio.js';
import { InputManager, formatKeyCode } from './input.js';
import { ArtRenderer, CHAR_SPRITE_METRICS } from './art.js';
import { AIController } from './ai.js';
import { MatchSimulation } from './physics.js';
import { TouchController } from './touch.js';
import { MODE_BRIEFINGS, ARENA_GUIDES, controlHints, PracticeCoach, PRACTICE_STEPS, trialProgress } from './coach.js';

const INPUT_EDGES = ['upPressed', 'downPressed', 'downReleased', 'jumpPressed', 'jumpReleased',
  'kickPressed', 'kickReleased', 'lobPressed', 'dashPressed', 'itemPressed'];
const FIXED_STEP = 1 / 120;

export class SuperKickKingdomApp {
  constructor() {
    this.startupWarning = '';
    this.save = loadSaveData(message => { this.startupWarning = message; });
    this.settings = this.save.settings;
    this.controls = this.save.controls;

    this.audio = new AudioEngine(this.settings);
    this.audio.onError = message => this._pushToast('Sound unavailable', message, '!');
    this.input = new InputManager(this.controls);
    this.touch = new TouchController(this.input, this);
    this.art = new ArtRenderer();
    this.ai = new AIController();
    this.modalStack = [];
    this.dialogResume = false;
    this.accumulator = 0;
    this.pendingInputs = new Map();
    this.matchToken = 0;
    this.practice = null;
    this.lastControlSignature = '';
    if (this.touch.isMobile) this.input.activeSource = 'touch';
    this.art.onAssetStatus = (pending, failures) => {
      const status = document.getElementById('asset-status');
      status.classList.toggle('hidden', pending === 0 && failures.length === 0);
      status.classList.toggle('error', failures.length > 0);
      status.textContent = failures.length ? `Could not load ${failures.join(', ')}. Reload to retry.`
        : `Preparing the stadium · ${pending} assets remaining`;
    };
    this.art.onAssetsReady = () => this._renderCodex();

    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.previewCanvas0 = document.getElementById('preview-canvas-0');
    this.previewCtx0 = this.previewCanvas0.getContext('2d');
    this.previewCanvas1 = document.getElementById('preview-canvas-1');
    this.previewCtx1 = this.previewCanvas1.getContext('2d');
    this.podiumCanvas = document.getElementById('podium-canvas');
    this.podiumCtx = this.podiumCanvas.getContext('2d');

    this.screen = 'menu'; // 'menu' | 'select' | 'match' | 'results'
    this.selectedMode = '1v1_cpu';

    // Character & Kit Selections
    this.charIdx0 = 0; // Mario
    this.kitIdx0 = 0;
    this.charIdx1 = 1; // Luigi
    this.kitIdx1 = 0;
    this.allyCharIdx = 1; // Luigi
    this.allyKitIdx = 0;
    this.foeAllyCharIdx = 3; // Yoshi / Koopa rival ally default
    this.foeAllyKitIdx = 1;
    this.twoVsTwoFormat = '4p'; // '4p' (4 Humans) | '3p' | 'duel' | 'coop' | 'solo'
    this.arenaIdx = 0; // Meadow

    this.previewKickTimer0 = 0;
    this.previewKickTimer1 = 0;

    // Grand Prix Cups state
    this.activeCup = GRAND_PRIX_CUPS[0];
    this.cupCoop = false;
    this.cupRound = 0;
    this.cupBossScale = 1.0;
    this.cupRoundAI = 'striker';
    this.cupIntroTitle = '';

    // Party Knockout Tournament state
    this.tourneySize = 8;
    this.tourneyHumans = 1;
    this.tourneyState = null; // { size, humans, rounds, activeMatch }

    // Striker Trial Dojo state
    this.activeTrial = null;

    // Locker Room tab
    this.lockerTab = 'chars';

    this.match = null;
    this.paused = false;
    this.lastSummary = null;
    this.toastFadeTimer = 0;

    // Menu ambient sparkles
    this.menuSparkles = Array.from({ length: 42 }, () => ({
      x: Math.random() * VIRTUAL_WIDTH,
      y: Math.random() * VIRTUAL_HEIGHT,
      r: 2 + Math.random() * 4.5,
      vy: -18 - Math.random() * 36,
      vx: (Math.random() - 0.5) * 26,
      color: Math.random() > 0.38 ? '#fde047' : '#ffffff',
      phase: Math.random() * Math.PI * 2,
    }));

    this._bindUI();
    this._renderSelectUI();
    this._renderCodex();
    this._renderMutatorsGrid();
    this._syncMenuBadges();
    this._syncMuteButton();
    this._applyPreferences();
    this._updateControlPrompts();
    if (this.startupWarning) this._pushToast('Save recovery', this.startupWarning, '!');
    window.addEventListener('blur', () => {
      if (this.screen === 'match') this.togglePause(true);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.screen === 'match') this.togglePause(true);
      this.audio.setPaused(document.hidden || this.paused);
    });
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => this._applyPreferences());
    document.addEventListener('keydown', event => this._trapDialogFocus(event));

    this.lastFrameTime = performance.now();
    requestAnimationFrame((ts) => this._loop(ts));
  }

  _persist() {
    this.save.settings = this.settings;
    this.save.controls = this.controls;
    saveData(this.save, message => {
      console.warn(message);
      if (!this.saveWarningShown) {
        this._pushToast('Progress is not being saved', message, '!');
        this.saveWarningShown = true;
      }
    });
    this._syncMenuBadges();
  }

  _isMinigameMode(mode = this.selectedMode) {
    return mode === 'practice' || mode === 'target_blitz' || mode === 'keep_up' || mode === 'goalie_gauntlet';
  }

  _syncMenuBadges() {
    const coinsStr = String(this.save.coins);
    const topCoins = document.getElementById('top-coin-count');
    if (topCoins) topCoins.textContent = coinsStr;
    const lockerCoins = document.getElementById('locker-coin-count');
    if (lockerCoins) lockerCoins.textContent = coinsStr;

    const cupBadge = document.getElementById('menu-cup-badge');
    if (cupBadge) {
      cupBadge.textContent = `${this.save.wonCups.length} / ${GRAND_PRIX_CUPS.length} CUPS WON`;
    }

    const trialsBadge = document.getElementById('menu-trials-badge');
    if (trialsBadge) {
      trialsBadge.textContent = `${this.save.trialsWon?.length || 0} / ${STRIKER_TRIALS.length} STARS`;
    }
    const starBadge = document.getElementById('trials-star-badge');
    if (starBadge) {
      starBadge.textContent = `⭐ ${this.save.trialsWon?.length || 0} / ${STRIKER_TRIALS.length} STARS`;
    }

    const bestBadge = document.getElementById('menu-best-badge');
    if (bestBadge) {
      bestBadge.textContent =
        this.save.stats.targetBestScore > 0
          ? `BEST: ${this.save.stats.targetBestScore} PTS`
          : '3 CHALLENGES';
    }

    const trophyBadge = document.getElementById('menu-trophy-badge');
    if (trophyBadge) {
      trophyBadge.textContent = `${this.save.trophies.length}/${TROPHIES.length}`;
    }

    const mutCount = String(this.settings.activeMutators?.length || 0);
    const mutMenuBadge = document.getElementById('menu-mutator-badge');
    if (mutMenuBadge) mutMenuBadge.textContent = `${mutCount} ACTIVE`;
    const mutSelectBadge = document.getElementById('select-mut-count');
    if (mutSelectBadge) mutSelectBadge.textContent = mutCount;
  }

  _syncMuteButton() {
    const btn = document.getElementById('btn-mute');
    if (btn) btn.textContent = this.settings.muted ? '🔇 MUTED' : '🔊 SOUND ON';
  }

  _pushToast(title, subtitle, icon = '🏆') {
    const container = document.getElementById('trophy-toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'trophy-toast';
    const symbol = document.createElement('span');
    symbol.textContent = icon;
    symbol.setAttribute('aria-hidden', 'true');
    const copy = document.createElement('div');
    const heading = document.createElement('strong');
    heading.textContent = title;
    const detail = document.createElement('span');
    detail.textContent = subtitle;
    copy.append(heading, detail);
    el.append(symbol, copy);
    while (container.children.length >= 3) container.firstElementChild.remove();
    container.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      el.style.opacity = '0';
      el.style.transform = 'translateX(30px)';
      setTimeout(() => el.remove(), 420);
    }, 4300);
  }

  _unlockTrophy(trophyId) {
    if (this.save.trophies.includes(trophyId)) return false;
    const tr = TROPHIES.find((t) => t.id === trophyId);
    if (!tr) return false;

    this.save.trophies.push(trophyId);
    this.save.coins += tr.reward;
    this.audio.playTrophyUnlock();
    this._pushToast(`TROPHY: ${tr.name}`, `${tr.desc} (+${tr.reward} 🪙)`, '🏆');
    this._persist();
    return true;
  }

  _checkCollectionTrophies() {
    if (this.save.unlockedChars.length >= CHARACTERS.length) {
      this._unlockTrophy('collector');
    }
    if (this.save.unlockedBalls.length >= 2 && this.save.unlockedExplosions.length >= 2) {
      this._unlockTrophy('fashionista');
    }
  }

  // =========================================================================
  // UI BINDINGS & NAVIGATION
  // =========================================================================
  _bindUI() {
    // Unlock WebAudio on first user gesture
    const unlockOnce = () => {
      this.audio.unlock();
      if (this.screen === 'menu' || this.screen === 'select') {
        this.audio.startMusic('menu');
      }
    };
    window.addEventListener('pointerdown', unlockOnce, { once: true });
    window.addEventListener('keydown', unlockOnce, { once: true });
    document.getElementById('btn-start-practice').addEventListener('click', () => this._startPractice());
    document.getElementById('btn-coach').addEventListener('click', () => this._openCoach());
    document.getElementById('btn-coach-practice').addEventListener('click', () => this._startPractice());
    document.getElementById('btn-coach-ready').addEventListener('click', () => {
      if (this.screen === 'match' && !this.save.onboarding.seenModes.includes(this.selectedMode)) {
        this.save.onboarding.seenModes.push(this.selectedMode);
        this._persist();
      }
      this._closeModal('modal-coach');
    });
    document.getElementById('btn-finish-practice').addEventListener('click', () => {
      const completed = this.practice?.complete;
      this._showScreen('menu');
      if (completed) {
        this.selectedMode = '1v1_cpu';
        this._showScreen('select');
      }
    });

    // Hover sound on static buttons
    document.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('mouseenter', () => this.audio.playHover());
    });

    // Top bar: Mute, Pause, Locker Coins
    document.getElementById('btn-mute').addEventListener('click', () => {
      this.audio.toggleMute();
      this._syncMuteButton();
      this._persist();
    });

    document.getElementById('btn-pause').addEventListener('click', () => {
      if (this.screen === 'match') this.togglePause();
    });

    document.getElementById('btn-top-coins').addEventListener('click', () => {
      this.audio.playClick();
      this._openLockerModal('chars');
    });

    // Quick Mode Cards (1v1_cpu, 1v1_pvp, 2v2)
    document.querySelectorAll('.quick-mode-btn').forEach((card) => {
      card.addEventListener('click', () => {
        this.audio.playClick();
        this.selectedMode = card.dataset.mode;
        this._ensureValidAlly();
        this._ensureValidFoeAlly();
        if (this.selectedMode === '2v2') {
          // Auto-detect best format based on connected gamepads, defaulting to full 4P couch
          this.input._getGamepads();
          if (this.input.connectedGamepads >= 4) this.twoVsTwoFormat = '4p';
          else if (this.input.connectedGamepads === 3) this.twoVsTwoFormat = '3p';
          else if (this.input.connectedGamepads === 2) this.twoVsTwoFormat = 'duel';
          else this.twoVsTwoFormat = '4p';
        }
        this._showScreen('select');
      });
    });

    // Deluxe Hub Mode Cards (Grand Prix Cups, Striker Trials, Party Tournament, Minigame Arcade)
    document.getElementById('btn-mode-cups').addEventListener('click', () => {
      this.audio.playClick();
      this._openCupsModal();
    });

    const trialsBtn = document.getElementById('btn-mode-trials');
    if (trialsBtn) {
      trialsBtn.addEventListener('click', () => {
        this.audio.playClick();
        this._openTrialsModal();
      });
    }

    document.getElementById('btn-mode-tourney').addEventListener('click', () => {
      this.audio.playClick();
      this._openTourneyModal();
    });

    document.getElementById('btn-mode-arcade').addEventListener('click', () => {
      this.audio.playClick();
      this._openArcadeModal();
    });

    const mutModeBtn = document.getElementById('btn-mode-mutators');
    if (mutModeBtn) {
      mutModeBtn.addEventListener('click', () => {
        this.audio.playClick();
        this._openMutatorsModal();
      });
    }

    // Main Menu Footer Buttons
    document.getElementById('btn-open-locker').addEventListener('click', () => {
      this.audio.playClick();
      this._openLockerModal('chars');
    });
    document.getElementById('btn-open-options').addEventListener('click', () => {
      this.audio.playClick();
      this._openModal('modal-options');
    });
    document.getElementById('btn-open-controls').addEventListener('click', () => {
      this.audio.playClick();
      this._openControlsModal();
    });
    document.getElementById('btn-open-codex').addEventListener('click', () => {
      this.audio.playClick();
      this._openModal('modal-codex');
    });

    // Select Screen Navigation & Controls
    document.getElementById('btn-select-back').addEventListener('click', () => {
      this.audio.playBack();
      this._showScreen('menu');
    });

    document.getElementById('btn-select-mutators').addEventListener('click', () => {
      this.audio.playClick();
      this._openMutatorsModal();
    });

    document.getElementById('btn-select-options').addEventListener('click', () => {
      this.audio.playClick();
      this._openModal('modal-options');
    });

    document.querySelectorAll('.cycle-arrow').forEach((arrow) => {
      arrow.addEventListener('click', () => {
        const slot = Number(arrow.dataset.slot);
        const dir = Number(arrow.dataset.dir);
        this._cycleCharacter(slot, dir);
      });
    });

    document.getElementById('btn-kit-0').addEventListener('click', () => this._cycleKit(0));
    document.getElementById('btn-kit-1').addEventListener('click', () => this._cycleKit(1));

    document.getElementById('btn-cycle-ally').addEventListener('click', () => {
      this.audio.playClick();
      this._cycleAlly();
    });

    const foeAllyBtn = document.getElementById('btn-cycle-foe-ally');
    if (foeAllyBtn) {
      foeAllyBtn.addEventListener('click', () => {
        this.audio.playClick();
        this._cycleFoeAlly();
      });
    }

    // 2v2 Format Selector Pills
    document.querySelectorAll('#quick-2v2-pills button').forEach((b) => {
      b.addEventListener('click', () => {
        this.audio.playClick();
        this.twoVsTwoFormat = b.dataset.format;
        this._syncQuickRulePills();
        this._renderSelectUI();
      });
    });

    document.getElementById('btn-unlock-char-0').addEventListener('click', () => {
      this._tryUnlockSelectChar(0);
    });
    document.getElementById('btn-unlock-char-1').addEventListener('click', () => {
      this._tryUnlockSelectChar(1);
    });

    // Randomize Strikers & Arena Buttons
    const bindRndBtn = (id, slot) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => this.randomizePlayer(slot));
    };
    bindRndBtn('btn-random-p1', 0);
    bindRndBtn('btn-random-p2', 1);
    bindRndBtn('btn-random-ally', 'ally');
    bindRndBtn('btn-random-foe-ally', 'foeAlly');

    const rndArenaBtn = document.getElementById('btn-random-arena');
    if (rndArenaBtn) {
      rndArenaBtn.addEventListener('click', () => this.randomizeArena());
    }

    document.getElementById('btn-start-match').addEventListener('click', () => {
      this._attemptStartFromSelect();
    });

    // Quick Rule Pills on Character Select
    document.querySelectorAll('#quick-ai-pills button').forEach((b) => {
      b.addEventListener('click', () => {
        this.audio.playClick();
        this.settings.aiDifficulty = b.dataset.ai;
        this._persist();
        this._syncQuickRulePills();
      });
    });

    document.querySelectorAll('#quick-time-pills button').forEach((b) => {
      b.addEventListener('click', () => {
        this.audio.playClick();
        this.settings.matchDuration = Number(b.dataset.time);
        this._persist();
        this._syncQuickRulePills();
      });
    });

    document.querySelectorAll('#quick-item-pills button').forEach((b) => {
      b.addEventListener('click', () => {
        this.audio.playClick();
        this.settings.itemMode = b.dataset.items;
        this._persist();
        this._syncQuickRulePills();
      });
    });

    document.getElementById('pill-toggle-hyper').addEventListener('click', () => {
      this.audio.playClick();
      this.settings.hyperStrikes = !this.settings.hyperStrikes;
      this._persist();
      this._syncQuickRulePills();
    });

    document.getElementById('pill-toggle-hazards').addEventListener('click', () => {
      this.audio.playClick();
      this.settings.stageHazards = !this.settings.stageHazards;
      this._persist();
      this._syncQuickRulePills();
    });

    // Grand Prix Cups Co-op Toggle
    document.querySelectorAll('#cup-coop-pills button').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.audio.playClick();
        this.cupCoop = btn.dataset.coop === 'true';
        document.querySelectorAll('#cup-coop-pills button').forEach((b) => {
          b.classList.toggle('active', (b.dataset.coop === 'true') === this.cupCoop);
        });
      });
    });

    // Party Tournament Controls
    document.querySelectorAll('#tourney-size-pills button').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.audio.playClick();
        this.tourneySize = Number(btn.dataset.size);
        this._generateTournamentBracket();
      });
    });

    document.querySelectorAll('#tourney-humans-pills button').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.audio.playClick();
        this.tourneyHumans = Number(btn.dataset.humans);
        this._generateTournamentBracket();
      });
    });

    document.getElementById('btn-generate-tourney').addEventListener('click', () => {
      this.audio.playClick();
      this._generateTournamentBracket();
    });

    document.getElementById('btn-play-tourney-match').addEventListener('click', () => {
      this.audio.playClick();
      this._startNextTourneyMatch();
    });

    // Minigame Arcade Cards
    document.querySelectorAll('.arcade-card').forEach((card) => {
      card.addEventListener('click', () => {
        this.audio.playClick();
        this.selectedMode = card.dataset.minigame;
        if (this.selectedMode === 'keep_up') {
          const castleIdx = ARENAS.findIndex((a) => a.id === 'castle');
          if (castleIdx >= 0) this.arenaIdx = castleIdx;
        }
        this._closeModal('modal-arcade');
        this._showScreen('select');
      });
    });

    // Mutators Lab Buttons & Presets
    const btnPresetArcade = document.getElementById('btn-preset-arcade');
    if (btnPresetArcade) {
      btnPresetArcade.addEventListener('click', () => {
        this.audio.playClick();
        this.settings.activeMutators = ['multiBall', 'turboMode', 'curvedWorld', 'pinballBumpers'];
        this._persist();
        this._renderMutatorsGrid();
      });
    }

    const btnPresetHardcore = document.getElementById('btn-preset-hardcore');
    if (btnPresetHardcore) {
      btnPresetHardcore.addEventListener('click', () => {
        this.audio.playClick();
        this.settings.activeMutators = ['ironBall', 'moonGravity', 'rugbyBall'];
        this._persist();
        this._renderMutatorsGrid();
      });
    }

    document.getElementById('btn-clear-mutators').addEventListener('click', () => {
      this.audio.playClick();
      this.settings.activeMutators = [];
      this._persist();
      this._renderMutatorsGrid();
    });

    document.getElementById('btn-random-mutators').addEventListener('click', () => {
      this.audio.playClick();
      const shuffled = [...MUTATORS].sort(() => Math.random() - 0.5);
      this.settings.activeMutators = shuffled.slice(0, 3).map((m) => m.id);
      this._persist();
      this._renderMutatorsGrid();
    });

    // Locker Room Tabs & Party Unlock All
    document.querySelectorAll('#locker-tabs button').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.audio.playClick();
        this.lockerTab = btn.dataset.tab;
        this._renderLockerContent();
      });
    });

    document.getElementById('chk-party-unlock').addEventListener('change', (e) => {
      this.audio.playClick();
      this.settings.partyUnlockAll = Boolean(e.target.checked);
      this._persist();
      this._renderLockerContent();
      if (this.screen === 'select') this._renderSelectUI();
    });

    // Modal Close Buttons
    document.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', () => {
        this.audio.playClick();
        this.input.cancelRebind();
        this._closeModal(el.dataset.close);
        this._syncQuickRulePills();
        this._syncMenuBadges();
        if (this.screen === 'select') this._renderSelectUI();
      });
    });

    // Pause Modal Buttons
    document.getElementById('btn-resume').addEventListener('click', () => {
      this.audio.playClick();
      this.togglePause(false);
    });
    document.getElementById('btn-pause-restart').addEventListener('click', () => {
      this.audio.playClick();
      this.togglePause(false);
      this.startMatch();
    });
    document.getElementById('btn-pause-controls').addEventListener('click', () => {
      this.audio.playClick();
      this._openControlsModal();
    });
    document.getElementById('btn-pause-options').addEventListener('click', () => {
      this.audio.playClick();
      this._openModal('modal-options');
    });
    document.getElementById('btn-pause-quit').addEventListener('click', () => {
      this.audio.playBack();
      this.togglePause(false);
      this._showScreen('menu');
    });

    // Results Screen Buttons
    document.getElementById('btn-rematch').addEventListener('click', () => {
      this.audio.playClick();
      this.startMatch();
    });
    document.getElementById('btn-next-cup').addEventListener('click', () => {
      this.audio.playClick();
      this.cupRound++;
      this._applyCupRoundSetup();
      this.startMatch();
    });
    document.getElementById('btn-back-tourney').addEventListener('click', () => {
      this.audio.playClick();
      this._showScreen('menu');
      this._openTourneyModal(true);
    });
    document.getElementById('btn-change-chars').addEventListener('click', () => {
      this.audio.playClick();
      if (this.selectedMode === 'tourney') {
        this._showScreen('menu');
        this._openTourneyModal(true);
      } else if (this.selectedMode === 'trial') {
        this._showScreen('menu');
        this._openTrialsModal();
      } else {
        this._showScreen('select');
      }
    });
    document.getElementById('btn-results-home').addEventListener('click', () => {
      this.audio.playBack();
      this._showScreen('menu');
    });

    // Options Form Bindings
    this._bindOptionsInputs();

    // Controls Reset
    document.getElementById('btn-reset-controls').addEventListener('click', () => {
      this.audio.playClick();
      this.controls.p1 = JSON.parse(JSON.stringify(DEFAULT_CONTROLS.p1));
      this.controls.p2 = JSON.parse(JSON.stringify(DEFAULT_CONTROLS.p2));
      this.controls.p3 = JSON.parse(JSON.stringify(DEFAULT_CONTROLS.p3));
      this.controls.p4 = JSON.parse(JSON.stringify(DEFAULT_CONTROLS.p4));
      this._persist();
      this._renderRebindLists();
    });
  }

  _bindOptionsInputs() {
    const syncForm = () => {
      document.getElementById('opt-duration').value = String(this.settings.matchDuration);
      document.getElementById('opt-score-limit').value = String(this.settings.scoreLimit);
      document.getElementById('opt-sudden-death').value = this.settings.suddenDeathMode;
      document.getElementById('opt-items').value = this.settings.itemMode;
      document.getElementById('opt-ball-preset').value = this.settings.ballPreset;
      document.getElementById('opt-shake').value = String(this.settings.screenShake);
      document.getElementById('opt-hyper').checked = this.settings.hyperStrikes !== false;
      document.getElementById('opt-hazards').checked = this.settings.stageHazards !== false;
      document.getElementById('opt-hitstop').checked = Boolean(this.settings.hitstop);
      document.getElementById('opt-slowmo').checked = Boolean(this.settings.goalSlowMo);
      const touchEl = document.getElementById('opt-touch');
      if (touchEl) touchEl.value = this.settings.touchControls || 'auto';
      document.getElementById('opt-vol-master').value = String(this.settings.masterVolume);
      document.getElementById('opt-vol-music').value = String(this.settings.musicVolume);
      document.getElementById('opt-vol-sfx').value = String(this.settings.sfxVolume);
      document.getElementById('opt-vol-ambience').value = String(this.settings.ambienceVolume);
      document.getElementById('opt-music-style').value = this.settings.musicStyle;
      document.getElementById('opt-sound-palette').value = this.settings.soundPalette;
      document.getElementById('opt-motion').value = this.settings.motion;
      document.getElementById('opt-tips').checked = this.settings.showTips;
    };
    this._syncOptionsForm = syncForm;
    syncForm();

    const onChange = () => {
      this.settings.matchDuration = Number(document.getElementById('opt-duration').value);
      this.settings.scoreLimit = Number(document.getElementById('opt-score-limit').value);
      this.settings.suddenDeathMode = document.getElementById('opt-sudden-death').value;
      this.settings.itemMode = document.getElementById('opt-items').value;
      this.settings.ballPreset = document.getElementById('opt-ball-preset').value;
      this.settings.screenShake = Number(document.getElementById('opt-shake').value);
      this.settings.hyperStrikes = document.getElementById('opt-hyper').checked;
      this.settings.stageHazards = document.getElementById('opt-hazards').checked;
      this.settings.hitstop = document.getElementById('opt-hitstop').checked;
      this.settings.goalSlowMo = document.getElementById('opt-slowmo').checked;
      const touchEl = document.getElementById('opt-touch');
      if (touchEl) {
        this.settings.touchControls = touchEl.value;
        if (this.touch) this.touch.updateVisibility(this.screen, this.settings.touchControls);
      }
      this.settings.masterVolume = Number(document.getElementById('opt-vol-master').value);
      this.settings.musicVolume = Number(document.getElementById('opt-vol-music').value);
      this.settings.sfxVolume = Number(document.getElementById('opt-vol-sfx').value);
      this.settings.ambienceVolume = Number(document.getElementById('opt-vol-ambience').value);
      this.settings.musicStyle = document.getElementById('opt-music-style').value;
      this.settings.soundPalette = document.getElementById('opt-sound-palette').value;
      this.settings.motion = document.getElementById('opt-motion').value;
      this.settings.showTips = document.getElementById('opt-tips').checked;
      this._applyPreferences();
      this.audio.syncVolumes();
      this._persist();
      this._syncQuickRulePills();
    };

    [
      'opt-duration',
      'opt-score-limit',
      'opt-sudden-death',
      'opt-items',
      'opt-ball-preset',
      'opt-shake',
      'opt-hyper',
      'opt-hazards',
      'opt-hitstop',
      'opt-slowmo',
      'opt-touch',
      'opt-vol-master',
      'opt-vol-music',
      'opt-vol-sfx',
      'opt-vol-ambience',
      'opt-music-style',
      'opt-sound-palette',
      'opt-motion',
      'opt-tips',
    ].forEach((id) => {
      document.getElementById(id).addEventListener('input', onChange);
      document.getElementById(id).addEventListener('change', onChange);
    });

    document.getElementById('btn-reset-options').addEventListener('click', () => {
      this.audio.playClick();
      const keepMutators = this.settings.activeMutators || [];
      const keepSkin = this.settings.equippedBallSkin || 'classic';
      const keepGoal = this.settings.equippedGoalExplosion || 'confetti';
      const keepParty = Boolean(this.settings.partyUnlockAll);
      Object.assign(this.settings, DEFAULT_SETTINGS, {
        activeMutators: keepMutators,
        equippedBallSkin: keepSkin,
        equippedGoalExplosion: keepGoal,
        partyUnlockAll: keepParty,
      });
      this.audio.syncVolumes();
      this._applyPreferences();
      this._syncMuteButton();
      syncForm();
      this._syncQuickRulePills();
      this._persist();
    });
  }

  _openModal(id) {
    if (id === 'modal-options') this._syncOptionsForm();
    if (this.modalStack.some(entry => entry.id === id)) return;
    const modal = document.getElementById(id);
    this.modalStack.push({ id, returnFocus: document.activeElement });
    modal.classList.remove('hidden');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    const heading = modal.querySelector('h2');
    if (heading) {
      if (!heading.id) heading.id = `${id}-title`;
      modal.setAttribute('aria-labelledby', heading.id);
    }
    if (this.screen === 'match' && !this.paused) {
      this.dialogResume = true;
      this.paused = true;
    }
    this.input.clearAll();
    this.pendingInputs.clear();
    this.accumulator = 0;
    this._syncDialogState();
    (modal.querySelector('.kickoff-cta-btn:not(.hidden)') || this._focusableElements(modal)[0])?.focus();
  }

  _closeModal(id) {
    const index = this.modalStack.findIndex(entry => entry.id === id);
    if (index < 0) return;
    const entries = this.modalStack.splice(index);
    for (const entry of entries) document.getElementById(entry.id).classList.add('hidden');
    this.input.cancelRebind();
    this.input.clearAll();
    this.pendingInputs.clear();
    this.accumulator = 0;
    if (!this.modalStack.length && this.dialogResume) {
      this.dialogResume = false;
      this.paused = false;
    }
    this._syncDialogState();
    const previous = entries[0].returnFocus;
    if (previous?.isConnected && !previous.closest('[inert], .hidden')) previous.focus({ preventScroll: true });
  }

  _closeAllModals() {
    this.modalStack = [];
    this.dialogResume = false;
    this.paused = false;
    document.querySelectorAll('.modal-backdrop').forEach(modal => modal.classList.add('hidden'));
    this.input.cancelRebind();
    this._syncDialogState();
  }

  _syncDialogState() {
    const top = this.modalStack.at(-1)?.id;
    this.input.gameplayActive = this.screen === 'match' && !this.paused && !top;
    for (const id of ['top-utility-bar', 'play-surface', 'screen-menu', 'screen-select', 'screen-results']) {
      document.getElementById(id).inert = Boolean(top);
    }
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.inert = Boolean(top && modal.id !== top);
      const depth = this.modalStack.findIndex(entry => entry.id === modal.id);
      modal.style.zIndex = String(60 + Math.max(0, depth));
      modal.setAttribute('aria-modal', String(modal.id === top));
    });
    this.touch.updateVisibility(this.screen, this.settings.touchControls);
    this.audio.setPaused(this.paused || document.hidden);
  }

  _focusableElements(root) {
    return [...root.querySelectorAll('button, input, select, [tabindex="0"]')]
      .filter(element => !element.disabled && !element.closest('[inert]') && element.getClientRects().length);
  }

  _trapDialogFocus(event) {
    if (event.key !== 'Tab' || !this.modalStack.length) return;
    const elements = this._focusableElements(document.getElementById(this.modalStack.at(-1).id));
    if (!elements.length) return;
    const index = elements.indexOf(document.activeElement);
    if ((event.shiftKey && index <= 0) || (!event.shiftKey && (index < 0 || index === elements.length - 1))) {
      event.preventDefault();
      elements[event.shiftKey ? elements.length - 1 : 0].focus();
    }
  }

  _applyPreferences() {
    this.reducedMotion = this.settings.motion === 'reduced' ||
      (this.settings.motion === 'auto' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    document.body.dataset.motion = this.reducedMotion ? 'reduced' : 'full';
    this.art.reducedMotion = this.reducedMotion;
    if (this.match) {
      Object.assign(this.match.settings, {
        reducedMotion: this.reducedMotion, screenShake: this.settings.screenShake,
        hitstop: this.settings.hitstop, goalSlowMo: this.settings.goalSlowMo,
      });
      if (this.reducedMotion) {
        Object.assign(this.match, {
          shakeMag: 0, shakeX: 0, shakeY: 0, cameraZoom: 1,
          cameraFocusX: VIRTUAL_WIDTH / 2, cameraFocusY: VIRTUAL_HEIGHT / 2,
          slowMoFactor: 1, slowMoTimer: 0,
        });
      }
    }
    this.touch.updateVisibility(this.screen, this.settings.touchControls);
  }

  _startPractice() {
    this.selectedMode = 'practice';
    this.arenaIdx = 0;
    if (!isCharUnlocked(this.save, CHARACTERS[this.charIdx0].id)) this.charIdx0 = 0;
    this.startMatch();
  }

  _openCoach() {
    const mode = this.screen === 'match' ? this.selectedMode : 'practice';
    const [title, dialogue] = MODE_BRIEFINGS[mode] || MODE_BRIEFINGS['1v1_cpu'];
    document.getElementById('coach-title').textContent = title;
    document.getElementById('coach-dialogue').textContent = dialogue;
    const arena = this.match?.arena || ARENAS[this.arenaIdx];
    const guide = ARENA_GUIDES[arena.id] || ARENA_GUIDES.meadow;
    document.getElementById('coach-stage-label').textContent = `${arena.name} / ${guide.label}`;
    document.getElementById('coach-stage-tip').textContent = this.match?.trial?.ruleText ||
      (this.match?.settings.stageHazards === false
        ? 'Stage hazards are off. Platforms and the stadium gravity and traction still apply.'
        : guide.tip);
    document.getElementById('btn-coach-ready').textContent = this.screen === 'match' ? "LET'S PLAY" : 'GOT IT';
    document.getElementById('btn-coach-practice').classList.toggle('hidden', this.selectedMode === 'practice' && this.screen === 'match');
    this._updateControlPrompts(true);
    this._openModal('modal-coach');
  }

  _appendControlPrompts(container, hints, actions) {
    container.replaceChildren();
    const names = { move: 'Move', jump: 'Jump', kick: 'Strike', lob: 'Lob', dash: 'Dash / parry', item: 'Use item', down: 'Ground pound', pause: 'Pause' };
    for (const action of actions) {
      const prompt = document.createElement('span');
      prompt.className = 'control-prompt';
      const key = document.createElement('kbd');
      key.textContent = hints[action];
      const label = document.createElement('span');
      label.textContent = names[action];
      prompt.append(key, label);
      container.append(prompt);
    }
  }

  _updateControlPrompts(force = false) {
    const source = this.input.activeSource;
    const signature = `${source}:${this.input.activeSlot}:${this.screen}:${this.selectedMode}:${this.practice?.step}:${this.paused}:${this.input.connectedGamepads}:${JSON.stringify(this.controls)}`;
    if (!force && signature === this.lastControlSignature) return;
    this.lastControlSignature = signature;
    const hints = controlHints(this.input);
    this._appendControlPrompts(document.getElementById('coach-controls'), hints, ['move', 'jump', 'kick', 'lob', 'dash', 'item']);
    const toast = document.getElementById('controls-toast');
    const human = this.match?.players.find(player => !player.isAI && player.controlSlot === this.input.activeSlot) ||
      this.match?.players.find(player => !player.isAI);
    const slot = human?.controlSlot ?? 0;
    this._appendControlPrompts(toast, controlHints(this.input, slot), ['move', 'jump', 'kick', 'dash', 'item']);
    const tag = document.createElement('b');
    tag.textContent = `${source === 'gamepad' ? 'GAMEPAD' : source === 'touch' ? 'TOUCH' : 'KEYBOARD'} / ${human?.tag || 'P1'}`;
    toast.prepend(tag);
    document.getElementById('menu-input-status').textContent = source === 'gamepad'
      ? `${this.input.connectedGamepads} controller${this.input.connectedGamepads === 1 ? '' : 's'} ready · A to confirm`
      : source === 'touch' ? 'Touch ready · Landscape recommended' : 'Keyboard ready · Gamepads welcome';
    this.touch.updateVisibility(this.screen, this.settings.touchControls);
    this._renderPracticeCoach();
  }

  _renderPracticeCoach() {
    const panel = document.getElementById('practice-coach');
    panel.classList.toggle('hidden', !this.practice || this.screen !== 'match');
    if (!this.practice || this.screen !== 'match') return;
    const step = PRACTICE_STEPS[this.practice.step];
    document.getElementById('practice-step').textContent = this.practice.complete ? 'READY FOR MATCH NIGHT' : `SKILL ${this.practice.step + 1} / ${PRACTICE_STEPS.length}`;
    document.getElementById('practice-title').textContent = step?.title || 'You have got this.';
    document.getElementById('practice-dialogue').textContent = step?.dialogue || 'Coach: Great work. Your next challenge is the raised goal. Keep practicing, or take on your first rival.';
    this._appendControlPrompts(document.getElementById('practice-prompts'), controlHints(this.input), step?.actions || ['jump', 'kick']);
    document.getElementById('btn-finish-practice').textContent = this.practice.complete ? 'Play a match' : 'Leave practice';
  }

  // =========================================================================
  // CUPS, TOURNAMENT, ARCADE, MUTATORS & LOCKER ROOM MODALS
  // =========================================================================
  _openCupsModal() {
    const grid = document.getElementById('cups-grid');
    grid.innerHTML = '';

    for (const cup of GRAND_PRIX_CUPS) {
      const won = this.save.wonCups.includes(cup.id);
      const unlockChar = CHARACTERS.find((c) => c.id === cup.unlocksChar);
      const card = document.createElement('div');
      card.className = `cup-card ${won ? 'conquered' : ''}`;
      card.innerHTML = `
        <div class="cup-card-left">
          <div class="cup-card-icon">${cup.icon}</div>
          <div>
            <h3>${cup.name} ${won ? '✅' : ''}</h3>
            <p>${cup.rounds.length} Rounds • ${cup.difficulty}</p>
            <p style="color:#fde047; font-weight:700;">Reward: +${cup.rewardCoins} 🪙 ${
        unlockChar ? `• Boss Unlock: ${unlockChar.name}` : ''
      }</p>
          </div>
        </div>
        <button class="kickoff-cta-btn compact">ENTER</button>
      `;
      card.addEventListener('click', () => {
        this.audio.playClick();
        this.activeCup = cup;
        this.cupRound = 0;
        this.selectedMode = 'cup';
        this._ensureValidAlly();
        this._applyCupRoundSetup();
        this._closeModal('modal-cups');
        this._showScreen('select');
      });
      grid.appendChild(card);
    }

    this._openModal('modal-cups');
  }

  _applyCupRoundSetup() {
    const cup = this.activeCup || GRAND_PRIX_CUPS[0];
    const round = cup.rounds[Math.min(this.cupRound, cup.rounds.length - 1)];
    const arIdx = ARENAS.findIndex((a) => a.id === round.arenaId);
    this.arenaIdx = arIdx >= 0 ? arIdx : 0;
    const foeIdx = CHARACTERS.findIndex((c) => c.id === round.foeId);
    this.charIdx1 = foeIdx >= 0 ? foeIdx : 5;
    this.kitIdx1 = round.kitIdx || 0;
    this.cupBossScale = round.bossScale || 1.0;
    this.cupRoundAI = round.ai || 'striker';
    this.cupIntroTitle = round.title || `${cup.name.toUpperCase()} — ROUND ${this.cupRound + 1}`;
  }

  // =========================================================================
  // STRIKER TRIALS DOJO
  // =========================================================================
  _openTrialsModal() {
    this._renderTrialsGrid();
    this._openModal('modal-trials');
  }

  _renderTrialsGrid() {
    const grid = document.getElementById('trials-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const starsCount = this.save.trialsWon?.length || 0;
    const badge = document.getElementById('trials-star-badge');
    if (badge) badge.textContent = `⭐ ${starsCount} / ${STRIKER_TRIALS.length} STARS`;

    for (const trial of STRIKER_TRIALS) {
      const cleared = this.save.trialsWon?.includes(trial.id);
      const card = document.createElement('div');
      card.className = `trial-card ${cleared ? 'cleared' : ''}`;
      card.innerHTML = `
        <div class="trial-top">
          <div class="trial-title-wrap">
            <span class="trial-icon">${trial.icon}</span>
            <span class="trial-title">#${trial.num}: ${trial.title}</span>
          </div>
          <span class="trial-badge">${cleared ? '⭐ STAR' : 'NEW'}</span>
        </div>
        <div class="trial-desc">${trial.desc}</div>
        <div class="trial-rule-pill">📜 ${trial.ruleText}</div>
        <div class="trial-bottom">
          <span class="trial-reward">+${trial.rewardCoins} 🪙 Coins</span>
          <button class="kickoff-cta-btn compact">${cleared ? 'RETRY' : 'PLAY'}</button>
        </div>
      `;
      card.addEventListener('click', () => {
        this.audio.playClick();
        this._startTrial(trial);
      });
      grid.appendChild(card);
    }
  }

  _startTrial(trial) {
    this.activeTrial = trial;
    this.selectedMode = 'trial';
    const playerCharIdx = CHARACTERS.findIndex((c) => c.id === trial.playerChar);
    this.charIdx0 = playerCharIdx >= 0 ? playerCharIdx : 0;
    this.kitIdx0 = 0;

    const firstOpponent = trial.opponents[0];
    const foeIdx = CHARACTERS.findIndex((c) => c.id === firstOpponent.charId);
    this.charIdx1 = foeIdx >= 0 ? foeIdx : 1;
    this.kitIdx1 = firstOpponent.kitIdx || 0;

    const arIdx = ARENAS.findIndex((a) => a.id === trial.arenaId);
    this.arenaIdx = arIdx >= 0 ? arIdx : 0;

    this._closeModal('modal-trials');
    this.startMatch();
  }

  _openTourneyModal(keepExisting = false) {
    if (!keepExisting || !this.tourneyState) {
      this._generateTournamentBracket();
    } else {
      this._renderTournamentBracket();
    }
    this._openModal('modal-tourney');
  }

  _generateTournamentBracket() {
    const size = this.tourneySize;
    const humans = Math.min(this.tourneyHumans, size);

    document.querySelectorAll('#tourney-size-pills button').forEach((b) => {
      b.classList.toggle('active', Number(b.dataset.size) === size);
    });
    document.querySelectorAll('#tourney-humans-pills button').forEach((b) => {
      b.classList.toggle('active', Number(b.dataset.humans) === humans);
    });

    const unlockedPool = CHARACTERS.filter((c) => isCharUnlocked(this.save, c.id));
    const shuffledUnlocked = [...unlockedPool].sort(() => Math.random() - 0.5);
    const allPool = [...CHARACTERS].sort(() => Math.random() - 0.5);

    const entrants = [];
    for (let h = 0; h < humans; h++) {
      let chosen = shuffledUnlocked[h % shuffledUnlocked.length];
      if (h === 0 && isCharUnlocked(this.save, CHARACTERS[this.charIdx0].id)) chosen = CHARACTERS[this.charIdx0];
      else if (h === 1 && isCharUnlocked(this.save, CHARACTERS[this.charIdx1].id)) {
        chosen = CHARACTERS[this.charIdx1];
      }
      entrants.push({
        id: `H${h + 1}`,
        tag: `P${h + 1}`,
        humanIdx: h,
        isAI: false,
        charId: chosen.id,
        kitIdx: h === 0 ? this.kitIdx0 : h === 1 ? this.kitIdx1 : h % 3,
        name: chosen.name,
      });
    }

    let cpuCursor = 0;
    while (entrants.length < size) {
      const cand = allPool[cpuCursor % allPool.length];
      cpuCursor++;
      if (entrants.some((e) => e.charId === cand.id) && cpuCursor < allPool.length * 2) continue;
      entrants.push({
        id: `CPU${entrants.length + 1}`,
        tag: 'CPU',
        humanIdx: -1,
        isAI: true,
        charId: cand.id,
        kitIdx: entrants.length % 3,
        name: cand.name,
      });
    }

    // Mix entrants so humans don't always collide in match 1 unless 4 humans in 4-bracket
    const mixed = [...entrants].sort(() => Math.random() - 0.5);

    const roundCount = size === 8 ? 3 : 2;
    const rounds = [];
    let matchCount = size / 2;
    for (let r = 0; r < roundCount; r++) {
      const col = [];
      for (let m = 0; m < matchCount; m++) {
        const arenaPick = ARENAS[(r * 3 + m) % ARENAS.length];
        col.push({
          roundIdx: r,
          matchIdx: m,
          pA: r === 0 ? mixed[m * 2] : null,
          pB: r === 0 ? mixed[m * 2 + 1] : null,
          winner: null,
          scoreA: null,
          scoreB: null,
          arenaId: arenaPick.id,
        });
      }
      rounds.push(col);
      matchCount /= 2;
    }

    this.tourneyState = { size, humans, rounds, activeMatch: null, champion: null };
    this._advanceTourneyCPUMatches();
    this._renderTournamentBracket();
  }

  _advanceTourneyCPUMatches() {
    if (!this.tourneyState) return;
    const { rounds } = this.tourneyState;
    let progressed = true;

    while (progressed) {
      progressed = false;
      for (let r = 0; r < rounds.length; r++) {
        for (let m = 0; m < rounds[r].length; m++) {
          const match = rounds[r][m];
          if (!match.winner && match.pA && match.pB && match.pA.isAI && match.pB.isAI) {
            // Simulate brisk CPU-vs-CPU match
            const chA = getCharacter(match.pA.charId);
            const chB = getCharacter(match.pB.charId);
            const weightA = chA.stats.power + chA.stats.speed + Math.random() * 0.8;
            const weightB = chB.stats.power + chB.stats.speed + Math.random() * 0.8;
            const aWins = weightA >= weightB;
            const hi = 2 + Math.floor(Math.random() * 3);
            const lo = Math.floor(Math.random() * hi);
            match.scoreA = aWins ? hi : lo;
            match.scoreB = aWins ? lo : hi;
            match.winner = aWins ? match.pA : match.pB;
            this._propagateTourneyWinner(r, m, match.winner);
            progressed = true;
          }
        }
      }
    }

    const finalRound = rounds[rounds.length - 1];
    if (finalRound[0].winner) {
      this.tourneyState.champion = finalRound[0].winner;
    }
  }

  _propagateTourneyWinner(roundIdx, matchIdx, winner) {
    const { rounds } = this.tourneyState;
    if (roundIdx + 1 < rounds.length) {
      const nextMatch = rounds[roundIdx + 1][Math.floor(matchIdx / 2)];
      if (matchIdx % 2 === 0) nextMatch.pA = winner;
      else nextMatch.pB = winner;
    }
  }

  _findNextHumanTourneyMatch() {
    if (!this.tourneyState) return null;
    for (const col of this.tourneyState.rounds) {
      for (const m of col) {
        if (!m.winner && m.pA && m.pB) return m;
      }
    }
    return null;
  }

  _renderTournamentBracket() {
    const view = document.getElementById('tourney-bracket-view');
    const status = document.getElementById('tourney-status-text');
    const playBtn = document.getElementById('btn-play-tourney-match');
    view.innerHTML = '';

    if (!this.tourneyState) return;
    const { rounds, champion } = this.tourneyState;
    const nextMatch = this._findNextHumanTourneyMatch();

    const colNames = rounds.length === 3 ? ['QUARTERFINALS', 'SEMIFINALS', 'GRAND FINAL'] : ['SEMIFINALS', 'GRAND FINAL'];

    rounds.forEach((col, rIdx) => {
      const colDiv = document.createElement('div');
      colDiv.className = 'bracket-col';
      const title = document.createElement('div');
      title.className = 'bracket-col-title';
      title.textContent = colNames[rIdx] || `ROUND ${rIdx + 1}`;
      colDiv.appendChild(title);

      for (const m of col) {
        const card = document.createElement('div');
        const isNext = nextMatch && nextMatch.roundIdx === m.roundIdx && nextMatch.matchIdx === m.matchIdx;
        card.className = `bracket-match ${isNext ? 'next-up' : ''}`;

        const renderSlot = (ent, score, isWin) => {
          if (!ent) return `<div class="bracket-slot" style="opacity:0.45"><span>TBD</span><span>—</span></div>`;
          const badge = ent.isAI ? 'CPU' : ent.tag;
          const chRef = getCharacter(ent.charId);
          return `<div class="bracket-slot ${isWin ? 'winner' : ''}">
            <span style="display:inline-flex;align-items:center;gap:6px;">
              <span class="roster-chip has-sprite" style="width:24px;height:24px;border-radius:7px;background-image:url('./assets/sprites/portrait_${ent.charId}.png'),radial-gradient(circle,${chRef.aura},${chRef.primary});cursor:default;"></span>
              [${badge}] ${ent.name}
            </span>
            <span>${score !== null ? score : ''}</span>
          </div>`;
        };

        card.innerHTML =
          renderSlot(m.pA, m.scoreA, m.winner && m.pA && m.winner.id === m.pA.id) +
          renderSlot(m.pB, m.scoreB, m.winner && m.pB && m.winner.id === m.pB.id);
        colDiv.appendChild(card);
      }

      view.appendChild(colDiv);
    });

    if (champion) {
      status.textContent = `👑 CHAMPION: [${champion.isAI ? 'CPU' : champion.tag}] ${champion.name.toUpperCase()}!`;
      playBtn.textContent = '🎲 NEW TOURNAMENT';
    } else if (nextMatch) {
      const ar = ARENAS.find((a) => a.id === nextMatch.arenaId) || ARENAS[0];
      status.textContent = `NEXT UP: ${nextMatch.pA.tag} (${nextMatch.pA.name}) vs ${nextMatch.pB.tag} (${nextMatch.pB.name}) @ ${ar.name}`;
      playBtn.textContent = '⚽ PLAY NEXT MATCH!';
    }
  }

  _startNextTourneyMatch() {
    if (!this.tourneyState) return;
    if (this.tourneyState.champion) {
      this._generateTournamentBracket();
      return;
    }
    const nextMatch = this._findNextHumanTourneyMatch();
    if (!nextMatch) return;

    this.tourneyState.activeMatch = nextMatch;
    this.selectedMode = 'tourney';
    this.charIdx0 = Math.max(0, CHARACTERS.findIndex((c) => c.id === nextMatch.pA.charId));
    this.kitIdx0 = nextMatch.pA.kitIdx || 0;
    this.charIdx1 = Math.max(0, CHARACTERS.findIndex((c) => c.id === nextMatch.pB.charId));
    this.kitIdx1 = nextMatch.pB.kitIdx || 0;
    this.arenaIdx = Math.max(0, ARENAS.findIndex((a) => a.id === nextMatch.arenaId));

    this._closeModal('modal-tourney');
    this.startMatch();
  }

  _openArcadeModal() {
    document.getElementById('rec-target').textContent = `BEST: ${this.save.stats.targetBestScore} PTS`;
    document.getElementById('rec-keepup').textContent = `BEST: ${this.save.stats.keepUpBestTime.toFixed(1)}s`;
    document.getElementById('rec-gauntlet').textContent = `BEST: ${this.save.stats.gauntletBestSaves} SAVES`;
    this._openModal('modal-arcade');
  }

  _openMutatorsModal() {
    this._renderMutatorsGrid();
    this._openModal('modal-mutators');
  }

  _renderMutatorsGrid() {
    const focusedId = document.activeElement?.id;
    const grid = document.getElementById('mutators-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const active = this.settings.activeMutators || [];

    for (const mut of MUTATORS) {
      const isOn = active.includes(mut.id);
      const card = document.createElement('button');
      card.type = 'button';
      card.id = `mutator-${mut.id}`;
      card.setAttribute('aria-pressed', String(isOn));
      card.className = `mutator-card ${isOn ? 'active' : ''}`;
      card.innerHTML = `
        <div class="mutator-icon">${mut.icon}</div>
        <div>
          <strong>${mut.name} ${isOn ? '✓' : ''}</strong>
          <span>${mut.desc}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        this.audio.playClick();
        const set = new Set(this.settings.activeMutators || []);
        if (set.has(mut.id)) set.delete(mut.id);
        else set.add(mut.id);
        this.settings.activeMutators = Array.from(set);
        this._persist();
        this._renderMutatorsGrid();
      });
      grid.appendChild(card);
    }
    if (focusedId?.startsWith('mutator-')) document.getElementById(focusedId)?.focus({ preventScroll: true });
  }

  _openLockerModal(tab = this.lockerTab) {
    this.lockerTab = tab;
    document.getElementById('chk-party-unlock').checked = Boolean(this.settings.partyUnlockAll);
    this._renderLockerContent();
    this._openModal('modal-locker');
  }

  _renderLockerContent() {
    document.getElementById('locker-coin-count').textContent = String(this.save.coins);
    document.querySelectorAll('#locker-tabs button').forEach((b) => {
      b.classList.toggle('active', b.dataset.tab === this.lockerTab);
    });

    const box = document.getElementById('locker-content');
    box.innerHTML = '';

    if (this.lockerTab === 'chars') {
      const grid = document.createElement('div');
      grid.className = 'locker-grid';
      for (const ch of CHARACTERS) {
        const unlocked = isCharUnlocked(this.save, ch.id);
        const card = document.createElement('div');
        card.className = `locker-item-card ${unlocked ? 'unlocked' : ''}`;
        card.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="roster-chip has-sprite" style="width:44px;height:44px;background-image:url('./assets/sprites/portrait_${ch.id}.png'),radial-gradient(circle at 50% 35%,#ffffff44,${ch.primary});cursor:default;"></div>
            <div>
              <strong>${ch.name}</strong>
              <span>⚡ ${ch.hyperName}</span>
            </div>
          </div>
        `;
        const btn = document.createElement('button');
        if (unlocked) {
          btn.className = 'locker-action-btn equipped';
          btn.textContent = '✓ UNLOCKED';
        } else {
          btn.className = 'locker-action-btn buy';
          btn.textContent = `🪙 ${ch.unlockCost}`;
          btn.addEventListener('click', () => {
            if (this.save.coins >= ch.unlockCost) {
              this.save.coins -= ch.unlockCost;
              this.save.unlockedChars.push(ch.id);
              this.audio.playCoin();
              this._pushToast(`${ch.name} Unlocked!`, `${ch.title} joined your squad!`, '🎉');
              this._checkCollectionTrophies();
              this._persist();
              this._renderLockerContent();
              if (this.screen === 'select') this._renderSelectUI();
            } else {
              this.audio.playBack();
              this._pushToast('Need More Star-Coins!', `Play matches or minigames to earn ${ch.unlockCost} 🪙.`, '🪙');
            }
          });
        }
        card.appendChild(btn);
        grid.appendChild(card);
      }
      box.appendChild(grid);
    } else if (this.lockerTab === 'balls') {
      const grid = document.createElement('div');
      grid.className = 'locker-grid';
      for (const skin of BALL_SKINS) {
        const unlocked = this.settings.partyUnlockAll || this.save.unlockedBalls.includes(skin.id);
        const equipped = this.settings.equippedBallSkin === skin.id;
        const card = document.createElement('div');
        card.className = `locker-item-card ${equipped ? 'equipped' : unlocked ? 'unlocked' : ''}`;

        const left = document.createElement('div');
        left.style.cssText = 'display:flex;align-items:center;gap:10px;';
        const cv = document.createElement('canvas');
        cv.width = 48;
        cv.height = 48;
        const cctx = cv.getContext('2d');
        this.art.drawBall(
          cctx,
          { x: 24, y: 24, radius: 17, vx: 0, vy: 0, angle: 0.3, squashX: 1, squashY: 1 },
          60,
          0,
          skin.id,
          false
        );
        const txt = document.createElement('div');
        txt.innerHTML = `<strong>${skin.name}</strong><span>${skin.cost === 0 ? 'Starter Ball' : 'Deluxe Ball Skin'}</span>`;
        left.appendChild(cv);
        left.appendChild(txt);
        card.appendChild(left);

        const btn = document.createElement('button');
        if (equipped) {
          btn.className = 'locker-action-btn equipped';
          btn.textContent = '✓ EQUIPPED';
        } else if (unlocked) {
          btn.className = 'locker-action-btn';
          btn.textContent = 'EQUIP';
          btn.addEventListener('click', () => {
            this.audio.playClick();
            this.settings.equippedBallSkin = skin.id;
            this._persist();
            this._renderLockerContent();
          });
        } else {
          btn.className = 'locker-action-btn buy';
          btn.textContent = `🪙 ${skin.cost}`;
          btn.addEventListener('click', () => {
            if (this.save.coins >= skin.cost) {
              this.save.coins -= skin.cost;
              this.save.unlockedBalls.push(skin.id);
              this.settings.equippedBallSkin = skin.id;
              this.audio.playCoin();
              this._checkCollectionTrophies();
              this._persist();
              this._renderLockerContent();
            } else {
              this.audio.playBack();
              this._pushToast('Need More Star-Coins!', `Costs ${skin.cost} 🪙.`, '🪙');
            }
          });
        }
        card.appendChild(btn);
        grid.appendChild(card);
      }
      box.appendChild(grid);
    } else if (this.lockerTab === 'explosions') {
      const grid = document.createElement('div');
      grid.className = 'locker-grid';
      for (const ex of GOAL_EXPLOSIONS) {
        const unlocked = this.settings.partyUnlockAll || this.save.unlockedExplosions.includes(ex.id);
        const equipped = this.settings.equippedGoalExplosion === ex.id;
        const card = document.createElement('div');
        card.className = `locker-item-card ${equipped ? 'equipped' : unlocked ? 'unlocked' : ''}`;

        const dots = ex.colors
          .slice(0, 4)
          .map((col) => `<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${col};margin-right:3px;border:1.5px solid #191224;"></span>`)
          .join('');
        const info = document.createElement('div');
        info.innerHTML = `<strong>${ex.name}</strong><div>${dots}</div>`;
        card.appendChild(info);

        const btn = document.createElement('button');
        if (equipped) {
          btn.className = 'locker-action-btn equipped';
          btn.textContent = '✓ EQUIPPED';
        } else if (unlocked) {
          btn.className = 'locker-action-btn';
          btn.textContent = 'EQUIP';
          btn.addEventListener('click', () => {
            this.audio.playClick();
            this.settings.equippedGoalExplosion = ex.id;
            this._persist();
            this._renderLockerContent();
          });
        } else {
          btn.className = 'locker-action-btn buy';
          btn.textContent = `🪙 ${ex.cost}`;
          btn.addEventListener('click', () => {
            if (this.save.coins >= ex.cost) {
              this.save.coins -= ex.cost;
              this.save.unlockedExplosions.push(ex.id);
              this.settings.equippedGoalExplosion = ex.id;
              this.audio.playCoin();
              this._checkCollectionTrophies();
              this._persist();
              this._renderLockerContent();
            } else {
              this.audio.playBack();
              this._pushToast('Need More Star-Coins!', `Costs ${ex.cost} 🪙.`, '🪙');
            }
          });
        }
        card.appendChild(btn);
        grid.appendChild(card);
      }
      box.appendChild(grid);
    } else if (this.lockerTab === 'trophies') {
      const st = this.save.stats;
      const summaryBar = document.createElement('div');
      summaryBar.className = 'cup-coop-bar';
      summaryBar.innerHTML = `
        <span>📊 Career: <b>${st.matchesPlayed}</b> Matches • <b>${st.totalGoals}</b> Goals • <b>${this.save.wonCups.length}/4</b> Cups</span>
        <span style="color:#fde047;">🏆 <b>${this.save.trophies.length} / ${TROPHIES.length}</b> Unlocked</span>
      `;
      box.appendChild(summaryBar);

      const grid = document.createElement('div');
      grid.className = 'locker-grid';
      for (const tr of TROPHIES) {
        const won = this.save.trophies.includes(tr.id);
        const card = document.createElement('div');
        card.className = `locker-item-card ${won ? 'unlocked' : ''}`;
        card.style.opacity = won ? '1' : '0.68';
        card.innerHTML = `
          <div>
            <strong>${won ? '🏆' : '🔒'} ${tr.name}</strong>
            <span>${tr.desc}</span>
          </div>
          <span class="mini-pill" style="white-space:nowrap;color:#fde047;">+${tr.reward} 🪙</span>
        `;
        grid.appendChild(card);
      }
      box.appendChild(grid);
    }
  }

  _openControlsModal() {
    this._renderRebindLists();
    this._openModal('modal-controls');
  }

  _renderRebindLists() {
    const actions = [
      ['left', 'Move Left'],
      ['right', 'Move Right'],
      ['up', 'Jump / Lob Aim'],
      ['down', 'Crouch / Ground Pound in Air'],
      ['kick', 'Strike / Volley (Up+Kick = Lob, Hold = Charge)'],
      ['lob', 'Direct Lob (Optional)'],
      ['dash', 'Quick Dash / Parry'],
      ['item', 'Use Power-Up Item'],
    ];

    const buildCol = (containerId, playerKey) => {
      const box = document.getElementById(containerId);
      box.innerHTML = '';
      for (const [act, label] of actions) {
        const row = document.createElement('div');
        row.className = 'rebind-item';
        const span = document.createElement('span');
        span.textContent = label;
        const btn = document.createElement('button');
        btn.className = 'rebind-btn';
        const codes = this.controls[playerKey][act] || [];
        btn.textContent = codes.map(formatKeyCode).join(' / ');

        btn.addEventListener('click', () => {
          document.querySelectorAll('.rebind-btn.listening').forEach((el) => el.classList.remove('listening'));
          btn.classList.add('listening');
          btn.textContent = 'PRESS KEY...';
          this.input.startRebind((newCode) => {
            btn.classList.remove('listening');
            if (newCode) {
              const conflict = this.input.bindingConflict(playerKey, act, newCode);
              if (conflict) {
                this._pushToast('Choose another key', conflict, '!');
                this._renderRebindLists();
                return;
              }
              const existing = this.controls[playerKey][act] || [];
              this.controls[playerKey][act] = [newCode, ...existing.filter((c) => c !== newCode)].slice(0, 2);
              this._persist();
              this.audio.playClick();
              this._updateControlPrompts(true);
            }
            this._renderRebindLists();
          });
        });

        row.appendChild(span);
        row.appendChild(btn);
        box.appendChild(row);
      }
    };

    buildCol('rebind-list-p1', 'p1');
    buildCol('rebind-list-p2', 'p2');
    if (document.getElementById('rebind-list-p3')) buildCol('rebind-list-p3', 'p3');
    if (document.getElementById('rebind-list-p4')) buildCol('rebind-list-p4', 'p4');
  }

  _renderCodex() {
    const grid = document.getElementById('codex-grid');
    grid.innerHTML = '';
    for (const item of ITEMS) {
      const card = document.createElement('div');
      card.className = 'codex-card';
      const iconCanvas = document.createElement('canvas');
      iconCanvas.width = 58;
      iconCanvas.height = 58;
      const ictx = iconCanvas.getContext('2d');
      this.art.drawItemIcon(ictx, item.id, 29, 29, 22, 0);

      const info = document.createElement('div');
      info.innerHTML = `<strong>${item.name}</strong><span>${item.desc}</span>`;
      card.appendChild(iconCanvas);
      card.appendChild(info);
      grid.appendChild(card);
    }
  }

  // =========================================================================
  // SCREEN TRANSITIONS & SELECT SCREEN
  // =========================================================================
  _showScreen(next) {
    this._closeAllModals();
    this.input.clearAll();
    this.pendingInputs.clear();
    this.accumulator = 0;
    if (next !== 'match') {
      this.matchToken++;
      this.match?.dispose();
      this.match = null;
      this.practice = null;
    }
    this.screen = next;
    document.body.dataset.screen = next;
    document.body.dataset.mode = this.selectedMode;
    this.input.gameplayActive = next === 'match';
    ['screen-menu', 'screen-select', 'screen-results'].forEach((id) => {
      document.getElementById(id).classList.add('hidden');
    });
    document.getElementById('match-hud').classList.add('hidden');
    document.getElementById('btn-pause').classList.add('hidden');
    this.audio.setUrgent(false);

    if (next === 'menu') {
      this.match = null;
      this._syncMenuBadges();
      document.getElementById('screen-menu').classList.remove('hidden');
      this.audio.startMusic('menu');
    } else if (next === 'select') {
      this.match = null;
      if (this.selectedMode === 'cup') this._applyCupRoundSetup();
      this._renderSelectUI();
      document.getElementById('screen-select').classList.remove('hidden');
      this.audio.startMusic('menu');
    } else if (next === 'match') {
      document.getElementById('match-hud').classList.remove('hidden');
      document.getElementById('btn-pause').classList.remove('hidden');
      const musicTrack = this.match?.arena?.musicKey || 'meadow';
      this.audio.startMusic(musicTrack);
    } else if (next === 'results') {
      document.getElementById('screen-results').classList.remove('hidden');
      this.audio.startMusic('victory');
    }

    if (this.touch) {
      this.touch.updateVisibility(next, this.settings.touchControls);
    }
    this._updateControlPrompts(true);
    if (next !== 'match') {
      const root = document.getElementById(`screen-${next}`);
      (root?.querySelector('.quick-mode-btn') || root?.querySelector('.kickoff-cta-btn:not(.hidden)') || root?.querySelector('.back-btn'))?.focus({ preventScroll: true });
    } else document.activeElement?.blur();
  }

  _cycleCharacter(slot, dir) {
    if (slot === 1 && (this.selectedMode === 'cup' || this._isMinigameMode())) return;
    this.audio.playClick();
    if (slot === 0) {
      this.charIdx0 = (this.charIdx0 + CHARACTERS.length + dir) % CHARACTERS.length;
      this.previewKickTimer0 = 0.25;
      this._ensureValidAlly();
    } else {
      this.charIdx1 = (this.charIdx1 + CHARACTERS.length + dir) % CHARACTERS.length;
      this.previewKickTimer1 = 0.25;
      this._ensureValidFoeAlly();
    }
    this._renderSelectUI();
  }

  _cycleKit(slot) {
    if (slot === 1 && (this.selectedMode === 'cup' || this._isMinigameMode())) return;
    this.audio.playClick();
    if (slot === 0) {
      this.kitIdx0 = (this.kitIdx0 + 1) % 3;
      this.previewKickTimer0 = 0.2;
    } else {
      this.kitIdx1 = (this.kitIdx1 + 1) % 3;
      this.previewKickTimer1 = 0.2;
    }
    this._renderSelectUI();
  }

  _ensureValidAlly() {
    if (this.allyCharIdx === this.charIdx0 || !isCharUnlocked(this.save, CHARACTERS[this.allyCharIdx].id)) {
      for (let i = 0; i < CHARACTERS.length; i++) {
        if (i !== this.charIdx0 && isCharUnlocked(this.save, CHARACTERS[i].id)) {
          this.allyCharIdx = i;
          return;
        }
      }
    }
  }

  _cycleAlly() {
    for (let step = 1; step <= CHARACTERS.length; step++) {
      const cand = (this.allyCharIdx + step) % CHARACTERS.length;
      if (cand !== this.charIdx0 && isCharUnlocked(this.save, CHARACTERS[cand].id)) {
        this.allyCharIdx = cand;
        this.allyKitIdx = (this.allyKitIdx + 1) % 3;
        break;
      }
    }
    this._renderSelectUI();
  }

  _ensureValidFoeAlly() {
    if (
      this.foeAllyCharIdx === undefined ||
      this.foeAllyCharIdx === this.charIdx1 ||
      !isCharUnlocked(this.save, CHARACTERS[this.foeAllyCharIdx].id)
    ) {
      for (let i = 0; i < CHARACTERS.length; i++) {
        if (i !== this.charIdx1 && isCharUnlocked(this.save, CHARACTERS[i].id)) {
          this.foeAllyCharIdx = i;
          return;
        }
      }
      this.foeAllyCharIdx = (this.charIdx1 + 3) % CHARACTERS.length;
    }
  }

  _cycleFoeAlly() {
    for (let step = 1; step <= CHARACTERS.length; step++) {
      const cand = (this.foeAllyCharIdx + step) % CHARACTERS.length;
      if (cand !== this.charIdx1 && isCharUnlocked(this.save, CHARACTERS[cand].id)) {
        this.foeAllyCharIdx = cand;
        this.foeAllyKitIdx = ((this.foeAllyKitIdx || 0) + 1) % 3;
        break;
      }
    }
    this._renderSelectUI();
  }

  _tryUnlockSelectChar(slot) {
    const idx = slot === 0 ? this.charIdx0 : this.charIdx1;
    const ch = CHARACTERS[idx];
    if (isCharUnlocked(this.save, ch.id)) return;
    if (this.save.coins >= ch.unlockCost) {
      this.save.coins -= ch.unlockCost;
      this.save.unlockedChars.push(ch.id);
      this.audio.playCoin();
      this._pushToast(`${ch.name} Unlocked!`, `${ch.title} is ready for kickoff!`, '🎉');
      this._checkCollectionTrophies();
      this._persist();
      this._renderSelectUI();
    } else {
      this.audio.playBack();
      this._pushToast(
        `Need ${ch.unlockCost} 🪙 Star-Coins`,
        `You have ${this.save.coins} 🪙 — earn more or toggle Party Unlock All in Locker Room!`,
        '🔒'
      );
    }
  }

  _attemptStartFromSelect() {
    const ch0 = CHARACTERS[this.charIdx0];
    if (!isCharUnlocked(this.save, ch0.id)) {
      this._tryUnlockSelectChar(0);
      return;
    }
    if (this.selectedMode === '1v1_pvp' ||
        (this.selectedMode === '2v2' && ['4p', '3p', 'duel'].includes(this.twoVsTwoFormat))) {
      const ch1 = CHARACTERS[this.charIdx1];
      if (!isCharUnlocked(this.save, ch1.id)) {
        this._tryUnlockSelectChar(1);
        return;
      }
    }
    this.audio.playClick();
    this.startMatch();
  }

  _renderSelectUI() {
    const focusedId = document.activeElement?.id;
    const cup = this.activeCup || GRAND_PRIX_CUPS[0];
    const modeTitles = {
      '1v1_cpu': '1P VS CPU — SELECT STRIKERS',
      '1v1_pvp': '2P COUCH VERSUS — SELECT STRIKERS',
      '2v2': '2v2 TEAM CHAOS — CAPTAIN & ALLY SELECT',
      cup: `${cup.icon} ${cup.name.toUpperCase()} — ROUND ${this.cupRound + 1} OF ${cup.rounds.length}`,
      target_blitz: '🎯 TARGET BLITZ — 60s COMBO FRENZY',
      keep_up: '🌋 KEEP-UP SURVIVAL — MOLTEN JUGGLE',
      goalie_gauntlet: '🧤 GOALIE GAUNTLET — CANNON REFLEXES',
    };
    document.getElementById('select-screen-title').textContent =
      modeTitles[this.selectedMode] || 'CHOOSE YOUR STRIKERS';

    const is2v2 = this.selectedMode === '2v2';
    const isCoopCup = this.selectedMode === 'cup' && this.cupCoop;
    const showAllyBtn = is2v2 || isCoopCup;
    const allyBtn = document.getElementById('btn-cycle-ally');
    allyBtn.classList.toggle('hidden', !showAllyBtn);
    if (showAllyBtn) {
      const allyChar = CHARACTERS[this.allyCharIdx];
      const allyTag =
        is2v2 && (this.twoVsTwoFormat === '4p' || this.twoVsTwoFormat === '3p')
          ? 'P3'
          : isCoopCup
          ? 'P2'
          : 'ALLY';
      allyBtn.textContent = `${allyTag}: ${allyChar.name} ↻`;
    }

    const foeAllyBtn = document.getElementById('btn-cycle-foe-ally');
    if (foeAllyBtn) {
      foeAllyBtn.classList.toggle('hidden', !is2v2);
      if (is2v2) {
        this._ensureValidFoeAlly();
        const foeAllyChar = CHARACTERS[this.foeAllyCharIdx] || CHARACTERS[3];
        const foeAllyTag = this.twoVsTwoFormat === '4p' ? 'P4' : 'CPU2';
        foeAllyBtn.textContent = `${foeAllyTag}: ${foeAllyChar.name} ↻`;
      }
    }

    const rightPanel = document.getElementById('right-fighter-panel');
    rightPanel.inert = this._isMinigameMode() || this.selectedMode === 'cup';
    const aiRow = document.getElementById('ai-diff-row');

    if (this._isMinigameMode()) {
      rightPanel.style.opacity = '0.35';
      rightPanel.style.pointerEvents = 'none';
      document.getElementById('p1-panel-label').textContent = 'PLAYER 1 (LEFT GOAL)';
      document.getElementById('p2-panel-label').textContent = 'SOLO CHALLENGE ARENA';
      aiRow.classList.add('hidden');
    } else if (is2v2) {
      rightPanel.style.opacity = '1';
      rightPanel.style.pointerEvents = 'auto';
      const fmt = this.twoVsTwoFormat || '4p';
      if (fmt === '4p') {
        document.getElementById('p1-panel-label').textContent = 'TEAM 1 (P1 & P3) [PAD 1 & 3]';
        document.getElementById('p2-panel-label').textContent = 'TEAM 2 (P2 & P4) [PAD 2 & 4]';
        aiRow.classList.add('hidden');
      } else if (fmt === '3p') {
        document.getElementById('p1-panel-label').textContent = 'TEAM 1 (P1 & P3) [PAD 1 & 3]';
        document.getElementById('p2-panel-label').textContent = 'TEAM 2 (P2 & CPU2) [PAD 2]';
        aiRow.classList.remove('hidden');
      } else if (fmt === 'duel') {
        document.getElementById('p1-panel-label').textContent = 'TEAM 1 (P1 & CPU) [PAD 1]';
        document.getElementById('p2-panel-label').textContent = 'TEAM 2 (P2 & CPU2) [PAD 2]';
        aiRow.classList.remove('hidden');
      } else if (fmt === 'coop') {
        document.getElementById('p1-panel-label').textContent = 'CO-OP SQUAD (P1 & P2) [PAD 1 & 2]';
        document.getElementById('p2-panel-label').textContent = 'CPU RIVALS';
        aiRow.classList.remove('hidden');
      } else {
        document.getElementById('p1-panel-label').textContent = 'SOLO (P1 & CPU) [PAD 1]';
        document.getElementById('p2-panel-label').textContent = 'CPU RIVALS';
        aiRow.classList.remove('hidden');
      }
    } else {
      rightPanel.style.opacity = '1';
      rightPanel.style.pointerEvents = this.selectedMode === 'cup' ? 'none' : 'auto';
      document.getElementById('p1-panel-label').textContent = 'PLAYER 1 (LEFT GOAL)';
      document.getElementById('p2-panel-label').textContent =
        this.selectedMode === '1v1_pvp'
          ? 'PLAYER 2 (RIGHT GOAL)'
          : this.selectedMode === 'cup'
          ? this.cupIntroTitle || `CUP BOSS #${this.cupRound + 1}`
          : 'CPU RIVAL (RIGHT GOAL)';
      if (this.selectedMode === '1v1_pvp' || this.selectedMode === 'cup') aiRow.classList.add('hidden');
      else aiRow.classList.remove('hidden');
    }

    this._populateFighterCard(0, CHARACTERS[this.charIdx0], this.kitIdx0);
    this._populateFighterCard(1, CHARACTERS[this.charIdx1], this.kitIdx1);

    // Stadium Thumbnails (7 Biomes + 🎲 Random)
    const arenaBox = document.getElementById('arena-cards-container');
    arenaBox.innerHTML = '';
    ARENAS.forEach((ar, idx) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.id = `arena-${ar.id}`;
      card.setAttribute('aria-label', ar.name);
      card.setAttribute('aria-pressed', String(idx === this.arenaIdx));
      card.disabled = this.selectedMode === 'cup';
      card.className = `arena-thumb ${idx === this.arenaIdx ? 'selected' : ''} ${ar.isRandom ? 'arena-random-thumb' : ''}`;
      if (ar.isRandom) {
        card.style.background = 'linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #f43f5e 100%)';
        card.innerHTML = `<div class="random-thumb-content"><span class="dice-icon">🎲</span><span class="random-badge">RANDOM</span></div>`;
      } else {
        card.style.backgroundImage = `url('./assets/images/${ar.bgKey}.jpg')`;
        card.innerHTML = `<span>${ar.name.split(' ')[0]}</span>`;
      }
      card.addEventListener('click', () => {
        if (this.selectedMode === 'cup') return;
        this.audio.playClick();
        this.arenaIdx = idx;
        this._renderSelectUI();
      });
      arenaBox.appendChild(card);
    });

    const curArena = ARENAS[this.arenaIdx] || ARENAS[0];
    document.getElementById('arena-title').textContent = `${curArena.name} — ${curArena.subtitle}`;
    const guide = ARENA_GUIDES[curArena.id];
    document.getElementById('arena-desc').textContent = guide
      ? `${guide.tip} ${this.settings.stageHazards ? guide.hazard : 'Stage hazards disabled.'}`
      : curArena.desc;

    this._syncQuickRulePills();
    this._syncMenuBadges();
    if (focusedId) document.getElementById(focusedId)?.focus({ preventScroll: true });
    document.getElementById('btn-random-arena').disabled = this.selectedMode === 'cup';
    document.getElementById('btn-random-ally').classList.toggle('hidden', !showAllyBtn);
    document.getElementById('btn-random-foe-ally').classList.toggle('hidden', !is2v2);
  }

  _populateFighterCard(slot, baseChar, kitIdx) {
    const ch = getCharacter(baseChar.id, kitIdx);
    const unlocked = isCharUnlocked(this.save, baseChar.id);
    const requiresUnlock =
      !unlocked && (slot === 0 || this.selectedMode === '1v1_pvp' ||
        (this.selectedMode === '2v2' && ['4p', '3p', 'duel'].includes(this.twoVsTwoFormat)));

    document.getElementById(`char${slot}-name`).textContent = ch.name;
    document.getElementById(`btn-kit-${slot}`).textContent = `🎨 ${ch.kitName || 'Kit 1'}`;
    document.getElementById(`char${slot}-title`).textContent = ch.title;
    document.getElementById(`char${slot}-trait`).textContent = ch.traitName;
    document.getElementById(`char${slot}-trait-desc`).textContent = ch.traitDesc;
    document.getElementById(`char${slot}-hyper`).textContent = ch.hyperName;

    const unlockBtn = document.getElementById(`btn-unlock-char-${slot}`);
    if (requiresUnlock) {
      unlockBtn.classList.remove('hidden');
      unlockBtn.textContent =
        this.save.coins >= baseChar.unlockCost
          ? `🔓 UNLOCK FOR ${baseChar.unlockCost} 🪙`
          : `🔒 LOCKED (${baseChar.unlockCost} 🪙)`;
    } else {
      unlockBtn.classList.add('hidden');
    }

    const statsEl = document.getElementById(`char${slot}-stats`);
    statsEl.innerHTML = '';
    for (const [label, val] of [
      ['SPD', ch.displayStats.speed],
      ['JMP', ch.displayStats.jump],
      ['PWR', ch.displayStats.power],
      ['WGT', ch.displayStats.weight],
    ]) {
      const item = document.createElement('div');
      item.className = 'stat-item';
      let pips = '';
      for (let i = 1; i <= 5; i++) {
        pips += `<span class="stat-pip ${i <= val ? 'filled' : ''}"></span>`;
      }
      item.innerHTML = `<span>${label}</span><div class="stat-pips">${pips}</div>`;
      statsEl.appendChild(item);
    }

    const strip = document.getElementById(`roster-strip-${slot}`);
    strip.innerHTML = '';
    CHARACTERS.forEach((c, idx) => {
      const chipUnlocked = isCharUnlocked(this.save, c.id);
      const chip = document.createElement('button');
      chip.id = `roster-${slot}-${c.id}`;
      chip.setAttribute('aria-label', c.name);
      chip.setAttribute('aria-pressed', String((slot === 0 ? this.charIdx0 : this.charIdx1) === idx));
      const activeIdx = slot === 0 ? this.charIdx0 : this.charIdx1;
      const showLockedStyle = !chipUnlocked && (slot === 0 || this.selectedMode === '1v1_pvp' ||
        (this.selectedMode === '2v2' && ['4p', '3p', 'duel'].includes(this.twoVsTwoFormat)));
      chip.className = `roster-chip has-sprite ${idx === activeIdx ? 'selected' : ''} ${showLockedStyle ? 'locked' : ''}`;
      chip.style.backgroundImage = `url('./assets/sprites/portrait_${c.id}.png'), radial-gradient(circle at 50% 35%, #ffffff44, ${c.primary})`;
      if (showLockedStyle) {
        chip.innerHTML = `<span class="lock-corner">🔒</span>`;
      }
      chip.title = showLockedStyle ? `${c.name} (${c.unlockCost} 🪙)` : c.name;
      chip.addEventListener('click', () => {
        if (slot === 1 && (this.selectedMode === 'cup' || this._isMinigameMode())) return;
        this.audio.playClick();
        if (slot === 0) {
          this.charIdx0 = idx;
          this.previewKickTimer0 = 0.25;
          this._ensureValidAlly();
        } else {
          this.charIdx1 = idx;
          this.previewKickTimer1 = 0.25;
        }
        this._renderSelectUI();
      });
      strip.appendChild(chip);
    });

  }

  _syncQuickRulePills() {
    document.querySelectorAll('#quick-ai-pills button').forEach((b) => {
      b.classList.toggle('active', b.dataset.ai === this.settings.aiDifficulty);
    });
    document.querySelectorAll('#quick-time-pills button').forEach((b) => {
      b.classList.toggle('active', Number(b.dataset.time) === this.settings.matchDuration);
    });
    document.querySelectorAll('#quick-item-pills button').forEach((b) => {
      b.classList.toggle('active', b.dataset.items === this.settings.itemMode);
    });

    const hyperPill = document.getElementById('pill-toggle-hyper');
    if (hyperPill) {
      const on = this.settings.hyperStrikes !== false;
      hyperPill.classList.toggle('active', on);
      hyperPill.textContent = `⚡ Hyper: ${on ? 'ON' : 'OFF'}`;
    }
    const hazPill = document.getElementById('pill-toggle-hazards');
    if (hazPill) {
      const on = this.settings.stageHazards !== false;
      hazPill.classList.toggle('active', on);
      hazPill.textContent = `🌋 Hazards: ${on ? 'ON' : 'OFF'}`;
    }

    // 2v2 Format pills
    const row2v2 = document.getElementById('row-2v2-format');
    if (row2v2) {
      row2v2.classList.toggle('hidden', this.selectedMode !== '2v2');
      document.querySelectorAll('#quick-2v2-pills button').forEach((b) => {
        b.classList.toggle('active', b.dataset.format === (this.twoVsTwoFormat || '4p'));
      });
    }
  }

  randomizePlayer(slot) {
    if (slot === 1 && (this.selectedMode === 'cup' || this._isMinigameMode())) return;
    this.audio.playClick();
    const unlocked = CHARACTERS.filter((c) => isCharUnlocked(this.save, c.id));
    if (unlocked.length === 0) return;
    const picked = unlocked[Math.floor(Math.random() * unlocked.length)];
    const charIdx = CHARACTERS.findIndex((c) => c.id === picked.id);
    const kitIdx = Math.floor(Math.random() * (picked.kits?.length || 1));

    if (slot === 0) {
      this.charIdx0 = charIdx;
      this.kitIdx0 = kitIdx;
      this.previewKickTimer0 = 0.35;
      this._ensureValidAlly();
    } else if (slot === 1) {
      this.charIdx1 = charIdx;
      this.kitIdx1 = kitIdx;
      this.previewKickTimer1 = 0.35;
      this._ensureValidFoeAlly();
    } else if (slot === 'ally') {
      this.allyCharIdx = charIdx;
      this.allyKitIdx = kitIdx;
    } else if (slot === 'foeAlly') {
      this.foeAllyCharIdx = charIdx;
      this.foeAllyKitIdx = kitIdx;
    }

    this._pushToast('🎲 Random Pick!', `${picked.name} selected!`, '✨');
    this._renderSelectUI();
  }

  randomizeArena() {
    if (this.selectedMode === 'cup') return;
    this.audio.playClick();
    const realArenas = ARENAS.filter((a) => !a.isRandom);
    const picked = realArenas[Math.floor(Math.random() * realArenas.length)];
    this.arenaIdx = ARENAS.findIndex((a) => a.id === picked.id);
    this._pushToast('🎲 Random Stadium!', `${picked.name} selected!`, '🏟️');
    this._renderSelectUI();
  }

  // =========================================================================
  // MATCH LAUNCH, HUD & RESULTS LIFECYCLE
  // =========================================================================
  startMatch() {
    this.match?.dispose();
    this._closeAllModals();
    this.practice = null;
    const token = ++this.matchToken;
    const ch0 = CHARACTERS[this.charIdx0];
    const ch1 = CHARACTERS[this.charIdx1];
    const arena = ARENAS[this.arenaIdx] || ARENAS[0];
    let introTitle = '';
    let playersConfig = [];

    if (this._isMinigameMode()) {
      playersConfig = [
        { slot: 0, team: 0, tag: 'P1', charId: ch0.id, kitIdx: this.kitIdx0, isAI: false, role: 'striker' },
      ];
      if (this.selectedMode === 'practice') introTitle = 'LEARN AT YOUR OWN PACE';
      else if (this.selectedMode === 'keep_up') introTitle = 'DON’T LET ANY BALL HIT THE LAVA!';
      else if (this.selectedMode === 'goalie_gauntlet') introTitle = 'GUARD YOUR NET — 3 LIVES!';
      else introTitle = 'SMASH TARGETS & SCORE FOR 2x COMBO!';
    } else if (this.selectedMode === '1v1_pvp') {
      playersConfig = [
        { slot: 0, team: 0, tag: 'P1', charId: ch0.id, kitIdx: this.kitIdx0, isAI: false, role: 'striker' },
        { slot: 1, team: 1, tag: 'P2', charId: ch1.id, kitIdx: this.kitIdx1, isAI: false, role: 'striker' },
      ];
    } else if (this.selectedMode === '2v2') {
      const ally = CHARACTERS[this.allyCharIdx] || CHARACTERS[1];
      const foeAlly = CHARACTERS[this.foeAllyCharIdx] || CHARACTERS[(this.charIdx1 + 3) % CHARACTERS.length];
      const fmt = this.twoVsTwoFormat || '4p';

      if (fmt === '4p') {
        // Full 4-Player Local Couch 2v2 (P1 & P3 vs P2 & P4)
        playersConfig = [
          { slot: 0, team: 0, tag: 'P1', charId: ch0.id, kitIdx: this.kitIdx0, isAI: false, role: 'striker' },
          { slot: 2, team: 0, tag: 'P3', charId: ally.id, kitIdx: this.allyKitIdx, isAI: false, role: 'defender' },
          { slot: 1, team: 1, tag: 'P2', charId: ch1.id, kitIdx: this.kitIdx1, isAI: false, role: 'striker' },
          { slot: 3, team: 1, tag: 'P4', charId: foeAlly.id, kitIdx: this.foeAllyKitIdx, isAI: false, role: 'defender' },
        ];
      } else if (fmt === '3p') {
        // 3 Humans: P1 & P3 vs P2 + CPU2
        playersConfig = [
          { slot: 0, team: 0, tag: 'P1', charId: ch0.id, kitIdx: this.kitIdx0, isAI: false, role: 'striker' },
          { slot: 2, team: 0, tag: 'P3', charId: ally.id, kitIdx: this.allyKitIdx, isAI: false, role: 'defender' },
          { slot: 1, team: 1, tag: 'P2', charId: ch1.id, kitIdx: this.kitIdx1, isAI: false, role: 'striker' },
          { slot: 3, team: 1, tag: 'CPU2', charId: foeAlly.id, kitIdx: this.foeAllyKitIdx, isAI: true, role: 'defender' },
        ];
      } else if (fmt === 'coop') {
        // 2 Humans on Team 0 vs 2 CPUs on Team 1!
        playersConfig = [
          { slot: 0, team: 0, tag: 'P1', charId: ch0.id, kitIdx: this.kitIdx0, isAI: false, role: 'striker' },
          { slot: 1, team: 0, tag: 'P2', charId: ally.id, kitIdx: this.allyKitIdx, isAI: false, role: 'defender' },
          { slot: 2, team: 1, tag: 'CPU1', charId: ch1.id, kitIdx: this.kitIdx1, isAI: true, role: 'striker' },
          { slot: 3, team: 1, tag: 'CPU2', charId: foeAlly.id, kitIdx: this.foeAllyKitIdx, isAI: true, role: 'defender' },
        ];
      } else if (fmt === 'duel') {
        // 2 Humans Duel: P1 & CPU vs P2 & CPU
        playersConfig = [
          { slot: 0, team: 0, tag: 'P1', charId: ch0.id, kitIdx: this.kitIdx0, isAI: false, role: 'striker' },
          { slot: 2, team: 0, tag: 'ALLY', charId: ally.id, kitIdx: this.allyKitIdx, isAI: true, role: 'defender' },
          { slot: 1, team: 1, tag: 'P2', charId: ch1.id, kitIdx: this.kitIdx1, isAI: false, role: 'striker' },
          { slot: 3, team: 1, tag: 'CPU2', charId: foeAlly.id, kitIdx: this.foeAllyKitIdx, isAI: true, role: 'defender' },
        ];
      } else {
        // Solo 1P + CPU Ally vs 2 CPUs
        playersConfig = [
          { slot: 0, team: 0, tag: 'P1', charId: ch0.id, kitIdx: this.kitIdx0, isAI: false, role: 'striker' },
          { slot: 2, team: 0, tag: 'ALLY', charId: ally.id, kitIdx: this.allyKitIdx, isAI: true, role: 'defender' },
          { slot: 1, team: 1, tag: 'CPU1', charId: ch1.id, kitIdx: this.kitIdx1, isAI: true, role: 'striker' },
          { slot: 3, team: 1, tag: 'CPU2', charId: foeAlly.id, kitIdx: this.foeAllyKitIdx, isAI: true, role: 'defender' },
        ];
      }
    } else if (this.selectedMode === 'cup') {
      introTitle = this.cupIntroTitle;
      if (this.cupCoop) {
        const ally = CHARACTERS[this.allyCharIdx] || CHARACTERS[1];
        const wingIdx = (this.charIdx1 + 2) % CHARACTERS.length;
        playersConfig = [
          { slot: 0, team: 0, tag: 'P1', charId: ch0.id, kitIdx: this.kitIdx0, isAI: false, role: 'striker' },
          {
            slot: 1,
            team: 0,
            tag: 'P2',
            charId: ally.id,
            kitIdx: this.allyKitIdx,
            isAI: false,
            role: 'defender',
          },
          {
            slot: 2,
            team: 1,
            tag: this.cupBossScale > 1.05 ? 'BOSS' : 'CPU1',
            charId: ch1.id,
            kitIdx: this.kitIdx1,
            isAI: true,
            aiDifficulty: this.cupRoundAI,
            bossScale: this.cupBossScale,
            role: 'striker',
          },
          {
            slot: 3,
            team: 1,
            tag: 'CPU2',
            charId: CHARACTERS[wingIdx].id,
            kitIdx: 0,
            isAI: true,
            aiDifficulty: this.cupRoundAI,
            role: 'defender',
          },
        ];
      } else {
        playersConfig = [
          { slot: 0, team: 0, tag: 'P1', charId: ch0.id, kitIdx: this.kitIdx0, isAI: false, role: 'striker' },
          {
            slot: 1,
            team: 1,
            tag: this.cupBossScale > 1.05 ? 'BOSS' : 'CPU',
            charId: ch1.id,
            kitIdx: this.kitIdx1,
            isAI: true,
            aiDifficulty: this.cupRoundAI,
            bossScale: this.cupBossScale,
            role: 'striker',
          },
        ];
      }
    } else if (this.selectedMode === 'tourney' && this.tourneyState?.activeMatch) {
      const tm = this.tourneyState.activeMatch;
      const slotFor = (ent, sideSlot) => {
        if (ent.isAI) return sideSlot;
        if (this.input.getGamepad(ent.humanIdx)) return ent.humanIdx;
        return sideSlot; // Pass-and-play keyboard seamlessly maps Left->WASD (0), Right->Arrows (1)!
      };
      // If single human is on Right side vs CPU on Left, let single human still use WASD (slot 0) if no 2nd pad!
      let slotA = slotFor(tm.pA, 0);
      let slotB = slotFor(tm.pB, 1);
      if (tm.pA.isAI && !tm.pB.isAI && this.input.connectedGamepads === 0) {
        slotB = 0;
      }
      introTitle = `TOURNAMENT: ${tm.pA.tag} VS ${tm.pB.tag}`;
      playersConfig = [
        {
          slot: 0,
          controlSlot: slotA,
          team: 0,
          tag: tm.pA.tag,
          charId: tm.pA.charId,
          kitIdx: tm.pA.kitIdx,
          isAI: tm.pA.isAI,
          role: 'striker',
        },
        {
          slot: 1,
          controlSlot: slotB,
          team: 1,
          tag: tm.pB.tag,
          charId: tm.pB.charId,
          kitIdx: tm.pB.kitIdx,
          isAI: tm.pB.isAI,
          role: 'striker',
        },
      ];
    } else if (this.selectedMode === 'trial' && this.activeTrial) {
      const trial = this.activeTrial;
      introTitle = `TRIAL #${trial.num}: ${trial.title.toUpperCase()}`;
      const pChar = CHARACTERS.find((c) => c.id === trial.playerChar) || ch0;
      playersConfig = [
        { slot: 0, team: 0, tag: 'P1', charId: pChar.id, kitIdx: 0, isAI: false, role: 'striker' },
      ];
      trial.opponents.forEach((opp, idx) => {
        const oppChar = CHARACTERS.find((c) => c.id === opp.charId) || ch1;
        playersConfig.push({
          slot: idx + 1,
          team: opp.team ?? 1,
          tag: trial.opponents.length > 1 ? `CPU${idx + 1}` : (opp.bossScale && opp.bossScale > 1.2 ? 'BOSS' : 'CPU'),
          charId: oppChar.id,
          kitIdx: opp.kitIdx || 0,
          isAI: true,
          aiDifficulty: opp.aiDifficulty || 'striker',
          bossScale: opp.bossScale || 1.0,
          role: 'striker',
        });
      });
    } else {
      // '1v1_cpu'
      playersConfig = [
        { slot: 0, team: 0, tag: 'P1', charId: ch0.id, kitIdx: this.kitIdx0, isAI: false, role: 'striker' },
        { slot: 1, team: 1, tag: 'CPU', charId: ch1.id, kitIdx: this.kitIdx1, isAI: true, role: 'striker' },
      ];
    }

    let chosenArena = (this.selectedMode === 'trial' && this.activeTrial)
      ? (ARENAS.find((a) => a.id === this.activeTrial.arenaId) || arena)
      : arena;

    // Handle Random / Mystery Stadium selection at kickoff
    if (chosenArena.id === 'random' || chosenArena.isRandom) {
      const realArenas = ARENAS.filter((a) => a.id !== 'random' && !a.isRandom);
      chosenArena = realArenas[Math.floor(Math.random() * realArenas.length)];
      this._pushToast('🎲 Random Stadium!', `${chosenArena.name} selected for match!`, '🏟️');
    }

    this.ai = new AIController();
    this.paused = false;
    this.toastFadeTimer = 9.0;
    document.getElementById('controls-toast').style.opacity = '1';

    this.match = new MatchSimulation({
      mode: this.selectedMode,
      trial: this.selectedMode === 'trial' ? this.activeTrial : null,
      arenaId: chosenArena.id,
      playersConfig,
      settings: { ...this.settings, reducedMotion: this.reducedMotion },
      audio: this.audio,
      introTitle,
      onGoal: () => this._syncHUD(),
      onMatchEnd: (summary) => {
        if (this.matchToken === token && this.screen === 'match') this._handleMatchFinished(summary);
      },
    });

    this._setupMatchHUD(ch0, ch1);
    this._showScreen('match');
    if (this.selectedMode === 'practice') {
      this.practice = new PracticeCoach(this.match);
      this._renderPracticeCoach();
      document.getElementById('controls-toast').classList.add('hidden');
    } else document.getElementById('controls-toast').classList.remove('hidden');
    this._syncHUD();
    if (this.settings.showTips && !this.save.onboarding.seenModes.includes(this.selectedMode)) this._openCoach();
  }

  _setupMatchHUD(ch0, ch1) {
    const leftName = document.getElementById('hud-left-name');
    const leftSub = document.getElementById('hud-left-sub');
    const rightName = document.getElementById('hud-right-name');
    const rightSub = document.getElementById('hud-right-sub');
    const modeTag = document.getElementById('hud-mode-tag');

    leftName.textContent = ch0.name.toUpperCase();
    if (this.selectedMode === '2v2') {
      const humanCount = this.match?.players.filter((p) => !p.isAI).length || 0;
      leftSub.textContent =
        this.twoVsTwoFormat === 'coop'
          ? 'P1 + P2 CO-OP'
          : humanCount >= 3
          ? 'TEAM 1 (P1 & P3)'
          : 'TEAM 1';
      rightSub.textContent =
        humanCount >= 4
          ? 'TEAM 2 (P2 & P4)'
          : humanCount === 3
          ? 'TEAM 2 (P2 & CPU2)'
          : this.twoVsTwoFormat === 'duel'
          ? 'TEAM 2 (P2 & CPU2)'
          : 'CPU RIVALS';
      modeTag.textContent = humanCount >= 4 ? '4P COUCH 2v2' : '2v2 CHAOS';
    } else {
      leftSub.textContent =
        this.selectedMode === 'cup' && this.cupCoop
          ? 'P1 + P2 CO-OP'
          : this.match?.players[0]?.tag || 'PLAYER 1';
    }

    this._updateControlPrompts(true);

    const hypeRow = document.getElementById('hud-hype-row');
    const hypeBox1 = document.getElementById('hype-box-1');
    if (this.match.settings.hyperStrikes === false || this.selectedMode === 'practice') {
      hypeRow.classList.add('hidden');
    } else {
      hypeRow.classList.remove('hidden');
      hypeBox1.style.visibility = this._isMinigameMode() ? 'hidden' : 'visible';
    }

    if (this.selectedMode === 'practice') {
      leftSub.textContent = 'GUIDED PRACTICE';
      rightName.textContent = 'SKILLS';
      rightSub.textContent = 'AT YOUR PACE';
      modeTag.textContent = 'TRAINING';
    } else if (this.selectedMode === 'target_blitz') {
      rightName.textContent = 'BEST RECORD';
      rightSub.textContent = 'PTS';
      modeTag.textContent = 'TARGET BLITZ';
    } else if (this.selectedMode === 'keep_up') {
      rightName.textContent = 'BEST TIME';
      rightSub.textContent = 'MOLTEN PITCH';
      modeTag.textContent = 'KEEP-UP LAVA';
    } else if (this.selectedMode === 'goalie_gauntlet') {
      leftSub.textContent = 'SAVES';
      rightName.textContent = 'LIVES LEFT';
      rightSub.textContent = 'STRIKER CANNON';
      modeTag.textContent = 'GAUNTLET';
    } else if (this.selectedMode === 'cup') {
      rightName.textContent = ch1.name.toUpperCase();
      rightSub.textContent = `${this.cupRoundAI.toUpperCase()} BOSS`;
      modeTag.textContent = `CUP R${this.cupRound + 1}`;
    } else if (this.selectedMode === 'tourney' && this.tourneyState?.activeMatch) {
      const tm = this.tourneyState.activeMatch;
      leftSub.textContent = tm.pA.isAI ? 'CPU' : `${tm.pA.tag} (LEFT)`;
      rightName.textContent = ch1.name.toUpperCase();
      rightSub.textContent = tm.pB.isAI ? 'CPU' : `${tm.pB.tag} (RIGHT)`;
      modeTag.textContent = 'TOURNAMENT';
    } else if (this.selectedMode === 'trial' && this.activeTrial) {
      rightName.textContent = ch1.name.toUpperCase();
      rightSub.textContent = `TRIAL #${this.activeTrial.num}`;
      modeTag.textContent = 'STRIKER TRIAL';
    } else if (this.selectedMode === '2v2') {
      rightName.textContent = ch1.name.toUpperCase();
    } else {
      rightName.textContent = ch1.name.toUpperCase();
      rightSub.textContent =
        this.selectedMode === '1v1_pvp' ? 'PLAYER 2' : `CPU (${this.settings.aiDifficulty.toUpperCase()})`;
      modeTag.textContent = this.selectedMode === '2v2' ? '2v2 CHAOS' : 'KUNG-FOOT';
    }
  }

  _syncHUD() {
    if (!this.match) return;
    const m = this.match;
    const leftScoreEl = document.getElementById('hud-left-score');
    const rightScoreEl = document.getElementById('hud-right-score');
    const timerEl = document.getElementById('hud-timer');

    if (this.selectedMode === 'practice') {
      leftScoreEl.textContent = String(m.scores[0]);
      rightScoreEl.textContent = `${this.practice?.step || 0}/5`;
    } else if (this.selectedMode === 'target_blitz') {
      leftScoreEl.textContent = String(m.scores[0]);
      rightScoreEl.textContent = String(Math.max(this.save.stats.targetBestScore, m.scores[0]));
    } else if (this.selectedMode === 'keep_up') {
      leftScoreEl.textContent = `${m.survivalTime.toFixed(1)}s`;
      rightScoreEl.textContent = `${Math.max(this.save.stats.keepUpBestTime, m.survivalTime).toFixed(1)}s`;
    } else if (this.selectedMode === 'goalie_gauntlet') {
      leftScoreEl.textContent = String(m.gauntletSaves);
      rightScoreEl.textContent = m.gauntletLives > 0 ? '♥'.repeat(m.gauntletLives) : '0';
    } else {
      leftScoreEl.textContent = String(m.scores[0]);
      rightScoreEl.textContent = String(m.scores[1]);
    }

    if (this.selectedMode === 'keep_up') {
      timerEl.textContent = `${m.balls.length} ⚽`;
      timerEl.classList.remove('urgent');
      this.audio.setUrgent(m.balls.length >= 3);
    } else if (this.selectedMode === 'goalie_gauntlet') {
      const wave = 1 + Math.floor(m.gauntletSaves / 5);
      timerEl.textContent = `W-${wave}`;
      timerEl.classList.toggle('urgent', m.gauntletLives === 1);
      this.audio.setUrgent(m.gauntletLives === 1);
    } else if (m.suddenDeath && m.settings.suddenDeathMode === 'golden') {
      timerEl.textContent = 'GOLDEN';
      timerEl.classList.add('urgent');
      this.audio.setUrgent(true);
    } else if (m.unlimitedTime) {
      timerEl.textContent = '∞';
      timerEl.classList.remove('urgent');
      this.audio.setUrgent(false);
    } else {
      const total = Math.ceil(m.timeRemaining);
      const mins = Math.floor(total / 60);
      const secs = total % 60;
      timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      const urgent = total <= 15;
      timerEl.classList.toggle('urgent', total <= 10);
      this.audio.setUrgent(urgent);
    }

    // Sync Team Hype Meters
    const objective = document.getElementById('trial-objective');
    const progress = trialProgress(m);
    objective.classList.toggle('hidden', !progress);
    if (objective.textContent !== progress) objective.textContent = progress;
    if (m.settings.hyperStrikes !== false && m.hype) {
      for (let t = 0; t <= 1; t++) {
        const val = Math.min(100, Math.floor(m.hype[t] || 0));
        const fill = document.getElementById(`hype-fill-${t}`);
        const label = document.getElementById(`hype-label-${t}`);
        const box = document.getElementById(`hype-box-${t}`);
        if (fill) fill.style.width = `${val}%`;
        if (box) box.classList.toggle('ready', val >= 100);
        if (label) {
          label.textContent = val >= 100 ? '⚡ HYPER STRIKE READY! (HOLD STRIKE)' : `HYPE ${val}%`;
        }
      }
    }
  }

  togglePause(forceState) {
    if (this.screen !== 'match') return;
    const pause = forceState !== undefined ? forceState : !this.paused;
    if (pause) {
      if (!this.paused) this._openModal('modal-pause');
    } else {
      this._closeAllModals();
      this.input.clearAll();
      this.pendingInputs.clear();
      this.accumulator = 0;
    }
  }

  _handleMatchFinished(summary) {
    if (summary.mode === 'practice') {
      this._showScreen('menu');
      return;
    }
    this.lastSummary = summary;
    const headline = document.getElementById('results-headline');
    const scoreline = document.getElementById('results-scoreline');
    const cupBanner = document.getElementById('cup-progress-banner');
    const coinBadge = document.getElementById('results-coin-badge');
    const nextCupBtn = document.getElementById('btn-next-cup');
    const backTourneyBtn = document.getElementById('btn-back-tourney');
    const rematchBtn = document.getElementById('btn-rematch');

    cupBanner.classList.add('hidden');
    nextCupBtn.classList.add('hidden');
    backTourneyBtn.classList.add('hidden');
    rematchBtn.classList.remove('hidden');

    // Update Lifetime Stats & Calculate Star-Coin Payout
    this.save.stats.matchesPlayed++;
    const humanPlayers = summary.players.filter((p) => !p.isAI);
    const humanGoals = humanPlayers.reduce((sum, p) => sum + p.stats.goals, 0);
    if (!this._isMinigameMode(summary.mode)) {
      this.save.stats.totalGoals += humanGoals;
    }

    let coinsEarned = 20;

    if (summary.mode === 'target_blitz') {
      coinsEarned = 15 + Math.floor(summary.targetScore / 110);
      const isNewBest = summary.targetScore > this.save.stats.targetBestScore;
      if (isNewBest) this.save.stats.targetBestScore = summary.targetScore;
      headline.textContent = isNewBest ? 'NEW RECORD!! 🎯' : 'TARGET BLITZ COMPLETE!';
      scoreline.textContent = `${summary.targetScore} PTS`;
    } else if (summary.mode === 'keep_up') {
      coinsEarned = 15 + Math.floor(summary.survivalTime * 0.9);
      const isNewBest = summary.survivalTime > this.save.stats.keepUpBestTime;
      if (isNewBest) this.save.stats.keepUpBestTime = summary.survivalTime;
      headline.textContent = isNewBest ? 'NEW LAVA RECORD!! 🌋' : 'KEEP-UP COMPLETE!';
      scoreline.textContent = `${summary.survivalTime.toFixed(1)} SECONDS`;
    } else if (summary.mode === 'goalie_gauntlet') {
      coinsEarned = 15 + summary.gauntletSaves * 2;
      const isNewBest = summary.gauntletSaves > this.save.stats.gauntletBestSaves;
      if (isNewBest) this.save.stats.gauntletBestSaves = summary.gauntletSaves;
      headline.textContent = isNewBest ? 'NEW GAUNTLET RECORD!! 🧤' : 'GAUNTLET FINISHED!';
      scoreline.textContent = `${summary.gauntletSaves} CANNON SAVES`;
    } else if (summary.mode === 'cup') {
      const cup = this.activeCup || GRAND_PRIX_CUPS[0];
      cupBanner.classList.remove('hidden');
      scoreline.textContent = `${summary.scores[0]} — ${summary.scores[1]}`;
      coinsEarned = 22 + humanGoals * 4 + (summary.winnerTeam === 0 ? 18 : 0);

      if (summary.winnerTeam === 0) {
        if (this.cupRound >= cup.rounds.length - 1) {
          coinsEarned += cup.rewardCoins;
          if (!this.save.wonCups.includes(cup.id)) {
            this.save.wonCups.push(cup.id);
          }
          this.save.stats.cupsWon++;
          if (cup.unlocksChar && !this.save.unlockedChars.includes(cup.unlocksChar)) {
            this.save.unlockedChars.push(cup.unlocksChar);
            const bossChar = CHARACTERS.find((c) => c.id === cup.unlocksChar);
            if (bossChar) {
              this._pushToast(`BOSS UNLOCKED: ${bossChar.name}!`, `Conquered the ${cup.name}!`, '🔓');
            }
          }
          cupBanner.textContent = `🏆 ${cup.name.toUpperCase()} CONQUERED! 🏆`;
          headline.textContent = `${CHARACTERS[this.charIdx0].name.toUpperCase()} IS CHAMPION!`;
        } else {
          cupBanner.textContent = `${cup.name.toUpperCase()} — ROUND ${this.cupRound + 1} VICTORY!`;
          headline.textContent = 'ADVANCING TO NEXT ROUND!';
          nextCupBtn.classList.remove('hidden');
          rematchBtn.classList.add('hidden');
        }
      } else {
        cupBanner.textContent = `ELIMINATED IN ROUND ${this.cupRound + 1}`;
        headline.textContent = 'CUP RUN ENDED — REMATCH OR RETRY!';
      }
    } else if (summary.mode === 'tourney' && this.tourneyState?.activeMatch) {
      const tm = this.tourneyState.activeMatch;
      tm.scoreA = summary.scores[0];
      tm.scoreB = summary.scores[1];
      tm.winner = summary.winnerTeam === 1 ? tm.pB : tm.pA;
      this._propagateTourneyWinner(tm.roundIdx, tm.matchIdx, tm.winner);
      this._advanceTourneyCPUMatches();

      cupBanner.classList.remove('hidden');
      backTourneyBtn.classList.remove('hidden');
      rematchBtn.classList.add('hidden');
      scoreline.textContent = `${summary.scores[0]} — ${summary.scores[1]}`;

      if (this.tourneyState.champion) {
        const champ = this.tourneyState.champion;
        cupBanner.textContent = '👑 GRAND FINAL COMPLETE! 👑';
        headline.textContent = `${champ.tag} (${champ.name.toUpperCase()}) WINS THE BRACKET!`;
        if (!champ.isAI) {
          coinsEarned += 120;
          this._unlockTrophy('tourney_king');
        }
      } else {
        cupBanner.textContent = 'BRACKET MATCH COMPLETE';
        headline.textContent = `${tm.winner.tag} (${tm.winner.name.toUpperCase()}) ADVANCES!`;
      }
    } else if (summary.mode === 'trial') {
      const tr = summary.trial || this.activeTrial;
      cupBanner.classList.remove('hidden');
      scoreline.textContent = `${summary.scores[0]} — ${summary.scores[1]}`;

      if (summary.trialSuccess) {
        if (!this.save.trialsWon.includes(tr.id)) {
          this.save.trialsWon.push(tr.id);
        }
        coinsEarned = (tr.rewardCoins || 100) + humanGoals * 5;
        cupBanner.textContent = `⭐ TRIAL #${tr.num} CONQUERED! ⭐`;
        headline.textContent = `${tr.title.toUpperCase()} CLEAR!`;
        this._pushToast(`TRIAL COMPLETE!`, `${tr.title} (+${tr.rewardCoins} 🪙)`, '⭐');

        this._unlockTrophy('trial_initiate');
        if (this.save.trialsWon.length >= STRIKER_TRIALS.length) {
          this._unlockTrophy('trial_grandmaster');
        }
      } else {
        coinsEarned = 15;
        cupBanner.textContent = `TRIAL OBJECTIVE INCOMPLETE`;
        headline.textContent = tr.ruleText ? tr.ruleText.toUpperCase() : 'TRY AGAIN!';
      }
    } else {
      // Standard 1v1_cpu, 1v1_pvp, 2v2
      scoreline.textContent = `${summary.scores[0]} — ${summary.scores[1]}`;
      const humanTeamWon = humanPlayers.some((p) => p.team === summary.winnerTeam);
      coinsEarned = 20 + humanGoals * 4 + (humanTeamWon ? 20 : 0);

      if (summary.winnerTeam === 0) {
        headline.textContent = `${CHARACTERS[this.charIdx0].name.toUpperCase()} WINS!`;
      } else if (summary.winnerTeam === 1) {
        headline.textContent = `${CHARACTERS[this.charIdx1].name.toUpperCase()} WINS!`;
      } else {
        headline.textContent = 'EPIC DRAW!';
      }
    }

    const changeCharsBtn = document.getElementById('btn-change-chars');
    if (changeCharsBtn) {
      if (summary.mode === 'trial') {
        changeCharsBtn.textContent = '🥋 TRIALS DOJO';
      } else if (summary.mode === 'tourney') {
        changeCharsBtn.textContent = '🏆 BRACKET';
      } else {
        changeCharsBtn.textContent = '👥 CHANGE STRIKERS';
      }
    }

    this.save.coins += coinsEarned;
    coinBadge.textContent = `+${coinsEarned} 🪙 STAR-COINS!`;

    // Evaluate all 24 Trophies!
    this._evaluateMatchTrophies(summary);
    this._persist();

    // Populate Stats Breakdown Table
    const tbody = document.getElementById('results-stats-body');
    tbody.innerHTML = '';
    for (const pl of summary.players) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="color:${pl.char.primary}; font-weight:800;">${pl.tag} — ${pl.char.name}</td>
        <td><b>${pl.stats.goals}</b>${pl.stats.ownGoals ? ` <span class="mini-pill" title="Own goals">${pl.stats.ownGoals} OG</span>` : ''}</td>
        <td>${pl.stats.hyperStrikes || 0}⚡ / ${pl.stats.powerShots}</td>
        <td>${pl.stats.saves} / ${pl.stats.parries || 0}🛡️</td>
        <td>${pl.stats.itemsUsed}</td>
        <td>${pl.stats.kos}</td>
      `;
      tbody.appendChild(tr);
    }

    this._showScreen('results');
  }

  _evaluateMatchTrophies(summary) {
    const humans = summary.players.filter((p) => !p.isAI);
    const isMini = this._isMinigameMode(summary.mode);
    const humanWon =
      !isMini && summary.winnerTeam !== -1 && humans.some((p) => p.team === summary.winnerTeam);

    if (!isMini && this.save.stats.totalGoals >= 1) this._unlockTrophy('first_goal');
    if (!isMini && humans.some((p) => p.stats.goals >= 3)) this._unlockTrophy('hat_trick');
    if (!isMini && humans.some((p) => p.stats.goals >= 7)) this._unlockTrophy('goal_frenzy');
    if (humans.some((p) => (p.stats.parries || 0) >= 1)) this._unlockTrophy('first_parry');
    if (humans.some((p) => (p.stats.hyperStrikes || 0) >= 1)) this._unlockTrophy('hyper_unleashed');
    if (humans.some((p) => p.stats.saves >= 4)) this._unlockTrophy('brick_wall');
    if (humans.some((p) => p.stats.kos >= 5)) this._unlockTrophy('heavy_brawler');
    if (summary.players.some((p) => humans.some(human => human.team === p.team) && (p.stats.comboPasses || 0) >= 1)) {
      this._unlockTrophy('team_chemistry');
    }
    if (humans.some((p) => p.stats.itemsUsed >= 4)) this._unlockTrophy('item_chef');
    if (summary.suddenDeath && humanWon) this._unlockTrophy('sudden_victor');

    if (!isMini && humanWon) {
      const loserTeam = summary.winnerTeam === 0 ? 1 : 0;
      if (summary.scores[loserTeam] === 0 && summary.scores[summary.winnerTeam] >= 1) {
        this._unlockTrophy('clean_sheet');
      }
    }

    if (summary.mode === '1v1_cpu' && summary.settings.aiDifficulty === 'legend' && summary.winnerTeam === 0) {
      this._unlockTrophy('legend_slayer');
    }

    if (this.save.wonCups.includes('meadow_cup')) this._unlockTrophy('cup_meadow');
    if (this.save.wonCups.includes('sky_cup')) this._unlockTrophy('cup_sky');
    if (this.save.wonCups.includes('haunted_cup')) this._unlockTrophy('cup_haunted');
    if (this.save.wonCups.includes('cosmic_cup')) this._unlockTrophy('cup_cosmic');

    if ((summary.mode === '2v2' || (summary.mode === 'cup' && this.cupCoop)) && humanWon) {
      this._unlockTrophy('coop_champ');
    }

    if (this.save.stats.targetBestScore >= 2500) this._unlockTrophy('target_ace');
    if (this.save.stats.keepUpBestTime >= 45) this._unlockTrophy('keepup_pro');
    if (this.save.stats.gauntletBestSaves >= 15) this._unlockTrophy('gauntlet_wall');

    if (!isMini && (summary.settings.activeMutators?.length || 0) >= 3) {
      this._unlockTrophy('mutator_madness');
    }

    if ((this.save.trialsWon?.length || 0) >= 1) this._unlockTrophy('trial_initiate');
    if ((this.save.trialsWon?.length || 0) >= STRIKER_TRIALS.length) this._unlockTrophy('trial_grandmaster');

    this._checkCollectionTrophies();
  }

  // =========================================================================
  // MAIN 60/120FPS GAME & RENDER LOOP
  // =========================================================================
  _loop(timestamp) {
    const rawDt = Math.min(0.05, (timestamp - this.lastFrameTime) / 1000);
    this.lastFrameTime = timestamp;
    const tSec = timestamp / 1000;

    this.input._getGamepads();
    const disconnected = this.input.disconnectedSlots.splice(0);
    if (this.screen === 'match' && disconnected.some(slot => this.match?.players.some(player => !player.isAI && player.controlSlot === slot))) {
      this.togglePause(true);
      this._pushToast('Controller disconnected', 'Reconnect it or use the keyboard, then resume when you are ready.', '🎮');
    }
    this._handleGlobalShortcuts();
    this._updateControlPrompts();

    // Update Gamepad Indicator Pill
    this.input._getGamepads();
    const gpPill = document.getElementById('gamepad-indicator');
    if (this.input.connectedGamepads > 0) {
      gpPill.classList.remove('hidden');
      gpPill.textContent = `🎮 ${this.input.connectedGamepads} PAD${
        this.input.connectedGamepads > 1 ? 'S' : ''
      }`;
    } else {
      gpPill.classList.add('hidden');
    }

    if (this.screen === 'menu' || this.screen === 'select' || this.screen === 'results') {
      this._renderBackdropCanvas(tSec, rawDt);
      if (this.screen === 'select') this._renderSelectPuppets(tSec, rawDt);
      if (this.screen === 'results') this._renderPodiumPuppets(tSec);
    } else if (this.screen === 'match' && this.match) {
      if (!this.paused) {
        this._stepMatch(rawDt);
        this._syncHUD();

        if (this.toastFadeTimer > 0) {
          this.toastFadeTimer -= rawDt;
          if (this.toastFadeTimer <= 0) {
            document.getElementById('controls-toast').style.opacity = '0.28';
          }
        }
      }
      this._renderMatchCanvas();
    }

    this.input.endFrame();
    requestAnimationFrame((ts) => this._loop(ts));
  }

  _stepMatch(rawDt) {
    const match = this.match;
    if (!match || this.paused) return;
    for (const player of match.players.filter(player => !player.isAI)) {
      const current = this.input.getPlayerInput(player.controlSlot);
      const pending = this.pendingInputs.get(player.controlSlot);
      for (const key of INPUT_EDGES) current[key] ||= pending?.[key] || false;
      this.pendingInputs.set(player.controlSlot, current);
    }
    this.accumulator += Math.min(0.05, Math.max(0, rawDt));
    while (this.accumulator + 1e-9 >= FIXED_STEP && this.match === match && !this.paused) {
      for (const entity of [match.courier, ...match.players, ...match.balls, ...match.shells, ...match.torpedoes, ...match.keepers, ...match.hounds, ...match.bananas, ...match.targets]) {
        entity.previousX = entity.x;
        entity.previousY = entity.y;
      }
      const inputs = match.players.map(player => player.isAI
        ? this.ai.computeInput(player, match, FIXED_STEP)
        : this.pendingInputs.get(player.controlSlot) || {});
      const inHitstop = match.hitstopTimer > 0;
      match.update(FIXED_STEP, inputs);
      if (!inHitstop) {
        for (const pending of this.pendingInputs.values()) for (const key of INPUT_EDGES) pending[key] = false;
      }
      this.accumulator = Math.max(0, this.accumulator - FIXED_STEP);
      if (this.practice?.update()) {
        this.audio.playCoachCue();
        if (this.practice.complete) {
          this.save.onboarding.completed = true;
          this._persist();
        }
        this._renderPracticeCoach();
      }
    }
  }

  _anyModalOpen() {
    return Boolean(this.modalStack?.length);
  }

  _handleMenuGamepad() {
    const root = this.modalStack.length
      ? document.getElementById(this.modalStack.at(-1).id)
      : document.getElementById(`screen-${this.screen}`);
    if (!root) return false;
    const slot = Math.max(0, this.input.activeSlot);
    const direction = this.input.getGamepadTapDirection(slot);
    const elements = this._focusableElements(root);
    if (!elements.length) return false;
    let focused = root.contains(document.activeElement) ? document.activeElement : null;
    if (direction.x && focused?.matches('select, input[type="range"]')) {
      if (focused.tagName === 'SELECT') {
        focused.selectedIndex = (focused.selectedIndex + direction.x + focused.options.length) % focused.options.length;
      } else {
        const step = Number(focused.step) || 0.05;
        focused.value = String(Math.max(Number(focused.min), Math.min(Number(focused.max), Number(focused.value) + direction.x * step)));
      }
      focused.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }
    if (direction.x || direction.y) {
      if (!focused) focused = elements[0];
      else {
        const origin = focused.getBoundingClientRect();
        const cx = origin.x + origin.width / 2, cy = origin.y + origin.height / 2;
        let best = null, bestScore = Infinity;
        for (const candidate of elements) {
          if (candidate === focused) continue;
          const rect = candidate.getBoundingClientRect();
          const dx = rect.x + rect.width / 2 - cx, dy = rect.y + rect.height / 2 - cy;
          const forward = direction.x ? dx * direction.x : dy * direction.y;
          const sideways = direction.x ? Math.abs(dy) : Math.abs(dx);
          if (forward <= 4) continue;
          const score = forward + sideways * 3;
          if (score < bestScore) { best = candidate; bestScore = score; }
        }
        if (best) focused = best;
      }
      focused.focus({ preventScroll: true });
      focused.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      this.audio.playHover();
      return true;
    }
    const startPressed = this.input.wasStartJustPressed();
    if (this.input.wasGamepadButtonJustPressed(slot, 0) || startPressed) {
      const target = (startPressed ? root.querySelector('.kickoff-cta-btn:not(.hidden)') : focused) ||
        root.querySelector('.quick-mode-btn, .kickoff-cta-btn:not(.hidden)') || elements[0];
      if (target.matches('select, input[type="range"]')) target.focus();
      else target.click();
      return true;
    }
    return false;
  }

  _handleGlobalShortcuts() {
    if (this.input.rebindingCallback) {
      if (this.input.wasGamepadButtonJustPressed(Math.max(0, this.input.activeSlot), 1)) {
        this.input.cancelRebind();
        this._renderRebindLists();
      }
      return;
    }

    const humanSlots = this.match?.players.filter(player => !player.isAI).map(player => player.controlSlot) || [];
    if (this.input.wasKeyJustPressed('KeyM') && !this.input.isBound('KeyM', humanSlots)) {
      this.audio.toggleMute();
      this._syncMuteButton();
      this._persist();
    }

    const isAltEnter =
      (this.input.keysDown.has('AltLeft') || this.input.keysDown.has('AltRight')) &&
      this.input.wasKeyJustPressed('Enter');
    if (this.input.wasKeyJustPressed('F11') || isAltEnter) {
      if (this.touch) this.touch.toggleFullscreen();
      this.input.keysDown.delete('Enter');
      this.input.keysJustPressed.delete('Enter');
      return;
    }

    if (this._anyModalOpen()) {
      if (
        this.input.wasKeyJustPressed('Escape') ||
        this.input.wasGamepadButtonJustPressed(Math.max(0, this.input.activeSlot), 1) ||
        this.input.wasGamepadButtonJustPressed(Math.max(0, this.input.activeSlot), 8)
      ) {
        this.audio.playBack();
        this._closeModal(this.modalStack.at(-1).id);
      } else this._handleMenuGamepad();
      return;
    }
    if (this.input.isEditingField()) return;
    if (this.screen !== 'match' && this._handleMenuGamepad()) return;

    if (this.screen === 'match') {
      if (
        this.input.wasKeyJustPressed('Escape') ||
        (this.input.wasKeyJustPressed('KeyP') && !this.input.isBound('KeyP', humanSlots)) ||
        this.input.wasStartJustPressed()
      ) {
        this.togglePause();
      }
    } else if (this.screen === 'select') {
      if (this.input.wasKeyJustPressed('KeyA')) this._cycleCharacter(0, -1);
      if (this.input.wasKeyJustPressed('KeyD')) this._cycleCharacter(0, 1);
      if (this.input.wasKeyJustPressed('KeyW')) this._cycleKit(0);
      if (this.input.wasKeyJustPressed('KeyR')) this.randomizePlayer(0);
      if (this.input.wasKeyJustPressed('ArrowLeft')) this._cycleCharacter(1, -1);
      if (this.input.wasKeyJustPressed('ArrowRight')) this._cycleCharacter(1, 1);
      if (this.input.wasKeyJustPressed('ArrowUp')) this._cycleKit(1);

      // Gamepad 0 selection
      const tap0 = this.input.getGamepadTapDirection(0);
      if (tap0.x === -1) this._cycleCharacter(0, -1);
      if (tap0.x === 1) this._cycleCharacter(0, 1);
      if (tap0.y === -1 || this.input.wasGamepadButtonJustPressed(0, 3)) this._cycleKit(0);

      // Gamepad 1 selection
      const tap1 = this.input.getGamepadTapDirection(1);
      if (tap1.x === -1) this._cycleCharacter(1, -1);
      if (tap1.x === 1) this._cycleCharacter(1, 1);
      if (tap1.y === -1 || this.input.wasGamepadButtonJustPressed(1, 3)) this._cycleKit(1);

      // In 2v2: Gamepad 2 cycles Ally 0, Gamepad 3 cycles Ally 1
      if (this.selectedMode === '2v2') {
        const tap2 = this.input.getGamepadTapDirection(2);
        if (
          tap2.x !== 0 ||
          this.input.wasGamepadButtonJustPressed(2, 4) ||
          this.input.wasGamepadButtonJustPressed(2, 5)
        ) {
          this._cycleAlly();
        }
        const tap3 = this.input.getGamepadTapDirection(3);
        if (
          tap3.x !== 0 ||
          this.input.wasGamepadButtonJustPressed(3, 4) ||
          this.input.wasGamepadButtonJustPressed(3, 5)
        ) {
          this._cycleFoeAlly();
        }
      }

      if (
        ((this.input.wasKeyJustPressed('Enter') || this.input.wasKeyJustPressed('Space')) &&
          !document.activeElement?.matches('button')) ||
        this.input.wasStartJustPressed() ||
        this.input.wasGamepadButtonJustPressed(0, 0)
      ) {
        this._attemptStartFromSelect();
      }
      if (
        this.input.wasKeyJustPressed('Escape') ||
        this.input.wasGamepadButtonJustPressed(0, 1) ||
        this.input.wasGamepadButtonJustPressed(0, 8)
      ) {
        this.audio.playBack();
        this._showScreen('menu');
      }
    } else if (this.screen === 'results') {
      if (
        this.input.wasKeyJustPressed('KeyR') ||
        (this.input.wasKeyJustPressed('Enter') && !document.activeElement?.matches('button')) ||
        this.input.wasStartJustPressed() ||
        this.input.wasGamepadButtonJustPressed(0, 0)
      ) {
        this.audio.playClick();
        if (this.selectedMode === 'tourney') {
          this._showScreen('menu');
          this._openTourneyModal(true);
          return;
        }
        const cup = this.activeCup || GRAND_PRIX_CUPS[0];
        if (
          this.selectedMode === 'cup' &&
          this.lastSummary?.winnerTeam === 0 &&
          this.cupRound < cup.rounds.length - 1
        ) {
          this.cupRound++;
          this._applyCupRoundSetup();
        }
        this.startMatch();
      }
    }
  }

  _renderBackdropCanvas(tSec, dt) {
    if (this.reducedMotion) { tSec = 0; dt = 0; }
    const ctx = this.ctx;
    ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    const ar = ARENAS[this.arenaIdx] || ARENAS[0];
    const img =
      this.screen === 'select'
        ? this.art.images[ar.bgKey] || this.art.images.title_bg
        : this.art.images.title_bg;

    if (img) {
      const zoom = this.reducedMotion ? 1 : 1.03 + Math.sin(tSec * 0.4) * 0.015;
      const w = VIRTUAL_WIDTH * zoom;
      const h = VIRTUAL_HEIGHT * zoom;
      ctx.drawImage(img, (VIRTUAL_WIDTH - w) / 2, (VIRTUAL_HEIGHT - h) / 2, w, h);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, VIRTUAL_HEIGHT);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(1, '#312e81');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    }

    // Floating stadium sparkles / confetti
    for (const sp of this.menuSparkles) {
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      if (sp.y < -10) {
        sp.y = VIRTUAL_HEIGHT + 10;
        sp.x = Math.random() * VIRTUAL_WIDTH;
      }
      ctx.save();
      ctx.globalAlpha = 0.45 + 0.35 * Math.sin(tSec * 3 + sp.phase);
      ctx.fillStyle = sp.color;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  _renderSelectPuppets(tSec, dt) {
    if (this.reducedMotion) tSec = 0;
    if (this.previewKickTimer0 > 0) this.previewKickTimer0 = Math.max(0, this.previewKickTimer0 - dt);
    if (this.previewKickTimer1 > 0) this.previewKickTimer1 = Math.max(0, this.previewKickTimer1 - dt);

    const bigHead = (this.settings.activeMutators || []).includes('bigHead');

    const drawOne = (pctx, charIdx, kitIdx, facing, kickT) => {
      pctx.clearRect(0, 0, 260, 250);
      const ch = getCharacter(CHARACTERS[charIdx].id, kitIdx);
      const metrics = CHAR_SPRITE_METRICS[ch.id] || CHAR_SPRITE_METRICS.mario;

      const centerX = 130;
      const pedestalTurfY = 216;

      // Mathematical auto-framing: guarantees full visibility from cap/horns to cleats
      // with at least 22px headroom and zero clipping!
      const minHeadroom = 40;
      const maxSafeScaleH = (pedestalTurfY - minHeadroom) / (metrics.drawSize * metrics.footY);
      const maxSafeScaleW = 216 / metrics.drawSize;
      const targetScale = 0.88 * ch.stats.size;
      const actualScale = Math.min(targetScale, maxSafeScaleH, maxSafeScaleW);

      const visualScale = actualScale / ch.stats.size;
      const playerY = pedestalTurfY - 53 * actualScale;

      // 1. Mini-Stadium Spotlight Cone & Glow Ring
      pctx.save();
      const spot = pctx.createRadialGradient(centerX, 90, 15, centerX, pedestalTurfY - 30, 120);
      spot.addColorStop(0, `${ch.aura || ch.primary}55`);
      spot.addColorStop(0.65, `${ch.aura || ch.primary}18`);
      spot.addColorStop(1, 'rgba(0,0,0,0)');
      pctx.fillStyle = spot;
      pctx.beginPath();
      pctx.arc(centerX, 115, 120, 0, Math.PI * 2);
      pctx.fill();

      // Glowing Arena Pedestal Underlay
      const ringGrad = pctx.createRadialGradient(centerX, pedestalTurfY + 6, 36, centerX, pedestalTurfY + 6, 90);
      ringGrad.addColorStop(0, `${ch.aura || ch.primary}88`);
      ringGrad.addColorStop(1, 'rgba(0,0,0,0)');
      pctx.fillStyle = ringGrad;
      pctx.beginPath();
      pctx.ellipse(centerX, pedestalTurfY + 6, 90, 22, 0, 0, Math.PI * 2);
      pctx.fill();

      // 3D Beveled Metallic Stadium Base
      pctx.fillStyle = '#1e293b';
      pctx.strokeStyle = '#0f172a';
      pctx.lineWidth = 4;
      pctx.beginPath();
      pctx.ellipse(centerX, pedestalTurfY + 6, 80, 18, 0, 0, Math.PI * 2);
      pctx.fill();
      pctx.stroke();

      // Lush Emerald Pitch Turf Disc with Field Chalk Boundary Line
      pctx.fillStyle = '#16a34a';
      pctx.strokeStyle = '#4ade80';
      pctx.lineWidth = 2.5;
      pctx.beginPath();
      pctx.ellipse(centerX, pedestalTurfY, 74, 14, 0, 0, Math.PI * 2);
      pctx.fill();
      pctx.stroke();

      // Subtle chalk midline
      pctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      pctx.lineWidth = 1.5;
      pctx.beginPath();
      pctx.ellipse(centerX, pedestalTurfY, 50, 9, 0, 0, Math.PI * 2);
      pctx.stroke();
      pctx.restore();

      const dummy = {
        x: centerX,
        y: playerY,
        vx: 0,
        vy: 0,
        facing,
        char: ch,
        bigHead,
        visualScale,
        squashX: 1 + Math.sin(tSec * 4.5) * 0.02,
        squashY: 1 - Math.sin(tSec * 4.5) * 0.02,
        onGround: true,
        kickTimer: kickT,
        kickDuration: 0.25,
        kickType: 'side',
        stunTimer: 0,
        invulnTimer: 0,
        chargeTime: 0.15,
        halfH: 52,
        shadowY: pedestalTurfY,
        tag: facing === 1 ? 'P1' : this.selectedMode === '1v1_pvp' ? 'P2' : 'CPU',
      };
      this.art.drawCharacterPuppet(pctx, dummy, [{ x: centerX + facing * 120, y: playerY - 10 }], tSec);
    };

    drawOne(this.previewCtx0, this.charIdx0, this.kitIdx0, 1, this.previewKickTimer0);
    drawOne(this.previewCtx1, this.charIdx1, this.kitIdx1, -1, this.previewKickTimer1);
  }

  _renderPodiumPuppets(tSec) {
    const pctx = this.podiumCtx;
    pctx.clearRect(0, 0, 520, 185);
    if (!this.lastSummary) return;

    const winTeam = this.lastSummary.winnerTeam === 1 ? 1 : 0;
    const winners = this.lastSummary.players.filter((p) => p.team === winTeam);
    const list = winners.length > 0 ? winners.slice(0, 2) : [this.lastSummary.players[0]];

    // Golden Champion Podium Block
    const blockW = list.length > 1 ? 250 : 156;
    pctx.fillStyle = '#f59e0b';
    pctx.strokeStyle = '#191224';
    pctx.lineWidth = 4;
    this.art.roundRect(pctx, 260 - blockW / 2, 144, blockW, 36, 10);
    pctx.fill();
    pctx.stroke();

    list.forEach((pl, i) => {
      const xPos = list.length === 1 ? 260 : i === 0 ? 208 : 312;
      const hop = this.reducedMotion ? 0 : Math.abs(Math.sin(tSec * 4 + i * 0.9)) * 9;
      const metrics = CHAR_SPRITE_METRICS[pl.char.id];
      const actualScale = Math.min(0.85, 118 / (metrics.drawSize * metrics.footY), 115 / metrics.drawSize);
      const dummy = {
        x: xPos,
        y: 144 - 52 * actualScale - hop,
        vx: 0,
        vy: 0,
        facing: i === 0 ? 1 : -1,
        char: pl.char,
        visualScale: actualScale / pl.char.stats.size,
        squashX: 1,
        squashY: 1,
        onGround: hop < 2,
        kickTimer: 0,
        kickDuration: 0.2,
        kickType: 'up',
        stunTimer: 0,
        invulnTimer: 0,
        chargeTime: 0.2,
        halfH: 52,
        shadowY: 144,
        tag: pl.tag || 'MVP',
      };
      this.art.drawCharacterPuppet(pctx, dummy, [], tSec);
    });
  }

  _renderMatchCanvas() {
    const ctx = this.ctx;
    const m = this.match;
    const alpha = this.paused ? 1 : Math.min(1, this.accumulator / FIXED_STEP);
    const interpolate = entity => {
      if (!Number.isFinite(entity.previousX) || Math.hypot(entity.x - entity.previousX, entity.y - entity.previousY) > 250) return entity;
      return { ...entity, x: entity.previousX + (entity.x - entity.previousX) * alpha,
        y: entity.previousY + (entity.y - entity.previousY) * alpha };
    };
    const scene = { ...m, players: m.players.map(interpolate), balls: m.balls.map(interpolate) };
    const visualTime = this.reducedMotion ? 0 : m.time;
    ctx.save();
    ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // Camera Zoom & Impact Shake Transform!
    ctx.translate(VIRTUAL_WIDTH / 2 + m.shakeX, VIRTUAL_HEIGHT / 2 + m.shakeY);
    ctx.scale(m.cameraZoom, m.cameraZoom);
    ctx.translate(-m.cameraFocusX, -m.cameraFocusY);

    // 1. Lush Hand-Painted Illustrated Stadium Background (All 7 Biomes)
    this.art.drawArenaBackground(ctx, m.arena, visualTime);

    // 2. Sky-Cloud Courier & Item Bubble
    this.art.drawCloudCourier(ctx, interpolate(m.courier), visualTime);

    // 3. Target Blitz Bullseyes
    for (const tg of m.targets) {
      this.art.drawTargetEntity(ctx, interpolate(tg), visualTime);
    }

    // 4. Shroom GoalKeepers
    for (const kp of m.keepers) {
      this.art.drawGoalKeeperEntity(ctx, interpolate(kp), visualTime);
    }

    // 5. Foreground Stadium Architecture, Turf, Molten/Glacier Sheen, Goal Nets & Pedestals
    this.art.drawArenaForeground(ctx, m.arena, scene, visualTime);

    // 6. Interactive Stage Hazards, Pinball Bumpers & Goalie Gauntlet Striker-Cannon
    this.art.drawStageHazards(ctx, scene, visualTime);

    // 7. Chain-Hounds, Banana Slicks, Ricochet Shells & Cannon Torpedoes
    for (const hd of m.hounds) {
      this.art.drawChainHoundEntity(ctx, interpolate(hd), visualTime);
    }
    for (const bn of m.bananas) {
      this.art.drawBananaEntity(ctx, interpolate(bn), visualTime);
    }
    for (const sh of m.shells) {
      this.art.drawShellEntity(ctx, interpolate(sh), visualTime);
    }
    for (const tp of m.torpedoes) {
      this.art.drawTorpedoEntity(ctx, interpolate(tp), visualTime);
    }

    // 8. Articulated 2D Character Puppets (12 Strikers + Shadow Clones)
    for (const pl of scene.players) {
      this.art.drawCharacterPuppet(ctx, pl, scene.balls, visualTime);
    }

    // 9. Soccer Balls (6 Skins, Rugby Egg-Ball, Magnus Spin Trails, Combo Voltage & Vanish Shot)
    const isRugby = m.hasMutator('rugbyBall');
    for (const b of scene.balls) {
      const floor = b.x < m.arena.pitchLeftX || b.x > m.arena.pitchRightX ? m.arena.goalFloorY : m.arena.pitchFloorY;
      this.art.drawBall(ctx, b, floor, visualTime, this.settings.equippedBallSkin, isRugby);
    }

    // 10. Particles, Custom Goal Explosions, Shockwaves & Floating Callouts
    this.art.drawParticles(ctx, m.particles, m.shockwaves);

    // 10b. Dynamic Additive Scene Lighting & Bloom Pass!
    if (!this.reducedMotion) this.art.drawDynamicLighting(ctx, scene, visualTime);

    ctx.restore();

    // 11. Signature Hyper-Strike Anime Cut-In Banner!
    this.art.drawHyperCutIn(ctx, m.hyperCutIn, visualTime);

    // 12. Dramatic Center-Screen Arcade Banner (3..2..1, GOOOAL!!, SUDDEN DEATH!)
    if (m.bannerTimer > 0 && m.bannerText) {
      ctx.save();
      const pop = Math.min(1, m.bannerTimer * 4.5);
      const bounceScale = this.reducedMotion ? 1 : 0.85 + Math.sin(pop * Math.PI * 0.65) * 0.22;
      ctx.translate(VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT * 0.4);
      ctx.scale(bounceScale, bounceScale);

      ctx.font = "900 108px 'Luckiest Guy', system-ui, sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 16;
      ctx.strokeStyle = '#191224';
      ctx.strokeText(m.bannerText, 0, 0);
      ctx.fillStyle = m.bannerColor;
      ctx.fillText(m.bannerText, 0, 0);

      if (m.bannerSub) {
        ctx.font = "800 34px 'Fredoka', system-ui, sans-serif";
        ctx.lineWidth = 9;
        ctx.strokeText(m.bannerSub, 0, 74);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(m.bannerSub, 0, 74);
      }
      ctx.restore();
    }
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
      window.app = new SuperKickKingdomApp();
    });
  } else {
    window.app = new SuperKickKingdomApp();
  }
}
