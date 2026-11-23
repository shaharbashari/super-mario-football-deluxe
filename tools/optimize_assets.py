"""Optimize and validate the existing runtime atlases without changing their poses."""

import argparse
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CHARACTERS = (
    "mario", "luigi", "peach", "yoshi", "wario", "bowser",
    "waluigi", "toad", "donkey_kong", "rosalina", "king_boo", "bowser_jr",
    "livne", "dani", "dor", "shahar", "tal", "ziv",
)
FRAME_COUNTS = (24, 24, 16, 12, 12, 16)
SIZE = (3072, 768)


def validate_frames(path, cell, counts):
    with Image.open(path) as atlas:
        if atlas.size != (24 * cell, len(counts) * cell) or atlas.mode != "RGBA":
            raise ValueError(f"{path.name}: unexpected frame layout or missing alpha")
        alpha = atlas.getchannel("A")
        for row, count in enumerate(counts):
            for column in range(count):
                box = (column * cell, row * cell, (column + 1) * cell, (row + 1) * cell)
                if alpha.crop(box).getbbox() is None:
                    raise ValueError(f"{path.name}: empty frame {row}:{column}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Validate without changing any assets")
    args = parser.parse_args()
    before = after = 0
    for character in CHARACTERS:
        path = ROOT / "assets" / "sprites" / f"char_{character}.png"
        before += path.stat().st_size
        with Image.open(path) as source:
            source.load()
            if source.size not in ((6144, 1536), SIZE) or source.mode != "RGBA":
                raise ValueError(f"{path.name}: unsupported atlas {source.size} / {source.mode}")
            if source.size != SIZE:
                if args.check:
                    raise ValueError(f"{path.name}: run this tool without --check to optimize")
                source.resize(SIZE, Image.Resampling.LANCZOS).save(path, optimize=True)
        validate_frames(path, 128, FRAME_COUNTS)
        after += path.stat().st_size
    validate_frames(ROOT / "assets" / "sprites" / "wedding_kits.png", 64, FRAME_COUNTS * 2)
    for path in (ROOT / "assets").rglob("*"):
        if path.suffix.lower() in (".png", ".jpg"):
            with Image.open(path) as image:
                image.load()
    print(f"Validated {len(CHARACTERS)} character atlases / {sum(FRAME_COUNTS) * len(CHARACTERS)} used frames, kit overlays and all images.")
    print(f"Runtime character PNGs: {before:,} -> {after:,} bytes")
    print("Decoded character memory: 9 MiB per sheet; at most 6 recent sheets retained.")


if __name__ == "__main__":
    main()
