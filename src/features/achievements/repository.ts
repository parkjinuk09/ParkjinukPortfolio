import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { mapActivityRow, mapAwardRow, type ActivityRow, type AwardRow } from "./mappers";
import type { Achievements } from "./types";

export class AchievementsQueryError extends Error {
  constructor(table: string, cause: unknown) {
    super(`${table} 조회에 실패했습니다.`, { cause });
    this.name = "AchievementsQueryError";
  }
}

/** 수상·활동 목록을 display_order 순서로 조회한다. 두 테이블은 서로 독립이라 병렬로 요청한다. */
export async function fetchAchievements(client: SupabaseClient): Promise<Achievements> {
  const [awardsResult, activitiesResult] = await Promise.all([
    client
      .from("awards")
      .select("display_order, period_label, title, project")
      .order("display_order", { ascending: true })
      .returns<AwardRow[]>(),
    client
      .from("activities")
      .select("display_order, period_label, category, title")
      .order("display_order", { ascending: true })
      .returns<ActivityRow[]>(),
  ]);

  if (awardsResult.error) {
    throw new AchievementsQueryError("awards", awardsResult.error);
  }
  if (activitiesResult.error) {
    throw new AchievementsQueryError("activities", activitiesResult.error);
  }

  return {
    awards: awardsResult.data.map(mapAwardRow),
    activities: activitiesResult.data.map(mapActivityRow),
  };
}
