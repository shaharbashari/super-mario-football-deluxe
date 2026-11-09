# Game quality audit and overhaul plan

## Direction and scope

Keep the fast local arcade game, existing roster, seven stadiums, party rules,
progression and offline `index.html` launch. Improve the presentation and
reliability rather than replace the game with a framework or add a server.
The visual direction is a restrained sports-broadcast interface: dark ink
surfaces, clear typography, warm highlights, larger targets, fewer competing
effects and deliberate spacing. Existing illustration assets remain the art
direction; new audio is procedural, not sampled commercial music.

The audit covers all 277 originally tracked files: 23 authored text files,
the generated JavaScript bundle, and 253 images. All authored text was read,
including the six historical Swift asset tools and four test files. All images
were decoded and inspected in contact sheets. The bundle is checked against
its source, rather than treating generated copies as independent implementations.
The original checkout contains **16,861 authored lines** and **11,319 generated
bundle lines**. Reconstructing the original bundle from the original tracked
sources produced an exact match after normalizing checkout line endings.
This is a code and browser audit, not a guarantee that no defects remain.
Physical controllers, mobile Safari, real-device touch latency and subjective
audio quality still need human playtesting.

## Baseline findings

| Priority | Area | Evidence in the original code | Required change |
|---|---|---|---|
| P0 | Tests | Two test files import an absolute Antigravity author-machine path. | Repository-relative imports and one repeatable test command. |
| P0 | Input | `InputManager.getGamepad` mixes raw-port and dense-list indexing. | One-to-one stable player assignments, including sparse ports and reconnects. |
| P0 | Input | P3's `P` item binding also runs the global pause shortcut. | Global shortcuts must not consume active player actions; validate rebinding conflicts. |
| P0 | Touch | Touch pause calls a method the app does not have. | Wire the actual pause lifecycle and test the rendered control. |
| P0 | Touch | Stick, D-pad and jump overwrite the same state; pointer capture/reset is incomplete. | Independently owned touch sources and complete cancellation/blur cleanup. |
| P0 | Lifecycle | Locker dialogs do not pause play; a delayed result can replace a new match. | Central dialog lifecycle, focus handling and disposal of old simulations. |
| P0 | Persistence | Save data is blindly merged and storage failures are ignored. | Validate/migrate known fields, retain valid progress and report failed persistence. |
| P1 | UI | Utility buttons occupy the title/scoreboard region. Select panels shrink below their contents. | Reserved utility rail, content-driven layouts and nonoverlapping HUD. |
| P1 | UI | Small-landscape canvas uses `object-fit: cover`. | Preserve the complete field at every aspect ratio, including fullscreen. |
| P1 | UI | Mobile rules are hidden; 13 roster buttons use a six-column grid. | Responsive, scrollable setup with usable controls and complete information. |
| P1 | Physics | Goal-floor resolution happens before the lower riser collision. | Stop the ball at the riser rather than teleporting it onto the goal ledge. |
| P1 | Physics | Floating platforms collide with players but not balls. | Consistent one-way platform collision with explicit regression cases. |
| P1 | Trials | Meteor flags survive other touches; hits are counted instead of qualifying goals. | Track shot provenance and actual meteor goals. |
| P1 | Trials | The no-lava trial does not track floor contacts and starts on that floor. | Safe starting positions and an enforceable no-contact objective. |
| P1 | Trials | Party settings and score-granting items leak into skill challenges. | Self-contained challenge rules and visible objective progress. |
| P1 | Match flow | Celebration accepts actions; timed mayhem can end a knockout match in a tie. | Freeze competitive input after a goal and guarantee a tiebreak winner. |
| P1 | Animation | Stun/pound early returns bypass animation updates. State clocks are shared. | Advance all animation states consistently with state-local timing. |
| P1 | Performance | Twelve 6144 x 1536 RGBA atlases consume 432 MiB before kit/silhouette copies. | Smaller runtime assets and bounded rendering caches. |
| P1 | Assets | Loading has no failure UI; codex icons draw before their atlas is ready. | Observable asset loading, useful errors and repaint on completion. |
| P1 | Onboarding | Instructions are static keyboard text and become stale after four-player play. | Input-aware control glyphs, a replayable coach and contextual mode/stage help. |
| P2 | Audio | Short loops are scheduled with immediate timer callbacks. | Audio-clock lookahead, longer arrangements and selectable mixes. |
| P2 | Accessibility | Dialogs lack focus containment; many choices are click-only divs. | Semantic controls, visible focus, Escape/back behavior and reduced motion. |
| P2 | Documentation | Controls, atlas dimensions, item counts and packaging claims disagree with code. | Document the actual controls, build, assets and release limits. |
| P2 | Asset tooling | Historical tools are Apple-framework-only and use incompatible atlas formats. | Document their status and provide a portable, reproducible runtime optimization path. |

## Delivery order

1. **Make defects reproducible.** Restore the existing tests, add focused
   input/physics/save/lifecycle regressions and automate browser layout checks.
   Record original screenshots before changing presentation.
2. **Stabilize play.** Fix ownership of input, modal pause/resume, stale results,
   shot attribution, trial objectives and stage geometry. Keep rules explicit.
3. **Rebuild the interface.** Separate navigation from the field, create a
   clear landing hierarchy, modernize setup/results/dialogs, and keep every
   feature reachable with keyboard, standard gamepad or touch.
4. **Teach without interrupting.** Add a skippable, replayable introductory
   coach, an interactive practice path, mode briefings, stage tips and live
   device-specific prompts derived from the actual bindings.
5. **Improve movement and stage readability.** Fix animation clocks, add
   continuous secondary motion to the whole roster/items/entities, anchor
   feet correctly, add hazard telegraphs and provide reduced-motion settings.
6. **Expand audio.** Add distinct arrangement choices, effect palettes,
   ambience control, stable scheduling and sensible pause/mute behavior.
7. **Harden delivery.** Bound caches/effects, reduce runtime sprite memory,
   validate offline startup, verify all modes/stages and document remaining
   product work separately from shipped changes.

## Acceptance criteria

| Surface | Completion evidence |
|---|---|
| Repository | No author-machine paths in active tests; generated bundle reproduces from source; tests run through documented commands. |
| Menus | Title, utility rail, mode cards and footer do not intersect at supported desktop, tablet and phone sizes. |
| Setup | All 12 strikers, random picks, seven real arenas, kits, squad formats and rules remain reachable. |
| Field | Canvas retains 16:9 geometry without cropping goals; scoreboard and utility controls do not overlap. |
| Dialogs | Opening one during a match pauses it; closing a nested dialog returns to the previous one; focus cannot escape into play. |
| Keyboard | Four defaults remain usable, P3 can use items without pausing, and conflicting/reserved rebinds are explained. |
| Gamepad | Sparse ports never control two players; disconnect/reconnect is handled; menus can be navigated with a standard mapped pad. |
| Touch | Stick plus jump/strike works simultaneously; released, cancelled or hidden controls never remain held; pause works. |
| Physics | Lower risers, floating decks, embedded balls and goal resets have focused regression coverage. |
| Trials | Only qualifying meteor goals count; no-lava means no lava contact; challenge rules cannot be bypassed with party items. |
| Animation | Every striker state advances, including stun/pound; continuous effects are time-based; reduced motion avoids decorative flashing/shake. |
| Onboarding | Coach can be skipped/replayed; prompts follow keyboard rebinds, active gamepad and touch; practice has no progression rewards. |
| Audio | Independent music/effects/ambience controls, arrangement choices, muted startup safety and bounded scheduled voices. |
| Persistence | Malformed data cannot crash menus; valid unlocks survive migration; blocked storage produces a visible warning. |
| Assets | Every runtime asset decodes; no out-of-range atlas frames; no unbounded whole-sheet recolor/silhouette cache. |

## Stadium-specific plan

| Stadium | Keep | Improve now | Later tuning |
|---|---|---|---|
| Mushroom Kingdom Pitch | Clear neutral geometry and crisp bounce. | Reliable goal ledges, clean foreground contrast and beginner-friendly description. | Use as the competitive baseline; collect shot/save distributions. |
| Cloud Kingdom | Mirrored aerial decks and slightly lighter gravity. | Make deck/ball interaction consistent and explain pass-through movement. | Tune deck height after novice aerial playtests. |
| Bowser's Castle | Fast banks, central platform and lava vents. | Warning lanes/countdowns before eruptions; consistent immunity and safe lava-trial spawn. | Verify left/right hazard fairness over many seeded matches. |
| Luigi's Mansion | Paired high portals. | Clear portal entry/exit cues and cooldown explanations. | Tune teleport output speed against defensive reaction time. |
| DK Jungle | Two spring drums and energetic aerial rallies. | Match visible pad surfaces to collision; explain the launch. | Compare heavy/light striker recovery after drum bounces. |
| Sherbet Land | Deliberate low-friction drift. | Visible icicle landing warnings and collision consistency. | Consider a novice traction assist, only as an explicit rule. |
| Comet Observatory | Low gravity and an accelerator hoop. | Explain acceleration, contain speeds and distinguish the hoop from the ball. | Balance aerial possession and charge stalling. |

## Next-level product roadmap

These are follow-up product investments, not claims that this pass implements
an online service or replaces all source artwork.

| Phase | Investment | Release gate |
|---|---|---|
| Playtest | Recruit novice and experienced local groups; measure time to first goal, input mistakes and match abandonment. | At least one successful unassisted first match per input method. |
| Balance | Seeded simulation, replayable bug seeds, character/stadium win-rate sampling and an explicit competitive preset. | No unexplained side advantage; tune using evidence rather than adding power. |
| Architecture | Extract remaining menu/match/result controllers from the large app module, with explicit state transitions and snapshot-based replay inputs. | Preserve the offline bundle and existing mode regression coverage at every extraction. |
| Art | Commission coherent, properly licensed multi-pose animation and portraits with an asset manifest. | Document ownership/permission before public or commercial distribution. |
| Accessibility | Remappable gamepad actions, scalable HUD, color-independent team cues, toggle/hold alternatives and device testing. | Physical-controller and mobile accessibility review. |
| Progression | Clear cup/trial milestones, richer rewards, local profiles and save export/import. | Save migrations and recovery tests before introducing new currencies. |
| Reliability | CI, browser matrix, deterministic production packaging, performance budgets and a long-match soak. | Clean offline launch, stable frame times and bounded memory on target devices. |
| Content | Stage-specific challenges and authored commentary with an opt-out, not more simultaneous visual noise. | Each addition teaches or changes a meaningful decision. |
| Online | Consider rollback networking only after deterministic simulation, input serialization and replay tooling exist. | Latency/loss prototype before committing to matchmaking or accounts. |

### Release and rights

The repository contains Nintendo-character imagery and extracted animation
frames, but no asset-permission inventory. Attribution to an inspiration is not
a redistribution license. Keep a provenance checklist and obtain appropriate
permissions or substitute owned/licensed characters, names, art and music
before a public/commercial release. No external accounts, analytics, purchases
or online multiplayer are added by this overhaul.

## Implemented in this worktree

| Area | Delivered |
|---|---|
| Presentation | Rebuilt responsive styling, reserved utility rail, clearer landing hierarchy, unclipped field, complete setup controls, redesigned dialogs/results and touch controls outside the landscape field. |
| Input and lifecycle | Stable sparse gamepad slots, gamepad menu navigation, independent touch sources, working touch pause, pointer cleanup, reserved/conflicting rebind handling, P3 item fix, focus-contained nested dialogs, automatic pause and cancellation of stale match results. |
| Simulation | Fixed 120 Hz stepping, presentation interpolation, input buffering at high refresh rates and during hitstop, correct riser/platform/body resolution, matching shell/banana ledge behavior, immediate strike parries and explicit own-goal accounting. |
| Challenges | Isolated trial rules, actual meteor-goal attribution, safe lava-trial starts, lava-contact tracking, objective HUD and golden-goal continuation after tied mayhem. |
| Onboarding | Replayable mode/stadium briefings and a five-skill, learning-by-doing practice session. Keyboard, standard gamepad and touch prompts reflect the active player and actual bindings. No practice rewards can inflate progression. |
| Animation | State-local clocks across the whole roster, including previously frozen stun/pound states; grounded pose pivots, eased lean/kicks, interpolated movement, all-item secondary motion, keeper recoil and moving-prop polish. This reuses the supplied poses rather than claiming new hand-drawn character art. |
| Audio | Three arrangement choices, longer four-phrase variation, independent ambience and effects palettes, landing/footstep/coach/hazard cues, audio-clock scheduling, pause handling and a 64-voice budget. |
| Stadiums | All seven have actionable teaching notes. Cloud decks now interact with balls, lower goal ledges resolve correctly, and lava/icicles have visible warning lanes and audible warnings. |
| Reliability | Validated/recoverable local saves with visible failures, observable asset loading, portable test imports/runner, reproducible bundle checking and offline font-independent startup. |
| Assets | Twelve character PNGs reduced from 59,909,644 to 17,708,878 bytes (70.4%). Pixel storage per sheet reduced from 36 to 9 MiB. Character, derived-frame and terrain caches are bounded; all 1,248 used atlas frames remain present. |

### File-by-file source coverage

The following is coverage, not a claim that every historical helper was
executed or that all future combinations are defect-free.

| Original file | Audit focus |
|---|---|
| `.gitignore` | Generated files, temporary outputs and developer tooling. |
| `README.md` | Feature/controls accuracy, offline setup, packaging and provenance claims. |
| `index.html` | Every screen, modal, control, label and dependency. |
| `styles.css` | Entire cascade, responsive breakpoints, stacking, overflow and touch targets. |
| `build.mjs` | Module order, import/export stripping, platform paths and reproducibility. |
| `src/config.js` | Complete roster/items/arenas/cups/trials/mutators, controls and save handling. |
| `src/input.js` | Keyboard aliases, edges, gamepad ports, rebinding and touch ownership. |
| `src/touch.js` | Pointer lifecycle, simultaneous actions, visibility, orientation and fullscreen. |
| `src/physics.js` | Full match lifecycle, movement, collisions, scoring, items, hazards and summaries. |
| `src/ai.js` | Difficulty parameters, memory ownership, prediction, movement and item decisions. |
| `src/art.js` | Every draw path, frame selection, cell bounds, labels, loading and caches. |
| `src/audio.js` | Every effect, biome motif, channel, scheduler and audio lifecycle. |
| `src/main.js` | All menu bindings, squad/mode construction, progression, dialogs, shortcuts and rendering. |
| `test_ground_pound.mjs` | Portability and actual movement assertions. |
| `test_mobile_touch.mjs` | Touch-state assumptions and limits of DOM-free checks. |
| `test_trials_and_mechanics.mjs` | Portability, trial provenance and assertion quality. |
| `test_xinput_4p.mjs` | Mock-controller coverage and missing sparse-port cases. |
| `compile_c3_atlas.swift` | Input handling, extracted frames, alignment and old 10-column output. |
| `expand_6pose_to_atlas.swift` | Repeated poses, atlas layout and image error handling. |
| `synthesize_fluid_atlas.swift` | Pose transforms, blending, clipping and old frame counts. |
| `synthesize_fluid_24fps_atlas.swift` | Larger frame synthesis, repeated poses and cell bleed risks. |
| `synthesize_clean_24fps_atlas.swift` | Connected components, clipping, anchors and destructive border clearing. |
| `verify_atlas_borders.swift` | Border checks, fixed cell assumptions and exit status. |
| `dist/bundle.js` | Exact equivalence to the original source-generated bundle; rebuilt and drift-checked after changes. |
| All 253 PNG/JPEG files | Full decoding, dimensions, runtime references, contact-sheet review and atlas-frame presence. |

### Remaining verification boundaries

The completed verification includes 27 Node test entries (including the four
restored original suites), 26 Chromium browser scenarios, exact bundle drift
checking, and decoding every image plus checking all 1,248 used character
frames. Layout coverage includes 1920x1080, 1280x720, 1024x768, 844x390,
667x375 and 390x844. Guided practice was also completed through real browser
keyboard events, not just by setting completion flags.

The automated browser work uses Chromium and emulated controller/touch input.
Real four-controller couch play, keyboard rollover, Safari/iOS, audio listening
on speakers/headphones and sustained performance on lower-end hardware remain
release gates. The historical Swift tools were read but cannot be executed
on this Windows host; they remain explicitly documented as inactive experiments.
The portable tool validates/optimizes current atlases rather than reproducing
all historical art-generation experiments.

Do not treat runtime polish as art licensing, full character re-animation from
new source poses, measured competitive balance, online multiplayer or a public
release approval. Those investments are separated in the roadmap above.
