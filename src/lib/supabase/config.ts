import "server-only";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Supabase 접속 정보를 환경 변수에서 읽는다.
 * 브라우저에서 Supabase를 직접 호출하지 않으므로 NEXT_PUBLIC_ 접두사를 쓰지 않고 서버에서만 읽는다.
 * 두 값 중 하나라도 없으면 null을 반환해 호출 측이 미설정 상태를 명시적으로 처리하게 한다.
 */
export function readSupabaseConfig(env: Readonly<Record<string, string | undefined>> = process.env): SupabaseConfig | null {
  const url = env.SUPABASE_URL?.trim();
  const anonKey = env.SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}
