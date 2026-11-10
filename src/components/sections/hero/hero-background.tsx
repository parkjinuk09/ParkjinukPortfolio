"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

/** 처음 확대 비율. 스크롤하면 이 값에서 조금씩 더 커지며 사진이 천천히 내려간다. */
const BASE_SCALE = 1.14;
const SCROLL_SCALE_PER_PX = 0.00015;
const SCROLL_TRANSLATE_RATIO = 0.35;

interface Star {
  top: number;
  left: number;
  duration: number;
  delay: number;
}

/**
 * 별 위치는 렌더링마다 달라지면 서버/클라이언트 결과가 어긋나므로(hydration 오류) 고정 시드로 만든다.
 * 하늘이 있는 위쪽 2/3 영역에만 흩뿌린다.
 */
function createStars(count: number): Star[] {
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: count }, () => ({
    top: random() * 60,
    left: random() * 100,
    duration: 2.5 + random() * 3,
    delay: random() * 4,
  }));
}

const STARS = createStars(28);

/** 표지 배경: 사용자 사진 + 깜빡이는 별 + 아래로 갈수록 배경색에 녹아드는 그라데이션, 스크롤 시 시차 효과 */
export function HeroBackground({ src }: { src: string }) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollY = Math.min(window.scrollY, window.innerHeight * 1.5);
        const scale = BASE_SCALE + scrollY * SCROLL_SCALE_PER_PX;
        layer.style.transform = `translate3d(0, ${scrollY * SCROLL_TRANSLATE_RATIO}px, 0) scale(${scale})`;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-lvh overflow-hidden">
      <div
        ref={layerRef}
        className="absolute inset-0 transform-gpu will-change-transform"
        style={{ transform: `scale(${BASE_SCALE})` }}
      >
        <Image src={src} alt="" fill priority sizes="100vw" className="hero-photo object-cover object-[50%_62%]" />
        <div className="absolute inset-x-0 top-0 h-2/3">
          {STARS.map((star, index) => (
            <span
              key={index}
              className="star absolute h-1 w-1 rounded-full bg-white shadow-lg shadow-white/50"
              style={
                {
                  top: `${star.top}%`,
                  left: `${star.left}%`,
                  "--twinkle-duration": `${star.duration}s`,
                  "--twinkle-delay": `${star.delay}s`,
                } as CSSProperties
              }
            >
              <span className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-md" />
            </span>
          ))}
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-charcoal/70 to-charcoal" />
      </div>
    </div>
  );
}
