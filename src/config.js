// Super Kick Kingdom 2.0 (Deluxe Edition) — Master Configuration
// 12 strikers, 7 stadiums, 18 items, 9 mutators, 4 cups and 26 trophies.

export const VIRTUAL_WIDTH = 1920;
export const VIRTUAL_HEIGHT = 1080;
export const FIELD_CHARACTER_DRAW_SIZE = 128;
export const COURIER_LAYOUT = {
  bodyScale: 1.5,
  baseY: 335,
  itemOffsetY: 136,
  bubbleRadius: 52,
  itemRadius: 40,
};

export const CHARACTERS = [
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

export const ITEMS = [
  // Classic 10 Authentic Mario Items
  {
    id: 'RedMushroom',
    name: 'Super Mushroom',
    desc: 'Grow 2x huge with booming reach and shot power for 6s!',
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
    desc: '5.2s rainbow invincibility, +32% speed & tackle foes on contact!',
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
    desc: 'Curves & magnetically pulls balls toward your striker for 4s!',
    color: '#e11d48',
    weight: 10,
    competitive: true,
  },
  {
    id: 'ShadowClone',
    name: 'Double Cherry',
    desc: 'An AI striker double assists your team for 7.5s (up to two clones).',
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

export const ARENAS = [
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

export const MUTATORS = [
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

export const GRAND_PRIX_CUPS = [
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

export const BALL_SKINS = [
  { id: 'classic', name: 'Classic Striker', cost: 0, primary: '#ffffff', panel: '#1e293b' },
  { id: 'gold_star', name: 'Super Star Gold', cost: 100, primary: '#fef08a', panel: '#ca8a04' },
  { id: 'watermelon', name: 'Yoshi Island Melon', cost: 120, primary: '#4ade80', panel: '#14532d', core: '#f43f5e' },
  { id: 'iron_spike', name: 'Spike Iron-Core', cost: 150, primary: '#94a3b8', panel: '#0f172a' },
  { id: 'beach_orb', name: 'Cheep-Cheep Beachball', cost: 120, primary: '#ffffff', panel: '#ef4444', altPanel: '#38bdf8' },
  { id: 'cosmic_nebula', name: 'Comet Observatory Orb', cost: 200, primary: '#e9d5ff', panel: '#6b21a8' },
];

export const GOAL_EXPLOSIONS = [
  { id: 'confetti', name: 'Stadium Confetti', cost: 0, colors: ['#ef4444', '#facc15', '#22c55e', '#38bdf8', '#f472b6'] },
  { id: 'fireworks', name: 'Golden Fireworks', cost: 100, colors: ['#fde047', '#fb923c', '#ffffff', '#facc15'] },
  { id: 'frost_nova', name: 'Ice Flower Nova', cost: 120, colors: ['#ecfeff', '#67e8f9', '#38bdf8', '#0284c7'] },
  { id: 'flame_pillars', name: 'Bowser Inferno', cost: 140, colors: ['#fef08a', '#f97316', '#ef4444', '#991b1b'] },
  { id: 'coin_shower', name: 'Question-Block Gold Coins', cost: 180, colors: ['#fef08a', '#facc15', '#eab308', '#ca8a04'] },
  { id: 'rainbow_wave', name: 'Rainbow Road Starlight', cost: 220, colors: ['#f43f5e', '#facc15', '#4ade80', '#38bdf8', '#c084fc'] },
];

export const TROPHIES = [
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

export const STRIKER_TRIALS = [
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
    specialRule: 'no_lava',
    ruleText: 'Start on the central platform. Win without touching the molten floor!',
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

export const BALL_PRESETS = {
  balanced: { label: 'Balanced Arcade', gravity: 1280, restitution: 0.84, airDrag: 0.996, radius: 38, kickMultiplier: 1.0 },
  bouncy: { label: 'Bouncy Beach-Orb', gravity: 960, restitution: 0.94, airDrag: 0.997, radius: 42, kickMultiplier: 1.08 },
  heavy: { label: 'Heavy Striker Leather', gravity: 1580, restitution: 0.74, airDrag: 0.994, radius: 36, kickMultiplier: 0.95 },
  pinball: { label: 'Pinball Turbo', gravity: 1220, restitution: 0.96, airDrag: 0.9985, radius: 35, kickMultiplier: 1.22 },
};

export const AI_DIFFICULTIES = {
  rookie: { label: 'Rookie', reactionDelay: 0.24, aimJitter: 0.25, aggression: 0.42, useCharge: 0.08, useSpike: 0.15, useDash: 0.1, itemSmartness: 0.4 },
  striker: { label: 'Striker', reactionDelay: 0.13, aimJitter: 0.12, aggression: 0.62, useCharge: 0.26, useSpike: 0.45, useDash: 0.35, itemSmartness: 0.72 },
  pro: { label: 'All-Star', reactionDelay: 0.06, aimJitter: 0.05, aggression: 0.78, useCharge: 0.5, useSpike: 0.72, useDash: 0.62, itemSmartness: 0.9 },
  legend: { label: 'Kung-Foot Legend', reactionDelay: 0.02, aimJitter: 0.015, aggression: 0.92, useCharge: 0.72, useSpike: 0.9, useDash: 0.86, itemSmartness: 1.0 },
};

export const DEFAULT_CONTROLS = {
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

export const DEFAULT_SETTINGS = {
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
  ambienceVolume: 0.25,
  musicStyle: 'stadium',
  soundPalette: 'arcade',
  motion: 'auto',
  showTips: true,
  muted: false,
};

export const STORAGE_KEY = 'super_kick_kingdom_deluxe_v2';
let recoverySave = null;

const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const validKey = code => typeof code === 'string' &&
  /^(Key[A-Z]|Digit[0-9]|Arrow(Up|Down|Left|Right)|Space|Enter|Shift(Left|Right)|Control(Left|Right)|Numpad([0-9]|Add|Subtract|Multiply|Divide|Decimal|Enter)|Backslash|Slash|Comma|Period|Quote|Semicolon|Bracket(Left|Right)|Minus|Equal|Backquote)$/.test(code);

function hasRecoveredFields(source, recovered) {
  if (!isRecord(source) || !isRecord(recovered)) return JSON.stringify(source) !== JSON.stringify(recovered);
  return Object.keys(source).some(key => key !== 'version' && Object.hasOwn(recovered, key) &&
    (isRecord(source[key]) && isRecord(recovered[key])
      ? hasRecoveredFields(source[key], recovered[key])
      : JSON.stringify(source[key]) !== JSON.stringify(recovered[key])));
}

export function normalizeSettings(value) {
  const source = isRecord(value) ? value : {};
  const result = { ...DEFAULT_SETTINGS, activeMutators: [] };
  const choices = {
    matchDuration: [0, 60, 120, 180, 300],
    scoreLimit: [0, 3, 5, 7, 10],
    suddenDeathMode: ['golden', 'mayhem'],
    itemMode: ['standard', 'frantic', 'competitive', 'off'],
    ballPreset: Object.keys(BALL_PRESETS),
    aiDifficulty: Object.keys(AI_DIFFICULTIES),
    touchControls: ['auto', 'on', 'off'],
    musicStyle: ['stadium', 'club', 'chill'],
    soundPalette: ['arcade', 'punchy', 'soft'],
    motion: ['auto', 'full', 'reduced'],
    equippedBallSkin: BALL_SKINS.map(skin => skin.id),
    equippedGoalExplosion: GOAL_EXPLOSIONS.map(effect => effect.id),
  };
  for (const [key, values] of Object.entries(choices)) {
    if (values.includes(source[key])) result[key] = source[key];
  }
  for (const key of ['hyperStrikes', 'stageHazards', 'partyUnlockAll', 'hitstop', 'goalSlowMo', 'muted', 'showTips']) {
    if (typeof source[key] === 'boolean') result[key] = source[key];
  }
  for (const key of ['masterVolume', 'musicVolume', 'sfxVolume', 'ambienceVolume', 'screenShake']) {
    if (typeof source[key] === 'number' && Number.isFinite(source[key])) {
      result[key] = Math.max(0, Math.min(key === 'screenShake' ? 1.4 : 1, source[key]));
    }
  }
  if (Array.isArray(source.activeMutators)) {
    result.activeMutators = [...new Set(source.activeMutators.filter(id => MUTATORS.some(mutator => mutator.id === id)))];
  }
  return result;
}

export function normalizeSaveData(value) {
  const defaultUnlockedChars = CHARACTERS.filter((c) => c.unlockedByDefault).map((c) => c.id);
  const base = {
    version: 3,
    settings: { ...DEFAULT_SETTINGS, activeMutators: [] },
    controls: JSON.parse(JSON.stringify(DEFAULT_CONTROLS)),
    coins: 150, // Welcome starter purse so players can try the Locker Room right away!
    unlockedChars: defaultUnlockedChars,
    unlockedBalls: ['classic'],
    unlockedExplosions: ['confetti'],
    wonCups: [],
    trialsWon: [],
    trophies: [],
    onboarding: { completed: false, seenModes: [] },
    stats: {
      totalGoals: 0,
      matchesPlayed: 0,
      targetBestScore: 0,
      keepUpBestTime: 0,
      gauntletBestSaves: 0,
      cupsWon: 0,
    },
  };

  if (!isRecord(value)) return base;
  const collection = (key, catalog, defaults = []) => [...new Set([
    ...defaults, ...(Array.isArray(value[key]) ? value[key].filter(id => catalog.some(entry => entry.id === id)) : []),
  ])];
  base.settings = normalizeSettings(value.settings);
  if (Number.isFinite(value.coins) && typeof value.coins === 'number') base.coins = Math.max(0, Math.floor(value.coins));
  base.unlockedChars = collection('unlockedChars', CHARACTERS, defaultUnlockedChars);
  base.unlockedBalls = collection('unlockedBalls', BALL_SKINS, ['classic']);
  base.unlockedExplosions = collection('unlockedExplosions', GOAL_EXPLOSIONS, ['confetti']);
  base.wonCups = collection('wonCups', GRAND_PRIX_CUPS);
  base.trialsWon = collection('trialsWon', STRIKER_TRIALS);
  base.trophies = collection('trophies', TROPHIES);
  if (!base.settings.partyUnlockAll) {
    if (!base.unlockedBalls.includes(base.settings.equippedBallSkin)) base.settings.equippedBallSkin = 'classic';
    if (!base.unlockedExplosions.includes(base.settings.equippedGoalExplosion)) base.settings.equippedGoalExplosion = 'confetti';
  }
  for (const [slot, actions] of Object.entries(base.controls)) {
    for (const action of Object.keys(actions)) {
      const saved = value.controls?.[slot]?.[action];
      if (Array.isArray(saved)) {
        const codes = [...new Set(saved.filter(validKey))].slice(0, 4);
        if (codes.length) actions[action] = codes;
      }
    }
  }
  for (const key of Object.keys(base.stats)) {
    const saved = value.stats?.[key];
    if (typeof saved === 'number' && Number.isFinite(saved) && saved >= 0) {
      base.stats[key] = key === 'keepUpBestTime' ? saved : Math.floor(saved);
    }
  }
  if (isRecord(value.onboarding)) {
    base.onboarding.completed = value.onboarding.completed === true;
    const modes = ['practice', '1v1_cpu', '1v1_pvp', '2v2', 'cup', 'tourney', 'trial', 'target_blitz', 'keep_up', 'goalie_gauntlet'];
    base.onboarding.seenModes = [...new Set((Array.isArray(value.onboarding.seenModes) ? value.onboarding.seenModes : []).filter(mode => modes.includes(mode)))];
  }
  return base;
}

export function loadSaveData(onWarning = message => console.warn(message)) {
  let raw = null;
  try {
    if (typeof localStorage === 'undefined') return normalizeSaveData(null);
    raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return normalizeSaveData(null);
    const parsed = JSON.parse(raw);
    if (!isRecord(parsed)) throw new TypeError('The save must contain an object.');
    const normalized = normalizeSaveData(parsed);
    if (hasRecoveredFields(parsed, normalized)) {
      recoverySave = raw;
      onWarning('Some saved progress fields were invalid. Valid progress was recovered; the original will be backed up.');
    }
    return normalized;
  } catch (error) {
    recoverySave = raw;
    onWarning(`Saved progress could not be loaded: ${error.message}. Playing remains available.`);
    return normalizeSaveData(null);
  }
}

export function saveData(data, onWarning = message => console.warn(message)) {
  try {
    if (recoverySave !== null) {
      localStorage.setItem(`${STORAGE_KEY}_recovery`, recoverySave);
      recoverySave = null;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    onWarning(`Progress could not be saved: ${error.message}. Keep this tab open; new progress may be lost on exit.`);
    return false;
  }
}

export function getCharacter(id, kitIdx = 0) {
  const base = CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
  const index = Number.isInteger(kitIdx) ? ((kitIdx % base.kits.length) + base.kits.length) % base.kits.length : 0;
  const kit = base.kits?.[index];
  if (!kit) return base;
  return {
    ...base,
    primary: kit.primary,
    secondary: kit.secondary,
    accent: kit.accent,
    aura: kit.aura || base.aura,
    kitName: kit.name,
    kitIdx: index,
  };
}

export function getArena(id) {
  return ARENAS.find((a) => a.id === id) || ARENAS[0];
}

export function isCharUnlocked(save, charId) {
  if (save?.settings?.partyUnlockAll) return true;
  return Boolean(save?.unlockedChars?.includes(charId));
}
