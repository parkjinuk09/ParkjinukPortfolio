"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Project } from "@/content/types";

/** 프로젝트 카드 슬라이더에 필요한 최소 정보만 받는다. */
export type ProjectCard = Pick<Project, "slug" | "name" | "tag" | "oneLiner" | "teamType" | "period" | "imageSrc">;

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-10 w-10 text-zinc-50/80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

/**
 * 참고 사이트의 프로젝트 슬라이더: 왼쪽 이미지 + 오른쪽 설명, 현재 카드 외에는 흑백·반투명,
 * 좌우 화살표는 본문 밖에 두고 아래에 "현재 / 전체" 번호를 표시한다. 카드를 누르면 상세 페이지로 이동한다.
 */
export function ProjectSlider({ cards }: { cards: ProjectCard[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastIndex = cards.length - 1;

  const goTo = (index: number) => setCurrentIndex(Math.min(Math.max(index, 0), lastIndex));

  return (
    <div className="relative items-start gap-20 lg:flex" aria-roledescription="carousel" aria-label="프로젝트 목록">
      <button
        type="button"
        onClick={() => goTo(currentIndex - 1)}
        disabled={currentIndex === 0}
        aria-label="이전 프로젝트"
        className="absolute top-[40%] -left-5 z-20 hidden -translate-x-1/2 -translate-y-1/2 rounded-full p-2 transition-opacity hover:opacity-100 disabled:pointer-events-none disabled:opacity-30 md:block md:opacity-60 lg:-left-12"
      >
        <ChevronIcon direction="left" />
      </button>
      <button
        type="button"
        onClick={() => goTo(currentIndex + 1)}
        disabled={currentIndex === lastIndex}
        aria-label="다음 프로젝트"
        className="absolute top-[40%] -right-5 z-20 hidden translate-x-1/2 -translate-y-1/2 rounded-full p-2 transition-opacity hover:opacity-100 disabled:pointer-events-none disabled:opacity-30 md:block md:opacity-60 lg:-right-12"
      >
        <ChevronIcon direction="right" />
      </button>

      <div className="w-full overflow-hidden">
        <ul className="flex gap-5 transition-transform duration-700 ease-out-expo" style={{ transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 1.25}rem))` }}>
          {cards.map((card, index) => {
            const isActive = index === currentIndex;
            return (
              <li key={card.slug} aria-roledescription="slide" aria-label={`${index + 1} / ${cards.length}`} aria-hidden={!isActive} className="w-full shrink-0">
                <Link
                  href={`/projects/${card.slug}`}
                  tabIndex={isActive ? 0 : -1}
                  className={`group grid w-full gap-10 rounded-xl transition-all duration-500 md:grid-cols-2 ${isActive ? "opacity-100 grayscale-0" : "opacity-50 grayscale"}`}
                >
                  <div className="relative aspect-[8/5] overflow-hidden rounded-lg">
                    <Image
                      src={card.imageSrc}
                      alt={`${card.name} 대표 이미지`}
                      fill
                      sizes="(min-width: 1100px) 530px, (min-width: 768px) 45vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className={`flex flex-col gap-2 transition-opacity md:py-15 ${isActive ? "opacity-100" : "opacity-0"}`}>
                    <span className="text-xs text-pink">{card.tag}</span>
                    <h3 className="text-3xl font-semibold text-zinc-50 group-hover:underline">{card.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">{card.oneLiner}</p>
                    <p className="mt-6 flex gap-2 text-[0.85rem] text-zinc-400">
                      <span>{card.teamType}</span>
                      <span aria-hidden>•</span>
                      <span>{card.period}</span>
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex items-end gap-1 text-zinc-50" aria-live="polite">
          <span className="text-3xl">{currentIndex + 1}</span>
          <span className="pb-1 text-sm text-zinc-400">/ {cards.length}</span>
        </div>

        <div className="mt-4 flex gap-3 md:hidden">
          <button type="button" onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0} aria-label="이전 프로젝트" className="rounded-full border border-zinc-50/15 p-1 disabled:opacity-30">
            <ChevronIcon direction="left" />
          </button>
          <button type="button" onClick={() => goTo(currentIndex + 1)} disabled={currentIndex === lastIndex} aria-label="다음 프로젝트" className="rounded-full border border-zinc-50/15 p-1 disabled:opacity-30">
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </div>
  );
}
