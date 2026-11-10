/**
 * API 응답 형식을 한곳에서 정의한다.
 * 성공: { success: true, data }
 * 실패: { success: false, error: { code, message, fieldErrors? } }
 */
export type ApiErrorCode =
  | "VALIDATION_FAILED"
  | "INVALID_JSON"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "PAYLOAD_TOO_LARGE"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL_ERROR";

export interface ApiErrorBody {
  success: false;
  error: { code: ApiErrorCode; message: string; fieldErrors?: Record<string, string> };
}

export interface ApiSuccessBody<T> {
  success: true;
  data: T;
}

export function apiSuccess<T>(data: T, status = 200): Response {
  return Response.json({ success: true, data } satisfies ApiSuccessBody<T>, { status });
}

export function apiError(
  status: number,
  code: ApiErrorCode,
  message: string,
  fieldErrors?: Record<string, string>,
): Response {
  const body: ApiErrorBody = { success: false, error: { code, message, ...(fieldErrors && { fieldErrors }) } };
  return Response.json(body, { status });
}
