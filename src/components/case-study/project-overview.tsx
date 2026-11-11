import Image from "next/image";
import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { TechList } from "./tech-list";
import type { CaseStudy } from "@/content/case-study-types";

/**
 * 칸 이름(SERVICE · ROLE · STACK): 16px 흰색 고정폭 글꼴. 굵기 없이 자간과 글꼴로 내용 제목(굵은 글씨)과 구분한다.
 */
function OverviewLabel({ english, korean }: { english: string; korean: string }) {
  return (
    <p className="mb-5 flex items-baseline gap-2 text-base text-fg">
      <span className="font-mono tracking-[0.2em] uppercase">{english}</span>
      <span aria-hidden className="text-subtle">·</span>
      <span>{korean}</span>
    </p>
  );
}

/** 요약 줄의 한 칸: 작은 이름 + 흰색 값 */
function MetaItem({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className="mt-1.5 text-[15px] font-medium text-fg">{children}</dd>
    </div>
  );
}

/**
 * 프로젝트 개요: 처음 몇 초에 볼 내용(무엇을 · 언제 · 누구와 · 무슨 성과)을 맨 위에 모으고,
 * 그 아래 담당 역할(넓게) · 기술 스택(좁게, 백엔드 · 통신 · 개발 도구 · 인프라로 묶음)을 둔다.
 * 색 규칙: 흰색 = 핵심 값, 회색 = 설명, 민트 = 링크 · 역할 분류, 테두리 배지 = 수상 성과
 */
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

      <Reveal>
        <OverviewLabel english="Service" korean="서비스" />
        <h2 className="text-2xl leading-snug font-semibold text-fg md:text-[1.75rem]">{project.service.title}</h2>
        {project.periodNote && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-mint/40 bg-mint/10 px-3 py-1 text-sm font-semibold text-mint">
            <span aria-hidden>★</span>
            {project.periodNote}
          </p>
        )}
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-muted">{project.service.description}</p>
      </Reveal>

      <Reveal delay={80}>
        <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-line py-6 md:grid-cols-4">
          <MetaItem label="작업 기간">
            <span className="font-mono">{project.period}</span>
          </MetaItem>
          <MetaItem label="구성">{project.team.type}</MetaItem>
          <MetaItem label="담당">{project.team.role}</MetaItem>
          {/* 저장소 주소처럼 긴 링크는 휴대폰에서 두 칸 폭을 써서 중간에 끊기지 않게 한다. */}
          <MetaItem label="링크" className="col-span-2 md:col-span-1">
            <a
              href={project.service.link.href}
              target="_blank"
              rel="noreferrer"
              className="break-words text-mint underline-offset-4 hover:underline"
            >
              {project.service.link.label} ↗
            </a>
          </MetaItem>
        </dl>
      </Reveal>

      <div className="mt-16 grid gap-14 lg:grid-cols-[2fr_1fr] lg:gap-16">
        <Reveal>
          <OverviewLabel english="Role" korean="담당 역할" />
          <div className="space-y-8">
            {project.roles.map((group) => (
              <div key={group.title}>
                {/* 역할 분류는 한글 이름도 있어 자간을 넓히지 않는다(한글에 넓은 자간을 주면 글자가 흩어져 보임). */}
                <p className="text-sm font-semibold text-mint">{group.title}</p>
                <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-zinc-200">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="relative pl-4 before:absolute before:top-[0.65em] before:left-0 before:h-1 before:w-1 before:rounded-full before:bg-subtle"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <OverviewLabel english="Stack" korean="기술 스택" />
          <div className="space-y-6">
            {project.stack.map((group) => (
              <div key={group.title}>
                <p className="mb-2 text-sm font-semibold text-mint">{group.title}</p>
                <TechList items={group.items} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>

    </div>
  );
}
