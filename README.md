# Super Mario Football Deluxe

A local arcade football brawler for 1-4 players, inspired by
[S&A Games' 2019 Super Mario Football](https://sa-games.itch.io/super-mario-football)
and the Kung Foot format. No account, backend or runtime package installation
is required.

## Play

[Play online on GitHub Pages](https://shaharbashari.github.io/super-mario-football-deluxe/).

Open `index.html` in a modern browser, or run the local preview:

```powershell
npm run dev
```

Open `http://127.0.0.1:8766`. The server binds to this machine only.
Use **Learn to play** for a guided, untimed practice session. The sideline
coach introduces each mode, explains its stadium and follows the active input
method. Briefings can be skipped, replayed with **How to play**, or disabled
in Options. Practice does not award coins or trophies.

The field keeps its full 16:9 geometry rather than cropping the goals.
Menus and dialogs scroll on small screens. Touch play is best in landscape;
portrait play remains available after dismissing the rotation suggestion.
Fullscreen uses the browser API when available and an explicitly reported
expanded-view fallback otherwise.

## What's included

- 12 strikers with three kits each, six ball skins, six goal effects and
  26 persistent trophies. Six strikers unlock through coins/cups; Party Unlock
  All remains available for local sessions.
- Seven stadiums plus a random selector, 18 power-ups and nine party mutators.
- Solo CPU duels, couch versus, five 2v2 squad formats, four Grand Prix cups
  with solo/co-op play, 4/8-entry tournaments, eight trials and three arcade
  challenges: Target Blitz, Keep-Up Survival and Goalie Gauntlet.
- Double jumps, charge strikes, directional lobs, wall jumps, ground pounds,
  perfect parries, spin, team-pass Voltage and signature Hyper-Strikes.
- A sports-broadcast UI, input-aware prompts, focus-contained dialogs,
  controller navigation and automatic pause on focus/controller loss.
- A 120 Hz simulation step with buffered edge inputs and interpolated
  presentation. Animation clocks run through stun and ground-pound states;
  feet, player labels, items and moving props have consistent presentation.
- Stadium, Club and After-hours music arrangements, four-phrase variations,
  selectable effects palettes and independent master/music/effects/ambience
  volume. Audio uses Web Audio synthesis and audio-clock lookahead scheduling.
- Reduced motion follows the device preference by default and can be
  overridden. Essential movement remains visible; decorative motion and
  shake are reduced.

## Controls

Keyboard bindings can be changed in **Controls**. Conflicting bindings are
explained instead of silently assigning one key to two actions.

| Action | P1 keyboard | P2 keyboard | Standard gamepad |
|---|---|---|---|
| Move | A / D | Left / Right | Left stick / D-pad |
| Jump / double jump | W | Up | A / D-pad Up |
| Strike; hold for charge | Space / F | Enter / comma / Num 1 | X |
| Direct lob | G | Num 2 | Y |
| Aim a lob | Up + Strike | Up + Strike | Stick/D-pad Up + X |
| Ground pound in air | S | Down | Stick/D-pad Down |
| Dash / perfect parry | Left Shift / Q | Right Shift / period / Right Ctrl / Num 0 | B / LB / LT / L3 |
| Use item | E / H | Slash / backslash / Num 3 | RB / RT / R3 |
| Pause | Esc | Esc | Start |

P3 uses **I/J/K/L**, **U** strike, **O** lob, **P** item and **N** dash.
P4 uses **Num 8/4/5/6**, **Num 7** strike, **Num 9** lob,
**Num +** item and **Num .** dash.

**P** also pauses when it is not assigned to a human in the current match.
It never steals P3's item action. **M** toggles audio unless rebound to an
active player's action. **Alt+Enter** toggles fullscreen.

Standard-mapped controllers occupy stable player slots, even with gaps in
browser port indices. D-pad/stick navigates menus, **A** confirms, **B/Back**
returns, and **Start** activates the primary action or pauses play.
Button labels use the Xbox/XInput convention; physical layout and browser
support can differ on other controllers.

Touch has independent stick/D-pad, jump, strike, lob, dash and item sources,
so simultaneous actions do not cancel each other. Releasing a captured drag,
changing screen, hiding controls or losing focus clears held touch input.

## Rules and progression

Match rules in Options apply at the next kickoff. Audio, motion and touch
preferences apply immediately. A zero timer with no score limit is an
intentional endless exhibition; set a score limit if you want it to end.

Trials use their own three-minute timer, score target, balanced ball, stadium
and required mutators. Random items and unrelated party modifiers are disabled.
Meteor trials count **qualifying meteor goals**, not unrelated spike contacts.
The lava trial starts on a safe platform and records every lava contact.
An objective tracker explains progress and failed conditions.

Progress is stored locally in the browser. Known fields are validated on load;
valid unlocks survive recovery. Invalid save data is backed up under the
`super_kick_kingdom_deluxe_v2_recovery` key before replacement. Read/write
failures are reported visibly. Browser profiles and `file://` versus HTTP
origins may have separate saves; there is no cloud synchronization.

## Development

Node.js 20+ is required for development. The browser has no Node dependency.

```powershell
npm ci
npm run build
npm test
npm run test:browser
npm run build:check
```

If Playwright reports that its browser is missing, run
`npx playwright install chromium` once and rerun the browser suite.

Edit `src` modules, not `dist/bundle.js`. Register new runtime modules in
`build.mjs` in dependency order, then rebuild. The checked-in IIFE bundle
keeps direct `file://` launch working; `build:check` detects source/bundle
drift with consistent line endings. Building also fingerprints the stylesheet
and bundle URLs in `index.html` so a deployment does not mix cached old code
with the new interface.

GitHub Pages publishes the repository root from `main`. `.nojekyll` preserves
the static files without Jekyll processing. Build and verify before publishing;
a normal update to `main` triggers the existing Pages deployment.

The Node suite covers input ownership, physics, trials, animation, coaching,
save recovery and all stadium/item simulations. Browser coverage exercises
responsive layouts, dialogs, all mode families, gamepad emulation, touch,
audio, missing assets and offline launch. Emulation is not a substitute for
testing real controllers, mobile Safari or touch latency on hardware.

### Assets

Character atlases are **24 columns by six rows**, with **128-pixel cells**
(`3072 x 768`). Used row lengths are `24, 24, 16, 12, 12, 16`.
The renderer derives cell size from the image and bounds its caches:
six recent character sheets, 192 recolored/silhouette frames and three
terrain surfaces.

The portable optimization/validation tool requires Python and Pillow:

```powershell
python -m pip install -r requirements-dev.txt
python tools\optimize_assets.py --check
```

Run without `--check` to downsample a regenerated `6144 x 1536` source atlas.
This keeps the existing poses; it does not invent new hand-drawn frames.
The original twelve runtime PNGs went from **59.9 MB to 17.7 MB**, and decoded
memory per sheet went from **36 MiB to 9 MiB**.

The six root-level Swift tools are historical, macOS-only asset experiments.
They use Apple graphics frameworks and several incompatible atlas layouts;
they are not part of the current build. Do not run them over the optimized
runtime files without checking their input/output format. Source frames,
legacy sheets and raw references are retained for provenance and future art work.

## Audit, roadmap and release limits

See [the repository-wide audit and overhaul plan](docs/GAME-QUALITY-PLAN.md)
for findings, acceptance criteria, stadium-specific recommendations and the
next-level product roadmap.

This repository contains Nintendo-character imagery and extracted animation
frames without a complete permission inventory. Attribution is not a
redistribution license. Verify permission or replace the relevant names,
characters and assets with owned/licensed material before public or commercial
distribution. No new artwork ownership or legal clearance is implied by this
overhaul.
