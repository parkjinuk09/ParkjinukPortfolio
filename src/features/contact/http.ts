import "server-only";

import { apiError, apiSuccess } from "@/lib/api/response";

import { submitContactMessage, type SaveContactMessage } from "./service";

/** 메시지 최대 2000자(한글 3바이트) + 다른 필드를 넉넉히 감싸는 크기. 이보다 큰 본문은 파싱 전에 거절한다. */
export const MAX_CONTACT_BODY_BYTES = 16 * 1024;

export interface ContactHandlerDeps {
  /** Supabase가 설정되지 않았으면 null. 이 경우 메시지를 받을 수 없으므로 503으로 응답한다. */
  saveContactMessage: SaveContactMessage | null;
}

/** POST /api/contact 요청을 검증하고 서비스 결과를 HTTP 응답으로 변환한다. */
export async function handleContactRequest(request: Request, deps: ContactHandlerDeps): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return apiError(415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type은 application/json이어야 합니다.");
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_CONTACT_BODY_BYTES) {
    return apiError(413, "PAYLOAD_TOO_LARGE", "요청 본문이 너무 큽니다.");
  }

  const rawBody = await request.text();
  // content-length 헤더는 생략·위조될 수 있으므로 실제 본문 크기도 다시 확인한다.
  if (new TextEncoder().encode(rawBody).byteLength > MAX_CONTACT_BODY_BYTES) {
    return apiError(413, "PAYLOAD_TOO_LARGE", "요청 본문이 너무 큽니다.");
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return apiError(400, "INVALID_JSON", "요청 본문이 올바른 JSON이 아닙니다.");
  }

  if (!deps.saveContactMessage) {
    return apiError(503, "SERVICE_UNAVAILABLE", "지금은 메시지를 받을 수 없습니다. 이메일로 연락해 주세요.");
  }

  try {
    const result = await submitContactMessage(body, deps.saveContactMessage);
    switch (result.kind) {
      case "invalid":
        return apiError(400, "VALIDATION_FAILED", "입력값을 확인해 주세요.", result.fieldErrors);
      case "created":
        return apiSuccess({ status: "received" }, 201);
      case "duplicate":
      case "ignored":
        return apiSuccess({ status: "received" }, 200);
    }
  } catch (error) {
    console.error("[contact] 메시지 저장 실패", error);
    return apiError(500, "INTERNAL_ERROR", "메시지를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }
}
