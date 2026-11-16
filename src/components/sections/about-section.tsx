import Link from "next/link";

import { PAGE_GUTTER } from "@/components/layout/container";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { TechChipList } from "@/components/ui/tech-chip";
import type { AiWorkflow, Profile } from "@/content/types";
import { roundDownToHundreds } from "@/lib/motion/count-up";

const CASE_ROW_LABELS = [
  ["원인", "cause"],
  ["해결", "fix"],
  ["검증", "verification"],
] as const;

/**
 * How I work with AI.
 * - 세 단계는 같은 머리줄(번호 + 선 + 화살표)을 써서 제목 · 설명의 시작 높이가 모두 같다. 마지막 단계는 선 대신 빈 자리를 둔다.
 * - 사례는 왼쪽(수치) : 오른쪽(무엇을 해결했는지) = 2 : 3으로, 두 칸 모두 같은 크기의 작은 제목에서 시작해 윗선이 맞는다.
 */
function AiWorkflowBlock({ workflow }: { workflow: AiWorkflow }) {
  const { case: workflowCase } = workflow;

  return (
    <div>
      <Reveal>
        <h3 className="font-display text-3xl leading-relaxed font-semibold text-zinc-50">How I work with AI</h3>
        <p className="mt-3 max-w-2xl leading-relaxed text-zinc-400">{workflow.summary}</p>
      </Reveal>

      <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0">
        {workflow.steps.map((step, index) => {
          const isLast = index === workflow.steps.length - 1;
          return (
            <Reveal as="li" key={step.title} delay={index * 100} className="md:pr-8">
              <div className="flex h-6 items-center gap-4">
                <span className="font-mono text-sm text-mint">{String(index + 1).padStart(2, "0")}</span>
                {!isLast && (
                  <span aria-hidden className="hidden flex-1 items-center gap-1 text-zinc-500 md:flex">
                    <span className="h-px flex-1 bg-zinc-50/20" />
                    <span className="text-xs">→</span>
                  </span>
                )}
              </div>
              <p className="mt-4 text-xl font-semibold text-zinc-50">{step.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.detail}</p>
            </Reveal>
          );
        })}
      </ol>

      <Reveal className="mt-14 border-t border-zinc-50/15 pt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h4 className="text-xl font-semibold text-zinc-50">실제 문제 해결 사례</h4>
          <span className="text-sm text-mint">{workflowCase.project}</span>
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-[2fr_3fr] md:gap-16">
          <div>
            <p className="text-sm text-zinc-400">{workflowCase.metricLabel}</p>
            <p className="mt-3 text-5xl leading-none font-semibold whitespace-nowrap text-zinc-100">
              {workflowCase.before} <span className="text-3xl text-zinc-500">→</span> <span className="text-mint">{workflowCase.after}</span>
            </p>
            {/* 0%는 이 조건에서 실패가 관측되지 않았다는 뜻이므로 조건을 숫자 바로 아래에 붙여 둔다. */}
            <p className="mt-4 text-sm text-zinc-500">{workflowCase.condition}</p>
          </div>

          <div>
            <p className="text-sm text-zinc-400">{workflowCase.title}</p>
            <dl className="mt-3 space-y-3">
              {CASE_ROW_LABELS.map(([label, key]) => (
                <div key={key} className="grid grid-cols-[2.5rem_1fr] gap-3 leading-relaxed">
                  <dt className="font-semibold text-mint">{label}</dt>
                  <dd className="text-zinc-200">{workflowCase[key]}</dd>
                </div>
              ))}
            </dl>
            <Link
              href={workflowCase.link.href}
              className="mt-6 ml-[calc(2.5rem_+_0.75rem)] inline-block text-sm text-zinc-400 underline-offset-4 transition-colors hover:text-mint hover:underline"
            >
              {workflowCase.link.label} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

interface AboutSectionProps {
  profile: Profile;
}

/** 개발을 시작한 해. 숫자 애니메이션은 2000년부터 올라와 연도처럼 읽히게 한다. */
const DEVELOPMENT_START_YEAR = 2025;
const YEAR_COUNT_FROM = 2000;

/**
 * About: 참고 사이트와 같이 인사말 → 왼쪽(요약 + 버튼 고정) / 오른쪽(수치 · 강점 · Stack) 3:1 구성.
 * 수치는 GitHub 최근 1년 기여 수(백 단위로 내려 "900+")와 개발을 시작한 연도를 쓰고, 화면에 들어올 때마다 숫자가 오른다.
 */
export function AboutSection({ profile }: AboutSectionProps) {
  const contributions = profile.githubContributionsLastYear;

  return (
    <section id="about" className={`${PAGE_GUTTER} py-20 md:py-21`}>
      <Reveal>
        <h2 className="text-3xl leading-relaxed font-semibold text-zinc-50">
          안녕하세요!
          <br />
          백엔드 개발자 {profile.name} 입니다.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-14 md:mt-16 md:gap-20 lg:grid-cols-[1fr_3fr] lg:gap-16">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <Reveal>
            {/* 상자 대신 문장으로 읽히게 하고, 고려하는 네 가지만 흰색 굵은 글씨로 강조한다. */}
            <p className="text-lg leading-relaxed text-zinc-400">
              {profile.summary.before}{" "}
              {/* 키워드 하나가 두 줄로 쪼개지지 않도록 키워드마다 줄바꿈을 막고, 구분점 앞뒤에서만 줄이 바뀌게 한다. */}
              {profile.summary.keywords.map((keyword, index) => (
                <span key={keyword}>
                  {index > 0 && " · "}
                  <strong className="font-semibold whitespace-nowrap text-zinc-50">{keyword}</strong>
                </span>
              ))}
              {profile.summary.after}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <a
              href="#contact"
              className="mt-10 inline-flex items-center gap-2 border border-zinc-50/15 px-5 py-4 text-sm text-zinc-50 transition-colors hover:border-zinc-50/50"
            >
              Contact me
              <span aria-hidden>›</span>
            </a>
          </Reveal>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          <div className="grid gap-12 md:grid-cols-2">
            <Reveal>
              <p className="text-5xl leading-none font-semibold text-zinc-100">
                <CountUp to={roundDownToHundreds(contributions)} />+
                <span className="ml-2 text-2xl">contributions</span>
              </p>
              <p className="mt-6 leading-relaxed text-zinc-400">
                <a href={profile.github.href} target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-zinc-200 hover:underline">
                  GitHub
                </a>
                에서 지난 1년 동안 {contributions} contributions를 기록했습니다.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-5xl leading-none font-semibold text-zinc-100">
                <CountUp from={YEAR_COUNT_FROM} to={DEVELOPMENT_START_YEAR} /> ~
              </p>
              <p className="mt-6 leading-relaxed text-zinc-400">
                {DEVELOPMENT_START_YEAR}년 개발을 시작해, 지금은 CapTeam · FocusOn 팀 프로젝트에서 Spring Boot 백엔드를 맡고 있습니다.
              </p>
            </Reveal>
          </div>

          {/* AI 활용: 박스 없이 세 단계 흐름(선 · 화살표)과 실제 사례 하나(전 → 후 수치 + 원인 · 해결 · 검증)를 보여준다. */}
          <AiWorkflowBlock workflow={profile.aiWorkflow} />

          <div>
            <Reveal>
              <h3 className="font-display text-3xl leading-relaxed font-semibold text-zinc-50">Stack</h3>
            </Reveal>
            <div className="mt-10 flex flex-col gap-14">
              <Reveal>
                <h4 className="font-display text-xl font-semibold text-zinc-200">Primary Stack</h4>
                <div className="mt-6">
                  <TechChipList items={profile.primaryStack} />
                </div>
              </Reveal>
              <Reveal>
                <h4 className="font-display text-xl font-semibold text-zinc-200">Also Used</h4>
                <div className="mt-6">
                  <TechChipList items={profile.alsoUsed} />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
