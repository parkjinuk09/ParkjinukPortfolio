import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";

import { ContactMessageInsertError, insertContactMessage } from "./repository";

function clientReturning(error: { code: string; message: string } | null) {
  const insert = vi.fn().mockResolvedValue({ error });
  const from = vi.fn().mockReturnValue({ insert });
  return { client: { from } as unknown as SupabaseClient, from, insert };
}

const input = {
  idempotencyKey: "4f1c1d0e-8a2b-4c3d-9e8f-123456789abc",
  name: "홍길동",
  email: "visitor@example.com",
  message: "포트폴리오 잘 봤습니다.",
};

describe("insertContactMessage", () => {
  it("DB 컬럼명으로 변환해 contact_messages에 저장한다", async () => {
    const { client, from, insert } = clientReturning(null);

    await expect(insertContactMessage(client, input)).resolves.toBe("created");
    expect(from).toHaveBeenCalledWith("contact_messages");
    expect(insert).toHaveBeenCalledWith({
      idempotency_key: input.idempotencyKey,
      name: input.name,
      email: input.email,
      message: input.message,
    });
  });

  it("unique 위반(23505)은 중복 요청으로 판단한다", async () => {
    const { client } = clientReturning({ code: "23505", message: "duplicate key" });

    await expect(insertContactMessage(client, input)).resolves.toBe("duplicate");
  });

  it("그 밖의 오류는 ContactMessageInsertError로 감싸 던진다", async () => {
    const { client } = clientReturning({ code: "42501", message: "permission denied" });

    await expect(insertContactMessage(client, input)).rejects.toBeInstanceOf(ContactMessageInsertError);
  });
});
