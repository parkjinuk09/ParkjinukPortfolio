import { PAGE_GUTTER } from "@/components/layout/container";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { TechChipList } from "@/components/ui/tech-chip";
import type { Profile } from "@/content/types";
import { roundDownToHundreds } from "@/lib/motion/count-up";

/** 요약 한 묶음: 짧은 안내 문장 + 키워드 목록. 긴 문장을 키워드로 나눠 한눈에 읽히게 한다. */
function SummaryGroup({ lead, items, emphasized = false }: { lead: string; items: string[]; emphasized?: boolean }) {
  return (
    <div>
      <p className="text-sm text-zinc-500">{lead}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className={`rounded-full border px-3 py-1 text-sm ${
              emphasized ? "border-zinc-50/30 font-semibold text-zinc-50" : "border-zinc-50/10 text-zinc-300"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
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
            <SummaryGroup lead={profile.summary.considerationLead} items={profile.summary.considerations} emphasized />
            <div className="mt-8">
              <SummaryGroup lead={profile.summary.experienceLead} items={profile.summary.experiences} />
            </div>
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

          {/* AI 활용: 절차 설계 · 최종 판단 · 결과 검수를 직접 맡는다는 점을 세 줄 요약으로 보여준다. */}
          <div>
            <Reveal>
              <h3 className="font-display text-3xl leading-relaxed font-semibold text-zinc-50">How I work with AI</h3>
              <p className="mt-3 max-w-2xl leading-relaxed text-zinc-400">
                구현은 AI에게 맡기되 작업 절차를 설계하고, 최종 판단을 내리고, 결과물을 검수하는 일은 직접 합니다. 이 사이트도 이 방식으로 만들었습니다.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {profile.aiPractices.map((practice, index) => (
                <Reveal key={practice.title} delay={index * 100}>
                  <h4 className="text-xl font-semibold text-zinc-100">{practice.title}</h4>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-400">{practice.description}</p>
                </Reveal>
              ))}
            </div>
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
