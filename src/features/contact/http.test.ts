import { describe, expect, it, vi } from "vitest";

import { handleContactRequest, MAX_CONTACT_BODY_BYTES } from "./http";
import { ContactMessageInsertError } from "./repository";
import type { SaveContactMessage } from "./service";

const validBody = {
  idempotencyKey: "4f1c1d0e-8a2b-4c3d-9e8f-123456789abc",
  name: " 홍길동 ",
  email: "visitor@example.com",
  message: "포트폴리오 잘 봤습니다. 연락드립니다.",
  website: "",
};

function jsonRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  it("유효한 메시지는 공백을 정리해 저장하고 201을 반환한다", async () => {
    const save = vi.fn<SaveContactMessage>().mockResolvedValue("created");

    const response = await handleContactRequest(jsonRequest(validBody), { saveContactMessage: save });

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ success: true, data: { status: "received" } });
    expect(save).toHaveBeenCalledWith({
      idempotencyKey: validBody.idempotencyKey,
      name: "홍길동",
      email: "visitor@example.com",
      message: validBody.message,
    });
  });

  it("같은 idempotencyKey의 재요청은 오류 없이 200으로 처리한다", async () => {
    const save = vi.fn<SaveContactMessage>().mockResolvedValue("duplicate");

    const response = await handleContactRequest(jsonRequest(validBody), { saveContactMessage: save });

    expect(response.status).toBe(200);
  });

  it("함정 필드가 채워진 요청은 저장하지 않고 성공처럼 응답한다", async () => {
    const save = vi.fn<SaveContactMessage>();

    const response = await handleContactRequest(jsonRequest({ ...validBody, website: "http://spam.example" }), {
      saveContactMessage: save,
    });

    expect(response.status).toBe(200);
    expect(save).not.toHaveBeenCalled();
  });

  it("필드 검증에 실패하면 필드별 오류와 함께 400을 반환한다", async () => {
    const save = vi.fn<SaveContactMessage>();

    const response = await handleContactRequest(
      jsonRequest({ ...validBody, name: "   ", email: "not-an-email", message: "짧음" }),
      { saveContactMessage: save },
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe("VALIDATION_FAILED");
    expect(Object.keys(body.error.fieldErrors).sort()).toEqual(["email", "message", "name"]);
    expect(save).not.toHaveBeenCalled();
  });

  it("idempotencyKey가 UUID가 아니면 400을 반환한다", async () => {
    const response = await handleContactRequest(jsonRequest({ ...validBody, idempotencyKey: "abc" }), {
      saveContactMessage: vi.fn<SaveContactMessage>(),
    });

    expect(response.status).toBe(400);
    expect((await response.json()).error.fieldErrors.idempotencyKey).toBeDefined();
  });

  it("JSON이 아닌 Content-Type은 415를 반환한다", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "hello",
    });

    const response = await handleContactRequest(request, { saveContactMessage: vi.fn<SaveContactMessage>() });

    expect(response.status).toBe(415);
  });

  it("깨진 JSON은 400 INVALID_JSON을 반환한다", async () => {
    const response = await handleContactRequest(jsonRequest("{ broken"), {
      saveContactMessage: vi.fn<SaveContactMessage>(),
    });

    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe("INVALID_JSON");
  });

  it("본문이 최대 크기를 넘으면 content-length가 없어도 413을 반환한다", async () => {
    const oversized = JSON.stringify({ ...validBody, message: "가".repeat(MAX_CONTACT_BODY_BYTES) });

    const response = await handleContactRequest(jsonRequest(oversized), {
      saveContactMessage: vi.fn<SaveContactMessage>(),
    });

    expect(response.status).toBe(413);
  });

  it("Supabase가 설정되지 않았으면 503을 반환한다", async () => {
    const response = await handleContactRequest(jsonRequest(validBody), { saveContactMessage: null });

    expect(response.status).toBe(503);
    expect((await response.json()).error.code).toBe("SERVICE_UNAVAILABLE");
  });

  it("저장 중 예상하지 못한 오류는 내부 정보를 숨기고 500을 반환한다", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const save = vi.fn<SaveContactMessage>().mockRejectedValue(new ContactMessageInsertError({ code: "XX000" }));

    const response = await handleContactRequest(jsonRequest(validBody), { saveContactMessage: save });

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("XX000");
  });
});
