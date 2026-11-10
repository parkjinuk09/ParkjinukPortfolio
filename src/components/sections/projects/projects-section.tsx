import { PAGE_GUTTER } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Project } from "@/content/types";

import { ProjectSlider, type ProjectCard } from "./project-slider";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  // 클라이언트 컴포넌트에는 카드 표시에 필요한 필드만 넘겨 직렬화되는 데이터를 줄인다.
  const cards: ProjectCard[] = projects.map(({ slug, number, name, tag, oneLiner, teamType, period, stack }) => ({
    slug,
    number,
    name,
    tag,
    oneLiner,
    teamType,
    period,
    stack,
  }));

  return (
    <section id="projects" className={`${PAGE_GUTTER} py-28 md:py-40`}>
      <SectionHeading title="Main Projects" />
      <ProjectSlider cards={cards} />
    </section>
  );
}
