import {
  formatKRW,
  requests,
  statusLabel,
  estimateQuote,
  type PlayRequest,
} from "../../data/mock";
import { bindShellActions, shell } from "../shell";
import { navigate } from "../../router";

function statusBadge(req: PlayRequest): string {
  const label = statusLabel(req.status);
  if (req.status === "delivered") return `<span class="badge ok">${label}</span>`;
  if (req.status === "analyzing") return `<span class="badge warn">${label}</span>`;
  if (req.status === "recruiting") return `<span class="badge brand">${label}</span>`;
  return `<span class="badge">${label}</span>`;
}

export function renderDevHome(root: HTMLElement): void {
  const open = requests.filter((r) => r.status !== "delivered").length;
  const spend = requests.reduce((sum, r) => {
    const q = estimateQuote(r.testerCount, r.rewardPerTester, r.reportFeeRate);
    return sum + (r.status === "delivered" || r.status === "analyzing" ? q.total : 0);
  }, 0);

  const rows = requests
    .map((r) => {
      const quote = estimateQuote(r.testerCount, r.rewardPerTester, r.reportFeeRate);
      return `
        <tr class="clickable" data-id="${r.id}">
          <td>
            <strong>${r.title}</strong>
            <div class="muted" style="font-size:0.85rem;margin-top:0.2rem;">${r.gameTitle} · ${r.segment}</div>
          </td>
          <td>${statusBadge(r)}</td>
          <td>${r.testerCount}명 · ${r.minutesPerTester}분</td>
          <td class="mono">${formatKRW(quote.total)}</td>
          <td>${r.createdAt}</td>
        </tr>`;
    })
    .join("");

  root.innerHTML = shell({
    role: "developer",
    active: "home",
    body: `
      <div class="page-header">
        <div>
          <h1>의뢰 대시보드</h1>
          <p>구간 단위로 기획 의도를 검증합니다. 모집 → 수집 → 정량·정성·영상 납품까지 한곳에서 봅니다.</p>
        </div>
        <a class="btn btn-primary" href="#/dev/new">새 의뢰 만들기</a>
      </div>
      <div class="grid-3" style="margin-bottom:1rem;">
        <div class="card stat"><strong>${requests.length}</strong><span>전체 의뢰</span></div>
        <div class="card stat"><strong>${open}</strong><span>진행 중</span></div>
        <div class="card stat"><strong>${formatKRW(spend)}</strong><span>분석·납품 관련 누적 견적</span></div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>의뢰</th><th>상태</th><th>규모</th><th>견적</th><th>생성일</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="footer-note">납품 완료 의뢰는 행을 눌러 패키지(정량·정성·영상)로 이동합니다. 모집 중 의뢰는 상세·공고 화면으로 갑니다.</p>
    `,
  });

  bindShellActions(root);
  root.querySelectorAll<HTMLTableRowElement>("tr[data-id]").forEach((tr) => {
    tr.addEventListener("click", () => {
      const id = tr.dataset.id!;
      const req = requests.find((r) => r.id === id)!;
      if (req.status === "delivered") navigate({ name: "dev-report", id });
      else navigate({ name: "dev-request", id });
    });
  });
}
