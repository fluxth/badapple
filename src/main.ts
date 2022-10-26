import "./index.css";

import * as fzstd from "fzstd";

import "@fortawesome/fontawesome-free/js/solid.js";
import "@fortawesome/fontawesome-free/js/fontawesome.js";

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
  private chunks: { [index: number]: Uint8Array | null } = {};
  private prevFrameBuffer: Uint8Array | null = null;

  forceFullRender = false;
  mode: RenderMode = RenderMode.Block;

  constructor() {
    this.frameSizeBytes = this.WIDTH * this.HEIGHT;
  }

  async loadChunk(chunkIndex: number) {
    if (chunkIndex in this.chunks) return;

    this.chunks[chunkIndex] = null;

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

  const playerArea = document.getElementById("player-area") as HTMLDivElement;

  const resizeHandler = () => {
    if (playerArea.offsetWidth / playerArea.offsetHeight < 4 / 3) {
      // tall
      playerArea.classList.remove("wide");
      playerArea.classList.add("tall");
    } else {
      // wide
      playerArea.classList.remove("tall");
      playerArea.classList.add("wide");
    }
  };

  window.addEventListener("resize", resizeHandler);
  resizeHandler();

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    alert("no");
    return;
  }

  ctx.font = "bold 6px Courier New";
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

  const player = {
    seekHandle: document.getElementById("player-seek-handle") as HTMLDivElement,
    bar: document.getElementById("player-bar") as HTMLDivElement,
    progressBar: document.getElementById(
      "player-progress-bar"
    ) as HTMLDivElement,
    bufferBar: document.getElementById("player-buffer-bar") as HTMLDivElement,
    labels: {
      currentTime: document.getElementById(
        "player-current-time"
      ) as HTMLDivElement,
    },
    buttons: {
      play: document.getElementById("player-button-play") as HTMLButtonElement,
    },
  };

  const togglePlayState = () => {
    if (audio.paused) {
      audio.play();
      player.buttons.play.innerHTML = '<i class="fa-solid fa-fw fa-pause"></i>';
    } else {
      audio.pause();
      player.buttons.play.innerHTML = '<i class="fa-solid fa-fw fa-play"></i>';
    }
  };

  playerArea.addEventListener("click", togglePlayState);
  player.buttons.play.addEventListener("click", togglePlayState);

  player.bar.addEventListener("click", (event) => {
    const element = event.target as HTMLDivElement | undefined;
    if (!element) return;

    const newProgress = event.offsetX / element.offsetWidth;
    audio.currentTime = newProgress * audio.duration;
  });

  audio.addEventListener("timeupdate", () => {
    const progressPercentage = (audio.currentTime / audio.duration) * 100;
    player.seekHandle.style.left = `${progressPercentage}%`;
    player.progressBar.style.width = `${progressPercentage}%`;
    //player.bufferBar.style.width = `${progressPercentage + 4}%`;
    player.labels.currentTime.innerText = formatTime(audio.currentTime);
  });

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

function formatTime(sec_num: number): string {
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);
  const seconds = Math.floor(sec_num - hours * 3600 - minutes * 60);

  let out = "";

  if (hours) {
    if (hours < 10) out += "0";
    out += `${hours}:`;
  }

  if (hours && minutes < 10) out += "0";
  out += `${minutes}:`;

  if (seconds < 10) out += "0";
  out += `${seconds}`;

  return out;
}
