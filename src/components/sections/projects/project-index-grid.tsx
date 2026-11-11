"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import type { Project } from "@/content/types";

/** 목차 · 카드에 필요한 필드만 받아 클라이언트로 넘기는 데이터를 줄인다. */
export type ProjectIndexCard = Pick<Project, "slug" | "name" | "oneLiner" | "teamType" | "period" | "imageSrc" | "stack">;

/**
 * 왼쪽 목차 + 오른쪽 카드 목록.
 * 목차의 프로젝트 이름에 마우스를 올리거나 키보드로 포커스하면 같은 이름의 카드가 컬러로 강조되고 나머지는 흐려진다.
 * 반대로 카드에 마우스를 올려도 목차의 같은 이름이 밝아져, 어느 쪽에서 보든 둘이 연결돼 보이게 한다.
 */
export function ProjectIndexGrid({ projects }: { projects: ProjectIndexCard[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // 마우스와 키보드(포커스) 모두 같은 강조를 받도록 한 쌍의 핸들러로 묶는다.
  const highlightHandlers = (slug: string) => ({
    onMouseEnter: () => setActiveSlug(slug),
    onMouseLeave: () => setActiveSlug(null),
    onFocus: () => setActiveSlug(slug),
    onBlur: () => setActiveSlug(null),
  });

  return (
    <div className="relative grid gap-8 md:gap-20 xl:grid-cols-[1fr_3fr] xl:gap-30">
      <nav aria-label="Main Projects 목차" className="xl:mb-9">
        <div className="xl:sticky xl:top-40">
          <p className="font-mono text-xs text-zinc-500">
            Projects <span className="text-zinc-300">({projects.length})</span>
          </p>
          <ol className="mt-5 flex flex-wrap gap-x-8 gap-y-3 xl:flex-col">
            {projects.map((project, index) => {
              const isActive = activeSlug === project.slug;
              return (
                <li key={project.slug}>
                  <Link
                    href={`/projects/${project.slug}`}
                    {...highlightHandlers(project.slug)}
                    className={`group/index flex items-baseline gap-3 py-1 transition-colors duration-200 ${isActive ? "text-zinc-50" : "text-zinc-500"}`}
                  >
                    <span className="font-mono text-xs text-zinc-600">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-base">{project.name}</span>
                    <span
                      aria-hidden
                      className={`text-sm transition-all duration-200 ${isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"}`}
                    >
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>

      <ul className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:gap-12">
        {projects.map((project, index) => {
          const isActive = activeSlug === project.slug;
          const isDimmed = activeSlug !== null && !isActive;
          return (
            <Reveal as="li" key={project.slug} delay={(index % 2) * 120}>
              <Link
                href={`/projects/${project.slug}`}
                {...highlightHandlers(project.slug)}
                data-active={isActive}
                className={`group flex flex-col gap-4 transition-opacity duration-300 ${isDimmed ? "opacity-40" : "opacity-100"}`}
              >
                <div className="relative aspect-[14/9] overflow-hidden rounded-md border border-indigo-300/20 transition-all duration-300 group-data-[active=true]:border-indigo-200 group-data-[active=true]:shadow-[0_5px_30px_rgb(99_102_241/0.25)]">
                  <Image
                    src={project.imageSrc}
                    alt={`${project.name} 대표 이미지`}
                    fill
                    sizes="(min-width: 1280px) 360px, (min-width: 640px) 45vw, 100vw"
                    className="object-cover grayscale transition-all duration-500 group-data-[active=true]:scale-105 group-data-[active=true]:grayscale-0"
                  />
                </div>
                <span className="text-xs text-pink">
                  {project.teamType} · {project.period}
                </span>
                <h3 className="text-lg leading-relaxed font-medium text-zinc-100 group-data-[active=true]:underline">{project.name}</h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-zinc-400">{project.oneLiner}</p>
                <p className="truncate text-xs text-zinc-500">{project.stack.join(" · ")}</p>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
