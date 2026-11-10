"use client";

import { useEffect, useState } from "react";

/** 표지 섹션의 id. 페이지 맨 위로 이동하는 링크의 대상이기도 하다. */
const TOP_ANCHOR = "top";

export interface NavItem {
  label: string;
  anchor: string;
}

interface SiteHeaderProps {
  name: string;
  items: NavItem[];
}

/**
 * 상단 고정 내비게이션.
 * - 현재 보고 있는 섹션을 강조해 긴 페이지에서 위치를 알 수 있게 한다.
 * - 상단의 얇은 선으로 전체 스크롤 진행률을 보여준다.
 */
export function SiteHeader({ name, items }: SiteHeaderProps) {
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

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

    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
      });
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [items]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-5 md:px-10">
        <a href={`#${TOP_ANCHOR}`} className="shrink-0 font-serif text-lg font-medium tracking-tight text-ink">
          {name}
        </a>
        <nav aria-label="섹션 이동" className="-mr-2 min-w-0 overflow-x-auto">
          <ul className="flex items-center gap-1 text-sm whitespace-nowrap">
            {items.map((item) => {
              const isActive = activeAnchor === item.anchor;
              return (
                <li key={item.anchor}>
                  <a
                    href={`#${item.anchor}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative rounded-full px-3 py-1.5 transition-colors duration-300 ${
                      isActive ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-3 -bottom-0.5 h-px bg-accent transition-transform duration-500 ease-out-expo ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-[-1px] h-0.5 origin-left bg-accent"
        style={{ transform: `scaleX(${progress})` }}
      />
    </header>
  );
}
