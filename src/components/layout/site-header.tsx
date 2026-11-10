"use client";

import { useEffect, useState } from "react";

import { SocialLinks } from "@/components/ui/social-links";

import { PAGE_GUTTER } from "./container";

/** 표지 섹션의 id. 페이지 맨 위로 이동하는 링크의 대상이기도 하다. */
export const TOP_ANCHOR = "top";

/** 이 높이(px)보다 내려가면 헤더 배경을 흐리게 채워 본문 위에서도 글자가 읽히게 한다. */
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
 * 상단 고정 헤더 (참고 사이트 구성: 로고 · 흐린 텍스트 메뉴 · 오른쪽 아이콘 버튼).
 * 현재 보고 있는 섹션의 메뉴는 불투명하게 표시한다.
 */
export function SiteHeader({ title, items, githubHref, email, linkPrefix = "" }: SiteHeaderProps) {
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);
  const [isSolid, setIsSolid] = useState(false);

  useEffect(() => {
    // 다른 페이지(linkPrefix 사용)에서는 메뉴가 메인 페이지 섹션을 가리키므로 현재 섹션 강조를 하지 않는다.
    const sections = (linkPrefix ? [] : [TOP_ANCHOR, ...items.map((item) => item.anchor)])
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
  }, [items, linkPrefix]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        isSolid ? "bg-charcoal/70 backdrop-blur-md" : "bg-zinc-700/[0.01]"
      }`}
    >
      <div className={`${PAGE_GUTTER} flex h-16 items-center gap-8 md:gap-16`}>
        <a href={`${linkPrefix}#${TOP_ANCHOR}`} className="shrink-0 text-base text-white">
          {title}
        </a>

        <nav aria-label="섹션 이동" className="min-w-0 flex-1 overflow-x-auto">
          <ul className="flex items-center gap-8 text-sm whitespace-nowrap">
            {items.map((item) => {
              const isActive = activeAnchor === item.anchor;
              return (
                <li key={item.anchor}>
                  <a
                    href={`${linkPrefix}#${item.anchor}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`text-white transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden shrink-0 sm:block">
          <SocialLinks githubHref={githubHref} email={email} />
        </div>
      </div>
    </header>
  );
}
