import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { achievementsSeed } from "./seed-data";
import { buildAchievementsSeedSql } from "./seed-sql";

describe("buildAchievementsSeedSql", () => {
  it("작은따옴표를 이스케이프해 SQL 문자열이 깨지지 않게 한다", () => {
    const sql = buildAchievementsSeedSql({
      awards: [{ displayOrder: 1, periodLabel: "2026", title: "O'Reilly 상", project: "P" }],
      activities: [],
    });

    expect(sql).toContain("'O''Reilly 상'");
  });

  it("커밋된 supabase/seed.sql이 기준 데이터와 일치한다 (pnpm db:seed 누락 방지)", () => {
    const committedSeed = readFileSync(resolve(import.meta.dirname, "../../../supabase/seed.sql"), "utf8");

    expect(committedSeed).toBe(buildAchievementsSeedSql(achievementsSeed));
  });

  it("display_order가 목록 안에서 중복되지 않는다 (DB unique 제약과 동일 조건)", () => {
    const awardOrders = achievementsSeed.awards.map((award) => award.displayOrder);
    const activityOrders = achievementsSeed.activities.map((activity) => activity.displayOrder);

    expect(new Set(awardOrders).size).toBe(awardOrders.length);
    expect(new Set(activityOrders).size).toBe(activityOrders.length);
  });
});
