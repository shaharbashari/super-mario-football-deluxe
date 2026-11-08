import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

// Ultra-Fluid 24+ FPS Wobble-Free Studio Animation Atlas Synthesizer
// Generates 24-column x 6-row (6144x1536) master atlases
// - Row 0: 24-frame Living Idle Cycle (smooth sine breathing & knee flex, 0 wobble, 24 FPS)
// - Row 1: 24-frame Dynamic Full-Stride Run Cycle (alternating contact/drive/flight, 0 wobble, 24 FPS)
// - Row 2: 16-frame Trajectory-Mapped Jump (takeoff, ascent stretch, peak float, descent, cushion)
// - Row 3: 12-frame Martial Arts Kung-Foot Strike (chamber, explosive extension, overshoot, settle)
// - Row 4: 12-frame Overhead Bicycle Volley (launch, scissor strike, overhead extension, recovery)
// - Row 5: 16-frame Dazed Reeling Stagger (smooth kinetic recoil & recovery, 0 wobble)

let args = CommandLine.arguments
if args.count < 3 {
    print("Usage: synthesize_fluid_24fps_atlas <in_raw_768x512.png> <out_atlas_6144x1536.png>")
    exit(1)
}

let inPath = args[1]
let outPath = args[2]

let inUrl = URL(fileURLWithPath: inPath)
guard let src = CGImageSourceCreateWithURL(inUrl as CFURL, nil),
      let inImg = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
    print("Failed to load \(inPath)")
    exit(1)
}

let cols = 24
let rows = 6
let cellSize = 256
let sheetW = cols * cellSize
let sheetH = rows * cellSize

var atlasBuf = [UInt8](repeating: 0, count: sheetW * sheetH * 4)
let cs = CGColorSpaceCreateDeviceRGB()
let bitmapInfo = CGImageAlphaInfo.premultipliedLast.rawValue | CGBitmapInfo.byteOrder32Big.rawValue

guard let ctx = CGContext(
    data: &atlasBuf,
    width: sheetW,
    height: sheetH,
    bitsPerComponent: 8,
    bytesPerRow: sheetW * 4,
    space: cs,
    bitmapInfo: bitmapInfo
) else {
    print("Failed to create context")
    exit(1)
}
ctx.interpolationQuality = .high

func extractPose(_ idx: Int) -> CGImage? {
    let col = idx % 3
    let row = idx / 3
    let rect = CGRect(x: col * 256, y: row * 256, width: 256, height: 256)
    return inImg.cropping(to: rect)
}

guard let pIdle = extractPose(0),
      let pRun1 = extractPose(1),
      let pRun2 = extractPose(2),
      let pJump = extractPose(3),
      let pKick = extractPose(4),
      let pOuch = extractPose(5) else {
    print("Failed to crop poses from \(inPath)")
    exit(1)
}

func drawCell(
    img: CGImage,
    col: Int,
    row: Int,
    scaleX: Double = 1.0,
    scaleY: Double = 1.0,
    transX: Double = 0.0,
    transY: Double = 0.0,
    anchorRelX: Double = 0.5,
    anchorRelY: Double = 0.08
) {
    ctx.saveGState()

    let cellLeft = Double(col * cellSize)
    let cgCellBottom = Double(sheetH) - Double((row + 1) * cellSize)

    let pivotX = cellLeft + Double(cellSize) * anchorRelX
    let pivotY = cgCellBottom + Double(cellSize) * anchorRelY

    ctx.translateBy(x: pivotX + transX, y: pivotY + transY)
    ctx.scaleBy(x: scaleX, y: scaleY)
    ctx.translateBy(x: -Double(cellSize) * anchorRelX, y: -Double(cellSize) * anchorRelY)

    ctx.draw(img, in: CGRect(x: 0, y: 0, width: Double(cellSize), height: Double(cellSize)))
    ctx.restoreGState()
}

// -------------------------------------------------------------
// ROW 0: IDLE ANIMATION (24 FRAMES @ 24 FPS = 1.0 SECONDS)
// Completely grounded feet, perfectly vertical (rotRad = 0, transX = 0),
// smooth sine breathing expansion and knee absorption
// -------------------------------------------------------------
for c in 0..<24 {
    let phase = 2.0 * Double.pi * (Double(c) / 24.0)
    let sy = 1.0 + 0.022 * sin(phase)
    let sx = 1.0 - 0.010 * sin(phase)
    let ty = -2.0 * max(0.0, -sin(phase)) // subtle knee give on bottom of breath
    drawCell(img: pIdle, col: c, row: 0, scaleX: sx, scaleY: sy, transY: ty)
}

// -------------------------------------------------------------
// ROW 1: SPRINT CYCLE (24 FRAMES @ 24 FPS = 1.0 SECONDS / 2 STRIDES)
// 0 wobble, crisp opaque frames, clean ground contact squash & spring
// Stride 1: Frames 0..11
// Stride 2: Frames 12..23
// -------------------------------------------------------------
struct SprintPoseDef {
    let img: CGImage
    let sx: Double
    let sy: Double
    let ty: Double
}

let sprintFrames: [SprintPoseDef] = [
    // Stride 1
    SprintPoseDef(img: pRun1, sx: 1.04, sy: 0.94, ty: -3.0), // 0: Lead heel strike squash
    SprintPoseDef(img: pRun1, sx: 1.03, sy: 0.96, ty: -2.0), // 1: Mid-stance absorption
    SprintPoseDef(img: pRun1, sx: 1.00, sy: 1.00, ty:  0.0), // 2: Planted drive start
    SprintPoseDef(img: pRun2, sx: 0.97, sy: 1.03, ty:  2.0), // 3: Powerful toe push-off
    SprintPoseDef(img: pRun2, sx: 0.95, sy: 1.05, ty:  4.0), // 4: Full-extension drive
    SprintPoseDef(img: pJump, sx: 0.98, sy: 1.02, ty:  6.0), // 5: Liftoff flight phase
    SprintPoseDef(img: pJump, sx: 1.00, sy: 1.00, ty:  7.0), // 6: Airborne apex tuck
    SprintPoseDef(img: pJump, sx: 0.99, sy: 1.01, ty:  5.0), // 7: Descent initiation
    SprintPoseDef(img: pRun2, sx: 0.97, sy: 1.03, ty:  3.0), // 8: Forward stride reach
    SprintPoseDef(img: pRun2, sx: 0.99, sy: 1.01, ty:  1.0), // 9: Pre-contact reach
    SprintPoseDef(img: pRun1, sx: 1.01, sy: 0.99, ty: -1.0), // 10: Early contact prepare
    SprintPoseDef(img: pRun1, sx: 1.03, sy: 0.96, ty: -2.5), // 11: Contact touchdown

    // Stride 2 (Alternating Cadence)
    SprintPoseDef(img: pRun2, sx: 1.04, sy: 0.94, ty: -3.0), // 12: Opposite heel strike squash
    SprintPoseDef(img: pRun2, sx: 1.03, sy: 0.96, ty: -2.0), // 13: Mid-stance absorption
    SprintPoseDef(img: pRun2, sx: 1.00, sy: 1.00, ty:  0.0), // 14: Planted drive start
    SprintPoseDef(img: pRun1, sx: 0.97, sy: 1.03, ty:  2.0), // 15: Powerful toe push-off
    SprintPoseDef(img: pRun1, sx: 0.95, sy: 1.05, ty:  4.0), // 16: Full-extension drive
    SprintPoseDef(img: pJump, sx: 0.98, sy: 1.02, ty:  6.0), // 17: Liftoff flight phase
    SprintPoseDef(img: pJump, sx: 1.00, sy: 1.00, ty:  7.0), // 18: Airborne apex tuck
    SprintPoseDef(img: pJump, sx: 0.99, sy: 1.01, ty:  5.0), // 19: Descent initiation
    SprintPoseDef(img: pRun1, sx: 0.97, sy: 1.03, ty:  3.0), // 20: Forward stride reach
    SprintPoseDef(img: pRun1, sx: 0.99, sy: 1.01, ty:  1.0), // 21: Pre-contact reach
    SprintPoseDef(img: pRun2, sx: 1.01, sy: 0.99, ty: -1.0), // 22: Early contact prepare
    SprintPoseDef(img: pRun2, sx: 1.03, sy: 0.96, ty: -2.5), // 23: Contact touchdown
]

for (c, f) in sprintFrames.enumerated() {
    drawCell(img: f.img, col: c, row: 1, scaleX: f.sx, scaleY: f.sy, transY: f.ty)
}

// -------------------------------------------------------------
// ROW 2: JUMP TRAJECTORY (16 FRAMES)
// Velocity-stages: 0..2 Takeoff spring, 3..7 Ascent stretch,
// 8..10 Apex hang, 11..13 Descent reach, 14..15 Landing cushion
// -------------------------------------------------------------
let jumpFrames: [SprintPoseDef] = [
    SprintPoseDef(img: pIdle, sx: 1.08, sy: 0.90, ty: -6.0), // 0: Deep crouch compression
    SprintPoseDef(img: pIdle, sx: 1.04, sy: 0.95, ty: -3.0), // 1: Spring loading
    SprintPoseDef(img: pRun1, sx: 0.92, sy: 1.10, ty:  4.0), // 2: Explosive liftoff thrust
    SprintPoseDef(img: pRun1, sx: 0.90, sy: 1.12, ty:  8.0), // 3: High-speed ascent stretch
    SprintPoseDef(img: pJump, sx: 0.94, sy: 1.08, ty:  9.0), // 4: Mid-ascent tuck
    SprintPoseDef(img: pJump, sx: 0.97, sy: 1.04, ty: 10.0), // 5: High ascent tuck
    SprintPoseDef(img: pJump, sx: 0.99, sy: 1.02, ty: 11.0), // 6: Approaching apex
    SprintPoseDef(img: pJump, sx: 1.00, sy: 1.00, ty: 12.0), // 7: True apex float
    SprintPoseDef(img: pJump, sx: 1.00, sy: 1.00, ty: 12.0), // 8: Peak suspension hang
    SprintPoseDef(img: pJump, sx: 0.99, sy: 1.01, ty: 11.0), // 9: Apex forward tip
    SprintPoseDef(img: pJump, sx: 0.97, sy: 1.03, ty:  9.0), // 10: Descent initiation
    SprintPoseDef(img: pJump, sx: 0.94, sy: 1.07, ty:  6.0), // 11: High-speed fall
    SprintPoseDef(img: pRun2, sx: 0.92, sy: 1.09, ty:  3.0), // 12: Terminal descent reach
    SprintPoseDef(img: pRun2, sx: 0.96, sy: 1.04, ty:  0.0), // 13: Ground touch reach
    SprintPoseDef(img: pIdle, sx: 1.06, sy: 0.92, ty: -4.0), // 14: Touchdown cushion
    SprintPoseDef(img: pIdle, sx: 1.02, sy: 0.98, ty: -1.5), // 15: Settle to stance
]

for (c, f) in jumpFrames.enumerated() {
    drawCell(img: f.img, col: c, row: 2, scaleX: f.sx, scaleY: f.sy, transY: f.ty, anchorRelY: 0.4)
}

// -------------------------------------------------------------
// ROW 3: KICK SIDE / VOLLEY STRIKE (12 FRAMES)
// Chamber, whip, peak strike, linger, recovery (0 whole-body tilt)
// -------------------------------------------------------------
let kickSideFrames: [SprintPoseDef] = [
    SprintPoseDef(img: pIdle, sx: 0.96, sy: 1.02, ty: -2.0), // 0: Coiled chamber
    SprintPoseDef(img: pIdle, sx: 0.94, sy: 1.03, ty: -1.0), // 1: Knee raise prep
    SprintPoseDef(img: pKick, sx: 0.94, sy: 1.03, ty:  1.0), // 2: Leg whip acceleration
    SprintPoseDef(img: pKick, sx: 0.98, sy: 1.01, ty:  2.0), // 3: Explosive strike drive
    SprintPoseDef(img: pKick, sx: 1.00, sy: 1.00, ty:  2.0), // 4: PEAK IMPACT STRIKE
    SprintPoseDef(img: pKick, sx: 1.04, sy: 0.98, ty:  2.0), // 5: Power overshoot
    SprintPoseDef(img: pKick, sx: 1.03, sy: 0.98, ty:  1.5), // 6: Lingering hold
    SprintPoseDef(img: pKick, sx: 1.01, sy: 0.99, ty:  1.0), // 7: High extension hold
    SprintPoseDef(img: pJump, sx: 0.98, sy: 1.02, ty:  1.0), // 8: Leg retraction begin
    SprintPoseDef(img: pJump, sx: 0.99, sy: 1.01, ty:  0.0), // 9: Lowering leg
    SprintPoseDef(img: pIdle, sx: 1.03, sy: 0.97, ty: -2.0), // 10: Step-down cushion
    SprintPoseDef(img: pIdle, sx: 1.01, sy: 0.99, ty: -0.5), // 11: Balance settle
]

for (c, f) in kickSideFrames.enumerated() {
    drawCell(img: f.img, col: c, row: 3, scaleX: f.sx, scaleY: f.sy, transY: f.ty, anchorRelY: 0.35)
}

// -------------------------------------------------------------
// ROW 4: KICK UP / BICYCLE VOLLEY (12 FRAMES)
// Launch, upward scissor strike, apex reach, flip recovery
// -------------------------------------------------------------
let kickUpFrames: [SprintPoseDef] = [
    SprintPoseDef(img: pIdle, sx: 1.06, sy: 0.90, ty: -5.0), // 0: Deep crouch launch prep
    SprintPoseDef(img: pRun1, sx: 0.92, sy: 1.10, ty:  4.0), // 1: Vertical spring liftoff
    SprintPoseDef(img: pKick, sx: 0.95, sy: 1.04, ty:  7.0), // 2: Upward leg lash
    SprintPoseDef(img: pKick, sx: 0.98, sy: 1.02, ty:  9.0), // 3: Rising bicycle strike
    SprintPoseDef(img: pKick, sx: 1.00, sy: 1.00, ty: 11.0), // 4: PEAK OVERHEAD IMPACT
    SprintPoseDef(img: pKick, sx: 1.03, sy: 0.98, ty: 12.0), // 5: Maximum vertical reach
    SprintPoseDef(img: pKick, sx: 1.02, sy: 0.99, ty: 11.0), // 6: Aerial hang float
    SprintPoseDef(img: pKick, sx: 1.00, sy: 1.00, ty:  9.0), // 7: Scissor retraction
    SprintPoseDef(img: pJump, sx: 0.98, sy: 1.02, ty:  6.0), // 8: Upright flip tuck
    SprintPoseDef(img: pJump, sx: 0.97, sy: 1.03, ty:  3.0), // 9: Descent reach
    SprintPoseDef(img: pIdle, sx: 1.05, sy: 0.93, ty: -3.0), // 10: Landing cushion
    SprintPoseDef(img: pIdle, sx: 1.01, sy: 0.99, ty: -0.5), // 11: Upright recovery
]

for (c, f) in kickUpFrames.enumerated() {
    drawCell(img: f.img, col: c, row: 4, scaleX: f.sx, scaleY: f.sy, transY: f.ty, anchorRelY: 0.35)
}

// -------------------------------------------------------------
// ROW 5: OUCH / STUN DIZZY (16 FRAMES @ 24 FPS = 0.67s loop)
// Clean kinetic impact, daze sway, balance settle (0 whole-body tilt)
// -------------------------------------------------------------
for c in 0..<16 {
    let phase = 2.0 * Double.pi * (Double(c) / 16.0)
    let sx = 1.0 + 0.03 * sin(phase * 2.0)
    let sy = 1.0 - 0.03 * sin(phase * 2.0)
    let ty = -2.0 * abs(sin(phase))
    drawCell(img: pOuch, col: c, row: 5, scaleX: sx, scaleY: sy, transY: ty, anchorRelY: 0.15)
}

guard let finalImg = ctx.makeImage() else {
    print("Failed to make final image")
    exit(1)
}

let outUrl = URL(fileURLWithPath: outPath)
guard let dest = CGImageDestinationCreateWithURL(outUrl as CFURL, UTType.png.identifier as CFString, 1, nil) else {
    print("Failed to create destination")
    exit(1)
}
CGImageDestinationAddImage(dest, finalImg, nil)
if CGImageDestinationFinalize(dest) {
    print("Successfully synthesized ultra-fluid 24+ FPS atlas: \(outPath) (\(sheetW)x\(sheetH))")
} else {
    print("Failed to finalize PNG at \(outPath)")
    exit(1)
}
