// Canvas renderer with bounded frame caches, shared animation timing and readable hazard cues.

import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT, CHARACTERS, ITEMS, BALL_SKINS, FIELD_CHARACTER_DRAW_SIZE, COURIER_LAYOUT } from './config.js';
import { characterFrame, itemMotion } from './animation.js';

const INK = '#151020';

const ITEM_INDEX_MAP = Object.fromEntries(ITEMS.map((it, idx) => [it.id, idx]));

// Visible-art bounds in each 256px source cell; transparent padding is not icon size.
export const ITEM_SPRITE_BOUNDS = {
  RedMushroom: [46, 62, 219, 230],
  TinyMushroom: [84, 98, 181, 193],
  IceFlower: [49, 62, 210, 230],
  FireFlower: [46, 62, 208, 230],
  EnlargeBall: [31, 59, 217, 230],
  GreenShell: [36, 72, 214, 222],
  BulletBill: [41, 87, 224, 207],
  POW: [51, 68, 213, 230],
  GoalKeeper: [44, 61, 216, 230],
  '1UP': [39, 62, 214, 230],
  SuperStar: [39, 61, 210, 228],
  ChainHound: [41, 61, 203, 230],
  BananaBunch: [47, 63, 219, 227],
  MagnetGlove: [54, 59, 210, 230],
  ShadowClone: [44, 63, 216, 226],
  ThunderZapper: [70, 57, 184, 230],
  WarpPipe: [47, 63, 204, 226],
  TriBall: [38, 59, 209, 230],
};

const BALL_SKIN_CELL_MAP = {
  classic: 0,
  gold_star: 1,
  watermelon: 2,
  iron_spike: 3,
  beach_orb: 4,
  cosmic_nebula: 5,
  rugby: 6,
  bumper: 7,
};

// Pixel-calibrated standing scale & foot-sole anchor inside each 256x256 character sprite cell
// Ensures every character's cleats kiss y = +52 (pitchFloorY) with zero floating or sinking!
export const CHAR_SPRITE_METRICS = {
  mario: { drawSize: 164, footY: 0.968, airShiftY: 4 },
  luigi: { drawSize: 182, footY: 0.968, airShiftY: 4 },
  peach: { drawSize: 174, footY: 0.968, airShiftY: 4 },
  yoshi: { drawSize: 164, footY: 0.968, airShiftY: 4 },
  wario: { drawSize: 184, footY: 0.968, airShiftY: 4 },
  bowser: { drawSize: 228, footY: 0.968, airShiftY: 2 },
  waluigi: { drawSize: 210, footY: 0.968, airShiftY: 4 },
  toad: { drawSize: 138, footY: 0.968, airShiftY: 3 },
  donkey_kong: { drawSize: 220, footY: 0.968, airShiftY: 2 },
  rosalina: { drawSize: 202, footY: 0.968, airShiftY: 3 },
  king_boo: { drawSize: 184, footY: 0.880, airShiftY: 0 },
  bowser_jr: { drawSize: 144, footY: 0.968, airShiftY: 3 },
};

// Curated GPU CSS-Filter recipes for Kit 1 & Kit 2 across all 12 strikers (preserves crisp ink & cel shading!)
const KIT_FILTER_SPECS = {
  'mario:1': { filter: 'hue-rotate(-12deg) saturate(1.15) brightness(1.18) contrast(1.06)', glaze: '#ffffff', glazeAlpha: 0.16 },
  'mario:2': { filter: 'hue-rotate(46deg) saturate(1.38) brightness(1.08)', glaze: '#fde047', glazeAlpha: 0.1 },
  'luigi:1': { filter: 'hue-rotate(44deg) saturate(1.18) brightness(1.10)', glaze: '#2dd4bf', glazeAlpha: 0.1 },
  'luigi:2': { filter: 'hue-rotate(-84deg) saturate(1.38) brightness(1.10)', glaze: '#fde047', glazeAlpha: 0.1 },
  'peach:1': { filter: 'hue-rotate(195deg) saturate(0.76) brightness(1.18)', glaze: '#f8fafc', glazeAlpha: 0.16 },
  'peach:2': { filter: 'hue-rotate(38deg) saturate(1.32) brightness(1.06)', glaze: '#fb923c', glazeAlpha: 0.1 },
  'yoshi:1': { filter: 'hue-rotate(108deg) saturate(1.24) brightness(1.05)', glaze: '#38bdf8', glazeAlpha: 0.08 },
  'yoshi:2': { filter: 'hue-rotate(246deg) saturate(1.26) brightness(1.06)', glaze: '#f472b6', glazeAlpha: 0.08 },
  'wario:1': { filter: 'hue-rotate(-52deg) saturate(1.28) brightness(0.98)', glaze: '#ef4444', glazeAlpha: 0.08 },
  'wario:2': { filter: 'hue-rotate(78deg) saturate(1.18) brightness(1.04)', glaze: '#4ade80', glazeAlpha: 0.08 },
  'bowser:1': { filter: 'hue-rotate(195deg) saturate(1.18) brightness(0.95) contrast(1.08)', glaze: '#6366f1', glazeAlpha: 0.12 },
  'bowser:2': { filter: 'saturate(0.30) brightness(1.24) contrast(1.12)', glaze: '#e2e8f0', glazeAlpha: 0.14 },
  'waluigi:1': { filter: 'hue-rotate(-78deg) saturate(1.28) brightness(1.06)', glaze: '#0284c7', glazeAlpha: 0.1 },
  'waluigi:2': { filter: 'hue-rotate(74deg) saturate(1.32) brightness(1.04)', glaze: '#be123c', glazeAlpha: 0.1 },
  'toad:1': { filter: 'hue-rotate(314deg) saturate(1.28) brightness(1.05)', glaze: '#ec4899', glazeAlpha: 0.1 },
  'toad:2': { filter: 'hue-rotate(46deg) saturate(1.32) brightness(1.08)', glaze: '#eab308', glazeAlpha: 0.1 },
  'donkey_kong:1': { filter: 'hue-rotate(185deg) saturate(0.55) brightness(1.32) contrast(1.08)', glaze: '#bae6fd', glazeAlpha: 0.14 },
  'donkey_kong:2': { filter: 'hue-rotate(28deg) saturate(1.55) brightness(1.20)', glaze: '#facc15', glazeAlpha: 0.12 },
  'rosalina:1': { filter: 'hue-rotate(98deg) saturate(1.28) brightness(1.02)', glaze: '#a855f7', glazeAlpha: 0.1 },
  'rosalina:2': { filter: 'hue-rotate(195deg) saturate(1.28) brightness(0.92) contrast(1.14)', glaze: '#f59e0b', glazeAlpha: 0.1 },
  'king_boo:1': { filter: 'sepia(0.55) hue-rotate(88deg) saturate(2.2) brightness(1.02)', glaze: '#34d399', glazeAlpha: 0.14 },
  'king_boo:2': { filter: 'sepia(0.55) hue-rotate(305deg) saturate(2.2) brightness(1.0)', glaze: '#fb7185', glazeAlpha: 0.14 },
  'bowser_jr:1': { filter: 'hue-rotate(165deg) saturate(1.32) brightness(1.05)', glaze: '#38bdf8', glazeAlpha: 0.1 },
  'bowser_jr:2': { filter: 'hue-rotate(-32deg) saturate(0.62) brightness(1.20) contrast(1.08)', glaze: '#fef08a', glazeAlpha: 0.12 },
};

export class ArtRenderer {
  constructor() {
    this.images = {};
    this.sprites = {};
    this._frameCache = new Map();
    this._charUse = new Map();
    this._terrainCache = {};
    this.requested = new Set();
    this.pendingAssets = 0;
    this.failedAssets = [];
    this.reducedMotion = false;
    this._loadImages();
  }

  _loadImages() {
    if (typeof Image === 'undefined') return;

    const bgKeys = [
      'title_bg',
      'arena_meadow',
      'arena_sky',
      'arena_castle',
      'arena_manor',
      'arena_jungle',
      'arena_glacier',
      'arena_cosmos',
    ];
    for (const k of bgKeys) {
      this._requestImage(k, `./assets/images/${k}.jpg`, this.images);
    }

    const spriteKeys = [
      ...CHARACTERS.map((c) => `portrait_${c.id}`),
      'props_atlas',
      'balls_atlas',
      'items_atlas',
    ];
    for (const sk of spriteKeys) {
      this._requestImage(sk, `./assets/sprites/${sk}.png`, this.sprites);
    }
  }

  _requestImage(key, url, target) {
    if (typeof Image === 'undefined' || this.requested.has(key)) return;
    this.requested.add(key);
    this.pendingAssets++;
    const image = new Image();
    image.decoding = 'async';
    const finish = () => {
      this.pendingAssets--;
      this.onAssetStatus?.(this.pendingAssets, [...this.failedAssets]);
      if (this.pendingAssets === 0) this.onAssetsReady?.();
    };
    image.onload = () => {
      if (!key.startsWith('char_') || this._charUse.has(key)) target[key] = image;
      else this.requested.delete(key);
      finish();
    };
    image.onerror = () => {
      this.failedAssets.push(key);
      console.error(`Game asset failed to load: ${url}`);
      finish();
    };
    image.src = url;
    this.onAssetStatus?.(this.pendingAssets, [...this.failedAssets]);
  }

  _makeOffscreen(w, h) {
    if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      if (ctx) return { canvas: c, ctx };
    }
    return null;
  }

  // Keep only the recently used character sheets; derived frames have a separate budget.
  _getCharSheet(ch) {
    const key = `char_${ch.id}`;
    this._charUse.delete(key);
    this._charUse.set(key, true);
    if (this._charUse.size > 6) {
      const oldest = this._charUse.keys().next().value;
      this._charUse.delete(oldest);
      if (this.sprites[oldest]) this.requested.delete(oldest);
      delete this.sprites[oldest];
    }
    const base = this.sprites[key];
    if (!base) {
      this._requestImage(key, `./assets/sprites/${key}.png`, this.sprites);
      return null;
    }
    return base;
  }

  _drawCharFrame(ctx, ch, col, row, x, y, width, height, color = null) {
    const sheet = this._getCharSheet(ch);
    if (!sheet) return;
    const cellW = (sheet.naturalWidth || sheet.width) / 24;
    const cellH = (sheet.naturalHeight || sheet.height) / 6;
    const kit = ch.kitIdx || 0;
    if (!kit && !color) {
      ctx.drawImage(sheet, col * cellW, row * cellH, cellW, cellH, x, y, width, height);
      return;
    }
    const key = `${ch.id}:${color || kit}:${row}:${col}`;
    let frame = this._frameCache.get(key);
    if (frame) {
      this._frameCache.delete(key);
      this._frameCache.set(key, frame);
    } else {
      const off = this._makeOffscreen(cellW, cellH);
      if (!off) {
        ctx.drawImage(sheet, col * cellW, row * cellH, cellW, cellH, x, y, width, height);
        return;
      }
      const spec = KIT_FILTER_SPECS[`${ch.id}:${kit}`];
      if (!color && spec && 'filter' in off.ctx) off.ctx.filter = spec.filter;
      off.ctx.drawImage(sheet, col * cellW, row * cellH, cellW, cellH, 0, 0, cellW, cellH);
      off.ctx.filter = 'none';
      if (color || spec?.glaze) {
        off.ctx.globalCompositeOperation = color ? 'source-in' : 'source-atop';
        off.ctx.globalAlpha = color ? 1 : spec.glazeAlpha;
        off.ctx.fillStyle = color || spec.glaze;
        off.ctx.fillRect(0, 0, cellW, cellH);
      }
      frame = off.canvas;
      this._frameCache.set(key, frame);
      if (this._frameCache.size > 192) {
        const [oldKey, oldFrame] = this._frameCache.entries().next().value;
        this._frameCache.delete(oldKey);
        oldFrame.width = 0;
        oldFrame.height = 0;
      }
    }
    ctx.drawImage(frame, x, y, width, height);
  }

  // --- Helper Drawing Primitives ---
  roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  _drawStarShape(ctx, cx, cy, spikes, outerR, innerR) {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
      rot += step;
    }
    ctx.closePath();
  }

  // Public helper for UI cards / Locker / Roster portraits!
  drawCharacterPortrait(ctx, charObj, cx, cy, size) {
    const portrait = this.sprites[`portrait_${charObj.id}`];
    const sheet = this._getCharSheet(charObj);
    ctx.save();
    if (portrait || sheet) {
      // Clip circular/rounded portrait bust
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
      ctx.clip();

      const bg = ctx.createRadialGradient(cx, cy - size * 0.1, size * 0.05, cx, cy, size * 0.52);
      bg.addColorStop(0, '#ffffff');
      bg.addColorStop(0.45, charObj.aura || charObj.primary);
      bg.addColorStop(1, '#0f172a');
      ctx.fillStyle = bg;
      ctx.fillRect(cx - size * 0.52, cy - size * 0.52, size * 1.04, size * 1.04);

      if (portrait) {
        ctx.drawImage(portrait, cx - size * 0.5, cy - size * 0.5, size, size);
      } else {
        this._drawCharFrame(ctx, charObj, 0, 0, cx - size * 0.52, cy - size * 0.48, size * 1.04, size * 0.96);
      }
    } else {
      ctx.fillStyle = charObj.primary;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.48, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // =========================================================================
  // 1. VOLUMETRIC STADIUM BACKGROUND & ATMOSPHERIC BIOME MOTES
  // =========================================================================
  drawArenaBackground(ctx, arena, time) {
    const img = this.images[arena.bgKey];
    if (img) {
      const breatheX = Math.sin(time * 0.35) * 9;
      const breatheY = Math.cos(time * 0.27) * 4;
      ctx.drawImage(img, -20 + breatheX, -14 + breatheY, VIRTUAL_WIDTH + 40, VIRTUAL_HEIGHT + 28);

      // Cinematic depth atmospheric wash
      const wash = ctx.createLinearGradient(0, 0, 0, VIRTUAL_HEIGHT);
      wash.addColorStop(0, 'rgba(10, 15, 34, 0.18)');
      wash.addColorStop(0.52, 'rgba(255, 255, 255, 0.03)');
      wash.addColorStop(1, 'rgba(8, 12, 26, 0.32)');
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, VIRTUAL_HEIGHT);
      grad.addColorStop(0, arena.skyTop);
      grad.addColorStop(1, arena.skyBottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    }

    // Sweeping Volumetric Stadium Spotlight Beams!
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const beamTint =
      arena.id === 'castle'
        ? '251, 146, 60'
        : arena.id === 'manor'
        ? '167, 139, 250'
        : arena.id === 'glacier'
        ? '186, 230, 253'
        : arena.id === 'cosmos'
        ? '56, 189, 248'
        : '254, 249, 195';

    for (const side of [-1, 1]) {
      const originX = side === -1 ? 250 : VIRTUAL_WIDTH - 250;
      const sway = Math.sin(time * 0.55 + (side === 1 ? 1.4 : 0)) * 120;
      const targetX = VIRTUAL_WIDTH * 0.5 + side * -180 + sway;
      const beamGrad = ctx.createLinearGradient(originX, 0, targetX, VIRTUAL_HEIGHT * 0.92);
      beamGrad.addColorStop(0, `rgba(${beamTint}, 0.16)`);
      beamGrad.addColorStop(0.55, `rgba(${beamTint}, 0.06)`);
      beamGrad.addColorStop(1, `rgba(${beamTint}, 0)`);

      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(originX - 75, -10);
      ctx.lineTo(originX + 75, -10);
      ctx.lineTo(targetX + 290, VIRTUAL_HEIGHT);
      ctx.lineTo(targetX - 290, VIRTUAL_HEIGHT);
      ctx.closePath();
      ctx.fill();
    }

    // Deterministic Zero-Alloc Ambient Biome Particles (Embers, Snow, Pollen, Spores, Star-Dust)
    const count = 18;
    for (let i = 0; i < count; i++) {
      const seed = (i * 137.5) % 1;
      const speedY = arena.id === 'castle' || arena.id === 'manor' ? -36 - (i % 5) * 9 : 24 + (i % 4) * 8;
      const rawY = (((i * 67 + time * speedY) % 980) + 980) % 980;
      const px = ((i * 119 + Math.sin(time * 0.9 + i) * 38) % (VIRTUAL_WIDTH - 160)) + 80;
      const alpha = 0.25 + 0.35 * Math.sin(time * 2.4 + i * 1.3);
      const rad = 2.2 + (i % 3) * 1.4 + seed;

      ctx.fillStyle =
        arena.id === 'castle'
          ? `rgba(251, 146, 60, ${alpha + 0.2})`
          : arena.id === 'glacier'
          ? `rgba(240, 249, 255, ${alpha + 0.2})`
          : arena.id === 'manor'
          ? `rgba(192, 132, 252, ${alpha})`
          : arena.id === 'jungle'
          ? `rgba(190, 242, 100, ${alpha})`
          : `rgba(254, 240, 138, ${alpha * 0.85})`;
      ctx.beginPath();
      ctx.arc(px, rawY, rad, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // =========================================================================
  // 2. PRE-BAKED 2.5D STADIUM ARCHITECTURE, TURF, REFLECTIONS & 3D GOALPOSTS
  // =========================================================================
  _getBakedArenaTerrain(arena) {
    if (this._terrainCache[arena.id]) return this._terrainCache[arena.id];
    const off = this._makeOffscreen(VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    if (!off) return null;

    this._renderStaticArenaArchitecture(off.ctx, arena);
    this._terrainCache[arena.id] = off.canvas;
    if (Object.keys(this._terrainCache).length > 3) {
      const oldest = Object.keys(this._terrainCache)[0];
      this._terrainCache[oldest].width = 0;
      delete this._terrainCache[oldest];
    }
    return off.canvas;
  }

  _renderStaticArenaArchitecture(ctx, arena) {
    const {
      pitchFloorY,
      pitchLeftX,
      pitchRightX,
      goalFloorY,
      goalCeilingY,
      goalBackLeftX,
      goalBackRightX,
      goalLineLeftX,
      goalLineRightX,
      platforms,
    } = arena;

    ctx.save();

    // 1. Floating Sky/Ruins Pass-Through Platforms with 2.5D Bevel & Drop Shadow
    for (const p of platforms) {
      const px = p.x - p.w / 2;
      const py = p.y;
      ctx.fillStyle = 'rgba(8, 12, 24, 0.36)';
      this.roundRect(ctx, px + 6, py + 10, p.w, p.h + 10, 14);
      ctx.fill();

      const platGrad = ctx.createLinearGradient(px, py, px, py + p.h + 10);
      platGrad.addColorStop(0, arena.earthColor);
      platGrad.addColorStop(1, arena.earthDark);
      ctx.fillStyle = platGrad;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5.5;
      this.roundRect(ctx, px, py + 2, p.w, p.h + 8, 13);
      ctx.fill();
      ctx.stroke();

      // Masonry / Rivet detail on platform underside
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      for (let bx = px + 22; bx < px + p.w - 30; bx += 46) {
        this.roundRect(ctx, bx, py + 11, 26, 8, 4);
        ctx.fill();
      }

      // Lush Top Turf Cap
      ctx.fillStyle = arena.turfColor;
      this.roundRect(ctx, px - 6, py - 5, p.w + 12, 15, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = arena.turfHighlight;
      this.roundRect(ctx, px + 4, py - 2, p.w - 8, 5, 3);
      ctx.fill();
    }

    // 2. Upper Solid Side Stadium Walls & Angled Ricochet Corner Bevels
    this._drawUpperWallBlock(ctx, arena, 0, 0, goalLineLeftX + 52, goalCeilingY, 'left');
    this._drawUpperWallBlock(
      ctx,
      arena,
      goalLineRightX - 52,
      0,
      VIRTUAL_WIDTH - (goalLineRightX - 52),
      goalCeilingY,
      'right'
    );

    // Overhead Stadium Gantry / Ceiling Trim Bar with Rivets & Lights
    const ceilGrad = ctx.createLinearGradient(0, 0, 0, 22);
    ceilGrad.addColorStop(0, '#0f172a');
    ceilGrad.addColorStop(1, arena.earthDark);
    ctx.fillStyle = ceilGrad;
    ctx.fillRect(goalLineLeftX, 0, goalLineRightX - goalLineLeftX, 20);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(goalLineLeftX, 20);
    ctx.lineTo(goalLineRightX, 20);
    ctx.stroke();

    for (let lx = goalLineLeftX + 110; lx < goalLineRightX - 80; lx += 180) {
      ctx.fillStyle = arena.trimColor;
      this.roundRect(ctx, lx - 18, 4, 36, 9, 4);
      ctx.fill();
    }

    // 3. Recessed Goal Cavity Ambient Backdrops (behind nets)
    for (const [gx1, gx2] of [
      [goalBackLeftX, goalLineLeftX],
      [goalLineRightX, goalBackRightX],
    ]) {
      const cavGrad = ctx.createLinearGradient(0, goalCeilingY, 0, goalFloorY);
      cavGrad.addColorStop(0, 'rgba(8, 11, 24, 0.62)');
      cavGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.36)');
      cavGrad.addColorStop(1, 'rgba(8, 11, 24, 0.58)');
      ctx.fillStyle = cavGrad;
      ctx.fillRect(gx1, goalCeilingY, gx2 - gx1, goalFloorY - goalCeilingY);
    }

    // 4. Sunken Central Pitch & Elevated Side Goal Ledges — Textured 2.5D Strata!
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-12, VIRTUAL_HEIGHT + 12);
    ctx.lineTo(-12, goalCeilingY - 10);
    ctx.lineTo(goalBackLeftX, goalCeilingY - 10);
    ctx.lineTo(goalBackLeftX, goalFloorY);
    ctx.lineTo(pitchLeftX, goalFloorY);
    ctx.lineTo(pitchLeftX, pitchFloorY);
    ctx.lineTo(pitchRightX, pitchFloorY);
    ctx.lineTo(pitchRightX, goalFloorY);
    ctx.lineTo(goalBackRightX, goalFloorY);
    ctx.lineTo(goalBackRightX, goalCeilingY - 10);
    ctx.lineTo(VIRTUAL_WIDTH + 12, goalCeilingY - 10);
    ctx.lineTo(VIRTUAL_WIDTH + 12, VIRTUAL_HEIGHT + 12);
    ctx.closePath();

    const earthGrad = ctx.createLinearGradient(0, goalFloorY, 0, VIRTUAL_HEIGHT);
    earthGrad.addColorStop(0, arena.earthColor);
    earthGrad.addColorStop(0.55, arena.earthDark);
    earthGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = earthGrad;
    ctx.fill();

    ctx.save();
    ctx.clip();

    // Rich Carved Masonry / Biome Sub-Strata Pattern inside clipped earth!
    const brickRows = [
      { y: goalFloorY + 28, h: 46 },
      { y: goalFloorY + 84, h: 48 },
      { y: goalFloorY + 142, h: 50 },
      { y: pitchFloorY + 30, h: 42 },
      { y: pitchFloorY + 80, h: 46 },
    ];
    brickRows.forEach((row, rIdx) => {
      const stagger = (rIdx % 2) * 58;
      for (let bx = -40 + stagger; bx < VIRTUAL_WIDTH + 40; bx += 116) {
        ctx.fillStyle = rIdx % 2 === 0 ? 'rgba(0, 0, 0, 0.22)' : 'rgba(255, 255, 255, 0.06)';
        this.roundRect(ctx, bx, row.y, 104, row.h, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Glowing Magma cracks in Castle / Ice facets in Glacier / Gold inlays in Cosmos
        if (arena.id === 'castle' && (bx + rIdx * 31) % 3 === 0) {
          ctx.strokeStyle = 'rgba(249, 115, 22, 0.48)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(bx + 14, row.y + row.h - 6);
          ctx.lineTo(bx + 48, row.y + 12);
          ctx.lineTo(bx + 86, row.y + 24);
          ctx.stroke();
        } else if (arena.id === 'glacier') {
          ctx.fillStyle = 'rgba(224, 242, 254, 0.14)';
          ctx.beginPath();
          ctx.moveTo(bx + 10, row.y + 6);
          ctx.lineTo(bx + 54, row.y + 6);
          ctx.lineTo(bx + 28, row.y + row.h - 8);
          ctx.closePath();
          ctx.fill();
        } else if (arena.id === 'cosmos' && (bx + rIdx) % 2 === 0) {
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.28)';
          ctx.lineWidth = 2;
          this.roundRect(ctx, bx + 8, row.y + 8, 88, row.h - 16, 8);
          ctx.stroke();
        }
      }
    });

    // Chiseled Vertical Step-Riser Trim Pillars at pitchLeftX & pitchRightX!
    ctx.fillStyle = arena.trimColor;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    this.roundRect(ctx, pitchLeftX - 24, goalFloorY + 14, 24, pitchFloorY - goalFloorY - 12, 8);
    ctx.fill();
    ctx.stroke();
    this.roundRect(ctx, pitchRightX, goalFloorY + 14, 24, pitchFloorY - goalFloorY - 12, 8);
    ctx.fill();
    ctx.stroke();

    // Soft Top-Lip Ambient Occlusion Shadow right beneath turf overhangs
    const lipShadow = ctx.createLinearGradient(0, pitchFloorY + 14, 0, pitchFloorY + 46);
    lipShadow.addColorStop(0, 'rgba(0, 0, 0, 0.52)');
    lipShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = lipShadow;
    ctx.fillRect(pitchLeftX - 10, pitchFloorY + 14, pitchRightX - pitchLeftX + 20, 34);

    ctx.restore(); // end earth clip

    // Crisp Outer Contour of Stadium Bowl
    ctx.strokeStyle = INK;
    ctx.lineWidth = 6.5;
    ctx.stroke();
    ctx.restore();

    // Goal Ledge Turf Strips (Left & Right Recessed Goal Floors)
    this._drawStaticTurfDeck(ctx, arena, goalBackLeftX - 4, goalFloorY - 9, pitchLeftX - goalBackLeftX + 14, 28, false);
    this._drawStaticTurfDeck(ctx, arena, pitchRightX - 10, goalFloorY - 9, goalBackRightX - pitchRightX + 14, 28, false);

    ctx.restore();
  }

  _drawUpperWallBlock(ctx, arena, x, y, w, h, side) {
    ctx.save();
    const wallGrad = ctx.createLinearGradient(x, y, x, y + h);
    wallGrad.addColorStop(0, '#0f172a');
    wallGrad.addColorStop(0.35, arena.earthDark);
    wallGrad.addColorStop(1, arena.earthColor);

    ctx.fillStyle = wallGrad;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 6.5;

    const bevel = 95;
    ctx.beginPath();
    if (side === 'left') {
      ctx.moveTo(x - 10, y - 10);
      ctx.lineTo(x + w + bevel, y - 10);
      ctx.lineTo(x + w, y + bevel + 20);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x - 10, y + h);
    } else {
      ctx.moveTo(x - bevel, y - 10);
      ctx.lineTo(x + w + 10, y - 10);
      ctx.lineTo(x + w + 10, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y + bevel + 20);
    }
    ctx.closePath();
    ctx.fill();

    // Clipped masonry blocks & angled ricochet bumper trim!
    ctx.save();
    ctx.clip();
    for (let by = 24; by < h - 36; by += 52) {
      const offX = ((by / 52) % 2) * 44;
      for (let bx = x - 20 + offX; bx < x + w + bevel; bx += 96) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        this.roundRect(ctx, bx, by, 82, 38, 9);
        ctx.fill();
      }
    }
    // Glowing angled corner bounce-bumper stripe!
    ctx.strokeStyle = arena.trimColor;
    ctx.lineWidth = 10;
    ctx.beginPath();
    if (side === 'left') {
      ctx.moveTo(x + w + bevel - 6, y - 4);
      ctx.lineTo(x + w - 4, y + bevel + 18);
    } else {
      ctx.moveTo(x - bevel + 6, y - 4);
      ctx.lineTo(x + 4, y + bevel + 18);
    }
    ctx.stroke();
    ctx.restore();

    ctx.stroke(); // Crisp ink border

    // Goal Crossbar Overhang Cap
    const capGrad = ctx.createLinearGradient(0, y + h - 24, 0, y + h);
    capGrad.addColorStop(0, arena.trimColor);
    capGrad.addColorStop(1, arena.earthColor);
    ctx.fillStyle = capGrad;
    if (side === 'left') {
      this.roundRect(ctx, x - 4, y + h - 24, w + 8, 24, 9);
    } else {
      this.roundRect(ctx, x - 4, y + h - 24, w + 8, 24, 9);
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  _drawStaticTurfDeck(ctx, arena, x, y, w, h, withMowedStripes = true) {
    ctx.save();
    this.roundRect(ctx, x, y, w, h, 12);
    ctx.fillStyle = arena.turfColor;
    ctx.fill();

    ctx.save();
    ctx.clip();
    // Alternating Mowed Stadium Turf Stripes!
    if (withMowedStripes) {
      const stripeW = 92;
      for (let sx = x; sx < x + w; sx += stripeW * 2) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.13)';
        ctx.fillRect(sx, y, stripeW, h);
      }
    }
    // Bright top rim bevel + rich bottom turf shadow
    ctx.fillStyle = arena.turfHighlight;
    ctx.fillRect(x, y, w, 7);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.20)';
    ctx.fillRect(x, y + h - 7, w, 7);
    ctx.restore();

    ctx.strokeStyle = INK;
    ctx.lineWidth = 5.5;
    this.roundRect(ctx, x, y, w, h, 12);
    ctx.stroke();
    ctx.restore();
  }

  drawArenaForeground(ctx, arena, matchState, time) {
    const {
      pitchFloorY,
      pitchLeftX,
      pitchRightX,
      goalFloorY,
      goalCeilingY,
      goalBackLeftX,
      goalBackRightX,
      goalLineLeftX,
      goalLineRightX,
    } = arena;

    // 1. Stamp Cached 2.5D Stadium Architecture (or render directly in headless Node)
    const baked = this._getBakedArenaTerrain(arena);
    if (baked) {
      ctx.drawImage(baked, 0, 0);
    } else {
      this._renderStaticArenaArchitecture(ctx, arena);
    }

    ctx.save();

    // 2. Central Pitch Surface (Dynamic for Molten Lava Mutator vs Mowed Biome Turf!)
    const isMolten =
      matchState.mode === 'keep_up' ||
      (matchState.settings?.activeMutators && matchState.settings.activeMutators.includes('floorIsLava'));

    const deckX = pitchLeftX - 6;
    const deckY = pitchFloorY - 9;
    const deckW = pitchRightX - pitchLeftX + 12;
    const deckH = 30;

    if (isMolten) {
      ctx.save();
      const mGrad = ctx.createLinearGradient(deckX, deckY, deckX, deckY + deckH);
      mGrad.addColorStop(0, '#fef08a');
      mGrad.addColorStop(0.42, '#f97316');
      mGrad.addColorStop(1, '#b91c1c');
      ctx.fillStyle = mGrad;
      this.roundRect(ctx, deckX, deckY, deckW, deckH, 12);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5.5;
      ctx.stroke();

      // Animated bubbling lava blisters & heat glow!
      ctx.fillStyle = '#fef9c3';
      for (let i = 0; i < 11; i++) {
        const bx = deckX + 55 + i * ((deckW - 110) / 10) + Math.sin(time * 2 + i) * 8;
        const r = 4.5 + Math.max(0, Math.sin(time * 6.5 + i * 1.7)) * 6.5;
        ctx.beginPath();
        ctx.arc(bx, deckY + 8, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else {
      this._drawStaticTurfDeck(ctx, arena, deckX, deckY, deckW, deckH, true);

      // Planar Floor Reflections on Slick / Polished Stadiums (Glacier Ice, Manor Marble, Cosmos Starlight, Skyway)!
      const reflectAlpha =
        arena.id === 'glacier'
          ? 0.28
          : arena.id === 'manor'
          ? 0.20
          : arena.id === 'cosmos'
          ? 0.22
          : arena.id === 'sky'
          ? 0.14
          : 0;

      if (reflectAlpha > 0 && matchState.players) {
        ctx.save();
        this.roundRect(ctx, deckX + 4, deckY + 2, deckW - 8, deckH + 54, 10);
        ctx.clip();
        ctx.globalAlpha = reflectAlpha;

        for (const pl of matchState.players) {
          if (pl.x < pitchLeftX || pl.x > pitchRightX) continue;
          const dist = Math.max(0, pitchFloorY - (pl.y + pl.halfH));
          if (dist > 260) continue;
          const fade = 1 - dist / 260;
          const sheet = this._getCharSheet(pl.char);
          if (sheet) {
            ctx.save();
            ctx.globalAlpha = reflectAlpha * fade;
            ctx.translate(pl.x, pitchFloorY + 4 + dist * 0.22);
            ctx.scale(pl.facing * (pl.visualScale || 1) * pl.char.stats.size, -0.45 * (pl.visualScale || 1) * pl.char.stats.size);
            const { col, row } = this._selectCharFrameCoords(pl, time);
            const footY = CHAR_SPRITE_METRICS[pl.char.id].footY;
            this._drawCharFrame(ctx, pl.char, col, row, -FIELD_CHARACTER_DRAW_SIZE / 2,
              -FIELD_CHARACTER_DRAW_SIZE * footY, FIELD_CHARACTER_DRAW_SIZE, FIELD_CHARACTER_DRAW_SIZE);
            ctx.restore();
          }
        }
        if (matchState.balls) {
          for (const b of matchState.balls) {
            const dist = Math.max(0, pitchFloorY - (b.y + b.radius));
            if (dist > 280) continue;
            ctx.save();
            ctx.globalAlpha = reflectAlpha * (1 - dist / 280);
            ctx.fillStyle = b.burnTimer > 0 ? '#fb923c' : '#ffffff';
            ctx.beginPath();
            ctx.ellipse(b.x, pitchFloorY + 8 + dist * 0.18, b.radius * 0.85, b.radius * 0.42, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
        ctx.restore();
      }

      // Glacier Specular Diagonal Ice Shimmer
      if (arena.id === 'glacier') {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.44)';
        const drift = (time * 32) % 160;
        for (let sx = deckX + 30 + drift; sx < deckX + deckW - 50; sx += 160) {
          ctx.beginPath();
          ctx.moveTo(sx, deckY + 3);
          ctx.lineTo(sx + 36, deckY + 3);
          ctx.lineTo(sx + 16, deckY + deckH - 4);
          ctx.lineTo(sx - 20, deckY + deckH - 4);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // Swaying Grass Blades on Meadow & Jungle!
      if (arena.id === 'meadow' || arena.id === 'jungle') {
        ctx.save();
        ctx.fillStyle = arena.turfHighlight;
        const wind = Math.sin(time * 3.2) * 4.5;
        for (let gx = deckX + 28; gx < deckX + deckW - 28; gx += 48) {
          const tip = wind + Math.sin(gx * 0.05 + time * 4) * 2.5;
          ctx.beginPath();
          ctx.moveTo(gx - 4, deckY + 3);
          ctx.lineTo(gx + tip, deckY - 9);
          ctx.lineTo(gx + 4, deckY + 3);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // Crisp Perspective Stadium Chalk Markings (Midfield Circle, Touchlines & Penalty Boxes)
      const midX = VIRTUAL_WIDTH / 2;
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.68)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(midX, pitchFloorY + 6, 94, 12, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Penalty box chalk ticks near left & right step risers
      ctx.beginPath();
      ctx.moveTo(pitchLeftX + 145, pitchFloorY - 7);
      ctx.lineTo(pitchLeftX + 165, pitchFloorY + 18);
      ctx.moveTo(pitchRightX - 145, pitchFloorY - 7);
      ctx.lineTo(pitchRightX - 165, pitchFloorY + 18);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(midX, pitchFloorY + 6, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. 3D Brushed Metallic Goalposts & Billowing Diamond-Mesh Goal Nets!
    this._drawGoalNet(
      ctx,
      'left',
      goalBackLeftX,
      goalLineLeftX,
      goalCeilingY,
      goalFloorY,
      matchState.leftTeamColor,
      matchState.netRippleLeft,
      matchState.powLeftTimer,
      time
    );
    this._drawGoalNet(
      ctx,
      'right',
      goalLineRightX,
      goalBackRightX,
      goalCeilingY,
      goalFloorY,
      matchState.rightTeamColor,
      matchState.netRippleRight,
      matchState.powRightTimer,
      time
    );

    // 4. Glassmorphic Holographic In-Step Item Pedestals (supports 4 players in 2v2)
    const team0Players = matchState.players.filter((p) => p.team === 0 && !p.isClone);
    const team1Players = matchState.players.filter((p) => p.team === 1 && !p.isClone);

    if (team0Players[0]) {
      this._drawStepItemSlot(ctx, 175, 895, team0Players[0], team0Players[0].tag || 'P1', time);
    }
    if (team0Players[1]) {
      this._drawStepItemSlot(ctx, 295, 895, team0Players[1], team0Players[1].tag || 'P3', time);
    }

    if (team1Players[0]) {
      this._drawStepItemSlot(ctx, 1745, 895, team1Players[0], team1Players[0].tag || 'P2', time);
    }
    if (team1Players[1]) {
      this._drawStepItemSlot(ctx, 1625, 895, team1Players[1], team1Players[1].tag || 'P4', time);
    }

    ctx.restore();
  }

  _drawGoalNet(ctx, side, x1, x2, topY, botY, teamColor, ripple, powTimer, time) {
    ctx.save();
    const w = x2 - x1;
    const h = botY - topY;
    const frontX = side === 'left' ? x2 : x1;
    const backX = side === 'left' ? x1 : x2;

    // Team-tinted volumetric net cavity glow
    const grad = ctx.createLinearGradient(frontX, 0, backX, 0);
    grad.addColorStop(0, `${teamColor}22`);
    grad.addColorStop(1, `${teamColor}85`);
    ctx.fillStyle = grad;
    ctx.fillRect(x1, topY, w, h);

    // Recessed Back Stanchion Support Pipe
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(backX + (side === 'left' ? 6 : -6), topY + 6);
    ctx.lineTo(backX + (side === 'left' ? 6 : -6), botY - 4);
    ctx.stroke();

    // Billowing Diamond-Weave Stadium Net Cords!
    const amp = ripple * 22 * Math.sin(time * 30) + Math.sin(time * 2.2) * 1.5;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x1, topY, w, h);
    ctx.clip();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.62)';
    ctx.lineWidth = 2.4;
    const spacing = 34;
    for (let d = -h; d < w + h; d += spacing) {
      // Diagonal '/' cord
      ctx.beginPath();
      ctx.moveTo(x1 + d, topY);
      ctx.quadraticCurveTo(x1 + d + h * 0.22 + amp, topY + h * 0.5, x1 + d + h * 0.44, botY);
      ctx.stroke();

      // Diagonal '\' cord
      ctx.beginPath();
      ctx.moveTo(x1 + d, botY);
      ctx.quadraticCurveTo(x1 + d + h * 0.22 + amp, topY + h * 0.5, x1 + d + h * 0.44, topY);
      ctx.stroke();
    }
    ctx.restore();

    // 3D Cylindrical Brushed-Steel Front Goalpost + Team Neon LED Strip!
    ctx.lineCap = 'round';
    // Outer ink contour
    ctx.strokeStyle = INK;
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(frontX, topY + 6);
    ctx.lineTo(frontX, botY - 4);
    ctx.stroke();

    // Brushed metallic cylinder body
    const postGrad = ctx.createLinearGradient(frontX - 7, 0, frontX + 7, 0);
    postGrad.addColorStop(0, '#94a3b8');
    postGrad.addColorStop(0.35, '#f8fafc');
    postGrad.addColorStop(0.75, teamColor);
    postGrad.addColorStop(1, '#1e293b');
    ctx.strokeStyle = postGrad;
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(frontX, topY + 6);
    ctx.lineTo(frontX, botY - 4);
    ctx.stroke();

    // Specular white highlight filament
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(frontX - 2.5, topY + 14);
    ctx.lineTo(frontX - 2.5, botY - 14);
    ctx.stroke();

    // POW Force-Field Hexagonal Energy Barrier!
    if (powTimer > 0) {
      const pulse = 0.72 + 0.28 * Math.sin(time * 18);
      const pGrad = ctx.createLinearGradient(frontX, topY, backX, botY);
      pGrad.addColorStop(0, `rgba(56, 189, 248, ${0.55 * pulse})`);
      pGrad.addColorStop(1, `rgba(37, 99, 235, ${0.22 * pulse})`);
      ctx.fillStyle = pGrad;
      ctx.fillRect(x1, topY, w, h);

      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(frontX, topY + 4);
      ctx.lineTo(frontX, botY - 4);
      ctx.stroke();

      ctx.strokeStyle = '#eff6ff';
      ctx.lineWidth = 3;
      for (let sy = topY + 30; sy < botY - 20; sy += 44) {
        ctx.beginPath();
        ctx.moveTo(frontX - 11, sy);
        ctx.lineTo(frontX + 11, sy + 18);
        ctx.stroke();
      }

      ctx.fillStyle = '#eff6ff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.font = '900 20px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeText(`SHIELD ${powTimer.toFixed(1)}s`, (x1 + x2) / 2, topY + h / 2);
      ctx.fillText(`SHIELD ${powTimer.toFixed(1)}s`, (x1 + x2) / 2, topY + h / 2);
    }

    ctx.restore();
  }

  _drawStepItemSlot(ctx, cx, cy, player, label, time) {
    ctx.save();
    const r = 48;

    // Outer recessed bezel glow when holding an item
    if (player.heldItem) {
      const glow = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r * 1.45);
      glow.addColorStop(0, `${player.char.primary}88`);
      glow.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.45, 0, Math.PI * 2);
      ctx.fill();
    }

    const glass = ctx.createLinearGradient(cx, cy - r, cx, cy + r);
    glass.addColorStop(0, 'rgba(30, 41, 59, 0.90)');
    glass.addColorStop(1, 'rgba(9, 13, 26, 0.94)');
    ctx.fillStyle = glass;
    ctx.strokeStyle = player.heldItem ? '#fde047' : player.char.primary;
    ctx.lineWidth = 5.5;
    this.roundRect(ctx, cx - r, cy - r, r * 2, r * 2, 20);
    ctx.fill();
    ctx.stroke();

    // Top glass highlight crescent
    ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
    this.roundRect(ctx, cx - r + 6, cy - r + 5, r * 2 - 12, r * 0.65, 14);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '800 15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${label} ITEM`, cx, cy - r - 9);

    if (player.heldItem) {
      const bob = Math.sin(time * 6.5) * 4;
      this.drawItemIcon(ctx, player.heldItem, cx, cy + bob, 40, time);
      ctx.fillStyle = '#fde047';
      ctx.font = '900 14px system-ui, sans-serif';
      ctx.fillText('READY!', cx, cy + r + 18);
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.font = '900 30px system-ui, sans-serif';
      ctx.fillText('?', cx, cy + 11);
    }
    ctx.restore();
  }

  // =========================================================================
  // 3. INTERACTIVE STAGE HAZARDS, BUMPERS & MECHA STRIKER-CANNON
  // =========================================================================
  drawStageHazards(ctx, matchState, time) {
    const arena = matchState.arena;
    const hazardsOn = matchState.settings?.stageHazards !== false;

    ctx.save();

    // 1. Haunted Manor: Spectral Portrait Warp Portals
    if (hazardsOn && matchState.portals && matchState.portals.length === 2) {
      for (const pt of matchState.portals) {
        ctx.save();
        ctx.translate(pt.x, pt.y);

        // Ambient portal halo
        const halo = ctx.createRadialGradient(0, 0, 12, 0, 0, 82);
        halo.addColorStop(0, pt.side === 'left' ? 'rgba(45, 212, 191, 0.45)' : 'rgba(192, 132, 252, 0.45)');
        halo.addColorStop(1, 'rgba(30, 27, 75, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(0, 0, 82, 0, Math.PI * 2);
        ctx.fill();

        // Ornate gilded gothic portrait frame
        ctx.fillStyle = '#1e1b4b';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 6.5;
        this.roundRect(ctx, -48, -60, 96, 120, 20);
        ctx.fill();
        ctx.stroke();

        // Swirling dimensional vortex
        const spin = time * (pt.side === 'left' ? 3.6 : -3.6);
        const grad = ctx.createRadialGradient(0, 0, 5, 0, 0, 44);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.45, pt.side === 'left' ? '#2dd4bf' : '#c084fc');
        grad.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 36, 47, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 3.2;
        for (let k = 0; k < 3; k++) {
          const a = spin + (k * Math.PI * 2) / 3;
          ctx.beginPath();
          ctx.arc(0, 0, 14 + k * 8, a, a + 1.65);
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // 2. Cosmic Observatory: Central Zero-G Accelerator Hoop
    if (hazardsOn && matchState.gravityRing) {
      const ring = matchState.gravityRing;
      ctx.save();
      ctx.translate(ring.x, ring.y);
      const pulse = 1 + Math.sin(time * 5.2) * 0.05 + (ring.flashTimer > 0 ? 0.16 : 0);
      ctx.scale(pulse, pulse);

      const glow = ctx.createRadialGradient(0, 0, ring.r * 0.35, 0, 0, ring.r * 1.48);
      glow.addColorStop(0, 'rgba(56, 189, 248, 0.14)');
      glow.addColorStop(0.62, 'rgba(250, 204, 21, 0.42)');
      glow.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, ring.r * 1.48, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = ring.flashTimer > 0 ? '#ffffff' : '#fde047';
      ctx.lineWidth = 8;
      ctx.setLineDash([24, 14]);
      ctx.lineDashOffset = -time * 72;
      ctx.beginPath();
      ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, ring.r - 13, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Frostbite Glacier: Faceted Crystal Icicles
    if (hazardsOn && matchState.icicles) {
      for (const ic of matchState.icicles) {
        if (!ic.active) continue;
        if (ic.state === 'warn') this._drawHazardWarning(ctx, ic.x, arena.pitchFloorY, 48, ic.timer, 'ICE', arena.pitchFloorY - 30);
        ctx.save();
        const shakeX = ic.state === 'warn' ? Math.sin(time * 58) * 4.5 : 0;
        ctx.translate(ic.x + shakeX, ic.y);

        const icGrad = ctx.createLinearGradient(-18, 0, 18, 64);
        icGrad.addColorStop(0, '#f0f9ff');
        icGrad.addColorStop(0.5, '#7dd3fc');
        icGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = icGrad;
        ctx.strokeStyle = INK;
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(20, 0);
        ctx.lineTo(0, 68);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.moveTo(-11, 4);
        ctx.lineTo(1, 4);
        ctx.lineTo(-2, 46);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // 4. Magma Keep: Volcanic Lava Geyser Vents & Roaring Plasma Plumes
    if (hazardsOn && matchState.lavaVents) {
      for (const lv of matchState.lavaVents) {
        if (lv.state === 'warn') this._drawHazardWarning(ctx, lv.x, arena.pitchFloorY, 82, lv.timer, 'LAVA', 250);
        ctx.save();
        ctx.translate(lv.x, arena.pitchFloorY - 4);
        if (lv.state === 'erupt') {
          const h = 236 + Math.sin(time * 40) * 24;
          // Outer fiery bloom
          const outerG = ctx.createLinearGradient(0, 0, 0, -h);
          outerG.addColorStop(0, 'rgba(249, 115, 22, 0.88)');
          outerG.addColorStop(0.7, 'rgba(239, 68, 68, 0.55)');
          outerG.addColorStop(1, 'rgba(239, 68, 68, 0)');
          ctx.fillStyle = outerG;
          this.roundRect(ctx, -38, -h, 76, h + 10, 32);
          ctx.fill();

          // White-hot inner core column
          const coreG = ctx.createLinearGradient(0, 0, 0, -h * 0.88);
          coreG.addColorStop(0, '#ffffff');
          coreG.addColorStop(0.45, '#fef08a');
          coreG.addColorStop(1, 'rgba(251, 146, 60, 0)');
          ctx.fillStyle = coreG;
          this.roundRect(ctx, -18, -h * 0.88, 36, h * 0.88 + 6, 18);
          ctx.fill();
        } else if (lv.state === 'warn') {
          const p = 0.5 + 0.5 * Math.sin(time * 26);
          ctx.fillStyle = `rgba(251, 146, 60, ${0.48 + p * 0.45})`;
          ctx.beginPath();
          ctx.ellipse(0, -2, 44, 15, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        // Chiseled Obsidian Vent Rim
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 3.5;
        this.roundRect(ctx, -34, -5, 68, 14, 7);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    // 5. Jungle Vine Ruins: Carved Bouncy Tribal Drum-Pads
    if (hazardsOn && matchState.drumPads) {
      for (const dp of matchState.drumPads) {
        ctx.save();
        const sq = dp.bounceTimer > 0 ? 1 + Math.sin(dp.bounceTimer * 36) * 0.24 : 1;
        ctx.translate(dp.x, dp.y);
        ctx.scale(sq, 2 - sq);

        ctx.fillStyle = '#78350f';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 5;
        this.roundRect(ctx, -dp.w / 2, -16, dp.w, 28, 11);
        ctx.fill();
        ctx.stroke();

        // Zigzag tribal gold pattern
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let zx = -dp.w / 2 + 14; zx < dp.w / 2 - 14; zx += 22) {
          ctx.moveTo(zx, -2);
          ctx.lineTo(zx + 11, -10);
          ctx.lineTo(zx + 22, -2);
        }
        ctx.stroke();

        ctx.fillStyle = dp.bounceTimer > 0 ? '#fef9c3' : '#fbbf24';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 4.5;
        this.roundRect(ctx, -dp.w / 2 - 5, -23, dp.w + 10, 13, 6.5);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    // 6. Pinball Bumpers Mutator (HD Balls Atlas Cell 7!)
    if (matchState.bumpers && matchState.bumpers.length > 0) {
      const ballsAtlas = this.sprites.balls_atlas;
      for (const bm of matchState.bumpers) {
        ctx.save();
        const s = 1 + (bm.flashTimer > 0 ? 0.25 : Math.sin(time * 6 + bm.x) * 0.045);
        ctx.translate(bm.x, bm.y);
        ctx.scale(s, s);

        if (bm.flashTimer > 0) {
          ctx.fillStyle = 'rgba(250, 204, 21, 0.55)';
          ctx.beginPath();
          ctx.arc(0, 0, bm.r * 1.45, 0, Math.PI * 2);
          ctx.fill();
        }

        if (ballsAtlas) {
          const sz = bm.r * 2.38;
          const bW = (ballsAtlas.naturalWidth || ballsAtlas.width || 1536) / 4;
          const bH = (ballsAtlas.naturalHeight || ballsAtlas.height || 768) / 2;
          ctx.drawImage(ballsAtlas, 3 * bW, bH, bW, bH, -sz / 2, -sz / 2, sz, sz);
        } else {
          ctx.fillStyle = bm.flashTimer > 0 ? '#fef08a' : '#ec4899';
          ctx.strokeStyle = INK;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(0, 0, bm.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // 7. Goalie Gauntlet Midfield Mecha Striker-Cannon (HD Props Atlas Cell 3!)
    if (matchState.gauntletCannon) {
      const cn = matchState.gauntletCannon;
      const props = this.sprites.props_atlas;
      ctx.save();
      ctx.translate(cn.x, cn.y);

      // Heavy steel tripod legs
      ctx.strokeStyle = INK;
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(-36, 58);
      ctx.moveTo(0, 10);
      ctx.lineTo(36, 58);
      ctx.stroke();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.rotate(cn.aimAngle || -0.22);
      const recoil = cn.recoilTimer > 0 ? -16 * (cn.recoilTimer / 0.2) : 0;

      if (props) {
        const pW = (props.naturalWidth || props.width || 1024) / 2;
        const pH = (props.naturalHeight || props.height || 1024) / 2;
        ctx.drawImage(props, pW, pH, pW, pH, -74 + recoil, -74, 156, 156);
      } else {
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 5;
        this.roundRect(ctx, -32 + recoil, -24, 86, 48, 16);
        ctx.fill();
        ctx.stroke();
      }

      if (cn.fireTimer < 0.45) {
        const p = 1 - cn.fireTimer / 0.45;
        const mGlow = ctx.createRadialGradient(62 + recoil, 0, 4, 62 + recoil, 0, 14 + p * 22);
        mGlow.addColorStop(0, '#ffffff');
        mGlow.addColorStop(0.5, '#fde047');
        mGlow.addColorStop(1, 'rgba(249, 115, 22, 0)');
        ctx.fillStyle = mGlow;
        ctx.beginPath();
        ctx.arc(62 + recoil, 0, 14 + p * 22, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.restore();
  }

  // =========================================================================
  // 4. SKY-COURIER & ALL 18 CEL-SHADED POWER-UP SPRITES
  // =========================================================================
  _drawHazardWarning(ctx, x, floor, width, remaining, label, height) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 201, 88, 0.13)';
    ctx.fillRect(x - width / 2, floor - height, width, height);
    ctx.strokeStyle = '#ffe3a0';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 8]);
    ctx.strokeRect(x - width / 2, floor - height, width, height);
    ctx.setLineDash([]);
    ctx.fillStyle = '#111d2c';
    this.roundRect(ctx, x - 65, floor - 60, 130, 32, 7);
    ctx.fill();
    ctx.fillStyle = '#ffe4a8';
    ctx.textAlign = 'center';
    ctx.font = '800 18px system-ui, sans-serif';
    ctx.fillText(`${label} ${Math.max(0, remaining).toFixed(1)}s`, x, floor - 38);
    ctx.restore();
  }

  drawCloudCourier(ctx, courier, time) {
    if (!courier.active) return;
    const { x, y, heldItemId } = courier;
    const props = this.sprites.props_atlas;
    ctx.save();
    ctx.translate(x, y);

    const vx = courier.vx || 0;
    const facing = vx < -15 ? -1 : 1;
    const bankAngle = Math.max(-0.18, Math.min(0.18, vx * 0.0006));
    const floatBob = Math.sin(time * 4.8) * 8;
    const breathPulse = 1 + Math.sin(time * 6.5) * 0.035;

    // 1. Animated Trailing Cloud Puffs from the back of the cloud
    ctx.save();
    ctx.scale(COURIER_LAYOUT.bodyScale, COURIER_LAYOUT.bodyScale);
    for (let p = 1; p <= 4; p++) {
      const pPhase = (time * 3.2 + p * 0.25) % 1;
      const pDist = pPhase * 56;
      const pX = -facing * (44 + pDist);
      const pY = 16 + Math.sin(time * 5 + p) * 7 + pPhase * 10;
      const pRad = 12 + pPhase * 16;
      const pAlpha = (1 - pPhase) * 0.45;
      ctx.save();
      ctx.globalAlpha = pAlpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pX, pY, pRad, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    // 2. Trailing Fishing Line & Item Bubble with Inertia Sway
    if (heldItemId) {
      const inertiaSway = courier.bubbleX !== undefined ? courier.bubbleX - courier.x : -vx * 0.09 + Math.sin(time * 4.2) * 8;
      const bx = inertiaSway;
      const by = courier.bubbleY !== undefined ? courier.bubbleY - courier.y : COURIER_LAYOUT.itemOffsetY;
      const radius = COURIER_LAYOUT.bubbleRadius;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(facing * 18 * COURIER_LAYOUT.bodyScale, 12 * COURIER_LAYOUT.bodyScale);
      ctx.quadraticCurveTo(inertiaSway * 0.5, by * 0.45, bx, by - radius);
      ctx.stroke();

      const pulse = 1 + Math.sin(time * 7) * 0.06;
      const glowRadius = radius * 1.28 * pulse;
      ctx.save();
      ctx.translate(bx, by);

      // Iridescent soap-crystal item bubble!
      const glow = ctx.createRadialGradient(-12, -14, 8, 0, 0, glowRadius);
      glow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      glow.addColorStop(0.55, 'rgba(125, 211, 252, 0.52)');
      glow.addColorStop(0.85, 'rgba(192, 132, 252, 0.32)');
      glow.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      this.drawItemIcon(ctx, heldItemId, 0, 0, COURIER_LAYOUT.itemRadius, time);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.90)';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Specular shine highlights
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.ellipse(-radius * 0.36, -radius * 0.42, 12, 6, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Banked & Animated Lakitu Body
    ctx.save();
    ctx.translate(0, floatBob);
    ctx.rotate(bankAngle);
    ctx.scale(facing * breathPulse * COURIER_LAYOUT.bodyScale, breathPulse * COURIER_LAYOUT.bodyScale);

    if (props) {
      const pW = (props.naturalWidth || props.width || 1024) / 2;
      const pH = (props.naturalHeight || props.height || 1024) / 2;
      ctx.drawImage(props, 0, 0, pW, pH, -60, -70, 120, 120);

      // Animated Goggle Glint / Eyewear Shimmer!
      const glintPhase = Math.sin(time * 3.5);
      if (glintPhase > 0.65) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(-4, -40, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  }

  drawItemIcon(ctx, itemId, x, y, r, time = 0) {
    const atlas = this.sprites.items_atlas;
    const idx = ITEM_INDEX_MAP[itemId];

    if (atlas && idx !== undefined) {
      const col = idx % 6;
      const row = Math.floor(idx / 6);
      const bounds = ITEM_SPRITE_BOUNDS[itemId];
      if (!bounds) throw new Error(`Missing item sprite bounds: ${itemId}`);
      const [left, top, right, bottom] = bounds;
      const cropW = right - left + 8;
      const cropH = bottom - top + 8;
      const fit = r * 2 / Math.max(cropW, cropH);
      const width = cropW * fit;
      const height = cropH * fit;
      ctx.save();
      ctx.translate(x, y);
      const motion = itemMotion(itemId, this.reducedMotion ? 0 : time);
      ctx.translate(0, motion.y);
      ctx.rotate(motion.rotation);
      ctx.scale(motion.scaleX, motion.scaleY);
      const cellW = (atlas.naturalWidth || atlas.width || 1536) / 6;
      const cellH = (atlas.naturalHeight || atlas.height || 768) / 3;
      ctx.drawImage(atlas, col * cellW + (left - 4) * cellW / 256,
        row * cellH + (top - 4) * cellH / 256, cropW * cellW / 256, cropH * cellH / 256,
        -width / 2, -height / 2, width, height);
      ctx.restore();
      return;
    }

    // Clean Procedural Fallback (for headless Node tests or pre-onload frame)
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = INK;
    ctx.lineWidth = Math.max(2.5, r * 0.13);
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // =========================================================================
  // 5. Character animation: 24-column, six-row atlases and continuous secondary motion.
  // =========================================================================
  _selectCharFrameCoords(player, time) {
    if (this.reducedMotion && player.onGround && Math.abs(player.vx || 0) <= 38 &&
        !player.kickTimer && !player.stunTimer) return { col: 0, row: 0 };
    return characterFrame(player, time);
  }

  _selectCharFrame(player, time) {
    const { col, row } = this._selectCharFrameCoords(player, time);
    return col + row * 24;
  }

  drawCharacterPuppet(ctx, player, balls, time, { onField = false } = {}) {
    const ch = player.char;
    const scale = (player.visualScale || 1) * ch.stats.size;
    const facing = player.facing || 1;
    const sheet = this._getCharSheet(ch);
    const metrics = CHAR_SPRITE_METRICS[ch.id] || CHAR_SPRITE_METRICS.mario;
    const drawSize = onField ? FIELD_CHARACTER_DRAW_SIZE : metrics.drawSize;
    const { col, row } = this._selectCharFrameCoords(player, time);

    // 1. Soft Ground Contact Shadow
    if (player.shadowY !== undefined) {
      const dist = Math.max(0, player.shadowY - (player.y + player.halfH));
      const shScale = Math.max(0.24, 1 - dist / 650);
      ctx.save();
      const shGrad = ctx.createRadialGradient(
        player.x,
        player.shadowY + 2,
        4,
        player.x,
        player.shadowY + 2,
        48 * scale * shScale
      );
      shGrad.addColorStop(0, `rgba(8, 12, 24, ${0.46 * shScale})`);
      shGrad.addColorStop(1, 'rgba(8, 12, 24, 0)');
      ctx.fillStyle = shGrad;
      ctx.beginPath();
      ctx.ellipse(player.x, player.shadowY + 2, 48 * scale * shScale, 12 * shScale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Pose-Accurate Chromatic Sprite Silhouette Dash Afterimages!
    if (player.dashGhosts && player.dashGhosts.length > 0) {
      for (const g of player.dashGhosts) {
        ctx.save();
        ctx.globalAlpha = g.alpha * 0.58;
        ctx.translate(g.x, g.y);
        ctx.scale(facing * scale, scale);
        if (sheet) {
          const dSz = drawSize;
          const topY = 53 - dSz * metrics.footY;
          this._drawCharFrame(ctx, ch, col, row, -dSz * 0.5, topY, dSz, dSz, ch.aura || ch.primary);
        } else {
          ctx.fillStyle = ch.aura;
          ctx.beginPath();
          ctx.ellipse(0, 0, 34, 50, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    ctx.save();
    ctx.translate(player.x, player.y);

    // Translucency for Holo-Clone, Boo-Baron Phantom Phase Dash, or Hit Invulnerability
    if (player.isClone) {
      ctx.globalAlpha = 0.76;
    } else if (ch.id === 'king_boo' && player.dashTimer > 0) {
      ctx.globalAlpha = 0.42;
    } else if (player.invulnTimer > 0 && player.starTimer <= 0 && Math.floor(time * 22) % 2 === 0) {
      ctx.globalAlpha = 0.55;
    }

    // SuperStar Prism Invincibility Aura!
    if (player.starTimer > 0) {
      const hue = Math.floor((time * 360) % 360);
      const rAura = (78 + Math.sin(time * 28) * 9) * scale;
      const sGrad = ctx.createRadialGradient(0, -6 * scale, 12, 0, -6 * scale, rAura);
      sGrad.addColorStop(0, `hsla(${hue}, 98%, 68%, 0.85)`);
      sGrad.addColorStop(0.55, `hsla(${(hue + 75) % 360}, 96%, 60%, 0.42)`);
      sGrad.addColorStop(1, `hsla(${(hue + 150) % 360}, 95%, 60%, 0)`);
      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.arc(0, -6 * scale, rAura, 0, Math.PI * 2);
      ctx.fill();
    }

    // MagnetGlove Concentric Pull Waves!
    if (player.magnetTimer > 0) {
      for (let w = 0; w < 2; w++) {
        const phase = (time * 2.1 + w * 0.5) % 1;
        const mRad = ((1 - phase) * 96 + 24) * scale;
        ctx.strokeStyle = `rgba(244, 63, 94, ${phase * 0.78})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, -4 * scale, mRad, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Perfect Parry Golden Shock-Shield!
    if (player.parryFlashTimer > 0) {
      const pRing = ctx.createRadialGradient(0, -4 * scale, 24 * scale, 0, -4 * scale, 76 * scale);
      pRing.addColorStop(0, 'rgba(254, 240, 138, 0.08)');
      pRing.addColorStop(0.8, 'rgba(250, 204, 21, 0.75)');
      pRing.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = pRing;
      ctx.beginPath();
      ctx.arc(0, -4 * scale, 76 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // Charge-Shot OR Hyper-Strike Solar Power Aura!
    if (player.chargeTime > 0.08 || player.hyperReady) {
      const cNorm = Math.min(1, (player.chargeTime || 0.25) / 0.55);
      const auraColor = player.hyperReady && player.chargeTime > 0.08 ? '#fde047' : ch.aura;
      const auraR = (66 + cNorm * 30 + Math.sin(time * 32) * 6) * scale;
      const grad = ctx.createRadialGradient(0, -6 * scale, 10, 0, -6 * scale, auraR);
      grad.addColorStop(0, `${auraColor}aa`);
      grad.addColorStop(0.65, `${auraColor}44`);
      grad.addColorStop(1, `${auraColor}00`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, -6 * scale, auraR, 0, Math.PI * 2);
      ctx.fill();

      // Rising anime power-sparks around Hyper-Ready striker!
      if (player.hyperReady) {
        ctx.fillStyle = '#fef08a';
        for (let k = 0; k < 3; k++) {
          const ang = time * 5.5 + (k * Math.PI * 2) / 3;
          const sxp = Math.cos(ang) * 44 * scale;
          const syp = -10 * scale + Math.sin(ang * 1.7) * 34 * scale;
          ctx.beginPath();
          ctx.arc(sxp, syp, 4.5 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Princess Pippa Royal Hover Heart-Sparkles
    if (player.isHovering) {
      ctx.fillStyle = '#fbcfe8';
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.arc(i * 22 * scale, 52 * scale + Math.sin(time * 22 + i) * 5, 6.5 * scale, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Secondary Motion: Ground Contact & Clean Pose Alignment (Zero Wobble)
    const isRunning = player.onGround && Math.abs(player.vx || 0) > 38;
    const isKicking = player.kickTimer > 0;
    const isStunned = player.stunTimer > 0;
    const strideY = player.strideBounce || 0;
    const sprintLean = player.animLean || (isRunning ? facing * 0.045 : 0);

    const floatBobY =
      ch.id === 'king_boo'
        ? Math.sin(time * 5.5) * 5 * scale
        : 0;

    let poseRot = (player.spinAngle || 0) + sprintLean;
    if (isKicking) {
      const stroke = Math.sin(Math.PI * Math.min(1, 1 - player.kickTimer / (player.kickDuration || 0.21)));
      if (player.kickType === 'up') poseRot += facing * -0.32 * stroke;
      else if (player.kickType === 'spike') poseRot += facing * 0.32 * stroke;
      else poseRot += facing * 0.06 * stroke;
    }

    ctx.save();
    ctx.translate(0, floatBobY + strideY);
    const footPivot = player.onGround && !player.spinAngle ? 52 : 0;
    ctx.translate(0, footPivot * scale);
    ctx.rotate(poseRot);

    ctx.scale(facing * (player.squashX || 1) * scale, (player.squashY || 1) * scale);
    ctx.translate(0, -footPivot);

    if (sheet) {
      const dSz = drawSize;
      const airOffset = row === 2 || row === 5 ? metrics.airShiftY : 0;
      const topY = 52 - dSz * metrics.footY + airOffset;

      // Glowing Rim-Flash Underlay when Hyper-Ready, Parrying, or Holo-Clone!
      if (player.hyperReady || player.parryFlashTimer > 0 || player.isClone) {
        const rimCol = player.isClone ? '#38bdf8' : '#fde047';
        if (sheet) {
          ctx.save();
          ctx.globalAlpha = player.parryFlashTimer > 0 ? 0.9 : 0.65;
          this._drawCharFrame(ctx, ch, col, row, -dSz * 0.5 - 3.5, topY - 3.5, dSz + 7, dSz + 7, rimCol);
          ctx.restore();
        }
      }

      // Draw Crisp HD Cel-Shaded Character Sprite!
      this._drawCharFrame(ctx, ch, col, row, -dSz * 0.5, topY, dSz, dSz);

      // Big Head Mutator: Hilarious 1.68x Bobble-Head Magnifier Pass!
      if (player.bigHead) {
        ctx.save();
        const headPivotY = topY + dSz * 0.44;
        ctx.translate(0, headPivotY);
        ctx.rotate(Math.sin(time * 8) * 0.07);
        ctx.scale(1.66, 1.66);
        ctx.beginPath();
        ctx.rect(-dSz * 0.55, -dSz * 0.48, dSz * 1.1, dSz * 0.50);
        ctx.clip();
        this._drawCharFrame(ctx, ch, col, row, -dSz * 0.5, -dSz * 0.44, dSz, dSz);
        ctx.restore();
      }

      // Holo-Clone Horizontal Neon Scanlines!
      if (player.isClone) {
        ctx.save();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
        const scanShift = (time * 45) % 12;
        for (let ly = topY + scanShift; ly < topY + dSz; ly += 12) {
          ctx.fillRect(-dSz * 0.45, ly, dSz * 0.9, 2.5);
        }
        ctx.restore();
      }
    } else {
      // Headless / Pre-load Fallback Silhouette
      ctx.fillStyle = ch.primary;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      this.roundRect(ctx, -24, -44, 48, 92, 20);
      ctx.fill();
      ctx.stroke();
    }

    // Multi-Layer Tapered Anime Crescent Kick Slash!
    if (isKicking) {
      this._drawKickSlashArc(
        ctx,
        player.kickType,
        player.hyperReady ? '#fde047' : ch.aura,
        player.kickTimer / (player.kickDuration || 0.22)
      );
    }

    // Extra Orbiting 3D Stars when Stunned
    if (isStunned) {
      for (let s = 0; s < 3; s++) {
        const sa = time * 8.5 + (s * Math.PI * 2) / 3;
        ctx.fillStyle = '#fde047';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2.5;
        this._drawStarShape(ctx, Math.cos(sa) * 28, -68 + Math.sin(sa) * 8, 5, 8, 3.8);
        ctx.fill();
        ctx.stroke();
      }
    }

    ctx.restore(); // end pose transform

    // Princess Astra's Orbiting 3D Star Companion Lumi!
    if (ch.stats.hasLumi) {
      const lx = Math.cos(time * 3.4) * 56 * scale;
      const ly = -38 * scale + Math.sin(time * 5.2) * 13 * scale;
      ctx.save();
      ctx.translate(lx, ly);

      const lGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, 24 * scale);
      lGlow.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
      lGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = lGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 24 * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = ch.accent;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3.2;
      this._drawStarShape(ctx, 0, 0, 5, 14 * scale, 7.5 * scale);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(-3.2 * scale, 0, 2 * scale, 0, Math.PI * 2);
      ctx.arc(3.2 * scale, 0, 2 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore(); // end player translate

    // Sleek Floating Player Indicator Pill above Head
    ctx.save();
    const extraHeadH = player.bigHead ? 28 * scale : 0;
    const tagY = player.y + (52 - drawSize * metrics.footY) * scale - 18 - extraHeadH;
    ctx.fillStyle = 'rgba(12, 18, 36, 0.84)';
    ctx.strokeStyle = player.hyperReady ? '#fde047' : ch.primary;
    ctx.lineWidth = player.hyperReady ? 3.8 : 2.8;
    this.roundRect(ctx, player.x - 27, tagY - 12, 54, 23, 9);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = player.hyperReady ? '#fde047' : '#ffffff';
    ctx.font = '900 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(player.tag || 'P1', player.x, tagY - 0.5);
    ctx.restore();
  }

  _drawKickSlashArc(ctx, kickType, auraColor, tNorm) {
    ctx.save();
    let rot = 0;
    if (kickType === 'up') rot = -0.78;
    if (kickType === 'spike') rot = 0.72;
    ctx.rotate(rot);

    const alpha = Math.min(1, tNorm * 1.6);
    ctx.globalAlpha = alpha;

    // 1. Wide Soft Additive Glow Crescent
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = auraColor;
    ctx.beginPath();
    ctx.arc(20, 4, 72, -1.08, 1.08, false);
    ctx.arc(4, 4, 42, 1.08, -1.08, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 2. Crisp Saturated Mid-Blade Smear
    ctx.fillStyle = auraColor;
    ctx.beginPath();
    ctx.arc(22, 4, 65, -0.95, 0.95, false);
    ctx.arc(10, 4, 46, 0.95, -0.95, true);
    ctx.closePath();
    ctx.fill();

    // 3. White-Hot Inner Edge Core + Speed Streaks!
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(24, 4, 59, -0.72, 0.72, false);
    ctx.arc(15, 4, 49, 0.72, -0.72, true);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    for (const ang of [-0.55, 0, 0.55]) {
      ctx.beginPath();
      ctx.moveTo(22 + Math.cos(ang) * 56, 4 + Math.sin(ang) * 56);
      ctx.lineTo(22 + Math.cos(ang) * 80, 4 + Math.sin(ang) * 80);
      ctx.stroke();
    }

    ctx.restore();
  }

  // =========================================================================
  // 6. DYNAMIC SOCCER BALLS (HD SPRITES + STATIONARY 3D SPECULAR + COMET TRAILS)
  // =========================================================================
  drawBall(ctx, ball, pitchFloorY, time, ballSkinId = 'classic', isRugby = false) {
    const r = ball.radius;
    const skin = BALL_SKINS.find((s) => s.id === ballSkinId) || BALL_SKINS[0];
    const ballsAtlas = this.sprites.balls_atlas;

    // Ground Contact Shadow
    const dist = Math.max(0, pitchFloorY - (ball.y + r));
    const sh = Math.max(0.2, 1 - dist / 850);
    ctx.save();
    ctx.fillStyle = `rgba(8, 12, 24, ${0.36 * sh})`;
    ctx.beginPath();
    ctx.ellipse(ball.x, pitchFloorY + 3, r * 1.02 * sh, 10 * sh, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const isVanished = ball.vanishTimer > 0 && Math.sin(time * 38) > -0.35;
    const speed = Math.hypot(ball.vx, ball.vy);
    const hasSpin = Math.abs(ball.spin || 0) > 0.35;

    // Tapered Ribbon Comet Trail + Magnus Spin Vortex Rings!
    if (
      ball.trail &&
      ball.trail.length > 1 &&
      (speed > 540 || ball.burnTimer > 0 || ball.hyperActive || ball.comboBoosted || hasSpin)
    ) {
      const trailColor =
        ball.burnTimer > 0
          ? '#f97316'
          : ball.comboBoosted
          ? '#38bdf8'
          : ball.hyperActive
          ? ball.auraColor || '#fde047'
          : hasSpin
          ? '#c084fc'
          : ball.auraColor || '#fde047';

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < ball.trail.length; i++) {
        const pt = ball.trail[i];
        const frac = (i + 1) / ball.trail.length;
        ctx.globalAlpha = frac * (isVanished ? 0.14 : 0.52);
        ctx.fillStyle = trailColor;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r * frac * 0.96, 0, Math.PI * 2);
        ctx.fill();

        if (i % 2 === 1) {
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = frac * (isVanished ? 0.08 : 0.35);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, r * frac * 0.48, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    ctx.save();
    ctx.translate(ball.x, ball.y);
    if (isVanished) ctx.globalAlpha = 0.2;

    // Solar Plasma Fireball / Hyper-Strike Corona!
    if (ball.burnTimer > 0 || ball.hyperActive) {
      const flick = Math.sin(time * 36) * 6;
      const fireGrad = ctx.createRadialGradient(0, 0, r * 0.35, 0, 0, r * 1.92);
      fireGrad.addColorStop(0, '#ffffff');
      fireGrad.addColorStop(0.38, '#fef08a');
      fireGrad.addColorStop(0.68, ball.hyperActive ? ball.auraColor || '#f97316' : '#f97316');
      fireGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = fireGrad;
      ctx.beginPath();
      ctx.arc(-ball.vx * 0.016, -ball.vy * 0.016 + flick * 0.25, r * 1.88, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2v2 Combo Pass Voltage Electric Arcs!
    if (ball.comboBoosted) {
      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 3.5;
      for (let e = 0; e < 2; e++) {
        const a = time * 14 + e * Math.PI;
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.28, a, a + 1.3);
        ctx.stroke();
      }
    }

    // Magnus Curve Wind-Shear Swirl!
    if (hasSpin) {
      ctx.strokeStyle = 'rgba(233, 213, 255, 0.78)';
      ctx.lineWidth = 3;
      const dir = ball.spin > 0 ? 1 : -1;
      const a0 = time * 16 * dir;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.22, a0, a0 + 1.8);
      ctx.stroke();
    }

    // Rotating Ball Body (HD Sprite Atlas OR Procedural Fallback)
    ctx.save();
    ctx.scale(ball.squashX || 1, ball.squashY || 1);
    ctx.rotate(ball.angle);

    if (ballsAtlas) {
      const cellIdx = isRugby ? 6 : BALL_SKIN_CELL_MAP[ballSkinId] ?? 0;
      const col = cellIdx % 4;
      const row = Math.floor(cellIdx / 4);
      const bW = (ballsAtlas.naturalWidth || ballsAtlas.width || 1536) / 4;
      const bH = (ballsAtlas.naturalHeight || ballsAtlas.height || 768) / 2;
      const drawD = r * 2.42;
      ctx.drawImage(ballsAtlas, col * bW, row * bH, bW, bH, -drawD / 2, -drawD / 2, drawD, drawD);

      if (ball.burnTimer > 0) {
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = 'rgba(251, 146, 60, 0.55)';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.96, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      if (isRugby) ctx.scale(1.28, 0.78);
      ctx.fillStyle = skin.primary;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // Stationary Top-Left 3D Spherical Rim Sheen (stays locked to stadium sun even while ball spins!)
    if (!isRugby) {
      const sheen = ctx.createRadialGradient(-r * 0.34, -r * 0.38, r * 0.04, 0, 0, r);
      sheen.addColorStop(0, 'rgba(255, 255, 255, 0.52)');
      sheen.addColorStop(0.45, 'rgba(255, 255, 255, 0)');
      sheen.addColorStop(1, 'rgba(15, 23, 42, 0.24)');
      ctx.fillStyle = sheen;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.96, 0, Math.PI * 2);
      ctx.fill();
    }

    // Faceted Translucent Ice-Crystal Encasement (Frost Bloom)
    if (ball.freezeTimer > 0) {
      const iceG = ctx.createLinearGradient(-r, -r, r, r);
      iceG.addColorStop(0, 'rgba(240, 249, 255, 0.75)');
      iceG.addColorStop(0.5, 'rgba(56, 189, 248, 0.48)');
      iceG.addColorStop(1, 'rgba(2, 132, 199, 0.62)');
      ctx.fillStyle = iceG;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-r * 1.18, -r * 0.88);
      ctx.lineTo(0, -r * 1.32);
      ctx.lineTo(r * 1.16, -r * 0.82);
      ctx.lineTo(r * 1.24, r * 0.88);
      ctx.lineTo(0, r * 1.28);
      ctx.lineTo(-r * 1.12, r * 0.96);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }

  // =========================================================================
  // 7. ARENA ENTITIES (SHROOM KEEPER, CHAIN-HOUND, SHELLS, TORPEDOES & TARGETS)
  // =========================================================================
  drawGoalKeeperEntity(ctx, keeper, time) {
    const bob = Math.sin(time * 9) * 5;
    const props = this.sprites.props_atlas;
    ctx.save();
    ctx.translate(keeper.x, keeper.y + bob);
    const recoil = Math.sin(Math.max(0, keeper.recoilTimer || 0) / 0.22 * Math.PI) * 0.12;
    ctx.scale(1 + recoil, 1 - recoil);

    if (props) {
      ctx.save();
      ctx.scale(keeper.side === 'left' ? 1 : -1, 1);
      const pW = (props.naturalWidth || props.width || 1024) / 2;
      const pH = (props.naturalHeight || props.height || 1024) / 2;
      ctx.drawImage(props, pW, 0, pW, pH, -72, -78, 144, 144);
      ctx.restore();
    } else {
      ctx.fillStyle = '#ec4899';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.arc(0, 0, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    const pct = Math.max(0, keeper.timer / keeper.maxTimer);
    ctx.fillStyle = 'rgba(10, 14, 28, 0.72)';
    this.roundRect(ctx, -36, -80, 72, 10, 5);
    ctx.fill();
    ctx.fillStyle = '#4ade80';
    this.roundRect(ctx, -34, -78, 68 * pct, 6, 3);
    ctx.fill();
    ctx.restore();
  }

  drawChainHoundEntity(ctx, hound, time) {
    const props = this.sprites.props_atlas;
    ctx.save();

    // Heavy Iron Stake in Pitch Floor
    ctx.fillStyle = '#64748b';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4.5;
    this.roundRect(ctx, hound.anchorX - 11, hound.anchorY - 20, 22, 28, 6);
    ctx.fill();
    ctx.stroke();

    // Taut Metallic Chain Links!
    const links = 8;
    for (let i = 1; i < links; i++) {
      const t = i / links;
      const lx = hound.anchorX + (hound.x - hound.anchorX) * t;
      const ly = hound.anchorY + (hound.y - hound.anchorY) * t + Math.sin(t * Math.PI) * 14;
      ctx.fillStyle = i % 2 === 0 ? '#e2e8f0' : '#94a3b8';
      ctx.beginPath();
      ctx.arc(lx, ly, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Snapping Iron Chain-Hound Sprite (Props Atlas Cell 2)!
    ctx.translate(hound.x, hound.y);
    if (hound.vx < -10) ctx.scale(-1, 1);
    const chomp = Math.abs(Math.sin(time * 18)) * 0.24;
    ctx.rotate(-chomp * 0.32);

    if (props) {
      const pW = (props.naturalWidth || props.width || 1024) / 2;
      const pH = (props.naturalHeight || props.height || 1024) / 2;
      const d = hound.radius * 2.55;
      ctx.drawImage(props, 0, pH, pW, pH, -d / 2, -d / 2, d, d);
    } else {
      this.drawItemIcon(ctx, 'ChainHound', 0, 0, hound.radius, time);
    }
    ctx.restore();
  }

  drawBananaEntity(ctx, banana, time) {
    ctx.save();
    ctx.translate(banana.x, banana.y);
    if (Math.abs(banana.vx || 0) > 20 || Math.abs(banana.vy || 0) > 20) ctx.rotate(time * 6 * Math.sign(banana.vx || 1));
    this.drawItemIcon(ctx, 'BananaBunch', 0, 0, 26, time);
    ctx.restore();
  }

  drawShellEntity(ctx, shell, time) {
    if (!this.reducedMotion && shell.timer < 1.8 && Math.floor(time * 16) % 2 === 0) return;
    ctx.save();
    ctx.translate(shell.x, shell.y);
    const squish = 1 + Math.sin(time * 12) * 0.06;
    ctx.scale(squish, 2 - squish);
    this.drawItemIcon(ctx, 'GreenShell', 0, 0, shell.radius * 1.08, time);
    ctx.restore();
  }

  drawTorpedoEntity(ctx, torp, time) {
    ctx.save();
    if (torp.warnTimer > 0) {
      const alpha = 0.48 + 0.36 * Math.sin(time * 28);
      ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
      ctx.lineWidth = 4.5;
      ctx.setLineDash([20, 14]);
      ctx.beginPath();
      ctx.moveTo(0, torp.y);
      ctx.lineTo(VIRTUAL_WIDTH, torp.y);
      ctx.stroke();
      ctx.setLineDash([]);

      const badgeX = torp.vx > 0 ? 58 : VIRTUAL_WIDTH - 58;
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(badgeX, torp.y, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 26px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', badgeX, torp.y + 1);
      ctx.restore();
      return;
    }

    ctx.translate(torp.x, torp.y);
    ctx.scale(torp.vx > 0 ? 1 : -1, 1);

    // Roaring Jet Afterburner Plume!
    const jetLen = 42 + Math.sin(time * 55) * 14;
    const jGrad = ctx.createLinearGradient(-40, 0, -40 - jetLen, 0);
    jGrad.addColorStop(0, '#ffffff');
    jGrad.addColorStop(0.45, '#fb923c');
    jGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = jGrad;
    ctx.beginPath();
    ctx.moveTo(-40, -16);
    ctx.lineTo(-44 - jetLen, 0);
    ctx.lineTo(-40, 16);
    ctx.closePath();
    ctx.fill();

    this.drawItemIcon(ctx, 'BulletBill', 0, 0, 48, time);
    ctx.restore();
  }

  drawTargetEntity(ctx, target, time) {
    ctx.save();
    ctx.translate(target.x, target.y);
    const pulse = 1 + Math.sin(time * 6 + target.phase) * 0.055;
    ctx.scale(pulse, pulse);
    const r = target.radius;

    // Outer target glow
    const tGlow = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 1.38);
    tGlow.addColorStop(0, 'rgba(250, 204, 21, 0.35)');
    tGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = tGlow;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.38, 0, Math.PI * 2);
    ctx.fill();

    const rings = [
      [1.0, '#ef4444'],
      [0.72, '#ffffff'],
      [0.45, '#ef4444'],
      [0.22, '#facc15'],
    ];
    for (const [f, col] of rings) {
      ctx.fillStyle = col;
      ctx.strokeStyle = INK;
      ctx.lineWidth = f === 1.0 ? 5.5 : 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * f, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  // =========================================================================
  // 8. DYNAMIC ADDITIVE SCENE LIGHTING & CINEMATIC VIGNETTE PASS
  // =========================================================================
  drawDynamicLighting(ctx, matchState, time) {
    if (!matchState) return;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Additive light pools around energized / burning / hyper / frozen balls!
    if (matchState.balls) {
      for (const b of matchState.balls) {
        const speed = Math.hypot(b.vx, b.vy);
        if (b.burnTimer > 0 || b.hyperActive || b.freezeTimer > 0 || b.comboBoosted || speed > 820) {
          const lightCol =
            b.burnTimer > 0
              ? 'rgba(251, 146, 60, 0.34)'
              : b.freezeTimer > 0
              ? 'rgba(56, 189, 248, 0.30)'
              : b.comboBoosted
              ? 'rgba(56, 189, 248, 0.32)'
              : 'rgba(250, 204, 21, 0.32)';
          const rad = b.radius * (b.hyperActive || b.burnTimer > 0 ? 4.4 : 3.2);
          const lg = ctx.createRadialGradient(b.x, b.y, b.radius * 0.3, b.x, b.y, rad);
          lg.addColorStop(0, lightCol);
          lg.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = lg;
          ctx.beginPath();
          ctx.arc(b.x, b.y, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Additive stadium floor bounce-glow when Molten Turf or Erupting Geysers are active!
    if (matchState.lavaVents) {
      for (const lv of matchState.lavaVents) {
        if (lv.state === 'erupt') {
          const lg = ctx.createRadialGradient(lv.x, matchState.arena.pitchFloorY - 90, 20, lv.x, matchState.arena.pitchFloorY - 90, 240);
          lg.addColorStop(0, 'rgba(251, 146, 60, 0.32)');
          lg.addColorStop(1, 'rgba(239, 68, 68, 0)');
          ctx.fillStyle = lg;
          ctx.beginPath();
          ctx.arc(lv.x, matchState.arena.pitchFloorY - 90, 240, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Hyper-Ready Player Spotlight Bloom
    if (matchState.players) {
      for (const pl of matchState.players) {
        if (pl.hyperReady || pl.starTimer > 0) {
          const pulse = 135 + Math.sin(time * 12) * 16;
          const lg = ctx.createRadialGradient(pl.x, pl.y, 12, pl.x, pl.y, pulse);
          lg.addColorStop(0, 'rgba(254, 240, 138, 0.24)');
          lg.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = lg;
          ctx.beginPath();
          ctx.arc(pl.x, pl.y, pulse, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }

  // =========================================================================
  // 9. HD PAINTED ANIME HYPER-STRIKE PORTRAIT CUT-IN & PARTICLES
  // =========================================================================
  drawHyperCutIn(ctx, cutIn, time) {
    if (!cutIn || cutIn.timer <= 0) return;
    const ch = cutIn.char;
    const sheet = this._getCharSheet(ch);
    const alpha = Math.min(1, cutIn.timer * 4.5);
    const slideIn = this.reducedMotion ? 0 : -Math.pow(Math.max(0, (cutIn.timer - 0.36) / 0.16), 3) * 360;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Dramatic Dimmed Speed-Flash Backdrop
    ctx.fillStyle = 'rgba(6, 10, 24, 0.62)';
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // Angled Anime Slash Ribbon across Center Screen!
    ctx.save();
    ctx.translate(VIRTUAL_WIDTH / 2 + slideIn, VIRTUAL_HEIGHT * 0.35);
    ctx.rotate(-0.055);

    ctx.beginPath();
    ctx.rect(-1100, -96, 2200, 192);
    ctx.save();
    ctx.clip();

    const rGrad = ctx.createLinearGradient(-980, 0, 980, 0);
    rGrad.addColorStop(0, '#090d16');
    rGrad.addColorStop(0.28, ch.primary);
    rGrad.addColorStop(0.68, ch.secondary || ch.primary);
    rGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = rGrad;
    ctx.fillRect(-1100, -96, 2200, 192);

    // High-velocity comic speed-lines!
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.lineWidth = 3.5;
    for (let i = -4; i <= 4; i++) {
      const ly = i * 21;
      const lx = ((time * 2800 + i * 330) % 1900) - 950;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 310, ly);
      ctx.stroke();
    }

    // HD Painted Character Action Portrait Bust on Left of Banner!
    if (sheet) {
      this._drawCharFrame(ctx, ch, 1, 1, -688, -142, 310, 310, '#fde047');
      this._drawCharFrame(ctx, ch, 1, 1, -678, -136, 300, 300);
    }

    ctx.restore(); // end ribbon clip

    // Gleaming Golden Top & Bottom Slash Borders
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-1100, -96);
    ctx.lineTo(1100, -96);
    ctx.moveTo(-1100, 96);
    ctx.lineTo(1100, 96);
    ctx.stroke();

    const textCenterX = sheet ? 95 : 0;
    ctx.font = "900 32px 'Fredoka', system-ui, sans-serif";
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fde047';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 8;
    const sub = `⚡ ${ch.name.toUpperCase()} — HYPER STRIKE!!`;
    ctx.strokeText(sub, textCenterX, -38);
    ctx.fillText(sub, textCenterX, -38);

    ctx.font = "900 74px 'Luckiest Guy', system-ui, sans-serif";
    ctx.lineWidth = 13;
    const moveTitle = (ch.hyperName || 'SUPER SHOT').toUpperCase();
    ctx.strokeText(moveTitle, textCenterX, 34);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(moveTitle, textCenterX, 34);

    ctx.restore();
    ctx.restore();
  }

  drawParticles(ctx, particles, shockwaves) {
    for (const sw of shockwaves) {
      ctx.save();
      ctx.globalAlpha = sw.alpha;
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = sw.lineWidth;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    for (const p of particles) {
      ctx.save();
      const lifeNorm = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = lifeNorm;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot || 0);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      } else if (p.shape === 'text') {
        ctx.font = `900 ${p.size}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 5.5;
        ctx.strokeText(p.text, 0, 0);
        ctx.fillText(p.text, 0, 0);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }
}
