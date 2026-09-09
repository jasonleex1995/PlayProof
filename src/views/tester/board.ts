import { formatKRW, missions, submissions, currentUser } from "../../data/mock";
import { bindShellActions, shell } from "../shell";
import { navigate } from "../../router";

function savedTesterName(): string {
  try {
    const raw = localStorage.getItem("playproof_tester");
    if (!raw) return currentUser.tester.name;
    const parsed = JSON.parse(raw) as { name?: string };
    return parsed.name || currentUser.tester.name;
  } catch {
    return currentUser.tester.name;
  }
}

export function renderTesterHome(root: HTMLElement): void {
  const name = savedTesterName();
  const cards = missions
    .map(
      (m) => `
      <article class="card" style="cursor:pointer;" data-id="${m.id}">
        <div style="display:flex;justify-content:space-between;gap:0.5rem;align-items:start;">
          <div>
            <div class="badge brand">${m.gameTitle}</div>
            <h3 style="margin-top:0.45rem;">${m.title}</h3>
          </div>
          <strong class="mono">${formatKRW(m.reward)}</strong>
        </div>
        <p style="margin-top:0.45rem;">${m.segment} · ${m.minutes}분 · 잔여 ${m.slotsLeft}석</p>
        <div style="display:flex;gap:0.35rem;flex-wrap:wrap;margin-top:0.7rem;">
          ${m.tags.map((t) => `<span class="badge">${t}</span>`).join("")}
        </div>
      </article>`,
    )
    .join("");

  root.innerHTML = shell({
    role: "tester",
    active: "home",
    body: `
      <div class="page-header">
        <div>
          <h1>미션 보드</h1>
          <p>${name}님, 모집 중인 구간 테스트에 참여하고 플레이 영상을 제출하세요.</p>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <a class="btn btn-secondary" href="#/tester/register">프로필 / 재신청</a>
          <a class="btn btn-secondary" href="#/tester/rewards">내 리워드</a>
        </div>
      </div>
      <div class="grid-2">${cards}</div>
      <div class="card" style="margin-top:1rem;">
        <h3>내 최근 제출</h3>
        <table class="table" style="margin-top:0.7rem;box-shadow:none;">
          <thead><tr><th>미션</th><th>제출일</th><th>상태</th><th>리워드</th></tr></thead>
          <tbody>
            ${submissions
              .map(
                (s) => `
              <tr>
                <td>${s.title}</td>
                <td>${s.submittedAt}</td>
                <td>${
                  s.status === "accepted"
                    ? '<span class="badge ok">수락</span>'
                    : s.status === "rejected"
                      ? '<span class="badge danger">반려</span>'
                      : '<span class="badge warn">검수 중</span>'
                }</td>
                <td class="mono">${formatKRW(s.reward)}</td>
              </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `,
  });

  bindShellActions(root);
  root.querySelectorAll<HTMLElement>("article[data-id]").forEach((el) => {
    el.addEventListener("click", () =>
      navigate({ name: "tester-mission", id: el.dataset.id! }),
    );
  });
}
