import { estimateQuote, formatKRW } from "../../data/mock";
import { bindShellActions, shell } from "../shell";
import { navigate } from "../../router";

export function renderDevNew(root: HTMLElement): void {
  root.innerHTML = shell({
    role: "developer",
    active: "new",
    body: `
      <div class="page-header">
        <div>
          <h1>새 의뢰</h1>
          <p>테스트할 구간과 기획 의도(가설)를 적으면 견적이 계산됩니다.</p>
        </div>
      </div>
      <div class="split">
        <form class="card form" id="new-form">
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
            <input id="segment" name="segment" value="Chapter 2 Boss (15분 캡)" required />
            <div class="help">전체 게임이 아니라 검증하고 싶은 핵심 구간만 지정하세요.</div>
          </div>
          <div class="field">
            <label for="audience">타겟 유저</label>
            <input id="audience" name="audience" value="20–30대 남성 · 액션 경험자" required />
          </div>
          <div class="field">
            <label for="intent">기획 의도 / 가설</label>
            <textarea id="intent" name="intent" required>패턴을 모르면 클리어 불가. 약 3회 시도에서 패턴 인지, 10회 이내 클리어.</textarea>
          </div>
          <div class="grid-2">
            <div class="field">
              <label for="testers">테스터 수</label>
              <input id="testers" name="testers" type="number" min="5" max="200" value="30" />
            </div>
            <div class="field">
              <label for="minutes">인당 시간(분)</label>
              <input id="minutes" name="minutes" type="number" min="5" max="60" value="15" />
            </div>
            <div class="field">
              <label for="reward">인당 리워드(원)</label>
              <input id="reward" name="reward" type="number" min="1000" step="100" value="3000" />
            </div>
            <div class="field">
              <label for="reportRate">레포트 요율</label>
              <select id="reportRate" name="reportRate">
                <option value="0.1" selected>테스트비의 10%</option>
                <option value="0.15">테스트비의 15%</option>
                <option value="0">레포트 없이 영상만</option>
              </select>
            </div>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn btn-primary" type="submit">데모: 의뢰 접수 시뮬레이션</button>
            <button class="btn btn-secondary" type="button" id="back">취소</button>
          </div>
        </form>
        <aside class="stack">
          <div class="card">
            <h3>견적 미리보기</h3>
            <p class="help" style="margin-bottom:0.8rem;">테스터 리워드 + 정량 레포트 요금</p>
            <div class="quote-box" id="quote">
              <div>테스터 예산: —</div>
              <div>영상 분석 레포트: —</div>
              <div class="total">합계: —</div>
            </div>
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

  const refreshQuote = () => {
    const testers = Number(new FormData(form).get("testers") || 0);
    const reward = Number(new FormData(form).get("reward") || 0);
    const rate = Number(new FormData(form).get("reportRate") || 0);
    const q = estimateQuote(testers, reward, rate);
    quoteEl.innerHTML = `
      <div>테스터 예산: ${formatKRW(q.testerBudget)}</div>
      <div>영상 분석 레포트: ${formatKRW(q.reportFee)}</div>
      <div class="total">합계: ${formatKRW(q.total)}</div>
    `;
  };
  form.addEventListener("input", refreshQuote);
  refreshQuote();

  root.querySelector("#back")?.addEventListener("click", () => navigate({ name: "dev-home" }));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = estimateQuote(
      Number(new FormData(form).get("testers") || 0),
      Number(new FormData(form).get("reward") || 0),
      Number(new FormData(form).get("reportRate") || 0),
    );
    alert(
      `데모 접수 완료\n\n합계 ${formatKRW(q.total)}\n실제 환경에서는 결제 후 모집 공고가 게시됩니다.`,
    );
    navigate({ name: "dev-home" });
  });
}
