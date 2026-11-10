import Image from "next/image";
import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { RichText } from "@/components/ui/rich-text";
import type { Project, RichText as RichTextValue, Troubleshooting } from "@/content/types";

import { CapTeamDiagram } from "./capteam-diagram";

/** Notion 콜아웃 한 개에 해당하는 패널 */
function Panel({ icon, title, children }: { icon: string; title: ReactNode; children: ReactNode }) {
  return (
    <Reveal as="section" className="rounded-2xl border border-line bg-surface p-6 md:p-9">
      <h4 className="flex items-start gap-3 text-lg leading-snug font-bold text-fg md:text-xl">
        <span aria-hidden>{icon}</span>
        <span>{title}</span>
      </h4>
      <div className="mt-5 border-t border-line pt-6">{children}</div>
    </Reveal>
  );
}

function Bullets({ items }: { items: RichTextValue[] }) {
  return (
    <ul className="space-y-2.5 text-sm leading-relaxed text-muted">
      {items.map((item, index) => (
        <li key={index} className="relative pl-4 before:absolute before:top-[0.65em] before:left-0 before:h-1 before:w-1 before:rounded-full before:bg-subtle">
          <RichText value={item} />
        </li>
      ))}
    </ul>
  );
}

function Paragraphs({ items }: { items: RichTextValue[] }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-muted">
      {items.map((item, index) => (
        <p key={index}>
          <RichText value={item} />
        </p>
      ))}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-charcoal p-4 font-mono text-xs leading-relaxed text-fg">{code}</pre>
  );
}

function StepHeading({ icon, label }: { icon: string; label: string }) {
  return (
    <p className="mb-3 text-sm font-bold text-fg">
      <span aria-hidden className="mr-2">
        {icon}
      </span>
      {label}
    </p>
  );
}

/** 트러블슈팅: Notion과 같은 문제 → 원인 → 해결 → 결과 → 배운 점 순서 */
function TroubleshootingBody({ troubleshooting }: { troubleshooting: Troubleshooting }) {
  return (
    <div className="space-y-8">
      <div>
        <StepHeading icon="❌" label="문제" />
        <Paragraphs items={troubleshooting.problem.slice(0, 1)} />
        {troubleshooting.problemCode && (
          <div className="my-4">
            <CodeBlock code={troubleshooting.problemCode} />
          </div>
        )}
        {troubleshooting.problem.length > 1 && <Paragraphs items={troubleshooting.problem.slice(1)} />}
      </div>
      <div>
        <StepHeading icon="⚠️" label="원인" />
        <Paragraphs items={troubleshooting.cause} />
      </div>
      <div>
        <StepHeading icon="✅" label={troubleshooting.result ? "해결" : "해결 및 검증"} />
        <Bullets items={troubleshooting.solution} />
        {troubleshooting.solutionCode && (
          <div className="mt-4">
            <CodeBlock code={troubleshooting.solutionCode} />
          </div>
        )}
      </div>
      {troubleshooting.result && (
        <div>
          <StepHeading icon="📌" label="결과" />
          {troubleshooting.resultAsList ? (
            <Bullets items={troubleshooting.result} />
          ) : (
            <Paragraphs items={troubleshooting.result} />
          )}
        </div>
      )}
      {troubleshooting.lesson && (
        <div>
          <StepHeading icon="🧐" label="배운 점" />
          <Paragraphs items={troubleshooting.lesson} />
        </div>
      )}
    </div>
  );
}

/** 프로젝트 상세: Notion 「Main Projects」의 콜아웃 구성을 그대로 따른다. */
export function ProjectDetail({ project }: { project: Project }) {
  const { architecture, designDecision } = project;
  const hasArchitectureVisual = Boolean(architecture.imageSrc) || architecture.showDiagram;
  const hasMultipleTroubleshooting = project.troubleshooting.length > 1;

  return (
    <article id={project.slug} className="scroll-mt-20 border-t border-line pt-20 md:pt-28">
      <Reveal>
        <p className="font-mono text-sm text-mint">{project.number}.</p>
        <h3 className="mt-2 font-display text-4xl font-bold tracking-tight text-fg md:text-5xl">{project.name}</h3>
        <p className="mt-5 max-w-3xl text-base leading-relaxed font-semibold text-fg md:text-lg">{project.oneLiner}</p>
      </Reveal>

      <Reveal delay={100}>
        <dl className="mt-8 grid gap-3 text-sm sm:grid-cols-[6rem_minmax(0,1fr)]">
          <dt className="font-semibold text-subtle">기간</dt>
          <dd className="text-muted">
            {project.period} · {project.teamType} · 역할 / <strong className="font-semibold text-fg">{project.role}</strong>
          </dd>
          <dt className="font-semibold text-subtle">기술 스택</dt>
          <dd className="text-muted">{project.stack.join(", ")}</dd>
          <dt className="font-semibold text-subtle">프로젝트 링크</dt>
          <dd>
            <a href={project.link.href} target="_blank" rel="noreferrer" className="break-all text-mint hover:underline">
              {project.link.label} ↗
            </a>
          </dd>
        </dl>
      </Reveal>

      <div className="mt-12 space-y-6">
        <Panel icon="📌" title="프로젝트 요약">
          <p className="text-[15px] leading-relaxed font-semibold text-fg">{project.summary.lead}</p>
          <div className="mt-5">
            <Bullets items={project.summary.items.map((item) => [item])} />
          </div>
        </Panel>

        {hasArchitectureVisual && (
          <Panel icon="🗺️" title={architecture.title}>
            {architecture.imageSrc ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-charcoal">
                <Image
                  src={architecture.imageSrc}
                  alt={`${project.name} ${architecture.title}`}
                  fill
                  sizes="(min-width: 1024px) 960px, 100vw"
                  className="object-contain"
                />
              </div>
            ) : (
              <CapTeamDiagram />
            )}
            {architecture.note && (
              <p className="mt-6 text-sm leading-relaxed text-muted">
                <RichText value={architecture.note} />
              </p>
            )}
          </Panel>
        )}

        <Panel icon="🔨" title="핵심 구현">
          <ul className="space-y-3 text-sm leading-relaxed text-muted">
            {project.coreImplementation.map((item, index) => (
              <li key={index} className="relative pl-4 before:absolute before:top-[0.65em] before:left-0 before:h-1 before:w-1 before:rounded-full before:bg-mint">
                {item.label && <strong className="font-semibold text-fg">{item.label}: </strong>}
                <RichText value={item.text} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel icon="🧠" title={<>설계 결정: <RichText value={designDecision.title} /></>}>
          <div className="space-y-6 text-sm leading-relaxed text-muted">
            <div>
              <p className="mb-2 font-bold text-fg">배경</p>
              <p>
                <RichText value={designDecision.background} />
              </p>
            </div>
            <div>
              <p className="mb-2 font-bold text-fg">선택 및 적용 방식</p>
              <p>
                <RichText value={designDecision.choice} />
              </p>
            </div>
            {designDecision.code && <CodeBlock code={designDecision.code} />}
            {designDecision.reasons && (
              <div>
                <p className="mb-3 font-bold text-fg">선택 이유 및 효과</p>
                <Bullets items={designDecision.reasons.map((reason) => [reason])} />
              </div>
            )}
            {designDecision.verification && (
              <div>
                <p className="mb-2 font-bold text-fg">검증</p>
                <p>
                  <RichText value={designDecision.verification} />
                </p>
              </div>
            )}
            {designDecision.followUp && (
              <p className="text-xs text-subtle italic">
                <strong className="font-semibold">후속 검증 항목: </strong>
                {designDecision.followUp}
              </p>
            )}
          </div>
        </Panel>

        {project.troubleshooting.map((troubleshooting, index) => (
          <Panel
            key={troubleshooting.title}
            icon="🛠️"
            title={`트러블슈팅${hasMultipleTroubleshooting ? ` ${index + 1}` : ""}: ${troubleshooting.title}`}
          >
            <TroubleshootingBody troubleshooting={troubleshooting} />
          </Panel>
        ))}

        <Panel icon="🧐" title="배운 점">
          {project.lessons.length > 1 ? <Bullets items={project.lessons} /> : <Paragraphs items={project.lessons} />}
        </Panel>
      </div>
    </article>
  );
}
