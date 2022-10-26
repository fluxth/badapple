import * as fzstd from "fzstd";

import { LUMINANCE_PALETTE, COLOR_PALETTE, ASCII_RAMP } from "./xterm";

const CANVAS_W = 960;
const CANVAS_H = 720;

enum RenderMode {
  Block,
  Text,
  TextInverse,
  Size,
  Differential,
}

class VideoBuffer {
  private FRAMES_PER_CHUNK = 30 * 10;
  WIDTH = 160;
  HEIGHT = 120;

  private chunkPrefix = "bad_apple_160x120_xterm256_chunk";
  private frameSizeBytes = 0;
  private chunks: { [index: number]: any } = {};
  private prevFrameBuffer: Uint8Array | null = null;

  forceFullRender = false;
  mode: RenderMode = RenderMode.Block;

  constructor() {
    this.frameSizeBytes = this.WIDTH * this.HEIGHT;
  }

  async loadChunk(chunkIndex: number) {
    if (chunkIndex in this.chunks) return;

    const compressedBuf = await fetch(
      (import.meta.env.PROD ? "/badapple" : "") +
        `/media/${this.chunkPrefix}${chunkIndex
          .toString()
          .padStart(2, "0")}.zst`
    ).then((res) => res.arrayBuffer());

    const compressed = new Uint8Array(compressedBuf);
    this.chunks[chunkIndex] = fzstd.decompress(compressed);
  }

  async loadChunkForFrame(frameIndex: number) {
    const chunkIndex = Math.floor(frameIndex / this.FRAMES_PER_CHUNK);
    await this.loadChunk(chunkIndex);
  }

  render(frameIndex: number, ctx: CanvasRenderingContext2D) {
    const chunkIndex = Math.floor(frameIndex / this.FRAMES_PER_CHUNK);
    const frameIndexInChunk = frameIndex % this.FRAMES_PER_CHUNK;
    //console.log(chunkIndex, frameIndexInChunk);

    const chunk = this.chunks[chunkIndex];
    if (!chunk) {
      console.error("wtf");
      return; // TODO
    }

    const byteStart = frameIndexInChunk * this.frameSizeBytes;
    const byteStop = byteStart + this.frameSizeBytes;
    const frameBuffer = chunk.slice(byteStart, byteStop);

    if (this.forceFullRender) {
      this.prevFrameBuffer = null;
      this.forceFullRender = false;
    }

    this.decodeAndDrawFrame(
      ctx,
      frameBuffer,
      frameIndexInChunk > 0 && this.prevFrameBuffer
        ? this.prevFrameBuffer
        : undefined
    );

    this.prevFrameBuffer = frameBuffer;

    if (
      frameIndexInChunk > this.FRAMES_PER_CHUNK * 0.6 &&
      !(chunkIndex + 1 in this.chunks)
    )
      this.loadChunk(chunkIndex + 1);
  }

  private decodeAndDrawFrame(
    ctx: CanvasRenderingContext2D,
    frame: Uint8Array,
    prevFrame?: Uint8Array
  ) {
    if (!prevFrame || this.mode === RenderMode.Differential)
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    for (let y = 0; y < this.HEIGHT; ++y) {
      for (let x = 0; x < this.WIDTH; ++x) {
        const color = frame[y * this.WIDTH + x];
        if (!color) continue;

        if (prevFrame && prevFrame[y * this.WIDTH + x] === color) {
          if (this.mode !== RenderMode.Differential) continue;
        } else {
          if (this.mode === RenderMode.Differential) {
            ctx.fillStyle = "red";
            ctx.fillRect(6 * x, 6 * y, 6, 6);
          } else {
            ctx.clearRect(6 * x, 6 * y, 6, 6);
          }
        }

        if (this.mode === RenderMode.Block) {
          ctx.fillStyle = COLOR_PALETTE[color];
          ctx.fillRect(6 * x, 6 * y, 6, 6);
        } else if (
          this.mode === RenderMode.Text ||
          this.mode === RenderMode.TextInverse
        ) {
          let luminance = LUMINANCE_PALETTE[color];
          if (this.mode === RenderMode.TextInverse) luminance = 1 + -luminance;

          const charIndex = Math.floor(luminance * ASCII_RAMP.length);
          const char = ASCII_RAMP[charIndex];

          if (char === " ") continue;

          ctx.fillStyle =
            this.mode === RenderMode.TextInverse ? "white" : "black";
          ctx.fillText(char, 6 * x + 3, 6 * y + 3, 6);
        } else if (this.mode === RenderMode.Size) {
          ctx.fillStyle = "black";
          const size = 6 * (1 + -LUMINANCE_PALETTE[color]);
          const pad = (6 - size) / 2;
          ctx.fillRect(6 * x + pad, 6 * y + pad, size, size);
        } else if (this.mode === RenderMode.Differential) {
          ctx.fillStyle = COLOR_PALETTE[color];
          ctx.fillRect(6 * x + 1, 6 * y + 1, 4, 4);
        }
      }
    }
  }
}

(async () => {
  // Entry point
  const buffer = new VideoBuffer();
  buffer.loadChunk(0);

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    alert("no");
    return;
  }

  ctx.font = "bold 6px Monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const audio = document.getElementById("music") as HTMLAudioElement;
  audio.volume = 0.2;

  const getCurrentFrame = () => Math.floor(audio.currentTime * 30 + 6);

  audio.addEventListener("seeked", () => {
    buffer.loadChunkForFrame(getCurrentFrame());
    buffer.forceFullRender = true;
    buffer.render(getCurrentFrame(), ctx);
  });

  setInterval(() => {
    if (!audio.paused) {
      buffer.render(getCurrentFrame(), ctx);
    }
  }, 1000 / 30);

  document.querySelectorAll('input[name="render-mode"]').forEach((item) => {
    item.addEventListener("change", () => {
      if (!(item instanceof HTMLInputElement)) return;

      canvas.style.backgroundColor = "white";

      let mode = RenderMode.Block;
      switch (item.value) {
        case "block":
        default:
          mode = RenderMode.Block;
          break;
        case "text":
          mode = RenderMode.Text;
          break;
        case "text_inverse":
          mode = RenderMode.TextInverse;
          canvas.style.backgroundColor = "black";
          break;
        case "size":
          mode = RenderMode.Size;
          break;
        case "diff":
          mode = RenderMode.Differential;
          break;
      }

      buffer.forceFullRender = true;
      buffer.mode = mode;
    });
  });
})();
