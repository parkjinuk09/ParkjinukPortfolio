import { PAGE_GUTTER } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { TechChipList } from "@/components/ui/tech-chip";
import type { Profile } from "@/content/types";

function ValueLabel({ index }: { index: number }) {
  return <span className="text-[10px] text-zinc-500">value {String(index).padStart(2, "0")}</span>;
}

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
  awardCount: number;
}

/**
 * About: 참고 사이트와 같이 인사말 → 왼쪽(요약 + 버튼 고정) / 오른쪽(수치 · 강점 · Stack) 3:1 구성.
 * 수치는 수상 목록 수와 개발을 시작한 연도(2023)를 쓴다.
 */
export function AboutSection({ profile, awardCount }: AboutSectionProps) {
  return (
    <section id="about" className={`${PAGE_GUTTER} py-20 md:py-21`}>
      <Reveal>
        <h2 className="text-3xl leading-relaxed font-semibold text-zinc-50">
          안녕하세요!
          <br />
          백엔드 개발자 {profile.name} 입니다.
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-20 lg:grid-cols-[1fr_3fr] lg:gap-16">
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

        <div className="flex flex-col gap-24">
          <div className="grid gap-12 md:grid-cols-2">
            <Reveal>
              <ValueLabel index={1} />
              <p className="mt-2 text-5xl leading-none font-semibold text-zinc-100">
                {awardCount}
                <span className="ml-1 text-2xl">회 수상</span>
              </p>
              <p className="mt-6 leading-relaxed text-zinc-400">
                교내 캡스톤 프로젝트 대상, 여수 해커톤 정보통신기획평가원장상(최우수상) 등 해커톤·프로젝트 대회에서 수상했습니다.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <ValueLabel index={2} />
              <p className="mt-2 text-5xl leading-none font-semibold text-zinc-100">2023 ~</p>
              <p className="mt-6 leading-relaxed text-zinc-400">
                2023년 개발을 시작해, 지금은 CapTeam · FocusOn 팀 프로젝트에서 Spring Boot 백엔드를 맡고 있습니다.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {profile.strengths.map((strength, index) => (
              <Reveal key={strength.title} delay={index * 100}>
                <ValueLabel index={index + 1} />
                <h3 className="mt-2 text-xl font-semibold text-zinc-100">{strength.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">{strength.description}</p>
              </Reveal>
            ))}
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
