import { bindShellActions, shell } from "../shell";
import { navigate } from "../../router";

const PLATFORMS = ["PC (Windows)", "PC (Mac)", "모바일 (iOS)", "모바일 (Android)", "콘솔"] as const;

export function renderTesterRegister(root: HTMLElement): void {
  root.innerHTML = shell({
    role: "tester",
    active: "home",
    body: `
      <div class="page-header">
        <div>
          <div class="badge brand">테스터 등록</div>
          <h1 style="margin-top:0.45rem;">테스터 신청하기</h1>
          <p>의뢰 매칭에 필요한 프로필을 남겨 주세요.</p>
        </div>
        <button class="btn btn-ghost" type="button" id="back-home">홈으로</button>
      </div>

      <form class="card form register-form" id="tester-form">
        <div class="register-section">
          <h3>기본 정보</h3>
          <p class="help">타겟 유저 조건(연령·지역)과 매칭할 때 씁니다.</p>
          <div class="grid-2" style="margin-top:0.85rem;">
            <div class="field">
              <label for="name">이름 / 닉네임 *</label>
              <input id="name" name="name" required value="김민수" />
            </div>
            <div class="field">
              <label for="email">연락용 이메일 *</label>
              <input id="email" name="email" type="email" required value="minsu.kim@email.com" />
            </div>
            <div class="field">
              <label for="age">연령대 *</label>
              <select id="age" name="age" required>
                <option value="">선택</option>
                <option>10대</option>
                <option selected>20대</option>
                <option>30대</option>
                <option>40대</option>
                <option>50대+</option>
              </select>
            </div>
            <div class="field">
              <label for="gender">성별 (선택)</label>
              <select id="gender" name="gender">
                <option value="">선택 안 함</option>
                <option>여성</option>
                <option selected>남성</option>
                <option>기타 / 응답 거부</option>
              </select>
            </div>
            <div class="field">
              <label for="region">거주 지역 *</label>
              <select id="region" name="region" required>
                <option value="">선택</option>
                <option selected>대한민국</option>
                <option>일본</option>
                <option>북미</option>
                <option>유럽</option>
                <option>기타</option>
              </select>
            </div>
            <div class="field">
              <label for="timezone">주로 플레이하는 시간대</label>
              <select id="timezone" name="timezone">
                <option selected>평일 저녁</option>
                <option>주말</option>
                <option>심야</option>
                <option>유동적</option>
              </select>
            </div>
          </div>
        </div>

        <div class="register-section">
          <h3>플레이 프로필</h3>
          <p class="help">
            일반 플레이어는 장르보다 “어떤 게임을 해봤는지”가 매칭에 더 잘 맞습니다.
            좋아하는 게임·플레이해 본 게임을 자유롭게 적어 주세요.
          </p>
          <div class="field" style="margin-top:0.85rem;">
            <label for="favorites">좋아하는 게임 *</label>
            <textarea
              id="favorites"
              name="favorites"
              required
              placeholder="예: 젤다의 전설, 스태디 2, 오버워치, 메이플스토리"
            >리그 오브 레전드 (롤)</textarea>
            <div class="help">쉼표나 줄바꿈으로 여러 개 적어도 됩니다. 장르를 몰라도 괜찮습니다.</div>
          </div>
          <div class="field">
            <label for="played">플레이해 본 게임 (선택)</label>
            <textarea
              id="played"
              name="played"
              placeholder="예: 최근에 클리어/중도 하차한 게임, 비슷한 장르로 해본 것"
            >롤만 해봤습니다. 다른 PC/콘솔 싱글 게임은 거의 안 해봤어요.</textarea>
            <div class="help">의뢰 게임과 결이 비슷한 경험이 있으면 매칭·검수에 도움이 됩니다.</div>
          </div>
          <div class="grid-2">
            <div class="field">
              <label for="level">게임 숙련도 *</label>
              <select id="level" name="level" required>
                <option>캐주얼 (주 3시간 미만)</option>
                <option selected>코어 (주 3–10시간)</option>
                <option>하드코어 (주 10시간+)</option>
                <option>특정 게임/장르 고수</option>
              </select>
            </div>
            <div class="field">
              <label for="years">게임 경력</label>
              <select id="years" name="years">
                <option>1년 미만</option>
                <option>1–3년</option>
                <option selected>3–7년</option>
                <option>7년+</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label>플레이 가능 플랫폼 * (복수 선택)</label>
            <div class="chip-grid" role="group" aria-label="플레이 가능 플랫폼">
              ${PLATFORMS.map(
                (p) => `
                <label class="chip">
                  <input type="checkbox" name="platforms" value="${p}" ${
                    p === "PC (Windows)" ? "checked" : ""
                  } />
                  <span class="chip-text">${p}</span>
                </label>`,
              ).join("")}
            </div>
          </div>
        </div>

        <div class="register-section">
          <h3>환경 · 검수에 필요한 정보</h3>
          <p class="help">미공개 빌드 실행·화면 녹화 가능 여부를 확인합니다.</p>
          <div class="grid-2" style="margin-top:0.85rem;">
            <div class="field">
              <label for="os">주 사용 OS / 기기 *</label>
              <input id="os" name="os" required value="Windows 11, 노트북 (내장 그래픽)" />
            </div>
            <div class="field">
              <label for="record">화면 녹화 가능 여부 *</label>
              <select id="record" name="record" required>
                <option selected>가능 (권장)</option>
                <option>모바일만 가능</option>
                <option>어려움</option>
              </select>
            </div>
            <div class="field">
              <label for="steam">Steam / 스토어 ID (선택)</label>
              <input id="steam" name="steam" value="없음 (롤만 플레이)" />
            </div>
            <div class="field">
              <label for="languages">사용 언어 *</label>
              <input id="languages" name="languages" required value="한국어" />
            </div>
          </div>
        </div>

        <div class="register-section">
          <h3>동의</h3>
          <label class="check-row">
            <input type="checkbox" name="nda" required checked />
            <span>미공개 빌드·영상은 외부 공유하지 않겠습니다. (데모 NDA) *</span>
          </label>
          <label class="check-row">
            <input type="checkbox" name="privacy" required checked />
            <span>프로필 정보가 의뢰 매칭·정산에만 쓰이는 데 동의합니다. *</span>
          </label>
          <label class="check-row">
            <input type="checkbox" name="reward" checked />
            <span>리워드·마일리지 안내를 이메일로 받겠습니다.</span>
          </label>
        </div>

        <div class="register-actions">
          <button class="btn btn-primary" type="submit">신청 완료하고 미션 보기</button>
          <button class="btn btn-secondary" type="button" id="skip-demo">이 프로필로 바로 시작</button>
        </div>
      </form>
    `,
  });

  bindShellActions(root);

  const saveDefaultProfile = () => {
    localStorage.setItem(
      "playproof_tester",
      JSON.stringify({
        name: "김민수",
        email: "minsu.kim@email.com",
        age: "20대",
        gender: "남성",
        region: "대한민국",
        timezone: "평일 저녁",
        favorites: "리그 오브 레전드 (롤)",
        played: "롤만 해봤습니다. 다른 PC/콘솔 싱글 게임은 거의 안 해봤어요.",
        level: "코어 (주 3–10시간)",
        years: "3–7년",
        platforms: ["PC (Windows)"],
        os: "Windows 11, 노트북 (내장 그래픽)",
        record: "가능 (권장)",
        steam: "없음 (롤만 플레이)",
        languages: "한국어",
        savedAt: new Date().toISOString(),
      }),
    );
  };

  root.querySelector("#back-home")?.addEventListener("click", () => navigate({ name: "home" }));
  root.querySelector("#skip-demo")?.addEventListener("click", () => {
    saveDefaultProfile();
    navigate({ name: "tester-home" });
  });

  root.querySelector("#tester-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const favorites = String(data.get("favorites") || "").trim();
    const played = String(data.get("played") || "").trim();
    const platforms = data.getAll("platforms");
    if (!favorites) {
      alert("좋아하는 게임을 하나 이상 적어 주세요.");
      return;
    }
    if (platforms.length === 0) {
      alert("플레이 가능 플랫폼을 하나 이상 선택해 주세요.");
      return;
    }
    const profile = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      age: String(data.get("age") || ""),
      gender: String(data.get("gender") || ""),
      region: String(data.get("region") || ""),
      timezone: String(data.get("timezone") || ""),
      favorites,
      played,
      level: String(data.get("level") || ""),
      years: String(data.get("years") || ""),
      platforms,
      os: String(data.get("os") || ""),
      record: String(data.get("record") || ""),
      steam: String(data.get("steam") || ""),
      languages: String(data.get("languages") || ""),
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("playproof_tester", JSON.stringify(profile));
    alert(`테스터 신청이 접수되었습니다.\n\n${profile.name}님, 미션 보드로 이동합니다.`);
    navigate({ name: "tester-home" });
  });
}
