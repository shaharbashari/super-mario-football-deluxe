// Super Kick Kingdom 2.0 (Deluxe Edition) — Predictive Kung-Foot AI Controller
// Supports 4 difficulty tiers, 2v2 roles, Holo-Clones, Hyper-Strikes, Stage Hazards & all 18 Items

import { AI_DIFFICULTIES, VIRTUAL_WIDTH } from './config.js';

export class AIController {
  constructor() {
    this.memory = new Map();
  }

  computeInput(player, match, dt) {
    const diffKey = player.aiDifficulty || match.settings.aiDifficulty;
    const diff = AI_DIFFICULTIES[diffKey] || AI_DIFFICULTIES.striker;
    let mem = this.memory.get(player.slot);
    if (!mem) {
      mem = {
        timer: 0,
        targetX: player.x,
        wantJump: false,
        wantKick: false,
        wantLob: false,
        wantDown: false,
        wantDash: false,
        wantItem: false,
        chargingTimer: 0,
        releaseChargeAt: 0,
      };
      this.memory.set(player.slot, mem);
    }

    const out = {
      left: false,
      right: false,
      up: false,
      down: false,
      jumpPressed: false,
      jumpReleased: false,
      kickDown: false,
      kickPressed: false,
      kickReleased: false,
      lobDown: false,
      lobPressed: false,
      itemPressed: false,
      dashPressed: false,
    };

    if (match.phase !== 'playing' || match.balls.length === 0) {
      return out;
    }

    const attackDir = player.team === 0 ? 1 : -1;
    if (mem.chargingTimer > 0) {
      mem.chargingTimer += dt;
      if (attackDir === 1) {
        out.right = true;
        out.left = false;
      } else {
        out.left = true;
        out.right = false;
      }
      if (mem.chargingTimer >= mem.releaseChargeAt) {
        out.kickReleased = true;
        mem.chargingTimer = 0;
      } else {
        out.kickDown = true;
      }
    }

    mem.timer -= dt;
    if (mem.timer <= 0) {
      mem.timer = diff.reactionDelay * (0.75 + Math.random() * 0.5);
      this._planAction(player, match, diff, mem);
    }

    const dx = mem.targetX - player.x;
    const deadzone = 22;
    if (dx < -deadzone) out.left = true;
    else if (dx > deadzone) out.right = true;

    if (mem.wantJump) {
      out.jumpPressed = true;
      out.up = true;
      mem.wantJump = false;
    } else if (!player.onGround && player.vy < -150) {
      out.up = true;
    }

    if (mem.wantDown) {
      out.down = true;
      out.downPressed = true;
    }

    if (mem.wantDash) {
      out.dashPressed = true;
      mem.wantDash = false;
    }

    if (mem.wantItem) {
      out.itemPressed = true;
      mem.wantItem = false;
    }

    const hyperAvailable =
      match.settings.hyperStrikes !== false && match.hype && match.hype[player.team] >= 100;

    if (mem.wantLob && !hyperAvailable) {
      out.lobPressed = true;
      out.lobDown = true;
      mem.wantLob = false;
    } else if ((mem.wantKick || (mem.wantLob && hyperAvailable)) && mem.chargingTimer === 0) {
      mem.wantKick = false;
      mem.wantLob = false;
      if (attackDir === 1) {
        out.right = true;
        out.left = false;
      } else {
        out.left = true;
        out.right = false;
      }
      if ((hyperAvailable || Math.random() < diff.useCharge) && player.stunTimer <= 0) {
        out.kickPressed = true;
        out.kickDown = true;
        mem.chargingTimer = 0.001;
        mem.releaseChargeAt = hyperAvailable ? 0.24 : 0.22 + Math.random() * 0.24;
      } else {
        out.kickPressed = true;
        out.kickDown = true;
        mem.chargingTimer = 0.05;
        mem.releaseChargeAt = 0.04;
      }
    }

    return out;
  }

  _planAction(player, match, diff, mem) {
    const arena = match.arena;
    const attackDir = player.team === 0 ? 1 : -1;
    const defendGoalX = player.team === 0 ? arena.goalLineLeftX + 70 : arena.goalLineRightX - 70;

    let bestBall = match.balls[0];
    let bestUrgency = -Infinity;
    for (const b of match.balls) {
      const distOwnGoal = Math.abs(b.x - defendGoalX);
      const movingTowardOwn = (player.team === 0 && b.vx < -120) || (player.team === 1 && b.vx > 120);
      const score = -distOwnGoal + (movingTowardOwn ? 480 : 0) - Math.hypot(b.x - player.x, b.y - player.y) * 0.4;
      if (score > bestUrgency) {
        bestUrgency = score;
        bestBall = b;
      }
    }

    const lookAhead = 0.22;
    let predX = bestBall.x + bestBall.vx * lookAhead;
    let predY = bestBall.y + bestBall.vy * lookAhead + 0.5 * 1100 * lookAhead * lookAhead;
    predX = Math.max(arena.goalLineLeftX + 40, Math.min(arena.goalLineRightX - 40, predX));
    predY = Math.max(120, Math.min(arena.pitchFloorY - 30, predY));

    const isDefenderRole = player.role === 'defender';
    const ballThreateningGoal =
      (player.team === 0 && predX < 620 && bestBall.vx < 80) ||
      (player.team === 1 && predX > VIRTUAL_WIDTH - 620 && bestBall.vx > -80);

    // Smart Item Usage across all 18 Power-Ups!
    mem.wantItem = false;
    if (player.heldItem && Math.random() < diff.itemSmartness) {
      const it = player.heldItem;
      if (
        [
          '1UP',
          'RedMushroom',
          'TinyMushroom',
          'EnlargeBall',
          'BulletBill',
          'SuperStar',
          'ChainHound',
          'ShadowClone',
          'ThunderZapper',
          'TriBall',
          'BananaBunch',
        ].includes(it)
      ) {
        mem.wantItem = true;
      } else if ((it === 'GoalKeeper' || it === 'POW' || it === 'WarpPipe') && ballThreateningGoal) {
        mem.wantItem = true;
      } else if (it === 'GreenShell' && Math.abs(bestBall.y - player.y) < 180) {
        mem.wantItem = true;
      } else if (
        (it === 'IceFlower' || it === 'FireFlower' || it === 'MagnetGlove') &&
        Math.hypot(bestBall.x - player.x, bestBall.y - player.y) < 380
      ) {
        mem.wantItem = true;
      }
    }

    // Grab floating Cloud Courier item!
    const courier = match.courier;
    if (
      !player.heldItem &&
      !player.isClone &&
      courier.active &&
      courier.heldItemId &&
      !ballThreateningGoal &&
      Math.abs(courier.x - player.x) < 340 &&
      Math.random() < diff.aggression
    ) {
      mem.targetX = courier.x;
      const bubbleY = courier.bubbleY ?? courier.y + 94;
      mem.targetX = courier.bubbleX ?? courier.x;
      if (Math.abs(mem.targetX - player.x) < 120 && player.y > bubbleY + 30) {
        if (player.onGround || (player.jumpsLeft > 0 && player.vy > -180)) {
          mem.wantJump = true;
        }
      }
      return;
    }

    const idealOffset = -attackDir * (64 + (Math.random() - 0.5) * 40 * diff.aimJitter);
    if (isDefenderRole && ((player.team === 0 && predX > 1050) || (player.team === 1 && predX < 870))) {
      mem.targetX = player.team === 0 ? 430 : VIRTUAL_WIDTH - 430;
    } else if (ballThreateningGoal) {
      mem.targetX = player.team === 0 ? Math.min(predX - 45, 360) : Math.max(predX + 45, VIRTUAL_WIDTH - 360);
    } else {
      mem.targetX = predX + idealOffset;
    }

    // Hop over opponent banana peels!
    if (match.bananas && player.onGround && diff.itemSmartness > 0.6) {
      for (const bn of match.bananas) {
        if (bn.ownerTeam !== player.team && Math.abs(bn.x - player.x) < 85) {
          mem.wantJump = true;
          break;
        }
      }
    }

    const needClimbLeft =
      mem.targetX < arena.pitchLeftX + 30 && player.x > arena.pitchLeftX - 20 && player.y > arena.goalFloorY + 20;
    const needClimbRight =
      mem.targetX > arena.pitchRightX - 30 && player.x < arena.pitchRightX + 20 && player.y > arena.goalFloorY + 20;

    if ((needClimbLeft || needClimbRight) && player.onGround) {
      mem.wantJump = true;
    }

    const horizDist = Math.abs(predX - player.x);
    if (predY < player.y - 85 && horizDist < 230) {
      if (player.onGround || (player.jumpsLeft > 0 && player.vy > -120)) {
        mem.wantJump = true;
      }
    }

    mem.wantDown = !player.onGround && bestBall.y > player.y + 110 && horizDist < 220;

    if (horizDist > 260 && ballThreateningGoal && Math.random() < diff.useDash) {
      mem.wantDash = true;
    }

    const reachBonus = player.char.stats.reachMult || 1.0;
    const realDist = Math.hypot(bestBall.x - player.x, bestBall.y - player.y);
    const ballInFront = (bestBall.x - player.x) * attackDir > -28;

    if (realDist < 130 * reachBonus * player.visualScale && bestBall.burnTimer <= 0) {
      if (!ballInFront && Math.abs(bestBall.x - player.x) > 25) {
        mem.wantLob = true;
      } else if (!player.onGround && bestBall.y > player.y + 15 && Math.random() < diff.useSpike) {
        mem.wantDown = true;
        mem.wantKick = true;
      } else if (
        player.y > arena.goalFloorY + 40 &&
        ((attackDir === 1 && player.x > arena.pitchRightX - 260) ||
          (attackDir === -1 && player.x < arena.pitchLeftX + 260))
      ) {
        mem.wantLob = true;
      } else {
        mem.wantKick = true;
      }
    }
  }
}
