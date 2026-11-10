import type { CSSProperties } from "react";

import { Reveal } from "@/components/motion/reveal";
import type { IndexEntry, Profile } from "@/content/types";

const COVER_TITLE = "Portfolio";
const LETTER_STAGGER_MS = 45;

interface HeroSectionProps {
  profile: Profile;
  index: IndexEntry[];
}

/** 표지(P00): 제목, 소개 한 줄, 목차. 목차 항목은 해당 섹션으로 이동하는 링크다. */
export function HeroSection({ profile, index }: HeroSectionProps) {
  return (
    <section id="top" className="mx-auto max-w-6xl px-5 pt-32 pb-24 md:px-10 md:pt-44 md:pb-32">
      <Reveal className="font-mono text-xs tracking-[0.2em] text-accent uppercase">Backend Developer</Reveal>

      <h1 aria-label={COVER_TITLE} className="mt-6 overflow-hidden pb-2 font-serif text-[clamp(4.5rem,17vw,13rem)] leading-[0.9] font-medium tracking-[-0.045em] text-ink">
        {COVER_TITLE.split("").map((letter, letterIndex) => (
          <span
            key={letterIndex}
            aria-hidden
            className="letter-rise"
            style={{ "--letter-delay": `${letterIndex * LETTER_STAGGER_MS}ms` } as CSSProperties}
          >
            {letter}
          </span>
        ))}
      </h1>

      <Reveal delay={450} className="mt-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <p className="text-3xl font-bold tracking-tight text-ink md:text-4xl">{profile.name}</p>
        <p className="max-w-xl text-sm leading-relaxed text-muted md:text-right md:text-base">{profile.tagline}</p>
      </Reveal>

      <Reveal bare delay={600} className="mt-14">
        <div className="rule-draw h-0.5 bg-ink" />
      </Reveal>

      <ol className="mt-2">
        {index.map((entry, entryIndex) => (
          <Reveal as="li" key={entry.anchor} delay={650 + entryIndex * 90} className="border-b border-line">
            <a
              href={`#${entry.anchor}`}
              className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-5 md:grid-cols-[5rem_1fr_1fr_auto] md:py-6"
            >
              <span className="font-mono text-sm text-accent">{entry.number}</span>
              <span className="font-serif text-2xl text-ink transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:text-3xl">
                {entry.title}
              </span>
              <span className="col-span-2 col-start-2 row-start-2 text-sm text-muted md:col-span-1 md:col-start-3 md:row-start-1">
                {entry.description}
              </span>
              <span
                aria-hidden
                className="col-start-3 row-start-1 -translate-x-2 text-accent opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-x-0 group-hover:opacity-100 md:col-start-4"
              >
                →
              </span>
            </a>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={1100} className="mt-10 flex flex-col gap-2 text-xs text-subtle md:flex-row md:justify-between">
        <span>
          {profile.school} {profile.department}
        </span>
        <span>
          {profile.github.label} · {profile.email}
        </span>
      </Reveal>
    </section>
  );
}
