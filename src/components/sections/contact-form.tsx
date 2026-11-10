"use client";

import { useRef, useState, type FormEvent } from "react";

import { sendContactMessage } from "@/features/contact/client";
import { CONTACT_LIMITS, contactMessageSchema, toFieldErrors, type ContactFieldErrors } from "@/features/contact/schema";

type FormStatus = "idle" | "submitting" | "success" | "error";

const inputClassName =
  "mt-2 w-full rounded-md border bg-charcoal px-4 py-3 text-sm text-fg outline-none transition-colors duration-300 placeholder:text-subtle focus:border-mint";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }
  return (
    <p id={id} className="mt-2 text-xs text-pink">
      {message}
    </p>
  );
}

/**
 * 연락 폼.
 * idempotencyKey는 "보내려는 메시지 한 건"을 식별한다. 첫 제출 시점에 발급하고, 실패 후 재시도할 때는 같은 키를 유지해
 * 서버에 이미 저장된 경우에도 중복 저장되지 않게 한다. 전송에 성공하면 비워서 다음 메시지가 새 키를 받게 한다.
 * (렌더링 중에 무작위 값을 만들면 정적 프리렌더 결과에 고정되므로 이벤트 핸들러에서 발급한다.)
 */
export function ContactForm() {
  const idempotencyKeyRef = useRef<string | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    idempotencyKeyRef.current ??= crypto.randomUUID();
    const payload = {
      idempotencyKey: idempotencyKeyRef.current,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    // 서버와 같은 스키마로 먼저 검사해 불필요한 요청을 줄인다. 최종 검증은 서버가 다시 한다.
    const parsed = contactMessageSchema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      setStatus("idle");
      return;
    }

    setFieldErrors({});
    setErrorMessage(null);
    setStatus("submitting");

    const outcome = await sendContactMessage(payload);
    if (outcome.ok) {
      form.reset();
      idempotencyKeyRef.current = null;
      setStatus("success");
      return;
    }

    setFieldErrors(outcome.fieldErrors ?? {});
    setErrorMessage(outcome.message);
    setStatus("error");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6" aria-describedby="contact-form-status">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block text-sm font-semibold text-fg">
          이름
          <input
            name="name"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.nameMax}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby="contact-name-error"
            className={`${inputClassName} ${fieldErrors.name ? "border-pink" : "border-line"}`}
          />
          <FieldError id="contact-name-error" message={fieldErrors.name} />
        </label>
        <label className="block text-sm font-semibold text-fg">
          이메일
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={CONTACT_LIMITS.emailMax}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby="contact-email-error"
            className={`${inputClassName} ${fieldErrors.email ? "border-pink" : "border-line"}`}
          />
          <FieldError id="contact-email-error" message={fieldErrors.email} />
        </label>
      </div>

      <label className="block text-sm font-semibold text-fg">
        메시지
        <textarea
          name="message"
          rows={6}
          maxLength={CONTACT_LIMITS.messageMax}
          placeholder={`${CONTACT_LIMITS.messageMin}자 이상 입력해 주세요.`}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby="contact-message-error"
          className={`${inputClassName} resize-y ${fieldErrors.message ? "border-pink" : "border-line"}`}
        />
        <FieldError id="contact-message-error" message={fieldErrors.message} />
      </label>

      {/* 봇 방지용 함정 필드: 화면과 보조기기에서 모두 숨긴다. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p id="contact-form-status" role="status" aria-live="polite" className="text-sm">
          {status === "success" && <span className="text-mint">메시지를 보냈습니다. 확인 후 이메일로 답장드리겠습니다.</span>}
          {status === "error" && errorMessage && <span className="text-pink">{errorMessage}</span>}
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-fg px-7 py-3 text-sm font-semibold text-charcoal transition-colors duration-300 hover:bg-mint disabled:cursor-wait disabled:opacity-60"
        >
          {status === "submitting" ? "보내는 중…" : "메시지 보내기"}
          <span aria-hidden className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
