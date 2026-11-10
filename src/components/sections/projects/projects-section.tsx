import { PAGE_GUTTER } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import type { Project } from "@/content/types";

import { ProjectSlider, type ProjectCard } from "./project-slider";

export function ProjectsSection({ projects, description }: { projects: Project[]; description: string }) {
  // 클라이언트 컴포넌트에는 카드 표시에 필요한 필드만 넘겨 직렬화되는 데이터를 줄인다.
  const cards: ProjectCard[] = projects.map(({ slug, name, tag, oneLiner, teamType, period, imageSrc }) => ({
    slug,
    name,
    tag,
    oneLiner,
    teamType,
    period,
    imageSrc,
  }));

  return (
    <section id="projects" className={`${PAGE_GUTTER} py-20 md:py-21`}>
      <div className="flex flex-col gap-10 pt-20">
        <Reveal>
          <h2 className="mb-4 text-5xl leading-relaxed font-semibold text-zinc-50">Main Projects</h2>
          <p className="max-w-[600px] leading-relaxed text-zinc-400">{description}</p>
        </Reveal>
        <Reveal delay={100}>
          <ProjectSlider cards={cards} />
        </Reveal>
      </div>
    </section>
  );
}
