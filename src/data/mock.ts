export type Role = "developer" | "tester";

export type RequestStatus =
  | "draft"
  | "recruiting"
  | "in_progress"
  | "analyzing"
  | "delivered";

export type IntentMetric = {
  id: string;
  label: string;
  hypothesis: string;
  unit: string;
  target: string;
  actual: string;
  pass: boolean | null;
  note?: string;
};

export type PlayRequest = {
  id: string;
  title: string;
  gameTitle: string;
  segment: string;
  status: RequestStatus;
  targetAudience: string;
  testerCount: number;
  minutesPerTester: number;
  rewardPerTester: number;
  reportFeeRate: number;
  createdAt: string;
  intentSummary: string;
  metrics: IntentMetric[];
  clearCount?: number;
  patternAwareCount?: number;
  patternAwarenessAttempts?: number[];
};

export type Mission = {
  id: string;
  requestId: string;
  title: string;
  gameTitle: string;
  segment: string;
  reward: number;
  minutes: number;
  slotsLeft: number;
  deadline: string;
  tags: string[];
  brief: string;
};

export type Submission = {
  id: string;
  missionId: string;
  title: string;
  submittedAt: string;
  status: "pending_review" | "accepted" | "rejected";
  reward: number;
};

export const currentUser = {
  developer: {
    name: "이준호",
    studio: "Neon Moth Games",
    email: "june@neonmoth.dev",
  },
  tester: {
    name: "김하린",
    mileage: 18400,
    completed: 11,
    email: "harin.plays@email.com",
  },
};

export const requests: PlayRequest[] = [
  {
    id: "req_boss_01",
    title: "1차 보스 — 패턴 학습 곡선 검증",
    gameTitle: "Ash Circuit",
    segment: "Chapter 1 Boss: Pyre Warden (약 15분 구간)",
    status: "delivered",
    targetAudience: "20–30대 남성 · 액션/소울라이크 경험자",
    testerCount: 30,
    minutesPerTester: 15,
    rewardPerTester: 3000,
    reportFeeRate: 0.1,
    createdAt: "2026-08-28",
    intentSummary:
      "패턴을 모르면 클리어 불가. 약 3회 시도에서 패턴 존재를 인지하고, 10회 이내 클리어 가능해야 함.",
    clearCount: 2,
    patternAwareCount: 5,
    patternAwarenessAttempts: [7, 9, 9, 8, 3, 4],
    metrics: [
      {
        id: "m1",
        label: "클리어율",
        hypothesis: "타겟 유저 기준 상당수가 10회 내 클리어",
        unit: "%",
        target: "≥ 40% (초기 가설)",
        actual: "6.7% (2/30)",
        pass: false,
        note: "기획 의도 대비 난이도 과다 또는 패턴 단서 부족",
      },
      {
        id: "m2",
        label: "패턴 인지 시점",
        hypothesis: "평균 약 3회 시도에서 패턴 존재 인지",
        unit: "회",
        target: "≈ 3",
        actual: "평균 6.7 (n=5)",
        pass: false,
        note: "인지 가능한 유저도 단서가 늦게 전달됨",
      },
      {
        id: "m3",
        label: "패턴 일관 회피 유저",
        hypothesis: "클리어 직전 구간에 회피 행동이 안정화",
        unit: "명",
        target: "관찰",
        actual: "5/30",
        pass: null,
      },
      {
        id: "m4",
        label: "15분 내 첫 패턴 관찰",
        hypothesis: "대부분의 유저가 제한 시간 내 패턴을 최소 1회 목격",
        unit: "%",
        target: "≥ 80%",
        actual: "73%",
        pass: false,
      },
    ],
  },
  {
    id: "req_tut_02",
    title: "튜토리얼 — 대시 습득 검증",
    gameTitle: "Ash Circuit",
    segment: "Tutorial Room 2–3",
    status: "analyzing",
    targetAudience: "캐주얼·액션 입문 포함",
    testerCount: 20,
    minutesPerTester: 10,
    rewardPerTester: 2500,
    reportFeeRate: 0.1,
    createdAt: "2026-09-05",
    intentSummary: "튜토리얼을 마친 유저의 90% 이상이 대시를 전투에서 자발적으로 사용.",
    metrics: [
      {
        id: "t1",
        label: "튜토리얼 완주율",
        hypothesis: "이탈 없이 완주",
        unit: "%",
        target: "≥ 85%",
        actual: "분석 중",
        pass: null,
      },
      {
        id: "t2",
        label: "자발적 대시 사용률",
        hypothesis: "이후 첫 전투에서 대시 사용",
        unit: "%",
        target: "≥ 90%",
        actual: "분석 중",
        pass: null,
      },
    ],
  },
  {
    id: "req_econ_03",
    title: "상점 루프 — 첫 구매까지 시간",
    gameTitle: "Ash Circuit",
    segment: "Hub → Shop first visit",
    status: "recruiting",
    targetAudience: "20–30대 · RPG 라이트 유저",
    testerCount: 25,
    minutesPerTester: 12,
    rewardPerTester: 2800,
    reportFeeRate: 0.1,
    createdAt: "2026-09-08",
    intentSummary: "허브 도착 후 8분 내 첫 유의미 구매가 발생하도록 유도.",
    metrics: [
      {
        id: "e1",
        label: "첫 구매까지 중앙값 시간",
        hypothesis: "≤ 8분",
        unit: "분",
        target: "≤ 8",
        actual: "모집 중",
        pass: null,
      },
    ],
  },
];

export const missions: Mission[] = [
  {
    id: "mis_01",
    requestId: "req_econ_03",
    title: "상점 첫 방문 루프 플레이",
    gameTitle: "Ash Circuit",
    segment: "Hub → Shop",
    reward: 2800,
    minutes: 12,
    slotsLeft: 14,
    deadline: "2026-09-15",
    tags: ["RPG", "경제", "12분"],
    brief:
      "허브에서 상점을 찾아 아이템을 살펴보고, 가능하면 구매까지 진행하세요. 화면 녹화 필수.",
  },
  {
    id: "mis_02",
    requestId: "req_tut_02",
    title: "튜토리얼 대시 구간",
    gameTitle: "Ash Circuit",
    segment: "Tutorial 2–3",
    reward: 2500,
    minutes: 10,
    slotsLeft: 3,
    deadline: "2026-09-12",
    tags: ["튜토리얼", "액션", "10분"],
    brief: "튜토리얼을 끝까지 진행한 뒤, 이어지는 첫 전투까지 녹화해 업로드하세요.",
  },
  {
    id: "mis_03",
    requestId: "req_open_demo",
    title: "신작 프로토타입 — 이동감 체크",
    gameTitle: "Parcel Knights (프로토타입)",
    segment: "City block stroll",
    reward: 2000,
    minutes: 8,
    slotsLeft: 22,
    deadline: "2026-09-20",
    tags: ["프로토타입", "캐주얼"],
    brief: "조작 설명 없이 8분간 자유롭게 이동·점프해보세요. 생각나는 불편함을 메모와 함께.",
  },
];

export const submissions: Submission[] = [
  {
    id: "sub_01",
    missionId: "mis_02",
    title: "Ash Circuit · Tutorial 2–3",
    submittedAt: "2026-09-07",
    status: "accepted",
    reward: 2500,
  },
  {
    id: "sub_02",
    missionId: "mis_legacy",
    title: "Ash Circuit · Boss Pyre Warden",
    submittedAt: "2026-08-30",
    status: "accepted",
    reward: 3000,
  },
  {
    id: "sub_03",
    missionId: "mis_01",
    title: "Ash Circuit · Hub Shop",
    submittedAt: "2026-09-09",
    status: "pending_review",
    reward: 2800,
  },
];

export function formatKRW(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(n) + "원";
}

export function estimateQuote(
  testers: number,
  reward: number,
  reportRate: number,
): { testerBudget: number; reportFee: number; total: number } {
  const testerBudget = testers * reward;
  const reportFee = Math.round(testerBudget * reportRate);
  return { testerBudget, reportFee, total: testerBudget + reportFee };
}

export function statusLabel(s: RequestStatus): string {
  switch (s) {
    case "draft":
      return "임시저장";
    case "recruiting":
      return "테스터 모집 중";
    case "in_progress":
      return "플레이 수집 중";
    case "analyzing":
      return "영상 분석 중";
    case "delivered":
      return "레포트 납품 완료";
  }
}

export function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
