import { formatKRW, PACKAGES } from "../../data/mock";
import { bindShellActions, shell } from "../shell";
import { navigate } from "../../router";

export function renderDevNew(root: HTMLElement): void {
  const starter = PACKAGES[0];

  root.innerHTML = shell({
    role: "developer",
    active: "new",
    body: `
      <div class="page-header">
        <div>
          <h1>새 의뢰</h1>
          <p>테스트할 구간과 기획 의도(가설)를 남기면 패키지 견적이 나오고, 접수 후 모집으로 이어집니다.</p>
        </div>
      </div>
      <div class="split">
        <form class="card form" id="new-form">
          <div class="field">
            <label for="package">패키지</label>
            <select id="package" name="package">
              ${PACKAGES.map(
                (p, i) =>
                  `<option value="${p.id}" ${i === 0 ? "selected" : ""}>${p.label} · ${formatKRW(p.total)}</option>`,
              ).join("")}
            </select>
            <div class="help" id="package-note">${starter.note}</div>
          </div>
          <div class="field">
            <label for="game">게임 타이틀</label>
            <input id="game" name="game" value="Ash Circuit" required />
          </div>
          <div class="field">
            <label for="title">의뢰 제목</label>
            <input id="title" name="title" value="2차 보스 — 패턴 학습 곡선 재검증" required />
          </div>
          <div class="field">
            <label for="segment">테스트 구간</label>
            <input id="segment" name="segment" value="Chapter 2 Boss (20분 캡)" required />
            <div class="help">전체 게임이 아니라 검증하고 싶은 핵심 구간만 지정하세요.</div>
          </div>
          <div class="field">
            <label for="audience">타겟 유저</label>
            <input id="audience" name="audience" value="20–30대 · 액션 경험 있는 일반 플레이어" required />
            <div class="help">숙련 FGT 패널이 아니라, 기획이 겨냥한 일반 유저에 가깝게 모집합니다.</div>
          </div>
          <div class="field">
            <label for="intent">기획 의도 / 가설</label>
            <textarea id="intent" name="intent" required>패턴을 모르면 클리어 불가. 약 3회 시도에서 패턴 인지, 10회 이내 클리어.</textarea>
          </div>
          <div class="grid-2">
            <div class="field">
              <label for="testers">테스터 수</label>
              <input id="testers" name="testers" type="number" min="5" max="200" value="${starter.testers}" readonly />
            </div>
            <div class="field">
              <label for="minutes">인당 시간(분)</label>
              <input id="minutes" name="minutes" type="number" min="5" max="120" value="${starter.minutes}" readonly />
            </div>
          </div>
          <p class="help">테스터 리워드·정산은 PlayProof가 운영에서 관리합니다. 스튜디오에는 패키지 합계만 청구됩니다.</p>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.35rem;">
            <button class="btn btn-primary" type="submit">의뢰 접수하기</button>
            <button class="btn btn-secondary" type="button" id="back">취소</button>
          </div>
        </form>
        <aside class="stack">
          <div class="card">
            <h3>견적 미리보기</h3>
            <p class="help" style="margin-bottom:0.8rem;">패키지 요금 (정량 레포트 · 정성 피드백 · 원본 영상 포함)</p>
            <div class="quote-box" id="quote">
              <div>규모: —</div>
              <div class="total">합계: —</div>
            </div>
          </div>
          <div class="card">
            <h3>납품 패키지</h3>
            <p>① 의도 대비 <strong>정량</strong> 레포트<br/>② 테스터 <strong>정성</strong> 피드백·개선점<br/>③ 플레이 영상 <strong>원본</strong></p>
          </div>
          <div class="card">
            <h3>측정 예시 지표</h3>
            <p>클리어율 · 시도 횟수 분포 · 패턴 인지 시점 · 이탈 지점. 의뢰 접수 후 운영이 가설을 지표로 구조화합니다.</p>
          </div>
        </aside>
      </div>
    `,
  });

  bindShellActions(root);
  const form = root.querySelector<HTMLFormElement>("#new-form")!;
  const quoteEl = root.querySelector("#quote")!;
  const packageNote = root.querySelector("#package-note")!;
  const packageSelect = root.querySelector<HTMLSelectElement>("#package")!;

  const currentPack = () => PACKAGES.find((p) => p.id === packageSelect.value) ?? PACKAGES[0];

  const applyPackage = (id: string) => {
    const pack = PACKAGES.find((p) => p.id === id) ?? PACKAGES[0];
    (form.elements.namedItem("testers") as HTMLInputElement).value = String(pack.testers);
    (form.elements.namedItem("minutes") as HTMLInputElement).value = String(pack.minutes);
    packageNote.textContent = pack.note;
    refreshQuote();
  };

  const refreshQuote = () => {
    const pack = currentPack();
    quoteEl.innerHTML = `
      <div>패키지: ${pack.label}</div>
      <div>규모: ${pack.testers}명 · ${pack.minutes}분</div>
      <div class="total">합계: ${formatKRW(pack.total)}</div>
    `;
  };

  packageSelect.addEventListener("change", () => applyPackage(packageSelect.value));
  refreshQuote();

  root.querySelector("#back")?.addEventListener("click", () => navigate({ name: "dev-home" }));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const pack = currentPack();
    sessionStorage.setItem(
      "playproof_last_quote",
      JSON.stringify({ total: pack.total, packageId: pack.id, at: Date.now() }),
    );
    navigate({ name: "dev-posting", id: "req_demo_new" });
  });
}
