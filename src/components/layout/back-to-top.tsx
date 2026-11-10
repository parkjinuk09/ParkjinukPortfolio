"use client";

import { useEffect, useState } from "react";

import { TOP_ANCHOR } from "./site-header";

/** 첫 화면 높이만큼 내려온 뒤부터 버튼을 보여준다. */
const SHOW_AFTER_VIEWPORT_RATIO = 1;

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const update = () => setIsVisible(window.scrollY > window.innerHeight * SHOW_AFTER_VIEWPORT_RATIO);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <a
      href={`#${TOP_ANCHOR}`}
      aria-label="맨 위로 이동"
      tabIndex={isVisible ? 0 : -1}
      className={`fixed right-5 bottom-6 z-40 grid h-12 w-12 place-items-center rounded-full border border-line bg-raised text-fg shadow-lg transition-all duration-500 ease-out-expo hover:border-mint hover:text-mint md:right-8 md:bottom-8 ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span aria-hidden className="text-lg leading-none">↑</span>
    </a>
  );
}
