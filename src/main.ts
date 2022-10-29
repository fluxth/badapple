import "./index.css";

import * as fzstd from "fzstd";

import "@fortawesome/fontawesome-free/js/solid.js";
import "@fortawesome/fontawesome-free/js/fontawesome.js";

import { LUMINANCE_PALETTE, COLOR_PALETTE, ASCII_RAMP } from "./xterm";

const VOLUME_CAP = 0.3;

enum RenderMode {
  Block,
  Text,
  TextInverse,
  Size,
  SizeInverse,
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
  private sprites: HTMLCanvasElement | null = null;

  forceFullRender = false;
  mode: RenderMode = RenderMode.Block;

  constructor() {
    this.frameSizeBytes = this.WIDTH * this.HEIGHT;
  }

  generateSprites(scaling: number) {
    const sprites = document.createElement("canvas");
    sprites.height = scaling;
    sprites.width = scaling * ASCII_RAMP.length;

    const ctx = sprites.getContext("2d");
    if (!ctx) return;

    ctx.textAlign = "center";
    ctx.textBaseline = "ideographic";
    ctx.font = `bold ${scaling}px Courier`;

    if (this.mode === RenderMode.TextInverse) ctx.fillStyle = "white";
    else ctx.fillStyle = "black";

    for (let i = 0; i < ASCII_RAMP.length; ++i) {
      const char = ASCII_RAMP[i];
      const x = i * scaling;
      ctx.fillText(char, x + scaling / 2, scaling, scaling);
    }

    this.sprites = sprites;
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

  getScalingFactor(canvas: HTMLCanvasElement): number {
    return canvas.width / this.WIDTH;
  }

  private decodeAndDrawFrame(
    ctx: CanvasRenderingContext2D,
    frame: Uint8Array,
    prevFrame?: Uint8Array
  ) {
    // Scaling factor
    const s = this.getScalingFactor(ctx.canvas);

    if (!prevFrame || this.mode === RenderMode.Differential)
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (!this.sprites) {
      console.error("Sprites not found!");
      return;
    }

    for (let y = 0; y < this.HEIGHT; ++y) {
      for (let x = 0; x < this.WIDTH; ++x) {
        const color = frame[y * this.WIDTH + x];
        if (!color) continue;

        if (prevFrame && prevFrame[y * this.WIDTH + x] === color) {
          if (this.mode !== RenderMode.Differential) continue;
        } else {
          if (this.mode === RenderMode.Differential) {
            ctx.fillStyle = "red";
            ctx.fillRect(s * x, s * y, s, s);
          } else {
            ctx.clearRect(s * x, s * y, s, s);
          }
        }

        if (this.mode === RenderMode.Block) {
          ctx.fillStyle = COLOR_PALETTE[color];
          ctx.fillRect(s * x, s * y, s, s);
        } else if (
          this.mode === RenderMode.Text ||
          this.mode === RenderMode.TextInverse
        ) {
          let luminance = LUMINANCE_PALETTE[color];
          if (this.mode === RenderMode.TextInverse) luminance = 1 + -luminance;

          const charIndex = Math.floor(luminance * ASCII_RAMP.length);
          if (charIndex === undefined || charIndex === ASCII_RAMP.length - 1)
            continue;

          ctx.drawImage(
            this.sprites,
            s * charIndex,
            0,
            s,
            s,
            s * x,
            s * y,
            s,
            s
          );
        } else if (
          this.mode === RenderMode.Size ||
          this.mode === RenderMode.SizeInverse
        ) {
          let luminance = LUMINANCE_PALETTE[color];
          if (this.mode !== RenderMode.SizeInverse) luminance = 1 + -luminance;

          const size = s * luminance;
          const pad = (s - size) / 2;

          ctx.fillStyle =
            this.mode === RenderMode.SizeInverse ? "white" : "black";
          ctx.fillRect(s * x + pad, s * y + pad, size, size);
        } else if (this.mode === RenderMode.Differential) {
          ctx.fillStyle = COLOR_PALETTE[color];
          let border = Math.floor(s / 6);
          if (border < 1) border = 1;
          ctx.fillRect(
            s * x + border,
            s * y + border,
            s - border * 2,
            s - border * 2
          );
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

  document.querySelectorAll('input[name="render-scaling"]').forEach((item) => {
    item.addEventListener("change", () => {
      if (!(item instanceof HTMLInputElement)) return;
      buffer.forceFullRender = true;
      changeScaling(parseInt(item.value));
    });
  });

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

  const getContext = () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      alert("Unable to get context!");
      throw "Unable to get context";
    }

    return ctx;
  };

  const audio = document.getElementById("music") as HTMLAudioElement;
  audio.volume = VOLUME_CAP;

  const getCurrentFrame = () => Math.floor(audio.currentTime * 30 + 30);

  audio.addEventListener("seeked", () => {
    buffer.loadChunkForFrame(getCurrentFrame());
    buffer.forceFullRender = true;
    buffer.render(getCurrentFrame(), getContext());
  });

  let ctx = getContext();

  const changeScaling = (factor: number) => {
    canvas.width = buffer.WIDTH * factor;
    canvas.height = buffer.HEIGHT * factor;

    ctx = getContext();
    buffer.generateSprites(factor);
  };

  changeScaling(9); // default to 1080p

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
    volumeSlider: document.getElementById(
      "player-volume-slider"
    ) as HTMLInputElement,
    labels: {
      currentTime: document.getElementById(
        "player-current-time"
      ) as HTMLDivElement,
    },
    buttons: {
      play: document.getElementById("player-button-play") as HTMLButtonElement,
      settings: document.getElementById(
        "player-button-settings"
      ) as HTMLButtonElement,
      volume: document.getElementById(
        "player-button-volume"
      ) as HTMLButtonElement,
    },
    panels: {
      settings: document.getElementById("settings-panel") as HTMLDivElement,
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

  player.buttons.settings.addEventListener("click", () => {
    const panel = player.panels.settings;
    if (panel.style.display === "none") panel.style.display = "flex";
    else panel.style.display = "none";
  });

  const setVolume = (fullVolume: number) => {
    const volume = fullVolume * VOLUME_CAP;
    player.volumeSlider.value = `${fullVolume * 100}`;
    audio.volume = volume;

    if (volume === 0)
      player.buttons.volume.innerHTML =
        '<i class="fa-solid fa-fw fa-volume-mute"></i>';
    else
      player.buttons.volume.innerHTML =
        '<i class="fa-solid fa-fw fa-volume-high"></i>';
  };

  player.volumeSlider.addEventListener("change", () => {
    setVolume(parseInt(player.volumeSlider.value) / 100);
  });

  player.buttons.volume.addEventListener("click", () => {
    if (audio.volume === 0) setVolume(1);
    else setVolume(0);
  });

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
          canvas.style.backgroundColor = "black";
          mode = RenderMode.TextInverse;
          break;
        case "size":
          mode = RenderMode.Size;
          break;
        case "size_inverse":
          canvas.style.backgroundColor = "black";
          mode = RenderMode.SizeInverse;
          break;
        case "diff":
          mode = RenderMode.Differential;
          break;
      }

      buffer.forceFullRender = true;
      buffer.mode = mode;
      buffer.generateSprites(buffer.getScalingFactor(canvas));
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
