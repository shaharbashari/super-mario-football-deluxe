# Super Mario Football Deluxe (Super Kick Kingdom 2.0)

An expanded, feature-packed arcade Kung-Foot sports brawler built as a loving deluxe reimagining of S&A Games' 2019 [*Super Mario Football*](https://sa-games.itch.io/super-mario-football) (originally created in Construct 3 and inspired by *Rayman Legends*' "Kung Foot" minigame).

## What's Inside Deluxe Edition

- **12 Playable All-Star Mario Strikers (+ 3 Jersey Kits Each):**
  - **Starter 6 (Authentic Multi-Frame Animation):** *Mario*, *Luigi*, *Princess Peach*, *Yoshi*, *Wario*, and *Bowser*.
  - **6 Unlockable All-Star Strikers:** *Waluigi* (long-leg topspin whip), *Toad* (trampoline mushroom cap), *Donkey Kong* (ground-pound shockwave slam), *Rosalina* (low gravity + orbiting Luma companion), *King Boo* (intangible phantom dash & spectral vanish-shot), and *Bowser Jr.* (wall-ricochet turbo shell-slide).
- **10-Column × 6-Row Multi-Frame Fluid Animation Engine:**
  - Multi-frame continuous idle breathing/bobbing loops
  - Dynamic velocity-scaled running stride cycles (up to 9 frames)
  - Multi-frame aerial jump ascent, apex, and falling transitions
  - Windup, impact strike, and recovery volley kick sequences
  - Cartoon knockback recoil with orbiting dizzy stars
- **Signature Hyper-Strikes & Technical Mastery:**
  - **Team Hype Meter (0–100%) + 12 Signature Hyper-Strikes** with anime cut-in banners and unique shot trajectories.
  - **Ground Pound & Meteor Spike:** Press **Down** while airborne to stall in mid-air and rocket downward at `2200 px/s`! Crushes balls directly downward into meteoric floor bounces, stuns adjacent opponents with shockwaves, and bounces defenders off the pitch.
  - **Wall-Jump & Wall-Slide Pro Tech:** Clinging to walls while airborne caps downward slide speed with friction dust. Press **Jump** while clinging to kick off diagonally with refreshed mid-air agility!
  - **Simplified Directional Kick Controls:** Press **Up + Strike** for an effortless Directional Sky Lob without needing a secondary button.
  - **Perfect Parry / Deflect:** Tap **Dash** or **Strike** right as a fast enemy shot arrives (`≤95ms`) for a golden shockwave counter!
  - **Magnus Spin Curve:** Hold **Up** or **Down** while striking to bend shots over keepers or dip under the crossbar.
  - **3-Tier Voltage Pass Combo & Hyper Voltage Overdrive (2v2):** Consecutive teammate passes supercharge the ball (`1.2×` → `1.32×` → `1.48×` Hyper Voltage Overdrive with lightning aura, heavy screen shake, and blocker knockdowns!).
- **7 Hand-Illustrated Stadiums + Interactive Stage Hazards + 7 Procedural Soundtracks:**
  1. *Mushroom Kingdom Pitch* — Classic recessed side-goals & crisp turf bounce
  2. *Cloud Kingdom* — Floating flank cloud-decks for aerial volleys
  3. *Bowser's Castle* — Erupting lava geysers & high-velocity basalt ricochets
  4. *Luigi's Mansion* — Upper Portrait Warp-Portals that teleport high bank-shots across the ballroom
  5. *DK Jungle* — Bouncy tribal drum-pads for springboard aerials
  6. *Sherbet Land* — Slippery ice drift physics & falling ceiling icicles
  7. *Rosalina's Comet Observatory* — Floaty starlight gravity & a central Accelerator Hoop
- **18 Sky-Courier Power-Up Items:** Classic 10 (`Super Mushroom`, `Mini Mushroom`, `Ice Flower`, `Fire Flower`, `Mega Mushroom`, `Green Shell`, `Bullet Bill`, `POW Block`, `Toad Goalkeeper`, `1-Up Mushroom`) + 8 Deluxe All-Star items (`Super Star`, `Chain Chomp`, `Triple Bananas`, `Magnet Glove`, `Double Cherry`, `Lightning Bolt`, `Warp Pipe`, `Multi-Moon`).
- **9 Mix-and-Match Party Mutators + Quick Presets:** *Big Head Mode*, *Moon Gravity*, *Double-Ball Pitch*, *Egg-Ball Chaos*, *Pinball Bumpers*, *Hyper-Turbo*, *Molten Turf*, *Heavy Iron Core*, and *Magnus Mayhem* (with 1-click presets: *Arcade Chaos* & *Heavy Duel*).
- **7 Game Modes:**
  - **1P vs CPU** (4 AI skill tiers: Rookie, Striker, All-Star, Legend)
  - **2P Couch Versus** (Keyboard + up to 4 Gamepads)
  - **2v2 Team Chaos** (4 strikers on pitch with 3-Tier Voltage Pass Combo & Overdrive)
  - **Striker Trial Dojo (8 Event Challenges):** Hand-crafted trials featuring Meteor Spikes, Wall-Jump Acrobatics, Parry Shutouts, Twin-Ball Juggling, Molten Turf Aerials, Giga Bowser Boss Duel, Shadow Reflections, and Grandmaster 1v2 Showdowns — each awarding Star Medals and hefty Star-Coin bounties!
  - **4 Grand Prix Championship Cups** (*Mushroom Cup*, *Flower Cup*, *Star Cup*, *Special Cup* vs giant **Giga Bowser** — playable **1P Solo** or **2P Couch Co-op**!)
  - **Party Knockout Tournament** (4 or 8 striker visual knockout bracket for 1–4 human players)
  - **Minigame Arcade:** *Target Blitz*, *Keep-Up Survival* (molten pitch juggling), and *Goalie Gauntlet* (3 lives vs escalating Striker-Cannon)
- **Locker Room & Trophy Hall:** Earn **Star-Coins**, unlock 6 Strikers, 6 Ball Skins, 6 Goal Explosions, and **26 Persistent Trophies**, or flip **🎉 Party Unlock All** anytime for instant couch-party access.

## How to Play Instantly

1. **Zero-Server / Offline:** Double-click `index.html` directly in any modern browser (`file://` works out of the box!).
2. **Local Dev Server (Optional):**
   ```bash
   python3 -m http.server 8080
   ```
   Then open `http://localhost:8080`.
3. **Rebuild Bundle After Editing `src/*.js`:**
   ```bash
   node build.mjs
   ```
4. **itch.io Upload:** Upload `super-kick-kingdom-itch.zip` directly as an HTML5 project (`1920x1080` / responsive viewport).

## Default Controls (Fully Rebindable + 4 Gamepads)

| Action | Player 1 (Keyboard) | Player 2 (Keyboard) | Gamepad (Slots 1–4) |
| :--- | :--- | :--- | :--- |
| **Move / Aim Spin** | `W A S D` | `Arrow Keys` | Left Stick / D-Pad |
| **Strike (Hold = Super / Hyper)** | `F` or `Space` | `Enter` or `,` | `X` / `Square` |
| **Ground Pound / Meteor Spike** | Tap `S` / `Down` airborne | Tap `Down` airborne | Down on Left Stick / D-Pad |
| **Wall-Slide & Wall-Jump** | Push into Wall + `W` | Push into Wall + `Up` | Push into Wall + `A` / `Cross` |
| **Sky Uppercut Lob** | `G` or `W + F` | `Right Shift` or `Up + Enter` | `Y` / `Triangle` or `Up + X` |
| **Quick Dash / Perfect Parry** | `Left Shift` or `Q` | `'` or `Right Ctrl` | `B` / `Circle` / `L1` |
| **Use Stored Power-Up** | `H` or `E` | `\` or `/` | `RB` / `RT` / `R3` |
| **Dash / Parry** | `Left Shift` or `Q` | `Right Shift` or `.` | `B` / `LB` / `LT` / `L3` |
| **Pause / Mute** | `P` or `Esc` / `M` | `Esc` | `Start` / `Back` |

*(Player 3 also maps to `I J K L` + `U/O/P/N`; Player 4 maps to Numpad `8 4 5 6` + `7/9/+/Dec`. Up to 4 XInput controllers auto-assign to Slots 1–4).*
