import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Client, Pool } from "pg";

const SUPABASE_DIR = resolve(import.meta.dirname, "../../supabase");
const TEST_DATABASE_NAME = "portfolio_db_test";

/**
 * 관리자 접속 URL. 실제 Supabase 프로젝트가 아니라 테스트 전용 PostgreSQL을 가리켜야 한다.
 * 테스트가 데이터베이스를 지우고 다시 만들기 때문이다.
 */
export function readAdminDatabaseUrl(): string {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) {
    throw new Error("TEST_DATABASE_URL이 없습니다. 테스트 전용 PostgreSQL 관리자 접속 URL을 지정해 주세요.");
  }
  return url;
}

function withDatabase(url: string, database: string): string {
  const parsed = new URL(url);
  parsed.pathname = `/${database}`;
  return parsed.toString();
}

/** 문장을 하나씩 실행한다. DROP/CREATE DATABASE는 트랜잭션 블록(여러 문장을 한 번에 보내는 경우) 안에서 실행할 수 없다. */
async function runAsAdmin(url: string, statements: string[]): Promise<void> {
  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    for (const statement of statements) {
      await client.query(statement);
    }
  } finally {
    await client.end();
  }
}

/**
 * 테스트 DB를 새로 만들고 Supabase와 같은 순서(마이그레이션 → seed)로 스키마를 적용한다.
 * Supabase가 기본 제공하는 anon/authenticated 역할을 만들어 RLS를 실제와 같은 조건에서 검증한다.
 */
export async function createTestDatabase(): Promise<string> {
  const adminUrl = readAdminDatabaseUrl();

  await runAsAdmin(adminUrl, [
    `drop database if exists ${TEST_DATABASE_NAME} with (force)`,
    `create database ${TEST_DATABASE_NAME}`,
    `do $$ begin
      if not exists (select from pg_roles where rolname = 'anon') then create role anon nologin; end if;
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
    end $$`,
  ]);

  const testUrl = withDatabase(adminUrl, TEST_DATABASE_NAME);
  const migrationsDir = resolve(SUPABASE_DIR, "migrations");
  const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  // Supabase는 public 스키마 사용 권한을 anon/authenticated에 기본으로 준다.
  const setupSql = [
    "grant usage on schema public to anon, authenticated;",
    ...migrationFiles.map((file) => readFileSync(resolve(migrationsDir, file), "utf8")),
    readFileSync(resolve(SUPABASE_DIR, "seed.sql"), "utf8"),
  ].join("\n");

  await runAsAdmin(testUrl, [setupSql]);
  return testUrl;
}

export async function dropTestDatabase(): Promise<void> {
  await runAsAdmin(readAdminDatabaseUrl(), [`drop database if exists ${TEST_DATABASE_NAME} with (force)`]);
}

/** 각 연결을 지정한 역할로 전환하는 풀. API 요청이 PostgREST를 거쳐 anon 역할로 실행되는 상황을 재현한다. */
export function createRolePool(url: string, role: "anon" | "authenticated", max: number): Pool {
  // 접속 시작 파라미터로 역할을 지정해 모든 쿼리가 처음부터 해당 역할 권한으로 실행되게 한다.
  return new Pool({ connectionString: url, max, options: `-c role=${role}` });
}
