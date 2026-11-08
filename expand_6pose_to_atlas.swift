import Foundation
import CoreGraphics
import ImageIO

// Expands a 3x2 (768x512) 6-pose sheet into a 10x6 (2560x1536) atlas
// Poses:
// 0: idle
// 1: run1
// 2: run2
// 3: jump
// 4: kick
// 5: ouch

let args = CommandLine.arguments
if args.count < 3 {
    print("Usage: expand_6pose_to_atlas <in_png> <out_png>")
    exit(1)
}

let inPng = args[1]
let outPng = args[2]

let inUrl = URL(fileURLWithPath: inPng)
guard let src = CGImageSourceCreateWithURL(inUrl as CFURL, nil),
      let inImg = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
    print("Failed to load \(inPng)")
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

// Helper to extract a 256x256 pose from the 3x2 input
func extractPose(_ idx: Int) -> CGImage? {
    let col = idx % 3
    let row = idx / 3
    let rect = CGRect(x: col * 256, y: row * 256, width: 256, height: 256)
    return inImg.cropping(to: rect)
}

let pIdle = extractPose(0)
let pRun1 = extractPose(1)
let pRun2 = extractPose(2)
let pJump = extractPose(3)
let pKick = extractPose(4)
let pOuch = extractPose(5)

func drawCell(img: CGImage?, col: Int, row: Int) {
    guard let img = img else { return }
    let cellLeft = Double(col * cellSize)
    let cellTop = Double(row * cellSize)
    let cgCellBottomY = Double(sheetH) - cellTop - Double(cellSize)
    let rect = CGRect(x: cellLeft, y: cgCellBottomY, width: Double(cellSize), height: Double(cellSize))
    ctx.draw(img, in: rect)
}

// Row 0: Idle (8 frames)
for c in 0..<8 { drawCell(img: pIdle, col: c, row: 0) }

// Row 1: Run (8 frames alternating Run1 and Run2)
for c in 0..<8 {
    let img = (c % 2 == 0) ? pRun1 : pRun2
    drawCell(img: img, col: c, row: 1)
}

// Row 2: Jump (5 frames)
for c in 0..<5 { drawCell(img: pJump, col: c, row: 2) }

// Row 3: Kickside (4 frames)
for c in 0..<4 { drawCell(img: pKick, col: c, row: 3) }

// Row 4: Kickup (5 frames)
for c in 0..<5 { drawCell(img: pKick, col: c, row: 4) }

// Row 5: Ouch (4 frames)
for c in 0..<4 { drawCell(img: pOuch, col: c, row: 5) }

guard let outImg = ctx.makeImage() else { exit(1) }
let outUrl = URL(fileURLWithPath: outPng)
guard let dest = CGImageDestinationCreateWithURL(outUrl as CFURL, "public.png" as CFString, 1, nil) else { exit(1) }
CGImageDestinationAddImage(dest, outImg, nil)
if CGImageDestinationFinalize(dest) {
    print("Successfully expanded \(inPng) to \(outPng)")
}
