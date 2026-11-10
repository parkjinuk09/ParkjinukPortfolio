import { Reveal } from "@/components/motion/reveal";
import { SectionTitle } from "@/components/ui/section-title";
import type { Project } from "@/content/types";

import { ApiPolicyTable } from "./api-policy-table";
import { ArchitectureDiagram } from "./architecture-diagram";
import { DesignDecisionBlock } from "./design-decision";
import { FlowSteps } from "./flow-steps";
import { ProjectOverview } from "./project-overview";
import { TroubleshootingList } from "./troubleshooting-list";

/** 하위 블록 사이 간격과 구분선. 블록이 데이터에 없으면 구분선도 그리지 않는다. */
function Divider() {
  return (
    <Reveal bare className="my-20 md:my-28">
      <div className="rule-draw h-px bg-line" />
    </Reveal>
  );
}

/** 프로젝트 한 건(개요 → 구조 → 인증 흐름 → 설계 결정 → API 정책 → 트러블슈팅) */
export function ProjectSection({ project }: { project: Project }) {
  return (
    <section id={project.slug} className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-36">
        <SectionTitle
          number={project.order}
          title={project.name}
          eyebrow={`Project ${project.order}`}
          description={project.summary}
        />

        <ProjectOverview project={project} />

        {project.architecture && (
          <>
            <Divider />
            <Reveal>
              <h3 className="mb-8 text-xl font-bold text-ink md:text-2xl">시스템 구성</h3>
            </Reveal>
            <ArchitectureDiagram architecture={project.architecture} />
          </>
        )}

        {project.authFlow && (
          <>
            <Divider />
            <Reveal>
              <h3 className="mb-8 text-xl font-bold text-ink md:text-2xl">{project.authFlow.title}</h3>
            </Reveal>
            <FlowSteps steps={project.authFlow.steps} />
            <ul className="mt-6 space-y-1 text-xs leading-relaxed text-subtle">
              {project.authFlow.notes.map((note) => (
                <li key={note}>* {note}</li>
              ))}
            </ul>
          </>
        )}

        {project.designDecision && (
          <>
            <Divider />
            <DesignDecisionBlock decision={project.designDecision} />
          </>
        )}

        {project.apiPolicy && (
          <>
            <Divider />
            <ApiPolicyTable rows={project.apiPolicy} />
          </>
        )}

        <Divider />
        <TroubleshootingList cases={project.troubleshooting} lesson={project.lesson} />
      </div>
    </section>
  );
}
