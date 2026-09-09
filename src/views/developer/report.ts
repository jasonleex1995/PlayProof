import { avg, formatKRW, estimateQuote, requests } from "../../data/mock";
import { bindShellActions, shell } from "../shell";
import { navigate } from "../../router";

export function renderDevReport(root: HTMLElement, id: string): void {
  const req = requests.find((r) => r.id === id);
  if (!req) {
    root.innerHTML = `<div class="page"><p>레포트를 찾을 수 없습니다.</p></div>`;
    return;
  }

  const attempts = req.patternAwarenessAttempts ?? [];
  const meanAware = attempts.length ? avg(attempts) : null;
  const quote = estimateQuote(req.testerCount, req.rewardPerTester, req.reportFeeRate);
  const clearRate =
    req.clearCount != null ? ((req.clearCount / req.testerCount) * 100).toFixed(1) : "—";
  const qualitative = req.qualitative ?? [];

  root.innerHTML = shell({
    role: "developer",
    active: "home",
    body: `
      <div class="page-header">
        <div>
          <div class="badge ok">납품 패키지 · 정량 + 정성 + 원본</div>
          <h1 style="margin-top:0.45rem;">${req.title}</h1>
          <p>${req.gameTitle} · 샘플 n=${req.testerCount} · 인당 ${req.minutesPerTester}분 · ${req.packageLabel ?? "커스텀"}</p>
        </div>
        <button class="btn btn-secondary" type="button" id="back">의뢰로</button>
      </div>

      <div class="package-tabs" role="tablist">
        <button type="button" class="active" data-tab="quant">① 정량 레포트</button>
        <button type="button" data-tab="qual">② 정성 피드백</button>
        <button type="button" data-tab="video">③ 원본 영상</button>
      </div>

      <section class="tab-panel" id="panel-quant">
        <div class="grid-3" style="margin-bottom:1rem;">
          <div class="card stat"><strong>${clearRate}%</strong><span>클리어율 (${req.clearCount ?? "—"}/${req.testerCount})</span></div>
          <div class="card stat"><strong>${req.patternAwareCount ?? "—"}</strong><span>패턴 일관 회피 유저</span></div>
          <div class="card stat"><strong>${meanAware ? meanAware.toFixed(1) : "—"}</strong><span>평균 패턴 인지 시점(회)</span></div>
        </div>

        <div class="split">
          <div class="stack">
            <div class="card">
              <h3>기획 의도</h3>
              <p style="margin-top:0.45rem;color:var(--ink);">${req.intentSummary}</p>
            </div>
            <div class="card">
              <h3>가설 대비 결과</h3>
              ${req.metrics
                .map(
                  (m) => `
                <div class="metric-row">
                  <div>
                    <strong>${m.label}</strong>
                    <div class="muted" style="font-size:0.85rem;">${m.note ?? m.hypothesis}</div>
                  </div>
                  <div><div class="muted" style="font-size:0.78rem;">목표</div>${m.target}</div>
                  <div><div class="muted" style="font-size:0.78rem;">실측</div>${m.actual}</div>
                  <div>${
                    m.pass === true
                      ? '<span class="badge ok">충족</span>'
                      : m.pass === false
                        ? '<span class="badge danger">미충족</span>'
                        : '<span class="badge">참고</span>'
                  }</div>
                </div>`,
                )
                .join("")}
            </div>
            <div class="card">
              <h3>해석 요약</h3>
              <p style="margin-top:0.5rem;color:var(--ink);">
                ${req.minutesPerTester}분 제한에서 보스를 깬 유저는 ${req.testerCount}명 중 ${req.clearCount ?? 0}명입니다.
                패턴을 일관되게 활용한 유저는 ${req.patternAwareCount ?? 0}명이었고,
                이들의 인지 시점 분포는
                <span class="mono">[${attempts.join(", ")}]</span>
                로 평균 약 ${meanAware?.toFixed(1) ?? "—"}회입니다.
                기획 가정(약 3회 인지 / 10회 내 클리어) 대비 <strong>인지가 늦고 클리어율이 낮습니다.</strong>
                패턴 단서를 더 드러내거나 초반 난이도 완화를 권장합니다.
              </p>
            </div>
          </div>
          <aside class="stack">
            <div class="card">
              <h3>과금 내역</h3>
              <div class="quote-box" style="margin-top:0.7rem;">
                <div>테스터: ${formatKRW(quote.testerBudget)}</div>
                <div>분석 레포트: ${formatKRW(quote.reportFee)}</div>
                <div class="total">${formatKRW(quote.total)}</div>
              </div>
              <p class="help" style="margin-top:0.55rem;">발표 기준 스타터 패키지(20분·30명·15만)와 동일 구조입니다.</p>
            </div>
            <div class="card">
              <h3>다음 액션</h3>
              <p style="margin-top:0.45rem;">패턴 텔레그래프 강화 후 동일 구간으로 재의뢰하면 전/후 비교 레포트를 붙일 수 있습니다.</p>
              <a class="btn btn-primary" href="#/dev/new" style="margin-top:0.8rem;display:inline-flex;">재의뢰 작성</a>
            </div>
          </aside>
        </div>
      </section>

      <section class="tab-panel" id="panel-qual" hidden>
        <div class="card" style="margin-bottom:0.85rem;">
          <h3>정성 피드백 요약</h3>
          <p style="margin-top:0.45rem;color:var(--ink);">
            주산출물은 위 정량 지표입니다. 아래 문장은 해석·수정용 부속 자료로,
            “패턴 단서가 늦게 보인다 / 초반이 운에 가깝다”는 테마가 반복됩니다.
          </p>
        </div>
        <div class="stack">
          ${
            qualitative.length
              ? qualitative
                  .map(
                    (q) => `
            <article class="card qual-card ${q.sentiment}">
              <div style="display:flex;justify-content:space-between;gap:0.5rem;flex-wrap:wrap;">
                <strong>${q.testerAlias}</strong>
                <span class="badge ${
                  q.sentiment === "negative"
                    ? "danger"
                    : q.sentiment === "positive"
                      ? "ok"
                      : ""
                }">${
                  q.sentiment === "negative"
                    ? "개선 필요"
                    : q.sentiment === "positive"
                      ? "긍정"
                      : "중립"
                }</span>
              </div>
              <p style="margin-top:0.65rem;color:var(--ink);"><strong>피드백</strong> — ${q.feedback}</p>
              <p style="margin-top:0.45rem;"><strong>개선점</strong> — ${q.improvement}</p>
            </article>`,
                  )
                  .join("")
              : `<div class="card"><p>이 의뢰에는 아직 정성 샘플이 없습니다.</p></div>`
          }
        </div>
      </section>

      <section class="tab-panel" id="panel-video" hidden>
        <div class="split">
          <div class="card">
            <h3>원본 영상 패키지</h3>
            <p style="margin-top:0.45rem;">수락된 플레이 영상 ${req.testerCount}개 · 타임스탬프 메모 포함</p>
            <ul class="video-list">
              ${Array.from({ length: Math.min(6, req.testerCount) }, (_, i) => {
                const n = String(i + 1).padStart(2, "0");
                return `<li><span class="mono">PyreWarden_${n}.mp4</span><span class="muted">~${req.minutesPerTester}분 · 검수 통과</span></li>`;
              }).join("")}
              <li class="muted">… 외 ${Math.max(0, req.testerCount - 6)}개</li>
            </ul>
            <button class="btn btn-secondary" type="button" style="margin-top:0.8rem;" id="fake-download">데모: 다운로드 목록</button>
          </div>
          <aside class="card">
            <h3>제작사 확인 체크</h3>
            <label class="check-row"><input type="checkbox" checked disabled /> 정량 가설 대비 결과 확인</label>
            <label class="check-row"><input type="checkbox" checked disabled /> 정성 개선점 검토</label>
            <label class="check-row"><input type="checkbox" checked disabled /> 원본 영상 샘플 열람</label>
            <p class="help" style="margin-top:0.85rem;">데모에서는 납품 패키지를 제작사가 확인한 상태로 표시합니다.</p>
          </aside>
        </div>
      </section>
    `,
  });

  bindShellActions(root);
  root.querySelector("#back")?.addEventListener("click", () =>
    navigate({ name: "dev-request", id: req.id }),
  );
  root.querySelector("#fake-download")?.addEventListener("click", () => {
    alert("데모: 실제 영상 파일 대신 목록만 표시합니다.\n\nPyreWarden_01.mp4 … _30.mp4");
  });

  const tabs = root.querySelectorAll<HTMLButtonElement>(".package-tabs button");
  const panels: Record<string, HTMLElement | null> = {
    quant: root.querySelector("#panel-quant"),
    qual: root.querySelector("#panel-qual"),
    video: root.querySelector("#panel-video"),
  };
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab ?? "quant";
      tabs.forEach((b) => b.classList.toggle("active", b === btn));
      Object.entries(panels).forEach(([key, el]) => {
        if (!el) return;
        el.hidden = key !== tab;
      });
    });
  });
}
