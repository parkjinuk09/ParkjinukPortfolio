import { PAGE_GUTTER } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import type { Project } from "@/content/types";

import { ProjectIndexGrid, type ProjectIndexCard } from "./project-index-grid";

/**
 * 참고 사이트의 글 목록 영역 구성(제목 · 왼쪽 고정 목차 · 오른쪽 2열 이미지 카드)에 프로젝트를 넣는다.
 * 카드나 목차를 누르면 Figma 형식의 프로젝트 상세 페이지로 이동한다.
 */
export function ProjectGridSection({ projects }: { projects: Project[] }) {
  const cards: ProjectIndexCard[] = projects.map(({ slug, name, oneLiner, teamType, period, imageSrc, stack }) => ({
    slug,
    name,
    oneLiner,
    teamType,
    period,
    imageSrc,
    stack,
  }));

  return (
    <section id="main-projects" className={`${PAGE_GUTTER} py-20 md:py-21`}>
      <div className="flex flex-col gap-10 md:py-20">
        <Reveal>
          <h2 className="mb-5 text-3xl leading-relaxed font-semibold text-zinc-50">Main Projects</h2>
          <p className="max-w-[600px] leading-relaxed text-zinc-400">
            각 프로젝트의 설계 결정과 트러블슈팅은 카드를 눌러 상세 페이지에서 볼 수 있습니다.
          </p>
        </Reveal>

        <ProjectIndexGrid projects={cards} />
      </div>
    </section>
  );
}
