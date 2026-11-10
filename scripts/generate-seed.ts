import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { achievementsSeed } from "../src/features/achievements/seed-data";
import { buildAchievementsSeedSql } from "../src/features/achievements/seed-sql";

const seedPath = resolve(import.meta.dirname, "../supabase/seed.sql");

writeFileSync(seedPath, buildAchievementsSeedSql(achievementsSeed), "utf8");
console.log(`seed 파일을 갱신했습니다: ${seedPath}`);
