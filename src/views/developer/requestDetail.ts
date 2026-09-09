import { estimateQuote, formatKRW, requests, statusLabel } from "../../data/mock";
import { bindShellActions, shell } from "../shell";
import { navigate } from "../../router";

export function renderDevRequest(root: HTMLElement, id: string): void {
  const req = requests.find((r) => r.id === id);
  if (!req) {
    root.innerHTML = `<div class="page"><p>의뢰를 찾을 수 없습니다.</p><a href="#/dev">돌아가기</a></div>`;
    return;
  }
  const quote = estimateQuote(req.testerCount, req.rewardPerTester, req.reportFeeRate);
  const showPosting = req.status === "recruiting" || req.status === "in_progress";

  root.innerHTML = shell({
    role: "developer",
    active: "home",
    body: `
      <div class="page-header">
        <div>
          <div class="badge brand">${statusLabel(req.status)}</div>
          <h1 style="margin-top:0.45rem;">${req.title}</h1>
          <p>${req.gameTitle} · ${req.segment}</p>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          ${
            showPosting
              ? `<a class="btn btn-secondary" href="#/dev/posting/${req.id}">모집 공고 보기</a>`
              : ""
          }
          ${
            req.status === "delivered" || req.status === "analyzing"
              ? `<a class="btn btn-primary" href="#/dev/report/${req.id}">납품 패키지 보기</a>`
              : ""
          }
          <button class="btn btn-secondary" type="button" id="back">목록</button>
        </div>
      </div>
      <div class="split">
        <div class="stack">
          <div class="card">
            <h3>기획 의도</h3>
            <p style="margin-top:0.45rem;color:var(--ink);">${req.intentSummary}</p>
          </div>
          <div class="card">
            <h3>검증 지표 (예정/진행)</h3>
            ${req.metrics
              .map(
                (m) => `
              <div class="metric-row">
                <div>
                  <strong>${m.label}</strong>
                  <div class="muted" style="font-size:0.85rem;">가설: ${m.hypothesis}</div>
                </div>
                <div><div class="muted" style="font-size:0.78rem;">목표</div>${m.target}</div>
                <div><div class="muted" style="font-size:0.78rem;">실측</div>${m.actual}</div>
                <div class="pass-pill">${
                  m.pass === true
                    ? '<span class="badge ok">충족</span>'
                    : m.pass === false
                      ? '<span class="badge danger">미충족</span>'
                      : '<span class="badge">대기</span>'
                }</div>
              </div>`,
              )
              .join("")}
          </div>
        </div>
        <aside class="stack">
          <div class="card">
            <h3>모집 조건</h3>
            <p style="margin-top:0.5rem;"><strong>타겟</strong><br/>${req.targetAudience}</p>
            <p style="margin-top:0.7rem;"><strong>규모</strong><br/>${req.testerCount}명 · 인당 ${req.minutesPerTester}분</p>
            <p style="margin-top:0.7rem;"><strong>인당 리워드</strong><br/>${formatKRW(req.rewardPerTester)}</p>
          </div>
          <div class="card">
            <h3>견적</h3>
            <div class="quote-box" style="margin-top:0.7rem;">
              <div>테스터 예산: ${formatKRW(quote.testerBudget)}</div>
              <div>레포트: ${formatKRW(quote.reportFee)}</div>
              <div class="total">합계: ${formatKRW(quote.total)}</div>
            </div>
            ${req.packageLabel ? `<p class="help" style="margin-top:0.55rem;">${req.packageLabel}</p>` : ""}
          </div>
          <div class="card">
            <h3>진행 타임라인</h3>
            <ol class="demo-steps" style="margin-top:0.55rem;">
              <li class="done">의뢰 접수</li>
              <li class="${req.status !== "draft" ? "done" : ""}">모집 공고</li>
              <li class="${["in_progress", "analyzing", "delivered"].includes(req.status) ? "done" : ""}">영상·정성 수집</li>
              <li class="${req.status === "delivered" ? "done" : ""}">정량·정성·원본 납품</li>
            </ol>
            <p class="help" style="margin-top:0.55rem;">현재 단계: <strong>${statusLabel(req.status)}</strong></p>
          </div>
        </aside>
      </div>
    `,
  });

  bindShellActions(root);
  root.querySelector("#back")?.addEventListener("click", () => navigate({ name: "dev-home" }));
}
