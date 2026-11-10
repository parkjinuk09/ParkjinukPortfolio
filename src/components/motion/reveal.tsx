"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** 같은 묶음 안에서 순차적으로 등장시키기 위한 지연(ms). */
  delay?: number;
  /** 등장 애니메이션 없이 data-visible만 갱신한다. 선 그리기처럼 자식이 직접 애니메이션할 때 사용한다. */
  bare?: boolean;
}

/**
 * 요소가 화면에 들어오면 data-visible="true"를 붙여 CSS 전환을 시작한다.
 * 한 번 등장한 뒤에는 관찰을 멈춰 스크롤을 되돌려도 다시 숨겨지지 않는다.
 */
export function Reveal({ children, as: Tag = "div", className = "", delay = 0, bare = false }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // 요소가 뷰포트 하단에서 약간 올라왔을 때 시작해야 등장이 자연스럽다.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties;

  return (
    <Tag
      ref={ref}
      className={`${bare ? "" : "reveal"} ${className}`.trim()}
      data-visible={visible}
      style={style}
    >
      {children}
    </Tag>
  );
}
