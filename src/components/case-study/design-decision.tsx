import { Reveal } from "@/components/motion/reveal";
import { RichText } from "@/components/ui/rich-text";
import type { DesignDecision } from "@/content/case-study-types";

import { FlowSteps, StepCard } from "./flow-steps";

/** 작은 민트 제목. 설계 결정 안의 문제 · 해결 흐름 · 보완 구간을 나눈다. */
function PartLabel({ children }: { children: string }) {
  return <p className="mb-3 text-sm font-semibold text-mint">{children}</p>;
}

/** 설계 결정 아래 보충 설명. 각주처럼 흐리게 두면 읽히지 않아 본문과 같은 밝기의 목록으로 보여준다. */
function Notes({ notes }: { notes: string[] }) {
  return (
    <ul className="space-y-2.5 text-[15px] leading-relaxed text-zinc-300">
      {notes.map((note) => (
        <li
          key={note}
          className="relative pl-4 before:absolute before:top-[0.65em] before:left-0 before:h-1 before:w-1 before:rounded-full before:bg-subtle"
        >
          {note}
        </li>
      ))}
    </ul>
  );
}

/**
 * 설계 결정 블록.
 * CapTeam은 배경/선택/관계도 형식, FocusOn은 동시 요청 흐름도 형식이라 데이터에 있는 항목만 그린다.
 */
export function DesignDecisionBlock({
  decision,
}: {
  decision: DesignDecision;
}) {
  return (
    <div>
      <Reveal>
        <h3 className="text-xl font-bold text-fg md:text-2xl">
          {decision.title}
        </h3>
      </Reveal>

      {decision.description && (
        <Reveal className="mt-8">
          <PartLabel>문제</PartLabel>
          <p className="max-w-3xl text-[15px] leading-relaxed text-zinc-300">
            {decision.description}
          </p>
        </Reveal>
      )}

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
                  <Reveal
                    as="li"
                    key={benefit}
                    delay={160 + benefitIndex * 60}
                    className="relative pl-4 before:absolute before:top-[0.6em] before:left-0 before:h-1 before:w-1 before:rounded-full before:bg-subtle"
                  >
                    {benefit}
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {decision.flow && (
        <div className="mt-10">
          <PartLabel>해결 흐름</PartLabel>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {decision.flowInputs && (
              <Reveal className="flex flex-col gap-3 md:w-48 md:shrink-0">
                {decision.flowInputs.map((input) => (
                  <StepCard key={input.title} step={input} />
                ))}
              </Reveal>
            )}
            {decision.flowConnectorLabel && (
              <span className="shrink-0 text-center text-sm font-medium text-mint">
                {decision.flowConnectorLabel} <span aria-hidden>→</span>
              </span>
            )}
            <div className="min-w-0 flex-1">
              <FlowSteps steps={decision.flow} />
            </div>
          </div>
        </div>
      )}

      <Reveal className="mt-10 border-t border-line pt-8">
        <PartLabel>함께 둔 장치 · 검증</PartLabel>
        <Notes notes={decision.notes} />
      </Reveal>
    </div>
  );
}
