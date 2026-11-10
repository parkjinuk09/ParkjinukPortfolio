"use client";

import { useEffect, useRef, useState } from "react";

import { ContactForm } from "./contact-form";

/**
 * 참고 사이트의 "응원 메세지 남기기" 팝업과 같은 방식으로 연락 폼을 띄운다.
 * Esc 키와 배경 클릭으로 닫히고, 열려 있는 동안 페이지 스크롤을 막는다.
 */
export function ContactPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const openButton = openButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("input, textarea")?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      // 팝업을 닫으면 키보드 사용자가 원래 위치로 돌아오도록 여는 버튼에 포커스를 되돌린다.
      openButton?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={openButtonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 border border-zinc-50/15 p-4 px-5 text-sm text-zinc-50 transition-colors hover:border-zinc-50/50"
      >
        메시지 남기기
        <span aria-hidden>›</span>
      </button>

      {isOpen && (
        <>
          <div className="popup-backdrop fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-popup-title"
            className="popup-panel fixed top-1/2 left-1/2 z-[110] max-h-[90dvh] w-[95%] max-w-[480px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-zinc-50/10 bg-surface p-6 md:p-8"
          >
            <h3 id="contact-popup-title" className="text-lg font-semibold text-zinc-50">
              메시지 남기기
            </h3>
            <p className="mt-2 text-sm text-zinc-400">남겨 주신 이메일로 답장드리겠습니다.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full p-3 text-center text-sm text-zinc-400 transition-colors hover:text-zinc-50"
            >
              닫기
            </button>
          </div>
        </>
      )}
    </>
  );
}
