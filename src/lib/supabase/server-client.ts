import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { SupabaseConfig } from "./config";

/**
 * anon 키로 서버 전용 클라이언트를 만든다.
 * 로그인 기능이 없어 세션을 저장할 필요가 없으므로 auth 세션 유지를 끈다.
 * 권한 범위는 RLS 정책(수상/활동 조회, 연락 메시지 작성)으로만 제한된다.
 */
export function createSupabaseServerClient(config: SupabaseConfig): SupabaseClient {
  return createClient(config.url, config.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
