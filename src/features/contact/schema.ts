import { z } from "zod";

/** DB check 제약(contact_messages)과 같은 값을 써서 서버 검증과 DB 제약이 어긋나지 않게 한다. */
export const CONTACT_LIMITS = {
  nameMax: 50,
  emailMax: 254,
  messageMin: 10,
  messageMax: 2000,
} as const;

export const contactMessageSchema = z.object({
  idempotencyKey: z.uuid({ error: "요청 식별자가 올바르지 않습니다." }),
  name: z
    .string({ error: "이름을 입력해 주세요." })
    .trim()
    .min(1, { error: "이름을 입력해 주세요." })
    .max(CONTACT_LIMITS.nameMax, { error: `이름은 ${CONTACT_LIMITS.nameMax}자 이하로 입력해 주세요.` }),
  email: z
    .string({ error: "이메일을 입력해 주세요." })
    .trim()
    .max(CONTACT_LIMITS.emailMax, { error: "이메일이 너무 깁니다." })
    .pipe(z.email({ error: "올바른 이메일 형식이 아닙니다." })),
  message: z
    .string({ error: "메시지를 입력해 주세요." })
    .trim()
    .min(CONTACT_LIMITS.messageMin, { error: `메시지는 ${CONTACT_LIMITS.messageMin}자 이상 입력해 주세요.` })
    .max(CONTACT_LIMITS.messageMax, { error: `메시지는 ${CONTACT_LIMITS.messageMax}자 이하로 입력해 주세요.` }),
  // 사람에게는 보이지 않는 함정 필드. 값이 채워져 있으면 자동 제출(봇)로 판단한다.
  website: z.string().max(200).optional().default(""),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export type ContactFieldErrors = Partial<Record<"name" | "email" | "message" | "idempotencyKey", string>>;

/** zod 오류를 필드별 첫 번째 메시지로 줄여 폼에 바로 표시할 수 있게 만든다. */
export function toFieldErrors(error: z.ZodError): ContactFieldErrors {
  const fieldErrors: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      (field === "name" || field === "email" || field === "message" || field === "idempotencyKey") &&
      !fieldErrors[field]
    ) {
      fieldErrors[field] = issue.message;
    }
  }
  return fieldErrors;
}
