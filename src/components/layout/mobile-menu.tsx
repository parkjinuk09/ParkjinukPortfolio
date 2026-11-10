"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { SocialLinks } from "@/components/ui/social-links";
import type { SocialLink } from "@/content/types";

import type { NavItem } from "./site-header";

interface MobileMenuProps {
  items: NavItem[];
  socials: SocialLink[];
  linkPrefix: string;
}

/**
 * 휴대폰 화면용 메뉴. 가로 메뉴가 화면을 넘치므로 버튼 하나로 접고,
 * 누르면 참고 사이트처럼 큰 영문 글씨의 전체 화면 메뉴를 연다.
 * 헤더의 backdrop-filter가 fixed 자식의 기준 영역을 헤더로 바꾸므로, 메뉴 화면은 body에 portal로 렌더링한다.
 * 메뉴 화면(z-40)은 헤더(z-50) 아래에 깔려서 헤더의 닫기 버튼이 그대로 보인다.
 */
export function MobileMenu({ items, socials, linkPrefix }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const toggle = toggleRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      toggle?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
        className="grid h-11 w-11 place-items-center rounded-lg border border-zinc-50/10"
      >
        <span aria-hidden className="relative block h-3 w-5">
          <span
            className={`absolute left-0 h-px w-5 bg-zinc-50 transition-transform duration-300 ${isOpen ? "top-1.5 rotate-45" : "top-0"}`}
          />
          <span
            className={`absolute left-0 h-px w-5 bg-zinc-50 transition-transform duration-300 ${isOpen ? "top-1.5 -rotate-45" : "top-3"}`}
          />
        </span>
      </button>

      {isOpen &&
        createPortal(
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="메뉴"
            className="popup-backdrop fixed inset-0 z-40 flex flex-col justify-between bg-charcoal/95 px-6 pt-28 pb-12 backdrop-blur-md"
          >
            <nav aria-label="섹션 이동">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li key={item.anchor}>
                    <a
                      href={`${linkPrefix}#${item.anchor}`}
                      onClick={() => setIsOpen(false)}
                      className="block py-1 font-display text-4xl text-zinc-100 transition-opacity active:opacity-60"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <SocialLinks links={socials} />
          </div>,
          document.body,
        )}
    </>
  );
}
