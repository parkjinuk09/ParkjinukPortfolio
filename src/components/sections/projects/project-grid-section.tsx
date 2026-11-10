import Image from "next/image";
import Link from "next/link";

import { PAGE_GUTTER } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import type { Project } from "@/content/types";

/**
 * 참고 사이트의 글 목록 영역 구성(제목 · 왼쪽 고정 분류 · 오른쪽 2열 이미지 카드)에 프로젝트를 넣는다.
 * 카드를 누르면 Figma 형식의 프로젝트 상세 페이지로 이동한다.
 */
export function ProjectGridSection({ projects }: { projects: Project[] }) {
  return (
    <section id="main-projects" className={`${PAGE_GUTTER} py-20 md:py-21`}>
      <div className="flex flex-col gap-10 py-20">
        <Reveal>
          <h2 className="mb-5 text-3xl leading-relaxed font-semibold text-zinc-50">Main Projects</h2>
          <p className="max-w-[600px] leading-relaxed text-zinc-400">
            각 프로젝트의 설계 결정과 트러블슈팅은 카드를 눌러 상세 페이지에서 볼 수 있습니다.
          </p>
        </Reveal>

        <div className="relative grid gap-20 xl:grid-cols-[1fr_3fr] xl:gap-30">
          <div className="xl:mb-9">
            <div className="flex flex-wrap items-start gap-3 xl:sticky xl:top-40 xl:flex-col">
              <span className="border border-zinc-50/15 px-5 py-4 text-sm text-zinc-50">Projects {projects.length}</span>
              {projects.map((project) => (
                <span key={project.slug} className="text-sm text-zinc-500">
                  {project.name}
                </span>
              ))}
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:gap-12">
            {projects.map((project, index) => (
              <Reveal as="li" key={project.slug} delay={(index % 2) * 120}>
                <Link href={`/projects/${project.slug}`} className="group flex flex-col gap-4">
                  <div className="relative aspect-[14/9] overflow-hidden rounded-md border border-indigo-300/20 transition-all duration-300 group-hover:border-indigo-200 group-hover:shadow-[0_5px_30px_rgb(99_102_241/0.25)]">
                    <Image
                      src={project.imageSrc}
                      alt={`${project.name} 대표 이미지`}
                      fill
                      sizes="(min-width: 1280px) 360px, (min-width: 640px) 45vw, 100vw"
                      className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  </div>
                  <span className="text-xs text-pink">
                    {project.teamType} · {project.period}
                  </span>
                  <h3 className="text-lg leading-relaxed font-medium text-zinc-100 group-hover:underline">{project.name}</h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-zinc-400">{project.oneLiner}</p>
                  <p className="truncate text-xs text-zinc-500">{project.stack.join(" · ")}</p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
