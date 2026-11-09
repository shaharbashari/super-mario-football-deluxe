# Super Mario Football Deluxe

A local and online arcade football brawler for 1-4 players, inspired by
[S&A Games' 2019 Super Mario Football](https://sa-games.itch.io/super-mario-football)
and the Kung Foot format. Local play needs no account, backend or runtime
package installation. Online friendlies use room codes and peer-to-peer connections.

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

## Online rooms

Open the hosted game and choose **Online rooms**. Enter a nickname, pick a
striker/kit and select **Create room**. Share the six-character code or **Copy
invite link** with friends. They choose **Join room**, enter the code, and
select their own striker. Every connected player presses **Ready**, then the
host presses **Kick off**.

Rooms support **1v1** and **2v2**, with two to four human players. Empty 2v2
slots use CPU teammates. P1/P3 defend the left goal and P2/P4 defend the right.
Each device uses its own **P1 keyboard bindings, first controller or touch
controls**, regardless of its room slot. The host chooses stadium, duration,
score limit, items, hazards and Hyper-Strikes. Changing rules clears readiness.

The room creator runs the authoritative simulation. Guests send their own
inputs and render interpolated host snapshots; they do not simulate independent
balls or award local progression. Pausing pauses the whole match, and each
player must clear their own pause request before play resumes. Finished rounds
return everyone to the same lobby to ready up for a rematch. A disconnected
player cancels the round; an unresponsive peer is removed after roughly
eight seconds. If the host leaves, the room closes. Online matches do not
award coins, trophies, cup progress or arcade records.

**Connection and privacy limits:** the pinned, locally bundled
[PeerJS client](https://peerjs.com/client/getting-started) uses its public
signaling and default ICE services (STUN/relay), so no hosting account or player
login is needed. A connection is initiated only when creating or joining a
room; opening an invite merely prefills the code. WebRTC peers can learn each
other's IP addresses. Codes are invitations, not account authentication: share
them only with friends. No camera, microphone, chat, cloud saves, matchmaking,
host migration or competitive anti-cheat is provided.

Keep the host's game tab open and use a stable, low-latency connection.
Restrictive school/work networks, VPNs and suspended mobile browsers may block
or interrupt connections; failures are reported rather than silently falling
back to a local match. Public service availability is outside this game's
control. Dedicated hosting/relay and rollback prediction remain future options.

## What's included

- 12 strikers with three kits each, six ball skins, six goal effects and
  26 persistent trophies. Six strikers unlock through coins/cups; Party Unlock
  All remains available for local sessions.
- Seven stadiums plus a random selector, 18 power-ups and nine party mutators.
- Solo CPU duels, couch versus, five 2v2 squad formats, four Grand Prix cups
  with solo/co-op play, 4/8-entry tournaments, eight trials and three arcade
  challenges: Target Blitz, Keep-Up Survival and Goalie Gauntlet.
- Room-code online 1v1/2v2 friendlies, shared lobbies, ready checks, live latency,
  synchronized pause/results and rematches.
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
npm run test:online
npm run build:check
```

If Playwright reports that its browser is missing, run
`npx playwright install chromium` once and rerun the browser suite.
`test:online` requires internet access and exercises separate real browser
peers through the public signaling service. It is separate from the local UI
suite so a service outage does not masquerade as an offline-game regression.
These browser peers run on one machine: they verify public signaling and
match synchronization, not every cross-network/NAT combination. A relay-only
probe in the development environment reported ICE 701 DNS lookup failures;
independent-network relay connectivity remains unverified. A managed relay
account is the recommended next step for dependable restrictive-network support.

Edit `src` modules, not `dist/bundle.js`. Register new runtime modules in
`build.mjs` in dependency order, then rebuild. The checked-in IIFE bundle
keeps direct `file://` launch working; `build:check` detects source/bundle
drift with consistent line endings. Building also fingerprints the stylesheet
and bundle URLs in `index.html` so a deployment does not mix cached old code
with the new interface.
The build also copies the pinned PeerJS browser distribution and its bundled
dependency license notices to `dist`, and fingerprints the library URL.
No CDN script is required.

GitHub Pages publishes the repository root from `main`. `.nojekyll` preserves
the static files without Jekyll processing. Build and verify before publishing;
a normal update to `main` triggers the existing Pages deployment.

The Node suite covers input ownership, physics, trials, animation, coaching,
save recovery and all stadium/item simulations. Browser coverage exercises
responsive layouts, dialogs, all mode families, gamepad emulation, touch,
audio, missing assets and offline launch. Emulation is not a substitute for
testing real controllers, mobile Safari or touch latency on hardware.

Networking is split between `src/online-state.js` (bounded packet validation
and snapshot views), `src/online.js` (room transport/lifecycle) and
`src/online-ui.js` (lobby and game integration). Input ownership is assigned by
the host connection, not a client-supplied slot. Do not send save data through
these packets or execute received strings as code. Bump `ONLINE_VERSION` and
its peer-ID namespace when introducing an incompatible wire protocol.

### Assets

Character atlases are **24 columns by six rows**, with **128-pixel cells**
(`3072 x 768`). Used row lengths are `24, 24, 16, 12, 12, 16`.
The renderer derives cell size from the image and bounds its caches:
six recent character sheets, 192 recolored/silhouette frames and three
terrain surfaces.

On-field strikers use a shared 128-unit drawing baseline, with character stats
providing relative size rather than scaling large characters twice. Selection
and podium previews retain their larger presentation. Lakitu and the item
bubble share layout dimensions with pickup detection and AI targeting; item
icons fit their visible artwork instead of the atlas's transparent padding.

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
