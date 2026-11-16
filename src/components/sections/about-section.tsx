import { PAGE_GUTTER } from "@/components/layout/container";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { TechChipList } from "@/components/ui/tech-chip";
import type { Profile } from "@/content/types";
import { roundDownToHundreds } from "@/lib/motion/count-up";

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

          {/* AI 활용: 세 원칙을 세로 카드 3개로 나란히 두고, 확인 가능한 결과 · 근거만 덧붙인다. */}
          <div>
            <Reveal>
              <h3 className="font-display text-3xl leading-relaxed font-semibold text-zinc-50">How I work with AI</h3>
              <p className="mt-3 max-w-2xl leading-relaxed text-zinc-400">AI에게는 실행을 맡기고, 기준 · 판단 · 책임은 제가 가집니다.</p>
            </Reveal>
            {/* 미리보기: 박스 없이 세 단계를 선과 화살표로 잇는다. */}
            <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-0">
              {[
                { title: "기준 설계", body: "구조와 검증 기준을 먼저 정의" },
                { title: "AI 구현", body: "정한 기준대로 구현 · 테스트 실행" },
                { title: "직접 검증", body: "결과를 분석하고 머지 여부 판단" },
              ].map((step, index) => (
                <Reveal as="li" key={step.title} delay={index * 100} className="relative md:pr-10">
                  <div className="flex items-center gap-4">
                    <p className="shrink-0 text-xl font-semibold text-zinc-50">{step.title}</p>
                    {index < 2 && (
                      <span aria-hidden className="hidden flex-1 items-center text-zinc-500 md:flex">
                        <span className="h-px flex-1 bg-zinc-50/20" />
                        <span className="-ml-1 text-sm">→</span>
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{step.body}</p>
                </Reveal>
              ))}
            </ol>

            <Reveal className="mt-12 grid gap-6 border-t border-zinc-50/15 pt-10 md:grid-cols-[auto_1fr] md:items-end md:gap-16">
              <p className="text-5xl leading-none font-semibold whitespace-nowrap text-zinc-100">
                0.2% <span className="text-zinc-500">→</span> <span className="text-mint">0%</span>
              </p>
              <div className="text-sm leading-relaxed">
                <p className="text-base font-semibold text-zinc-50">AI Todo · 부하 테스트 실패율</p>
                <p className="mt-1 text-zinc-400">경쟁 상태(check-then-act)를 찾아 UPSERT로 수정</p>
                <p className="mt-1 text-zinc-500">k6 · 동시 사용자 50명 · 30초 · 같은 조건에서 재측정</p>
              </div>
            </Reveal>
          </div>

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
