import type { ReactNode } from "react";

import type { SocialKind, SocialLink } from "@/content/types";

/** 선 아이콘(Lucide 기준 24px 그리드). 블로그(Tistory)는 전용 아이콘이 없어 참고 사이트처럼 글자 "B"로 표시한다. */
const ICONS: Record<SocialKind, ReactNode> = {
  github: (
    <>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </>
  ),
  blog: (
    <text x="12" y="17" textAnchor="middle" fontSize="15" fontWeight="700" fill="currentColor" stroke="none">
      B
    </text>
  ),
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  email: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
};

/** 참고 사이트의 아이콘 버튼: 얇은 테두리, 마우스를 올리면 뒤에서 인디고 빛이 번진다. */
export function SocialLinks({ links }: { links: SocialLink[] }) {
  return (
    <ul className="flex gap-2">
      {links.map((link) => {
        const isExternal = link.href.startsWith("http");
        return (
          <li key={link.kind}>
            <a
              href={link.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer" : undefined}
              aria-label={link.label}
              title={link.label}
              className="group relative grid h-9 w-9 place-items-center rounded-lg border border-zinc-50/10 transition-colors duration-100 hover:border-zinc-50/40"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {ICONS[link.kind]}
              </svg>
              <span className="absolute -inset-1 -z-10 scale-0 rounded-full bg-indigo-400/20 blur-md transition-transform duration-300 group-hover:scale-100" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
