-- 이 파일은 `pnpm db:seed`로 src/features/achievements/seed-data.ts에서 생성됩니다. 직접 수정하지 마세요.

insert into public.awards (display_order, period_label, title, project) values
  (1, '2025년 겨울방학', '교내 레벨업 프로젝트 3위', 'Jichini'),
  (2, '2026년 1학기', '교내 APC 동아리 해커톤 3위', 'DevPrep'),
  (3, '2026년 1학기', '교내 캡스톤 프로젝트 대상', 'CapTeam'),
  (4, '2026년 1학기', '교내 해커톤 트러블슈팅상', 'LogGuard'),
  (5, '2026년 2학기', '여수 해커톤 정보통신기획평가원장상', '발주콕')
on conflict (display_order) do update set
  period_label = excluded.period_label,
  title = excluded.title,
  project = excluded.project;

insert into public.activities (display_order, period_label, category, title) values
  (1, '2025.08', '해외 견학', '싱가포르 연수'),
  (2, '2025.09', '교내 활동', '교내 프로젝트 대회 참가'),
  (3, '2026.01', '해외 견학', '미국 실리콘밸리 연수'),
  (4, '2026.07', '교내 활동', '교내 포트폴리오 대회 참가'),
  (5, '2026.07', '교내 활동', 'APC 동아리 해커톤 참가'),
  (6, '2026.09', '발표', '이음 컨퍼런스 연사 — 개발 학습 경험 발표'),
  (7, '2026.10', '국제교류', '일본 치바상업고등학교 국제교류')
on conflict (display_order) do update set
  period_label = excluded.period_label,
  category = excluded.category,
  title = excluded.title;
