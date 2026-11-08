/* Super Kick Kingdom — Auto-generated bundle from src/*.js (run: node build.mjs) */
(() => {
'use strict';

// === src/config.js ===
// Super Kick Kingdom 2.0 (Deluxe Edition) — Master Configuration
// 12 Strikers (+3 Kits each), 7 Hazard Arenas, 18 Items, 7 Mutators, 4 Cups, Locker Room & 24 Trophies
const VIRTUAL_WIDTH = 1920;
const VIRTUAL_HEIGHT = 1080;
const CHARACTERS = [
  {
    id: 'mario',
    name: 'Mario',
    title: 'Super Striker',
    emblem: 'M',
    unlockedByDefault: true,
    unlockCost: 0,
    traitName: 'Turbo Volley',
    traitDesc: '+12% bonus ball speed on mid-air side strikes & blazing fireball rebounds.',
    hyperName: 'Fireball Tornado',
    hyperStyle: 'spiral_fire',
    primary: '#e63946',
    secondary: '#2563eb',
    accent: '#ffd166',
    skin: '#ffcf9c',
    aura: '#ff4d4d',
    particleColor: '#ff3b30',
    voiceBase: 310,
    voiceStyle: 'hero',
    kits: [
      { name: 'Classic Red & Blue', primary: '#e63946', secondary: '#2563eb', accent: '#ffd166', aura: '#ff4d4d' },
      { name: 'Fire Mario White', primary: '#f8fafc', secondary: '#dc2626', accent: '#facc15', aura: '#fb923c' },
      { name: 'Champion Gold', primary: '#eab308', secondary: '#1e293b', accent: '#fef08a', aura: '#fde047' },
    ],
    stats: { speed: 1.0, jump: 1.0, power: 1.08, size: 1.0, weight: 1.0 },
    displayStats: { speed: 4, jump: 4, power: 4, weight: 3 },
  },
  {
    id: 'luigi',
    name: 'Luigi',
    title: 'High-Jump Striker',
    emblem: 'L',
    unlockedByDefault: true,
    unlockCost: 0,
    traitName: 'Super Jump',
    traitDesc: 'Highest jump arc in the Kingdom — rules the crossbar and aerial volleys.',
    hyperName: 'Green Thunder Cyclone',
    hyperStyle: 'vacuum_lob',
    primary: '#22c55e',
    secondary: '#1e3a8a',
    accent: '#a7f3d0',
    skin: '#ffd4a8',
    aura: '#34d399',
    particleColor: '#22c55e',
    voiceBase: 355,
    voiceStyle: 'lanky',
    kits: [
      { name: 'Classic Green & Navy', primary: '#22c55e', secondary: '#1e3a8a', accent: '#a7f3d0', aura: '#34d399' },
      { name: 'Poltergust Mint', primary: '#14b8a6', secondary: '#f8fafc', accent: '#fde047', aura: '#2dd4bf' },
      { name: 'Champion Gold', primary: '#facc15', secondary: '#065f46', accent: '#ffffff', aura: '#fde047' },
    ],
    stats: { speed: 0.98, jump: 1.15, power: 0.98, size: 1.12, weight: 0.94 },
    displayStats: { speed: 4, jump: 5, power: 3, weight: 3 },
  },
  {
    id: 'peach',
    name: 'Princess Peach',
    title: 'Royal Float Acrobat',
    emblem: '👑',
    unlockedByDefault: true,
    unlockCost: 0,
    traitName: 'Royal Hover',
    traitDesc: 'Hold Jump while airborne to float gracefully and line up volleys.',
    hyperName: 'Heart-Loop Meteor',
    hyperStyle: 'dip_meteor',
    primary: '#f472b6',
    secondary: '#db2777',
    accent: '#fde047',
    skin: '#ffe0bd',
    aura: '#f9a8d4',
    particleColor: '#ec4899',
    voiceBase: 470,
    voiceStyle: 'royal',
    kits: [
      { name: 'Royal Pink', primary: '#f472b6', secondary: '#db2777', accent: '#fde047', aura: '#f9a8d4' },
      { name: 'Swan White', primary: '#f8fafc', secondary: '#ec4899', accent: '#38bdf8', aura: '#f472b6' },
      { name: 'Daisy Sunburst', primary: '#fb923c', secondary: '#be185d', accent: '#fef08a', aura: '#fde047' },
    ],
    stats: { speed: 1.02, jump: 1.02, power: 0.96, size: 1.08, weight: 0.88, hoverDuration: 0.72 },
    displayStats: { speed: 4, jump: 5, power: 3, weight: 2 },
  },
  {
    id: 'yoshi',
    name: 'Yoshi',
    title: 'Flutter-Hop Dino',
    emblem: '🥚',
    unlockedByDefault: true,
    unlockCost: 0,
    traitName: 'Flutter Jump',
    traitDesc: 'Extra-high second jump with lightning-fast kick recovery.',
    hyperName: 'Rainbow Egg Barrage',
    hyperStyle: 'decoy_split',
    primary: '#84cc16',
    secondary: '#ef4444',
    accent: '#ffffff',
    skin: '#a3e635',
    aura: '#bef264',
    particleColor: '#f97316',
    voiceBase: 520,
    voiceStyle: 'dino',
    kits: [
      { name: 'Yoshi Island Green', primary: '#84cc16', secondary: '#ef4444', accent: '#ffffff', aura: '#bef264' },
      { name: 'Light Blue Yoshi', primary: '#38bdf8', secondary: '#f43f5e', accent: '#fef08a', aura: '#7dd3fc' },
      { name: 'Pink Yoshi', primary: '#f472b6', secondary: '#eab308', accent: '#ffffff', aura: '#fbcfe8' },
    ],
    stats: { speed: 1.13, jump: 1.06, doubleJumpBoost: 1.16, power: 0.95, size: 1.0, weight: 0.86 },
    displayStats: { speed: 5, jump: 5, power: 3, weight: 2 },
  },
  {
    id: 'wario',
    name: 'Wario',
    title: 'Garlic Powerhouse',
    emblem: 'W',
    unlockedByDefault: true,
    unlockCost: 0,
    traitName: 'Shoulder Barge',
    traitDesc: '35% stronger opponent knockback & heavy low drives.',
    hyperName: 'Garlic Thunder Cannon',
    hyperStyle: 'heavy_shock',
    primary: '#facc15',
    secondary: '#7e22ce',
    accent: '#f3e8ff',
    skin: '#ffcaa0',
    aura: '#c084fc',
    particleColor: '#a855f7',
    voiceBase: 195,
    voiceStyle: 'grumpy',
    kits: [
      { name: 'Classic Yellow & Purple', primary: '#facc15', secondary: '#7e22ce', accent: '#f3e8ff', aura: '#c084fc' },
      { name: 'WarioWare Biker Denim', primary: '#ef4444', secondary: '#1e3a8a', accent: '#fde047', aura: '#f87171' },
      { name: 'Treasure Mint', primary: '#4ade80', secondary: '#581c87', accent: '#fef08a', aura: '#86efac' },
    ],
    stats: { speed: 0.94, jump: 0.95, power: 1.15, size: 1.15, weight: 1.25, brawlBoost: 1.35 },
    displayStats: { speed: 3, jump: 3, power: 5, weight: 4 },
  },
  {
    id: 'bowser',
    name: 'Bowser',
    title: 'King of the Koopas',
    emblem: '🔥',
    unlockedByDefault: true,
    unlockCost: 0,
    traitName: 'Colossus Shell',
    traitDesc: 'Immense size, shell spikes, meteoric kick power & high stun armor.',
    hyperName: 'Giga Magma Crusher',
    hyperStyle: 'meteor_burn',
    primary: '#f59e0b',
    secondary: '#15803d',
    accent: '#dc2626',
    skin: '#fbbf24',
    aura: '#fb923c',
    particleColor: '#f59e0b',
    voiceBase: 130,
    voiceStyle: 'monster',
    kits: [
      { name: 'Molten Koopa King', primary: '#f59e0b', secondary: '#15803d', accent: '#dc2626', aura: '#fb923c' },
      { name: 'Dark Mecha Bowser', primary: '#6366f1', secondary: '#1e293b', accent: '#38bdf8', aura: '#818cf8' },
      { name: 'Dry Bowser Bone', primary: '#e2e8f0', secondary: '#991b1b', accent: '#facc15', aura: '#fca5a5' },
    ],
    stats: { speed: 0.88, jump: 0.92, power: 1.25, size: 1.38, weight: 1.5 },
    displayStats: { speed: 2, jump: 2, power: 5, weight: 5 },
  },
  // --- 6 UNLOCKABLE ALL-STAR STRIKERS ---
  {
    id: 'waluigi',
    name: 'Waluigi',
    title: 'Lanky Spin-Trickster',
    emblem: 'Γ',
    unlockedByDefault: false,
    unlockCost: 120,
    traitName: 'Whip Reach',
    traitDesc: '+20% long-leg kick reach & wicked curved topspin trajectories!',
    hyperName: 'Corkscrew Thorn Whip',
    hyperStyle: 'whip_curve',
    primary: '#7e22ce',
    secondary: '#1e293b',
    accent: '#facc15',
    skin: '#ffd6b0',
    aura: '#a855f7',
    particleColor: '#c084fc',
    voiceBase: 275,
    voiceStyle: 'lanky',
    kits: [
      { name: 'Velvet Violet', primary: '#7e22ce', secondary: '#1e293b', accent: '#facc15', aura: '#a855f7' },
      { name: 'Midnight Cyan', primary: '#0284c7', secondary: '#0f172a', accent: '#f472b6', aura: '#38bdf8' },
      { name: 'Rose Dandy', primary: '#be123c', secondary: '#1f2937', accent: '#fde047', aura: '#fb7185' },
    ],
    stats: { speed: 1.04, jump: 1.07, power: 1.0, size: 1.25, weight: 0.92, reachMult: 1.2, autoSpin: 1.0 },
    displayStats: { speed: 4, jump: 4, power: 4, weight: 2 },
  },
  {
    id: 'toad',
    name: 'Toad',
    title: 'Speedy Brigade Captain',
    emblem: '🍄',
    unlockedByDefault: false,
    unlockCost: 120,
    traitName: 'Trampoline Cap',
    traitDesc: 'Top sprint speed; balls bouncing off his mushroom cap shoot skyward!',
    hyperName: 'Mushroom Rocket Burst',
    hyperStyle: 'spore_pop',
    primary: '#ef4444',
    secondary: '#2563eb',
    accent: '#fde047',
    skin: '#ffe4c4',
    aura: '#fbbf24',
    particleColor: '#facc15',
    voiceBase: 550,
    voiceStyle: 'dino',
    kits: [
      { name: 'Classic Red Toad', primary: '#ef4444', secondary: '#2563eb', accent: '#fde047', aura: '#fbbf24' },
      { name: 'Toadette Pink', primary: '#ec4899', secondary: '#be185d', accent: '#ffffff', aura: '#f9a8d4' },
      { name: 'Captain Gold Lantern', primary: '#eab308', secondary: '#78350f', accent: '#fef08a', aura: '#fde047' },
    ],
    stats: { speed: 1.16, jump: 0.95, power: 0.94, size: 0.84, weight: 0.84, capBounce: true },
    displayStats: { speed: 5, jump: 3, power: 3, weight: 2 },
  },
  {
    id: 'donkey_kong',
    name: 'Donkey Kong',
    title: 'Jungle Barrel King',
    emblem: '🍌',
    unlockedByDefault: false,
    unlockCost: 160,
    traitName: 'Ground Pound Slam',
    traitDesc: 'Slamming Down onto turf sends a shockwave popping nearby balls!',
    hyperName: 'Jungle Barrel Smash',
    hyperStyle: 'quake_drive',
    primary: '#92400e',
    secondary: '#dc2626',
    accent: '#fde047',
    skin: '#d97706',
    aura: '#f97316',
    particleColor: '#fb923c',
    voiceBase: 145,
    voiceStyle: 'monster',
    kits: [
      { name: 'Classic Jungle Brown', primary: '#92400e', secondary: '#dc2626', accent: '#fde047', aura: '#f97316' },
      { name: 'Yeti Silverback', primary: '#cbd5e1', secondary: '#2563eb', accent: '#38bdf8', aura: '#93c5fd' },
      { name: 'Golden Banana', primary: '#ca8a04', secondary: '#15803d', accent: '#fef08a', aura: '#fde047' },
    ],
    stats: { speed: 0.96, jump: 0.98, power: 1.2, size: 1.32, weight: 1.4, seismicSlam: true },
    displayStats: { speed: 3, jump: 4, power: 5, weight: 5 },
  },
  {
    id: 'rosalina',
    name: 'Rosalina',
    title: 'Cosmic Star-Weaver',
    emblem: '✦',
    unlockedByDefault: false,
    unlockCost: 200,
    traitName: 'Star Orbit & Luma',
    traitDesc: 'Low personal gravity + orbiting Luma adds cosmic spark velocity!',
    hyperName: 'Supernova Laser-Stream',
    hyperStyle: 'zero_g_laser',
    primary: '#2dd4bf',
    secondary: '#0284c7',
    accent: '#fef08a',
    skin: '#fff1e6',
    aura: '#67e8f9',
    particleColor: '#38bdf8',
    voiceBase: 430,
    voiceStyle: 'royal',
    kits: [
      { name: 'Celestial Teal', primary: '#2dd4bf', secondary: '#0284c7', accent: '#fef08a', aura: '#67e8f9' },
      { name: 'Nebula Violet', primary: '#a855f7', secondary: '#312e81', accent: '#f9a8d4', aura: '#d8b4fe' },
      { name: 'Solar Eclipse', primary: '#1e293b', secondary: '#f59e0b', accent: '#fde047', aura: '#fbbf24' },
    ],
    stats: { speed: 1.0, jump: 1.08, power: 1.04, size: 1.22, weight: 0.9, gravScale: 0.82, hasLumi: true },
    displayStats: { speed: 4, jump: 5, power: 4, weight: 2 },
  },
  {
    id: 'king_boo',
    name: 'King Boo',
    title: 'Shadow Crown Phantom',
    emblem: '👻',
    unlockedByDefault: false,
    unlockCost: 220,
    traitName: 'Phantom Phase',
    traitDesc: 'Turns intangible during Dash — phases right through foes & hazards!',
    hyperName: 'Phantom Spirit Vanish',
    hyperStyle: 'vanish_shot',
    primary: '#e2e8f0',
    secondary: '#6366f1',
    accent: '#f43f5e',
    skin: '#f8fafc',
    aura: '#818cf8',
    particleColor: '#a5b4fc',
    voiceBase: 410,
    voiceStyle: 'royal',
    kits: [
      { name: 'Moonlit Ghost', primary: '#e2e8f0', secondary: '#6366f1', accent: '#f43f5e', aura: '#818cf8' },
      { name: 'Ecto Emerald', primary: '#86efac', secondary: '#065f46', accent: '#fde047', aura: '#34d399' },
      { name: 'Crimson Specter', primary: '#fda4af', secondary: '#881337', accent: '#fef08a', aura: '#fb7185' },
    ],
    stats: { speed: 1.03, jump: 1.1, power: 1.02, size: 1.14, weight: 0.82, gravScale: 0.85, phaseDash: true },
    displayStats: { speed: 4, jump: 5, power: 4, weight: 1 },
  },
  {
    id: 'bowser_jr',
    name: 'Bowser Jr.',
    title: 'Graffiti Shell Prodigy',
    emblem: '🖌',
    unlockedByDefault: false,
    unlockCost: 260,
    traitName: 'Junior Shell-Slide',
    traitDesc: 'Super-long turbo dash that bounces off stadium walls!',
    hyperName: 'Graffiti Rainbow Blitz',
    hyperStyle: 'ricochet_hyper',
    primary: '#fbbf24',
    secondary: '#22c55e',
    accent: '#ef4444',
    skin: '#fde68a',
    aura: '#f43f5e',
    particleColor: '#ec4899',
    voiceBase: 485,
    voiceStyle: 'dino',
    kits: [
      { name: 'Fang Bib Classic', primary: '#fbbf24', secondary: '#22c55e', accent: '#ef4444', aura: '#f43f5e' },
      { name: 'Neon Splatter', primary: '#38bdf8', secondary: '#a855f7', accent: '#fde047', aura: '#e879f9' },
      { name: 'Dark Koopa Prince', primary: '#f8fafc', secondary: '#dc2626', accent: '#eab308', aura: '#fbbf24' },
    ],
    stats: { speed: 1.1, jump: 1.04, power: 1.06, size: 0.88, weight: 0.95, shellSlide: true },
    displayStats: { speed: 5, jump: 4, power: 4, weight: 3 },
  },
];
const ITEMS = [
  // Classic 10 Authentic Mario Items
  {
    id: 'RedMushroom',
    name: 'Super Mushroom',
    desc: 'Grow 2.1x huge with booming reach, tackle armor & shot power for 6s!',
    color: '#ef4444',
    weight: 12,
    competitive: true,
  },
  {
    id: 'TinyMushroom',
    name: 'Mini Mushroom',
    desc: 'Shrink nimble with +35% turbo speed & lightning hops!',
    color: '#38bdf8',
    weight: 10,
    competitive: true,
  },
  {
    id: 'IceFlower',
    name: 'Ice Flower',
    desc: 'Freezes balls mid-air in crystal ice for 3s — line up an aerial smash!',
    color: '#06b6d4',
    weight: 11,
    competitive: true,
  },
  {
    id: 'FireFlower',
    name: 'Fire Flower',
    desc: 'Ignites a blazing fireball that scorches rivals on touch!',
    color: '#f97316',
    weight: 11,
    competitive: true,
  },
  {
    id: 'EnlargeBall',
    name: 'Mega Mushroom',
    desc: 'Inflates the ball to a giant boulder size for 6s!',
    color: '#eab308',
    weight: 10,
    competitive: true,
  },
  {
    id: 'GreenShell',
    name: 'Green Shell',
    desc: 'Fires a bouncing emerald shell across the pitch floor!',
    color: '#22c55e',
    weight: 12,
    competitive: true,
  },
  {
    id: 'BulletBill',
    name: 'Bullet Bill',
    desc: 'Calls an airstrike of 6 cannon torpedoes charging across the pitch!',
    color: '#475569',
    weight: 9,
    competitive: true,
  },
  {
    id: 'POW',
    name: 'POW Block',
    desc: 'Ground-pound tremor stuns grounded rivals & seals your net for 4.5s!',
    color: '#3b82f6',
    weight: 9,
    competitive: true,
  },
  {
    id: 'GoalKeeper',
    name: 'Toad Goalkeeper',
    desc: 'Summons a bouncy Toad goalie in front of your net for 7s!',
    color: '#ec4899',
    weight: 10,
    competitive: true,
  },
  {
    id: '1UP',
    name: '1-Up Mushroom',
    desc: 'Rare jackpot! Instantly awards +1 bonus score to your team!',
    color: '#10b981',
    weight: 4,
    competitive: false,
  },
  // 8 Deluxe Mario All-Star Power-Ups!
  {
    id: 'SuperStar',
    name: 'Super Star',
    desc: '5s rainbow invincibility, +30% speed & tackle foes on contact!',
    color: '#facc15',
    weight: 8,
    competitive: true,
  },
  {
    id: 'ChainHound',
    name: 'Chain Chomp',
    desc: 'Tethers an iron-jawed Chain Chomp lunging at opposing strikers!',
    color: '#64748b',
    weight: 9,
    competitive: true,
  },
  {
    id: 'BananaBunch',
    name: 'Triple Bananas',
    desc: 'Tosses 3 slippery peels across the pitch that spin out rivals!',
    color: '#fde047',
    weight: 11,
    competitive: true,
  },
  {
    id: 'MagnetGlove',
    name: 'Magnet Glove',
    desc: 'Curves & magnetically pulls balls toward your striker for 3.8s!',
    color: '#e11d48',
    weight: 10,
    competitive: true,
  },
  {
    id: 'ShadowClone',
    name: 'Double Cherry',
    desc: 'Clones an exact AI striker double to assist in 2v1 volleys for 7s!',
    color: '#8b5cf6',
    weight: 8,
    competitive: true,
  },
  {
    id: 'ThunderZapper',
    name: 'Lightning Bolt',
    desc: 'Strikes opposing players with lightning, shrinking and stunning them!',
    color: '#eab308',
    weight: 8,
    competitive: true,
  },
  {
    id: 'WarpPipe',
    name: 'Warp Pipe',
    desc: 'Teleports & swaps positions with your rival in a green pipe swoosh!',
    color: '#16a34a',
    weight: 8,
    competitive: true,
  },
  {
    id: 'TriBall',
    name: 'Multi-Moon Ball',
    desc: 'Splits the active ball into 3 real scoring balls!',
    color: '#f43f5e',
    weight: 6,
    competitive: false,
  },
];
const ARENAS = [
  {
    id: 'meadow',
    name: 'Mushroom Kingdom Pitch',
    subtitle: 'Classic Super Mario Football',
    desc: 'Faithful recessed side-goals, crisp turf bounce & sunlit hills.',
    bgKey: 'arena_meadow',
    musicKey: 'meadow',
    skyTop: '#2589f5',
    skyBottom: '#9be7ff',
    turfColor: '#34c759',
    turfHighlight: '#7bf178',
    earthColor: '#8d5524',
    earthDark: '#5c3614',
    trimColor: '#e9c46a',
    goalFloorY: 742,
    goalCeilingY: 406,
    pitchFloorY: 966,
    pitchLeftX: 330,
    pitchRightX: 1590,
    goalBackLeftX: 44,
    goalBackRightX: 1876,
    goalLineLeftX: 192,
    goalLineRightX: 1728,
    platforms: [],
    wallBounce: 0.84,
    groundFriction: 1.0,
    gravityScale: 1.0,
    hazardType: 'none',
  },
  {
    id: 'sky',
    name: 'Cloud Kingdom',
    subtitle: 'Sky Garden Aerial Pitch',
    desc: 'Elevated cloud-decks add floating flank platforms for wild volleys!',
    bgKey: 'arena_sky',
    musicKey: 'sky',
    skyTop: '#f97316',
    skyBottom: '#fde68a',
    turfColor: '#38bdf8',
    turfHighlight: '#bae6fd',
    earthColor: '#cbd5e1',
    earthDark: '#64748b',
    trimColor: '#fbbf24',
    goalFloorY: 742,
    goalCeilingY: 406,
    pitchFloorY: 966,
    pitchLeftX: 330,
    pitchRightX: 1590,
    goalBackLeftX: 44,
    goalBackRightX: 1876,
    goalLineLeftX: 192,
    goalLineRightX: 1728,
    platforms: [
      { x: 640, y: 650, w: 230, h: 22, passThrough: true },
      { x: 1280, y: 650, w: 230, h: 22, passThrough: true },
    ],
    wallBounce: 0.88,
    groundFriction: 1.0,
    gravityScale: 0.96,
    hazardType: 'none',
  },
  {
    id: 'castle',
    name: "Bowser's Castle",
    subtitle: 'Magma Keep Ricochet Pitch',
    desc: 'Wider goal mouths & lively basalt walls built for bank-shot chaos!',
    bgKey: 'arena_castle',
    musicKey: 'castle',
    skyTop: '#311042',
    skyBottom: '#9a3412',
    turfColor: '#f97316',
    turfHighlight: '#fdba74',
    earthColor: '#334155',
    earthDark: '#1e293b',
    trimColor: '#ef4444',
    goalFloorY: 748,
    goalCeilingY: 388,
    pitchFloorY: 966,
    pitchLeftX: 330,
    pitchRightX: 1590,
    goalBackLeftX: 44,
    goalBackRightX: 1876,
    goalLineLeftX: 192,
    goalLineRightX: 1728,
    platforms: [{ x: 960, y: 590, w: 260, h: 22, passThrough: true }],
    wallBounce: 0.93,
    groundFriction: 1.0,
    gravityScale: 1.0,
    hazardType: 'lava_geysers',
  },
  {
    id: 'manor',
    name: "Luigi's Mansion",
    subtitle: 'Phantom Ballroom Pitch',
    desc: 'Upper Portrait Portals teleport high bank-shots across the ballroom!',
    bgKey: 'arena_manor',
    musicKey: 'manor',
    skyTop: '#1e1b4b',
    skyBottom: '#4c1d95',
    turfColor: '#8b5cf6',
    turfHighlight: '#ddd6fe',
    earthColor: '#312e81',
    earthDark: '#1e1b4b',
    trimColor: '#2dd4bf',
    goalFloorY: 742,
    goalCeilingY: 406,
    pitchFloorY: 966,
    pitchLeftX: 330,
    pitchRightX: 1590,
    goalBackLeftX: 44,
    goalBackRightX: 1876,
    goalLineLeftX: 192,
    goalLineRightX: 1728,
    platforms: [
      { x: 690, y: 615, w: 200, h: 20, passThrough: true },
      { x: 1230, y: 615, w: 200, h: 20, passThrough: true },
    ],
    wallBounce: 0.86,
    groundFriction: 0.95,
    gravityScale: 0.94,
    hazardType: 'warp_portals',
  },
  {
    id: 'jungle',
    name: 'DK Jungle',
    subtitle: 'Canopy Drums Pitch',
    desc: 'Springy tribal drum-pads launch players & balls into aerial combos!',
    bgKey: 'arena_jungle',
    musicKey: 'jungle',
    skyTop: '#065f46',
    skyBottom: '#a3e635',
    turfColor: '#65a30d',
    turfHighlight: '#bef264',
    earthColor: '#713f12',
    earthDark: '#422006',
    trimColor: '#f59e0b',
    goalFloorY: 742,
    goalCeilingY: 406,
    pitchFloorY: 966,
    pitchLeftX: 330,
    pitchRightX: 1590,
    goalBackLeftX: 44,
    goalBackRightX: 1876,
    goalLineLeftX: 192,
    goalLineRightX: 1728,
    platforms: [],
    wallBounce: 0.88,
    groundFriction: 1.0,
    gravityScale: 1.0,
    hazardType: 'drum_pads',
  },
  {
    id: 'glacier',
    name: 'Sherbet Land',
    subtitle: 'Frostbite Ice Drift Pitch',
    desc: 'Slippery crystal ice turf for wild drifts & falling ceiling icicles!',
    bgKey: 'arena_glacier',
    musicKey: 'glacier',
    skyTop: '#0c4a6e',
    skyBottom: '#7dd3fc',
    turfColor: '#38bdf8',
    turfHighlight: '#f0f9ff',
    earthColor: '#0369a1',
    earthDark: '#0c4a6e',
    trimColor: '#bae6fd',
    goalFloorY: 742,
    goalCeilingY: 406,
    pitchFloorY: 966,
    pitchLeftX: 330,
    pitchRightX: 1590,
    goalBackLeftX: 44,
    goalBackRightX: 1876,
    goalLineLeftX: 192,
    goalLineRightX: 1728,
    platforms: [{ x: 960, y: 660, w: 240, h: 20, passThrough: true }],
    wallBounce: 0.9,
    groundFriction: 0.24, // Slick ice drift!
    gravityScale: 1.0,
    hazardType: 'icicles',
  },
  {
    id: 'cosmos',
    name: "Rosalina's Comet Observatory",
    subtitle: 'Cosmic Zero-G Turbo Pitch',
    desc: 'Floaty starlight gravity & a central Accelerator Hoop that supercharges shots!',
    bgKey: 'arena_cosmos',
    musicKey: 'cosmos',
    skyTop: '#090d16',
    skyBottom: '#3b0764',
    turfColor: '#c084fc',
    turfHighlight: '#f3e8ff',
    earthColor: '#1e1b4b',
    earthDark: '#0f172a',
    trimColor: '#fde047',
    goalFloorY: 742,
    goalCeilingY: 406,
    pitchFloorY: 966,
    pitchLeftX: 330,
    pitchRightX: 1590,
    goalBackLeftX: 44,
    goalBackRightX: 1876,
    goalLineLeftX: 192,
    goalLineRightX: 1728,
    platforms: [
      { x: 610, y: 620, w: 200, h: 20, passThrough: true },
      { x: 1310, y: 620, w: 200, h: 20, passThrough: true },
    ],
    wallBounce: 0.91,
    groundFriction: 0.9,
    gravityScale: 0.76,
    hazardType: 'gravity_ring',
  },
  {
    id: 'random',
    name: 'Mystery Stadium',
    subtitle: 'Random Hazard Stadium',
    desc: 'Surprise venue! A random hazard pitch will be chosen for kickoff.',
    bgKey: 'arena_meadow',
    musicKey: 'meadow',
    isRandom: true,
    skyTop: '#312e81',
    skyBottom: '#7c3aed',
    turfColor: '#eab308',
    turfHighlight: '#fef08a',
    earthColor: '#1e1b4b',
    earthDark: '#0f172a',
    trimColor: '#fde047',
    goalFloorY: 742,
    goalCeilingY: 406,
    pitchFloorY: 966,
    pitchLeftX: 330,
    pitchRightX: 1590,
    goalBackLeftX: 44,
    goalBackRightX: 1876,
    goalLineLeftX: 192,
    goalLineRightX: 1728,
    platforms: [],
    wallBounce: 0.84,
    groundFriction: 1.0,
    gravityScale: 1.0,
    hazardType: 'none',
  },
];
const MUTATORS = [
  { id: 'bigHead', name: 'Big Head Mode', icon: '🗿', desc: '2x oversized bobble-heads on every striker!' },
  { id: 'moonGravity', name: 'Moon Gravity', icon: '🌙', desc: 'Floaty 0.58x low-gravity aerial rallies!' },
  { id: 'multiBall', name: 'Double-Ball Pitch', icon: '⚽⚽', desc: 'Always keeps 2 live balls in play at once!' },
  { id: 'rugbyBall', name: 'Egg-Ball Chaos', icon: '🏉', desc: 'Oblong rugby ball with crazy unpredictable bounces!' },
  { id: 'pinballBumpers', name: 'Pinball Bumpers', icon: '🛎️', desc: 'Glowing arcade bumpers in midfield!' },
  { id: 'turboMode', name: 'Hyper-Turbo', icon: '⚡', desc: '+32% movement speed, instant charge & rapid dashes!' },
  { id: 'floorIsLava', name: 'Molten Turf', icon: '🌋', desc: 'Central pitch sizzles grounded players & pops balls upward!' },
  { id: 'ironBall', name: 'Heavy Iron Core', icon: '⚓', desc: 'Dense 1.6x heavy ball that plummets fast and crushes keepers!' },
  { id: 'curvedWorld', name: 'Magnus Mayhem', icon: '🌀', desc: 'Extreme 2.8x aerodynamic curve spin on every strike!' },
];
const GRAND_PRIX_CUPS = [
  {
    id: 'meadow_cup',
    name: 'Mushroom Cup',
    icon: '🍄',
    difficulty: 'Rookie → Striker',
    rewardCoins: 120,
    unlocksChar: 'waluigi',
    rounds: [
      { arenaId: 'meadow', foeId: 'luigi', ai: 'rookie', bossScale: 1.0 },
      { arenaId: 'sky', foeId: 'yoshi', ai: 'striker', bossScale: 1.0 },
      { arenaId: 'meadow', foeId: 'waluigi', ai: 'striker', bossScale: 1.08, title: 'RIVAL BOSS: WALUIGI' },
    ],
  },
  {
    id: 'sky_cup',
    name: 'Flower Cup',
    icon: '🌸',
    difficulty: 'Striker → All-Star',
    rewardCoins: 160,
    unlocksChar: 'donkey_kong',
    rounds: [
      { arenaId: 'sky', foeId: 'peach', ai: 'striker', bossScale: 1.0 },
      { arenaId: 'jungle', foeId: 'toad', ai: 'pro', bossScale: 1.0 },
      { arenaId: 'jungle', foeId: 'donkey_kong', ai: 'pro', bossScale: 1.18, title: 'JUNGLE BOSS: DONKEY KONG' },
    ],
  },
  {
    id: 'haunted_cup',
    name: 'Star Cup',
    icon: '🌟',
    difficulty: 'All-Star',
    rewardCoins: 220,
    unlocksChar: 'king_boo',
    rounds: [
      { arenaId: 'glacier', foeId: 'wario', ai: 'pro', bossScale: 1.0 },
      { arenaId: 'castle', foeId: 'bowser', ai: 'pro', bossScale: 1.0 },
      { arenaId: 'manor', foeId: 'king_boo', ai: 'pro', bossScale: 1.2, title: 'MANOR BOSS: KING BOO' },
    ],
  },
  {
    id: 'cosmic_cup',
    name: 'Special Cup',
    icon: '👑',
    difficulty: 'All-Star → Legend',
    rewardCoins: 350,
    unlocksChar: 'bowser_jr',
    rounds: [
      { arenaId: 'glacier', foeId: 'rosalina', ai: 'pro', bossScale: 1.0 },
      { arenaId: 'manor', foeId: 'bowser_jr', ai: 'pro', bossScale: 1.05 },
      { arenaId: 'cosmos', foeId: 'waluigi', ai: 'legend', bossScale: 1.0 },
      { arenaId: 'castle', foeId: 'bowser', ai: 'legend', bossScale: 1.45, kitIdx: 1, title: 'FINAL BOSS: GIGA BOWSER!' },
    ],
  },
];
const BALL_SKINS = [
  { id: 'classic', name: 'Classic Striker', cost: 0, primary: '#ffffff', panel: '#1e293b' },
  { id: 'gold_star', name: 'Super Star Gold', cost: 100, primary: '#fef08a', panel: '#ca8a04' },
  { id: 'watermelon', name: 'Yoshi Island Melon', cost: 120, primary: '#4ade80', panel: '#14532d', core: '#f43f5e' },
  { id: 'iron_spike', name: 'Spike Iron-Core', cost: 150, primary: '#94a3b8', panel: '#0f172a' },
  { id: 'beach_orb', name: 'Cheep-Cheep Beachball', cost: 120, primary: '#ffffff', panel: '#ef4444', altPanel: '#38bdf8' },
  { id: 'cosmic_nebula', name: 'Comet Observatory Orb', cost: 200, primary: '#e9d5ff', panel: '#6b21a8' },
];
const GOAL_EXPLOSIONS = [
  { id: 'confetti', name: 'Stadium Confetti', cost: 0, colors: ['#ef4444', '#facc15', '#22c55e', '#38bdf8', '#f472b6'] },
  { id: 'fireworks', name: 'Golden Fireworks', cost: 100, colors: ['#fde047', '#fb923c', '#ffffff', '#facc15'] },
  { id: 'frost_nova', name: 'Ice Flower Nova', cost: 120, colors: ['#ecfeff', '#67e8f9', '#38bdf8', '#0284c7'] },
  { id: 'flame_pillars', name: 'Bowser Inferno', cost: 140, colors: ['#fef08a', '#f97316', '#ef4444', '#991b1b'] },
  { id: 'coin_shower', name: 'Question-Block Gold Coins', cost: 180, colors: ['#fef08a', '#facc15', '#eab308', '#ca8a04'] },
  { id: 'rainbow_wave', name: 'Rainbow Road Starlight', cost: 220, colors: ['#f43f5e', '#facc15', '#4ade80', '#38bdf8', '#c084fc'] },
];
const TROPHIES = [
  { id: 'first_goal', name: 'First Kick!', desc: 'Score your very first goal.', reward: 25 },
  { id: 'hat_trick', name: 'Hat-Trick Hero', desc: 'Score 3+ goals in a single match.', reward: 35 },
  { id: 'goal_frenzy', name: 'Goal Machine', desc: 'Score 7+ goals in a single match.', reward: 50 },
  { id: 'first_parry', name: 'Golden Reflex', desc: 'Pull off a Perfect Parry against a fast shot.', reward: 40 },
  { id: 'hyper_unleashed', name: 'Hyper-Striker!', desc: 'Unleash a full-meter Signature Hyper-Strike.', reward: 40 },
  { id: 'brick_wall', name: 'Brick-Wall Keeper', desc: 'Make 4+ Epic Saves in one match.', reward: 45 },
  { id: 'heavy_brawler', name: 'Pitch Enforcer', desc: 'Knock out opponents 5+ times in a match.', reward: 35 },
  { id: 'team_chemistry', name: 'Combo Voltage', desc: 'Trigger a 2v2 Team Combo Pass.', reward: 40 },
  { id: 'item_chef', name: 'Sky-Courier Regular', desc: 'Activate 4+ power-ups in one match.', reward: 30 },
  { id: 'sudden_victor', name: 'Clutch Overtime', desc: 'Win a match in Sudden Death.', reward: 50 },
  { id: 'clean_sheet', name: 'Shutout Victory', desc: 'Win a match without conceding a single goal.', reward: 60 },
  { id: 'legend_slayer', name: 'Legend Slayer', desc: 'Defeat a Legend CPU in 1v1.', reward: 100 },
  { id: 'cup_meadow', name: 'Mushroom Cup Champion', desc: 'Conquer the Mushroom Cup.', reward: 60 },
  { id: 'cup_sky', name: 'Flower Cup Champion', desc: 'Conquer the Flower Cup.', reward: 75 },
  { id: 'cup_haunted', name: 'Star Cup Champion', desc: 'Conquer the Star Cup.', reward: 90 },
  { id: 'cup_cosmic', name: 'Special Cup Grand Champion', desc: 'Defeat Giga Bowser in the Special Cup!', reward: 150 },
  { id: 'coop_champ', name: 'Dynamic Duo', desc: 'Win any match or Cup in 2v2 / Co-op mode.', reward: 50 },
  { id: 'tourney_king', name: 'Bracket Boss', desc: 'Win a Party Knockout Tournament.', reward: 75 },
  { id: 'target_ace', name: 'Sharpshooter', desc: 'Score 2,500+ pts in Target Blitz.', reward: 50 },
  { id: 'keepup_pro', name: 'Lava Juggler', desc: 'Survive 45+ seconds in Keep-Up Survival.', reward: 60 },
  { id: 'gauntlet_wall', name: 'Iron Gloves', desc: 'Save 15+ cannon shots in Goalie Gauntlet.', reward: 60 },
  { id: 'mutator_madness', name: 'Mad Scientist', desc: 'Play a match with 3+ Party Mutators active.', reward: 35 },
  { id: 'collector', name: 'Full Squad', desc: 'Unlock all 12 playable strikers.', reward: 100 },
  { id: 'fashionista', name: 'Style Icon', desc: 'Unlock a custom Ball Skin and Goal Explosion.', reward: 50 },
  { id: 'trial_initiate', name: 'Dojo Initiate', desc: 'Conquer your first Striker Trial.', reward: 50 },
  { id: 'trial_grandmaster', name: 'Kung-Foot Grandmaster', desc: 'Conquer all 8 Striker Trials with Star Medals!', reward: 200 },
];
const STRIKER_TRIALS = [
  {
    id: 'trial_meteor',
    num: 1,
    title: 'Meteor Spike Master',
    icon: '⚡',
    desc: 'Score 2 goals using mid-air Ground Pound Meteor Spikes!',
    arenaId: 'meadow',
    targetScore: 2,
    playerChar: 'mario',
    opponents: [{ charId: 'luigi', team: 1, aiDifficulty: 'striker' }],
    specialRule: 'meteor_spikes',
    ruleText: 'Only goals scored via Meteor Spike count toward victory!',
    rewardCoins: 80,
  },
  {
    id: 'trial_walljump',
    num: 2,
    title: 'Wall-Jump Acrobatics',
    icon: '🧗',
    desc: 'Perform 3 Wall-Jumps and win against Yoshi in the Jungle canopy!',
    arenaId: 'jungle',
    targetScore: 3,
    playerChar: 'waluigi',
    opponents: [{ charId: 'yoshi', team: 1, aiDifficulty: 'striker' }],
    specialRule: 'wall_jumps',
    requiredWallJumps: 3,
    ruleText: 'Must perform at least 3 Wall-Jumps to claim the Star!',
    rewardCoins: 90,
  },
  {
    id: 'trial_parry',
    num: 3,
    title: 'The Golden Wall',
    icon: '🛡️',
    desc: 'Execute 3 Perfect Parries against Bowser and maintain a shutout!',
    arenaId: 'castle',
    targetScore: 2,
    playerChar: 'peach',
    opponents: [{ charId: 'bowser', team: 1, aiDifficulty: 'pro' }],
    specialRule: 'parry_shutout',
    requiredParries: 3,
    ruleText: 'Concede 0 goals and land at least 3 Perfect Parries!',
    rewardCoins: 110,
  },
  {
    id: 'trial_multiball',
    num: 4,
    title: 'Twin-Ball Pitch Panic',
    icon: '⚽⚽',
    desc: 'Juggle two live balls against the heavyweight duo Donkey Kong & Wario!',
    arenaId: 'meadow',
    targetScore: 5,
    playerChar: 'toad',
    opponents: [
      { charId: 'donkey_kong', team: 1, aiDifficulty: 'striker' },
      { charId: 'wario', team: 1, aiDifficulty: 'striker' },
    ],
    mutators: ['multiBall'],
    ruleText: 'Two balls in play simultaneously — first to 5 wins!',
    rewardCoins: 120,
  },
  {
    id: 'trial_lava',
    num: 5,
    title: 'Molten Turf Aerialist',
    icon: '🌋',
    desc: 'Win without ever touching the molten pitch floor!',
    arenaId: 'castle',
    targetScore: 3,
    playerChar: 'rosalina',
    opponents: [{ charId: 'bowser_jr', team: 1, aiDifficulty: 'striker' }],
    mutators: ['floorIsLava'],
    ruleText: 'Stay on platforms or in the air — touching lava bounces you!',
    rewardCoins: 130,
  },
  {
    id: 'trial_giant_bowser',
    num: 6,
    title: 'Colossus Giga Bowser',
    icon: '👑',
    desc: 'Defeat a massive 1.8x Giant Boss Bowser on All-Star difficulty!',
    arenaId: 'castle',
    targetScore: 4,
    playerChar: 'mario',
    opponents: [{ charId: 'bowser', team: 1, bossScale: 1.8, aiDifficulty: 'pro' }],
    ruleText: 'Bowser has massive reach and devastating shot power!',
    rewardCoins: 160,
  },
  {
    id: 'trial_shadow',
    num: 7,
    title: 'Shadow Doppelganger',
    icon: '👥',
    desc: 'Conquer your dark mirror image on Kung-Foot Legend difficulty!',
    arenaId: 'cosmos',
    targetScore: 3,
    playerChar: 'luigi',
    opponents: [{ charId: 'luigi', kitIdx: 1, team: 1, aiDifficulty: 'legend' }],
    ruleText: 'Facing an unbeatable reflection with frame-perfect reflexes!',
    rewardCoins: 180,
  },
  {
    id: 'trial_legend_handicap',
    num: 8,
    title: 'Grandmaster Kung-Foot Trial',
    icon: '🏆',
    desc: '1v2 Handicap showdown against Waluigi & King Boo on Legend difficulty!',
    arenaId: 'manor',
    targetScore: 4,
    playerChar: 'mario',
    opponents: [
      { charId: 'waluigi', team: 1, aiDifficulty: 'legend' },
      { charId: 'king_boo', team: 1, aiDifficulty: 'legend' },
    ],
    ruleText: 'The ultimate test of Kung-Foot mastery. Unlocks 250 coins & Grand Champion Trophy!',
    rewardCoins: 250,
  },
];
const BALL_PRESETS = {
  balanced: { label: 'Balanced Arcade', gravity: 1280, restitution: 0.84, airDrag: 0.996, radius: 38, kickMultiplier: 1.0 },
  bouncy: { label: 'Bouncy Beach-Orb', gravity: 960, restitution: 0.94, airDrag: 0.997, radius: 42, kickMultiplier: 1.08 },
  heavy: { label: 'Heavy Striker Leather', gravity: 1580, restitution: 0.74, airDrag: 0.994, radius: 36, kickMultiplier: 0.95 },
  pinball: { label: 'Pinball Turbo', gravity: 1220, restitution: 0.96, airDrag: 0.9985, radius: 35, kickMultiplier: 1.22 },
};
const AI_DIFFICULTIES = {
  rookie: { label: 'Rookie', reactionDelay: 0.24, aimJitter: 0.25, aggression: 0.42, useCharge: 0.08, useSpike: 0.15, useDash: 0.1, itemSmartness: 0.4 },
  striker: { label: 'Striker', reactionDelay: 0.13, aimJitter: 0.12, aggression: 0.62, useCharge: 0.26, useSpike: 0.45, useDash: 0.35, itemSmartness: 0.72 },
  pro: { label: 'All-Star', reactionDelay: 0.06, aimJitter: 0.05, aggression: 0.78, useCharge: 0.5, useSpike: 0.72, useDash: 0.62, itemSmartness: 0.9 },
  legend: { label: 'Kung-Foot Legend', reactionDelay: 0.02, aimJitter: 0.015, aggression: 0.92, useCharge: 0.72, useSpike: 0.9, useDash: 0.86, itemSmartness: 1.0 },
};
const DEFAULT_CONTROLS = {
  p1: {
    left: ['KeyA'],
    right: ['KeyD'],
    up: ['KeyW'],
    down: ['KeyS'],
    kick: ['Space', 'KeyF'],
    lob: ['KeyG'],
    item: ['KeyE', 'KeyH'],
    dash: ['ShiftLeft', 'KeyQ'],
  },
  p2: {
    left: ['ArrowLeft'],
    right: ['ArrowRight'],
    up: ['ArrowUp'],
    down: ['ArrowDown'],
    kick: ['Enter', 'Numpad1', 'Comma'],
    lob: ['Numpad2'],
    item: ['Slash', 'Numpad3', 'Backslash'],
    dash: ['ShiftRight', 'Numpad0', 'Period', 'ControlRight'],
  },
  p3: {
    left: ['KeyJ'],
    right: ['KeyL'],
    up: ['KeyI'],
    down: ['KeyK'],
    kick: ['KeyU'],
    lob: ['KeyO'],
    item: ['KeyP'],
    dash: ['KeyN'],
  },
  p4: {
    left: ['Numpad4'],
    right: ['Numpad6'],
    up: ['Numpad8'],
    down: ['Numpad5'],
    kick: ['Numpad7'],
    lob: ['Numpad9'],
    item: ['NumpadAdd'],
    dash: ['NumpadDecimal'],
  },
};
const DEFAULT_SETTINGS = {
  matchDuration: 120,
  scoreLimit: 0,
  suddenDeathMode: 'golden',
  itemMode: 'standard',
  ballPreset: 'balanced',
  aiDifficulty: 'striker',
  hyperStrikes: true,
  stageHazards: true,
  partyUnlockAll: false,
  equippedBallSkin: 'classic',
  equippedGoalExplosion: 'confetti',
  activeMutators: [],
  screenShake: 1.0,
  hitstop: true,
  goalSlowMo: true,
  touchControls: 'auto',
  masterVolume: 0.8,
  musicVolume: 0.55,
  sfxVolume: 0.85,
  muted: false,
};

const STORAGE_KEY = 'super_kick_kingdom_deluxe_v2';
function loadSaveData() {
  const defaultUnlockedChars = CHARACTERS.filter((c) => c.unlockedByDefault).map((c) => c.id);
  const base = {
    settings: { ...DEFAULT_SETTINGS, activeMutators: [] },
    controls: JSON.parse(JSON.stringify(DEFAULT_CONTROLS)),
    coins: 150, // Welcome starter purse so players can try the Locker Room right away!
    unlockedChars: defaultUnlockedChars,
    unlockedBalls: ['classic'],
    unlockedExplosions: ['confetti'],
    wonCups: [],
    trialsWon: [],
    trophies: [],
    stats: {
      totalGoals: 0,
      matchesPlayed: 0,
      targetBestScore: 0,
      keepUpBestTime: 0,
      gauntletBestSaves: 0,
      cupsWon: 0,
    },
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    return {
      ...base,
      ...parsed,
      settings: { ...base.settings, ...(parsed.settings || {}) },
      controls: {
        p1: { ...DEFAULT_CONTROLS.p1, ...(parsed.controls?.p1 || {}) },
        p2: { ...DEFAULT_CONTROLS.p2, ...(parsed.controls?.p2 || {}) },
        p3: { ...DEFAULT_CONTROLS.p3, ...(parsed.controls?.p3 || {}) },
        p4: { ...DEFAULT_CONTROLS.p4, ...(parsed.controls?.p4 || {}) },
      },
      unlockedChars: Array.from(new Set([...defaultUnlockedChars, ...(parsed.unlockedChars || [])])),
      unlockedBalls: Array.from(new Set(['classic', ...(parsed.unlockedBalls || [])])),
      unlockedExplosions: Array.from(new Set(['confetti', ...(parsed.unlockedExplosions || [])])),
      wonCups: parsed.wonCups || [],
      trialsWon: parsed.trialsWon || [],
      trophies: parsed.trophies || [],
      stats: { ...base.stats, ...(parsed.stats || {}) },
    };
  } catch {
    return base;
  }
}
function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}
function getCharacter(id, kitIdx = 0) {
  const base = CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
  const kit = base.kits?.[kitIdx % base.kits.length];
  if (!kit) return base;
  return {
    ...base,
    primary: kit.primary,
    secondary: kit.secondary,
    accent: kit.accent,
    aura: kit.aura || base.aura,
    kitName: kit.name,
    kitIdx: kitIdx % base.kits.length,
  };
}
function getArena(id) {
  return ARENAS.find((a) => a.id === id) || ARENAS[0];
}
function isCharUnlocked(save, charId) {
  if (save?.settings?.partyUnlockAll) return true;
  return Boolean(save?.unlockedChars?.includes(charId));
}


// === src/audio.js ===
// Super Kick Kingdom 2.0 (Deluxe Edition) — Procedural WebAudio Sound & Biome Music Engine
// 100% original synthesized arcade SFX, 7 distinct stadium soundtracks, Hyper-Strike & Parry audio
class AudioEngine {
  constructor(settings) {
    this.settings = settings;
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.noiseBuffer = null;

    this.currentTrack = null;
    this.musicTimer = null;
    this.stepIndex = 0;
    this.urgentTempo = false;
  }

  unlock() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      // Gentle compressor keeps big chaotic moments punchy without clipping
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.knee.value = 18;
      comp.ratio.value = 6;
      comp.attack.value = 0.005;
      comp.release.value = 0.15;

      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(comp);
      comp.connect(this.ctx.destination);

      this._buildNoiseBuffer();
      this.syncVolumes();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  _buildNoiseBuffer() {
    const sr = this.ctx.sampleRate;
    const len = sr * 1.5;
    const buf = this.ctx.createBuffer(1, len, sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buf;
  }

  syncVolumes() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const master = this.settings.muted ? 0 : this.settings.masterVolume;
    this.masterGain.gain.setTargetAtTime(master, now, 0.02);
    this.musicGain.gain.setTargetAtTime(this.settings.musicVolume * 0.42, now, 0.03);
    this.sfxGain.gain.setTargetAtTime(this.settings.sfxVolume, now, 0.02);
  }

  toggleMute() {
    this.settings.muted = !this.settings.muted;
    this.syncVolumes();
    return this.settings.muted;
  }

  _tone({
    freq = 440,
    endFreq = null,
    type = 'triangle',
    duration = 0.12,
    gain = 0.25,
    attack = 0.004,
    delay = 0,
    dest = null,
  }) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freq), t0);
    if (endFreq !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t0 + duration);
    }
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(g);
    g.connect(dest || this.sfxGain);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  _noise({
    duration = 0.12,
    gain = 0.2,
    filterType = 'bandpass',
    freq = 1200,
    q = 1.2,
    delay = 0,
    dest = null,
  }) {
    if (!this.ctx || !this.noiseBuffer) return;
    const t0 = this.ctx.currentTime + delay;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(freq, t0);
    filter.Q.value = q;

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    src.connect(filter);
    filter.connect(g);
    g.connect(dest || this.sfxGain);
    src.start(t0);
    src.stop(t0 + duration + 0.02);
  }

  // --- UI & Locker Room Sounds ---
  playHover() {
    this._tone({ freq: 580, endFreq: 740, type: 'sine', duration: 0.055, gain: 0.1 });
  }

  playClick() {
    this._tone({ freq: 440, endFreq: 880, type: 'triangle', duration: 0.09, gain: 0.2 });
    this._tone({ freq: 660, endFreq: 1120, type: 'sine', duration: 0.07, gain: 0.12, delay: 0.02 });
  }

  playBack() {
    this._tone({ freq: 560, endFreq: 310, type: 'triangle', duration: 0.09, gain: 0.18 });
  }

  playCoin() {
    this._tone({ freq: 987.77, type: 'sine', duration: 0.08, gain: 0.22 });
    this._tone({ freq: 1318.51, type: 'triangle', duration: 0.22, gain: 0.24, delay: 0.07 });
  }

  playTrophyUnlock() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((f, i) => {
      this._tone({ freq: f, type: 'triangle', duration: 0.18, gain: 0.22, delay: i * 0.065 });
      this._tone({ freq: f * 1.5, type: 'sine', duration: 0.14, gain: 0.1, delay: i * 0.065 + 0.02 });
    });
  }

  // --- Character & Movement Sounds ---
  playJump(character, isDouble = false) {
    const base = (character?.voiceBase || 320) * (isDouble ? 1.24 : 1.0) * (0.95 + Math.random() * 0.1);
    const style = character?.voiceStyle || 'hero';
    if (style === 'monster') {
      this._tone({ freq: base, endFreq: base * 1.7, type: 'sawtooth', duration: 0.16, gain: 0.18 });
    } else if (style === 'dino') {
      this._tone({ freq: base * 0.85, endFreq: base * 1.9, type: 'sine', duration: 0.14, gain: 0.22 });
      this._tone({ freq: base * 1.5, endFreq: base * 2.2, type: 'triangle', duration: 0.08, gain: 0.14, delay: 0.06 });
    } else if (style === 'royal') {
      this._tone({ freq: base, endFreq: base * 1.55, type: 'sine', duration: 0.16, gain: 0.18 });
    } else if (style === 'grumpy') {
      this._tone({ freq: base, endFreq: base * 1.45, type: 'square', duration: 0.13, gain: 0.13 });
    } else {
      this._tone({ freq: base, endFreq: base * 1.85, type: 'triangle', duration: 0.14, gain: 0.22 });
    }
  }

  playDash() {
    this._noise({ duration: 0.12, gain: 0.18, filterType: 'bandpass', freq: 1800, q: 1.5 });
    this._tone({ freq: 340, endFreq: 680, type: 'sine', duration: 0.1, gain: 0.14 });
  }

  playGroundPoundStart() {
    this._tone({ freq: 460, endFreq: 920, type: 'triangle', duration: 0.11, gain: 0.22 });
    this._noise({ duration: 0.1, gain: 0.16, filterType: 'bandpass', freq: 2400, q: 2 });
  }

  playGroundPoundImpact() {
    this._tone({ freq: 155, endFreq: 38, type: 'sine', duration: 0.32, gain: 0.48 });
    this._noise({ duration: 0.24, gain: 0.36, filterType: 'lowpass', freq: 520, q: 0.9 });
  }

  playSwing(type = 'side') {
    const f = type === 'up' ? 2200 : type === 'spike' ? 1400 : 1750;
    this._noise({ duration: 0.09, gain: 0.18, filterType: 'bandpass', freq: f, q: 1.8 });
    this._tone({
      freq: type === 'up' ? 280 : 360,
      endFreq: type === 'up' ? 620 : 190,
      type: 'triangle',
      duration: 0.09,
      gain: 0.14,
    });
  }

  playBallKick(powerRatio = 0.5, isCharged = false) {
    const p = Math.min(1.5, Math.max(0.2, powerRatio));
    this._tone({
      freq: 165 + p * 75,
      endFreq: 48,
      type: 'sine',
      duration: 0.16 + p * 0.06,
      gain: 0.38,
    });
    this._noise({
      duration: 0.08 + p * 0.06,
      gain: 0.24 * p,
      filterType: 'bandpass',
      freq: 2100 + p * 900,
      q: 1.4,
    });
    if (isCharged || p > 0.92) {
      this._tone({ freq: 920, endFreq: 180, type: 'sawtooth', duration: 0.18, gain: 0.22 });
      this._noise({ duration: 0.16, gain: 0.3, filterType: 'highpass', freq: 2800, q: 0.9 });
    }
  }

  // --- Deluxe Combat Depth Audio (Parry, Combo Voltage, Hyper-Strike) ---
  playParry() {
    this._tone({ freq: 1046.5, endFreq: 2093, type: 'triangle', duration: 0.22, gain: 0.3 });
    this._tone({ freq: 1567.98, endFreq: 1567.98, type: 'sine', duration: 0.28, gain: 0.24, delay: 0.02 });
    this._noise({ duration: 0.15, gain: 0.24, filterType: 'highpass', freq: 3400, q: 1.2 });
  }

  playComboPass() {
    [587.33, 880, 1174.66].forEach((f, i) => {
      this._tone({ freq: f, type: 'triangle', duration: 0.11, gain: 0.2, delay: i * 0.03 });
    });
  }

  playHyperCutIn() {
    // Deep bass drop + anime super-flash chord!
    this._tone({ freq: 160, endFreq: 38, type: 'sawtooth', duration: 0.42, gain: 0.34 });
    this._noise({ duration: 0.32, gain: 0.26, filterType: 'bandpass', freq: 2200, q: 0.9 });
    [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => {
      this._tone({ freq: f, endFreq: f * 1.03, type: 'triangle', duration: 0.36, gain: 0.18, delay: i * 0.035 });
    });
  }

  // --- Stage Hazard & Mutator Audio ---
  playPortalWarp() {
    this._tone({ freq: 360, endFreq: 1080, type: 'sine', duration: 0.16, gain: 0.22 });
    this._tone({ freq: 920, endFreq: 480, type: 'triangle', duration: 0.14, gain: 0.16, delay: 0.08 });
  }

  playDrumBounce() {
    this._tone({ freq: 135, endFreq: 320, type: 'sine', duration: 0.12, gain: 0.32 });
    this._tone({ freq: 290, endFreq: 110, type: 'triangle', duration: 0.16, gain: 0.24, delay: 0.05 });
  }

  playIcicleCrash() {
    [1396, 1864, 2349].forEach((f, i) => {
      this._tone({ freq: f, endFreq: f * 0.7, type: 'sine', duration: 0.14, gain: 0.16, delay: i * 0.025 });
    });
    this._noise({ duration: 0.18, gain: 0.24, filterType: 'highpass', freq: 3200, q: 1.0 });
  }

  playBumperDing() {
    this._tone({ freq: 1318.5, type: 'sine', duration: 0.18, gain: 0.24 });
    this._tone({ freq: 1975.5, type: 'triangle', duration: 0.14, gain: 0.16, delay: 0.02 });
  }

  playBananaSlip() {
    this._tone({ freq: 780, endFreq: 220, type: 'sine', duration: 0.18, gain: 0.24 });
    this._tone({ freq: 340, endFreq: 920, type: 'triangle', duration: 0.14, gain: 0.2, delay: 0.09 });
  }

  playBallBounce(speed = 400, isPost = false) {
    const norm = Math.min(1, speed / 1400);
    if (norm < 0.06) return;
    if (isPost) {
      this._tone({ freq: 720, endFreq: 690, type: 'triangle', duration: 0.28, gain: 0.25 * norm });
      this._tone({ freq: 1140, endFreq: 1080, type: 'sine', duration: 0.22, gain: 0.18 * norm });
    } else {
      this._tone({
        freq: 135 + norm * 75,
        endFreq: 55,
        type: 'sine',
        duration: 0.09,
        gain: 0.24 * norm,
      });
    }
  }

  playBrawlHit() {
    this._tone({ freq: 210, endFreq: 65, type: 'square', duration: 0.14, gain: 0.22 });
    this._noise({ duration: 0.1, gain: 0.25, filterType: 'lowpass', freq: 1400, q: 1.0 });
  }

  playClash() {
    this._tone({ freq: 880, endFreq: 220, type: 'sawtooth', duration: 0.25, gain: 0.28 });
    this._tone({ freq: 1320, endFreq: 440, type: 'triangle', duration: 0.22, gain: 0.24 });
    this._noise({ duration: 0.22, gain: 0.32, filterType: 'bandpass', freq: 2600, q: 1.0 });
  }

  playWhistle(type = 'start') {
    if (type === 'start') {
      this._tone({ freq: 2550, endFreq: 2720, type: 'sine', duration: 0.24, gain: 0.22 });
      this._tone({ freq: 2620, endFreq: 2500, type: 'triangle', duration: 0.24, gain: 0.12 });
    } else if (type === 'end') {
      this._tone({ freq: 2600, endFreq: 2650, type: 'sine', duration: 0.16, gain: 0.22, delay: 0 });
      this._tone({ freq: 2600, endFreq: 2650, type: 'sine', duration: 0.16, gain: 0.22, delay: 0.2 });
      this._tone({ freq: 2650, endFreq: 2450, type: 'sine', duration: 0.48, gain: 0.26, delay: 0.4 });
    }
  }

  playCountdownTick(finalGo = false) {
    if (finalGo) {
      this._tone({ freq: 523.25, endFreq: 1046.5, type: 'triangle', duration: 0.28, gain: 0.28 });
      this._tone({ freq: 659.25, endFreq: 1318.5, type: 'sine', duration: 0.28, gain: 0.2 });
      this.playWhistle('start');
    } else {
      this._tone({ freq: 523.25, endFreq: 523.25, type: 'triangle', duration: 0.12, gain: 0.22 });
    }
  }

  playGoal() {
    this._noise({ duration: 0.2, gain: 0.22, filterType: 'highpass', freq: 2400 });
    const chord = [261.63, 329.63, 392.0, 523.25];
    chord.forEach((f, idx) => {
      this._tone({
        freq: f,
        endFreq: f * 1.01,
        type: 'sawtooth',
        duration: 0.65,
        gain: 0.12,
        attack: 0.02,
        delay: idx * 0.04,
      });
    });
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      this._tone({
        freq: f,
        type: 'triangle',
        duration: 0.22,
        gain: 0.22,
        delay: 0.15 + i * 0.09,
      });
    });
    this._noise({ duration: 1.1, gain: 0.26, filterType: 'bandpass', freq: 950, q: 0.6, delay: 0.05 });
  }

  playSuddenDeath() {
    const notes = [440, 415.3, 392, 349.23];
    notes.forEach((f, i) => {
      this._tone({ freq: f, endFreq: f * 0.98, type: 'sawtooth', duration: 0.26, gain: 0.2, delay: i * 0.18 });
    });
    this._noise({ duration: 0.7, gain: 0.2, filterType: 'bandpass', freq: 1200, q: 0.8 });
  }

  playItemPickup() {
    const arp = [587.33, 783.99, 987.77, 1174.66];
    arp.forEach((f, i) => {
      this._tone({ freq: f, type: 'sine', duration: 0.11, gain: 0.18, delay: i * 0.045 });
    });
  }

  playItemUse(itemId) {
    switch (itemId) {
      case 'RedMushroom':
      case 'EnlargeBall':
        [261, 330, 392, 523, 659, 784].forEach((f, i) =>
          this._tone({ freq: f, type: 'square', duration: 0.09, gain: 0.13, delay: i * 0.045 })
        );
        break;
      case 'TinyMushroom':
        [784, 988, 1175, 1568].forEach((f, i) =>
          this._tone({ freq: f, type: 'sine', duration: 0.08, gain: 0.16, delay: i * 0.04 })
        );
        break;
      case 'IceFlower':
        [1046, 1318, 1568, 2093].forEach((f, i) =>
          this._tone({ freq: f, type: 'triangle', duration: 0.18, gain: 0.16, delay: i * 0.035 })
        );
        break;
      case 'FireFlower':
        this._noise({ duration: 0.35, gain: 0.28, filterType: 'bandpass', freq: 700, q: 0.8 });
        this._tone({ freq: 240, endFreq: 620, type: 'sawtooth', duration: 0.25, gain: 0.18 });
        break;
      case '1UP':
        [659, 784, 1319, 1047, 1175, 1568].forEach((f, i) =>
          this._tone({ freq: f, type: 'triangle', duration: 0.12, gain: 0.22, delay: i * 0.065 })
        );
        break;
      case 'POW':
        this._tone({ freq: 140, endFreq: 32, type: 'sawtooth', duration: 0.45, gain: 0.35 });
        this._noise({ duration: 0.45, gain: 0.34, filterType: 'lowpass', freq: 650, q: 0.9 });
        break;
      case 'BulletBill':
        this._tone({ freq: 180, endFreq: 70, type: 'sawtooth', duration: 0.3, gain: 0.25 });
        this._noise({ duration: 0.28, gain: 0.25, filterType: 'lowpass', freq: 900 });
        break;
      case 'GreenShell':
        this._tone({ freq: 420, endFreq: 760, type: 'triangle', duration: 0.12, gain: 0.22 });
        break;
      case 'GoalKeeper':
        [392, 523, 659].forEach((f, i) =>
          this._tone({ freq: f, type: 'triangle', duration: 0.13, gain: 0.2, delay: i * 0.06 })
        );
        break;
      // --- 8 New Deluxe Items ---
      case 'SuperStar':
        [523, 659, 784, 1046, 1318, 1568].forEach((f, i) =>
          this._tone({ freq: f, type: 'triangle', duration: 0.12, gain: 0.2, delay: i * 0.038 })
        );
        break;
      case 'ChainHound':
        this._tone({ freq: 190, endFreq: 95, type: 'sawtooth', duration: 0.13, gain: 0.28, delay: 0 });
        this._tone({ freq: 210, endFreq: 85, type: 'sawtooth', duration: 0.15, gain: 0.3, delay: 0.15 });
        this._noise({ duration: 0.12, gain: 0.2, filterType: 'highpass', freq: 2600, delay: 0.05 });
        break;
      case 'BananaBunch':
        this._tone({ freq: 440, endFreq: 860, type: 'sine', duration: 0.14, gain: 0.2 });
        break;
      case 'MagnetGlove':
        this._tone({ freq: 220, endFreq: 480, type: 'sine', duration: 0.25, gain: 0.22 });
        this._tone({ freq: 330, endFreq: 660, type: 'triangle', duration: 0.25, gain: 0.15, delay: 0.04 });
        break;
      case 'ShadowClone':
        [440, 659, 880, 1318].forEach((f, i) =>
          this._tone({ freq: f, type: 'sine', duration: 0.14, gain: 0.18, delay: i * 0.04 })
        );
        break;
      case 'ThunderZapper':
        this._noise({ duration: 0.52, gain: 0.38, filterType: 'bandpass', freq: 900, q: 0.7 });
        this._tone({ freq: 1450, endFreq: 75, type: 'sawtooth', duration: 0.38, gain: 0.28 });
        break;
      case 'WarpPipe':
        [0, 0.1, 0.2].forEach((d) => {
          this._tone({ freq: 520, endFreq: 210, type: 'square', duration: 0.08, gain: 0.16, delay: d });
        });
        break;
      case 'TriBall':
        [440, 587.33, 783.99].forEach((f, i) =>
          this._tone({ freq: f, endFreq: f * 1.4, type: 'triangle', duration: 0.13, gain: 0.22, delay: i * 0.06 })
        );
        break;
      default:
        this.playClick();
    }
  }

  // --- Dynamic Biome Music Sequencer (Menu, Victory + 7 Distinct Stadium Tracks!) ---
  startMusic(track = 'menu') {
    this.unlock();
    if (this.currentTrack === track && this.musicTimer) return;
    this.stopMusic();
    this.currentTrack = track;
    this.stepIndex = 0;
    this.urgentTempo = false;

    const baseTempos = {
      menu: 162,
      victory: 148,
      meadow: 136,
      match: 136,
      sky: 132,
      castle: 126,
      manor: 142,
      jungle: 130,
      glacier: 140,
      cosmos: 128,
    };

    const tick = () => {
      if (this.currentTrack !== track) return;
      if (this.ctx && this.ctx.state === 'running' && !this.settings.muted) {
        this._playMusicStep(track, this.stepIndex);
      }
      this.stepIndex = (this.stepIndex + 1) % 32;
      let stepMs = baseTempos[track] || 136;
      if (track !== 'menu' && track !== 'victory' && this.urgentTempo) {
        stepMs = Math.round(stepMs * 0.78);
      }
      this.musicTimer = setTimeout(tick, stepMs);
    };
    tick();
  }

  setUrgent(urgent) {
    this.urgentTempo = Boolean(urgent);
  }

  stopMusic() {
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    this.currentTrack = null;
  }

  _playMusicStep(track, step) {
    const dest = this.musicGain;
    const isMatchTrack = track !== 'menu' && track !== 'victory';
    const shift = isMatchTrack && this.urgentTempo ? 1.122 : 1.0;

    if (track === 'menu') {
      const bass = [
        130.81, 0, 196.0, 0, 146.83, 0, 220.0, 0,
        164.81, 0, 196.0, 0, 130.81, 146.83, 164.81, 196.0,
        174.61, 0, 220.0, 0, 164.81, 0, 196.0, 0,
        146.83, 0, 196.0, 0, 130.81, 0, 196.0, 0,
      ];
      const lead = [
        523.25, 0, 659.25, 587.33, 523.25, 0, 392.0, 0,
        440.0, 523.25, 587.33, 0, 659.25, 0, 587.33, 0,
        698.46, 0, 659.25, 587.33, 523.25, 659.25, 783.99, 0,
        587.33, 0, 659.25, 587.33, 523.25, 0, 0, 0,
      ];
      if (bass[step]) this._tone({ freq: bass[step], type: 'triangle', duration: 0.14, gain: 0.28, dest });
      if (lead[step]) this._tone({ freq: lead[step], type: 'sine', duration: 0.13, gain: 0.2, dest });
      if (step % 4 === 0) this._tone({ freq: 95, endFreq: 38, type: 'sine', duration: 0.09, gain: 0.26, dest });
      if (step % 4 === 2) this._noise({ duration: 0.05, gain: 0.08, filterType: 'highpass', freq: 5000, dest });
      return;
    }

    if (track === 'victory') {
      const lead = [
        523.25, 659.25, 783.99, 1046.5, 0, 783.99, 1046.5, 0,
        880.0, 698.46, 783.99, 587.33, 659.25, 0, 523.25, 0,
        587.33, 698.46, 880.0, 1174.66, 0, 987.77, 783.99, 0,
        1046.5, 0, 783.99, 659.25, 523.25, 0, 0, 0,
      ];
      if (lead[step]) this._tone({ freq: lead[step], type: 'triangle', duration: 0.14, gain: 0.22, dest });
      if (step % 4 === 0) this._tone({ freq: 130.81, type: 'triangle', duration: 0.18, gain: 0.24, dest });
      return;
    }

    // Biome-specific stadium grooves!
    if (track === 'manor') {
      // Spooky playful Haunted Harpsichord-Funk (A harmonic minor)
      const bass = [
        110, 0, 164.81, 0, 130.81, 0, 164.81, 0,
        146.83, 0, 174.61, 0, 164.81, 0, 123.47, 0,
        110, 0, 164.81, 0, 130.81, 0, 220, 0,
        174.61, 0, 164.81, 0, 110, 0, 0, 0,
      ];
      const lead = [
        440, 523.25, 659.25, 0, 622.25, 659.25, 0, 440,
        587.33, 0, 523.25, 493.88, 523.25, 0, 415.3, 0,
        440, 523.25, 659.25, 880, 830.61, 880, 659.25, 0,
        698.46, 659.25, 523.25, 493.88, 440, 0, 0, 0,
      ];
      if (bass[step]) this._tone({ freq: bass[step] * shift, type: 'triangle', duration: 0.13, gain: 0.28, dest });
      if (lead[step]) this._tone({ freq: lead[step] * shift, type: 'square', duration: 0.08, gain: 0.1, dest });
      if (step % 4 === 0) this._tone({ freq: 90, endFreq: 36, type: 'sine', duration: 0.08, gain: 0.22, dest });
      if (step % 4 === 2) this._noise({ duration: 0.04, gain: 0.09, filterType: 'highpass', freq: 4500, dest });
    } else if (track === 'jungle') {
      // Tribal Marimba & Syncopated Bongo Groove
      const bass = [
        98, 0, 98, 130.81, 146.83, 0, 130.81, 98,
        116.54, 0, 130.81, 0, 146.83, 130.81, 116.54, 98,
        98, 0, 98, 130.81, 146.83, 0, 174.61, 146.83,
        130.81, 0, 116.54, 0, 98, 0, 146.83, 0,
      ];
      const lead = [
        392, 0, 466.16, 523.25, 587.33, 0, 523.25, 392,
        466.16, 523.25, 587.33, 0, 698.46, 587.33, 523.25, 0,
        392, 466.16, 587.33, 0, 783.99, 698.46, 587.33, 523.25,
        466.16, 0, 523.25, 466.16, 392, 0, 0, 0,
      ];
      if (bass[step]) this._tone({ freq: bass[step] * shift, type: 'triangle', duration: 0.12, gain: 0.3, dest });
      if (lead[step]) this._tone({ freq: lead[step] * shift, endFreq: lead[step] * shift * 0.99, type: 'sine', duration: 0.11, gain: 0.24, dest });
      // Syncopated bongo percussion!
      if ([0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 27, 30].includes(step)) {
        const bf = step % 2 === 0 ? 180 : 265;
        this._tone({ freq: bf, endFreq: bf * 0.65, type: 'sine', duration: 0.07, gain: 0.2, dest });
      }
    } else if (track === 'glacier') {
      // Sparkling Aurora Crystal Chimes
      const bass = [
        130.81, 0, 196, 0, 164.81, 0, 196, 0,
        174.61, 0, 220, 0, 146.83, 0, 196, 0,
        130.81, 0, 196, 0, 164.81, 0, 246.94, 0,
        174.61, 0, 196, 0, 130.81, 0, 196, 0,
      ];
      const lead = [
        783.99, 1046.5, 987.77, 783.99, 659.25, 0, 783.99, 0,
        880, 1046.5, 1174.66, 0, 987.77, 783.99, 587.33, 0,
        783.99, 1046.5, 1318.5, 1174.66, 1046.5, 987.77, 783.99, 0,
        880, 783.99, 659.25, 587.33, 523.25, 0, 1046.5, 0,
      ];
      if (bass[step]) this._tone({ freq: bass[step] * shift, type: 'triangle', duration: 0.15, gain: 0.26, dest });
      if (lead[step]) this._tone({ freq: lead[step] * shift, type: 'sine', duration: 0.16, gain: 0.17, dest });
      if (step % 2 === 1) this._noise({ duration: 0.035, gain: 0.07, filterType: 'highpass', freq: 6500, dest });
    } else if (track === 'cosmos') {
      // Cosmic Starlight Synthwave Arp
      const roots = [110, 110, 87.31, 87.31, 130.81, 130.81, 98, 98];
      const rFreq = roots[Math.floor(step / 4)] * (step % 2 === 1 ? 2 : 1);
      this._tone({ freq: rFreq * shift, type: 'sawtooth', duration: 0.09, gain: 0.11, dest });
      const arp = [440, 523.25, 659.25, 880, 659.25, 523.25, 783.99, 659.25];
      const af = arp[step % 8] * (step >= 16 ? 1.122 : 1.0);
      this._tone({ freq: af * shift, type: 'triangle', duration: 0.11, gain: 0.16, dest });
      if (step % 4 === 0) this._tone({ freq: 115, endFreq: 38, type: 'sine', duration: 0.09, gain: 0.28, dest });
      if (step % 4 === 2) this._noise({ duration: 0.07, gain: 0.13, filterType: 'bandpass', freq: 2600, dest });
    } else if (track === 'castle') {
      // Magma Keep Boss Rock-Brass
      const bass = [
        82.41, 82.41, 0, 98, 110, 0, 98, 82.41,
        82.41, 82.41, 0, 123.47, 110, 98, 87.31, 82.41,
        98, 98, 0, 110, 123.47, 0, 110, 98,
        87.31, 0, 98, 0, 123.47, 110, 98, 82.41,
      ];
      const lead = [
        329.63, 0, 392, 440, 493.88, 0, 440, 392,
        329.63, 0, 493.88, 440, 392, 349.23, 329.63, 0,
        392, 0, 440, 493.88, 587.33, 0, 493.88, 440,
        349.23, 392, 440, 349.23, 493.88, 0, 0, 0,
      ];
      if (bass[step]) this._tone({ freq: bass[step] * shift, type: 'sawtooth', duration: 0.11, gain: 0.15, dest });
      if (lead[step]) this._tone({ freq: lead[step] * shift, type: 'triangle', duration: 0.12, gain: 0.22, dest });
      if (step % 2 === 0) this._tone({ freq: 115, endFreq: 36, type: 'sine', duration: 0.09, gain: 0.28, dest });
      if (step % 4 === 2) this._noise({ duration: 0.08, gain: 0.15, filterType: 'bandpass', freq: 2000, dest });
    } else if (track === 'sky') {
      // Cloud-Pipe Skyway Breezy Major-7th Synth
      const bass = [
        146.83, 0, 220, 0, 185.0, 0, 220, 0,
        196.0, 0, 246.94, 0, 164.81, 0, 220, 0,
        146.83, 0, 220, 0, 185.0, 0, 277.18, 0,
        196.0, 0, 220, 0, 146.83, 0, 220, 0,
      ];
      const lead = [
        587.33, 739.99, 880, 0, 739.99, 659.25, 587.33, 0,
        587.33, 659.25, 783.99, 880, 659.25, 0, 0, 0,
        587.33, 739.99, 880, 1174.66, 1108.73, 987.77, 880, 739.99,
        783.99, 659.25, 587.33, 739.99, 587.33, 0, 0, 0,
      ];
      if (bass[step]) this._tone({ freq: bass[step] * shift, type: 'triangle', duration: 0.13, gain: 0.26, dest });
      if (lead[step]) this._tone({ freq: lead[step] * shift, type: 'sine', duration: 0.13, gain: 0.2, dest });
      if (step % 4 === 0) this._tone({ freq: 105, endFreq: 42, type: 'sine', duration: 0.08, gain: 0.22, dest });
      if (step % 4 === 2) this._noise({ duration: 0.05, gain: 0.09, filterType: 'highpass', freq: 4800, dest });
    } else {
      // Classic Mushroom Meadow / Match Funk-Samba
      const bass = [
        110, 0, 110, 130.81, 146.83, 0, 130.81, 0,
        110, 0, 110, 146.83, 164.81, 0, 146.83, 130.81,
        130.81, 0, 130.81, 164.81, 196.0, 0, 164.81, 0,
        146.83, 0, 164.81, 0, 196.0, 164.81, 146.83, 130.81,
      ];
      const lead = [
        440, 0, 523.25, 0, 587.33, 659.25, 587.33, 523.25,
        440, 0, 392.0, 440, 523.25, 0, 0, 0,
        523.25, 0, 659.25, 0, 783.99, 880.0, 783.99, 659.25,
        587.33, 659.25, 587.33, 523.25, 440, 0, 587.33, 0,
      ];
      if (bass[step]) this._tone({ freq: bass[step] * shift, type: 'triangle', duration: 0.12, gain: 0.3, dest });
      if (lead[step]) {
        this._tone({ freq: lead[step] * shift, type: 'square', duration: 0.11, gain: 0.09, dest });
        this._tone({ freq: lead[step] * shift, type: 'triangle', duration: 0.12, gain: 0.15, dest });
      }
      if (step % 2 === 0) this._tone({ freq: 110, endFreq: 40, type: 'sine', duration: 0.08, gain: 0.25, dest });
      if (step % 4 === 2) this._noise({ duration: 0.06, gain: 0.12, filterType: 'bandpass', freq: 2400, dest });
    }
  }
}


// === src/input.js ===
// Super Kick Kingdom — Unified Keyboard & Gamepad Input Manager
// Supports 4-Player XInput Couch Multiplayer (P1, P2, P3, P4),
// edge-triggered buffering, analog stick flick detection, charge hold & live rebinding
const XINPUT_BUTTONS = {
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
function formatKeyCode(code) {
  if (!code) return '—';
  return KEY_LABELS[code] || code.replace('Key', '').replace('Digit', '');
}
class InputManager {
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


// === src/touch.js ===
// Super Kick Kingdom — Mobile Device, Orientation & Touch Controls Manager
// Handles mobile detection, rotate-to-landscape overlay, glassmorphic virtual controls & tactile touch input
class TouchController {
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


// === src/art.js ===
// Super Kick Kingdom 2.0 (Deluxe Edition) — Cutting-Edge 2.5D Sprite & Shader-Style Canvas Renderer
// Features:
// - 15 Transparent RGBA Cel-Shaded PNG Sprite Atlases (12 6-pose Strikers, Props, Balls & 18 Power-Ups)
// - GPU-Accelerated Offscreen Alternate Kit Re-Coloring & Pose-Accurate Silhouette Afterimage Cache (100% file:// safe — zero getImageData!)
// - Pre-Baked 2.5D Textured Biome Masonry, Perspective Turf Stripes, Swaying Grass, Planar Floor Reflections & 3D Brushed Goalposts
// - Dynamic Additive Lighting & Bloom Pass, Multi-Layer Anime Crescent Slashes & HD Painted Hyper-Strike Portrait Cut-Ins

const INK = '#151020';

const ITEM_INDEX_MAP = Object.fromEntries(ITEMS.map((it, idx) => [it.id, idx]));

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
const CHAR_SPRITE_METRICS = {
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

// Animation definitions across all 12 strikers — 24+ FPS ultra-fluid master playback!
const CHAR_ANIM_METRICS = {
  mario: {
    idle: { row: 0, count: 24, fps: 24, loop: true },
    run: { row: 1, count: 24, fps: 24, loop: true },
    jump: { row: 2, count: 16, fps: 24, loop: false },
    kickside: { row: 3, count: 12, fps: 24, loop: false },
    kickup: { row: 4, count: 12, fps: 24, loop: false },
    ouch: { row: 5, count: 16, fps: 24, loop: true },
  },
  luigi: {
    idle: { row: 0, count: 24, fps: 24, loop: true },
    run: { row: 1, count: 24, fps: 24, loop: true },
    jump: { row: 2, count: 16, fps: 24, loop: false },
    kickside: { row: 3, count: 12, fps: 24, loop: false },
    kickup: { row: 4, count: 12, fps: 24, loop: false },
    ouch: { row: 5, count: 16, fps: 24, loop: true },
  },
  peach: {
    idle: { row: 0, count: 24, fps: 24, loop: true },
    run: { row: 1, count: 24, fps: 24, loop: true },
    jump: { row: 2, count: 16, fps: 24, loop: false },
    kickside: { row: 3, count: 12, fps: 24, loop: false },
    kickup: { row: 4, count: 12, fps: 24, loop: false },
    ouch: { row: 5, count: 16, fps: 24, loop: true },
  },
  yoshi: {
    idle: { row: 0, count: 24, fps: 24, loop: true },
    run: { row: 1, count: 24, fps: 26, loop: true },
    jump: { row: 2, count: 16, fps: 24, loop: false },
    kickside: { row: 3, count: 12, fps: 24, loop: false },
    kickup: { row: 4, count: 12, fps: 24, loop: false },
    ouch: { row: 5, count: 16, fps: 24, loop: true },
  },
  wario: {
    idle: { row: 0, count: 24, fps: 24, loop: true },
    run: { row: 1, count: 24, fps: 24, loop: true },
    jump: { row: 2, count: 16, fps: 24, loop: false },
    kickside: { row: 3, count: 12, fps: 24, loop: false },
    kickup: { row: 4, count: 12, fps: 24, loop: false },
    ouch: { row: 5, count: 16, fps: 24, loop: true },
  },
  bowser: {
    idle: { row: 0, count: 24, fps: 24, loop: true },
    run: { row: 1, count: 24, fps: 24, loop: true },
    jump: { row: 2, count: 16, fps: 24, loop: false },
    kickside: { row: 3, count: 12, fps: 24, loop: false },
    kickup: { row: 4, count: 12, fps: 24, loop: false },
    ouch: { row: 5, count: 16, fps: 24, loop: true },
  },
  waluigi: {
    idle: { row: 0, count: 24, fps: 24, loop: true },
    run: { row: 1, count: 24, fps: 25, loop: true },
    jump: { row: 2, count: 16, fps: 24, loop: false },
    kickside: { row: 3, count: 12, fps: 24, loop: false },
    kickup: { row: 4, count: 12, fps: 24, loop: false },
    ouch: { row: 5, count: 16, fps: 24, loop: true },
  },
  rosalina: {
    idle: { row: 0, count: 24, fps: 24, loop: true },
    run: { row: 1, count: 24, fps: 24, loop: true },
    jump: { row: 2, count: 16, fps: 24, loop: false },
    kickside: { row: 3, count: 12, fps: 24, loop: false },
    kickup: { row: 4, count: 12, fps: 24, loop: false },
    ouch: { row: 5, count: 16, fps: 24, loop: true },
  },
  toad: {
    idle: { row: 0, count: 24, fps: 24, loop: true },
    run: { row: 1, count: 24, fps: 26, loop: true },
    jump: { row: 2, count: 16, fps: 24, loop: false },
    kickside: { row: 3, count: 12, fps: 24, loop: false },
    kickup: { row: 4, count: 12, fps: 24, loop: false },
    ouch: { row: 5, count: 16, fps: 24, loop: true },
  },
  donkey_kong: {
    idle: { row: 0, count: 24, fps: 24, loop: true },
    run: { row: 1, count: 24, fps: 24, loop: true },
    jump: { row: 2, count: 16, fps: 24, loop: false },
    kickside: { row: 3, count: 12, fps: 24, loop: false },
    kickup: { row: 4, count: 12, fps: 24, loop: false },
    ouch: { row: 5, count: 16, fps: 24, loop: true },
  },
  king_boo: {
    idle: { row: 0, count: 24, fps: 24, loop: true },
    run: { row: 1, count: 24, fps: 24, loop: true },
    jump: { row: 2, count: 16, fps: 24, loop: false },
    kickside: { row: 3, count: 12, fps: 24, loop: false },
    kickup: { row: 4, count: 12, fps: 24, loop: false },
    ouch: { row: 5, count: 16, fps: 24, loop: true },
  },
  bowser_jr: {
    idle: { row: 0, count: 24, fps: 24, loop: true },
    run: { row: 1, count: 24, fps: 25, loop: true },
    jump: { row: 2, count: 16, fps: 24, loop: false },
    kickside: { row: 3, count: 12, fps: 24, loop: false },
    kickup: { row: 4, count: 12, fps: 24, loop: false },
    ouch: { row: 5, count: 16, fps: 24, loop: true },
  },
};
class ArtRenderer {
  constructor() {
    this.images = {};
    this.sprites = {};
    this._kitCache = {};
    this._silhouetteCache = {};
    this._terrainCache = {};
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
      const img = new Image();
      img.decoding = 'async';
      img.src = `./assets/images/${k}.jpg`;
      img.onload = () => {
        this.images[k] = img;
      };
    }

    const spriteKeys = [
      ...CHARACTERS.map((c) => `char_${c.id}`),
      ...CHARACTERS.map((c) => `portrait_${c.id}`),
      'props_atlas',
      'balls_atlas',
      'items_atlas',
    ];
    for (const sk of spriteKeys) {
      const img = new Image();
      img.decoding = 'async';
      img.src = `./assets/sprites/${sk}.png`;
      img.onload = () => {
        this.sprites[sk] = img;
      };
    }
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

  // Lazily builds & caches alternate-jersey spritesheets on GPU without getImageData() (100% file:// safe!)
  _getCharSheet(ch) {
    const base = this.sprites[`char_${ch.id}`];
    if (!base) return null;
    const kitIdx = ch.kitIdx || 0;
    if (kitIdx === 0) return base;

    const key = `${ch.id}:${kitIdx}`;
    if (this._kitCache[key]) return this._kitCache[key];

    const w = base.naturalWidth || base.width || 768;
    const h = base.naturalHeight || base.height || 512;
    const off = this._makeOffscreen(w, h);
    if (!off) return base;

    const spec = KIT_FILTER_SPECS[key] || {
      filter: `hue-rotate(${kitIdx * 115}deg) saturate(1.18)`,
      glaze: ch.primary,
      glazeAlpha: 0.12,
    };

    const octx = off.ctx;
    octx.save();
    if ('filter' in octx) {
      octx.filter = spec.filter;
    }
    octx.drawImage(base, 0, 0, w, h);
    octx.filter = 'none';

    if (spec.glaze && spec.glazeAlpha) {
      octx.globalCompositeOperation = 'source-atop';
      octx.globalAlpha = spec.glazeAlpha;
      octx.fillStyle = spec.glaze;
      octx.fillRect(0, 0, w, h);
    }
    octx.restore();

    this._kitCache[key] = off.canvas;
    return off.canvas;
  }

  // Lazily builds & caches a solid-colored silhouette sheet for pose-accurate anime dash afterimages & rim glows!
  _getSilhouetteSheet(charId, color) {
    const base = this.sprites[`char_${charId}`];
    if (!base) return null;
    const key = `${charId}|${color}`;
    if (this._silhouetteCache[key]) return this._silhouetteCache[key];

    const w = base.naturalWidth || base.width || 768;
    const h = base.naturalHeight || base.height || 512;
    const off = this._makeOffscreen(w, h);
    if (!off) return null;

    const octx = off.ctx;
    octx.drawImage(base, 0, 0, w, h);
    octx.globalCompositeOperation = 'source-in';
    octx.fillStyle = color;
    octx.fillRect(0, 0, w, h);
    octx.globalCompositeOperation = 'source-over';

    this._silhouetteCache[key] = off.canvas;
    return off.canvas;
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
        ctx.drawImage(sheet, 18, 6, 220, 195, cx - size * 0.52, cy - size * 0.48, size * 1.04, size * 0.96);
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
            const sx = col * 256;
            const sy = row * 256;
            ctx.drawImage(sheet, sx, sy, 256, 256, -75, -142, 150, 150);
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
      this.drawItemIcon(ctx, player.heldItem, cx, cy + bob, 34, time);
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
  drawCloudCourier(ctx, courier, time) {
    if (!courier.active) return;
    const { x, y, heldItemId } = courier;
    const props = this.sprites.props_atlas;
    ctx.save();
    ctx.translate(x, y);

    if (heldItemId) {
      const sway = Math.sin(time * 4.5) * 9;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.quadraticCurveTo(sway * 0.5, 52, sway, 82);
      ctx.stroke();

      const bx = sway;
      const by = 94;
      const pulse = 1 + Math.sin(time * 7) * 0.06;
      ctx.save();
      ctx.translate(bx, by);
      ctx.scale(pulse, pulse);

      // Iridescent soap-crystal item bubble!
      const glow = ctx.createRadialGradient(-8, -10, 6, 0, 0, 46);
      glow.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
      glow.addColorStop(0.65, 'rgba(125, 211, 252, 0.48)');
      glow.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, 46, 0, Math.PI * 2);
      ctx.fill();

      this.drawItemIcon(ctx, heldItemId, 0, 0, 30, time);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.90)';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
      ctx.beginPath();
      ctx.ellipse(-13, -15, 9, 5, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (props) {
      const bob = Math.sin(time * 5.5) * 3;
      const pW = (props.naturalWidth || props.width || 1024) / 2;
      const pH = (props.naturalHeight || props.height || 1024) / 2;
      ctx.drawImage(props, 0, 0, pW, pH, -56, -64 + bob, 112, 112);
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
  }

  drawItemIcon(ctx, itemId, x, y, r, time = 0) {
    const atlas = this.sprites.items_atlas;
    const idx = ITEM_INDEX_MAP[itemId];

    if (atlas && idx !== undefined) {
      const col = idx % 6;
      const row = Math.floor(idx / 6);
      const sz = r * 2.32;
      ctx.save();
      ctx.translate(x, y);
      if (itemId === 'SuperStar') {
        ctx.rotate(Math.sin(time * 4.5) * 0.14);
      }
      const cellW = (atlas.naturalWidth || atlas.width || 1536) / 6;
      const cellH = (atlas.naturalHeight || atlas.height || 768) / 3;
      ctx.drawImage(atlas, col * cellW, row * cellH, cellW, cellH, -sz / 2, -sz / 2, sz, sz);
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
  // 5. ALL 12 STRIKERS — FLUID MULTI-FRAME ANIMATION (10x6 SPRITE ATLAS) + ANIME SECONDARY VFX
  // =========================================================================
  _selectCharFrameCoords(player, time) {
    const ch = player.char;
    const cfg = CHAR_ANIM_METRICS[ch.id] || CHAR_ANIM_METRICS.mario;

    if (player.stunTimer > 0) {
      const anim = cfg.ouch;
      const fIdx = Math.floor(time * anim.fps) % anim.count;
      return { col: fIdx, row: anim.row };
    }

    if (player.groundPoundState === 'stall') {
      const anim = cfg.jump;
      return { col: 7, row: anim.row };
    }
    if (player.groundPoundState === 'plunge') {
      const anim = cfg.jump;
      return { col: 11, row: anim.row };
    }
    if (player.groundPoundState === 'impact') {
      const anim = cfg.jump;
      return { col: 14, row: anim.row };
    }

    if (player.kickTimer > 0) {
      const isUp = player.kickType === 'up';
      const anim = isUp ? cfg.kickup : cfg.kickside;
      const dur = player.kickDuration || 0.22;
      const prog = Math.min(1, Math.max(0, 1 - player.kickTimer / dur));
      const fIdx = Math.min(anim.count - 1, Math.floor(prog * anim.count));
      return { col: fIdx, row: anim.row };
    }

    if (!player.onGround) {
      const anim = cfg.jump;
      // Smooth continuous physics mapping across all 16 frames:
      const vyNorm = Math.min(1, Math.max(0, (player.vy + 550) / 1100));
      const fIdx = Math.min(anim.count - 1, Math.floor(vyNorm * anim.count));
      return { col: fIdx, row: anim.row };
    }

    const speedX = Math.abs(player.vx || 0);
    if (speedX > 38) {
      const anim = cfg.run;
      const speedRatio = Math.max(0.7, Math.min(1.5, speedX / 300));
      const fIdx = Math.floor(time * anim.fps * speedRatio) % anim.count;
      return { col: fIdx, row: anim.row };
    }

    const anim = cfg.idle;
    const fIdx = Math.floor(time * anim.fps) % anim.count;
    return { col: fIdx, row: anim.row };
  }

  _selectCharFrame(player, time) {
    const { col, row } = this._selectCharFrameCoords(player, time);
    return col + row * 24;
  }

  drawCharacterPuppet(ctx, player, balls, time) {
    const ch = player.char;
    const scale = (player.visualScale || 1) * ch.stats.size;
    const facing = player.facing || 1;
    const sheet = this._getCharSheet(ch);
    const metrics = CHAR_SPRITE_METRICS[ch.id] || CHAR_SPRITE_METRICS.mario;
    const { col, row } = this._selectCharFrameCoords(player, time);
    const sx = col * 256;
    const sy = row * 256;

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
      const sil = this._getSilhouetteSheet(ch.id, ch.aura || ch.primary);
      for (const g of player.dashGhosts) {
        ctx.save();
        ctx.globalAlpha = g.alpha * 0.58;
        ctx.translate(g.x, g.y);
        ctx.scale(facing * scale, scale);
        if (sil) {
          const dSz = metrics.drawSize;
          const topY = 53 - dSz * metrics.footY;
          ctx.drawImage(sil, sx, sy, 256, 256, -dSz * 0.5, topY, dSz, dSz);
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

    const floatBobY =
      ch.id === 'king_boo'
        ? Math.sin(time * 5.5) * 5 * scale
        : 0;

    let poseRot = player.spinAngle || 0;
    if (isKicking) {
      if (player.kickType === 'up') poseRot += facing * -0.32;
      else if (player.kickType === 'spike') poseRot += facing * 0.32;
      else poseRot += facing * 0.04;
    }

    ctx.save();
    ctx.translate(0, floatBobY);
    ctx.rotate(poseRot);

    ctx.scale(facing * (player.squashX || 1) * scale, (player.squashY || 1) * scale);

    if (sheet) {
      const dSz = metrics.drawSize;
      const airOffset = row === 2 || row === 5 ? metrics.airShiftY : 0;
      const topY = 53 - dSz * metrics.footY + airOffset;

      // Glowing Rim-Flash Underlay when Hyper-Ready, Parrying, or Holo-Clone!
      if (player.hyperReady || player.parryFlashTimer > 0 || player.isClone) {
        const rimCol = player.isClone ? '#38bdf8' : '#fde047';
        const rimSil = this._getSilhouetteSheet(ch.id, rimCol);
        if (rimSil) {
          ctx.save();
          ctx.globalAlpha = player.parryFlashTimer > 0 ? 0.9 : 0.65;
          ctx.drawImage(rimSil, sx, sy, 256, 256, -dSz * 0.5 - 3.5, topY - 3.5, dSz + 7, dSz + 7);
          ctx.restore();
        }
      }

      // Draw Crisp HD Cel-Shaded Character Sprite!
      ctx.drawImage(sheet, sx, sy, 256, 256, -dSz * 0.5, topY, dSz, dSz);

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
        ctx.drawImage(sheet, sx, sy, 256, 256, -dSz * 0.5, -dSz * 0.44, dSz, dSz);
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
    const tagY = player.y - 78 * scale - extraHeadH - Math.sin(time * 5) * 3;
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
    this.drawItemIcon(ctx, 'BananaBunch', 0, 0, 26, time);
    ctx.restore();
  }

  drawShellEntity(ctx, shell, time) {
    if (shell.timer < 1.8 && Math.floor(time * 16) % 2 === 0) return;
    ctx.save();
    ctx.translate(shell.x, shell.y);
    const squish = 1 + Math.sin(time * 30) * 0.09;
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
    const slideIn = Math.max(0, (0.75 - Math.min(0.75, cutIn.timer)) * 0);

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
      const goldSil = this._getSilhouetteSheet(ch.id, '#fde047');
      if (goldSil) {
        ctx.drawImage(goldSil, 256, 256, 256, 256, -688, -142, 310, 310);
      }
      ctx.drawImage(sheet, 256, 256, 256, 256, -678, -136, 300, 300);
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


// === src/ai.js ===
// Super Kick Kingdom 2.0 (Deluxe Edition) — Predictive Kung-Foot AI Controller
// Supports 4 difficulty tiers, 2v2 roles, Holo-Clones, Hyper-Strikes, Stage Hazards & all 18 Items
class AIController {
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
      const bubbleY = courier.y + 92;
      if (Math.abs(courier.x - player.x) < 120 && player.y > bubbleY + 30) {
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


// === src/physics.js ===
// Super Kick Kingdom 2.0 (Deluxe Edition) — Sub-Stepped Kung-Foot Physics, Combat & Hazard Engine
// 12 Strikers, Hyper-Strikes, Perfect Parry, Magnus Spin, 2v2 Combo Voltage, 7 Hazard Arenas, 18 Items, 7 Mutators & 3 Minigames
class MatchSimulation {
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
    if (trial?.mutators) {
      this.settings.activeMutators = Array.from(new Set([...(this.settings.activeMutators || []), ...trial.mutators]));
    }
    if (trial?.targetScore) {
      this.settings.scoreLimit = trial.targetScore;
    }
    this.audio = audio;
    this.onGoal = onGoal;
    this.onMatchEnd = onMatchEnd;

    this.ballPreset = BALL_PRESETS[settings.ballPreset] || BALL_PRESETS.balanced;

    this.time = 0;
    this.phase = isAttract ? 'playing' : 'countdown';
    this.phaseTimer = isAttract ? 0 : 2.5;
    this.lastCountdownBeep = 4;

    this.isMinigame = ['target_blitz', 'keep_up', 'goalie_gauntlet'].includes(mode);
    this.timeRemaining = mode === 'target_blitz' ? 60 : settings.matchDuration;
    this.unlimitedTime =
      mode === 'keep_up' || mode === 'goalie_gauntlet' || (!this.isMinigame && settings.matchDuration === 0);
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
      active: settings.itemMode !== 'off' && !this.isMinigame,
      x: VIRTUAL_WIDTH / 2,
      y: 305,
      heldItemId: null,
      spawnTimer: settings.itemMode === 'frantic' ? 3.0 : 5.5,
    };

    this.shells = [];
    this.torpedoes = [];
    this.keepers = [];
    this.hounds = [];
    this.bananas = [];
    this.targets = [];
    this.particles = [];
    this.shockwaves = [];

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

    const bossScale = cfg.bossScale || 1.0;

    return {
      slot: cfg.slot ?? idx,
      team: cfg.team,
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
    if (this.isAttract) return;
    this.shakeMag = Math.min(36, Math.max(this.shakeMag, mag * this.settings.screenShake));
  }

  addHitstop(duration) {
    if (this.isAttract || !this.settings.hitstop) return;
    this.hitstopTimer = Math.max(this.hitstopTimer, duration);
  }

  spawnBurst(x, y, color, count = 12, speed = 360, size = 7, shape = 'circle') {
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
    if (this.isAttract) return;
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
      this._stepWorld(simDt, playerInputs, false);
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

    if (this.scores[0] === this.scores[1] && !this.suddenDeath) {
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
    if (this.onMatchEnd) {
      if (this.immediateEnd) {
        this.onMatchEnd(this.getSummary());
      } else {
        setTimeout(() => {
          this.onMatchEnd(this.getSummary());
        }, 1350);
      }
    }
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
    }
    this.triggerBanner('PLAY ON!', '', '#38bdf8', 0.75);
    this.audio?.playWhistle('start');
  }

  // --- Sub-Stepped World Physics ---
  _stepWorld(dt, playerInputs, allowScoring) {
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
      const inp = playerInputs[i] || {};
      this._updatePlayer(p, inp, dt);
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

    // Sub-step balls (4 substeps = zero tunneling!)
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
          if (foe !== p && foe.team !== p.team && foe.starTimer <= 0) {
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

    if (p.parryWindowTimer > 0) {
      this._checkParryDeflect(p);
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
      this.audio?.playJump(p.char, true);
      this.spawnBurst(p.x, p.y + p.halfH * 0.6, p.char.aura, 9, 240, 6);
    }

    if (inp.jumpReleased && p.vy < -280) {
      p.vy *= 0.56;
    }

    // Princess Pippa's Royal Hover!
    p.isHovering = false;
    if (!p.onGround && p.jumpsLeft === 0 && p.hoverFuel > 0 && inp.up && p.vy > 60) {
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

    if (p.kickTimer > 0) {
      p.kickTimer -= dt;
      this._checkActiveKickHits(p);
    }

    this._moveAndCollidePlayer(p, dt, inp.down);

    // Sky-Cloud Courier Item Pickup!
    if (!p.isClone && this.courier.active && this.courier.heldItemId) {
      const bx = this.courier.x;
      const by = this.courier.y + 92;
      if (Math.hypot(p.x - bx, p.y - by) < p.halfH + 42) {
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
    if (p.y + p.halfH > ar.goalFloorY + 14) {
      if (p.x - p.halfW < ar.pitchLeftX) {
        p.x = ar.pitchLeftX + p.halfW;
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
        if (p.char.stats.shellSlide && p.dashTimer > 0) {
          p.dashDir = -1;
          p.facing = -1;
          this.audio?.playBallBounce(550);
        } else if (p.vx > 0) {
          p.vx = 0;
        }
      }
    }

    p.touchingWallDir = 0;
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
            this.spawnBurst(b.x, b.y, '#fde047', 10, 240, 6);
          }
        }

        // Shockwave Stumbles Nearby Opponents
        for (const foe of this.players) {
          if (foe !== p && foe.team !== p.team && foe.starTimer <= 0 && foe.onGround) {
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

    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.angle += b.angVel * dt;

    const r = b.radius;
    const upperLeftX = ar.goalLineLeftX + 52;
    const upperRightX = ar.goalLineRightX - 52;

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
        this.audio?.playBallKick(0.75, false);
        this.spawnBurst(kp.x + outDir * 30, kp.y, '#f472b6', 12, 340, 7);
        this.spawnFloatingText(kp.x, kp.y - 65, 'SAVED!', '#4ade80', 24);
      }
    }

    // 10. Body Dribble / Header / Captain Spore Cap-Bounce!
    for (const p of this.players) {
      const headBonus = p.bigHead ? 1.18 : 1.0;
      const cx = Math.max(p.x - p.halfW * 0.84, Math.min(p.x + p.halfW * 0.84, b.x));
      const cy = Math.max(p.y - p.halfH * 0.9 * headBonus, Math.min(p.y + p.halfH * 0.85, b.y));
      const dx = b.x - cx;
      const dy = b.y - cy;
      const dist = Math.hypot(dx, dy);

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

          // Hit balls
          for (const b of this.balls) {
            if (Math.hypot(b.x - ic.x, b.y - (ic.y + 32)) < 28 + b.radius) {
              b.vy = 620;
              b.vx += (b.x >= ic.x ? 1 : -1) * 420;
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
            if (p.invulnTimer > 0 || p.starTimer > 0 || p.fireImmuneTimer > 0) continue;
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
      const gravComp = 0.5 * this.ballPreset.gravity * tFlight;
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
      if (!ball.lastWasMeteorSpike) {
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
    } else {
      const teamMate = this.players.find((p) => p.team === scoringTeam && !p.isClone);
      if (teamMate) teamMate.stats.goals++;
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
    this.phaseTimer = 2.15;
    if (this.settings.goalSlowMo) {
      this.slowMoFactor = 0.28;
      this.slowMoTimer = 1.5;
      this.cameraZoom = 1.12;
      this.cameraFocusX = VIRTUAL_WIDTH / 2 + (scoringTeam === 0 ? 220 : -220);
      this.cameraFocusY = 590;
    }

    const idx = this.balls.indexOf(ball);
    if (idx !== -1) this.balls.splice(idx, 1);

    this.triggerBanner(
      'GOOOAL!!',
      scorer ? `${scorer.char.name.toUpperCase()} SCORES!` : 'WHAT A STRIKE!',
      scorer ? scorer.char.primary : '#fde047',
      2.1
    );

    if (this.onGoal) this.onGoal(scoringTeam, this.scores);
  }

  // --- Sky-Cloud Courier & All 18 Power-Up Mechanics ---
  _updateCourier(dt) {
    if (!this.courier.active) return;
    this.courier.x = VIRTUAL_WIDTH / 2 + Math.sin(this.time * 0.65) * 430;
    this.courier.y = 305 + Math.sin(this.time * 1.3) * 46;

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
        this.scores[p.team]++;
        p.stats.goals++;
        this.addShake(14);
        this.spawnShockwave(p.x, p.y, '#10b981', 260, 10);
        this.spawnBurst(p.x, p.y, '#fef08a', 26, 480, 8, 'rect');
        if (this.onGoal) this.onGoal(p.team, this.scores);
        if (this.settings.scoreLimit > 0 && this.scores[p.team] >= this.settings.scoreLimit) {
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
              slot: 20 + Math.floor(Math.random() * 1000),
              team: p.team,
              tag: 'CLONE',
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
      return (p1.stats.meteorSpikes || 0) >= (this.trial.targetScore || 2);
    }
    if (this.trial.specialRule === 'wall_jumps') {
      return (p1.stats.wallJumps || 0) >= (this.trial.requiredWallJumps || 3);
    }
    if (this.trial.specialRule === 'parry_shutout') {
      return this.scores[1] === 0 && (p1.stats.parries || 0) >= (this.trial.requiredParries || 3);
    }
    return true;
  }

  getSummary() {
    let winnerTeam = -1;
    if (this.scores[0] > this.scores[1]) winnerTeam = 0;
    else if (this.scores[1] > this.scores[0]) winnerTeam = 1;

    return {
      mode: this.mode,
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


// === src/main.js ===
// Super Kick Kingdom 2.0 (Deluxe Edition) — Main Game Controller, UI State Machine & Render Loop
// Wires 12 Strikers (+3 Kits), 7 Hazard Arenas, 18 Items, 7 Mutators, 4 Cups (1P/Co-op),
// Party Knockout Tournament, 3 Arcade Minigames, Locker Room, Star-Coins & 24 Trophies!
class SuperKickKingdomApp {
  constructor() {
    this.save = loadSaveData();
    this.settings = this.save.settings;
    this.controls = this.save.controls;

    this.audio = new AudioEngine(this.settings);
    this.input = new InputManager(this.controls);
    this.touch = new TouchController(this.input, this);
    this.art = new ArtRenderer();
    this.ai = new AIController();

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

    this.lastFrameTime = performance.now();
    requestAnimationFrame((ts) => this._loop(ts));
  }

  _persist() {
    this.save.settings = this.settings;
    this.save.controls = this.controls;
    saveData(this.save);
    this._syncMenuBadges();
  }

  _isMinigameMode(mode = this.selectedMode) {
    return mode === 'target_blitz' || mode === 'keep_up' || mode === 'goalie_gauntlet';
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
    el.innerHTML = `<div style="font-size:24px">${icon}</div><div><strong>${title}</strong><span>${subtitle}</span></div>`;
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
    const openMutBtn = document.getElementById('btn-open-mutators');
    if (openMutBtn) {
      openMutBtn.addEventListener('click', () => {
        this.audio.playClick();
        this._openMutatorsModal();
      });
    }
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
        document.getElementById('modal-arcade').classList.add('hidden');
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
        document.getElementById(el.dataset.close).classList.add('hidden');
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
      syncForm();
      this._syncQuickRulePills();
      this._persist();
    });
  }

  _openModal(id) {
    if (id === 'modal-options') this._syncOptionsForm();
    document.getElementById(id).classList.remove('hidden');
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
        document.getElementById('modal-cups').classList.add('hidden');
        this._showScreen('select');
      });
      grid.appendChild(card);
    }

    document.getElementById('modal-cups').classList.remove('hidden');
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
    document.getElementById('modal-trials').classList.remove('hidden');
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

    document.getElementById('modal-trials').classList.add('hidden');
    this.startMatch();
  }

  _openTourneyModal(keepExisting = false) {
    if (!keepExisting || !this.tourneyState) {
      this._generateTournamentBracket();
    } else {
      this._renderTournamentBracket();
    }
    document.getElementById('modal-tourney').classList.remove('hidden');
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
      if (h === 0) chosen = CHARACTERS[this.charIdx0];
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

    document.getElementById('modal-tourney').classList.add('hidden');
    this.startMatch();
  }

  _openArcadeModal() {
    document.getElementById('rec-target').textContent = `BEST: ${this.save.stats.targetBestScore} PTS`;
    document.getElementById('rec-keepup').textContent = `BEST: ${this.save.stats.keepUpBestTime.toFixed(1)}s`;
    document.getElementById('rec-gauntlet').textContent = `BEST: ${this.save.stats.gauntletBestSaves} SAVES`;
    document.getElementById('modal-arcade').classList.remove('hidden');
  }

  _openMutatorsModal() {
    this._renderMutatorsGrid();
    document.getElementById('modal-mutators').classList.remove('hidden');
  }

  _renderMutatorsGrid() {
    const grid = document.getElementById('mutators-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const active = this.settings.activeMutators || [];

    for (const mut of MUTATORS) {
      const isOn = active.includes(mut.id);
      const card = document.createElement('div');
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
  }

  _openLockerModal(tab = this.lockerTab) {
    this.lockerTab = tab;
    document.getElementById('chk-party-unlock').checked = Boolean(this.settings.partyUnlockAll);
    this._renderLockerContent();
    document.getElementById('modal-locker').classList.remove('hidden');
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
    document.getElementById('modal-controls').classList.remove('hidden');
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
              const existing = this.controls[playerKey][act] || [];
              this.controls[playerKey][act] = [newCode, ...existing.filter((c) => c !== newCode)].slice(0, 2);
              this._persist();
              this.audio.playClick();
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
    this.screen = next;
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
    if (this.selectedMode === '1v1_pvp') {
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
      const card = document.createElement('div');
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
    document.getElementById('arena-desc').textContent = curArena.desc;

    this._syncQuickRulePills();
    this._syncMenuBadges();
  }

  _populateFighterCard(slot, baseChar, kitIdx) {
    const ch = getCharacter(baseChar.id, kitIdx);
    const unlocked = isCharUnlocked(this.save, baseChar.id);
    const requiresUnlock =
      !unlocked && (slot === 0 || this.selectedMode === '1v1_pvp');

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
      const activeIdx = slot === 0 ? this.charIdx0 : this.charIdx1;
      const showLockedStyle = !chipUnlocked && (slot === 0 || this.selectedMode === '1v1_pvp');
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

    // Special [ 🎲 ] Random Striker Roulette Chip
    const rndChip = document.createElement('button');
    rndChip.className = 'roster-chip random-roster-chip';
    rndChip.innerHTML = '🎲';
    rndChip.title = 'Roll Random Striker!';
    rndChip.addEventListener('click', () => {
      if (slot === 1 && (this.selectedMode === 'cup' || this._isMinigameMode())) return;
      this.randomizePlayer(slot);
    });
    strip.appendChild(rndChip);
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
    const ch0 = CHARACTERS[this.charIdx0];
    const ch1 = CHARACTERS[this.charIdx1];
    const arena = ARENAS[this.arenaIdx] || ARENAS[0];
    let introTitle = '';
    let playersConfig = [];

    if (this._isMinigameMode()) {
      playersConfig = [
        { slot: 0, team: 0, tag: 'P1', charId: ch0.id, kitIdx: this.kitIdx0, isAI: false, role: 'striker' },
      ];
      if (this.selectedMode === 'keep_up') introTitle = 'DON’T LET ANY BALL HIT THE LAVA!';
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
        if (this.input.connectedGamepads > ent.humanIdx) return ent.humanIdx;
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
          slot: slotA,
          team: 0,
          tag: tm.pA.tag,
          charId: tm.pA.charId,
          kitIdx: tm.pA.kitIdx,
          isAI: tm.pA.isAI,
          role: 'striker',
        },
        {
          slot: slotB,
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
      settings: this.settings,
      audio: this.audio,
      introTitle,
      onGoal: () => this._syncHUD(),
      onMatchEnd: (summary) => this._handleMatchFinished(summary),
    });

    this._setupMatchHUD(ch0, ch1);
    this._showScreen('match');
    this._syncHUD();
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

    const controlsToast = document.getElementById('controls-toast');
    if (this.selectedMode === '2v2' && (this.twoVsTwoFormat === '4p' || (this.match?.players.filter((p) => !p.isAI).length >= 4))) {
      controlsToast.innerHTML = `
        <span><b>🎮 4P 2v2 COUCH:</b> P1 (Pad 1/WASD) &amp; P3 (Pad 3/IJKL) vs P2 (Pad 2/Arrows) &amp; P4 (Pad 4/NumPad)</span>
        <span class="toast-sep">|</span>
        <span><b>CONTROLS:</b> Stick/D-Pad Move • <b>A:</b> Jump • <b>X:</b> Strike (Hold: Charge, Up+X: Lob, Down in Air: Ground Pound) • <b>B/LB:</b> Dash • <b>RB:</b> Item • <b>Start:</b> Pause</span>
      `;
    }

    const p2Hint = document.getElementById('p2-toast-hint');
    const sep = document.querySelector('.toast-sep');
    const hasTwoHumans = this.match?.players.filter((p) => !p.isAI).length >= 2;
    if (p2Hint) p2Hint.classList.toggle('hidden', !hasTwoHumans);
    if (sep) sep.classList.toggle('hidden', !hasTwoHumans);

    const hypeRow = document.getElementById('hud-hype-row');
    const hypeBox1 = document.getElementById('hype-box-1');
    if (this.settings.hyperStrikes === false) {
      hypeRow.classList.add('hidden');
    } else {
      hypeRow.classList.remove('hidden');
      hypeBox1.style.visibility = this._isMinigameMode() ? 'hidden' : 'visible';
    }

    if (this.selectedMode === 'target_blitz') {
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

    if (this.selectedMode === 'target_blitz') {
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
    } else if (m.suddenDeath && this.settings.suddenDeathMode === 'golden') {
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
    if (this.settings.hyperStrikes !== false && m.hype) {
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
    this.paused = forceState !== undefined ? forceState : !this.paused;
    document.getElementById('modal-pause').classList.toggle('hidden', !this.paused);
    document.getElementById('controls-toast').style.opacity = this.paused ? '1' : '0.85';
  }

  _handleMatchFinished(summary) {
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
        <td><b>${pl.stats.goals}</b></td>
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
    if (summary.players.some((p) => p.team === 0 && (p.stats.comboPasses || 0) >= 1) && humans.length > 0) {
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

    if (summary.mode === '1v1_cpu' && this.settings.aiDifficulty === 'legend' && summary.winnerTeam === 0) {
      this._unlockTrophy('legend_slayer');
    }

    if (this.save.wonCups.includes('meadow_cup')) this._unlockTrophy('cup_meadow');
    if (this.save.wonCups.includes('sky_cup')) this._unlockTrophy('cup_sky');
    if (this.save.wonCups.includes('haunted_cup')) this._unlockTrophy('cup_haunted');
    if (this.save.wonCups.includes('cosmic_cup')) this._unlockTrophy('cup_cosmic');

    if ((summary.mode === '2v2' || (summary.mode === 'cup' && this.cupCoop)) && summary.winnerTeam === 0) {
      this._unlockTrophy('coop_champ');
    }

    if (this.save.stats.targetBestScore >= 2500) this._unlockTrophy('target_ace');
    if (this.save.stats.keepUpBestTime >= 45) this._unlockTrophy('keepup_pro');
    if (this.save.stats.gauntletBestSaves >= 15) this._unlockTrophy('gauntlet_wall');

    if (!isMini && (this.settings.activeMutators?.length || 0) >= 3) {
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

    this._handleGlobalShortcuts();

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
        const inputs = this.match.players.map((pl) =>
          pl.isAI ? this.ai.computeInput(pl, this.match, rawDt) : this.input.getPlayerInput(pl.slot)
        );
        this.match.update(rawDt, inputs);
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

  _anyModalOpen() {
    return Array.from(document.querySelectorAll('.modal-backdrop')).some(
      (m) => !m.classList.contains('hidden') && m.id !== 'modal-pause'
    );
  }

  _handleGlobalShortcuts() {
    if (this.input.rebindingCallback) return;

    if (this.input.wasKeyJustPressed('KeyM')) {
      this.audio.toggleMute();
      this._syncMuteButton();
      this._persist();
    }

    if (this.input.wasKeyJustPressed('KeyF')) {
      if (this.touch) this.touch.toggleFullscreen();
    }

    if (this._anyModalOpen()) {
      if (
        this.input.wasKeyJustPressed('Escape') ||
        this.input.wasStartJustPressed() ||
        this.input.wasGamepadButtonJustPressed(0, 1) ||
        this.input.wasGamepadButtonJustPressed(0, 8)
      ) {
        this.audio.playBack();
        document.querySelectorAll('.modal-backdrop').forEach((m) => {
          if (m.id !== 'modal-pause') m.classList.add('hidden');
        });
      }
      return;
    }

    if (this.screen === 'match') {
      if (
        this.input.wasKeyJustPressed('Escape') ||
        this.input.wasKeyJustPressed('KeyP') ||
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
        this.input.wasKeyJustPressed('Enter') ||
        this.input.wasKeyJustPressed('Space') ||
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
        this.input.wasKeyJustPressed('Enter') ||
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
    const ctx = this.ctx;
    ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    const ar = ARENAS[this.arenaIdx] || ARENAS[0];
    const img =
      this.screen === 'select'
        ? this.art.images[ar.bgKey] || this.art.images.title_bg
        : this.art.images.title_bg;

    if (img) {
      const zoom = 1.03 + Math.sin(tSec * 0.4) * 0.015;
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
      const minHeadroom = 22;
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
      const hop = Math.abs(Math.sin(tSec * 6.5 + i * 0.9)) * 20;
      const dummy = {
        x: xPos,
        y: 94 - hop,
        vx: 0,
        vy: 0,
        facing: i === 0 ? 1 : -1,
        char: pl.char,
        visualScale: 1.08,
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
    ctx.save();
    ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // Camera Zoom & Impact Shake Transform!
    ctx.translate(VIRTUAL_WIDTH / 2 + m.shakeX, VIRTUAL_HEIGHT / 2 + m.shakeY);
    ctx.scale(m.cameraZoom, m.cameraZoom);
    ctx.translate(-m.cameraFocusX, -m.cameraFocusY);

    // 1. Lush Hand-Painted Illustrated Stadium Background (All 7 Biomes)
    this.art.drawArenaBackground(ctx, m.arena, m.time);

    // 2. Sky-Cloud Courier & Item Bubble
    this.art.drawCloudCourier(ctx, m.courier, m.time);

    // 3. Target Blitz Bullseyes
    for (const tg of m.targets) {
      this.art.drawTargetEntity(ctx, tg, m.time);
    }

    // 4. Shroom GoalKeepers
    for (const kp of m.keepers) {
      this.art.drawGoalKeeperEntity(ctx, kp, m.time);
    }

    // 5. Foreground Stadium Architecture, Turf, Molten/Glacier Sheen, Goal Nets & Pedestals
    this.art.drawArenaForeground(ctx, m.arena, m, m.time);

    // 6. Interactive Stage Hazards, Pinball Bumpers & Goalie Gauntlet Striker-Cannon
    this.art.drawStageHazards(ctx, m, m.time);

    // 7. Chain-Hounds, Banana Slicks, Ricochet Shells & Cannon Torpedoes
    for (const hd of m.hounds) {
      this.art.drawChainHoundEntity(ctx, hd, m.time);
    }
    for (const bn of m.bananas) {
      this.art.drawBananaEntity(ctx, bn, m.time);
    }
    for (const sh of m.shells) {
      this.art.drawShellEntity(ctx, sh, m.time);
    }
    for (const tp of m.torpedoes) {
      this.art.drawTorpedoEntity(ctx, tp, m.time);
    }

    // 8. Articulated 2D Character Puppets (12 Strikers + Shadow Clones)
    for (const pl of m.players) {
      this.art.drawCharacterPuppet(ctx, pl, m.balls, m.time);
    }

    // 9. Soccer Balls (6 Skins, Rugby Egg-Ball, Magnus Spin Trails, Combo Voltage & Vanish Shot)
    const isRugby = m.hasMutator('rugbyBall');
    for (const b of m.balls) {
      this.art.drawBall(ctx, b, m.arena.pitchFloorY, m.time, this.settings.equippedBallSkin, isRugby);
    }

    // 10. Particles, Custom Goal Explosions, Shockwaves & Floating Callouts
    this.art.drawParticles(ctx, m.particles, m.shockwaves);

    // 10b. Dynamic Additive Scene Lighting & Bloom Pass!
    this.art.drawDynamicLighting(ctx, m, m.time);

    ctx.restore();

    // 11. Signature Hyper-Strike Anime Cut-In Banner!
    this.art.drawHyperCutIn(ctx, m.hyperCutIn, m.time);

    // 12. Dramatic Center-Screen Arcade Banner (3..2..1, GOOOAL!!, SUDDEN DEATH!)
    if (m.bannerTimer > 0 && m.bannerText) {
      ctx.save();
      const pop = Math.min(1, m.bannerTimer * 4.5);
      const bounceScale = 0.85 + Math.sin(pop * Math.PI * 0.65) * 0.22;
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


})();
