import { PAGE_GUTTER } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { RichText } from "@/components/ui/rich-text";
import { TechChipList } from "@/components/ui/tech-chip";
import type { Profile } from "@/content/types";

function ValueLabel({ index }: { index: number }) {
  return <span className="text-[10px] text-zinc-500">value {String(index).padStart(2, "0")}</span>;
}

interface AboutSectionProps {
  profile: Profile;
  awardCount: number;
}

/**
 * About: 참고 사이트와 같이 인사말 → 왼쪽(요약 + 버튼 고정) / 오른쪽(수치 · 강점 · Stack) 3:1 구성.
 * 수치는 Notion 내용(수상 목록 수, 첫 팀 프로젝트 연도)에서 가져온다.
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
            <p className="leading-relaxed text-zinc-400">
              <RichText value={profile.summary} />
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
              <p className="mt-2 text-5xl leading-none font-semibold text-zinc-100">2026 ~</p>
              <p className="mt-6 leading-relaxed text-zinc-400">
                CapTeam · FocusOn 팀 프로젝트에서 백엔드를 맡아 ERD · API 명세 · JWT 인증 · 채팅 · 배포를 경험했습니다.
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
