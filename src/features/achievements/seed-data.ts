import type { Achievements } from "./types";

/**
 * 수상·활동 목록의 기준 데이터 (Notion 「Awards & Activities」 순서와 같은 오래된 순).
 * supabase/seed.sql은 이 파일에서 생성하므로(`pnpm db:seed`) 값을 바꿀 때는 이 파일만 수정한다.
 * Supabase 환경 변수가 없는 로컬 개발 환경에서는 이 데이터를 그대로 사용한다.
 */
export const achievementsSeed: Achievements = {
  awards: [
    { displayOrder: 1, periodLabel: "2025년 겨울방학", title: "교내 레벨업 프로젝트 3위", project: "Jichini" },
    { displayOrder: 2, periodLabel: "2026년 1학기", title: "교내 APC 동아리 해커톤 3위", project: "DevPrep" },
    { displayOrder: 3, periodLabel: "2026년 1학기", title: "교내 캡스톤 프로젝트 대상", project: "CapTeam" },
    { displayOrder: 4, periodLabel: "2026년 1학기", title: "교내 해커톤 트러블슈팅상", project: "LogGuard" },
    {
      displayOrder: 5,
      periodLabel: "2026년 2학기",
      title: "여수 해커톤 정보통신기획평가원장상",
      project: "발주콕",
    },
  ],
  activities: [
    { displayOrder: 1, periodLabel: "2025.08", category: "해외 견학", title: "싱가포르 연수" },
    { displayOrder: 2, periodLabel: "2025.09", category: "교내 활동", title: "교내 프로젝트 대회 참가" },
    { displayOrder: 3, periodLabel: "2026.01", category: "해외 견학", title: "미국 실리콘밸리 연수" },
    { displayOrder: 4, periodLabel: "2026.07", category: "교내 활동", title: "교내 포트폴리오 대회 참가" },
    { displayOrder: 5, periodLabel: "2026.07", category: "교내 활동", title: "APC 동아리 해커톤 참가" },
    { displayOrder: 6, periodLabel: "2026.09", category: "발표", title: "이음 컨퍼런스 연사 — 개발 학습 경험 발표" },
    { displayOrder: 7, periodLabel: "2026.10", category: "국제교류", title: "일본 치바상업고등학교 국제교류" },
  ],
};
