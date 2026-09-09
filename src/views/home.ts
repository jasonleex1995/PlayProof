import { navigate } from "../router";

export function renderHome(root: HTMLElement): void {
  root.innerHTML = `
    <div class="marketing">
      <header class="m-nav">
        <div class="m-nav-inner">
          <a class="m-logo" href="#/" aria-label="PlayProof home">
            <span class="m-logo-mark">P</span>
            PlayProof
          </a>
          <nav class="m-nav-links" aria-label="Primary">
            <button type="button" data-scroll="intent">의도 검증</button>
            <button type="button" data-scroll="how">이용 방법</button>
            <button type="button" data-scroll="report">레포트</button>
          </nav>
          <div class="m-nav-actions">
            <button class="m-btn m-btn-text" type="button" data-go="tester">테스터 등록</button>
            <button class="m-btn m-btn-pill" type="button" data-go="request">의뢰하기</button>
          </div>
        </div>
      </header>

      <section class="m-hero">
        <p class="m-eyebrow">PlayProof · Unit Tests for Game Design</p>
        <h1>Prove your Intent!</h1>
        <p class="m-sub">
          게임의 핵심 구간이 기획한 대로 플레이되는지,<br />
          <strong style="color:#1d1d1f;font-weight:650;">일반인 테스터</strong>의 영상으로 정량 검증합니다.
        </p>
        <div class="m-hero-cta">
          <button class="m-btn m-btn-dark" type="button" data-go="request">의뢰하기</button>
          <button class="m-btn m-btn-light" type="button" data-go="tester">테스터 등록하기</button>
        </div>
        <div class="m-hero-stage">
          <p class="m-device-caption">의뢰가 끝나면 받는 <strong>결과 레포트</strong> 미리보기</p>
          <div class="m-device" aria-hidden="true">
            <div class="m-device-bar">
              <span></span><span></span><span></span>
              <em>PlayProof Report · 샘플</em>
            </div>
            <div class="m-device-body">
              <p class="m-device-case">예시) 1차 보스 — “3회면 패턴을 눈치챈다”</p>
              <div class="m-kpi">
                <div><b>6.7%</b><small>클리어율</small></div>
                <div><b>6.7회</b><small>평균 패턴 인지</small></div>
                <div><b>미충족</b><small>가설 대비</small></div>
              </div>
              <div class="m-bars">
                <i style="--h:28%"></i><i style="--h:44%"></i><i style="--h:62%"></i>
                <i style="--h:38%"></i><i style="--h:72%"></i><i style="--h:51%"></i>
              </div>
              <p class="m-device-note">가설: 3회 인지 · 10회 내 클리어 → <strong>미충족</strong></p>
            </div>
          </div>
          <p class="m-device-caption m-device-caption-sub">
            숫자로 “의도 달성 여부”를 보고, 아래에서 샘플 전문을 열 수 있습니다.
          </p>
        </div>
      </section>

      <section class="m-band m-band-gray" id="intent">
        <div class="m-wrap">
          <p class="m-eyebrow dark">Why PlayProof?</p>
          <h2>버그 QA도,<br />“재밌나요?”도 아닙니다.</h2>
          <p class="m-lead">
            PlayProof는 <em>기획 의도가 실제 플레이에서 달성됐는지</em>를 검증합니다.<br />
            기존 방식과 무엇이 다른지, 한눈에 비교해 보세요.
          </p>
          <div class="m-compare-wrap">
            <table class="m-compare" aria-label="FGT, 전시 부스, PlayProof 비교">
              <thead>
                <tr>
                  <th scope="col">기준</th>
                  <th scope="col">FGT</th>
                  <th scope="col">전시 부스</th>
                  <th scope="col">PlayProof</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">일반인 테스터</th>
                  <td><span class="ox no">X</span><small>숙련 패널 편향</small></td>
                  <td><span class="ox yes">O</span></td>
                  <td><span class="ox yes">O</span></td>
                </tr>
                <tr>
                  <th scope="row">구간 단위 검증</th>
                  <td><span class="ox no">X</span></td>
                  <td><span class="ox yes">O</span></td>
                  <td><span class="ox yes">O</span></td>
                </tr>
                <tr>
                  <th scope="row">기획 의도 정량 검증</th>
                  <td><span class="ox no">X</span><small>정성 중심</small></td>
                  <td><span class="ox no">X</span><small>수기·정성</small></td>
                  <td><span class="ox yes">O</span></td>
                </tr>
                <tr>
                  <th scope="row">원본 플레이 영상</th>
                  <td><span class="ox no">X</span></td>
                  <td><span class="ox no">X</span></td>
                  <td><span class="ox yes">O</span></td>
                </tr>
                <tr>
                  <th scope="row">인디가 감당 가능한 단가</th>
                  <td><span class="ox no">X</span><small>약 250만 원/건</small></td>
                  <td><span class="ox no">X</span><small>약 200만 원/박</small></td>
                  <td><span class="ox yes">O</span><small>약 15만 원~</small></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="m-trio">
            <article>
              <h3>Intent-native</h3>
              <p>설문의 느낌이 아니라, “3회면 패턴을 눈치챈다” 같은 의도를 숫자로 봅니다.</p>
            </article>
            <article>
              <h3>일반인 테스터</h3>
              <p>숙련 FGT 패널 편향 대신, 타겟에 가까운 일반 플레이어를 모집합니다.</p>
            </article>
            <article>
              <h3>정량 + 정성 + 원본</h3>
              <p>의도 대비 지표, 유저 피드백, 플레이 영상을 한 패키지로 납품합니다.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="m-band m-band-black" id="how">
        <div class="m-wrap">
          <p class="m-eyebrow light">How PlayProof Works?</p>
          <h2 class="light">의뢰부터 납품까지,<br />한 사이클로 증명합니다.</h2>
          <div class="m-steps m-steps-4">
            <div>
              <span>01</span>
              <h3>의뢰</h3>
              <p>구간 · 기획 의도 · 타겟 · 게임 패키지를 남깁니다.</p>
            </div>
            <div>
              <span>02</span>
              <h3>모집</h3>
              <p>일반인 테스터 공고를 게시하고 지원·당선을 진행합니다.</p>
            </div>
            <div>
              <span>03</span>
              <h3>수집</h3>
              <p>플레이 영상과 정성 피드백을 받습니다.</p>
            </div>
            <div>
              <span>04</span>
              <h3>납품</h3>
              <p>기획 의도에 대한 정량 레포트 + 유저들의 정성 피드백 + 원본 영상을 스튜디오에 전달합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="m-band" id="report">
        <div class="m-wrap">
          <p class="m-eyebrow dark">Sample outcome</p>
          <h2>레포트는 이렇게 도착합니다.</h2>
          <p class="m-lead">
            위 미리보기가 실제 납품물의 핵심입니다.<br />
            “30명 중 2명만 깼고, 패턴은 평균 7번 만에 알아챘다.”처럼<br />
            가설을 수정할 근거가 숫자·문장·영상으로 정리됩니다.
          </p>
          <div class="m-report-card">
            <div class="m-report-top">
              <div>
                <div class="m-pill">납품 완료 · 스타터 패키지</div>
                <h3>1차 보스 — 패턴 학습 곡선</h3>
                <p>Ash Circuit · n=30 · 20분 · 일반인 테스터</p>
              </div>
              <button class="m-btn m-btn-pill" type="button" data-go="sample-report">샘플 레포트 열기</button>
            </div>
            <div class="m-report-grid">
              <div><b>6.7%</b><span>클리어율 · 목표 ≥40%</span></div>
              <div><b>6.7회</b><span>평균 패턴 인지 · 목표 ≈3</span></div>
              <div><b>₩150,000</b><span>20분 · 30명 패키지 예시</span></div>
            </div>
          </div>
        </div>
      </section>

      <section class="m-band m-band-gray" id="join">
        <div class="m-wrap m-split-cta">
          <article class="m-cta-card">
            <p class="m-eyebrow dark">For studios</p>
            <h2>의뢰하기</h2>
            <p>검증하고 싶은 구간과 기획 의도를 남기면, 모집부터 정량·정성·영상 납품까지 이어집니다.</p>
            <button class="m-btn m-btn-dark" type="button" data-go="request">스튜디오 워크스페이스</button>
          </article>
          <article class="m-cta-card">
            <p class="m-eyebrow dark">For players</p>
            <h2>테스터 등록하기</h2>
            <p>공고에 지원하고, 당선되면 플레이 영상과 피드백을 제출하세요. 검수 후 리워드가 쌓입니다.</p>
            <button class="m-btn m-btn-dark" type="button" data-go="tester">테스터 워크스페이스</button>
          </article>
        </div>
      </section>

      <section class="m-finale">
        <h2>기획이 의도한 대로<br />움직이는지, 증명하세요.</h2>
        <p class="m-finale-brand">Prove your Intent — PlayProof</p>
        <div class="m-hero-cta">
          <button class="m-btn m-btn-dark" type="button" data-go="request">의뢰하기</button>
          <button class="m-btn m-btn-light" type="button" data-go="tester">테스터 등록하기</button>
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

  const goRequest = () => navigate({ name: "dev-new" });
  const goTester = () => navigate({ name: "tester-register" });
  const goReport = () => navigate({ name: "dev-report", id: "req_boss_01" });

  root.querySelectorAll<HTMLElement>("[data-go]").forEach((el) => {
    el.addEventListener("click", () => {
      const target = el.dataset.go;
      if (target === "request") goRequest();
      else if (target === "tester") goTester();
      else if (target === "sample-report") goReport();
    });
  });

  root.querySelectorAll<HTMLElement>("[data-scroll]").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.dataset.scroll;
      const target = id ? document.getElementById(id) : null;
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}
