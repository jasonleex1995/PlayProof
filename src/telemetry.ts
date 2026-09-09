export type Sample = {
  t: number;
  x: number;
  y: number;
};

export type TelemetrySnapshot = {
  samples: number;
  durationMs: number;
  avgSpeed: number;
  avgAccel: number;
  jerk: number;
  pathEfficiency: number;
  jitter: number;
  humanScore: number;
  label: "human" | "bot" | "unknown";
};

function dist(a: Sample, b: Sample): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.hypot(dx, dy);
}

export class TelemetryTracker {
  private samples: Sample[] = [];
  private speeds: number[] = [];
  private accels: number[] = [];
  private jerks: number[] = [];
  private startedAt = 0;
  private lastSpeed = 0;
  private lastAccel = 0;

  reset(): void {
    this.samples = [];
    this.speeds = [];
    this.accels = [];
    this.jerks = [];
    this.startedAt = 0;
    this.lastSpeed = 0;
    this.lastAccel = 0;
  }

  push(x: number, y: number, t = performance.now()): void {
    if (this.samples.length === 0) {
      this.startedAt = t;
      this.samples.push({ t, x, y });
      return;
    }

    const prev = this.samples[this.samples.length - 1]!;
    const dt = Math.max(1, t - prev.t);
    const d = dist(prev, { t, x, y });
    const speed = d / dt;
    const accel = (speed - this.lastSpeed) / dt;
    const jerk = (accel - this.lastAccel) / dt;

    this.samples.push({ t, x, y });
    this.speeds.push(speed);
    this.accels.push(accel);
    this.jerks.push(jerk);
    this.lastSpeed = speed;
    this.lastAccel = accel;

    if (this.samples.length > 400) {
      this.samples.shift();
      this.speeds.shift();
      this.accels.shift();
      this.jerks.shift();
    }
  }

  getSpeedSeries(): number[] {
    return this.speeds.slice(-80);
  }

  snapshot(hits = 0, targetHits = 5): TelemetrySnapshot {
    const n = this.samples.length;
    if (n < 4) {
      return {
        samples: n,
        durationMs: 0,
        avgSpeed: 0,
        avgAccel: 0,
        jerk: 0,
        pathEfficiency: 0,
        jitter: 0,
        humanScore: 0,
        label: "unknown",
      };
    }

    const durationMs = this.samples[n - 1]!.t - this.startedAt;
    const avg = (arr: number[]) =>
      arr.length === 0 ? 0 : arr.reduce((s, v) => s + v, 0) / arr.length;

    const avgSpeed = avg(this.speeds);
    const avgAccel = avg(this.accels.map(Math.abs));
    const jerk = avg(this.jerks.map(Math.abs));

    let pathLen = 0;
    for (let i = 1; i < n; i++) {
      pathLen += dist(this.samples[i - 1]!, this.samples[i]!);
    }
    const straight = dist(this.samples[0]!, this.samples[n - 1]!);
    const pathEfficiency = pathLen <= 1e-6 ? 0 : Math.min(1, straight / pathLen);

    // Jitter: variance of successive direction changes.
    let angleVar = 0;
    let angleCount = 0;
    for (let i = 2; i < n; i++) {
      const a = this.samples[i - 2]!;
      const b = this.samples[i - 1]!;
      const c = this.samples[i]!;
      const ang1 = Math.atan2(b.y - a.y, b.x - a.x);
      const ang2 = Math.atan2(c.y - b.y, c.x - b.x);
      let dAng = Math.abs(ang2 - ang1);
      if (dAng > Math.PI) dAng = 2 * Math.PI - dAng;
      angleVar += dAng;
      angleCount += 1;
    }
    const jitter = angleCount === 0 ? 0 : angleVar / angleCount;

    // Heuristic scoring: bots tend to be too straight / constant-speed / low-jerk,
    // or perfectly uniform. Humans show natural micro-corrections.
    let score = 55;
    score += Math.min(18, jitter * 22);
    score += Math.min(12, jerk * 18000);
    score += Math.min(10, avgAccel * 900);
    score -= Math.max(0, (pathEfficiency - 0.92) * 80);
    if (avgSpeed < 0.02) score -= 12;
    if (avgSpeed > 1.8) score -= 8;
    if (this.speeds.length > 10) {
      const mean = avgSpeed;
      const variance =
        this.speeds.reduce((s, v) => s + (v - mean) ** 2, 0) / this.speeds.length;
      score += Math.min(12, Math.sqrt(variance) * 40);
    }

    // Completion bonus / penalty
    const completion = hits / Math.max(1, targetHits);
    score += completion * 8;
    if (durationMs > 0 && durationMs < 900 && hits >= targetHits) score -= 25;
    if (durationMs > 18000) score -= 8;

    const humanScore = Math.max(0, Math.min(99, Math.round(score)));
    const label: TelemetrySnapshot["label"] =
      humanScore >= 62 ? "human" : humanScore >= 40 ? "unknown" : "bot";

    return {
      samples: n,
      durationMs,
      avgSpeed,
      avgAccel,
      jerk,
      pathEfficiency,
      jitter,
      humanScore,
      label,
    };
  }
}
