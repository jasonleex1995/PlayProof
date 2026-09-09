import { currentUser, formatKRW, submissions } from "../../data/mock";
import { bindShellActions, shell } from "../shell";

export function renderTesterRewards(root: HTMLElement): void {
  const pending = submissions
    .filter((s) => s.status === "pending_review")
    .reduce((a, s) => a + s.reward, 0);
  const earned = submissions
    .filter((s) => s.status === "accepted")
    .reduce((a, s) => a + s.reward, 0);

  root.innerHTML = shell({
    role: "tester",
    active: "rewards",
    body: `
      <div class="page-header">
        <div>
          <h1>리워드 · 마일리지</h1>
          <p>${currentUser.tester.name}님의 적립·교환 현황 (데모)</p>
        </div>
      </div>
      <div class="grid-3" style="margin-bottom:1rem;">
        <div class="card stat"><strong>${formatKRW(currentUser.tester.mileage)}</strong><span>사용 가능 마일리지</span></div>
        <div class="card stat"><strong>${formatKRW(earned)}</strong><span>수락된 미션 합계</span></div>
        <div class="card stat"><strong>${formatKRW(pending)}</strong><span>검수 중</span></div>
      </div>
      <div class="split">
        <div class="card">
          <h3>기프티콘 교환 (데모)</h3>
          <p style="margin-top:0.45rem;">마일리지를 모아 교환할 수 있습니다. 실제 결제·발송은 연결되지 않습니다.</p>
          <div class="grid-2" style="margin-top:0.9rem;">
            <button class="btn btn-secondary" type="button" data-gift="5000">커피 5,000원권</button>
            <button class="btn btn-secondary" type="button" data-gift="10000">편의점 10,000원권</button>
          </div>
        </div>
        <div class="card">
          <h3>적립 히스토리</h3>
          <ul style="margin:0.7rem 0 0;padding-left:1.1rem;color:var(--muted);">
            ${submissions
              .map(
                (s) =>
                  `<li style="margin-bottom:0.4rem;">${s.submittedAt} · ${s.title} · ${formatKRW(s.reward)} (${s.status})</li>`,
              )
              .join("")}
          </ul>
        </div>
      </div>
    `,
  });

  bindShellActions(root);
  root.querySelectorAll<HTMLButtonElement>("[data-gift]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const amount = Number(btn.dataset.gift);
      alert(`데모 교환 요청: ${formatKRW(amount)} 기프티콘\n(실제 차감·발송 없음)`);
    });
  });
}
