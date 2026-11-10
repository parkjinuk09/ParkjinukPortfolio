import "server-only";

import { cacheLife } from "next/cache";

import { readSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { fetchAchievements } from "./repository";
import { achievementsSeed } from "./seed-data";
import type { Achievements } from "./types";

export type AchievementsResult =
  | { status: "ok"; source: "supabase" | "seed"; data: Achievements }
  | { status: "error" };

/**
 * 화면에 표시할 수상·활동 목록을 가져온다.
 * - Supabase 미설정(로컬 개발): seed.sql과 같은 기준 데이터를 사용한다.
 * - 조회 성공: 목록이 자주 바뀌지 않으므로 몇 시간 단위로 캐시한다.
 * - 조회 실패: 오류 상태를 짧게만 캐시해 장애가 복구되면 곧바로 다시 조회되게 한다.
 */
export async function getAchievements(): Promise<AchievementsResult> {
  "use cache";

  const config = readSupabaseConfig();
  if (!config) {
    cacheLife("hours");
    return { status: "ok", source: "seed", data: achievementsSeed };
  }

  try {
    const data = await fetchAchievements(createSupabaseServerClient(config));
    cacheLife("hours");
    return { status: "ok", source: "supabase", data };
  } catch (error) {
    console.error("[achievements] 목록 조회 실패", error);
    cacheLife("seconds");
    return { status: "error" };
  }
}
