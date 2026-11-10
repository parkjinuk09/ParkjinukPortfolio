import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { ContactMessageInput } from "./schema";

/** PostgreSQL unique_violation. 같은 idempotency_key가 이미 저장된 경우 발생한다. */
const UNIQUE_VIOLATION = "23505";

export type InsertContactMessageResult = "created" | "duplicate";

export class ContactMessageInsertError extends Error {
  constructor(cause: unknown) {
    super("연락 메시지 저장에 실패했습니다.", { cause });
    this.name = "ContactMessageInsertError";
  }
}

/**
 * 연락 메시지를 저장한다.
 * RLS상 anon은 조회 권한이 없으므로 insert 후 행을 돌려받지 않는다(select 없이 insert).
 * 중복 여부는 애플리케이션에서 미리 조회하지 않고 DB unique 제약으로 판단해, 동시 요청에서도 한 건만 저장되게 한다.
 */
export async function insertContactMessage(
  client: SupabaseClient,
  input: Pick<ContactMessageInput, "idempotencyKey" | "name" | "email" | "message">,
): Promise<InsertContactMessageResult> {
  const { error } = await client.from("contact_messages").insert({
    idempotency_key: input.idempotencyKey,
    name: input.name,
    email: input.email,
    message: input.message,
  });

  if (!error) {
    return "created";
  }
  if (error.code === UNIQUE_VIOLATION) {
    return "duplicate";
  }
  throw new ContactMessageInsertError(error);
}
