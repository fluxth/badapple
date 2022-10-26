#!/usr/bin/env python3

from PIL import Image, ImageFont, ImageDraw


def test_char(char: str) -> int:
    im = Image.new("L", (20, 20), "black")
    draw = ImageDraw.Draw(im)
    font = ImageFont.truetype("/usr/share/fonts/TTF/courbd.ttf", 16)
    draw.text((1, 0), char, font=font, fill="white")

    sum = 0
    for y in range(20):
        for x in range(20):
            sum += im.getpixel((x, y))

    return sum


out = []
chars = [chr(x) for x in range(32, 127)]

for c in chars:
    r = test_char(c)
    out.append((r, c))

rank = sorted(out, reverse=True)

print("".join(x[1] for x in rank))
