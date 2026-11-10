"use client";

import { useEffect, useState } from "react";

import { PAGE_GUTTER } from "./container";

/** 표지 섹션의 id. 페이지 맨 위로 이동하는 링크의 대상이기도 하다. */
export const TOP_ANCHOR = "top";

/** 이 높이(px)보다 내려가면 헤더 배경을 채워 본문 위에서도 글자가 읽히게 한다. */
const SOLID_HEADER_OFFSET = 24;

export interface NavItem {
  label: string;
  anchor: string;
}

interface SiteHeaderProps {
  title: string;
  items: NavItem[];
  githubHref: string;
  email: string;
  /** 메인이 아닌 페이지(프로젝트 상세)에서는 "/"를 넘겨 메인 페이지의 섹션으로 이동하게 한다. */
  linkPrefix?: string;
}

/**
 * 상단 고정 내비게이션.
 * - 현재 보고 있는 섹션을 강조해 긴 페이지에서 위치를 알 수 있게 한다.
 * - 표지 위에서는 투명, 스크롤하면 반투명 배경으로 바뀐다.
 */
export function SiteHeader({ title, items, githubHref, email, linkPrefix = "" }: SiteHeaderProps) {
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);
  const [isSolid, setIsSolid] = useState(false);

  useEffect(() => {
    // 표지(top)도 함께 관찰해, 표지로 돌아오면 강조를 해제한다.
    const sections = [TOP_ANCHOR, ...items.map((item) => item.anchor)]
      .map((anchor) => document.getElementById(anchor))
      .filter((section): section is HTMLElement => section !== null);

    // 화면 중앙선을 지나는 섹션을 현재 섹션으로 본다.
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.find((entry) => entry.isIntersecting);
        if (current) {
          setActiveAnchor(current.target.id === TOP_ANCHOR ? null : current.target.id);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));

    const updateSolid = () => setIsSolid(window.scrollY > SOLID_HEADER_OFFSET);
    updateSolid();
    window.addEventListener("scroll", updateSolid, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateSolid);
    };
  }, [items]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        isSolid ? "bg-charcoal/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className={`${PAGE_GUTTER} flex h-16 items-center gap-6 md:gap-10`}>
        <a href={`${linkPrefix}#${TOP_ANCHOR}`} className="shrink-0 text-[15px] font-medium tracking-tight text-fg">
          {title}
        </a>

        <nav aria-label="섹션 이동" className="min-w-0 flex-1 overflow-x-auto">
          <ul className="flex items-center gap-1 text-sm whitespace-nowrap">
            {items.map((item) => {
              const isActive = activeAnchor === item.anchor;
              return (
                <li key={item.anchor}>
                  <a
                    href={`${linkPrefix}#${item.anchor}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`rounded-full px-3 py-1.5 transition-colors duration-300 ${
                      isActive ? "text-mint" : "text-muted hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <a
            href={githubHref}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-xs font-semibold text-muted transition-colors duration-300 hover:border-mint hover:text-mint"
          >
            git
          </a>
          <a
            href={`mailto:${email}`}
            aria-label="이메일 보내기"
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-sm text-muted transition-colors duration-300 hover:border-mint hover:text-mint"
          >
            @
          </a>
        </div>
      </div>
    </header>
  );
}
