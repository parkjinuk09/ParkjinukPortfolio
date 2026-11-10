import type { Achievements } from "./types";

/** SQL 문자열 리터럴 안의 작은따옴표를 이스케이프한다. */
function quote(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

/**
 * 수상·활동 기준 데이터를 Supabase seed SQL로 변환한다.
 * display_order 충돌 시 갱신하므로 여러 번 실행해도 결과가 같다.
 */
export function buildAchievementsSeedSql({ awards, activities }: Achievements): string {
  const awardRows = awards
    .map((award) =>
      `  (${award.displayOrder}, ${quote(award.periodLabel)}, ${quote(award.title)}, ${quote(award.project)})`,
    )
    .join(",\n");

  const activityRows = activities
    .map((activity) =>
      `  (${activity.displayOrder}, ${quote(activity.periodLabel)}, ${quote(activity.category)}, ${quote(activity.title)})`,
    )
    .join(",\n");

  return [
    "-- 이 파일은 `pnpm db:seed`로 src/features/achievements/seed-data.ts에서 생성됩니다. 직접 수정하지 마세요.",
    "",
    "insert into public.awards (display_order, period_label, title, project) values",
    `${awardRows}`,
    "on conflict (display_order) do update set",
    "  period_label = excluded.period_label,",
    "  title = excluded.title,",
    "  project = excluded.project;",
    "",
    "insert into public.activities (display_order, period_label, category, title) values",
    `${activityRows}`,
    "on conflict (display_order) do update set",
    "  period_label = excluded.period_label,",
    "  category = excluded.category,",
    "  title = excluded.title;",
    "",
  ].join("\n");
}
