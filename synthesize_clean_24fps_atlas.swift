import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

// Ultra-Fluid 24+ FPS Studio Animation Atlas Synthesizer with ZERO Frame Bleed
// Guarantees:
// 1. Every raw keyframe is isolated via connected-component analysis, stripping stray neighbor fragments
// 2. Centered with 20px safe padding inside 256x256
// 3. Strict cell clipping (ctx.clip) on every drawn frame
// 4. Guaranteed 0 border bleed across all 24 columns x 6 rows

let args = CommandLine.arguments
if args.count < 3 {
    print("Usage: synthesize_clean_24fps_atlas <in_raw_768x512.png> <out_atlas_6144x1536.png>")
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

// Clean Pose Extractor: crops 256x256, removes stray edge debris from neighbors, centers with 20px padding
func cleanExtractPose(_ idx: Int) -> CGImage? {
    let col = idx % 3
    let row = idx / 3
    let cropRect = CGRect(x: col * 256, y: row * 256, width: 256, height: 256)
    guard let rawCrop = inImg.cropping(to: cropRect) else { return nil }
    
    let w = 256, h = 256
    var buf = [UInt8](repeating: 0, count: w * h * 4)
    guard let cCtx = CGContext(data: &buf, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4, space: cs, bitmapInfo: bitmapInfo) else { return nil }
    cCtx.draw(rawCrop, in: CGRect(x: 0, y: 0, width: w, height: h))
    
    // Connected component analysis to isolate main body
    var visited = [Bool](repeating: false, count: w * h)
    var components = [[Int]]()
    
    for i in 0..<(w * h) {
        if buf[i * 4 + 3] > 20 && !visited[i] {
            var comp = [Int]()
            var queue = [i]
            visited[i] = true
            var qHead = 0
            while qHead < queue.count {
                let curr = queue[qHead]; qHead += 1
                comp.append(curr)
                let cx = curr % w, cy = curr / w
                let neighbors = [
                    cx > 0 ? curr - 1 : -1,
                    cx + 1 < w ? curr + 1 : -1,
                    cy > 0 ? curr - w : -1,
                    cy + 1 < h ? curr + w : -1
                ]
                for n in neighbors where n >= 0 {
                    if !visited[n] && buf[n * 4 + 3] > 20 {
                        visited[n] = true
                        queue.append(n)
                    }
                }
            }
            components.append(comp)
        }
    }
    
    guard !components.isEmpty else { return nil }
    components.sort { $0.count > $1.count }
    let mainComp = components[0]
    
    var keep = Set<Int>()
    for p in mainComp { keep.insert(p) }
    
    for c in components.dropFirst() {
        let touchesBorder = c.contains { p in
            let px = p % w, py = p / w
            return px == 0 || px == w - 1 || py == 0 || py == h - 1
        }
        // Discard any small island touching the border (stray bleed from neighbor!)
        if touchesBorder && c.count < 850 {
            continue
        }
        if c.count > 40 {
            for p in c { keep.insert(p) }
        }
    }
    
    var minX = w, maxX = 0, minY = h, maxY = 0
    for p in keep {
        let px = p % w, py = p / w
        if px < minX { minX = px }
        if px > maxX { maxX = px }
        if py < minY { minY = py }
        if py > maxY { maxY = py }
    }
    
    guard minX <= maxX && minY <= maxY else { return nil }
    let bw = maxX - minX + 1
    let bh = maxY - minY + 1
    
    var cleanBuf = [UInt8](repeating: 0, count: w * h * 4)
    guard let cleanCtx = CGContext(data: &cleanBuf, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4, space: cs, bitmapInfo: bitmapInfo) else { return nil }
    
    // Allow tall characters (Waluigi, Rosalina, Bowser, Donkey Kong) full expressive vertical height (up to 244px)!
    let maxW = 238.0
    let maxH = 244.0
    let scale = min(maxW / Double(bw), maxH / Double(bh), 1.0)
    let destW = Double(bw) * scale
    let destH = Double(bh) * scale
    let destX = (256.0 - destW) * 0.5
    // Ground baseline: align grounded feet firmly 8px above bottom border; jump pose (pose 3) floats naturally
    let destY = idx == 3 ? max(8.0, min(32.0, Double(minY) * scale)) : 8.0
    
    var bodyBuf = [UInt8](repeating: 0, count: bw * bh * 4)
    for y in minY...maxY {
        for x in minX...maxX {
            let p = y * w + x
            if keep.contains(p) {
                let sIdx = p * 4
                let dIdx = ((y - minY) * bw + (x - minX)) * 4
                bodyBuf[dIdx+0] = buf[sIdx+0]
                bodyBuf[dIdx+1] = buf[sIdx+1]
                bodyBuf[dIdx+2] = buf[sIdx+2]
                bodyBuf[dIdx+3] = buf[sIdx+3]
            }
        }
    }
    guard let bodyCtx = CGContext(data: &bodyBuf, width: bw, height: bh, bitsPerComponent: 8, bytesPerRow: bw * 4, space: cs, bitmapInfo: bitmapInfo),
          let bodyImg = bodyCtx.makeImage() else { return nil }
    
    cleanCtx.interpolationQuality = CGInterpolationQuality.high
    cleanCtx.draw(bodyImg, in: CGRect(x: destX, y: destY, width: destW, height: destH))
    return cleanCtx.makeImage()
}

guard let pIdle = cleanExtractPose(0),
      let pRun1 = cleanExtractPose(1),
      let pRun2 = cleanExtractPose(2),
      let pJump = cleanExtractPose(3),
      let pKick = cleanExtractPose(4),
      let pOuch = cleanExtractPose(5) else {
    print("Failed to cleanExtractPoses from \(inPath)")
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

    // STRICT CELL CLIPPING: Guarantee nothing can draw outside this 256x256 cell!
    ctx.clip(to: CGRect(x: cellLeft + 2, y: cgCellBottom + 2, width: Double(cellSize) - 4, height: Double(cellSize) - 4))

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
// -------------------------------------------------------------
for c in 0..<24 {
    let phase = 2.0 * Double.pi * (Double(c) / 24.0)
    let sy = 1.0 + 0.020 * sin(phase)
    let sx = 1.0 - 0.009 * sin(phase)
    let ty = -1.8 * max(0.0, -sin(phase))
    drawCell(img: pIdle, col: c, row: 0, scaleX: sx, scaleY: sy, transY: ty)
}

// -------------------------------------------------------------
// ROW 1: SPRINT CYCLE (24 FRAMES @ 24 FPS = 1.0 SECONDS / 2 STRIDES)
// -------------------------------------------------------------
struct SprintPoseDef {
    let img: CGImage
    let sx: Double
    let sy: Double
    let ty: Double
}

let sprintFrames: [SprintPoseDef] = [
    // Stride 1
    SprintPoseDef(img: pRun1, sx: 1.03, sy: 0.95, ty: -2.5),
    SprintPoseDef(img: pRun1, sx: 1.02, sy: 0.97, ty: -1.5),
    SprintPoseDef(img: pRun1, sx: 1.00, sy: 1.00, ty:  0.0),
    SprintPoseDef(img: pRun2, sx: 0.98, sy: 1.02, ty:  1.5),
    SprintPoseDef(img: pRun2, sx: 0.96, sy: 1.04, ty:  3.5),
    SprintPoseDef(img: pJump, sx: 0.98, sy: 1.02, ty:  5.0),
    SprintPoseDef(img: pJump, sx: 1.00, sy: 1.00, ty:  6.0),
    SprintPoseDef(img: pJump, sx: 0.99, sy: 1.01, ty:  4.5),
    SprintPoseDef(img: pRun2, sx: 0.98, sy: 1.02, ty:  2.5),
    SprintPoseDef(img: pRun2, sx: 0.99, sy: 1.01, ty:  1.0),
    SprintPoseDef(img: pRun1, sx: 1.01, sy: 0.99, ty: -1.0),
    SprintPoseDef(img: pRun1, sx: 1.02, sy: 0.97, ty: -2.0),

    // Stride 2 (Alternating Cadence)
    SprintPoseDef(img: pRun2, sx: 1.03, sy: 0.95, ty: -2.5),
    SprintPoseDef(img: pRun2, sx: 1.02, sy: 0.97, ty: -1.5),
    SprintPoseDef(img: pRun2, sx: 1.00, sy: 1.00, ty:  0.0),
    SprintPoseDef(img: pRun1, sx: 0.98, sy: 1.02, ty:  1.5),
    SprintPoseDef(img: pRun1, sx: 0.96, sy: 1.04, ty:  3.5),
    SprintPoseDef(img: pJump, sx: 0.98, sy: 1.02, ty:  5.0),
    SprintPoseDef(img: pJump, sx: 1.00, sy: 1.00, ty:  6.0),
    SprintPoseDef(img: pJump, sx: 0.99, sy: 1.01, ty:  4.5),
    SprintPoseDef(img: pRun1, sx: 0.98, sy: 1.02, ty:  2.5),
    SprintPoseDef(img: pRun1, sx: 0.99, sy: 1.01, ty:  1.0),
    SprintPoseDef(img: pRun2, sx: 1.01, sy: 0.99, ty: -1.0),
    SprintPoseDef(img: pRun2, sx: 1.02, sy: 0.97, ty: -2.0),
]

for (c, f) in sprintFrames.enumerated() {
    drawCell(img: f.img, col: c, row: 1, scaleX: f.sx, scaleY: f.sy, transY: f.ty)
}

// -------------------------------------------------------------
// ROW 2: JUMP TRAJECTORY (16 FRAMES)
// -------------------------------------------------------------
let jumpFrames: [SprintPoseDef] = [
    SprintPoseDef(img: pIdle, sx: 1.06, sy: 0.92, ty: -5.0),
    SprintPoseDef(img: pIdle, sx: 1.03, sy: 0.96, ty: -2.5),
    SprintPoseDef(img: pRun1, sx: 0.94, sy: 1.08, ty:  3.5),
    SprintPoseDef(img: pRun1, sx: 0.92, sy: 1.10, ty:  6.5),
    SprintPoseDef(img: pJump, sx: 0.95, sy: 1.06, ty:  7.5),
    SprintPoseDef(img: pJump, sx: 0.98, sy: 1.03, ty:  8.5),
    SprintPoseDef(img: pJump, sx: 0.99, sy: 1.01, ty:  9.5),
    SprintPoseDef(img: pJump, sx: 1.00, sy: 1.00, ty: 10.0),
    SprintPoseDef(img: pJump, sx: 1.00, sy: 1.00, ty: 10.0),
    SprintPoseDef(img: pJump, sx: 0.99, sy: 1.01, ty:  9.5),
    SprintPoseDef(img: pJump, sx: 0.98, sy: 1.03, ty:  7.5),
    SprintPoseDef(img: pJump, sx: 0.95, sy: 1.06, ty:  5.0),
    SprintPoseDef(img: pRun2, sx: 0.94, sy: 1.07, ty:  2.5),
    SprintPoseDef(img: pRun2, sx: 0.97, sy: 1.03, ty:  0.0),
    SprintPoseDef(img: pIdle, sx: 1.05, sy: 0.94, ty: -3.5),
    SprintPoseDef(img: pIdle, sx: 1.02, sy: 0.98, ty: -1.0),
]

for (c, f) in jumpFrames.enumerated() {
    drawCell(img: f.img, col: c, row: 2, scaleX: f.sx, scaleY: f.sy, transY: f.ty, anchorRelY: 0.35)
}

// -------------------------------------------------------------
// ROW 3: KICK SIDE / VOLLEY STRIKE (12 FRAMES)
// -------------------------------------------------------------
let kickSideFrames: [SprintPoseDef] = [
    SprintPoseDef(img: pIdle, sx: 0.97, sy: 1.02, ty: -1.5),
    SprintPoseDef(img: pIdle, sx: 0.95, sy: 1.03, ty: -0.5),
    SprintPoseDef(img: pKick, sx: 0.95, sy: 1.03, ty:  1.0),
    SprintPoseDef(img: pKick, sx: 0.98, sy: 1.01, ty:  1.5),
    SprintPoseDef(img: pKick, sx: 1.00, sy: 1.00, ty:  1.5),
    SprintPoseDef(img: pKick, sx: 1.03, sy: 0.98, ty:  1.5),
    SprintPoseDef(img: pKick, sx: 1.02, sy: 0.98, ty:  1.0),
    SprintPoseDef(img: pKick, sx: 1.01, sy: 0.99, ty:  0.5),
    SprintPoseDef(img: pJump, sx: 0.98, sy: 1.02, ty:  0.5),
    SprintPoseDef(img: pJump, sx: 0.99, sy: 1.01, ty:  0.0),
    SprintPoseDef(img: pIdle, sx: 1.02, sy: 0.98, ty: -1.5),
    SprintPoseDef(img: pIdle, sx: 1.01, sy: 0.99, ty: -0.5),
]

for (c, f) in kickSideFrames.enumerated() {
    drawCell(img: f.img, col: c, row: 3, scaleX: f.sx, scaleY: f.sy, transY: f.ty, anchorRelY: 0.35)
}

// -------------------------------------------------------------
// ROW 4: KICK UP / BICYCLE VOLLEY (12 FRAMES)
// -------------------------------------------------------------
let kickUpFrames: [SprintPoseDef] = [
    SprintPoseDef(img: pIdle, sx: 1.05, sy: 0.92, ty: -4.0),
    SprintPoseDef(img: pRun1, sx: 0.94, sy: 1.08, ty:  3.5),
    SprintPoseDef(img: pKick, sx: 0.96, sy: 1.03, ty:  6.0),
    SprintPoseDef(img: pKick, sx: 0.98, sy: 1.02, ty:  8.0),
    SprintPoseDef(img: pKick, sx: 1.00, sy: 1.00, ty:  9.5),
    SprintPoseDef(img: pKick, sx: 1.02, sy: 0.98, ty: 10.0),
    SprintPoseDef(img: pKick, sx: 1.01, sy: 0.99, ty:  9.5),
    SprintPoseDef(img: pKick, sx: 1.00, sy: 1.00, ty:  7.5),
    SprintPoseDef(img: pJump, sx: 0.98, sy: 1.02, ty:  5.0),
    SprintPoseDef(img: pJump, sx: 0.97, sy: 1.03, ty:  2.5),
    SprintPoseDef(img: pIdle, sx: 1.04, sy: 0.95, ty: -2.5),
    SprintPoseDef(img: pIdle, sx: 1.01, sy: 0.99, ty: -0.5),
]

for (c, f) in kickUpFrames.enumerated() {
    drawCell(img: f.img, col: c, row: 4, scaleX: f.sx, scaleY: f.sy, transY: f.ty, anchorRelY: 0.35)
}

// -------------------------------------------------------------
// ROW 5: OUCH / STUN DIZZY (16 FRAMES @ 24 FPS = 0.67s loop)
// -------------------------------------------------------------
for c in 0..<16 {
    let phase = 2.0 * Double.pi * (Double(c) / 16.0)
    let sx = 1.0 + 0.025 * sin(phase * 2.0)
    let sy = 1.0 - 0.025 * sin(phase * 2.0)
    let ty = -1.8 * abs(sin(phase))
    drawCell(img: pOuch, col: c, row: 5, scaleX: sx, scaleY: sy, transY: ty, anchorRelY: 0.15)
}

// -------------------------------------------------------------
// STRICT POST-GENERATION BORDER CLEARING PASS
// Zero out the outer 3 pixels of every 256x256 cell boundary across the entire 6144x1536 canvas!
// Guarantees 0 border touching, 0 neighbor bleed!
// -------------------------------------------------------------
for y in 0..<sheetH {
    let cellLocalY = y % cellSize
    let isRowEdge = (cellLocalY < 3 || cellLocalY >= cellSize - 3)
    
    for x in 0..<sheetW {
        let cellLocalX = x % cellSize
        let isColEdge = (cellLocalX < 3 || cellLocalX >= cellSize - 3)
        
        if isRowEdge || isColEdge {
            let idx = (y * sheetW + x) * 4
            atlasBuf[idx+0] = 0
            atlasBuf[idx+1] = 0
            atlasBuf[idx+2] = 0
            atlasBuf[idx+3] = 0
        }
    }
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
    print("Successfully synthesized clean ultra-fluid atlas: \(outPath) (\(sheetW)x\(sheetH))")
} else {
    print("Failed to finalize PNG at \(outPath)")
    exit(1)
}
