import { TelemetryTracker, type TelemetrySnapshot } from "../telemetry";

export type DemoCallbacks = {
  onTick: (snap: TelemetrySnapshot, hits: number, remainingMs: number) => void;
  onComplete: (snap: TelemetrySnapshot, hits: number) => void;
};

type Bubble = {
  id: number;
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  hue: number;
  pop: number;
};

const TARGET_HITS = 5;
const TIME_LIMIT_MS = 12_000;

export class BubbleDemo {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tracker = new TelemetryTracker();
  private callbacks: DemoCallbacks;
  private bubbles: Bubble[] = [];
  private hits = 0;
  private running = false;
  private raf = 0;
  private startedAt = 0;
  private nextId = 1;
  private dpr = 1;
  private width = 0;
  private height = 0;
  private pointerInside = false;

  constructor(canvas: HTMLCanvasElement, callbacks: DemoCallbacks) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas unavailable");
    this.canvas = canvas;
    this.ctx = ctx;
    this.callbacks = callbacks;

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerEnter = this.onPointerEnter.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.frame = this.frame.bind(this);

    canvas.addEventListener("pointermove", this.onPointerMove);
    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointerenter", this.onPointerEnter);
    canvas.addEventListener("pointerleave", this.onPointerLeave);
  }

  destroy(): void {
    cancelAnimationFrame(this.raf);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointerenter", this.onPointerEnter);
    this.canvas.removeEventListener("pointerleave", this.onPointerLeave);
  }

  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.width = Math.max(320, Math.floor(rect.width));
    this.height = Math.max(280, Math.floor(rect.width * 0.62));
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (!this.running) this.drawIdle();
  }

  start(): void {
    this.tracker.reset();
    this.hits = 0;
    this.bubbles = [];
    this.running = true;
    this.startedAt = performance.now();
    this.spawnInitial();
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(this.frame);
  }

  getSpeedSeries(): number[] {
    return this.tracker.getSpeedSeries();
  }

  isRunning(): boolean {
    return this.running;
  }

  /** Logical canvas size used by input mapping. */
  getSize(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  /** Active bubble centers for demos / tests. */
  getBubbleTargets(): Array<{ x: number; y: number; r: number }> {
    return this.bubbles.filter((b) => b.pop === 0).map((b) => ({ x: b.x, y: b.y, r: b.r }));
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.drawIdle();
  }

  private spawnInitial(): void {
    for (let i = 0; i < 4; i++) this.spawnBubble();
  }

  private spawnBubble(): void {
    const r = 18 + Math.random() * 16;
    const margin = r + 8;
    this.bubbles.push({
      id: this.nextId++,
      x: margin + Math.random() * (this.width - margin * 2),
      y: margin + Math.random() * (this.height - margin * 2),
      r,
      vx: (Math.random() * 2 - 1) * 0.55,
      vy: (Math.random() * 2 - 1) * 0.55,
      hue: 160 + Math.random() * 120,
      pop: 0,
    });
  }

  private localPoint(e: PointerEvent | MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.width / Math.max(1, rect.width);
    const scaleY = this.height / Math.max(1, rect.height);
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  private onPointerEnter(): void {
    this.pointerInside = true;
  }

  private onPointerLeave(): void {
    this.pointerInside = false;
  }

  private onPointerMove(e: PointerEvent | MouseEvent): void {
    if (!this.running) return;
    const p = this.localPoint(e);
    this.tracker.push(p.x, p.y, performance.now());
  }

  private onPointerDown(e: PointerEvent | MouseEvent): void {
    if (!this.running) return;
    e.preventDefault();
    const p = this.localPoint(e);
    this.tracker.push(p.x, p.y, performance.now());

    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i]!;
      if (b.pop > 0) continue;
      if (Math.hypot(p.x - b.x, p.y - b.y) <= b.r + 6) {
        b.pop = 0.01;
        this.hits += 1;
        if (this.hits < TARGET_HITS) this.spawnBubble();
        break;
      }
    }
  }

  private finish(): void {
    this.running = false;
    const snap = this.tracker.snapshot(this.hits, TARGET_HITS);
    this.callbacks.onComplete(snap, this.hits);
    this.drawIdle(snap);
  }

  private frame(now: number): void {
    if (!this.running) return;

    const elapsed = now - this.startedAt;
    const remaining = Math.max(0, TIME_LIMIT_MS - elapsed);

    for (const b of this.bubbles) {
      if (b.pop > 0) {
        b.pop += 0.08;
        continue;
      }
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < b.r || b.x > this.width - b.r) b.vx *= -1;
      if (b.y < b.r || b.y > this.height - b.r) b.vy *= -1;
      b.x = Math.min(this.width - b.r, Math.max(b.r, b.x));
      b.y = Math.min(this.height - b.r, Math.max(b.r, b.y));
    }
    this.bubbles = this.bubbles.filter((b) => b.pop < 1);

    this.drawScene();
    const snap = this.tracker.snapshot(this.hits, TARGET_HITS);
    this.callbacks.onTick(snap, this.hits, remaining);

    if (this.hits >= TARGET_HITS || remaining <= 0) {
      this.finish();
      return;
    }

    this.raf = requestAnimationFrame(this.frame);
  }

  private drawIdle(snap?: TelemetrySnapshot): void {
    const { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "rgba(232, 238, 252, 0.92)";
    ctx.font = "600 22px IBM Plex Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Bubble Pop Verification", width / 2, height / 2 - 28);

    ctx.fillStyle = "rgba(148, 163, 184, 0.95)";
    ctx.font = "400 14px IBM Plex Sans, sans-serif";
    if (snap) {
      const result =
        snap.label === "human"
          ? `Human verified · score ${snap.humanScore}`
          : snap.label === "bot"
            ? `Suspicious pattern · score ${snap.humanScore}`
            : `Inconclusive · score ${snap.humanScore}`;
      ctx.fillText(result, width / 2, height / 2 + 2);
      ctx.fillText("Press Start Demo to try again", width / 2, height / 2 + 28);
    } else {
      ctx.fillText("Pop 5 bubbles while we measure movement telemetry", width / 2, height / 2 + 2);
      ctx.fillText("Press Start Demo to begin", width / 2, height / 2 + 28);
    }

    // decorative orbs
    for (let i = 0; i < 6; i++) {
      const x = (width * (i + 1)) / 7;
      const y = height * 0.72 + Math.sin(i * 1.3) * 18;
      const r = 10 + (i % 3) * 4;
      const g = ctx.createRadialGradient(x - 3, y - 3, 2, x, y, r);
      g.addColorStop(0, `hsla(${170 + i * 25}, 85%, 70%, 0.55)`);
      g.addColorStop(1, `hsla(${170 + i * 25}, 85%, 45%, 0.05)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    void this.pointerInside;
  }

  private drawScene(): void {
    const { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);

    // subtle grid
    ctx.strokeStyle = "rgba(148, 163, 184, 0.06)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 36) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    for (const b of this.bubbles) {
      const scale = b.pop > 0 ? 1 + b.pop * 0.8 : 1;
      const alpha = b.pop > 0 ? 1 - b.pop : 1;
      const r = b.r * scale;
      const g = ctx.createRadialGradient(b.x - r * 0.3, b.y - r * 0.3, r * 0.1, b.x, b.y, r);
      g.addColorStop(0, `hsla(${b.hue}, 90%, 78%, ${0.85 * alpha})`);
      g.addColorStop(0.55, `hsla(${b.hue}, 80%, 55%, ${0.45 * alpha})`);
      g.addColorStop(1, `hsla(${b.hue}, 70%, 40%, ${0.05 * alpha})`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `hsla(${b.hue}, 90%, 80%, ${0.45 * alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(232, 238, 252, 0.8)";
    ctx.font = "500 13px IBM Plex Mono, monospace";
    ctx.textAlign = "left";
    ctx.fillText(`${this.hits}/${TARGET_HITS} pops`, 14, 22);
  }
}

export { TARGET_HITS, TIME_LIMIT_MS };
