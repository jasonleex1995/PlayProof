import { formatKRW, missions } from "../../data/mock";
import { bindShellActions, shell } from "../shell";
import { navigate } from "../../router";

export function renderTesterMission(root: HTMLElement, id: string): void {
  const mission = missions.find((m) => m.id === id);
  if (!mission) {
    root.innerHTML = `<div class="page"><p>미션 없음</p></div>`;
    return;
  }

  root.innerHTML = shell({
    role: "tester",
    active: "home",
    body: `
      <div class="page-header">
        <div>
          <div class="badge brand">${mission.gameTitle}</div>
          <h1 style="margin-top:0.45rem;">${mission.title}</h1>
          <p>${mission.segment} · 마감 ${mission.deadline}</p>
        </div>
        <button class="btn btn-secondary" type="button" id="back">보드로</button>
      </div>
      <div class="split">
        <div class="stack">
          <div class="card">
            <h3>미션 브리프</h3>
            <p style="margin-top:0.5rem;color:var(--ink);">${mission.brief}</p>
            <p class="help" style="margin-top:0.7rem;">화면 녹화본을 업로드하면 운영 검수 후 리워드가 지급됩니다. 데모에서는 파일 전송 없이 제출만 시뮬레이션합니다.</p>
          </div>
          <form class="card form" id="submit-form">
            <div class="field">
              <label for="file">플레이 영상</label>
              <input id="file" name="file" type="file" accept="video/*" />
            </div>
            <div class="field">
              <label for="note">메모 (선택)</label>
              <textarea id="note" name="note" placeholder="예: 상점 UI를 찾기 어려웠음"></textarea>
            </div>
            <button class="btn btn-primary" type="submit">데모 제출</button>
          </form>
        </div>
        <aside class="stack">
          <div class="card stat">
            <strong>${formatKRW(mission.reward)}</strong>
            <span>완료 시 리워드</span>
          </div>
          <div class="card">
            <h3>조건</h3>
            <p style="margin-top:0.5rem;">약 ${mission.minutes}분 · 잔여 ${mission.slotsLeft}석</p>
            <div style="display:flex;gap:0.35rem;flex-wrap:wrap;margin-top:0.7rem;">
              ${mission.tags.map((t) => `<span class="badge">${t}</span>`).join("")}
            </div>
          </div>
        </aside>
      </div>
    `,
  });

  bindShellActions(root);
  root.querySelector("#back")?.addEventListener("click", () =>
    navigate({ name: "tester-home" }),
  );
  root.querySelector("#submit-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(`데모 제출 완료\n\n미션: ${mission.title}\n검수 후 ${formatKRW(mission.reward)} 적립 예정`);
    navigate({ name: "tester-home" });
  });
}
