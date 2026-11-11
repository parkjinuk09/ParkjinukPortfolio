"use client";

import { useEffect, useRef, useState } from "react";

import { countUpValue } from "@/lib/motion/count-up";

const COUNT_UP_DURATION_MS = 1600;

interface CountUpProps {
  to: number;
  from?: number;
  className?: string;
}

/**
 * 화면에 들어올 때마다 from → to로 숫자가 오른다. 화면을 벗어나면 from으로 되돌려 다시 내려올 때 또 재생한다.
 * 서버 렌더링과 스크린리더에는 최종 값을 그대로 둔다(애니메이션 숫자는 aria-hidden).
 */
export function CountUp({ to, from = 0, className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [displayValue, setDisplayValue] = useState(to);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frameId = 0;
    const play = () => {
      const startedAt = performance.now();
      const step = (now: number) => {
        const progress = (now - startedAt) / COUNT_UP_DURATION_MS;
        setDisplayValue(countUpValue(from, to, progress));
        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        }
      };
      frameId = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(frameId);
        if (entry?.isIntersecting) {
          play();
        } else {
          setDisplayValue(from);
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(element);
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [from, to]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden className="tabular-nums">
        {displayValue}
      </span>
      <span className="sr-only">{to}</span>
    </span>
  );
}
