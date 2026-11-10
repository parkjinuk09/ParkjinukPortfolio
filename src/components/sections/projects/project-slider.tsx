"use client";

import { useState } from "react";

import type { Project } from "@/content/types";

/** 프로젝트 카드 슬라이더에 필요한 최소 정보만 받는다. 상세 내용은 서버 컴포넌트가 아래에 렌더링한다. */
export type ProjectCard = Pick<Project, "slug" | "number" | "name" | "tag" | "oneLiner" | "teamType" | "period" | "stack">;

/** 카드 왼쪽 영역. 서비스 화면 이미지가 없으므로 프로젝트 이름과 기술을 크게 배치한 표지로 대신한다. */
function CardCover({ card }: { card: ProjectCard }) {
  return (
    <div className="relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-xl border border-line bg-gradient-to-br from-raised to-surface p-6 md:p-8">
      <span className="font-mono text-xs text-subtle">PROJECT {card.number}</span>
      <p className="font-display text-4xl font-bold tracking-tight text-fg md:text-5xl">{card.name}</p>
      <p className="truncate text-xs text-subtle">{card.stack.join(" · ")}</p>
      <span aria-hidden className="absolute -right-10 -bottom-16 h-48 w-48 rounded-full bg-mint/10 blur-3xl" />
    </div>
  );
}

function ArrowButton({ direction, onClick, disabled }: { direction: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "이전 프로젝트" : "다음 프로젝트"}
      className="grid h-11 w-11 place-items-center rounded-full border border-line text-lg text-muted transition-colors duration-300 hover:border-mint hover:text-mint disabled:pointer-events-none disabled:opacity-30"
    >
      <span aria-hidden>{direction === "prev" ? "‹" : "›"}</span>
    </button>
  );
}

/** 프로젝트를 한 장씩 넘겨 보는 카드. 각 카드는 아래 상세 섹션으로 이동하는 링크다. */
export function ProjectSlider({ cards }: { cards: ProjectCard[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastIndex = cards.length - 1;

  return (
    <div>
      <div className="overflow-hidden" aria-roledescription="carousel" aria-label="프로젝트 목록">
        <ul
          className="flex transition-transform duration-700 ease-out-expo"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {cards.map((card, index) => (
            <li
              key={card.slug}
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${cards.length}`}
              aria-hidden={index !== currentIndex}
              className="w-full shrink-0"
            >
              <a
                href={`#${card.slug}`}
                tabIndex={index === currentIndex ? 0 : -1}
                className="group grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12"
              >
                <div className="transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]">
                  <CardCover card={card} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-pink">{card.tag}</p>
                  <h3 className="mt-2 text-3xl font-bold text-fg transition-colors group-hover:text-mint md:text-4xl">
                    {card.name}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{card.oneLiner}</p>
                  <p className="mt-6 text-xs text-subtle">
                    {card.teamType} · {card.period}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-fg">
                    자세히 보기
                    <span aria-hidden className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <p className="font-display text-fg" aria-live="polite">
          <span className="text-3xl font-semibold">{currentIndex + 1}</span>
          <span className="ml-1 text-sm text-subtle">/ {cards.length}</span>
        </p>
        <div className="flex gap-3">
          <ArrowButton direction="prev" disabled={currentIndex === 0} onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))} />
          <ArrowButton
            direction="next"
            disabled={currentIndex === lastIndex}
            onClick={() => setCurrentIndex((index) => Math.min(index + 1, lastIndex))}
          />
        </div>
      </div>
    </div>
  );
}
