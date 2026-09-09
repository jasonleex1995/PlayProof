import "./style.css";
import { BubbleDemo, TARGET_HITS } from "./demo/bubbleDemo";
import type { TelemetrySnapshot } from "./telemetry";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

app.innerHTML = `
  <header class="site-header">
    <div class="container nav">
      <a class="brand" href="#top" aria-label="PlayProof home">
        <span class="brand-mark" aria-hidden="true">◇</span>
        PlayProof
      </a>
      <nav class="nav-links" aria-label="Primary">
        <a href="#demo">Live Demo</a>
        <a href="#features">Features</a>
        <a href="#how">How it works</a>
        <a href="#sdk">SDK</a>
      </nav>
      <a class="btn btn-primary" href="#demo">Try Demo</a>
    </div>
  </header>

  <main id="top">
    <section class="container hero">
      <div>
        <div class="eyebrow">Next-gen human verification</div>
        <h1>CAPTCHA 대신,<br /><span>게임으로 사람을 증명</span>하세요</h1>
        <p class="lead">
          PlayProof는 짧은 미니게임 속 마우스·포인터 행동 신호(속도, 가속도, jerk, 경로 효율)를
          분석해 사람과 봇을 구분합니다. 브랜드에 맞는 UX로 전환율을 지키면서 보안을 강화하세요.
        </p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#demo">라이브 데모 시작</a>
          <a class="btn btn-secondary" href="#sdk">SDK 예시 보기</a>
        </div>
        <div class="stat-row">
          <div class="stat"><strong>99.9%</strong><span>공격 차단률*</span></div>
          <div class="stat"><strong>≤10s</strong><span>미니게임 완료</span></div>
          <div class="stat"><strong>4+</strong><span>게임 템플릿</span></div>
        </div>
      </div>
      <aside class="hero-card" aria-label="Product preview">
        <div class="hero-card-header">
          <h2>Verification Session</h2>
          <span class="pill live">LIVE DEMO</span>
        </div>
        <div style="padding: 1.1rem 1.15rem 1.25rem;">
          <p style="margin:0 0 0.85rem;color:var(--muted);font-size:0.92rem;">
            Bubble Pop · 행동 텔레메트리 스트리밍 · 실시간 스코어
          </p>
          <div style="display:grid;gap:0.55rem;font-family:var(--mono);font-size:0.8rem;color:#cbd5e1;">
            <div>→ capture pointer stream @ 60–120Hz</div>
            <div>→ extract velocity / accel / jerk / jitter</div>
            <div>→ score human-likeness in &lt; 50ms</div>
            <div style="color:var(--accent);">✓ issue signed verification token</div>
          </div>
        </div>
      </aside>
    </section>

    <section class="section" id="demo">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>라이브 데모</h2>
            <p>버블 5개를 터트리면 행동 패턴을 채점합니다. 움직임을 자연스럽게 해주세요 — 너무 직선적이거나 기계적인 궤적은 점수가 낮아집니다.</p>
          </div>
        </div>
        <div class="demo-layout">
          <div class="demo-panel">
            <div class="panel-bar">
              <h3>Bubble Pop</h3>
              <div class="panel-meta" id="demo-timer">ready</div>
            </div>
            <canvas id="game-canvas" width="720" height="440" aria-label="PlayProof bubble pop demo canvas"></canvas>
            <div class="demo-controls">
              <button class="btn btn-primary" id="start-demo" type="button">Start Demo</button>
              <button class="btn btn-secondary" id="reset-demo" type="button">Reset</button>
              <span class="panel-meta" id="hit-count">0 / ${TARGET_HITS} pops</span>
            </div>
          </div>
          <div class="telemetry-panel">
            <div class="panel-bar">
              <h3>Behavioral Telemetry</h3>
              <div class="panel-meta">client-side heuristic</div>
            </div>
            <div class="telemetry-body">
              <div class="verdict" id="verdict" data-state="idle">
                <h4>Waiting</h4>
                <p>데모를 시작하면 실시간으로 휴먼 스코어가 갱신됩니다.</p>
              </div>
              <div class="metric-grid">
                <div class="metric"><label>Human score</label><strong id="m-score">—</strong></div>
                <div class="metric"><label>Samples</label><strong id="m-samples">0</strong></div>
                <div class="metric"><label>Avg speed</label><strong id="m-speed">0.00</strong></div>
                <div class="metric"><label>Jerk</label><strong id="m-jerk">0.00</strong></div>
                <div class="metric"><label>Path efficiency</label><strong id="m-eff">0%</strong></div>
                <div class="metric"><label>Jitter</label><strong id="m-jitter">0.00</strong></div>
              </div>
              <canvas class="sparkline" id="speed-spark" width="360" height="72" aria-label="Speed sparkline"></canvas>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="features">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>왜 PlayProof인가</h2>
            <p>정적 퍼즐은 이미 모델이 풉니다. PlayProof는 “무엇을 맞췄는가”가 아니라 “어떻게 움직였는가”를 봅니다.</p>
          </div>
        </div>
        <div class="grid-3">
          <article class="card">
            <div class="icon">🎮</div>
            <h3>Satisfying mini-game</h3>
            <p>Bubble Pop, Aim, Rhythm 등 짧은 인터랙션으로 인증 피로를 줄입니다. 최장 약 10초.</p>
          </article>
          <article class="card">
            <div class="icon">🧠</div>
            <h3>Behavioral intelligence</h3>
            <p>속도·가속도·jerk·경로 효율·지터 등 고빈도 신호를 결합해 봇 궤적을 탐지합니다.</p>
          </article>
          <article class="card">
            <div class="icon">🎨</div>
            <h3>Brand-native UX</h3>
            <p>컬러, 형태, 카피를 브랜드에 맞춰 커스터마이즈. 인증 화면이 제품의 일부처럼 느껴집니다.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section" id="how">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>동작 방식</h2>
            <p>임베드 한 줄로 세션을 시작하고, 서명된 토큰으로 백엔드에서 검증합니다.</p>
          </div>
        </div>
        <div class="steps">
          <article class="step">
            <h3>Embed SDK</h3>
            <p>웹앱에 PlayProof 위젯을 삽입하고 deployment 키를 연결합니다.</p>
          </article>
          <article class="step">
            <h3>Play & stream</h3>
            <p>사용자가 미니게임을 플레이하는 동안 포인터 텔레메트리가 수집됩니다.</p>
          </article>
          <article class="step">
            <h3>Score</h3>
            <p>휴리스틱 + ML 스코어링으로 사람다움 점수를 산출합니다.</p>
          </article>
          <article class="step">
            <h3>Verify token</h3>
            <p>성공 시 단기 서명 토큰을 발급해 서버에서 재검증합니다.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section" id="sdk">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>SDK 스니펫</h2>
            <p>데모용 API 표면입니다. 실제 프로덕션에서는 서버 사이드 토큰 검증을 함께 사용하세요.</p>
          </div>
        </div>
        <pre class="code-block"><code><span class="kw">import</span> { Playproof } <span class="kw">from</span> <span class="str">'playproof'</span>;

<span class="kw">const</span> gate = <span class="kw">new</span> <span class="fn">Playproof</span>({
  containerId: <span class="str">'playproof-container'</span>,
  apiKey: <span class="str">'pp_demo_key'</span>,
  deploymentId: <span class="str">'demo_bubble_pop'</span>,
  onSuccess: (result) => {
    <span class="cm">// result.token → verify on your backend</span>
    console.<span class="fn">log</span>(<span class="str">'human verified'</span>, result.score);
  },
  onFailure: (err) => console.<span class="fn">warn</span>(err),
});

gate.<span class="fn">verify</span>();</code></pre>
      </div>
    </section>

    <section class="container cta">
      <div>
        <h2>지금 바로 데모로 느껴보세요</h2>
        <p>이 페이지의 스코어링은 브라우저 휴리스틱 데모입니다. 프로덕션에서는 서버 ML 파이프라인과 결합됩니다.</p>
      </div>
      <a class="btn btn-primary" href="#demo">데모로 이동</a>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-row">
      <div>© ${new Date().getFullYear()} PlayProof · Service demo page</div>
      <div>*공개 벤치마크/해커톤 결과 기준의 마케팅 수치 · 데모 구현과는 별개</div>
    </div>
  </footer>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas")!;
const spark = document.querySelector<HTMLCanvasElement>("#speed-spark")!;
const startBtn = document.querySelector<HTMLButtonElement>("#start-demo")!;
const resetBtn = document.querySelector<HTMLButtonElement>("#reset-demo")!;
const timerEl = document.querySelector<HTMLElement>("#demo-timer")!;
const hitEl = document.querySelector<HTMLElement>("#hit-count")!;
const verdictEl = document.querySelector<HTMLElement>("#verdict")!;

const els = {
  score: document.querySelector("#m-score")!,
  samples: document.querySelector("#m-samples")!,
  speed: document.querySelector("#m-speed")!,
  jerk: document.querySelector("#m-jerk")!,
  eff: document.querySelector("#m-eff")!,
  jitter: document.querySelector("#m-jitter")!,
};

function setVerdict(state: string, title: string, body: string): void {
  verdictEl.dataset.state = state;
  verdictEl.innerHTML = `<h4>${title}</h4><p>${body}</p>`;
}

function renderMetrics(snap: TelemetrySnapshot): void {
  els.score.textContent = snap.samples < 4 ? "—" : String(snap.humanScore);
  els.samples.textContent = String(snap.samples);
  els.speed.textContent = snap.avgSpeed.toFixed(3);
  els.jerk.textContent = (snap.jerk * 1000).toFixed(2);
  els.eff.textContent = `${Math.round(snap.pathEfficiency * 100)}%`;
  els.jitter.textContent = snap.jitter.toFixed(3);
}

function drawSparkline(values: number[]): void {
  const ctx = spark.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = spark.clientWidth || 360;
  const h = 72;
  spark.width = Math.floor(w * dpr);
  spark.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = "rgba(148,163,184,0.35)";
  ctx.font = "12px IBM Plex Mono, monospace";
  ctx.fillText("pointer speed", 10, 16);

  if (values.length < 2) return;
  const max = Math.max(...values, 0.05);
  ctx.beginPath();
  values.forEach((v, i) => {
    const x = (i / (values.length - 1)) * (w - 16) + 8;
    const y = h - 10 - (v / max) * (h - 28);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#58f0c8";
  ctx.lineWidth = 2;
  ctx.stroke();
}

const emptySnap = (): TelemetrySnapshot => ({
  samples: 0,
  durationMs: 0,
  avgSpeed: 0,
  avgAccel: 0,
  jerk: 0,
  pathEfficiency: 0,
  jitter: 0,
  humanScore: 0,
  label: "unknown",
});

const demo = new BubbleDemo(canvas, {
  onTick: (snap, hits, remainingMs) => {
    renderMetrics(snap);
    hitEl.textContent = `${hits} / ${TARGET_HITS} pops`;
    timerEl.textContent = `${(remainingMs / 1000).toFixed(1)}s`;
    setVerdict(
      "running",
      "Analyzing motion…",
      `현재 추정 점수 ${snap.humanScore}. 자연스러운 미세 보정이 점수에 도움이 됩니다.`,
    );
    drawSparkline(demo.getSpeedSeries());
  },
  onComplete: (snap, hits) => {
    renderMetrics(snap);
    hitEl.textContent = `${hits} / ${TARGET_HITS} pops`;
    timerEl.textContent = "done";
    startBtn.disabled = false;
    drawSparkline(demo.getSpeedSeries());

    if (hits < TARGET_HITS) {
      setVerdict("bot", "Timed out", "목표 버블을 시간 내에 모두 터트리지 못했습니다. 다시 시도해 보세요.");
      return;
    }

    if (snap.label === "human") {
      setVerdict(
        "human",
        `Human verified · ${snap.humanScore}`,
        "움직임 패턴이 사람답습니다. 프로덕션이라면 여기서 서명 토큰을 발급합니다.",
      );
    } else if (snap.label === "bot") {
      setVerdict(
        "bot",
        `Suspicious · ${snap.humanScore}`,
        "지나치게 직선적이거나 균일한 궤적입니다. 봇으로 분류될 수 있습니다.",
      );
    } else {
      setVerdict(
        "running",
        `Inconclusive · ${snap.humanScore}`,
        "신호가 충분하지 않거나 애매합니다. 한 번 더 자연스럽게 플레이해 보세요.",
      );
    }
  },
});

function resetUi(): void {
  startBtn.disabled = false;
  timerEl.textContent = "ready";
  hitEl.textContent = `0 / ${TARGET_HITS} pops`;
  renderMetrics(emptySnap());
  setVerdict("idle", "Waiting", "데모를 시작하면 실시간으로 휴먼 스코어가 갱신됩니다.");
  drawSparkline([]);
  demo.resize();
}

startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  setVerdict("running", "Session started", "버블을 클릭/탭해서 터트리세요.");
  timerEl.textContent = "12.0s";
  demo.start();
});

resetBtn.addEventListener("click", () => {
  demo.stop();
  resetUi();
});

window.addEventListener("resize", () => {
  demo.resize();
  drawSparkline(demo.getSpeedSeries());
});

demo.resize();
drawSparkline([]);

window.__playproofDemo = demo;
