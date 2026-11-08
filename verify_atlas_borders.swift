import Foundation
import CoreGraphics
import ImageIO

let args = CommandLine.arguments
if args.count < 2 {
    print("Usage: verify_atlas_borders <atlas.png>")
    exit(1)
}

let inPath = args[1]
let inUrl = URL(fileURLWithPath: inPath)
guard let src = CGImageSourceCreateWithURL(inUrl as CFURL, nil),
      let inImg = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
    print("Failed to load \(inPath)")
    exit(1)
}

let w = inImg.width
let h = inImg.height
let cellSize = 256
let cols = w / cellSize
let rows = h / cellSize

var buf = [UInt8](repeating: 0, count: w * h * 4)
let cs = CGColorSpaceCreateDeviceRGB()
let bitmapInfo = CGImageAlphaInfo.premultipliedLast.rawValue | CGBitmapInfo.byteOrder32Big.rawValue
guard let ctx = CGContext(data: &buf, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4, space: cs, bitmapInfo: bitmapInfo) else {
    print("Failed context")
    exit(1)
}
ctx.draw(inImg, in: CGRect(x: 0, y: 0, width: w, height: h))

var bleedingCells = 0
for r in 0..<rows {
    for c in 0..<cols {
        var cellHasBleed = false
        for y in 0..<cellSize {
            for x in 0..<cellSize {
                let isBorder = (x < 2 || x >= cellSize - 2 || y < 2 || y >= cellSize - 2)
                if isBorder {
                    let gx = c * cellSize + x
                    let gy = r * cellSize + y
                    let idx = (gy * w + gx) * 4
                    let a = buf[idx + 3]
                    if a > 10 {
                        cellHasBleed = true
                        break
                    }
                }
            }
            if cellHasBleed { break }
        }
        if cellHasBleed {
            bleedingCells += 1
        }
    }
}

print("Atlas \(inPath) (\(w)x\(h)): \(bleedingCells) bleeding cells out of \(cols * rows)")
exit(bleedingCells == 0 ? 0 : 2)
