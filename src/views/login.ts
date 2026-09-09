import { navigate } from "../router";

export function renderLogin(root: HTMLElement): void {
  root.innerHTML = `
    <div class="login-wrap">
      <div class="login-card">
        <div class="login-hero">
          <span class="badge brand">운영 데모 · Demo workspace</span>
          <h1>PlayProof</h1>
          <p>
            게임의 핵심 구간이 기획 의도대로 플레이되는지 검증하는
            <strong>기획 유닛 테스트</strong> 워크스페이스입니다.
            데모에서는 역할만 선택하면 바로 들어갑니다.
          </p>
        </div>
        <div class="login-roles">
          <button class="role-card" type="button" data-role="developer">
            <div class="badge">의뢰자</div>
            <h2>개발 스튜디오로 입장</h2>
            <p>구간 의뢰 생성, 진행 현황, 정량 레포트·영상 수령까지 확인합니다.</p>
            <span class="btn btn-primary">Neon Moth Games로 계속</span>
          </button>
          <button class="role-card" type="button" data-role="tester">
            <div class="badge">테스터</div>
            <h2>테스터로 입장</h2>
            <p>미션을 고르고 플레이 영상을 제출하며 리워드·마일리지를 관리합니다.</p>
            <span class="btn btn-secondary">김하린으로 계속</span>
          </button>
        </div>
        <div class="demo-note">
          슬로건: <strong>Prove the intent.</strong> · 실제 결제·업로드는 연결되지 않은 UI 데모입니다.
          서비스 정의는 저장소 <code>docs/SERVICE.md</code>를 참고하세요.
        </div>
      </div>
    </div>
  `;

  root.querySelector('[data-role="developer"]')?.addEventListener("click", () => {
    navigate({ name: "dev-home" });
  });
  root.querySelector('[data-role="tester"]')?.addEventListener("click", () => {
    navigate({ name: "tester-home" });
  });
}
