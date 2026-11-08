import Foundation
import CoreGraphics
import ImageIO

// Compiles extracted Construct 3 Mario frames into a 10x6 256x256 sprite atlas (2560x1536)
// Rows:
// 0: idle
// 1: run
// 2: jump
// 3: kickside
// 4: kickup
// 5: ouch

let args = CommandLine.arguments
if args.count < 3 {
    print("Usage: compile_c3_atlas <char_dir> <out_png> [targetScale]")
    exit(1)
}

let charDir = args[1]
let outPng = args[2]
let customScale = args.count >= 4 ? Double(args[3])! : 4.0

let actions = ["idle", "run", "jump", "kickside", "kickup", "ouch"]
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
    print("Failed to create CGContext")
    exit(1)
}

ctx.interpolationQuality = .none // Crisp pixel art scaling!

for (rowIdx, action) in actions.enumerated() {
    // Find all files matching <action>_<num>.png
    let fm = FileManager.default
    guard let files = try? fm.contentsOfDirectory(atPath: charDir) else { continue }
    let actionFiles = files
        .filter { $0.hasPrefix(action + "_") && $0.hasSuffix(".png") }
        .sorted()
    
    print("\(action): found \(actionFiles.count) frames")
    for (colIdx, file) in actionFiles.prefix(cols).enumerated() {
        let filePath = (charDir as NSString).appendingPathComponent(file)
        let fileUrl = URL(fileURLWithPath: filePath)
        guard let src = CGImageSourceCreateWithURL(fileUrl as CFURL, nil),
              let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else { continue }
        
        let iw = Double(img.width)
        let ih = Double(img.height)
        let scale = customScale
        let dw = iw * scale
        let dh = ih * scale
        
        // Foot-aligned: place bottom of sprite at bottomMargin
        let bottomMargin = 22.0
        let cellLeft = Double(colIdx * cellSize)
        let cellTop = Double(rowIdx * cellSize)
        
        let drawX = cellLeft + (Double(cellSize) - dw) * 0.5
        // CGContext y is 0 at bottom, so:
        // row 0 is top row: y in CGContext is sheetH - cellTop - cellSize
        let cgCellBottomY = Double(sheetH) - cellTop - Double(cellSize)
        let drawY = cgCellBottomY + bottomMargin
        
        let drawRect = CGRect(x: drawX, y: drawY, width: dw, height: dh)
        ctx.draw(img, in: drawRect)
    }
}

guard let outImg = ctx.makeImage() else {
    print("Failed to make CGImage")
    exit(1)
}

let outUrl = URL(fileURLWithPath: outPng)
guard let dest = CGImageDestinationCreateWithURL(outUrl as CFURL, "public.png" as CFString, 1, nil) else {
    print("Failed to create destination")
    exit(1)
}
CGImageDestinationAddImage(dest, outImg, nil)
if CGImageDestinationFinalize(dest) {
    print("Successfully wrote \(outPng) (\(sheetW)x\(sheetH))")
} else {
    print("Failed to finalize image")
    exit(1)
}
