import Image from "next/image";
import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { RichText } from "@/components/ui/rich-text";
import { TechList } from "./tech-list";
import type { CaseStudy } from "@/content/case-study-types";

function OverviewBlock({ title, children, delay = 0 }: { title: string; children: ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <h3 className="mb-3 text-base font-bold text-fg">{title}</h3>
      {children}
    </Reveal>
  );
}

/** 프로젝트 개요(P02, P05): 서비스·기간·기술·구성원·역할·회고 */
export function ProjectOverview({ project }: { project: CaseStudy }) {
  return (
    <div>
      {project.screenshotSrc && project.screenshotWidth && project.screenshotHeight && (
        <Reveal className="mb-16 overflow-hidden rounded-md border border-line bg-white">
          {/* 실제 서비스 화면은 비율이 제각각이라 잘리지 않도록 원본 비율 그대로 보여준다. */}
          <Image
            src={project.screenshotSrc}
            alt={project.screenshotLabel}
            width={project.screenshotWidth}
            height={project.screenshotHeight}
            sizes="(min-width: 1100px) 1100px, 100vw"
            className="h-auto w-full"
          />
        </Reveal>
      )}

      <div className="grid gap-x-16 gap-y-12 md:grid-cols-2">
        <OverviewBlock title="서비스">
          <p className="text-sm font-semibold text-fg">{project.service.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{project.service.description}</p>
          <a
            href={project.service.link.href}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm font-medium text-mint underline-offset-4 hover:underline"
          >
            {project.service.link.label} ↗
          </a>
        </OverviewBlock>

        <OverviewBlock title="작업 기간" delay={80}>
          <p className="font-mono text-sm text-fg">{project.period}</p>
          {project.periodNote && <p className="mt-2 text-sm font-semibold text-mint">{project.periodNote}</p>}
        </OverviewBlock>

        <OverviewBlock title="기술 스택">
          <TechList items={project.stack} />
        </OverviewBlock>

        <OverviewBlock title="구성원" delay={80}>
          <p className="text-sm font-semibold text-fg">{project.team.type}</p>
          <p className="mt-1 text-sm text-muted">{project.team.role}</p>
        </OverviewBlock>

        <OverviewBlock title="역할">
          <div className="space-y-5">
            {project.roles.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-semibold text-fg">{group.title}</p>
                <ul className="mt-2 space-y-1 text-sm leading-relaxed text-muted">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </OverviewBlock>

        <OverviewBlock title="프로젝트 회고" delay={80}>
          <ul className="space-y-3 text-sm leading-relaxed text-muted">
            {project.retrospective.map((line, lineIndex) => (
              <li key={lineIndex} className="relative pl-4 before:absolute before:top-[0.6em] before:left-0 before:h-1 before:w-1 before:rounded-full before:bg-subtle">
                <RichText value={line} />
              </li>
            ))}
          </ul>
        </OverviewBlock>
      </div>
    </div>
  );
}
