-- 이 파일은 `pnpm db:seed`로 src/features/achievements/seed-data.ts에서 생성됩니다. 직접 수정하지 마세요.

insert into public.awards (display_order, period_label, title, project) values
  (1, '2026 2학기', '여수 해커톤 정보통신기획평가원장상 (최우수상)', '발주콕'),
  (2, '2026 1학기', '캡스톤 프로젝트 대상', 'CapTeam'),
  (3, '2026 1학기', '교내 해커톤 트러블슈팅상', 'LogGuard'),
  (4, '2026 1학기', 'APC 동아리 해커톤 3위', 'DevPrep'),
  (5, '2025 겨울방학', '레벨업 프로젝트 3위', 'Jichini')
on conflict (display_order) do update set
  period_label = excluded.period_label,
  title = excluded.title,
  project = excluded.project;

insert into public.activities (display_order, period_label, category, title) values
  (1, '2026.10', '국제교류', '일본 치바상업고등학교 국제교류'),
  (2, '2026.09', '발표', '이음 컨퍼런스 연사 — 개발 학습 경험 발표'),
  (3, '2026.07', '교내 활동', 'APC 동아리 해커톤 참가'),
  (4, '2026.07', '교내 활동', '교내 포트폴리오 대회 참가'),
  (5, '2026.01', '해외 견학', '미국 실리콘밸리 연수'),
  (6, '2025.09', '교내 활동', '교내 프로젝트 대회 참가'),
  (7, '2025.08', '해외 견학', '싱가포르 연수')
on conflict (display_order) do update set
  period_label = excluded.period_label,
  category = excluded.category,
  title = excluded.title;
