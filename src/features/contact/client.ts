import type { ContactFieldErrors } from "./schema";

export interface ContactPayload {
  idempotencyKey: string;
  name: string;
  email: string;
  message: string;
  website: string;
}

export type ContactSubmitOutcome =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: ContactFieldErrors };

const NETWORK_ERROR_MESSAGE = "네트워크 오류로 전송하지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.";
const UNKNOWN_ERROR_MESSAGE = "메시지를 보내지 못했습니다. 잠시 후 다시 시도해 주세요.";

/** 화면 컴포넌트가 fetch·응답 형식을 몰라도 되도록 연락 메시지 API 호출을 감싼다. */
export async function sendContactMessage(payload: ContactPayload): Promise<ContactSubmitOutcome> {
  let response: Response;
  try {
    response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, message: NETWORK_ERROR_MESSAGE };
  }

  if (response.ok) {
    return { ok: true };
  }

  const body: unknown = await response.json().catch(() => null);
  if (body && typeof body === "object" && "error" in body) {
    const error = (body as { error: { message?: string; fieldErrors?: ContactFieldErrors } }).error;
    return { ok: false, message: error.message ?? UNKNOWN_ERROR_MESSAGE, fieldErrors: error.fieldErrors };
  }
  return { ok: false, message: UNKNOWN_ERROR_MESSAGE };
}
