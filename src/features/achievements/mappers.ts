import type { Activity, Award } from "./types";

/** Supabase 테이블 행 형태. DB 컬럼명(snake_case)을 화면 모델(camelCase)과 분리한다. */
export interface AwardRow {
  display_order: number;
  period_label: string;
  title: string;
  project: string;
}

export interface ActivityRow {
  display_order: number;
  period_label: string;
  category: string;
  title: string;
}

export function mapAwardRow(row: AwardRow): Award {
  return {
    displayOrder: row.display_order,
    periodLabel: row.period_label,
    title: row.title,
    project: row.project,
  };
}

export function mapActivityRow(row: ActivityRow): Activity {
  return {
    displayOrder: row.display_order,
    periodLabel: row.period_label,
    category: row.category,
    title: row.title,
  };
}
