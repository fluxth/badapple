#!/usr/bin/env python3

import gzip
import struct

RES_W, RES_H = (160, 120)

cmdbuf = []

framebuf = [[0 for _ in range(RES_W)] for _ in range(RES_H)]

x_ptr = 0


def process_cmd(cmdbuf, coords) -> None | tuple[int, int]:
    global x_ptr

    if len(cmdbuf) == 0:
        return

    if cmdbuf[-1] == ord("\n"):
        cmdbuf = cmdbuf[:-1]

    if cmdbuf == [0x5B, 0x3F, 0x32, 0x35, 0x6C]:
        pass
        # print("hide cursor")

    elif cmdbuf == [0x5B, 0x3F, 0x32, 0x35, 0x68]:
        pass
        # print("restore cursor")

    elif cmdbuf == [0x5B, 0x32, 0x4A]:
        pass
        # print("clear screen")

    elif cmdbuf == [0x5B, 0x30, 0x6D]:
        pass
        # print("clear colors")

    elif cmdbuf[-1] == 0x66:
        y, x = "".join(chr(by) for by in cmdbuf[1:-1]).split(";")
        # print(f"go to coord [{x}, {y}]")
        x_ptr = 0
        return int(x), int(y)

    elif cmdbuf[:3] == [0x5B, 0x33, 0x38] or cmdbuf[:3] == [0x5B, 0x34, 0x38]:
        if cmdbuf[-3:] == [0xE2, 0x96, 0x84]:
            cmdbuf = cmdbuf[:-3]

        xterm_color = int("".join(chr(by) for by in cmdbuf[6:-1]))

        y = (coords[1] - 30) * 2
        if cmdbuf[1] == 0x33:
            # fg, line + 1
            y += 1

        # print(x_ptr, y, xterm_color)
        framebuf[y][x_ptr] = xterm_color

        if cmdbuf[1] == 0x33:
            # fg
            x_ptr += 1

    else:
        for by in cmdbuf:
            print(f"{chr(by):>2}", end=" ")
        print()
        for by in cmdbuf:
            print(hex(by)[2:], end=" ")
        print("\n")
        exit(1)


def process_frame(framebuf, num):
    # for y in framebuf:
    #    for x in y:
    #        print(f"{hex(x)[2:]:>2}", end="")
    #    print()

    print(num)

    with open("out.bin", "ab") as f:
        for line in framebuf:
            f.write(struct.pack(f"{RES_W}s", bytes(line)))


coords = None
frame_num = 1


def process(cmdbuf):
    global coords
    global frame_num

    if res := process_cmd(cmdbuf, coords):
        coords = res

        # new line
        # print(frame_num, coords)

        if coords[1] == 30:
            process_frame(framebuf, frame_num)
            frame_num += 1

            # exit()


with gzip.open("./source.gz", "rb") as f:
    while data := f.read(4096):
        for b in data:
            if b == 0x1B:
                process(cmdbuf)
                cmdbuf = []

            else:
                # if len(cmdbuf) == 0 and b != "[":
                #    print(cmdbuf, b, data)
                #    raise Exception("nono")

                cmdbuf.append(b)

    process(cmdbuf)
    process_frame(framebuf, frame_num)
