import { Reveal } from "@/components/motion/reveal";
import { RichText } from "@/components/ui/rich-text";
import type { DesignDecision } from "@/content/case-study-types";

import { FlowSteps, StepCard } from "./flow-steps";

function Notes({ notes }: { notes: string[] }) {
  return (
    <ul className="mt-6 space-y-1 text-xs leading-relaxed text-subtle">
      {notes.map((note) => (
        <li key={note}>* {note}</li>
      ))}
    </ul>
  );
}

/**
 * 설계 결정 블록.
 * CapTeam은 배경/선택/관계도 형식, FocusOn은 동시 요청 흐름도 형식이라 데이터에 있는 항목만 그린다.
 */
export function DesignDecisionBlock({ decision }: { decision: DesignDecision }) {
  return (
    <div>
      <Reveal>
        <h3 className="text-xl font-bold text-fg md:text-2xl">{decision.title}</h3>
        {decision.description && <p className="mt-3 text-sm leading-relaxed text-muted">{decision.description}</p>}
      </Reveal>

      {(decision.background || decision.choice) && (
        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="min-w-0 space-y-6">
            {decision.background && (
              <Reveal>
                <p className="text-sm font-semibold text-mint">배경</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  <RichText value={decision.background} />
                </p>
              </Reveal>
            )}
            {decision.choice && (
              <Reveal delay={80}>
                <p className="text-sm font-semibold text-mint">선택</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  <RichText value={decision.choice} />
                </p>
              </Reveal>
            )}
          </div>
          <div className="min-w-0">
            {decision.diagramCode && (
              <Reveal delay={120}>
                <pre className="overflow-x-auto rounded-md bg-raised p-5 font-mono text-xs leading-relaxed text-fg">
                  {decision.diagramCode}
                </pre>
              </Reveal>
            )}
            {decision.benefits && (
              <ul className="mt-5 space-y-2 text-sm leading-relaxed text-muted">
                {decision.benefits.map((benefit, benefitIndex) => (
                  <Reveal as="li" key={benefit} delay={160 + benefitIndex * 60} className="relative pl-4 before:absolute before:top-[0.6em] before:left-0 before:h-1 before:w-1 before:rounded-full before:bg-subtle">
                    {benefit}
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {decision.flow && (
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
          {decision.flowInputs && (
            <Reveal className="flex flex-col gap-3 md:w-48 md:shrink-0">
              {decision.flowInputs.map((input) => (
                <StepCard key={input.title} step={input} />
              ))}
            </Reveal>
          )}
          {decision.flowConnectorLabel && (
            <span className="shrink-0 text-center font-mono text-xs text-subtle">
              {decision.flowConnectorLabel} <span aria-hidden>→</span>
            </span>
          )}
          <div className="min-w-0 flex-1">
            <FlowSteps steps={decision.flow} />
          </div>
        </div>
      )}

      <Notes notes={decision.notes} />
    </div>
  );
}
