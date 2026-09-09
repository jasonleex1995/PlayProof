# PlayProof

게임 기반 휴먼 인증(Human Verification) 서비스 **데모 페이지**.

CAPTCHA 대신 짧은 미니게임(Bubble Pop)을 플레이하면서 포인터 행동 텔레메트리
(속도 · 가속도 · jerk · 경로 효율 · jitter)를 분석해 사람다움을 점수화합니다.

데모: https://jasonleex1995.github.io/PlayProof/

> 이 저장소의 스코어링은 **브라우저 휴리스틱 데모**입니다. 프로덕션 PlayProof는
> 서버 ML 파이프라인·서명 토큰 검증과 결합됩니다.

## 기능

- 랜딩 / 기능 소개 / 동작 방식 / SDK 스니펫
- 인터랙티브 Bubble Pop 검증 데모
- 실시간 텔레메트리 패널 + speed sparkline
- Human / Suspicious / Inconclusive 판정 UI

## 개발

```bash
npm install
npm run dev        # http://localhost:5173/PlayProof/
npm run build      # dist/
npm run typecheck
```

## 배포

`main`에 푸시하면 `.github/workflows/deploy.yml`이 GitHub Pages로 배포합니다.
저장소 Settings → Pages → Source를 **GitHub Actions**로 한 번 설정하세요.

## 구조

```
src/
  main.ts              페이지 셸 + 데모 바인딩
  style.css            다크 테마 UI
  telemetry.ts         행동 신호 추출 / 휴리스틱 스코어
  demo/bubbleDemo.ts   Canvas Bubble Pop 미니게임
```
