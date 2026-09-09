import {
  applyStatusLabel,
  formatKRW,
  getMissionApplyStatus,
  missions,
  setMissionApplyStatus,
} from "../../data/mock";
import { bindShellActions, shell } from "../shell";
import { navigate } from "../../router";

const DEFAULT_FEEDBACK =
  "롤만 해봐서 그런지, 보스가 패턴으로 움직이는지 잘 몰랐어요. 몇 번 죽어도 이유가 안 보였고 그냥 운으로 피한 느낌이었습니다.";
const DEFAULT_IMPROVEMENT =
  "처음 죽었을 때 어디를 노리면 되는지 더 쉽게 보이면 좋겠어요. 표시나 이펙트가 확실하면 일반인도 따라가기 쉬울 것 같습니다.";

export function renderTesterMission(root: HTMLElement, id: string): void {
  const mission = missions.find((m) => m.id === id);
  if (!mission) {
    root.innerHTML = `<div class="page"><p>미션 없음</p></div>`;
    return;
  }

  const paint = () => {
    const status = getMissionApplyStatus(mission.id);
    const canSubmit = status === "selected" || status === "submitted";
    const statusBadge =
      status === "selected"
        ? `<span class="badge ok">${applyStatusLabel(status)}</span>`
        : status === "applied"
          ? `<span class="badge warn">${applyStatusLabel(status)}</span>`
          : status === "submitted"
            ? `<span class="badge brand">${applyStatusLabel(status)}</span>`
            : `<span class="badge">${applyStatusLabel(status)}</span>`;

    root.innerHTML = shell({
      role: "tester",
      active: "home",
      body: `
        <div class="page-header">
          <div>
            <div class="badge brand">${mission.gameTitle}</div>
            <h1 style="margin-top:0.45rem;">${mission.title}</h1>
            <p>${mission.segment} · 마감 ${mission.deadline} · ${statusBadge}</p>
          </div>
          <button class="btn btn-secondary" type="button" id="back">보드로</button>
        </div>
        <div class="split mission-layout">
          <div class="stack">
            <div class="card">
              <h3>미션 브리프</h3>
              <p style="margin-top:0.5rem;color:var(--ink);">${mission.brief}</p>
              <p class="help" style="margin-top:0.7rem;">
                지원 → 당선 후에만 영상·정성 피드백을 제출할 수 있습니다.
                데모에서는 지원 시 즉시 당선 처리됩니다.
              </p>
            </div>

            ${
              status === "open"
                ? `
              <div class="card">
                <h3>이 공고에 지원하기</h3>
                <p style="margin-top:0.45rem;">일반 플레이어 기준으로 매칭됩니다. 공략 숙련 패널이 아닙니다.</p>
                <button class="btn btn-primary" type="button" id="apply-btn" style="margin-top:0.9rem;">
                  지원하기 (데모: 즉시 당선)
                </button>
              </div>`
                : ""
            }

            ${
              status === "applied"
                ? `
              <div class="card">
                <h3>지원이 접수되었습니다</h3>
                <p style="margin-top:0.45rem;">운영 검토 후 당선 여부를 알려 드립니다.</p>
                <button class="btn btn-primary" type="button" id="force-select" style="margin-top:0.9rem;">
                  데모: 당선 처리하기
                </button>
              </div>`
                : ""
            }

            ${
              canSubmit
                ? `
              <form class="card form" id="submit-form">
                <h3 style="margin:0;">${status === "submitted" ? "제출 완료 · 다시 제출" : "당선 미션 제출"}</h3>
                <div class="field" style="margin-top:0.85rem;">
                  <label for="file">플레이 영상 *</label>
                  <input id="file" name="file" type="file" accept="video/*" />
                  <div class="help" id="file-help">데모 기본 영상: boss-pattern-20min.mp4 (실제 전송 없음)</div>
                </div>
                <div class="field">
                  <label for="feedback">정성 피드백 *</label>
                  <textarea id="feedback" name="feedback" required rows="4">${DEFAULT_FEEDBACK}</textarea>
                </div>
                <div class="field">
                  <label for="improvement">개선점 *</label>
                  <textarea id="improvement" name="improvement" required rows="3">${DEFAULT_IMPROVEMENT}</textarea>
                </div>
                <button class="btn btn-primary" type="submit">제출하기</button>
              </form>`
                : ""
            }
          </div>
          <aside class="mission-aside">
            <div class="mission-aside-card">
              <strong>${formatKRW(mission.reward)}</strong>
              <span>완료 시 리워드</span>
            </div>
            <div class="mission-aside-card">
              <h3>조건</h3>
              <p>약 ${mission.minutes}분 · 잔여 ${mission.slotsLeft}석</p>
              <div class="mission-aside-tags">
                ${mission.tags.map((t) => `<span class="badge">${t}</span>`).join("")}
              </div>
            </div>
            <div class="mission-aside-card">
              <h3>진행 상태</h3>
              <ol class="demo-steps">
                <li class="${status !== "open" ? "done" : ""}">지원</li>
                <li class="${status === "selected" || status === "submitted" ? "done" : ""}">당선</li>
                <li class="${status === "submitted" ? "done" : ""}">영상·정성 제출</li>
              </ol>
            </div>
          </aside>
        </div>
      `,
    });

    bindShellActions(root);
    const fileInput = root.querySelector<HTMLInputElement>("#file");
    if (fileInput) {
      try {
        const demo = new File(
          ["PlayProof demo recording placeholder"],
          "boss-pattern-20min.mp4",
          { type: "video/mp4" },
        );
        const transfer = new DataTransfer();
        transfer.items.add(demo);
        fileInput.files = transfer.files;
      } catch {
        /* browsers may block programmatic file assignment */
      }
    }
    root.querySelector("#back")?.addEventListener("click", () =>
      navigate({ name: "tester-home" }),
    );
    root.querySelector("#apply-btn")?.addEventListener("click", () => {
      setMissionApplyStatus(mission.id, "selected");
      alert(
        `지원이 접수되었습니다.\n\n데모에서는 즉시 당선 처리됩니다.\n이제 영상과 정성 피드백을 제출할 수 있습니다.`,
      );
      paint();
    });
    root.querySelector("#force-select")?.addEventListener("click", () => {
      setMissionApplyStatus(mission.id, "selected");
      paint();
    });
    root.querySelector("#submit-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(e.target as HTMLFormElement);
      const feedback = String(data.get("feedback") || "").trim();
      const improvement = String(data.get("improvement") || "").trim();
      if (!feedback || !improvement) {
        alert("정성 피드백과 개선점을 모두 작성해 주세요.");
        return;
      }
      setMissionApplyStatus(mission.id, "submitted");
      sessionStorage.setItem(
        "playproof_last_submission",
        JSON.stringify({
          missionId: mission.id,
          feedback,
          improvement,
          at: new Date().toISOString(),
        }),
      );
      alert(
        `제출 완료\n\n미션: ${mission.title}\n검수 후 ${formatKRW(mission.reward)} 적립 예정`,
      );
      navigate({ name: "tester-home" });
    });
  };

  paint();
}
