"use client";

import { useId, useRef, useState } from "react";

import type { StackSkill } from "@/content/types";

/**
 * 기술 이름 → 컬러 로고 파일(public/icons/tech, Devicon MIT 라이선스).
 * Spring Boot는 Devicon의 Spring 로고를, AWS EC2는 AWS 로고를 쓴다. 로고가 없는 기술은 첫 글자 배지로 대신한다.
 */
const TECH_ICON_FILES: Record<string, string> = {
  Java: "java",
  "Spring Boot": "spring",
  MySQL: "mysql",
  PostgreSQL: "postgresql",
  Redis: "redis",
  Docker: "docker",
  "AWS EC2": "aws",
  React: "react",
  NestJS: "nestjs",
  Nginx: "nginx",
  "GitHub Actions": "githubactions",
};

function TechIcon({ name }: { name: string }) {
  const file = TECH_ICON_FILES[name];
  if (!file) {
    return (
      <span aria-hidden className="grid h-5 w-5 place-items-center rounded bg-zinc-50/10 text-[10px] font-bold text-zinc-300">
        {name.charAt(0)}
      </span>
    );
  }
  // 평소에는 흑백으로 두고, 칩에 마우스를 올리면 로고 원래 색이 보이게 한다.
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 20px 정적 SVG라 next/image 최적화가 필요 없다.
    <img
      src={`/icons/tech/${file}.svg`}
      alt=""
      width={20}
      height={20}
      className="h-5 w-5 opacity-70 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0"
    />
  );
}

/** 말풍선 가로 위치. 기본은 칩 가운데, 화면 가장자리에 걸리면 칩의 왼쪽 · 오른쪽 끝에 맞춘다. */
type TooltipAlign = "center" | "start" | "end";

/** 화면 가장자리와 말풍선 사이에 남길 여백 */
const VIEWPORT_MARGIN = 16;
const TOOLTIP_MAX_WIDTH = 240;

const ALIGN_CLASSES: Record<TooltipAlign, { box: string; arrow: string }> = {
  center: { box: "left-1/2 -translate-x-1/2", arrow: "left-1/2" },
  start: { box: "left-0", arrow: "left-5" },
  end: { box: "right-0", arrow: "right-5 translate-x-1/2" },
};

/** 칩 위치를 보고 말풍선이 화면 밖으로 나가지 않는 정렬을 고른다. */
function chooseAlign(chip: HTMLElement): TooltipAlign {
  const rect = chip.getBoundingClientRect();
  const halfTooltip = TOOLTIP_MAX_WIDTH / 2;
  const centerX = rect.left + rect.width / 2;
  if (centerX - halfTooltip < VIEWPORT_MARGIN) return "start";
  if (centerX + halfTooltip > window.innerWidth - VIEWPORT_MARGIN) return "end";
  return "center";
}

/**
 * 참고 사이트의 기술 칩: 아이콘 + 소문자 이름. 마우스를 올리거나(휴대폰은 탭) 키보드로 포커스하면
 * 위쪽에 인디고 말풍선으로 이름과 사용 수준 한 줄을 보여준다.
 * 말풍선은 열릴 때만 그려서, 숨어 있는 동안 화면 밖으로 삐져나가 가로 스크롤을 만들지 않게 한다.
 */
export function TechChip({ skill }: { skill: StackSkill }) {
  const chipRef = useRef<HTMLLIElement | null>(null);
  const [align, setAlign] = useState<TooltipAlign | null>(null);
  const levelId = useId();

  const open = () => {
    if (chipRef.current) setAlign(chooseAlign(chipRef.current));
  };
  const close = () => setAlign(null);

  return (
    <li
      ref={chipRef}
      tabIndex={0}
      aria-describedby={levelId}
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
      className="group relative flex cursor-default items-center gap-2 rounded-lg border border-zinc-50/10 bg-zinc-50/[0.03] px-3 py-2 transition-colors duration-300 outline-none hover:border-zinc-50/30 focus-visible:border-indigo-300"
    >
      <TechIcon name={skill.name} />
      <span className="text-xs text-zinc-400 transition-colors group-hover:text-zinc-100 group-focus:text-zinc-100">
        {skill.name.toLowerCase()}
      </span>
      {/* 스크린리더는 말풍선이 열리지 않아도 수준 설명을 읽을 수 있다. */}
      <span id={levelId} className="sr-only">
        {skill.level}
      </span>

      {align && (
        <span aria-hidden className={`pointer-events-none absolute bottom-full z-30 mb-2.5 ${ALIGN_CLASSES[align].box}`}>
          <span className="tooltip-in relative block w-max max-w-[240px] rounded-md border border-zinc-700 bg-indigo-500/90 px-3 py-1.5 text-xs leading-relaxed text-zinc-50 shadow-md">
            <span className="font-semibold">{skill.name.toLowerCase()}</span>
            <br />
            {skill.level}
            <span
              className={`absolute top-full block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px] bg-indigo-500 ${ALIGN_CLASSES[align].arrow}`}
            />
          </span>
        </span>
      )}
    </li>
  );
}

export function TechChipList({ items }: { items: StackSkill[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <TechChip key={item.name} skill={item} />
      ))}
    </ul>
  );
}
