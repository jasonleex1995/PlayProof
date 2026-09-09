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
          <p>기획 의도(가설)와 패키지를 선택하면 견적이 나오고, 접수 후 모집으로 이어집니다.</p>
        </div>
      </div>
      <div class="split request-layout" id="request-main">
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
            <label for="audience">타겟 유저</label>
            <input id="audience" name="audience" value="20~30대 남성" required />
          </div>
          <div class="field">
            <label for="intent">기획 의도 / 가설</label>
            <textarea id="intent" name="intent" required>패턴을 모르면 클리어 불가. 약 3회 시도에서 패턴 인지, 10회 이내 클리어.</textarea>
          </div>
          <div class="request-actions">
            <button class="btn btn-primary" type="submit">의뢰 접수하기</button>
            <button class="btn btn-secondary" type="button" id="back">취소</button>
          </div>
        </form>
        <aside class="card request-summary">
          <h3>견적 미리보기</h3>
          <div class="quote-box" id="quote" style="margin-top:0.85rem;">
            <div>패키지: —</div>
            <div class="total">합계: —</div>
          </div>
          <div class="request-summary-divider"></div>
          <h3>납품 포함</h3>
          <ul class="request-deliverables">
            <li>의도 대비 <strong>정량</strong> 레포트</li>
            <li>테스터 <strong>정성</strong> 피드백 · 개선점</li>
            <li>플레이 영상 <strong>원본</strong></li>
          </ul>
          <p class="help" style="margin-top:0.9rem;">
            테스터 리워드·정산은 PlayProof가 운영합니다. 스튜디오에는 패키지 합계만 청구됩니다.
          </p>
        </aside>
      </div>
    `,
  });

  bindShellActions(root);
  const quoteEl = root.querySelector("#quote")!;
  const packageNote = root.querySelector("#package-note")!;
  const packageSelect = root.querySelector<HTMLSelectElement>("#package")!;

  const currentPack = () => PACKAGES.find((p) => p.id === packageSelect.value) ?? PACKAGES[0];

  const refreshQuote = () => {
    const pack = currentPack();
    packageNote.textContent = pack.note;
    quoteEl.innerHTML = `
      <div>${pack.label}</div>
      <div class="total">합계: ${formatKRW(pack.total)}</div>
    `;
  };

  packageSelect.addEventListener("change", refreshQuote);
  refreshQuote();

  root.querySelector("#back")?.addEventListener("click", () => navigate({ name: "dev-home" }));
  root.querySelector("#new-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const pack = currentPack();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const title = String(data.get("title") || "");
    const game = String(data.get("game") || "");
    sessionStorage.setItem(
      "playproof_last_quote",
      JSON.stringify({ total: pack.total, packageId: pack.id, title, game, at: Date.now() }),
    );

    const main = root.querySelector("#request-main");
    if (!main) return;
    main.innerHTML = `
      <div class="card request-success">
        <div class="badge ok">접수 완료</div>
        <h2>의뢰가 접수되었습니다!</h2>
        <p>
          <strong>${game}</strong> · ${title}<br />
          패키지 합계 <strong>${formatKRW(pack.total)}</strong>
        </p>
        <p class="help" style="margin-top:0.85rem;">
          PlayProof가 일반인 테스터 모집 공고를 게시합니다. 데모에서는 바로 공고를 확인할 수 있습니다.
        </p>
        <div class="request-actions" style="margin-top:1.25rem;">
          <button class="btn btn-primary" type="button" id="go-postings">모집 공고 보기</button>
          <button class="btn btn-secondary" type="button" id="go-posting-detail">이번 공고 상세</button>
          <button class="btn btn-ghost" type="button" id="go-dashboard">의뢰 대시보드</button>
        </div>
      </div>
    `;
    root.querySelector("#go-postings")?.addEventListener("click", () =>
      navigate({ name: "postings" }),
    );
    root.querySelector("#go-posting-detail")?.addEventListener("click", () =>
      navigate({ name: "dev-posting", id: "req_demo_new" }),
    );
    root.querySelector("#go-dashboard")?.addEventListener("click", () =>
      navigate({ name: "dev-home" }),
    );
  });
}
