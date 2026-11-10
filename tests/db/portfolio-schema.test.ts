import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Client, DatabaseError, type Pool } from "pg";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { achievementsSeed } from "@/features/achievements/seed-data";

import { createRolePool, createTestDatabase, dropTestDatabase } from "./database";

const CONCURRENT_REQUESTS = 50;

let testUrl: string;
let admin: Client;
let anonPool: Pool;

function insertMessageAsAnon(pool: Pool, idempotencyKey: string, suffix = "") {
  return pool.query(
    "insert into public.contact_messages (idempotency_key, name, email, message) values ($1, $2, $3, $4)",
    [idempotencyKey, `방문자${suffix}`, "visitor@example.com", "동시성 검증용 메시지입니다."],
  );
}

async function expectPgError(promise: Promise<unknown>, code: string) {
  const error = await promise.then(
    () => null,
    (reason: unknown) => reason,
  );
  expect(error).toBeInstanceOf(DatabaseError);
  expect((error as DatabaseError).code).toBe(code);
}

beforeAll(async () => {
  testUrl = await createTestDatabase();
  admin = new Client({ connectionString: testUrl });
  await admin.connect();
  anonPool = createRolePool(testUrl, "anon", CONCURRENT_REQUESTS);
});

afterAll(async () => {
  await anonPool?.end();
  await admin?.end();
  await dropTestDatabase();
});

beforeEach(async () => {
  await admin.query("truncate public.contact_messages");
});

describe("수상·활동 (공개 조회 전용)", () => {
  it("seed 적용 후 anon은 기준 데이터와 같은 목록을 display_order 순서로 조회한다", async () => {
    const awards = await anonPool.query("select title from public.awards order by display_order");
    const activities = await anonPool.query("select title from public.activities order by display_order");

    expect(awards.rows.map((row) => row.title)).toEqual(achievementsSeed.awards.map((award) => award.title));
    expect(activities.rows.map((row) => row.title)).toEqual(
      achievementsSeed.activities.map((activity) => activity.title),
    );
  });

  it("anon은 수상 목록을 추가·수정·삭제할 수 없다", async () => {
    await expectPgError(
      anonPool.query("insert into public.awards (display_order, period_label, title, project) values (99, 'x', 'x', 'x')"),
      "42501",
    );
    await expectPgError(anonPool.query("update public.awards set title = 'hacked'"), "42501");
    await expectPgError(anonPool.query("delete from public.awards"), "42501");
  });

  it("seed는 여러 번 적용해도 행이 늘어나지 않는다", async () => {
    const before = await admin.query("select count(*)::int as count from public.awards");
    await admin.query(readFileSync(resolve(import.meta.dirname, "../../supabase/seed.sql"), "utf8"));
    const after = await admin.query("select count(*)::int as count from public.awards");

    expect(after.rows[0].count).toBe(before.rows[0].count);
  });
});

describe("연락 메시지 (공개 작성 전용)", () => {
  it("anon은 메시지를 저장할 수 있지만 조회할 수는 없다", async () => {
    await insertMessageAsAnon(anonPool, randomUUID());

    await expectPgError(anonPool.query("select * from public.contact_messages"), "42501");
    const stored = await admin.query("select count(*)::int as count from public.contact_messages");
    expect(stored.rows[0].count).toBe(1);
  });

  it("anon은 id·created_at을 직접 지정하거나 메시지를 수정·삭제할 수 없다", async () => {
    await expectPgError(
      anonPool.query(
        "insert into public.contact_messages (id, idempotency_key, name, email, message) values ($1, $2, 'a', 'a@b.co', '열 글자 이상의 메시지')",
        [randomUUID(), randomUUID()],
      ),
      "42501",
    );
    await expectPgError(anonPool.query("update public.contact_messages set name = 'x'"), "42501");
    await expectPgError(anonPool.query("delete from public.contact_messages"), "42501");
  });

  it("DB check 제약이 서버 검증을 우회한 값을 거부한다", async () => {
    const insert = (name: string, email: string, message: string) =>
      anonPool.query(
        "insert into public.contact_messages (idempotency_key, name, email, message) values ($1, $2, $3, $4)",
        [randomUUID(), name, email, message],
      );

    await expectPgError(insert("   ", "a@b.co", "열 글자 이상의 메시지"), "23514");
    await expectPgError(insert("이".repeat(51), "a@b.co", "열 글자 이상의 메시지"), "23514");
    await expectPgError(insert("이름", "not-an-email", "열 글자 이상의 메시지"), "23514");
    await expectPgError(insert("이름", "a@b.co", "짧음"), "23514");
    await expectPgError(insert("이름", "a@b.co", "가".repeat(2001)), "23514");
  });
});

describe("동시성: 같은 메시지의 중복 제출", () => {
  it(`같은 idempotencyKey로 ${CONCURRENT_REQUESTS}건이 동시에 들어와도 한 건만 저장되고 나머지는 unique 위반으로 끝난다`, async () => {
    const idempotencyKey = randomUUID();

    const results = await Promise.allSettled(
      Array.from({ length: CONCURRENT_REQUESTS }, () => insertMessageAsAnon(anonPool, idempotencyKey)),
    );

    const fulfilled = results.filter((result) => result.status === "fulfilled");
    const rejected = results.filter((result): result is PromiseRejectedResult => result.status === "rejected");
    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(CONCURRENT_REQUESTS - 1);
    // API는 23505를 "이미 처리된 요청"으로 보고 200을 응답하므로, 다른 종류의 오류가 섞이면 안 된다.
    expect(rejected.every((result) => (result.reason as DatabaseError).code === "23505")).toBe(true);

    const stored = await admin.query("select count(*)::int as count from public.contact_messages where idempotency_key = $1", [
      idempotencyKey,
    ]);
    expect(stored.rows[0].count).toBe(1);
  });

  it(`서로 다른 키 ${CONCURRENT_REQUESTS}건이 동시에 들어오면 모두 저장된다`, async () => {
    const results = await Promise.allSettled(
      Array.from({ length: CONCURRENT_REQUESTS }, (_, index) => insertMessageAsAnon(anonPool, randomUUID(), String(index))),
    );

    expect(results.every((result) => result.status === "fulfilled")).toBe(true);
    const stored = await admin.query("select count(*)::int as count from public.contact_messages");
    expect(stored.rows[0].count).toBe(CONCURRENT_REQUESTS);
  });
});
