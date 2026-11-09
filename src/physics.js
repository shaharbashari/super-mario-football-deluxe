// Sub-stepped arcade physics, combat, stage hazards and challenge rules.

import {
  VIRTUAL_WIDTH,
  VIRTUAL_HEIGHT,
  ITEMS,
  BALL_PRESETS,
  GOAL_EXPLOSIONS,
  COURIER_LAYOUT,
  getCharacter,
  getArena,
} from './config.js';
import { advanceCharacterAnimation } from './animation.js';

export class MatchSimulation {
  constructor({
    mode,
    arenaId,
    playersConfig,
    settings,
    audio,
    onGoal,
    onMatchEnd,
    isAttract = false,
    immediateEnd = false,
    introTitle = '',
    trial = null,
  }) {
    this.mode = mode; // '1v1_cpu' | '1v1_pvp' | '2v2' | 'cup' | 'tourney' | 'target_blitz' | 'keep_up' | 'goalie_gauntlet' | 'attract' | 'trial'
    this.trial = trial;
    this.isAttract = isAttract;
    this.immediateEnd = immediateEnd;
    this.arena = getArena(arenaId);
    this.settings = { ...settings };
    if (trial) {
      this.settings.activeMutators = [...(trial.mutators || [])];
      this.settings.itemMode = 'off';
      this.settings.matchDuration = 180;
      this.settings.ballPreset = 'balanced';
      this.settings.stageHazards = true;
      this.settings.scoreLimit = trial.targetScore;
    }
    if (mode === 'practice') {
      Object.assign(this.settings, { matchDuration: 0, scoreLimit: 0, itemMode: 'off', stageHazards: false, activeMutators: [] });
    }
    this.audio = audio;
    this.onGoal = onGoal;
    this.onMatchEnd = onMatchEnd;

    this.ballPreset = BALL_PRESETS[this.settings.ballPreset] || BALL_PRESETS.balanced;

    this.time = 0;
    this.phase = isAttract ? 'playing' : 'countdown';
    this.phaseTimer = isAttract ? 0 : 2.5;
    this.lastCountdownBeep = 4;

    this.isMinigame = ['target_blitz', 'keep_up', 'goalie_gauntlet'].includes(mode);
    this.timeRemaining = mode === 'target_blitz' ? 60 : this.settings.matchDuration;
    this.unlimitedTime =
      mode === 'keep_up' || mode === 'goalie_gauntlet' || (!this.isMinigame && this.settings.matchDuration === 0);
    this.suddenDeath = false;

    this.scores = [0, mode === 'goalie_gauntlet' ? 3 : 0];
    this.hype = [0, 0]; // 0..100 Team Hype Meter for Signature Hyper-Strikes!
    this.hyperCutIn = null;

    // Minigame trackers
    this.targetCombo = 0;
    this.targetScore = 0;
    this.survivalTime = 0;
    this.nextKeepUpBallAt = 20;
    this.gauntletLives = 3;
    this.gauntletSaves = 0;
    this.gauntletCannon =
      mode === 'goalie_gauntlet'
        ? { x: 1180, y: 650, fireTimer: 1.1, recoilTimer: 0, aimAngle: -0.18 }
        : null;

    // Juice & Camera FX
    this.hitstopTimer = 0;
    this.slowMoFactor = 1.0;
    this.slowMoTimer = 0;
    this.shakeMag = 0;
    this.shakeX = 0;
    this.shakeY = 0;
    this.cameraZoom = 1.0;
    this.cameraFocusX = VIRTUAL_WIDTH / 2;
    this.cameraFocusY = VIRTUAL_HEIGHT / 2;

    this.bannerText = isAttract ? '' : '3';
    this.bannerSub = isAttract ? '' : introTitle || 'GET READY!';
    this.bannerColor = '#fde047';
    this.bannerTimer = isAttract ? 0 : 2.5;

    // Arena dynamic state
    this.netRippleLeft = 0;
    this.netRippleRight = 0;
    this.powLeftTimer = 0;
    this.powRightTimer = 0;

    // Players
    this.players = playersConfig.map((cfg, idx) => this._createPlayer(cfg, idx));
    this.leftTeamColor = this.players[0]?.char.primary || '#e63946';
    const rightRepresentative = this.players.find((p) => p.team === 1);
    this.rightTeamColor = rightRepresentative?.char.primary || '#22c55e';

    // Balls, Items, Entities, Hazards, VFX
    this.balls = [];
    this.ballIdCounter = 1;
    if (mode !== 'goalie_gauntlet') {
      this._spawnCenterBall(0);
      if (this.hasMutator('multiBall') && !this.isMinigame) {
        this._spawnCenterBall(190);
      }
    }

    this.courier = {
      active: this.settings.itemMode !== 'off' && !this.isMinigame,
      x: VIRTUAL_WIDTH / 2,
      y: COURIER_LAYOUT.baseY,
      heldItemId: null,
      spawnTimer: this.settings.itemMode === 'frantic' ? 3.0 : 5.5,
    };

    this.shells = [];
    this.torpedoes = [];
    this.keepers = [];
    this.hounds = [];
    this.bananas = [];
    this.targets = [];
    this.particles = [];
    this.shockwaves = [];
    this.cloneIdCounter = 20;
    this.disposed = false;
    this.endTimer = null;

    this._initStageHazards();

    if (this.mode === 'target_blitz') {
      this._spawnTargets(4);
    }
  }

  hasMutator(id) {
    return Array.isArray(this.settings.activeMutators) && this.settings.activeMutators.includes(id);
  }

  _initStageHazards() {
    this.portals = null;
    this.drumPads = null;
    this.icicles = null;
    this.gravityRing = null;
    this.lavaVents = null;
    this.bumpers = [];

    if (this.settings.stageHazards !== false) {
      const hz = this.arena.hazardType;
      if (hz === 'warp_portals') {
        this.portals = [
          { side: 'left', x: 355, y: 255 },
          { side: 'right', x: 1565, y: 255 },
        ];
      } else if (hz === 'drum_pads') {
        this.drumPads = [
          { x: 560, y: this.arena.pitchFloorY - 2, w: 112, bounceTimer: 0 },
          { x: 1360, y: this.arena.pitchFloorY - 2, w: 112, bounceTimer: 0 },
        ];
      } else if (hz === 'icicles') {
        this.icicles = [660, 960, 1260].map((ix, idx) => ({
          x: ix,
          y: 20,
          vy: 0,
          active: true,
          state: 'idle', // 'idle' | 'warn' | 'fall'
          timer: 3.2 + idx * 2.4,
        }));
      } else if (hz === 'gravity_ring') {
        this.gravityRing = { x: VIRTUAL_WIDTH / 2, y: 470, r: 84, flashTimer: 0 };
      } else if (hz === 'lava_geysers') {
        this.lavaVents = [
          { x: 740, state: 'idle', timer: 4.2 },
          { x: 1180, state: 'idle', timer: 7.8 },
        ];
      }
    }

    if (this.hasMutator('pinballBumpers')) {
      this.bumpers = [
        { x: VIRTUAL_WIDTH / 2, y: 380, r: 40, flashTimer: 0 },
        { x: 730, y: 585, r: 38, flashTimer: 0 },
        { x: 1190, y: 585, r: 38, flashTimer: 0 },
      ];
    }
  }

  _createPlayer(cfg, idx) {
    const ch = getCharacter(cfg.charId, cfg.kitIdx || 0);
    const isLeft = cfg.team === 0;
    const offset = cfg.role === 'defender' ? -130 : 0;
    let startX = isLeft ? 540 + offset : VIRTUAL_WIDTH - 540 - offset;
    let startY = this.arena.pitchFloorY - 56;
    if (this.mode === 'goalie_gauntlet' && isLeft) {
      startX = 285;
      startY = this.arena.goalFloorY - 56;
    } else if (this.mode === 'keep_up' && isLeft) {
      startX = VIRTUAL_WIDTH / 2;
    }
    if (this.trial?.specialRule === 'no_lava' && isLeft) {
      startX = this.arena.platforms[0].x;
      startY = this.arena.platforms[0].y - 52 * ch.stats.size * (cfg.bossScale || 1);
    }

    const bossScale = cfg.bossScale || 1.0;

    return {
      slot: cfg.slot ?? idx,
      controlSlot: cfg.controlSlot ?? cfg.slot ?? idx,
      team: cfg.team,
      teamColor: cfg.teamColor,
      tag: cfg.tag || (cfg.isAI ? 'CPU' : `P${idx + 1}`),
      isAI: Boolean(cfg.isAI),
      aiDifficulty: cfg.aiDifficulty || null,
      isClone: Boolean(cfg.isClone),
      cloneTimer: cfg.cloneTimer || 0,
      role: cfg.role || 'striker',
      char: ch,
      bossScale,
      bigHead: this.hasMutator('bigHead'),
      x: cfg.x ?? startX,
      y: cfg.y ?? startY,
      vx: 0,
      vy: 0,
      facing: isLeft ? 1 : -1,
      baseHalfW: 32,
      baseHalfH: 52,
      halfW: 32 * ch.stats.size * bossScale,
      halfH: 52 * ch.stats.size * bossScale,
      visualScale: bossScale,
      targetScale: bossScale,
      scaleTimer: 0,
      speedBuff: 1.0,
      jumpBuff: 1.0,

      onGround: false,
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      jumpsLeft: 1,
      hoverFuel: ch.stats.hoverDuration || 0,
      isHovering: false,
      fastFalling: false,
      spinAngle: 0,
      spinVel: 0,

      squashX: 1,
      squashY: 1,
      shadowY: this.arena.pitchFloorY,

      // Smooth Animation Phase Integration
      animState: 'idle',
      animPhase: 0,
      runPhase: 0,
      strideBounce: 0,

      // Ground Pound & Wall Jump Movement Tech
      groundPoundState: 'none', // 'none' | 'stall' | 'plunge' | 'impact'
      groundPoundTimer: 0,
      touchingWallDir: 0,
      wallJumpCooldown: 0,

      // Combat, Parry, Spin & Hyper-Strike
      chargeTime: 0,
      kickTimer: 0,
      kickDuration: 0.22,
      kickCooldown: 0,
      kickType: 'side',
      kickPowerRatio: 0.5,
      aimSpin: 0,
      isHyperSwing: false,
      hyperReady: false,
      parryWindowTimer: 0,
      parryFlashTimer: 0,
      hitBallsThisSwing: new Set(),
      hitPlayersThisSwing: new Set(),

      // Dash
      dashTimer: 0,
      dashCooldown: 0,
      dashDir: 1,
      dashGhosts: [],

      // Status Effects
      stunTimer: 0,
      invulnTimer: 0,
      fireImmuneTimer: 0,
      starTimer: 0,
      magnetTimer: 0,
      lavaTickTimer: 0,

      // Item
      heldItem: null,

      // Match Telemetry Stats
      stats: {
        goals: 0,
        powerShots: 0,
        saves: 0,
        parries: 0,
        hyperStrikes: 0,
        comboPasses: 0,
        itemsUsed: 0,
        kos: 0,
        meteorSpikes: 0,
        wallJumps: 0,
        meteorGoals: 0,
        lavaTouches: 0,
        jumps: 0,
        touches: 0,
        dashes: 0,
        ownGoals: 0,
      },
    };
  }

  _spawnCenterBall(vxBias = 0, customY = 300) {
    const r = this.ballPreset.radius;
    this.balls.push({
      id: this.ballIdCounter++,
      x: VIRTUAL_WIDTH / 2 + (Math.random() - 0.5) * 20,
      y: customY,
      vx: vxBias,
      vy: this.mode === 'keep_up' ? -520 : 120,
      angle: 0,
      angVel: 0,
      spin: 0,
      baseRadius: r,
      radius: r,
      targetScale: 1.0,
      scaleTimer: 0,
      squashX: 1,
      squashY: 1,
      lastKicker: null,
      lastKickTime: -10,
      lastTeam: -1,
      lastWasMeteorSpike: false,
      auraColor: null,
      freezeTimer: 0,
      burnTimer: 0,
      vanishTimer: 0,
      zeroGTimer: 0,
      hyperActive: false,
      hyperStyle: null,
      comboBoosted: false,
      portalCooldown: 0,
      ringBoostCooldown: 0,
      savedCounted: false,
      trail: [],
    });
  }

  _spawnTargets(count) {
    while (this.targets.length < count) {
      const tx = 980 + Math.random() * 680;
      const ty = 220 + Math.random() * 620;
      this.targets.push({
        x: tx,
        y: ty,
        baseY: ty,
        radius: 44,
        phase: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 1.8,
      });
    }
  }

  _addHype(team, amount) {
    if (this.settings.hyperStrikes === false || team < 0 || team > 1) return;
    this.hype[team] = Math.min(100, Math.max(0, this.hype[team] + amount));
  }

  triggerBanner(text, sub = '', color = '#fde047', duration = 1.6) {
    if (this.isAttract) return;
    this.bannerText = text;
    this.bannerSub = sub;
    this.bannerColor = color;
    this.bannerTimer = duration;
  }

  addShake(mag) {
    if (this.isAttract || this.settings.reducedMotion) return;
    this.shakeMag = Math.min(36, Math.max(this.shakeMag, mag * this.settings.screenShake));
  }

  addHitstop(duration) {
    if (this.isAttract || !this.settings.hitstop) return;
    this.hitstopTimer = Math.max(this.hitstopTimer, duration);
  }

  spawnBurst(x, y, color, count = 12, speed = 360, size = 7, shape = 'circle') {
    count = Math.min(count, Math.max(0, 360 - this.particles.length));
    if (this.settings.reducedMotion) count = Math.ceil(count * 0.35);
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = speed * (0.35 + Math.random() * 0.85);
      const life = 0.28 + Math.random() * 0.35;
      this.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 60,
        size: size * (0.6 + Math.random() * 0.7),
        color,
        life,
        maxLife: life,
        gravity: 650,
        rot: Math.random() * 6,
        rotVel: (Math.random() - 0.5) * 12,
        shape,
      });
    }
  }

  spawnFloatingText(x, y, text, color = '#fde047', size = 30) {
    if (this.isAttract || this.particles.length >= 380) return;
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: -95,
      size,
      text,
      color,
      life: 0.95,
      maxLife: 0.95,
      gravity: 0,
      shape: 'text',
    });
  }

  spawnShockwave(x, y, color = '#ffffff', maxRadius = 150, lineWidth = 8) {
    if (this.shockwaves.length >= 24) return;
    this.shockwaves.push({
      x,
      y,
      radius: 18,
      maxRadius,
      color,
      lineWidth,
      alpha: 0.95,
    });
  }

  // --- Main Frame Update ---
  update(rawDt, playerInputs) {
    if (this.disposed) return;
    const dt = Math.min(0.05, rawDt);
    this.time += dt;

    if (this.shakeMag > 0.2) {
      this.shakeX = (Math.random() - 0.5) * 2 * this.shakeMag;
      this.shakeY = (Math.random() - 0.5) * 2 * this.shakeMag;
      this.shakeMag *= Math.pow(0.0015, dt);
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
      this.shakeMag = 0;
    }

    if (this.phase !== 'goal_celebration') {
      this.cameraZoom += (1.0 - this.cameraZoom) * Math.min(1, dt * 6);
      this.cameraFocusX += (VIRTUAL_WIDTH / 2 - this.cameraFocusX) * Math.min(1, dt * 6);
      this.cameraFocusY += (VIRTUAL_HEIGHT / 2 - this.cameraFocusY) * Math.min(1, dt * 6);
    }

    if (this.bannerTimer > 0) {
      this.bannerTimer = Math.max(0, this.bannerTimer - dt);
    }
    if (this.hyperCutIn && this.hyperCutIn.timer > 0) {
      this.hyperCutIn.timer = Math.max(0, this.hyperCutIn.timer - dt);
    }

    this.netRippleLeft *= Math.pow(0.05, dt);
    this.netRippleRight *= Math.pow(0.05, dt);

    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= dt;
      return;
    }

    if (this.slowMoTimer > 0) {
      this.slowMoTimer -= dt;
      if (this.slowMoTimer <= 0) this.slowMoFactor = 1.0;
    }
    const simDt = dt * this.slowMoFactor;

    if (this.phase === 'countdown') {
      this.phaseTimer -= dt;
      const sec = Math.ceil(this.phaseTimer / 0.78);
      if (sec !== this.lastCountdownBeep && sec >= 1 && sec <= 3) {
        this.lastCountdownBeep = sec;
        this.bannerText = String(sec);
        this.bannerColor = '#fde047';
        this.bannerTimer = 0.8;
        this.audio?.playCountdownTick(false);
      }
      if (this.phaseTimer <= 0) {
        this.phase = 'playing';
        this.triggerBanner(
          this.mode === 'keep_up'
            ? 'KEEP IT UP!'
            : this.mode === 'goalie_gauntlet'
            ? 'DEFEND THE NET!'
            : 'KICK OFF!',
          '',
          '#4ade80',
          0.95
        );
        this.audio?.playCountdownTick(true);
      }
      this._updateParticles(simDt);
      return;
    }

    if (this.phase === 'sudden_death_intro') {
      this.phaseTimer -= dt;
      if (this.phaseTimer <= 0) {
        this.phase = 'playing';
        this.balls = [];
        if (this.settings.suddenDeathMode === 'mayhem') {
          this.timeRemaining = 15;
          for (let i = 0; i < 10; i++) {
            this._spawnCenterBall((Math.random() - 0.5) * 950, 190 + (i % 3) * 65);
          }
          this.triggerBanner('10-BALL MAYHEM!', 'SCORE ALL YOU CAN!', '#f97316', 1.4);
        } else {
          this._spawnCenterBall(0);
          this.triggerBanner('GOLDEN GOAL!', 'NEXT GOAL WINS!', '#ef4444', 1.4);
        }
        this.audio?.playWhistle('start');
      }
      this._updateParticles(simDt);
      return;
    }

    if (this.phase === 'goal_celebration') {
      this.phaseTimer -= dt;
      this._stepWorld(simDt, this.players.map(() => ({})), false);
      this._updateParticles(dt);
      if (this.phaseTimer <= 0) {
        this.slowMoFactor = 1.0;
        if (
          (this.suddenDeath && this.settings.suddenDeathMode === 'golden') ||
          (this.settings.scoreLimit > 0 &&
            (this.scores[0] >= this.settings.scoreLimit || this.scores[1] >= this.settings.scoreLimit))
        ) {
          this._finishMatch();
          return;
        }
        this._resetPositionsForKickoff();
      }
      return;
    }

    if (this.phase === 'ended') {
      this._updateParticles(dt);
      return;
    }

    // --- Active Match ('playing') ---
    if (this.mode === 'keep_up') {
      this.survivalTime += dt;
      this.timeRemaining = this.survivalTime;
      this.scores[0] = Math.floor(this.survivalTime);
      if (this.survivalTime >= this.nextKeepUpBallAt && this.balls.length < 4) {
        this.nextKeepUpBallAt += 20;
        this._spawnCenterBall((Math.random() - 0.5) * 320, 240);
        this.triggerBanner('EXTRA BALL!', 'KEEP JUGGLING!', '#38bdf8', 1.1);
        this.audio?.playItemPickup();
      }
    } else if (!this.isAttract && (!this.unlimitedTime || this.suddenDeath)) {
      const hasTimer = !this.unlimitedTime || (this.suddenDeath && this.settings.suddenDeathMode === 'mayhem');
      if (hasTimer && !(this.suddenDeath && this.settings.suddenDeathMode === 'golden')) {
        const prevWhole = Math.ceil(this.timeRemaining);
        this.timeRemaining = Math.max(0, this.timeRemaining - dt);
        const nowWhole = Math.ceil(this.timeRemaining);

        if (nowWhole <= 15 && nowWhole > 0) {
          this.audio?.setUrgent(true);
          if (nowWhole <= 5 && nowWhole !== prevWhole) {
            this.audio?.playCountdownTick(false);
          }
        }

        if (this.timeRemaining <= 0) {
          this._handleTimeExpired();
          return;
        }
      }
    }

    this._stepWorld(simDt, playerInputs, true);
    this._updateParticles(simDt);
  }

  _handleTimeExpired() {
    if (this.isMinigame) {
      this._finishMatch();
      return;
    }

    if (this.scores[0] === this.scores[1]) {
      if (this.suddenDeath) this.settings.suddenDeathMode = 'golden';
      this.suddenDeath = true;
      this.phase = 'sudden_death_intro';
      this.phaseTimer = 2.0;
      this.balls = [];
      this.audio?.setUrgent(true);
      this.audio?.playSuddenDeath();
      const sub =
        this.settings.suddenDeathMode === 'mayhem'
          ? '10 BALLS INCOMING!'
          : 'NEXT GOAL TAKES THE CROWN!';
      this.triggerBanner('SUDDEN DEATH!', sub, '#ef4444', 2.0);
      this.addShake(18);
      return;
    }

    this._finishMatch();
  }

  _finishMatch(customBanner = "TIME'S UP!") {
    if (this.phase === 'ended') return;
    this.phase = 'ended';
    this.audio?.playWhistle('end');
    this.triggerBanner(customBanner, '', '#fde047', 2.0);
    const summary = this.getSummary();
    if (this.onMatchEnd && !this.disposed) {
      if (this.immediateEnd) {
        this.onMatchEnd(summary);
      } else {
        this.endTimer = setTimeout(() => {
          this.endTimer = null;
          if (!this.disposed) this.onMatchEnd(summary);
        }, 1350);
      }
    }
  }

  dispose() {
    this.disposed = true;
    if (this.endTimer !== null) clearTimeout(this.endTimer);
    this.endTimer = null;
  }

  _resetPositionsForKickoff() {
    this.phase = 'playing';
    this.balls = [];
    this.shells = [];
    this.torpedoes = [];
    this.hounds = [];
    this.bananas = [];
    // Remove temporary Holo-Clones on kickoff reset
    this.players = this.players.filter((p) => !p.isClone);

    this._spawnCenterBall(0);
    if (this.hasMutator('multiBall') && !this.isMinigame) {
      this._spawnCenterBall(190);
    }

    for (const p of this.players) {
      const isLeft = p.team === 0;
      const offset = p.role === 'defender' ? -130 : 0;
      p.x = isLeft ? 540 + offset : VIRTUAL_WIDTH - 540 - offset;
      p.y = this.arena.pitchFloorY - p.halfH;
      p.vx = 0;
      p.vy = 0;
      p.facing = isLeft ? 1 : -1;
      p.stunTimer = 0;
      p.chargeTime = 0;
      p.kickTimer = 0;
      p.spinAngle = 0;
      p.spinVel = 0;
      p.groundPoundState = 'none';
      p.groundPoundTimer = 0;
      p.dashTimer = 0;
      p.dashGhosts = [];
      p.touchingWallDir = 0;
      p.jumpsLeft = 1;
      p.jumpBufferTimer = 0;
      p.onGround = true;
      p.coyoteTimer = 0.1;
      p.animState = 'idle';
      p.animPhase = 0;
      if (this.trial?.specialRule === 'no_lava' && p.team === 0) {
        p.x = this.arena.platforms[0].x;
        p.y = this.arena.platforms[0].y - p.halfH;
      }
    }
    this.triggerBanner('PLAY ON!', '', '#38bdf8', 0.75);
    this.audio?.playWhistle('start');
  }

  // --- Sub-Stepped World Physics ---
  _stepWorld(dt, playerInputs, allowScoring) {
    const inputsByPlayer = new Map(this.players.map((player, index) => [player, playerInputs[index] || {}]));
    if (this.powLeftTimer > 0) this.powLeftTimer = Math.max(0, this.powLeftTimer - dt);
    if (this.powRightTimer > 0) this.powRightTimer = Math.max(0, this.powRightTimer - dt);

    // Ensure Double-Ball Mutator stays stocked!
    if (
      allowScoring &&
      this.hasMutator('multiBall') &&
      !this.isMinigame &&
      !this.suddenDeath &&
      this.balls.length < 2
    ) {
      this._spawnCenterBall((Math.random() - 0.5) * 280);
    }

    this._updateCourier(dt);
    this._updateKeepers(dt);
    this._updateShells(dt);
    this._updateTorpedoes(dt);
    this._updateHounds(dt);
    this._updateBananas(dt);
    this._updateStageHazards(dt);
    this._updateTargets(dt);
    if (this.mode === 'goalie_gauntlet') {
      this._updateGauntletCannon(dt);
    }

    // Expire Holo-Clones
    for (let i = this.players.length - 1; i >= 0; i--) {
      const pl = this.players[i];
      if (pl.isClone) {
        pl.cloneTimer -= dt;
        if (pl.cloneTimer <= 0) {
          this.spawnBurst(pl.x, pl.y, '#a855f7', 16, 300, 7);
          this.players.splice(i, 1);
        }
      }
    }

    // Update players
    for (let i = 0; i < this.players.length; i++) {
      const p = this.players[i];
      p.hyperReady = this.settings.hyperStrikes !== false && this.hype[p.team] >= 100;
      const inp = inputsByPlayer.get(p) || {};
      this._updatePlayer(p, inp, dt);
      advanceCharacterAnimation(p, dt);
      if (this.phase === 'ended') return;
    }

    // Player-vs-Player body separation + SuperStar Rainbow Tackle!
    for (let i = 0; i < this.players.length; i++) {
      for (let j = i + 1; j < this.players.length; j++) {
        const a = this.players[i];
        const b = this.players[j];
        // Boo-Baron Phase Dash ignores body collisions!
        if ((a.char.stats.phaseDash && a.dashTimer > 0) || (b.char.stats.phaseDash && b.dashTimer > 0)) {
          continue;
        }
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const minW = (a.halfW + b.halfW) * 0.78;
        const minH = (a.halfH + b.halfH) * 0.82;
        if (Math.abs(dx) < minW && Math.abs(dy) < minH) {
          // Check SuperStar Rainbow Tackle!
          if (a.starTimer > 0 && a.team !== b.team && b.invulnTimer <= 0 && b.starTimer <= 0) {
            this._applyStarTackle(a, b);
          } else if (b.starTimer > 0 && b.team !== a.team && a.invulnTimer <= 0 && a.starTimer <= 0) {
            this._applyStarTackle(b, a);
          } else {
            const push = (minW - Math.abs(dx)) * 3.5 * dt;
            const dir = dx >= 0 ? 1 : -1;
            a.x -= dir * push;
            b.x += dir * push;
          }
        }
      }
    }

    // Ball substeps keep fast shots from skipping thin collision surfaces.
    const subSteps = 4;
    const subDt = dt / subSteps;
    for (let step = 0; step < subSteps; step++) {
      for (let bIdx = this.balls.length - 1; bIdx >= 0; bIdx--) {
        const b = this.balls[bIdx];
        if (!b) continue;
        const scoredTeam = this._stepBall(b, subDt, allowScoring);
        if (scoredTeam === -2) {
          // Keep-Up Survival floor touch!
          this._finishMatch('BALL DROPPED!');
          return;
        }
        if (scoredTeam !== -1) {
          this._handleGoalScored(scoredTeam, b);
          if (this.phase === 'ended') return;
          if (
            this.phase === 'goal_celebration' &&
            !(this.suddenDeath && this.settings.suddenDeathMode === 'mayhem')
          ) {
            return;
          }
        }
      }
    }

    // Ball timers & MagnetGlove pull
    for (let bIdx = this.balls.length - 1; bIdx >= 0; bIdx--) {
      const b = this.balls[bIdx];
      if (this.mode === 'goalie_gauntlet' && b.savedCounted && b.x > 1250 && b.vx > 0) {
        this.spawnBurst(b.x, b.y, '#4ade80', 10, 260, 6);
        this.balls.splice(bIdx, 1);
        continue;
      }

      if (b.scaleTimer > 0) {
        b.scaleTimer -= dt;
        if (b.scaleTimer <= 0) b.targetScale = 1.0;
      }
      const desiredR = b.baseRadius * b.targetScale;
      b.radius += (desiredR - b.radius) * Math.min(1, dt * 8);

      b.squashX += (1 - b.squashX) * Math.min(1, dt * 14);
      b.squashY += (1 - b.squashY) * Math.min(1, dt * 14);

      if (b.freezeTimer > 0) b.freezeTimer = Math.max(0, b.freezeTimer - dt);
      if (b.burnTimer > 0) b.burnTimer = Math.max(0, b.burnTimer - dt);
      if (b.vanishTimer > 0) b.vanishTimer = Math.max(0, b.vanishTimer - dt);
      if (b.zeroGTimer > 0) b.zeroGTimer = Math.max(0, b.zeroGTimer - dt);
      if (b.portalCooldown > 0) b.portalCooldown = Math.max(0, b.portalCooldown - dt);
      if (b.ringBoostCooldown > 0) b.ringBoostCooldown = Math.max(0, b.ringBoostCooldown - dt);

      // MagnetGlove Pull!
      for (const p of this.players) {
        if (p.magnetTimer > 0) {
          const tx = p.x + p.facing * 52;
          const ty = p.y - 6;
          const dx = tx - b.x;
          const dy = ty - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 540 && dist > 18) {
            const pull = 1950 * dt;
            b.vx += (dx / dist) * pull;
            b.vy += (dy / dist) * pull;
          }
        }
      }

      b.trail.push({ x: b.x, y: b.y });
      if (b.trail.length > 10) b.trail.shift();
    }
  }

  _applyStarTackle(attacker, victim) {
    victim.stunTimer = 0.65;
    victim.invulnTimer = 1.1;
    victim.vx = Math.sign(victim.x - attacker.x || attacker.facing) * 760;
    victim.vy = -560;
    attacker.stats.kos++;
    this._addHype(attacker.team, 12);
    this.audio?.playBrawlHit();
    this.addShake(11);
    this.spawnBurst(victim.x, victim.y, '#fde047', 16, 400, 8);
    this.spawnFloatingText(victim.x, victim.y - 45, 'STAR SMASH!', '#fde047', 26);
  }

  _updatePlayer(p, inp, dt) {
    const turboMult = this.hasMutator('turboMode') ? 1.32 : 1.0;

    if (p.scaleTimer > 0) {
      p.scaleTimer -= dt;
      if (p.scaleTimer <= 0) {
        p.targetScale = p.bossScale || 1.0;
        if (p.starTimer <= 0) p.speedBuff = 1.0;
        p.jumpBuff = 1.0;
      }
    }
    if (p.starTimer > 0) {
      p.starTimer = Math.max(0, p.starTimer - dt);
      if (p.starTimer <= 0 && p.scaleTimer <= 0) p.speedBuff = 1.0;
    }
    if (p.magnetTimer > 0) p.magnetTimer = Math.max(0, p.magnetTimer - dt);
    if (p.parryWindowTimer > 0) p.parryWindowTimer = Math.max(0, p.parryWindowTimer - dt);
    if (p.parryFlashTimer > 0) p.parryFlashTimer = Math.max(0, p.parryFlashTimer - dt);
    if (p.lavaTickTimer > 0) p.lavaTickTimer = Math.max(0, p.lavaTickTimer - dt);

    p.visualScale += (p.targetScale - p.visualScale) * Math.min(1, dt * 9);
    const totalScale = p.visualScale * p.char.stats.size;
    const oldHalfH = p.halfH;
    p.halfW = p.baseHalfW * totalScale;
    p.halfH = p.baseHalfH * totalScale;
    p.y -= p.halfH - oldHalfH;

    p.squashX += (1 - p.squashX) * Math.min(1, dt * 14);
    p.squashY += (1 - p.squashY) * Math.min(1, dt * 14);

    if (p.invulnTimer > 0) p.invulnTimer = Math.max(0, p.invulnTimer - dt);
    if (p.fireImmuneTimer > 0) p.fireImmuneTimer = Math.max(0, p.fireImmuneTimer - dt);
    if (p.kickCooldown > 0) p.kickCooldown = Math.max(0, p.kickCooldown - dt);
    if (p.dashCooldown > 0) p.dashCooldown = Math.max(0, p.dashCooldown - dt);

    for (let i = p.dashGhosts.length - 1; i >= 0; i--) {
      p.dashGhosts[i].alpha -= dt * 4.5;
      if (p.dashGhosts[i].alpha <= 0) p.dashGhosts.splice(i, 1);
    }

    if (p.stunTimer > 0) {
      if (p.groundPoundState !== 'none') {
        p.groundPoundState = 'none';
        p.groundPoundTimer = 0;
      }
      p.stunTimer -= dt;
      p.chargeTime = 0;
      p.kickTimer = 0;
      p.vy += 2400 * dt;
      p.vx *= Math.pow(0.06, dt);
      this._moveAndCollidePlayer(p, dt, false);
      return;
    }

    // Ground Pound: Airborne down / down+kick dive attack!
    const wantsGroundPound =
      !p.onGround &&
      p.groundPoundState === 'none' &&
      p.stunTimer <= 0 &&
      (inp.downPressed || (inp.down && (inp.kickPressed || inp.lobPressed)));

    if (wantsGroundPound) {
      p.groundPoundState = 'stall';
      p.groundPoundTimer = 0.12;
      p.vx = 0;
      p.vy = 0;
      p.spinAngle = 0.01;
      p.spinVel = p.facing * 28;
      p.squashX = 0.85;
      p.squashY = 1.25;
      p.chargeTime = 0;
      p.kickTimer = 0;
      this.audio?.playGroundPoundStart();
      this.spawnBurst(p.x, p.y + p.halfH * 0.5, p.char.aura || '#facc15', 8, 220, 6);
    }

    if (p.groundPoundState === 'stall') {
      p.groundPoundTimer -= dt;
      p.vx = 0;
      p.vy = 0;
      p.spinAngle += p.spinVel * dt;
      if (p.groundPoundTimer <= 0) {
        p.groundPoundState = 'plunge';
        p.vy = 2200;
        p.spinAngle = 0;
        p.spinVel = 0;
        p.squashX = 0.72;
        p.squashY = 1.38;
      }
      this._moveAndCollidePlayer(p, dt, false);
      return;
    }

    if (p.groundPoundState === 'plunge') {
      p.vy = 2200;
      p.vx *= Math.pow(0.08, dt);
      p.invulnTimer = Math.max(p.invulnTimer, 0.25);
      p.dashGhosts.push({ x: p.x, y: p.y, alpha: 0.75 });

      // 1. Meteor Strike on Balls during plunge:
      const reach = (p.halfW + 32) * p.visualScale;
      for (const b of this.balls) {
        const distY = b.y - p.y;
        const distX = Math.abs(b.x - p.x);
        if (distX <= reach + b.radius && distY >= -16 && distY <= p.halfH + b.radius + 28) {
          const outDir = p.team === 0 ? 1 : -1;
          b.vx = outDir * 1250;
          b.vy = 1850;
          b.lastKicker = p;
          b.lastTeam = p.team;
          b.lastKickTime = this.time;
          b.auraColor = p.char.aura || '#facc15';
          b.freezeTimer = 0;
          this.addHitstop(0.12);
          this.addShake(18);
          this.audio?.playBallKick(1.3, true);
          this.spawnBurst(b.x, b.y, '#facc15', 18, 380, 8);
          this.spawnFloatingText(p.x, p.y - 35, 'METEOR SPIKE!', '#facc15', 26);
          b.lastWasMeteorSpike = true;
          p.stats.meteorSpikes = (p.stats.meteorSpikes || 0) + 1;
          p.stats.powerShots++;
          this._addHype(p.team, 24);
          p.vy = -480;
          p.groundPoundState = 'none';
          break;
        }
      }

      // 2. Stomp Stun on Opponents during plunge:
      if (p.groundPoundState === 'plunge') {
        for (const foe of this.players) {
          if (foe !== p && foe.team !== p.team && foe.starTimer <= 0 && foe.invulnTimer <= 0 &&
              !(foe.char.stats.phaseDash && foe.dashTimer > 0)) {
            const dx = Math.abs(foe.x - p.x);
            const dy = foe.y - p.y;
            if (dx < (p.halfW + foe.halfW + 16) && dy > 0 && dy < (p.halfH + foe.halfH + 26)) {
              foe.stunTimer = 1.35;
              foe.invulnTimer = 0.5;
              foe.squashX = 1.6;
              foe.squashY = 0.4;
              foe.vy = 200;
              this.audio?.playBrawlHit();
              this.spawnBurst(foe.x, foe.y, '#ef4444', 16, 280, 7);
              this.spawnFloatingText(foe.x, foe.y - 40, 'STOMPED!', '#ef4444', 26);
              this.addShake(14);
              this.addHitstop(0.08);
              p.stats.kos++;
              this._addHype(p.team, 18);
              p.vy = -680;
              p.groundPoundState = 'none';
              p.jumpsLeft = 1;
              break;
            }
          }
        }
      }

      this._moveAndCollidePlayer(p, dt, true);
      return;
    }

    if (p.groundPoundState === 'impact') {
      p.groundPoundTimer -= dt;
      p.vx = 0;
      p.vy = 0;
      if (p.groundPoundTimer <= 0) {
        p.groundPoundState = 'none';
        p.squashX = 1;
        p.squashY = 1;
      }
      this._moveAndCollidePlayer(p, dt, false);
      return;
    }

    // Item activation!
    if (inp.itemPressed && p.heldItem) {
      this._activatePlayerItem(p);
    }

    // Dash Burst (also opens Perfect Parry window!)
    if (inp.dashPressed && p.dashCooldown <= 0 && p.dashTimer <= 0) {
      p.stats.dashes++;
      p.dashDir = inp.left ? -1 : inp.right ? 1 : p.facing;
      p.facing = p.dashDir;
      p.dashTimer = p.char.stats.shellSlide ? 0.23 : 0.14;
      p.dashCooldown = this.hasMutator('turboMode') ? 0.45 : 0.82;
      p.parryWindowTimer = 0.1;
      p.squashX = 1.32;
      p.squashY = 0.76;
      this.audio?.playDash();
      this.spawnBurst(p.x, p.y + p.halfH * 0.5, '#ffffff', 7, 220, 6);
    }

    const friction = p.onGround ? this.arena.groundFriction ?? 1.0 : 1.0;
    const maxSpeed = 690 * p.char.stats.speed * p.speedBuff * turboMult * (friction < 0.4 ? 1.12 : 1.0);
    const accel = p.onGround ? 5400 * Math.max(0.55, friction) * turboMult : 3800 * turboMult;
    const decel = p.onGround ? 6400 * friction : 1800;

    if (p.dashTimer > 0) {
      p.dashTimer -= dt;
      p.vx = p.dashDir * 1180 * p.speedBuff * (p.char.stats.shellSlide ? 1.08 : 1.0);
      p.vy *= 0.7;
      p.dashGhosts.push({ x: p.x, y: p.y, alpha: 0.85 });
    } else {
      let moveDir = 0;
      if (inp.left) moveDir -= 1;
      if (inp.right) moveDir += 1;

      if (moveDir !== 0) {
        p.facing = moveDir;
        p.vx += moveDir * accel * dt;
        if (Math.abs(p.vx) > maxSpeed) {
          p.vx = Math.sign(p.vx) * maxSpeed;
        }
      } else {
        const drop = decel * dt;
        if (Math.abs(p.vx) <= drop) p.vx = 0;
        else p.vx -= Math.sign(p.vx) * drop;
      }
    }

    if (p.onGround) {
      p.coyoteTimer = 0.1;
      p.jumpsLeft = 1;
      p.hoverFuel = p.char.stats.hoverDuration || 0;
      p.spinAngle = 0;
      p.spinVel = 0;
    } else {
      p.coyoteTimer = Math.max(0, p.coyoteTimer - dt);
      p.spinAngle += p.spinVel * dt;
      if (Math.abs(p.spinAngle) >= Math.PI * 2) {
        p.spinAngle = 0;
        p.spinVel = 0;
      }
    }

    if (inp.jumpPressed) {
      p.jumpBufferTimer = 0.11;
    } else {
      p.jumpBufferTimer = Math.max(0, p.jumpBufferTimer - dt);
    }

    p.wallJumpCooldown = Math.max(0, p.wallJumpCooldown - dt);

    // Wall-Slide Physics: Friction slows downward fall while clinging to stadium walls
    if (!p.onGround && p.touchingWallDir !== 0 && p.groundPoundState === 'none') {
      if (p.vy > 100) {
        p.vy = Math.min(p.vy, 340);
        if (Math.random() < 0.28) {
          this.spawnBurst(p.x - p.touchingWallDir * p.halfW, p.y + p.halfH * 0.4, '#ffffff', 2, 70, 3);
        }
      }
    }

    const jumpVel = 1230 * p.char.stats.jump * p.jumpBuff;
    if (inp.jumpPressed && !p.onGround && p.touchingWallDir !== 0 && p.wallJumpCooldown <= 0) {
      // Pro Movement Tech: WALL JUMP!
      const wallDir = p.touchingWallDir;
      p.vx = wallDir * (740 * p.char.stats.speed);
      p.vy = -1260 * p.char.stats.jump;
      p.facing = wallDir;
      p.touchingWallDir = 0;
      p.wallJumpCooldown = 0.24;
      p.jumpsLeft = 1; // Wall-jump gives striker a fresh mid-air jump/volley option!
      p.stats.wallJumps = (p.stats.wallJumps || 0) + 1;
      p.stats.jumps++;
      p.jumpBufferTimer = 0;
      p.coyoteTimer = 0;
      p.squashX = 0.74;
      p.squashY = 1.3;
      this.audio?.playJump(p.char, true);
      this.spawnBurst(p.x - wallDir * p.halfW, p.y, '#ffffff', 14, 280, 6);
      this.spawnFloatingText(p.x, p.y - 35, 'WALL JUMP!', '#38bdf8', 22);
    } else if (p.jumpBufferTimer > 0 && p.coyoteTimer > 0) {
      p.vy = -jumpVel;
      p.onGround = false;
      p.coyoteTimer = 0;
      p.jumpBufferTimer = 0;
      p.squashX = 0.78;
      p.squashY = 1.26;
      p.stats.jumps++;
      this.audio?.playJump(p.char, false);
      this.spawnBurst(p.x, p.y + p.halfH, '#ffffff', 6, 180, 5);
    } else if (inp.jumpPressed && p.jumpsLeft > 0 && !p.onGround) {
      const djBoost = p.char.stats.doubleJumpBoost || 0.96;
      p.vy = -jumpVel * djBoost;
      p.jumpsLeft = 0;
      p.jumpBufferTimer = 0;
      p.spinAngle = 0.01;
      p.spinVel = 15.5;
      p.squashX = 0.82;
      p.squashY = 1.22;
      p.stats.jumps++;
      this.audio?.playJump(p.char, true);
      this.spawnBurst(p.x, p.y + p.halfH * 0.6, p.char.aura, 9, 240, 6);
    }

    if (inp.jumpReleased && p.vy < -280) {
      p.vy *= 0.56;
    }

    // Princess Pippa's Royal Hover!
    p.isHovering = false;
    if (!p.onGround && p.jumpsLeft === 0 && p.hoverFuel > 0 && (inp.jumpHeld || inp.up) && p.vy > 60) {
      p.hoverFuel -= dt;
      p.vy = Math.min(p.vy, 125);
      p.isHovering = true;
    }

    const arenaGrav = (this.arena.gravityScale ?? 1.0) * (this.hasMutator('moonGravity') ? 0.58 : 1.0);
    let grav = 2520 * (p.char.stats.gravScale || 1.0) * arenaGrav;
    p.fastFalling = Boolean(inp.down && !p.onGround);
    if (p.fastFalling) grav *= 2.05;

    if (p.chargeTime > 0.06 && !p.onGround) {
      grav *= 0.35;
      p.vy *= Math.pow(0.25, dt);
      p.vx *= Math.pow(0.35, dt);
    }

    p.vy = Math.min(2600, p.vy + grav * dt);

    // --- Kick, Parry, Spin & Hyper-Strike System (Simplified Unified Controls) ---
    const chargeSpeed = this.hasMutator('turboMode') ? 2.1 : 1.0;
    const wantsDirectLob =
      (inp.lobPressed || (inp.up && inp.kickPressed)) && p.kickCooldown <= 0 && p.kickTimer <= 0;

    if (wantsDirectLob) {
      p.parryWindowTimer = 0.095;
      p.aimSpin = 0;
      this._triggerStrike(p, 'up', 0.45);
    } else if (inp.kickPressed && p.kickCooldown <= 0 && p.kickTimer <= 0) {
      p.chargeTime = 0.001;
      p.parryWindowTimer = 0.095;
    } else if (p.chargeTime > 0) {
      if (inp.kickDown && p.chargeTime < 0.55) {
        p.chargeTime += dt * chargeSpeed;
      } else {
        let type = 'side';
        p.aimSpin = 0;
        if (!p.onGround && inp.down) {
          type = 'spike';
        } else if (inp.up) {
          type = 'up';
        } else {
          // Aftertouch Magnus Spin Curve on Side/Charged strikes!
          if (inp.up) p.aimSpin = -1.15;
          else if (inp.down) p.aimSpin = 1.3;
        }
        const chargeNorm = Math.min(1, p.chargeTime / 0.36);
        p.chargeTime = 0;
        this._triggerStrike(p, type, chargeNorm);
      }
    }

    if (p.parryWindowTimer > 0) this._checkParryDeflect(p);
    if (p.kickTimer > 0) {
      p.kickTimer -= dt;
      this._checkActiveKickHits(p);
    }

    this._moveAndCollidePlayer(p, dt, inp.down);
    p.footstepTimer = Math.max(0, (p.footstepTimer || 0) - dt);
    if (p.onGround && Math.abs(p.vx) > 160 && p.footstepTimer === 0) {
      p.footstepTimer = Math.max(0.13, 0.3 - Math.abs(p.vx) / 5000);
      this.audio?.playFootstep?.(this.arena.id, p.char.stats.weight);
    }

    // Sky-Cloud Courier Item Pickup!
    if (!p.isClone && !p.heldItem && this.courier.active && this.courier.heldItemId) {
      const bx = this.courier.bubbleX ?? this.courier.x;
      const by = this.courier.bubbleY ?? this.courier.y + COURIER_LAYOUT.itemOffsetY;
      const nearestX = Math.max(p.x - p.halfW, Math.min(p.x + p.halfW, bx));
      const nearestY = Math.max(p.y - p.halfH, Math.min(p.y + p.halfH, by));
      if (Math.hypot(nearestX - bx, nearestY - by) <= COURIER_LAYOUT.bubbleRadius) {
        p.heldItem = this.courier.heldItemId;
        this.courier.heldItemId = null;
        this.courier.spawnTimer = this.settings.itemMode === 'frantic' ? 4.8 : 9.0;
        this.audio?.playItemPickup();
        this.spawnBurst(bx, by, '#fde047', 16, 360, 7);
        this.spawnFloatingText(bx, by - 20, 'GOT ITEM!', '#fde047', 24);
      }
    }
  }

  _checkParryDeflect(p) {
    const scale = p.visualScale * p.char.stats.size * (p.char.stats.reachMult || 1.0);
    const reach = 114 * scale;
    for (const b of this.balls) {
      const spd = Math.hypot(b.vx, b.vy);
      if (spd < 680) continue;
      const incomingEnemyShot =
        (b.lastTeam !== -1 && b.lastTeam !== p.team) ||
        (this.mode === 'goalie_gauntlet' && b.vx < -400);
      if (!incomingEnemyShot) continue;

      if (Math.hypot(b.x - p.x, b.y - p.y) <= reach + b.radius) {
        p.parryWindowTimer = 0;
        p.parryFlashTimer = 0.38;
        p.invulnTimer = Math.max(p.invulnTimer, 0.45);
        p.stats.parries++;
        this._addHype(p.team, 28);

        const outDir = p.team === 0 ? 1 : -1;
        const newSpd = Math.min(2280, spd * 1.24);
        const ang = outDir === 1 ? -0.24 : -Math.PI + 0.24;
        b.vx = Math.cos(ang) * newSpd;
        b.vy = Math.sin(ang) * newSpd;
        b.lastKicker = p;
        b.lastTeam = p.team;
        b.lastKickTime = this.time;
        b.lastWasMeteorSpike = false;
        p.stats.touches++;
        b.auraColor = '#fde047';
        b.freezeTimer = 0;
        p.hitBallsThisSwing.add(b.id);

        if (this.mode === 'goalie_gauntlet' && !b.savedCounted) {
          b.savedCounted = true;
          this.gauntletSaves++;
          this.scores[0] = this.gauntletSaves;
          p.stats.saves++;
        }

        this.audio?.playParry();
        this.addHitstop(0.085);
        this.addShake(19);
        this.spawnShockwave(b.x, b.y, '#fde047', 235, 11);
        this.spawnBurst(b.x, b.y, '#fef08a', 22, 540, 8);
        this.spawnFloatingText(b.x, b.y - 50, 'PERFECT PARRY!', '#fde047', 32);
        return;
      }
    }
  }

  _triggerStrike(p, type, chargeNorm) {
    p.kickType = type;
    p.kickDuration = 0.21;
    p.kickTimer = p.kickDuration;
    p.kickCooldown = p.char.id === 'yoshi' ? 0.23 : 0.28;
    p.kickPowerRatio = 0.45 + chargeNorm * 0.65;
    p.hitBallsThisSwing.clear();
    p.hitPlayersThisSwing.clear();

    // Check Signature Hyper-Strike activation!
    p.isHyperSwing = false;
    if (this.settings.hyperStrikes !== false && this.hype[p.team] >= 100 && chargeNorm >= 0.42) {
      const scale = p.visualScale * p.char.stats.size * (p.char.stats.reachMult || 1.0);
      const nearBall = this.balls.some((b) => Math.hypot(b.x - p.x, b.y - p.y) <= 170 * scale + b.radius);
      if (nearBall) {
        this.hype[p.team] = 0;
        p.isHyperSwing = true;
        p.stats.hyperStrikes++;
        this.hyperCutIn = { char: p.char, timer: 0.52 };
        this.audio?.playHyperCutIn();
        this.addHitstop(0.14);
        this.addShake(24);
      }
    }

    p.squashX = 1.24;
    p.squashY = 0.84;
    if (type === 'side') p.vx += p.facing * (180 + chargeNorm * 220);
    if (type === 'up' && !p.onGround) p.vy = Math.min(p.vy, -260);

    this.audio?.playSwing(type);
    this.spawnBurst(
      p.x + p.facing * 38 * p.visualScale,
      p.y + (type === 'up' ? -28 : type === 'spike' ? 28 : 6),
      p.char.particleColor,
      6 + Math.round(chargeNorm * 8),
      260,
      6
    );
  }

  _checkActiveKickHits(p) {
    const reachMult = (p.char.stats.reachMult || 1.0) * (p.isHyperSwing ? 1.45 : 1.0);
    const scale = p.visualScale * p.char.stats.size;
    const reach = 104 * scale * reachMult;
    const arcCenterX = p.x + p.facing * 42 * scale;
    const arcCenterY = p.y + (p.kickType === 'up' ? -24 : p.kickType === 'spike' ? 24 : 4) * scale;

    for (const b of this.balls) {
      if (p.hitBallsThisSwing.has(b.id)) continue;
      const dist = Math.hypot(b.x - arcCenterX, b.y - arcCenterY);
      if (dist <= reach + b.radius * 0.88) {
        p.hitBallsThisSwing.add(b.id);
        this._applyKickToBall(p, b);
      }
    }

    for (const other of this.players) {
      if (other === p || other.team === p.team) continue;
      if (other.invulnTimer > 0 || other.starTimer > 0 || p.hitPlayersThisSwing.has(other.slot)) continue;
      if (other.char.stats.phaseDash && other.dashTimer > 0) continue;
      const dist = Math.hypot(other.x - arcCenterX, other.y - arcCenterY);
      if (dist <= reach * 0.92 + other.halfW) {
        p.hitPlayersThisSwing.add(other.slot);
        const brawl = (p.char.stats.brawlBoost || 1.0) * p.visualScale;
        const resist = other.char.stats.weight * other.visualScale;
        const kb = (720 * brawl) / resist;
        other.vx = p.facing * kb;
        other.vy = -440 * (brawl / resist);
        other.stunTimer = 0.42 * brawl;
        other.invulnTimer = 0.9;
        other.squashX = 0.72;
        other.squashY = 1.32;
        p.stats.kos++;
        this._addHype(p.team, 12);

        this.audio?.playBrawlHit();
        this.addHitstop(0.045);
        this.addShake(9);
        this.spawnBurst((p.x + other.x) / 2, (p.y + other.y) / 2, '#fde047', 12, 340, 7);
      }
    }
  }

  _applyKickToBall(p, b) {
    b.lastWasMeteorSpike = false;
    p.stats.touches++;
    // Simultaneous Ball CLASH!
    if (this.time - b.lastKickTime < 0.085 && b.lastTeam !== -1 && b.lastTeam !== p.team && !p.isHyperSwing) {
      b.vx = (Math.random() - 0.5) * 260;
      b.vy = -1380;
      b.lastKickTime = this.time;
      b.lastTeam = -1;
      b.freezeTimer = 0;
      p.vx = -p.facing * 560;
      if (b.lastKicker) b.lastKicker.vx = -b.lastKicker.facing * 560;
      this._addHype(0, 15);
      this._addHype(1, 15);

      this.audio?.playClash();
      this.addHitstop(0.095);
      this.addShake(22);
      this.spawnShockwave(b.x, b.y, '#fde047', 240, 12);
      this.spawnFloatingText(b.x, b.y - 45, 'CLASH!!', '#fde047', 36);
      this.spawnBurst(b.x, b.y, '#ffffff', 24, 580, 9);
      return;
    }

    if (b.freezeTimer > 0) {
      b.freezeTimer = 0;
      this.spawnBurst(b.x, b.y, '#bae6fd', 18, 460, 8, 'rect');
    }

    let baseSpeed = 1140 * p.char.stats.power * this.ballPreset.kickMultiplier;
    if (p.char.id === 'mario' && !p.onGround && p.kickType === 'side') baseSpeed *= 1.12;
    if (p.char.stats.hasLumi && p.kickPowerRatio > 0.72) baseSpeed *= 1.08;
    if (p.visualScale > 1.35) baseSpeed *= 1.24;

    const isCharged = p.kickPowerRatio > 0.78;
    let speed = baseSpeed * (0.76 + p.kickPowerRatio * 0.56);

    // 2v2 Team Combo Pass Voltage with 3-Pass Hyper Overdrive!
    b.comboBoosted = false;
    b.hyperVoltage = false;
    if (
      b.lastKicker &&
      b.lastKicker !== p &&
      b.lastTeam === p.team &&
      this.time - b.lastKickTime < 3.2
    ) {
      b.passChain = (b.passChain || 0) + 1;
      p.stats.comboPasses++;
      this._addHype(p.team, 15 * b.passChain);
      this.audio?.playComboPass();

      if (b.passChain >= 3) {
        // TIER 3: HYPER VOLTAGE OVERDRIVE!
        speed *= 1.48;
        b.comboBoosted = true;
        b.hyperVoltage = true;
        b.auraColor = '#38bdf8';
        this.addShake(15);
        this.spawnBurst(b.x, b.y, '#38bdf8', 20, 420, 8);
        this.spawnFloatingText(b.x, b.y - 54, '⚡ HYPER VOLTAGE! ⚡', '#38bdf8', 34);
      } else if (b.passChain === 2) {
        // TIER 2: DOUBLE VOLTAGE!
        speed *= 1.32;
        b.comboBoosted = true;
        b.auraColor = '#7dd3fc';
        this.spawnBurst(b.x, b.y, '#7dd3fc', 14, 320, 7);
        this.spawnFloatingText(b.x, b.y - 54, 'DOUBLE VOLTAGE! ⚡', '#7dd3fc', 30);
      } else {
        // TIER 1: TEAM COMBO PASS!
        speed *= 1.2;
        b.comboBoosted = true;
        this.spawnFloatingText(b.x, b.y - 54, 'TEAM COMBO! ⚡', '#38bdf8', 26);
      }
    } else {
      b.passChain = 0;
    }

    let angleRad = 0;
    if (this.mode === 'keep_up') {
      // In Keep-Up Survival, bias side kicks higher so balls stay delightfully juggled!
      angleRad = p.kickType === 'up' ? -Math.PI / 2 + p.facing * 0.22 : p.facing === 1 ? -1.05 : -Math.PI + 1.05;
    } else if (p.kickType === 'up') {
      angleRad = p.facing === 1 ? -1.16 : -Math.PI + 1.16;
    } else if (p.kickType === 'spike') {
      angleRad = p.facing === 1 ? 0.62 : Math.PI - 0.62;
    } else {
      angleRad = p.facing === 1 ? -0.28 : -Math.PI + 0.28;
      angleRad += p.facing * Math.max(-0.18, Math.min(0.18, p.vy * 0.00012));
    }

    // Defensive Save detection + Goalie Gauntlet Save counter!
    const ownGoalSave =
      (p.team === 0 && b.x < 480 && b.vx < -350) ||
      (p.team === 1 && b.x > VIRTUAL_WIDTH - 480 && b.vx > 350);
    if (ownGoalSave) {
      p.stats.saves++;
      this._addHype(p.team, 22);
      if (this.mode === 'goalie_gauntlet' && !b.savedCounted) {
        b.savedCounted = true;
        this.gauntletSaves++;
        this.scores[0] = this.gauntletSaves;
        this.spawnFloatingText(b.x, b.y - 42, `SAVE #${this.gauntletSaves}!`, '#4ade80', 28);
      } else {
        this.spawnFloatingText(b.x, b.y - 40, 'EPIC SAVE!', '#38bdf8', 26);
      }
    } else if (this.mode === 'goalie_gauntlet' && !b.savedCounted && p.team === 0) {
      b.savedCounted = true;
      this.gauntletSaves++;
      this.scores[0] = this.gauntletSaves;
      p.stats.saves++;
      this.spawnFloatingText(b.x, b.y - 42, `SAVE #${this.gauntletSaves}!`, '#4ade80', 28);
    }

    // Apply Magnus Spin Curve (directional aftertouch + Wally's natural topspin)
    b.spin = p.aimSpin || (p.char.stats.autoSpin ? 0.9 : 0);

    // Apply Signature Hyper-Strike Physics!
    b.hyperActive = false;
    b.hyperStyle = null;
    if (p.isHyperSwing) {
      p.isHyperSwing = false;
      b.hyperActive = true;
      b.hyperStyle = p.char.hyperStyle;
      speed = Math.min(2200, speed * 1.38);
      const outDir = p.team === 0 ? 1 : -1;
      angleRad = outDir === 1 ? -0.24 : -Math.PI + 0.24;
      this._applyHyperSignatureEffect(p, b, outDir, speed);
    } else {
      this._addHype(p.team, isCharged ? 14 : 7);
    }

    b.vx = Math.cos(angleRad) * speed + p.vx * 0.16;
    b.vy = Math.sin(angleRad) * speed;
    if (b.hyperStyle === 'spore_pop') {
      b.vx = (p.team === 0 ? 1 : -1) * speed * 0.55;
      b.vy = -1180;
    } else if (b.hyperStyle === 'dip_meteor') {
      b.vy = -780;
      b.spin = 2.6;
    }

    b.angVel = p.facing * (12 + p.kickPowerRatio * 18);
    b.squashX = 1.34;
    b.squashY = 0.72;
    b.lastKicker = p;
    b.lastTeam = p.team;
    b.lastKickTime = this.time;
    b.auraColor = p.char.aura;

    if (isCharged || b.hyperActive) {
      p.stats.powerShots++;
      this.addHitstop(b.hyperActive ? 0.09 : 0.07);
      this.addShake(b.hyperActive ? 22 : 16);
      this.spawnShockwave(b.x, b.y, b.hyperActive ? '#fde047' : p.char.aura, b.hyperActive ? 260 : 185, 10);
    } else {
      this.addHitstop(0.032);
      this.addShake(7);
    }

    this.audio?.playBallKick(p.kickPowerRatio, isCharged || b.hyperActive);
    this.spawnBurst(b.x, b.y, p.char.aura, isCharged || b.hyperActive ? 22 : 10, 520, 7);
  }

  _applyHyperSignatureEffect(p, b, outDir, speed) {
    const st = p.char.hyperStyle;
    if (st === 'spiral_fire') {
      b.burnTimer = 4.2;
      b.spin = -1.6;
    } else if (st === 'vacuum_lob') {
      for (const foe of this.players) {
        if (foe.team !== p.team) foe.vx += -outDir * 420;
      }
      b.spin = 1.8;
    } else if (st === 'decoy_split' && this.balls.length < 6) {
      // Yoyo spawns a bonus live Comet Egg Ball alongside the main shot!
      this._spawnCenterBall(0);
      const extra = this.balls[this.balls.length - 1];
      extra.x = b.x;
      extra.y = b.y - 28;
      extra.vx = outDir * speed * 0.92;
      extra.vy = -560;
      extra.lastKicker = p;
      extra.lastTeam = p.team;
      extra.auraColor = '#bef264';
      p.hitBallsThisSwing.add(extra.id);
    } else if (st === 'heavy_shock') {
      this.spawnShockwave(p.x, p.y, '#c084fc', 310, 12);
      for (const foe of this.players) {
        if (foe.team !== p.team && Math.abs(foe.x - p.x) < 340) {
          foe.vy = -520;
          foe.stunTimer = 0.45;
        }
      }
    } else if (st === 'meteor_burn') {
      b.burnTimer = 5.0;
      b.targetScale = 1.65;
      b.scaleTimer = 5.0;
    } else if (st === 'whip_curve') {
      b.spin = -2.5;
    } else if (st === 'quake_drive') {
      this.addShake(24);
      for (const foe of this.players) {
        if (foe.team !== p.team && foe.onGround) {
          foe.vy = -640;
          foe.onGround = false;
          foe.stunTimer = 0.45;
        }
      }
    } else if (st === 'zero_g_laser') {
      b.zeroGTimer = 1.15;
    } else if (st === 'vanish_shot') {
      b.vanishTimer = 0.72;
    } else if (st === 'ricochet_hyper') {
      b.spin = 1.6;
      this.spawnBurst(b.x, b.y, '#38bdf8', 18, 480, 8);
    }
  }

  _moveAndCollidePlayer(p, dt, holdingDown) {
    const ar = this.arena;
    const prevBottom = p.y + p.halfH;
    const prevVy = p.vy;
    const wasOnGround = p.onGround;

    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.onGround = false;

    // 1. Sunken Pitch Risers (Junior's Shell-Slide bounces off riser walls!)
    p.touchingWallDir = 0;
    if (p.y + p.halfH > ar.goalFloorY + 14) {
      if (p.x - p.halfW < ar.pitchLeftX) {
        p.x = ar.pitchLeftX + p.halfW;
        p.touchingWallDir = 1;
        if (p.char.stats.shellSlide && p.dashTimer > 0) {
          p.dashDir = 1;
          p.facing = 1;
          this.audio?.playBallBounce(550);
        } else if (p.vx < 0) {
          p.vx = 0;
        }
      }
      if (p.x + p.halfW > ar.pitchRightX) {
        p.x = ar.pitchRightX - p.halfW;
        p.touchingWallDir = -1;
        if (p.char.stats.shellSlide && p.dashTimer > 0) {
          p.dashDir = -1;
          p.facing = -1;
          this.audio?.playBallBounce(550);
        } else if (p.vx > 0) {
          p.vx = 0;
        }
      }
    }

    const upperLeftWallX = ar.goalLineLeftX + 52;
    const upperRightWallX = ar.goalLineRightX - 52;
    if (p.y - p.halfH < ar.goalCeilingY - 8) {
      if (p.x - p.halfW < upperLeftWallX) {
        p.x = upperLeftWallX + p.halfW;
        p.touchingWallDir = 1;
        if (p.vx < 0) p.vx = 0;
      }
      if (p.x + p.halfW > upperRightWallX) {
        p.x = upperRightWallX - p.halfW;
        p.touchingWallDir = -1;
        if (p.vx > 0) p.vx = 0;
      }
    }

    const minBackLeft = this.mode === 'target_blitz' || this.mode === 'keep_up' ? upperLeftWallX : ar.goalBackLeftX;
    const maxBackRight = this.mode === 'keep_up' ? upperRightWallX : ar.goalBackRightX;
    if (p.x - p.halfW <= minBackLeft + 4) {
      p.x = minBackLeft + p.halfW;
      p.touchingWallDir = 1;
      if (p.vx < 0) p.vx = 0;
    }
    if (p.x + p.halfW >= maxBackRight - 4) {
      p.x = maxBackRight - p.halfW;
      p.touchingWallDir = -1;
      if (p.vx > 0) p.vx = 0;
    }

    if (p.y - p.halfH < 20) {
      p.y = 20 + p.halfH;
      if (p.vy < 0) p.vy = 0;
    }
    if ((p.x - p.halfW < upperLeftWallX - 6 || p.x + p.halfW > upperRightWallX + 6) && p.y - p.halfH < ar.goalCeilingY) {
      p.y = ar.goalCeilingY + p.halfH;
      if (p.vy < 0) p.vy = 0;
    }

    // 3. Floor Landing
    let floorY = ar.pitchFloorY;
    if (p.x < ar.pitchLeftX || p.x > ar.pitchRightX) {
      floorY = ar.goalFloorY;
    }
    p.shadowY = floorY;

    if (!holdingDown && p.vy >= 0) {
      for (const plat of ar.platforms) {
        if (
          p.x + p.halfW * 0.7 > plat.x - plat.w / 2 &&
          p.x - p.halfW * 0.7 < plat.x + plat.w / 2 &&
          prevBottom <= plat.y + 14 &&
          p.y + p.halfH >= plat.y
        ) {
          floorY = Math.min(floorY, plat.y);
          p.shadowY = plat.y;
        }
      }
    }

    if (p.y + p.halfH >= floorY) {
      p.y = floorY - p.halfH;
      p.vy = 0;
      p.onGround = true;

      // Ground Pound Floor Impact!
      if (p.groundPoundState === 'plunge') {
        p.groundPoundState = 'impact';
        p.groundPoundTimer = 0.14;
        p.squashX = 1.55;
        p.squashY = 0.55;
        this.addShake(16);
        this.audio?.playGroundPoundImpact();
        this.spawnShockwave(p.x, floorY, p.char.aura || '#facc15', 210, 10);
        this.spawnBurst(p.x, floorY, '#ffffff', 22, 380, 8);
        this.spawnFloatingText(p.x, p.y - 40, 'GROUND POUND!', p.char.aura || '#facc15', 24);

        // Shockwave Pops Nearby Balls Up into the air for aerial volleys!
        for (const b of this.balls) {
          if (Math.hypot(b.x - p.x, b.y - floorY) < 220) {
            b.vy = Math.min(b.vy, -1120);
            b.vx += (b.x - p.x) * 2.5;
            b.lastKicker = p;
            b.lastTeam = p.team;
            b.lastKickTime = this.time;
            b.lastWasMeteorSpike = false;
            this.spawnBurst(b.x, b.y, '#fde047', 10, 240, 6);
          }
        }

        // Shockwave Stumbles Nearby Opponents
        for (const foe of this.players) {
          if (foe !== p && foe.team !== p.team && foe.starTimer <= 0 && foe.invulnTimer <= 0 && foe.onGround &&
              !(foe.char.stats.phaseDash && foe.dashTimer > 0)) {
            if (Math.abs(foe.x - p.x) < 190) {
              foe.vy = -450;
              foe.vx += Math.sign(foe.x - p.x || p.facing) * 420;
              foe.onGround = false;
              foe.stunTimer = Math.max(foe.stunTimer, 0.45);
              this.spawnBurst(foe.x, foe.y, '#ef4444', 8, 200, 5);
            }
          }
        }
      } else if (prevVy > 450) {
        p.squashX = 1.18;
        p.squashY = 0.84;
        this.audio?.playLanding?.(this.arena.id, p.char.stats.weight);
      }

      // Kongor's Seismic Fast-Fall Slam!
      if (!wasOnGround && p.char.stats.seismicSlam && holdingDown && prevVy > 720) {
        this.addShake(13);
        this.audio?.playDrumBounce();
        this.spawnShockwave(p.x, floorY, '#fb923c', 210, 9);
        for (const b of this.balls) {
          if (Math.hypot(b.x - p.x, b.y - floorY) < 235) {
            b.vy = Math.min(b.vy, -720);
          }
        }
        for (const foe of this.players) {
          if (foe !== p && foe.team !== p.team && foe.onGround && Math.abs(foe.x - p.x) < 190) {
            foe.vy = -480;
            foe.onGround = false;
          }
        }
      }

      // Molten Turf Mutator bounce! (In Keep-Up mode, player wears magma boots so they can juggle freely!)
      if (
        this.hasMutator('floorIsLava') &&
        this.mode !== 'keep_up' &&
        floorY === ar.pitchFloorY &&
        p.x >= ar.pitchLeftX &&
        p.x <= ar.pitchRightX &&
        p.starTimer <= 0 &&
        p.lavaTickTimer <= 0
      ) {
        p.vy = -880;
        p.onGround = false;
        p.jumpsLeft = 1;
        p.lavaTickTimer = 0.35;
        p.stats.lavaTouches++;
        this.audio?.playItemUse('FireFlower');
        this.spawnBurst(p.x, floorY, '#f97316', 10, 280, 6);
        this.spawnFloatingText(p.x, p.y - 40, 'HOT TURF!', '#fb923c', 22);
      }
    }
  }

  // --- Sub-Stepped Ball Physics & Hazard Collisions ---
  _stepBall(b, dt, allowScoring) {
    if (b.freezeTimer > 0) {
      b.vx = 0;
      b.vy = 0;
      return -1;
    }

    const ar = this.arena;
    const isRugby = this.hasMutator('rugbyBall');
    const isIron = this.hasMutator('ironBall');
    const arenaGrav = (ar.gravityScale ?? 1.0) * (this.hasMutator('moonGravity') ? 0.58 : 1.0) * (isIron ? 1.6 : 1.0);
    const grav = b.zeroGTimer > 0 ? 0 : this.ballPreset.gravity * arenaGrav;
    const bounce = isIron ? 0.62 : Math.min(0.98, this.ballPreset.restitution * (ar.wallBounce / 0.84));

    // Wally's Whip-Curve S-flip & Spore's Rocket apex!
    if (b.hyperStyle === 'whip_curve' && Math.abs(b.x - VIRTUAL_WIDTH / 2) < 160 && b.spin < 0) {
      b.spin = 2.8;
    } else if (b.hyperStyle === 'spore_pop' && b.vy > -60) {
      b.hyperStyle = null;
      const dir = b.lastTeam === 1 ? -1 : 1;
      b.vx = dir * 1680;
      b.vy = 160;
      this.spawnShockwave(b.x, b.y, '#facc15', 180, 8);
    }

    // Magnus Spin Curve Force! (Amplified by curvedWorld mutator)
    if (Math.abs(b.spin || 0) > 0.05) {
      const spinScale = this.hasMutator('curvedWorld') ? 2.8 : 1.0;
      b.vy += b.spin * Math.min(1.2, Math.abs(b.vx) / 850) * 940 * spinScale * dt;
      b.spin *= Math.pow(0.5, dt);
    }

    b.vy += grav * dt;
    const drag = Math.pow(this.ballPreset.airDrag, dt * 60);
    b.vx *= drag;
    b.vy *= drag;

    const spd = Math.hypot(b.vx, b.vy);
    if (spd > 2350) {
      b.vx = (b.vx / spd) * 2350;
      b.vy = (b.vy / spd) * 2350;
    }

    const previousX = b.x;
    const previousBottom = b.y + b.radius;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.angle += b.angVel * dt;

    const r = b.radius;
    const upperLeftX = ar.goalLineLeftX + 52;
    const upperRightX = ar.goalLineRightX - 52;

    // Resolve the vertical risers before choosing the elevated goal floor.
    if (previousBottom > ar.goalFloorY + 6 && b.y > ar.goalFloorY) {
      if (previousX >= ar.pitchLeftX && b.x - r < ar.pitchLeftX) {
        b.x = ar.pitchLeftX + r;
        b.vx = Math.abs(b.vx) * bounce;
      } else if (previousX <= ar.pitchRightX && b.x + r > ar.pitchRightX) {
        b.x = ar.pitchRightX - r;
        b.vx = -Math.abs(b.vx) * bounce;
      }
    }

    for (const platform of ar.platforms) {
      if (b.vy > 0 && previousBottom <= platform.y + 1 && b.y + r >= platform.y &&
          b.x + r * 0.7 > platform.x - platform.w / 2 &&
          b.x - r * 0.7 < platform.x + platform.w / 2) {
        b.y = platform.y - r;
        b.vy = -b.vy * bounce;
        b.squashX = 1.15;
        b.squashY = 0.87;
        this.audio?.playBallBounce(Math.abs(b.vy));
      }
    }

    // 1. Top Ceiling (y = 18)
    if (b.y - r < 18) {
      b.y = 18 + r;
      if (b.vy < 0) {
        b.vy = -b.vy * bounce;
        this.audio?.playBallBounce(Math.abs(b.vy));
        // Shake loose a Glacier icicle on ceiling hit!
        if (this.icicles) {
          const idleIc = this.icicles.find((ic) => ic.active && ic.state === 'idle');
          if (idleIc) {
            idleIc.state = 'warn';
            idleIc.timer = 0.45;
            this.audio?.playHazardWarning?.('ice');
          }
        }
      }
    }

    // 2. Angled Corner Bevels
    this._collideSegment(b, upperLeftX + 95, 18, upperLeftX, 138, bounce);
    this._collideSegment(b, upperRightX - 95, 18, upperRightX, 138, bounce);

    // 3. Central Pitch Floor & Elevated Goal Floors
    if (b.x >= ar.pitchLeftX && b.x <= ar.pitchRightX) {
      if (b.y + r > ar.pitchFloorY) {
        // Keep-Up Survival check!
        if (this.mode === 'keep_up' && allowScoring) {
          if (this.survivalTime > 2.0) {
            this.spawnBurst(b.x, ar.pitchFloorY, '#f97316', 32, 560, 9);
            this.addShake(22);
            return -2;
          }
          b.y = ar.pitchFloorY - r;
          b.vy = -920;
        } else if (this.hasMutator('floorIsLava')) {
          b.y = ar.pitchFloorY - r;
          b.vy = -Math.max(760, Math.abs(b.vy) * 1.05);
          this.spawnBurst(b.x, ar.pitchFloorY, '#fb923c', 8, 240, 6);
        } else {
          b.y = ar.pitchFloorY - r;
          if (b.vy > 0) {
            this.audio?.playBallBounce(Math.abs(b.vy));
            b.vy = -b.vy * bounce;
            if (isRugby && Math.abs(b.vy) > 140) {
              const chaos = (Math.random() - 0.5) * 520;
              b.vx += chaos;
              b.angVel += (Math.random() - 0.5) * 18;
            } else {
              b.angVel = b.vx * 0.018;
            }
            if (Math.abs(b.vy) < 65) b.vy = 0;
            else {
              b.squashX = 1.16;
              b.squashY = 0.86;
            }
          }
        }
      }
    } else {
      if (b.y + r > ar.goalFloorY) {
        b.y = ar.goalFloorY - r;
        if (b.vy > 0) {
          this.audio?.playBallBounce(Math.abs(b.vy));
          b.vy = -b.vy * bounce;
          b.angVel = b.vx * 0.018;
          if (Math.abs(b.vy) < 65) b.vy = 0;
        }
      }
    }

    // 4. Sunken Pitch Risers
    if (b.y > ar.goalFloorY + 6) {
      if (b.x - r < ar.pitchLeftX && b.x > ar.pitchLeftX - 40) {
        b.x = ar.pitchLeftX + r;
        if (b.vx < 0) {
          b.vx = -b.vx * bounce;
          this.audio?.playBallBounce(Math.abs(b.vx));
        }
      }
      if (b.x + r > ar.pitchRightX && b.x < ar.pitchRightX + 40) {
        b.x = ar.pitchRightX - r;
        if (b.vx > 0) {
          b.vx = -b.vx * bounce;
          this.audio?.playBallBounce(Math.abs(b.vx));
        }
      }
    }
    this._collidePointPost(b, ar.pitchLeftX, ar.goalFloorY, 6, bounce, false);
    this._collidePointPost(b, ar.pitchRightX, ar.goalFloorY, 6, bounce, false);

    // 5. Upper Side Walls & Crossbars
    if (b.y < ar.goalCeilingY - 6) {
      if (b.x - r < upperLeftX) {
        b.x = upperLeftX + r;
        if (b.vx < 0) {
          b.vx = -b.vx * bounce;
          this.audio?.playBallBounce(Math.abs(b.vx));
        }
      }
      if (b.x + r > upperRightX) {
        b.x = upperRightX - r;
        if (b.vx > 0) {
          b.vx = -b.vx * bounce;
          this.audio?.playBallBounce(Math.abs(b.vx));
        }
      }
    }
    if ((b.x < upperLeftX - 4 || b.x > upperRightX + 4) && b.y - r < ar.goalCeilingY) {
      b.y = ar.goalCeilingY + r;
      if (b.vy < 0) b.vy = -b.vy * bounce;
    }
    this._collidePointPost(b, upperLeftX, ar.goalCeilingY, 10, bounce, true);
    this._collidePointPost(b, upperRightX, ar.goalCeilingY, 10, bounce, true);

    // 6. POW Shields / Minigame Goal Seals
    const sealLeft = this.powLeftTimer > 0 || this.mode === 'target_blitz' || this.mode === 'keep_up';
    const sealRight = this.powRightTimer > 0 || this.mode === 'keep_up' || this.mode === 'goalie_gauntlet';
    if (sealLeft && b.x - r < ar.goalLineLeftX + 12 && b.y >= ar.goalCeilingY && b.y <= ar.goalFloorY) {
      b.x = ar.goalLineLeftX + 12 + r;
      b.vx = Math.abs(b.vx) * 0.96 + 220;
      this.audio?.playBallBounce(800, true);
      this.spawnBurst(b.x - r, b.y, '#60a5fa', 10, 320, 6);
    }
    if (sealRight && b.x + r > ar.goalLineRightX - 12 && b.y >= ar.goalCeilingY && b.y <= ar.goalFloorY) {
      b.x = ar.goalLineRightX - 12 - r;
      b.vx = -Math.abs(b.vx) * 0.96 - 220;
      this.audio?.playBallBounce(800, true);
      this.spawnBurst(b.x + r, b.y, '#60a5fa', 10, 320, 6);
    }

    // 7. Backstops inside goals
    if (b.x - r < ar.goalBackLeftX) {
      b.x = ar.goalBackLeftX + r;
      b.vx = Math.abs(b.vx) * 0.5;
    }
    if (b.x + r > ar.goalBackRightX) {
      b.x = ar.goalBackRightX - r;
      b.vx = -Math.abs(b.vx) * 0.5;
    }

    // 8. Stage Hazard Interactions with Balls!
    this._stepBallHazards(b);

    // 9. Shroom GoalKeeper Collisions!
    for (const kp of this.keepers) {
      const dx = b.x - kp.x;
      const dy = b.y - kp.y;
      const minDist = r + 48;
      const d = Math.hypot(dx, dy);
      if (d < minDist && d > 0.001) {
        const nx = dx / d;
        const ny = dy / d;
        b.x = kp.x + nx * minDist;
        b.y = kp.y + ny * minDist;
        const outDir = kp.side === 'left' ? 1 : -1;
        b.vx = outDir * Math.max(780, Math.abs(b.vx) * 1.05);
        b.vy = -360 + ny * 320;
        b.lastWasMeteorSpike = false;
        kp.recoilTimer = 0.22;
        this.audio?.playBallKick(0.75, false);
        this.spawnBurst(kp.x + outDir * 30, kp.y, '#f472b6', 12, 340, 7);
        this.spawnFloatingText(kp.x, kp.y - 65, 'SAVED!', '#4ade80', 24);
      }
    }

    // 10. Body Dribble / Header / Captain Spore Cap-Bounce!
    for (const p of this.players) {
      const headBonus = p.bigHead ? 1.18 : 1.0;
      let cx = Math.max(p.x - p.halfW * 0.84, Math.min(p.x + p.halfW * 0.84, b.x));
      let cy = Math.max(p.y - p.halfH * 0.9 * headBonus, Math.min(p.y + p.halfH * 0.85, b.y));
      let dx = b.x - cx;
      let dy = b.y - cy;
      let dist = Math.hypot(dx, dy);
      if (dist < 0.0001) {
        const edges = [
          { distance: b.x - (p.x - p.halfW * 0.84), nx: -1, ny: 0 },
          { distance: p.x + p.halfW * 0.84 - b.x, nx: 1, ny: 0 },
          { distance: b.y - (p.y - p.halfH * 0.9 * headBonus), nx: 0, ny: -1 },
          { distance: p.y + p.halfH * 0.85 - b.y, nx: 0, ny: 1 },
        ];
        const edge = edges.reduce((closest, candidate) => candidate.distance < closest.distance ? candidate : closest);
        cx = b.x + edge.nx * edge.distance;
        cy = b.y + edge.ny * edge.distance;
        dx = edge.nx * 0.001;
        dy = edge.ny * 0.001;
        dist = 0.001;
      }

      if (dist < r && dist > 0.0001) {
        if (
          b.burnTimer > 0 &&
          p.fireImmuneTimer <= 0 &&
          p.invulnTimer <= 0 &&
          p.starTimer <= 0 &&
          p.kickTimer <= 0
        ) {
          p.stunTimer = 0.55;
          p.invulnTimer = 1.0;
          p.vx = -Math.sign(dx || p.facing) * 520;
          p.vy = -480;
          this.audio?.playItemUse('FireFlower');
          this.addShake(10);
          this.spawnBurst(p.x, p.y, '#f97316', 16, 380, 8);
          this.spawnFloatingText(p.x, p.y - 50, 'SCORCHED!', '#f97316', 24);
        }

        if (b.hyperVoltage && p.team !== b.lastTeam && p.starTimer <= 0 && p.invulnTimer <= 0) {
          p.stunTimer = 0.65;
          p.invulnTimer = 0.9;
          p.vy = -380;
          p.vx = Math.sign(b.vx || 1) * 540;
          this.audio?.playBrawlHit();
          this.addShake(14);
          this.spawnBurst(p.x, p.y, '#38bdf8', 16, 340, 7);
          this.spawnFloatingText(p.x, p.y - 40, 'VOLTAGE BLAST!', '#38bdf8', 26);
        }

        const nx = dx / dist;
        const ny = dy / dist;
        b.x = cx + nx * (r + 1);
        b.y = cy + ny * (r + 1);

        // Captain Spore's Trampoline Cap Trait!
        if (p.char.stats.capBounce && b.y < p.y - p.halfH * 0.35 && b.vy > -120) {
          b.vy = -1040;
          b.vx += p.facing * 240 + p.vx * 0.3;
          b.lastKicker = p;
          b.lastTeam = p.team;
          b.lastWasMeteorSpike = false;
          this.audio?.playDrumBounce();
          this.spawnBurst(b.x, b.y + r, '#fde047', 12, 300, 6);
          this.spawnFloatingText(p.x, p.y - 60, 'CAP BOING!', '#fde047', 22);
          continue;
        }

        const relVx = b.vx - p.vx;
        const relVy = b.vy - p.vy;
        const vn = relVx * nx + relVy * ny;
        if (vn < 0) {
          const bodyBounce = 0.58;
          b.vx -= (1 + bodyBounce) * vn * nx;
          b.vy -= (1 + bodyBounce) * vn * ny;
          b.vx += p.vx * 0.38;
          b.vy = Math.min(b.vy, this.mode === 'keep_up' ? -420 : -190) + p.vy * 0.25;
          b.lastKicker = p;
          b.lastTeam = p.team;
          b.lastWasMeteorSpike = false;
          if (this.mode === 'goalie_gauntlet' && !b.savedCounted && p.team === 0 && b.vx > 80) {
            b.savedCounted = true;
            this.gauntletSaves++;
            this.scores[0] = this.gauntletSaves;
            p.stats.saves++;
            this.spawnFloatingText(b.x, b.y - 42, `SAVE #${this.gauntletSaves}!`, '#4ade80', 26);
          }
          this.audio?.playBallBounce(Math.hypot(relVx, relVy) * 0.7);
        }
      }
    }

    // 11. Target Blitz Bullseyes!
    if (this.mode === 'target_blitz') {
      for (let tIdx = this.targets.length - 1; tIdx >= 0; tIdx--) {
        const tg = this.targets[tIdx];
        if (Math.hypot(b.x - tg.x, b.y - tg.y) < r + tg.radius) {
          this.targets.splice(tIdx, 1);
          this.targetCombo++;
          const pts = 100 * this.targetCombo;
          this.targetScore += pts;
          this.scores[0] = this.targetScore;
          this.audio?.playItemPickup();
          this.addShake(8);
          this.spawnBurst(tg.x, tg.y, '#facc15', 18, 420, 8);
          this.spawnFloatingText(tg.x, tg.y, `+${pts} (x${this.targetCombo})`, '#fde047', 28);
          this._spawnTargets(4);
        }
      }
    }

    // 12. Goal Line Detection!
    if (allowScoring) {
      if (!sealLeft && b.x + r * 0.15 < ar.goalLineLeftX && b.y > ar.goalCeilingY && b.y < ar.goalFloorY) {
        return 1;
      }
      if (!sealRight && b.x - r * 0.15 > ar.goalLineRightX && b.y > ar.goalCeilingY && b.y < ar.goalFloorY) {
        return 0;
      }
    }

    return -1;
  }

  _stepBallHazards(b) {
    // 1. Haunted Manor Warp Portals
    if (this.portals && b.portalCooldown <= 0) {
      for (let i = 0; i < 2; i++) {
        const src = this.portals[i];
        const dst = this.portals[1 - i];
        if (Math.hypot(b.x - src.x, b.y - src.y) < 54 + b.radius) {
          b.x = dst.x + (dst.side === 'left' ? 45 : -45);
          b.y = dst.y;
          const spd = Math.max(780, Math.hypot(b.vx, b.vy));
          b.vx = (dst.side === 'left' ? 1 : -1) * spd * 0.92;
          b.vy = 160;
          b.portalCooldown = 1.25;
          this.audio?.playPortalWarp();
          this.spawnBurst(src.x, src.y, '#2dd4bf', 14, 340, 7);
          this.spawnBurst(dst.x, dst.y, '#c084fc', 14, 340, 7);
          this.spawnFloatingText(dst.x, dst.y - 45, 'PORTAL WARP!', '#2dd4bf', 24);
          break;
        }
      }
    }

    // 2. Cosmic Observatory Accelerator Ring
    if (this.gravityRing && b.ringBoostCooldown <= 0) {
      const rg = this.gravityRing;
      if (Math.hypot(b.x - rg.x, b.y - rg.y) < rg.r) {
        b.ringBoostCooldown = 0.85;
        rg.flashTimer = 0.32;
        b.vx *= 1.36;
        b.vy *= 1.25;
        this.audio?.playComboPass();
        this.spawnShockwave(rg.x, rg.y, '#fde047', 165, 8);
        this.spawnFloatingText(rg.x, rg.y - 50, 'TURBO RING!', '#fde047', 24);
      }
    }

    // 3. Jungle Canopy Drum-Pads (ball bounce)
    if (this.drumPads) {
      for (const dp of this.drumPads) {
        if (Math.abs(b.x - dp.x) < dp.w * 0.55 + b.radius && b.y + b.radius >= dp.y - 18 && b.vy > 0) {
          b.y = dp.y - 18 - b.radius;
          b.vy = -1180;
          dp.bounceTimer = 0.35;
          this.audio?.playDrumBounce();
          this.spawnBurst(dp.x, dp.y - 14, '#fde047', 10, 260, 6);
        }
      }
    }

    // 4. Pinball Bumpers Mutator!
    for (const bm of this.bumpers) {
      const dx = b.x - bm.x;
      const dy = b.y - bm.y;
      const minD = b.radius + bm.r;
      const d = Math.hypot(dx, dy);
      if (d < minD && d > 0.001) {
        const nx = dx / d;
        const ny = dy / d;
        b.x = bm.x + nx * (minD + 2);
        b.y = bm.y + ny * (minD + 2);
        const launch = Math.max(980, Math.hypot(b.vx, b.vy) * 1.12);
        b.vx = nx * launch;
        b.vy = ny * launch;
        bm.flashTimer = 0.22;
        this.audio?.playBumperDing();
        this.spawnBurst(bm.x, bm.y, '#f472b6', 10, 320, 6);
      }
    }
  }

  _updateStageHazards(dt) {
    if (this.gravityRing && this.gravityRing.flashTimer > 0) {
      this.gravityRing.flashTimer = Math.max(0, this.gravityRing.flashTimer - dt);
    }
    for (const bm of this.bumpers) {
      if (bm.flashTimer > 0) bm.flashTimer = Math.max(0, bm.flashTimer - dt);
      for (const p of this.players) {
        const dx = p.x - bm.x;
        const dy = p.y - bm.y;
        const d = Math.hypot(dx, dy);
        if (d < bm.r + p.halfW && d > 0.001) {
          p.vx = (dx / d) * 720;
          p.vy = (dy / d) * 680 - 150;
          bm.flashTimer = 0.22;
          this.audio?.playBumperDing();
        }
      }
    }

    // Jungle Drum-Pads vs Players
    if (this.drumPads) {
      for (const dp of this.drumPads) {
        if (dp.bounceTimer > 0) dp.bounceTimer = Math.max(0, dp.bounceTimer - dt);
        for (const p of this.players) {
          if (Math.abs(p.x - dp.x) < dp.w * 0.55 + p.halfW * 0.6 && p.y + p.halfH >= dp.y - 20 && p.vy >= 0) {
            p.y = dp.y - 20 - p.halfH;
            p.vy = -1390;
            p.onGround = false;
            p.jumpsLeft = 1;
            dp.bounceTimer = 0.35;
            this.audio?.playDrumBounce();
            this.spawnBurst(dp.x, dp.y - 16, '#fef04a', 12, 300, 6);
          }
        }
      }
    }

    // Frostbite Glacier Icicles
    if (this.icicles) {
      for (const ic of this.icicles) {
        if (!ic.active) {
          ic.timer -= dt;
          if (ic.timer <= 0) {
            ic.active = true;
            ic.y = 20;
            ic.vy = 0;
            ic.state = 'idle';
            ic.timer = 5.5 + Math.random() * 4.0;
          }
          continue;
        }

        if (ic.state === 'idle') {
          ic.timer -= dt;
          if (ic.timer <= 0) {
            ic.state = 'warn';
            ic.timer = 1.1;
            this.audio?.playHazardWarning?.('ice');
          }
        } else if (ic.state === 'warn') {
          ic.timer -= dt;
          if (ic.timer <= 0) {
            ic.state = 'fall';
            ic.vy = 180;
          }
        } else if (ic.state === 'fall') {
          ic.vy += 1950 * dt;
          ic.y += ic.vy * dt;

          // Hit players
          for (const p of this.players) {
            if (p.invulnTimer > 0 || p.starTimer > 0 || (p.char.stats.phaseDash && p.dashTimer > 0)) continue;
            if (Math.abs(p.x - ic.x) < 24 + p.halfW && Math.abs(p.y - (ic.y + 32)) < 32 + p.halfH) {
              p.stunTimer = 0.6;
              p.invulnTimer = 1.1;
              ic.active = false;
              ic.timer = 5.0;
              this.audio?.playIcicleCrash();
              this.spawnBurst(ic.x, ic.y + 32, '#bae6fd', 16, 380, 7, 'rect');
              break;
            }
          }

          if (!ic.active) continue;
          // Hit balls
          for (const b of this.balls) {
            if (Math.hypot(b.x - ic.x, b.y - (ic.y + 32)) < 28 + b.radius) {
              b.vy = 620;
              b.vx += (b.x >= ic.x ? 1 : -1) * 420;
              b.lastWasMeteorSpike = false;
              ic.active = false;
              ic.timer = 5.0;
              this.audio?.playIcicleCrash();
              this.spawnBurst(ic.x, ic.y + 32, '#bae6fd', 16, 380, 7, 'rect');
              break;
            }
          }

          if (ic.active && ic.y + 64 >= this.arena.pitchFloorY) {
            ic.active = false;
            ic.timer = 5.0;
            this.audio?.playIcicleCrash();
            this.spawnBurst(ic.x, this.arena.pitchFloorY - 8, '#e0f2fe', 16, 360, 7, 'rect');
          }
        }
      }
    }

    // Magma Keep Lava Vents
    if (this.lavaVents) {
      const floorY = this.arena.pitchFloorY;
      for (const lv of this.lavaVents) {
        lv.timer -= dt;
        if (lv.state === 'idle' && lv.timer <= 0) {
          lv.state = 'warn';
          lv.timer = 1.3;
          this.audio?.playHazardWarning?.('lava');
        } else if (lv.state === 'warn' && lv.timer <= 0) {
          lv.state = 'erupt';
          lv.timer = 1.15;
          this.audio?.playItemUse('FireFlower');
          this.spawnBurst(lv.x, floorY - 12, '#f97316', 14, 380, 7);
        } else if (lv.state === 'erupt') {
          for (const b of this.balls) {
            if (Math.abs(b.x - lv.x) < 42 + b.radius && b.y > floorY - 235) {
              b.vy = -1080;
              b.burnTimer = 2.5;
            }
          }
          for (const p of this.players) {
            if (p.invulnTimer > 0 || p.starTimer > 0 || p.fireImmuneTimer > 0 ||
                (p.char.stats.phaseDash && p.dashTimer > 0)) continue;
            if (Math.abs(p.x - lv.x) < 34 + p.halfW && p.y + p.halfH > floorY - 220) {
              p.vy = -960;
              p.onGround = false;
              p.stunTimer = 0.4;
              p.invulnTimer = 1.0;
              this.spawnFloatingText(p.x, p.y - 40, 'LAVA PLUME!', '#f97316', 22);
            }
          }
          if (lv.timer <= 0) {
            lv.state = 'idle';
            lv.timer = 6.2 + Math.random() * 2.5;
          }
        }
      }
    }
  }

  _updateGauntletCannon(dt) {
    const cn = this.gauntletCannon;
    if (!cn) return;
    if (cn.recoilTimer > 0) cn.recoilTimer = Math.max(0, cn.recoilTimer - dt);
    cn.fireTimer -= dt;
    if (cn.fireTimer <= 0 && this.balls.length < 3) {
      const pace = Math.max(0.95, 2.25 - this.gauntletSaves * 0.055);
      cn.fireTimer = pace;
      cn.recoilTimer = 0.2;

      const r = this.ballPreset.radius;
      const speed = 980 + Math.min(680, this.gauntletSaves * 38) + Math.random() * 180;
      const aimY = this.arena.goalCeilingY + 55 + Math.random() * (this.arena.goalFloorY - this.arena.goalCeilingY - 110);
      const tFlight = (cn.x - this.arena.goalLineLeftX) / speed;
      const gravComp = 0.5 * this.ballPreset.gravity * this.arena.gravityScale * tFlight * tFlight;
      const dy = aimY - cn.y - gravComp;
      const dx = this.arena.goalLineLeftX - cn.x;
      const len = Math.hypot(dx, dy) || 1;
      cn.aimAngle = Math.atan2(dy, dx) + Math.PI;

      this._spawnCenterBall(0);
      const shot = this.balls[this.balls.length - 1];
      shot.x = cn.x - 56;
      shot.y = cn.y;
      shot.vx = (dx / len) * speed;
      shot.vy = (dy / len) * speed;
      shot.lastTeam = 1;
      shot.auraColor = '#ef4444';
      if (this.gauntletSaves >= 6 && Math.random() < 0.35) {
        shot.spin = (Math.random() - 0.5) * 2.6;
      }

      this.audio?.playBallKick(0.95, true);
      this.addShake(8);
      this.spawnBurst(cn.x - 56, cn.y, '#fbbf24', 14, 380, 7);
    }
  }

  _collidePointPost(b, px, py, postR, bounce, isCrossbar) {
    const dx = b.x - px;
    const dy = b.y - py;
    const minDist = b.radius + postR;
    const d = Math.hypot(dx, dy);
    if (d < minDist && d > 0.0001) {
      const nx = dx / d;
      const ny = dy / d;
      b.x = px + nx * minDist;
      b.y = py + ny * minDist;
      const vn = b.vx * nx + b.vy * ny;
      if (vn < 0) {
        b.vx -= (1 + bounce) * vn * nx;
        b.vy -= (1 + bounce) * vn * ny;
        const impact = Math.abs(vn);
        this.audio?.playBallBounce(impact, isCrossbar);
        if (isCrossbar && impact > 420) {
          this.addShake(8);
          this.spawnBurst(px, py, '#fde047', 10, 320, 6);
        }
      }
    }
  }

  _collideSegment(b, x1, y1, x2, y2, bounce) {
    const sx = x2 - x1;
    const sy = y2 - y1;
    const lenSq = sx * sx + sy * sy;
    let t = ((b.x - x1) * sx + (b.y - y1) * sy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    const cx = x1 + t * sx;
    const cy = y1 + t * sy;
    this._collidePointPost(b, cx, cy, 2, bounce, false);
  }

  _handleGoalScored(scoringTeam, ball) {
    if (this.mode === 'target_blitz') {
      this.targetCombo++;
      const bonus = 300 * this.targetCombo;
      this.targetScore += bonus;
      this.scores[0] = this.targetScore;
      this.netRippleRight = 1.0;
      this.audio?.playGoal();
      this.addShake(16);
      this.spawnBurst(ball.x, ball.y, '#4ade80', 30, 560, 9, 'rect');
      this.spawnFloatingText(ball.x - 90, ball.y, `GOAL BONUS +${bonus}!`, '#4ade80', 34);
      const idx = this.balls.indexOf(ball);
      if (idx !== -1) this.balls.splice(idx, 1);
      this._spawnCenterBall(-240);
      return;
    }

    if (this.mode === 'goalie_gauntlet') {
      // Opponent cannon scored into Left Goal!
      const idx = this.balls.indexOf(ball);
      if (idx !== -1) this.balls.splice(idx, 1);
      this.gauntletLives = Math.max(0, this.gauntletLives - 1);
      this.scores[1] = this.gauntletLives;
      this.netRippleLeft = 1.2;
      this.audio?.playBrawlHit();
      this.addShake(20);
      this.spawnBurst(ball.x, ball.y, '#ef4444', 28, 520, 9);
      this.spawnFloatingText(320, 520, `${this.gauntletLives} ♥ LEFT!`, '#f87171', 34);
      if (this.onGoal) this.onGoal(1, this.scores);
      if (this.gauntletLives <= 0) {
        this._finishMatch('GAUNTLET OVER!');
      }
      return;
    }

    if (this.trial?.specialRule === 'meteor_spikes' && scoringTeam === 0) {
      if (!ball.lastWasMeteorSpike || ball.lastKicker?.team !== 0) {
        this.triggerBanner('NO GOAL!', 'MUST SCORE WITH METEOR SPIKE!', '#ef4444', 1.8);
        this.audio?.playBrawlHit();
        this.addShake(12);
        this.phase = 'goal_celebration';
        this.phaseTimer = 1.4;
        const idx = this.balls.indexOf(ball);
        if (idx !== -1) this.balls.splice(idx, 1);
        return;
      }
    }

    this.scores[scoringTeam]++;
    // Comeback Hype boost for the team that conceded!
    this._addHype(1 - scoringTeam, 35);
    this._addHype(scoringTeam, 10);

    if (scoringTeam === 0) this.netRippleRight = 1.2;
    else this.netRippleLeft = 1.2;

    if (ball.lastKicker && ball.lastKicker.team === scoringTeam) {
      ball.lastKicker.stats.goals++;
      if (ball.lastWasMeteorSpike) ball.lastKicker.stats.meteorGoals++;
    } else if (ball.lastKicker) {
      ball.lastKicker.stats.ownGoals++;
    }

    // Custom Locker Room Goal Explosion Palette!
    const expSpec =
      GOAL_EXPLOSIONS.find((g) => g.id === this.settings.equippedGoalExplosion) || GOAL_EXPLOSIONS[0];
    const colors = expSpec.colors;
    const shape = expSpec.id === 'coin_shower' ? 'circle' : 'rect';
    for (let i = 0; i < 52; i++) {
      this.spawnBurst(ball.x, ball.y, colors[i % colors.length], 1, 760, 10, shape);
    }
    this.spawnShockwave(
      ball.x,
      ball.y,
      scoringTeam === 0 ? this.leftTeamColor : this.rightTeamColor,
      340,
      14
    );
    this.audio?.playGoal();
    this.addShake(24);

    if (this.suddenDeath && this.settings.suddenDeathMode === 'mayhem') {
      const idx = this.balls.indexOf(ball);
      if (idx !== -1) this.balls.splice(idx, 1);
      if (this.balls.length === 0) {
        this._spawnCenterBall((Math.random() - 0.5) * 600);
      }
      if (this.onGoal) this.onGoal(scoringTeam, this.scores);
      return;
    }

    if (this.isAttract) {
      this.balls = [];
      this._spawnCenterBall(0);
      return;
    }

    const scorer =
      ball.lastKicker && ball.lastKicker.team === scoringTeam
        ? ball.lastKicker
        : this.players.find((p) => p.team === scoringTeam);

    this.phase = 'goal_celebration';
    for (const player of this.players) {
      player.chargeTime = 0;
      player.kickTimer = 0;
      player.dashTimer = 0;
      player.parryWindowTimer = 0;
      player.groundPoundState = 'none';
      player.groundPoundTimer = 0;
    }
    this.phaseTimer = 2.15;
    if (this.settings.goalSlowMo && !this.settings.reducedMotion) {
      this.slowMoFactor = 0.28;
      this.slowMoTimer = 1.5;
      this.cameraZoom = 1.12;
      this.cameraFocusX = VIRTUAL_WIDTH / 2 + (scoringTeam === 0 ? 220 : -220);
      this.cameraFocusY = 590;
    }

    const idx = this.balls.indexOf(ball);
    if (idx !== -1) this.balls.splice(idx, 1);

    const ownGoal = ball.lastKicker && ball.lastKicker.team !== scoringTeam;
    this.triggerBanner(
      ownGoal ? 'OWN GOAL' : 'GOOOAL!!',
      ownGoal ? `${ball.lastKicker.char.name.toUpperCase()} DEFLECTS INTO THEIR OWN NET`
        : scorer ? `${scorer.char.name.toUpperCase()} SCORES!` : 'WHAT A STRIKE!',
      scorer ? scorer.char.primary : '#fde047',
      2.1
    );

    if (this.onGoal) this.onGoal(scoringTeam, this.scores);
  }

  // --- Sky-Cloud Courier & All 18 Power-Up Mechanics ---
  _updateCourier(dt) {
    if (!this.courier.active) return;
    this.courier.x = VIRTUAL_WIDTH / 2 + Math.sin(this.time * 0.65) * 430;
    this.courier.y = COURIER_LAYOUT.baseY + Math.sin(this.time * 1.3) * 46;
    this.courier.vx = Math.cos(this.time * 0.65) * 430 * 0.65;
    this.courier.vy = Math.cos(this.time * 1.3) * 46 * 1.3;
    this.courier.bubbleX = this.courier.x - this.courier.vx * 0.09 + Math.sin(this.time * 4.2) * 8;
    this.courier.bubbleY = this.courier.y + COURIER_LAYOUT.itemOffsetY;

    if (!this.courier.heldItemId) {
      this.courier.spawnTimer -= dt;
      if (this.courier.spawnTimer <= 0) {
        this.courier.heldItemId = this._pickRandomItem();
      }
    }
  }

  _pickRandomItem() {
    const pool = ITEMS.filter((it) => (this.settings.itemMode === 'competitive' ? it.competitive : true));
    const totalW = pool.reduce((sum, it) => sum + it.weight, 0);
    let roll = Math.random() * totalW;
    for (const it of pool) {
      roll -= it.weight;
      if (roll <= 0) return it.id;
    }
    return pool[0].id;
  }

  _activatePlayerItem(p) {
    const itemId = p.heldItem;
    p.heldItem = null;
    p.stats.itemsUsed++;
    const meta = ITEMS.find((i) => i.id === itemId);
    this.audio?.playItemUse(itemId);
    this.spawnFloatingText(
      p.x,
      p.y - 72,
      meta ? `${meta.name.toUpperCase()}!` : itemId,
      meta?.color || '#fde047',
      26
    );

    switch (itemId) {
      case 'RedMushroom':
        p.targetScale = (p.bossScale || 1.0) * 2.0;
        p.scaleTimer = 6.0;
        this.spawnShockwave(p.x, p.y, '#ef4444', 150, 7);
        break;

      case 'TinyMushroom':
        p.targetScale = 0.54;
        p.speedBuff = 1.36;
        p.jumpBuff = 1.24;
        p.scaleTimer = 6.0;
        this.spawnBurst(p.x, p.y, '#38bdf8', 14, 300, 6);
        break;

      case 'IceFlower':
        for (const b of this.balls) {
          b.freezeTimer = 3.0;
          b.burnTimer = 0;
          this.spawnShockwave(b.x, b.y, '#38bdf8', 130, 6);
          this.spawnBurst(b.x, b.y, '#bae6fd', 14, 280, 7, 'rect');
        }
        break;

      case 'FireFlower':
        p.fireImmuneTimer = 1.2;
        for (const b of this.balls) {
          b.burnTimer = 4.5;
          b.freezeTimer = 0;
          this.spawnShockwave(b.x, b.y, '#f97316', 140, 7);
          this.spawnBurst(b.x, b.y, '#facc15', 16, 340, 7);
        }
        break;

      case 'EnlargeBall':
        for (const b of this.balls) {
          b.targetScale = 1.82;
          b.scaleTimer = 6.0;
          this.spawnShockwave(b.x, b.y, '#eab308', 150, 7);
        }
        break;

      case 'GreenShell':
        this.shells.push({
          x: p.x + p.facing * 42,
          y: p.y + 10,
          vx: p.facing * 860,
          vy: 0,
          radius: 32,
          ownerTeam: p.team,
          timer: 7.0,
        });
        break;

      case 'BulletBill': {
        const dir = p.team === 0 ? 1 : -1;
        for (let i = 0; i < 6; i++) {
          this.torpedoes.push({
            x: dir === 1 ? -90 : VIRTUAL_WIDTH + 90,
            y: 180 + Math.random() * 720,
            vx: dir * (780 + Math.random() * 240),
            ownerTeam: p.team,
            warnTimer: 0.45 + i * 0.38,
          });
        }
        break;
      }

      case 'POW':
        if (p.team === 0) this.powLeftTimer = 4.5;
        else this.powRightTimer = 4.5;
        this.addShake(22);
        this.spawnShockwave(p.x, p.y, '#3b82f6', 420, 14);
        for (const other of this.players) {
          if (other.team !== p.team && other.onGround && other.starTimer <= 0) {
            other.vy = -780;
            other.onGround = false;
            other.stunTimer = 0.5;
          }
        }
        for (const b of this.balls) {
          b.vy -= 420;
        }
        break;

      case 'GoalKeeper': {
        const side = p.team === 0 ? 'left' : 'right';
        this.keepers = this.keepers.filter((k) => k.side !== side);
        this.keepers.push({
          side,
          x: side === 'left' ? this.arena.pitchLeftX - 38 : this.arena.pitchRightX + 38,
          y: this.arena.goalFloorY - 58,
          baseY: this.arena.goalFloorY - 58,
          color: p.char.primary,
          timer: 7.0,
          maxTimer: 7.0,
        });
        break;
      }

      case '1UP':
        if (this.trial || this.mode === 'practice') break;
        this.scores[p.team]++;
        p.stats.goals++;
        this.addShake(14);
        this.spawnShockwave(p.x, p.y, '#10b981', 260, 10);
        this.spawnBurst(p.x, p.y, '#fef08a', 26, 480, 8, 'rect');
        if (this.onGoal) this.onGoal(p.team, this.scores);
        if ((this.suddenDeath && this.settings.suddenDeathMode === 'golden') ||
            (this.settings.scoreLimit > 0 && this.scores[p.team] >= this.settings.scoreLimit)) {
          this._finishMatch();
        }
        break;

      // --- 8 NEW DELUXE POWER-UPS ---
      case 'SuperStar':
        p.starTimer = 5.2;
        p.invulnTimer = 5.2;
        p.speedBuff = 1.32;
        this.spawnShockwave(p.x, p.y, '#fde047', 190, 9);
        break;

      case 'ChainHound': {
        const ax = Math.max(
          this.arena.pitchLeftX + 190,
          Math.min(this.arena.pitchRightX - 190, VIRTUAL_WIDTH / 2 + (p.team === 0 ? 110 : -110))
        );
        const ay = this.arena.pitchFloorY - 6;
        this.hounds.push({
          anchorX: ax,
          anchorY: ay,
          x: ax,
          y: ay - 46,
          vx: (p.team === 0 ? 1 : -1) * 520,
          vy: -280,
          radius: 42,
          chainLen: 225,
          ownerTeam: p.team,
          lungeTimer: 0.7,
          timer: 7.5,
        });
        break;
      }

      case 'BananaBunch': {
        const dir = p.facing;
        for (let k = 0; k < 3; k++) {
          this.bananas.push({
            x: p.x + dir * 44,
            y: p.y - 10,
            vx: dir * (260 + k * 195),
            vy: -420 - k * 90,
            ownerTeam: p.team,
            timer: 11.0,
          });
        }
        break;
      }

      case 'MagnetGlove':
        p.magnetTimer = 4.0;
        this.spawnShockwave(p.x, p.y, '#e11d48', 175, 8);
        break;

      case 'ShadowClone': {
        const existingClones = this.players.filter((pl) => pl.isClone && pl.team === p.team);
        if (existingClones.length < 2) {
          const clone = this._createPlayer(
            {
              slot: this.cloneIdCounter++,
              team: p.team,
              tag: 'CLONE',
              teamColor: p.teamColor,
              charId: p.char.id,
              kitIdx: p.char.kitIdx || 0,
              isAI: true,
              isClone: true,
              cloneTimer: 7.5,
              role: 'striker',
              x: Math.max(this.arena.pitchLeftX + 60, Math.min(this.arena.pitchRightX - 60, p.x - p.facing * 75)),
              y: p.y - 10,
            },
            this.players.length
          );
          this.players.push(clone);
          this.spawnBurst(clone.x, clone.y, '#a855f7', 18, 340, 7);
        }
        break;
      }

      case 'ThunderZapper':
        this.addShake(20);
        for (const foe of this.players) {
          if (foe.team !== p.team && foe.starTimer <= 0) {
            foe.stunTimer = 0.58;
            foe.invulnTimer = 1.0;
            foe.targetScale = 0.58;
            foe.scaleTimer = 4.8;
            foe.vy = -380;
            p.stats.kos++;
            // Vertical lightning bolt particles!
            for (let ly = 40; ly < foe.y; ly += 55) {
              this.spawnBurst(foe.x + (Math.random() - 0.5) * 24, ly, '#fde047', 2, 120, 7);
            }
            this.spawnShockwave(foe.x, foe.y, '#fde047', 150, 8);
          }
        }
        break;

      case 'WarpPipe': {
        const foe = this.players.find((other) => other.team !== p.team && !other.isClone);
        if (foe) {
          const ox = p.x;
          const oy = p.y;
          p.x = foe.x;
          p.y = foe.y;
          foe.x = ox;
          foe.y = oy;
          this.spawnBurst(p.x, p.y, '#22c55e', 18, 360, 8);
          this.spawnBurst(foe.x, foe.y, '#22c55e', 18, 360, 8);
          this.spawnShockwave(p.x, p.y, '#4ade80', 140, 7);
        }
        break;
      }

      case 'TriBall': {
        const src = this.balls[0];
        if (src && this.balls.length < 7) {
          const baseSpd = Math.max(760, Math.hypot(src.vx, src.vy));
          const baseAng = p.team === 0 ? -0.26 : -Math.PI + 0.26;
          for (const dAng of [-0.28, 0.28]) {
            this._spawnCenterBall(0);
            const nb = this.balls[this.balls.length - 1];
            nb.x = src.x;
            nb.y = src.y;
            nb.vx = Math.cos(baseAng + dAng) * baseSpd;
            nb.vy = Math.sin(baseAng + dAng) * baseSpd;
            nb.lastKicker = p;
            nb.lastTeam = p.team;
            nb.auraColor = '#f43f5e';
          }
          this.spawnShockwave(src.x, src.y, '#f43f5e', 190, 9);
        }
        break;
      }
    }
  }

  _updateHounds(dt) {
    for (let i = this.hounds.length - 1; i >= 0; i--) {
      const hd = this.hounds[i];
      hd.timer -= dt;
      if (hd.timer <= 0) {
        this.spawnBurst(hd.x, hd.y, '#94a3b8', 14, 280, 6);
        this.hounds.splice(i, 1);
        continue;
      }

      hd.lungeTimer -= dt;
      if (hd.lungeTimer <= 0) {
        hd.lungeTimer = 0.85;
        const foe = this.players.find((p) => p.team !== hd.ownerTeam);
        const tx = foe ? foe.x : hd.anchorX + (hd.ownerTeam === 0 ? 180 : -180);
        const ty = foe ? foe.y : hd.anchorY - 80;
        const dx = tx - hd.x;
        const dy = ty - hd.y;
        const len = Math.hypot(dx, dy) || 1;
        hd.vx = (dx / len) * 920;
        hd.vy = (dy / len) * 780 - 220;
        this.audio?.playItemUse('ChainHound');
      }

      hd.vy += 1850 * dt;
      hd.x += hd.vx * dt;
      hd.y += hd.vy * dt;

      if (hd.y + hd.radius > this.arena.pitchFloorY) {
        hd.y = this.arena.pitchFloorY - hd.radius;
        hd.vy = -Math.abs(hd.vy) * 0.45;
      }

      // Tether constraint!
      const cdx = hd.x - hd.anchorX;
      const cdy = hd.y - hd.anchorY;
      const cDist = Math.hypot(cdx, cdy);
      if (cDist > hd.chainLen) {
        const nx = cdx / cDist;
        const ny = cdy / cDist;
        hd.x = hd.anchorX + nx * hd.chainLen;
        hd.y = hd.anchorY + ny * hd.chainLen;
        hd.vx *= -0.35;
        hd.vy *= -0.35;
      }

      for (const p of this.players) {
        if (p.team === hd.ownerTeam || p.invulnTimer > 0 || p.starTimer > 0) continue;
        if (p.char.stats.phaseDash && p.dashTimer > 0) continue;
        if (Math.hypot(p.x - hd.x, p.y - hd.y) < hd.radius + p.halfW) {
          p.stunTimer = 0.65;
          p.invulnTimer = 1.15;
          p.vx = Math.sign(p.x - hd.x || 1) * 680;
          p.vy = -520;
          this.audio?.playBrawlHit();
          this.addShake(12);
          this.spawnBurst(p.x, p.y, '#fde047', 14, 340, 7);
        }
      }

      for (const b of this.balls) {
        if (Math.hypot(b.x - hd.x, b.y - hd.y) < hd.radius + b.radius) {
          b.vx = (hd.ownerTeam === 0 ? 1 : -1) * 1050;
          b.vy = -480;
          b.lastWasMeteorSpike = false;
          this.audio?.playBallKick(0.7, false);
        }
      }
    }
  }

  _updateBananas(dt) {
    const ar = this.arena;
    for (let i = this.bananas.length - 1; i >= 0; i--) {
      const bn = this.bananas[i];
      bn.timer -= dt;
      if (bn.timer <= 0) {
        this.bananas.splice(i, 1);
        continue;
      }

      bn.vy += 2200 * dt;
      bn.x += bn.vx * dt;
      bn.y += bn.vy * dt;

      if (bn.y + 16 > ar.goalFloorY + 12) {
        if (bn.x - 16 < ar.pitchLeftX) { bn.x = ar.pitchLeftX + 16; bn.vx = Math.abs(bn.vx) * 0.35; }
        if (bn.x + 16 > ar.pitchRightX) { bn.x = ar.pitchRightX - 16; bn.vx = -Math.abs(bn.vx) * 0.35; }
      }
      const floorY = bn.x >= ar.pitchLeftX && bn.x <= ar.pitchRightX ? ar.pitchFloorY : ar.goalFloorY;
      if (bn.y + 16 >= floorY) {
        bn.y = floorY - 16;
        bn.vy = 0;
        bn.vx *= Math.pow(0.002, dt);
      }
      bn.x = Math.max(ar.goalBackLeftX + 24, Math.min(ar.goalBackRightX - 24, bn.x));

      for (const p of this.players) {
        if (p.team === bn.ownerTeam || p.invulnTimer > 0 || p.starTimer > 0) continue;
        if (p.char.stats.phaseDash && p.dashTimer > 0) continue;
        if (Math.hypot(p.x - bn.x, p.y + p.halfH * 0.5 - bn.y) < 34 + p.halfW * 0.7) {
          p.stunTimer = 0.62;
          p.invulnTimer = 1.1;
          p.vy = -480;
          p.spinAngle = 0.05;
          p.spinVel = 18;
          this.audio?.playBananaSlip();
          this.spawnBurst(bn.x, bn.y, '#fde047', 12, 280, 6);
          this.spawnFloatingText(p.x, p.y - 45, 'SLIPPED!', '#fde047', 24);
          this.bananas.splice(i, 1);
          break;
        }
      }
    }
  }

  _updateKeepers(dt) {
    for (let i = this.keepers.length - 1; i >= 0; i--) {
      const k = this.keepers[i];
      k.timer -= dt;
      k.recoilTimer = Math.max(0, (k.recoilTimer || 0) - dt);
      if (this.balls.length > 0) {
        const targetY = Math.max(
          this.arena.goalCeilingY + 75,
          Math.min(this.arena.goalFloorY - 58, this.balls[0].y)
        );
        k.y += (targetY - k.y) * Math.min(1, dt * 5);
      }
      if (k.timer <= 0) {
        this.spawnBurst(k.x, k.y, '#ffffff', 10, 220, 6);
        this.keepers.splice(i, 1);
      }
    }
  }

  _updateShells(dt) {
    const ar = this.arena;
    for (let i = this.shells.length - 1; i >= 0; i--) {
      const sh = this.shells[i];
      sh.timer -= dt;
      if (sh.timer <= 0) {
        this.shells.splice(i, 1);
        continue;
      }
      sh.vy += 2600 * dt;
      sh.x += sh.vx * dt;
      sh.y += sh.vy * dt;

      if (sh.y + sh.radius > ar.goalFloorY + 12) {
        if (sh.x - sh.radius < ar.pitchLeftX) { sh.x = ar.pitchLeftX + sh.radius; sh.vx = Math.abs(sh.vx); }
        if (sh.x + sh.radius > ar.pitchRightX) { sh.x = ar.pitchRightX - sh.radius; sh.vx = -Math.abs(sh.vx); }
      }
      const floorY = sh.x >= ar.pitchLeftX && sh.x <= ar.pitchRightX ? ar.pitchFloorY : ar.goalFloorY;
      if (sh.y + sh.radius > floorY) {
        sh.y = floorY - sh.radius;
        sh.vy = 0;
      }

      if (sh.y + sh.radius > ar.goalFloorY + 12) {
        if (sh.x - sh.radius < ar.pitchLeftX) {
          sh.x = ar.pitchLeftX + sh.radius;
          sh.vx = Math.abs(sh.vx);
          this.audio?.playBallBounce(600);
        }
        if (sh.x + sh.radius > ar.pitchRightX) {
          sh.x = ar.pitchRightX - sh.radius;
          sh.vx = -Math.abs(sh.vx);
          this.audio?.playBallBounce(600);
        }
      } else {
        if (sh.x - sh.radius < ar.goalBackLeftX) {
          sh.x = ar.goalBackLeftX + sh.radius;
          sh.vx = Math.abs(sh.vx);
        }
        if (sh.x + sh.radius > ar.goalBackRightX) {
          sh.x = ar.goalBackRightX - sh.radius;
          sh.vx = -Math.abs(sh.vx);
        }
      }

      for (const p of this.players) {
        if (p.team === sh.ownerTeam || p.invulnTimer > 0 || p.starTimer > 0) continue;
        if (p.char.stats.phaseDash && p.dashTimer > 0) continue;
        if (Math.hypot(p.x - sh.x, p.y - sh.y) < sh.radius + p.halfW) {
          p.stunTimer = 0.75;
          p.invulnTimer = 1.2;
          p.vx = Math.sign(sh.vx) * 620;
          p.vy = -560;
          this.audio?.playBrawlHit();
          this.addShake(11);
          this.spawnBurst(p.x, p.y, '#22c55e', 14, 340, 7);
        }
      }

      for (const b of this.balls) {
        if (Math.hypot(b.x - sh.x, b.y - sh.y) < sh.radius + b.radius) {
          b.vx = sh.vx * 1.15;
          b.vy = -520;
          b.lastWasMeteorSpike = false;
          this.audio?.playBallKick(0.6, false);
        }
      }
    }
  }

  _updateTorpedoes(dt) {
    for (let i = this.torpedoes.length - 1; i >= 0; i--) {
      const tp = this.torpedoes[i];
      if (tp.warnTimer > 0) {
        tp.warnTimer -= dt;
        if (tp.warnTimer <= 0) {
          this.audio?.playItemUse('BulletBill');
        }
        continue;
      }

      tp.x += tp.vx * dt;
      if (tp.x < -160 || tp.x > VIRTUAL_WIDTH + 160) {
        this.torpedoes.splice(i, 1);
        continue;
      }

      for (const p of this.players) {
        if (p.team === tp.ownerTeam || p.invulnTimer > 0 || p.starTimer > 0) continue;
        if (p.char.stats.phaseDash && p.dashTimer > 0) continue;
        if (Math.hypot(p.x - tp.x, p.y - tp.y) < 42 + p.halfW) {
          p.stunTimer = 0.7;
          p.invulnTimer = 1.15;
          p.vx = Math.sign(tp.vx) * 680;
          p.vy = -520;
          this.audio?.playBrawlHit();
          this.addShake(13);
          this.spawnBurst(tp.x, tp.y, '#f97316', 18, 420, 8);
          this.torpedoes.splice(i, 1);
          break;
        }
      }
    }
  }

  _updateTargets(dt) {
    for (const tg of this.targets) {
      tg.y = tg.baseY + Math.sin(this.time * tg.speed + tg.phase) * 75;
    }
  }

  _updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life -= dt;
      if (pt.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      pt.vy += (pt.gravity || 0) * dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      if (pt.rotVel) pt.rot += pt.rotVel * dt;
    }

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += (sw.maxRadius - sw.radius) * Math.min(1, dt * 10);
      sw.alpha -= dt * 2.4;
      if (sw.alpha <= 0) this.shockwaves.splice(i, 1);
    }
  }

  _evaluateTrialSuccess(winnerTeam) {
    if (!this.trial) return false;
    if (winnerTeam !== 0) return false;
    const p1 = this.players.find((p) => p.team === 0 && !p.isClone);
    if (!p1) return false;

    if (this.trial.specialRule === 'meteor_spikes') {
      return p1.stats.meteorGoals >= this.trial.targetScore && this.scores[0] >= this.trial.targetScore;
    }
    if (this.trial.specialRule === 'wall_jumps') {
      return (p1.stats.wallJumps || 0) >= (this.trial.requiredWallJumps || 3);
    }
    if (this.trial.specialRule === 'parry_shutout') {
      return this.scores[1] === 0 && (p1.stats.parries || 0) >= (this.trial.requiredParries || 3);
    }
    if (this.trial.specialRule === 'no_lava') return p1.stats.lavaTouches === 0;
    return true;
  }

  getSummary() {
    let winnerTeam = -1;
    if (this.scores[0] > this.scores[1]) winnerTeam = 0;
    else if (this.scores[1] > this.scores[0]) winnerTeam = 1;

    return {
      mode: this.mode,
      settings: { ...this.settings, activeMutators: [...(this.settings.activeMutators || [])] },
      trial: this.trial,
      trialSuccess: this._evaluateTrialSuccess(winnerTeam),
      scores: [...this.scores],
      winnerTeam,
      suddenDeath: this.suddenDeath,
      targetScore: this.targetScore,
      survivalTime: Number(this.survivalTime.toFixed(1)),
      gauntletSaves: this.gauntletSaves,
      players: this.players
        .filter((p) => !p.isClone)
        .map((p) => ({
          tag: p.tag,
          team: p.team,
          isAI: p.isAI,
          char: p.char,
          stats: { ...p.stats },
        })),
    };
  }
}
