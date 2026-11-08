import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

// Studio-Grade Fluid Animation Atlas Synthesizer for Super Kick Kingdom
// Converts 6-pose keyframe sheet into 10-column x 6-row (2560x1536) high-frame-rate atlas:
// - Row 0: 10-frame Living Breathing & Weight-Shift Idle Cycle
// - Row 1: 10-frame Dynamic Full-Stride Sprint Cycle
// - Row 2: 10-frame Trajectory-Mapped Airborne Jump (10 velocity stages)
// - Row 3: 8-frame Martial Arts Side Kick (Chamber, Whip, Strike, Smear Overshoot, Linger, Recovery)
// - Row 4: 9-frame Flying Bicycle / Upward Volley Kick
// - Row 5: 8-frame Dazed Reeling Stagger & Dizzy Wobble Cycle

let args = CommandLine.arguments
if args.count < 3 {
    print("Usage: synthesize_fluid_atlas <in_raw_768x512.png> <out_atlas_2560x1536.png>")
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

let cols = 10
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

func drawArticulatedCell(
    img: CGImage,
    col: Int,
    row: Int,
    scaleX: Double = 1.0,
    scaleY: Double = 1.0,
    transX: Double = 0.0,
    transY: Double = 0.0,
    rotRad: Double = 0.0,
    anchorRelX: Double = 0.5,
    anchorRelY: Double = 0.12,
    alpha: Double = 1.0,
    blendMode: CGBlendMode = .normal
) {
    ctx.saveGState()
    ctx.setBlendMode(blendMode)
    ctx.setAlpha(alpha)

    let cellLeft = Double(col * cellSize)
    let cgCellBottom = Double(sheetH) - Double((row + 1) * cellSize)

    let pivotX = cellLeft + Double(cellSize) * anchorRelX
    let pivotY = cgCellBottom + Double(cellSize) * anchorRelY

    ctx.translateBy(x: pivotX + transX, y: pivotY + transY)
    if rotRad != 0 {
        ctx.rotate(by: -rotRad)
    }
    ctx.scaleBy(x: scaleX, y: scaleY)
    ctx.translateBy(x: -Double(cellSize) * anchorRelX, y: -Double(cellSize) * anchorRelY)

    ctx.draw(img, in: CGRect(x: 0, y: 0, width: Double(cellSize), height: Double(cellSize)))
    ctx.restoreGState()
}

// -------------------------------------------------------------
// ROW 0: IDLE ANIMATION (10 FRAMES)
// Fluid breathing, knee bob, and athletic stance weight shifting
// -------------------------------------------------------------
struct IdleFrame {
    var sx: Double; var sy: Double; var ty: Double; var rot: Double
}
let idleCycle: [IdleFrame] = [
    IdleFrame(sx: 1.000, sy: 1.000, ty:  0.0, rot:  0.000), // Frame 0: Baseline stance
    IdleFrame(sx: 1.012, sy: 0.988, ty: -1.5, rot: -0.010), // Frame 1: Soft settle crouch
    IdleFrame(sx: 1.028, sy: 0.972, ty: -3.2, rot: -0.015), // Frame 2: Deep athletic load
    IdleFrame(sx: 1.035, sy: 0.965, ty: -4.0, rot: -0.020), // Frame 3: Knee rebound bounce
    IdleFrame(sx: 1.018, sy: 0.982, ty: -2.0, rot: -0.010), // Frame 4: Upward spring rebound
    IdleFrame(sx: 1.000, sy: 1.000, ty:  0.0, rot:  0.000), // Frame 5: Neutral pass
    IdleFrame(sx: 0.988, sy: 1.014, ty:  1.8, rot:  0.012), // Frame 6: Inhale chest expansion
    IdleFrame(sx: 0.972, sy: 1.030, ty:  3.6, rot:  0.020), // Frame 7: Peak inhale & head lift
    IdleFrame(sx: 0.980, sy: 1.022, ty:  2.8, rot:  0.015), // Frame 8: Chest suspension apex
    IdleFrame(sx: 0.992, sy: 1.010, ty:  1.2, rot:  0.008), // Frame 9: Exhale relaxation settle
]
for (c, f) in idleCycle.enumerated() {
    drawArticulatedCell(img: pIdle, col: c, row: 0, scaleX: f.sx, scaleY: f.sy, transY: f.ty, rotRad: f.rot)
}

// -------------------------------------------------------------
// ROW 1: RUNNING SPRINT CYCLE (10 FRAMES)
// Contact, Down-Squash, Toe-Push, Passing-Lift, Apex-Extension (both legs)
// -------------------------------------------------------------
// Frame 0: Right Heel Strike (Run 1)
drawArticulatedCell(img: pRun1, col: 0, row: 1, scaleX: 1.00, scaleY: 1.00, transX: 0, transY: 0, rotRad: 0.04)
// Frame 1: Right Mid-Stance Ground Load / Squash (Run 1)
drawArticulatedCell(img: pRun1, col: 1, row: 1, scaleX: 1.04, scaleY: 0.94, transX: 1, transY: -4, rotRad: 0.06)
// Frame 2: Right Toe Drive / Push-off (Run 1)
drawArticulatedCell(img: pRun1, col: 2, row: 1, scaleX: 0.96, scaleY: 1.04, transX: 2, transY: 2, rotRad: 0.08)
// Frame 3: Right Passing Liftoff / Knee Lift (Transition blend)
drawArticulatedCell(img: pRun1, col: 3, row: 1, scaleX: 0.98, scaleY: 1.03, transX: 0, transY: 5, rotRad: 0.04, alpha: 0.82)
drawArticulatedCell(img: pRun2, col: 3, row: 1, scaleX: 0.97, scaleY: 1.02, transX: 0, transY: 5, rotRad: 0.04, alpha: 0.28)
// Frame 4: Right Full Extension Reach (Run 1)
drawArticulatedCell(img: pRun1, col: 4, row: 1, scaleX: 1.01, scaleY: 1.00, transX: -1, transY: 2, rotRad: 0.03)

// Frame 5: Left Heel Strike (Run 2)
drawArticulatedCell(img: pRun2, col: 5, row: 1, scaleX: 1.00, scaleY: 1.00, transX: 0, transY: 0, rotRad: 0.04)
// Frame 6: Left Mid-Stance Ground Load / Squash (Run 2)
drawArticulatedCell(img: pRun2, col: 6, row: 1, scaleX: 1.04, scaleY: 0.94, transX: 1, transY: -4, rotRad: 0.06)
// Frame 7: Left Toe Drive / Push-off (Run 2)
drawArticulatedCell(img: pRun2, col: 7, row: 1, scaleX: 0.96, scaleY: 1.04, transX: 2, transY: 2, rotRad: 0.08)
// Frame 8: Left Passing Liftoff / Knee Lift (Transition blend)
drawArticulatedCell(img: pRun2, col: 8, row: 1, scaleX: 0.98, scaleY: 1.03, transX: 0, transY: 5, rotRad: 0.04, alpha: 0.82)
drawArticulatedCell(img: pRun1, col: 8, row: 1, scaleX: 0.97, scaleY: 1.02, transX: 0, transY: 5, rotRad: 0.04, alpha: 0.28)
// Frame 9: Left Full Extension Reach (Run 2)
drawArticulatedCell(img: pRun2, col: 9, row: 1, scaleX: 1.01, scaleY: 1.00, transX: -1, transY: 2, rotRad: 0.03)

// -------------------------------------------------------------
// ROW 2: JUMP TRAJECTORY (10 FRAMES)
// Physics velocity stages: Takeoff, Explosive Liftoff, Ascent Stretch,
// High Tuck, Apex Float, Forward Tilt, Descent Reach, Plunge, Touchdown Cushion
// -------------------------------------------------------------
// Frame 0: Deep takeoff crouch (Idle squashed)
drawArticulatedCell(img: pIdle, col: 0, row: 2, scaleX: 1.12, scaleY: 0.88, transY: -7, rotRad: 0.03)
// Frame 1: Explosive liftoff thrust (Run 1 stretched upward)
drawArticulatedCell(img: pRun1, col: 1, row: 2, scaleX: 0.90, scaleY: 1.12, transY: 10, rotRad: -0.06, anchorRelY: 0.5)
// Frame 2: High-speed ascent stretch
drawArticulatedCell(img: pJump, col: 2, row: 2, scaleX: 0.94, scaleY: 1.08, transY: 7, rotRad: -0.04, anchorRelY: 0.5)
// Frame 3: Mid-ascent tuck
drawArticulatedCell(img: pJump, col: 3, row: 2, scaleX: 0.97, scaleY: 1.03, transY: 4, rotRad: -0.02, anchorRelY: 0.5)
// Frame 4: True apex float / maximum tuck
drawArticulatedCell(img: pJump, col: 4, row: 2, scaleX: 1.00, scaleY: 1.00, transY: 0, rotRad: 0.00, anchorRelY: 0.5)
// Frame 5: Apex forward tilt / hang
drawArticulatedCell(img: pJump, col: 5, row: 2, scaleX: 1.02, scaleY: 0.98, transY: -2, rotRad: 0.04, anchorRelY: 0.5)
// Frame 6: Descent initiation reach
drawArticulatedCell(img: pJump, col: 6, row: 2, scaleX: 0.98, scaleY: 1.02, transY: -4, rotRad: 0.06, anchorRelY: 0.5)
// Frame 7: High-speed downward dive
drawArticulatedCell(img: pJump, col: 7, row: 2, scaleX: 0.94, scaleY: 1.06, transY: -8, rotRad: 0.08, anchorRelY: 0.5)
// Frame 8: Terminal plunge reach
drawArticulatedCell(img: pRun2, col: 8, row: 2, scaleX: 0.92, scaleY: 1.08, transY: -10, rotRad: 0.05, anchorRelY: 0.5)
// Frame 9: Touchdown landing cushion
drawArticulatedCell(img: pIdle, col: 9, row: 2, scaleX: 1.08, scaleY: 0.92, transY: -4, rotRad: 0.01)

// -------------------------------------------------------------
// ROW 3: KICK SIDE / VOLLEY STRIKE (8 FRAMES)
// Chamber, Acceleration, Snap Lash, Peak Strike, Smear Overshoot, Linger, Retract, Balance
// -------------------------------------------------------------
// Frame 0: Coiled chamber draw-back
drawArticulatedCell(img: pIdle, col: 0, row: 3, scaleX: 0.95, scaleY: 1.02, transX: -5, transY: -2, rotRad: -0.16)
// Frame 1: Torso rotation snap & knee lift
drawArticulatedCell(img: pKick, col: 1, row: 3, scaleX: 0.94, scaleY: 1.03, transX: -3, transY: 1, rotRad: -0.10, anchorRelY: 0.5)
// Frame 2: Explosive leg lash acceleration
drawArticulatedCell(img: pKick, col: 2, row: 3, scaleX: 0.96, scaleY: 1.03, transX: 2, transY: 2, rotRad: -0.04, anchorRelY: 0.5)
// Frame 3: Peak impact strike (full Kung-Foot extension)
drawArticulatedCell(img: pKick, col: 3, row: 3, scaleX: 1.00, scaleY: 1.00, transX: 0, transY: 0, rotRad: 0.00, anchorRelY: 0.5)
// Frame 4: Power overshoot & kinetic motion blur smear
drawArticulatedCell(img: pKick, col: 4, row: 3, scaleX: 1.05, scaleY: 0.97, transX: 5, transY: 0, rotRad: 0.08, anchorRelY: 0.5)
drawArticulatedCell(img: pKick, col: 4, row: 3, scaleX: 1.03, scaleY: 0.97, transX: -6, transY: 0, rotRad: 0.05, anchorRelY: 0.5, alpha: 0.35)
// Frame 5: Apex lingering hold
drawArticulatedCell(img: pKick, col: 5, row: 3, scaleX: 1.02, scaleY: 0.99, transX: 3, transY: 0, rotRad: 0.04, anchorRelY: 0.5)
// Frame 6: Leg retraction begin
drawArticulatedCell(img: pJump, col: 6, row: 3, scaleX: 0.98, scaleY: 1.02, transX: 0, transY: 2, rotRad: -0.03, anchorRelY: 0.5)
// Frame 7: Balance recovery step
drawArticulatedCell(img: pIdle, col: 7, row: 3, scaleX: 1.02, scaleY: 0.98, transX: -1, transY: 0, rotRad: 0.01)

// -------------------------------------------------------------
// ROW 4: KICK UP / BICYCLE VOLLEY (9 FRAMES)
// Squat prep, launch, spin, rising strike, peak overhead, vertical reach, hang, upright flip, cushion
// -------------------------------------------------------------
// Frame 0: Deep squat launch prep
drawArticulatedCell(img: pIdle, col: 0, row: 4, scaleX: 1.09, scaleY: 0.89, transY: -6, rotRad: 0.02)
// Frame 1: Vertical spring liftoff
drawArticulatedCell(img: pRun1, col: 1, row: 4, scaleX: 0.90, scaleY: 1.10, transY: 8, rotRad: -0.14, anchorRelY: 0.5)
// Frame 2: Angular rotation begin
drawArticulatedCell(img: pKick, col: 2, row: 4, scaleX: 0.95, scaleY: 1.03, transX: -3, transY: 6, rotRad: -0.28, anchorRelY: 0.5)
// Frame 3: Rising bicycle spin strike
drawArticulatedCell(img: pKick, col: 3, row: 4, scaleX: 0.98, scaleY: 1.02, transX: -1, transY: 8, rotRad: -0.42, anchorRelY: 0.5)
// Frame 4: Peak overhead scissor strike with speed trail
drawArticulatedCell(img: pKick, col: 4, row: 4, scaleX: 1.03, scaleY: 1.00, transX: 0, transY: 10, rotRad: -0.58, anchorRelY: 0.5)
drawArticulatedCell(img: pKick, col: 4, row: 4, scaleX: 1.01, scaleY: 1.00, transX: -5, transY: 5, rotRad: -0.46, anchorRelY: 0.5, alpha: 0.32)
// Frame 5: Maximum vertical reach extension
drawArticulatedCell(img: pKick, col: 5, row: 4, scaleX: 1.01, scaleY: 1.01, transX: 1, transY: 10, rotRad: -0.50, anchorRelY: 0.5)
// Frame 6: Inverted hang float
drawArticulatedCell(img: pKick, col: 6, row: 4, scaleX: 1.00, scaleY: 0.99, transX: 2, transY: 7, rotRad: -0.42, anchorRelY: 0.5)
// Frame 7: Upright flip recovery
drawArticulatedCell(img: pJump, col: 7, row: 4, scaleX: 0.98, scaleY: 1.03, transY: 3, rotRad: -0.18, anchorRelY: 0.5)
// Frame 8: Landing cushion absorb
drawArticulatedCell(img: pIdle, col: 8, row: 4, scaleX: 1.05, scaleY: 0.94, transY: -3, rotRad: 0.00)

// -------------------------------------------------------------
// ROW 5: OUCH / DIZZY REELING STAGGER (8 FRAMES)
// Violent jolt, max recoil, daze hold, momentum rebound, sway, counter-wobble, dizzy swirl, settle
// -------------------------------------------------------------
// Frame 0: Impact violent jolt
drawArticulatedCell(img: pOuch, col: 0, row: 5, scaleX: 1.02, scaleY: 0.97, transX: -5, transY: 1, rotRad: -0.15)
// Frame 1: Extreme recoil stagger (max tilt)
drawArticulatedCell(img: pOuch, col: 1, row: 5, scaleX: 1.06, scaleY: 0.93, transX: -9, transY: -3, rotRad: -0.24)
// Frame 2: Deep daze hold
drawArticulatedCell(img: pOuch, col: 2, row: 5, scaleX: 1.04, scaleY: 0.95, transX: -7, transY: -2, rotRad: -0.20)
// Frame 3: Momentum rebound forward
drawArticulatedCell(img: pOuch, col: 3, row: 5, scaleX: 0.96, scaleY: 1.03, transX: 4, transY: 3, rotRad: 0.12)
// Frame 4: Secondary forward sway
drawArticulatedCell(img: pOuch, col: 4, row: 5, scaleX: 0.98, scaleY: 1.01, transX: 2, transY: 2, rotRad: 0.08)
// Frame 5: Counter-sway daze
drawArticulatedCell(img: pOuch, col: 5, row: 5, scaleX: 1.02, scaleY: 0.98, transX: -2, transY: 0, rotRad: -0.12)
// Frame 6: Light dizzy swirl wobble
drawArticulatedCell(img: pOuch, col: 6, row: 5, scaleX: 0.98, scaleY: 1.01, transX: 1, transY: 1, rotRad: 0.06)
// Frame 7: Recovering balance settle
drawArticulatedCell(img: pOuch, col: 7, row: 5, scaleX: 1.00, scaleY: 1.00, transX: 0, transY: 0, rotRad: -0.02)

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
    print("Successfully synthesized expanded fluid atlas: \(outPath) (\(sheetW)x\(sheetH))")
} else {
    print("Failed to finalize PNG at \(outPath)")
    exit(1)
}
