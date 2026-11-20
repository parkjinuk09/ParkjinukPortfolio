"use client";

import Image from "next/image";
import { useState } from "react";

import type { Screenshot } from "@/content/case-study-types";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

/**
 * 프로젝트 화면 넘겨보기. 이미지 양옆 가운데의 화살표(또는 아래 점)로 다른 화면을 본다.
 * 끝에서 다음을 누르면 처음으로 돌아간다. 상자 높이는 첫 화면 비율로 고정해, 넘길 때 아래 내용이 들썩이지 않게 한다.
 * 화면이 하나뿐이면 화살표 없이 이미지만 보여준다.
 */
export function ScreenshotGallery({ screenshots }: { screenshots: Screenshot[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = screenshots.length;
  const first = screenshots[0];
  if (!first) return null;

  const goTo = (index: number) => setCurrentIndex((index + total) % total);
  const hasMany = total > 1;

  return (
    <div aria-roledescription={hasMany ? "carousel" : undefined} aria-label="프로젝트 화면">
      <div
        className="group relative overflow-hidden rounded-md border border-line bg-white"
        style={{ aspectRatio: `${first.width} / ${first.height}` }}
      >
        {screenshots.map((shot, index) => (
          <Image
            key={shot.src}
            src={shot.src}
            alt={shot.label}
            fill
            sizes="(min-width: 1320px) 1240px, 100vw"
            priority={index === 0}
            aria-hidden={index !== currentIndex}
            className={`object-contain transition-opacity duration-500 ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
          />
        ))}

        {hasMany && (
          <>
            {(["left", "right"] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                onClick={() => goTo(currentIndex + (direction === "left" ? -1 : 1))}
                aria-label={direction === "left" ? "이전 화면" : "다음 화면"}
                className={`absolute top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-zinc-900/70 text-zinc-50 backdrop-blur transition-opacity hover:bg-zinc-900/90 focus-visible:opacity-100 md:h-12 md:w-12 md:opacity-0 md:group-hover:opacity-100 ${
                  direction === "left" ? "left-2 md:left-4" : "right-2 md:right-4"
                }`}
              >
                <ChevronIcon direction={direction} />
              </button>
            ))}
          </>
        )}
      </div>

      {hasMany && (
        <div className="mt-3 flex items-center justify-between gap-4 text-xs text-subtle">
          <p aria-live="polite">{screenshots[currentIndex]?.label}</p>
          <div className="flex shrink-0 items-center gap-2">
            {screenshots.map((shot, index) => (
              <button
                key={shot.src}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`${index + 1}번째 화면 보기`}
                aria-current={index === currentIndex}
                className={`h-1.5 rounded-full transition-all ${index === currentIndex ? "w-5 bg-mint" : "w-1.5 bg-zinc-600 hover:bg-zinc-400"}`}
              />
            ))}
            <span className="ml-1 font-mono">
              {currentIndex + 1} / {total}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
