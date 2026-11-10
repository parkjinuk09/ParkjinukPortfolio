import { connection } from "next/server";

import { apiSuccess } from "@/lib/api/response";
import { readSupabaseConfig } from "@/lib/supabase/config";

/** 배포 환경의 헬스 체크용. 프로세스 생존 여부와 Supabase 설정 여부만 알려주고 비밀 값은 노출하지 않는다. */
export async function GET(): Promise<Response> {
  // 빌드 시점 결과가 고정되지 않도록 매 요청마다 실행한다.
  await connection();
  return apiSuccess({ status: "ok", supabaseConfigured: readSupabaseConfig() !== null });
}
