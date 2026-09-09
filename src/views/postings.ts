import { formatKRW, missions, requests } from "../data/mock";
import { navigate } from "../router";

/** Open recruitment cards for the public 모집 공고 board */
export function openPostings() {
  return missions
    .map((m) => {
      const req = requests.find((r) => r.id === m.requestId);
      return { mission: m, request: req };
    })
    .filter(({ request }) => {
      if (!request) return true;
      return request.status === "recruiting" || request.status === "in_progress";
    });
}

export function renderPostings(root: HTMLElement): void {
  const items = openPostings();

  root.innerHTML = `
    <div class="marketing">
      <header class="m-nav">
        <div class="m-nav-inner">
          <a class="m-logo" href="#/" aria-label="PlayProof home">
            <span class="m-logo-mark">P</span>
            PlayProof
          </a>
          <nav class="m-nav-links" aria-label="Primary">
            <button type="button" data-go="home-scroll" data-scroll="intent">의도 검증</button>
            <button type="button" data-go="home-scroll" data-scroll="how">이용 방법</button>
            <button type="button" class="is-active" data-go="postings">모집 공고</button>
            <button type="button" data-go="home-scroll" data-scroll="report">레포트</button>
          </nav>
          <div class="m-nav-actions">
            <button class="m-btn m-btn-text" type="button" data-go="tester">테스터 등록</button>
            <button class="m-btn m-btn-pill" type="button" data-go="request">의뢰하기</button>
          </div>
        </div>
      </header>

      <section class="m-band m-band-gray postings-hero">
        <div class="m-wrap" style="text-align:left;">
          <p class="m-eyebrow dark">Open calls</p>
          <h2 style="margin-top:0.45rem;">모집 공고</h2>
          <p class="m-lead" style="margin-left:0;text-align:left;">
            일반인 테스터를 모집 중인 구간 테스트입니다.<br />
            공고를 고르고 지원하면, 당선 후 플레이 영상과 피드백을 제출합니다.
          </p>
        </div>
      </section>

      <section class="m-band" style="padding-top:2rem;">
        <div class="m-wrap postings-grid">
          ${items
            .map(({ mission: m, request: req }) => {
              const audience = req?.targetAudience ?? "일반 플레이어";
              return `
              <article class="posting-card">
                <div class="posting-card-top">
                  <span class="m-pill">모집 중</span>
                  <strong class="mono">${formatKRW(m.reward)}</strong>
                </div>
                <div class="badge brand" style="margin-top:0.7rem;">${m.gameTitle}</div>
                <h3>${m.title}</h3>
                <p>${m.segment} · 약 ${m.minutes}분 · 잔여 ${m.slotsLeft}석</p>
                <p class="posting-audience">타겟: ${audience}</p>
                <div class="posting-tags">
                  ${m.tags.map((t) => `<span class="badge">${t}</span>`).join("")}
                </div>
                <button class="m-btn m-btn-dark" type="button" data-mission="${m.id}">지원하러 가기</button>
              </article>`;
            })
            .join("")}
        </div>
      </section>

      <footer class="m-footer">
        <div class="m-footer-inner">
          <span>Copyright © ${new Date().getFullYear()} PlayProof. Demo UI.</span>
          <span>Prove your Intent!</span>
        </div>
      </footer>
    </div>
  `;

  root.querySelectorAll<HTMLElement>("[data-go]").forEach((el) => {
    el.addEventListener("click", () => {
      const target = el.dataset.go;
      if (target === "request") navigate({ name: "dev-new" });
      else if (target === "tester") navigate({ name: "tester-register" });
      else if (target === "postings") navigate({ name: "postings" });
      else if (target === "home-scroll") {
        const id = el.dataset.scroll;
        navigate({ name: "home" });
        // scroll after home paints
        setTimeout(() => {
          document.getElementById(id || "")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
    });
  });

  root.querySelectorAll<HTMLElement>("[data-mission]").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.dataset.mission;
      if (!id) return;
      // Ensure tester profile exists for demo continuity
      if (!localStorage.getItem("playproof_tester")) {
        navigate({ name: "tester-register" });
        return;
      }
      navigate({ name: "tester-mission", id });
    });
  });
}
