# PlayProof

**Prove the intent. / 기획 의도를 증명하라.**

인디·소규모 팀을 위한 **게임 기획 유닛 테스트** 플랫폼.

핵심 구간을 타겟 유저에게 플레이하게 하고, 기획 의도 달성 여부를 **정량 레포트 + 원본 영상**으로 납품합니다.

- 서비스 정의·시장·비전: [docs/SERVICE.md](docs/SERVICE.md)
- 운영 워크스페이스 데모: https://jasonleex1995.github.io/PlayProof/

> 이 저장소의 웹앱은 **소개 랜딩이 아니라**, 의뢰자/테스터가 쓰는 **운영 화면 데모**입니다.

## 데모에서 할 수 있는 것

1. **의뢰자(개발 스튜디오)**  
   대시보드 → 새 의뢰(견적) → 의뢰 상세 → 정량 레포트(보스 패턴 예시)
2. **테스터**  
   미션 보드 → 미션 상세·영상 제출 시뮬레이션 → 리워드/마일리지

결제는 연결되지 않습니다. UI·플로우 데모입니다.

## 개발

```bash
npm install
npm run dev        # http://localhost:5173/PlayProof/
npm run build
npm run typecheck
```

## 배포

`main` 푸시 시 GitHub Pages (`Settings → Pages → Source: GitHub Actions`).
