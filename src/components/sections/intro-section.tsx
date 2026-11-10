import Image from "next/image";
import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { RichText } from "@/components/ui/rich-text";
import { SectionTitle } from "@/components/ui/section-title";
import { TechList } from "@/components/ui/tech-list";
import type { Profile } from "@/content/types";

function InfoRow({ label, children, delay }: { label: string; children: ReactNode; delay: number }) {
  return (
    <Reveal delay={delay} className="grid gap-3 border-b border-line py-6 md:grid-cols-[12rem_1fr] md:gap-8">
      <dt className="text-sm font-semibold text-ink">{label}</dt>
      <dd className="text-sm text-muted">{children}</dd>
    </Reveal>
  );
}

/** 소개(P01): 한 줄 정체성, 연락처, 요약, 직무·기술·학력 */
export function IntroSection({ profile }: { profile: Profile }) {
  return (
    <section id="intro" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-36">
      <SectionTitle number="01" title="Intro" eyebrow="About" />

      <div className="grid gap-12 md:grid-cols-[1fr_auto] md:gap-16">
        <div>
          <Reveal>
            <p className="text-[clamp(1.6rem,3.6vw,2.6rem)] leading-[1.35] font-bold tracking-tight text-ink">
              {profile.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-6 space-y-1 text-sm text-muted">
            <p className="font-semibold text-ink">{profile.role}</p>
            <p>
              <a href={`mailto:${profile.email}`} className="underline-offset-4 hover:text-accent hover:underline">
                {profile.email}
              </a>
              <span className="mx-2 text-line">/</span>
              <a href={`tel:${profile.phone.replaceAll("-", "")}`} className="underline-offset-4 hover:text-accent hover:underline">
                {profile.phone}
              </a>
            </p>
          </Reveal>
        </div>

        {profile.photoSrc && (
          <Reveal delay={200} className="relative aspect-[4/5] w-48 overflow-hidden rounded-sm bg-sunken md:w-56">
            <Image src={profile.photoSrc} alt={`${profile.name} 프로필 사진`} fill sizes="224px" className="object-cover" />
          </Reveal>
        )}
      </div>

      <Reveal bare className="mt-16">
        <div className="rule-draw h-0.5 bg-ink" />
      </Reveal>

      <Reveal delay={100} className="mt-10 max-w-3xl">
        <h3 className="text-lg font-bold text-ink md:text-xl">{profile.summaryTitle}</h3>
        <p className="mt-4 leading-relaxed text-muted">
          <RichText value={profile.summary} />
        </p>
      </Reveal>

      <dl className="mt-12 border-t border-line">
        <InfoRow label="희망 직무" delay={0}>
          <span className="text-ink">{profile.desiredRole}</span>
        </InfoRow>
        <InfoRow label="주요 기술" delay={60}>
          <TechList items={profile.mainSkills} />
        </InfoRow>
        <InfoRow label="함께 다뤄본 기술" delay={120}>
          <TechList items={profile.experiencedSkills} />
        </InfoRow>
        <InfoRow label="학력" delay={180}>
          <span className="block font-semibold text-ink">{profile.education.school}</span>
          <span className="mt-1 block">{profile.education.status}</span>
        </InfoRow>
        <InfoRow label="링크" delay={240}>
          <a
            href={profile.github.href}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent underline-offset-4 hover:underline"
          >
            {profile.github.label}
          </a>
        </InfoRow>
      </dl>
    </section>
  );
}
