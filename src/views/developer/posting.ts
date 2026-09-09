import {
  estimateQuote,
  formatKRW,
  requests,
  statusLabel,
} from "../../data/mock";
import { bindShellActions, shell } from "../shell";
import { navigate } from "../../router";

export function renderDevPosting(root: HTMLElement, id: string): void {
  const req = requests.find((r) => r.id === id) ?? requests.find((r) => r.id === "req_demo_new");
  if (!req) {
    root.innerHTML = `<div class="page"><p>공고를 찾을 수 없습니다.</p></div>`;
    return;
  }

  const quote = estimateQuote(req.testerCount, req.rewardPerTester, req.reportFeeRate);

  root.innerHTML = shell({
    role: "developer",
    active: "home",
    body: `
      <div class="page-header">
        <div>
          <div class="badge ok">모집 공고 게시됨 · Demo</div>
          <h1 style="margin-top:0.45rem;">테스터 모집 공고</h1>
          <p>의뢰가 접수되면 PlayProof가 일반인 테스터 대상으로 공고를 올립니다.</p>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <a class="btn btn-secondary" href="#/tester">테스터 보드에서 보기</a>
          <button class="btn btn-primary" type="button" id="to-request">의뢰 상세로</button>
        </div>
      </div>

      <div class="posting-hero card">
        <div class="badge brand">OPEN · 일반인 테스터</div>
        <h2 style="margin:0.55rem 0 0.35rem;letter-spacing:-0.03em;">${req.title}</h2>
        <p class="muted" style="margin:0;">${req.gameTitle} · ${req.segment}</p>
        <p style="margin:1rem 0 0;color:var(--ink);font-size:1.05rem;">
          ${req.postingBlurb ?? req.intentSummary}
        </p>
        <div class="posting-meta">
          <div><strong>${req.testerCount}명</strong><span>모집 인원</span></div>
          <div><strong>${req.minutesPerTester}분</strong><span>인당 플레이</span></div>
          <div><strong>${req.packageLabel ?? formatKRW(quote.total)}</strong><span>패키지 견적</span></div>
          <div><strong>일반인</strong><span>테스터 유형</span></div>
        </div>
      </div>

      <div class="split" style="margin-top:0.85rem;">
        <div class="stack">
          <div class="card">
            <h3>공고에 노출되는 기획 의도</h3>
            <p style="margin-top:0.45rem;color:var(--ink);">${req.intentSummary}</p>
            <p class="help" style="margin-top:0.7rem;">
              테스터에게는 스포일러를 최소화한 미션 브리프만 보여 주고,
              가설 수치(예: 3회 인지)는 운영·레포트 단계에서 사용합니다.
            </p>
          </div>
          <div class="card">
            <h3>모집 조건</h3>
            <p style="margin-top:0.5rem;"><strong>타겟</strong><br/>${req.targetAudience}</p>
            <p style="margin-top:0.7rem;"><strong>진행</strong><br/>지원 → 당선 → 영상·정성 피드백 제출 → 검수</p>
          </div>
        </div>
        <aside class="stack">
          <div class="card">
            <h3>데모 다음 단계</h3>
            <ol class="demo-steps">
              <li>테스터가 공고를 보고 <strong>지원</strong></li>
              <li><strong>당선</strong> 후 플레이 영상 + 개선점 제출</li>
              <li>정량 레포트 · 정성 · 원본 영상 납품</li>
            </ol>
            <a class="btn btn-primary" href="#/tester" style="margin-top:0.9rem;display:inline-flex;">
              테스터로 전환해 지원하기
            </a>
          </div>
          <div class="card">
            <h3>현재 상태</h3>
            <p style="margin-top:0.45rem;"><span class="badge brand">${statusLabel(req.status)}</span></p>
            <p class="help" style="margin-top:0.55rem;">실제 서비스에서는 결제 확인 후 자동 게시됩니다.</p>
          </div>
        </aside>
      </div>
    `,
  });

  bindShellActions(root);
  root.querySelector("#to-request")?.addEventListener("click", () =>
    navigate({ name: "dev-request", id: req.id }),
  );
}
