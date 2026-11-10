import "server-only";

import { contactMessageSchema, toFieldErrors, type ContactFieldErrors, type ContactMessageInput } from "./schema";
import type { InsertContactMessageResult } from "./repository";

export type SaveContactMessage = (
  input: Pick<ContactMessageInput, "idempotencyKey" | "name" | "email" | "message">,
) => Promise<InsertContactMessageResult>;

export type SubmitContactResult =
  | { kind: "created" }
  | { kind: "duplicate" }
  | { kind: "ignored" }
  | { kind: "invalid"; fieldErrors: ContactFieldErrors };

/**
 * 연락 메시지 제출 규칙.
 * - 입력 검증에 실패하면 저장하지 않고 필드별 오류를 돌려준다.
 * - 함정 필드가 채워진 요청(봇)은 저장하지 않지만, 봇이 재시도 전략을 학습하지 못하도록 호출 측에는 성공처럼 응답한다.
 * - 같은 idempotencyKey의 재요청은 오류가 아니라 이미 처리된 요청으로 취급한다.
 */
export async function submitContactMessage(
  rawInput: unknown,
  saveContactMessage: SaveContactMessage,
): Promise<SubmitContactResult> {
  const parsed = contactMessageSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { kind: "invalid", fieldErrors: toFieldErrors(parsed.error) };
  }

  const { website, ...message } = parsed.data;
  if (website.trim() !== "") {
    return { kind: "ignored" };
  }

  const saved = await saveContactMessage(message);
  return { kind: saved };
}
