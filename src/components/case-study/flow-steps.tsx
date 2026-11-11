import { Fragment, type CSSProperties } from "react";

import { Reveal } from "@/components/motion/reveal";
import type { FlowStep } from "@/content/case-study-types";

const STEP_DELAY_MS = 140;

/** "POST /sessions"처럼 HTTP 메서드나 경로로 시작하는 줄은 API로 보고 고정폭 글꼴로 구분한다. */
const API_LINE_PATTERN = /^(GET|POST|PUT|PATCH|DELETE)\b|^\//;

/** 단계 카드. order가 있으면 진행 순서 번호를 붙인다. */
export function StepCard({ step, order }: { step: FlowStep; order?: number }) {
  return (
    <div
      className={`h-full rounded-md border px-5 py-5 ${
        step.highlighted ? "border-mint bg-mint/10" : "border-line bg-surface"
      }`}
    >
      {order !== undefined && <p className="mb-2 font-mono text-xs text-mint">{String(order).padStart(2, "0")}</p>}
      <p className="text-base font-semibold text-fg">{step.title}</p>
      <div className="mt-2 space-y-1">
        {step.lines.map((line) => (
          <p key={line} className={`text-sm leading-relaxed text-zinc-300 ${API_LINE_PATTERN.test(line) ? "font-mono text-[13px]" : ""}`}>
            {line}
          </p>
        ))}
      </div>
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
            <StepCard step={step} order={stepIndex + 1} />
          </Reveal>
        </Fragment>
      ))}
    </Reveal>
  );
}
