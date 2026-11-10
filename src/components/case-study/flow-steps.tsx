import { Fragment, type CSSProperties } from "react";

import { Reveal } from "@/components/motion/reveal";
import type { FlowStep } from "@/content/case-study-types";

const STEP_DELAY_MS = 140;

export function StepCard({ step }: { step: FlowStep }) {
  return (
    <div
      className={`h-full rounded-md border px-4 py-4 ${
        step.highlighted ? "border-mint bg-mint/10" : "border-line bg-surface"
      }`}
    >
      <p className="text-sm font-bold text-fg">{step.title}</p>
      {step.lines.map((line) => (
        <p key={line} className="mt-1 text-xs leading-relaxed text-muted">
          {line}
        </p>
      ))}
    </div>
  );
}

/** 처리 단계를 왼쪽에서 오른쪽으로 보여준다. 화면에 들어오면 카드와 연결선이 순서대로 나타난다. */
export function FlowSteps({ steps }: { steps: FlowStep[] }) {
  return (
    <Reveal bare className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-0">
      {steps.map((step, stepIndex) => (
        <Fragment key={step.title}>
          {stepIndex > 0 && (
            <div aria-hidden className="flex items-center justify-center md:w-10">
              <span
                className="flow-line hidden h-px w-full bg-subtle/70 md:block"
                style={{ "--reveal-delay": `${stepIndex * STEP_DELAY_MS}ms` } as CSSProperties}
              />
              <span className="text-subtle md:hidden">↓</span>
            </div>
          )}
          <Reveal delay={stepIndex * STEP_DELAY_MS} className="md:flex-1">
            <StepCard step={step} />
          </Reveal>
        </Fragment>
      ))}
    </Reveal>
  );
}
