import Link from "next/link";
import { Fragment, type CSSProperties } from "react";

import { PAGE_GUTTER } from "@/components/layout/container";
import { TOP_ANCHOR } from "@/components/layout/site-header";
import { Reveal } from "@/components/motion/reveal";
import { SocialLinks } from "@/components/ui/social-links";
import type { Profile, Project } from "@/content/types";

import { HeroBackground } from "./hero-background";

/** 사용자가 제공한 표지 사진 (원본 HEIC를 2400px WebP로 변환) */
const HERO_PHOTO_SRC = "/images/hero-dome.webp";
const LETTER_STAGGER_MS = 40;
const EYEBROW_START_MS = 300;

/** 글자 단위 등장 애니메이션. 단어 중간에서 줄이 바뀌지 않도록 단어 단위로 묶는다. */
function AnimatedLetters({ text, startDelay, className }: { text: string; startDelay: number; className: string }) {
  const words = text.split(" ");
  // 단어가 바뀌어도 등장 순서가 이어지도록 각 단어의 시작 글자 위치를 미리 계산한다.
  const wordOffsets = words.map((_, index) => words.slice(0, index).reduce((total, word) => total + word.length, 0));
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, wordIndex) => (
        <Fragment key={wordIndex}>
          {wordIndex > 0 && " "}
          <span aria-hidden className="inline-block whitespace-nowrap">
            {word.split("").map((letter, indexInWord) => {
              const delay = startDelay + (wordOffsets[wordIndex] + indexInWord) * LETTER_STAGGER_MS;
              return (
                <span key={indexInWord} className="letter-rise" style={{ "--letter-delay": `${delay}ms` } as CSSProperties}>
                  {letter}
                </span>
              );
            })}
          </span>
        </Fragment>
      ))}
    </span>
  );
}

function HeroList({ title, href, items }: { title: string; href: string; items: { key: string; label: string; description: string; href: string; external?: boolean }[] }) {
  return (
    <div>
      <a href={href} className="text-sm text-zinc-50 transition-opacity hover:opacity-70">
        {title}
      </a>
      <ul className="mt-4 flex flex-col gap-3 border-l border-zinc-50/20 pl-4">
        {items.map((item) => (
          <li key={item.key} className="min-w-0">
            {item.external ? (
              <a href={item.href} className="group block" target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                <span className="block text-xs text-zinc-50 group-hover:underline">{item.label}</span>
                <span className="mt-1 block truncate text-xs text-zinc-400">{item.description}</span>
              </a>
            ) : (
              <Link href={item.href} className="group block">
                <span className="block text-xs text-zinc-50 group-hover:underline">{item.label}</span>
                <span className="mt-1 block truncate text-xs text-zinc-400">{item.description}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 표지: 참고 사이트와 같은 구성 (작은 수식어 → 영문 대제목 → 소개 → 기술, 하단에 아이콘 · 프로젝트 · 연락처 목록) */
export function HeroSection({ profile, projects }: { profile: Profile; projects: Project[] }) {
  const titleStart = EYEBROW_START_MS + profile.heroEyebrow.length * LETTER_STAGGER_MS;
  const afterTitle = titleStart + profile.heroTitle.length * LETTER_STAGGER_MS;

  return (
    <section id={TOP_ANCHOR} className="relative min-h-lvh overflow-hidden">
      <HeroBackground src={HERO_PHOTO_SRC} />

      <div className={`${PAGE_GUTTER} relative z-10 pt-60 md:pt-75`}>
        <h1 className="flex flex-col items-start gap-4 leading-tight md:pb-20">
          <AnimatedLetters
            text={profile.heroEyebrow}
            startDelay={EYEBROW_START_MS}
            className="font-display text-xl text-zinc-50 [text-shadow:0_2px_12px_rgb(0_0_0/0.4)] md:text-2xl"
          />
          <AnimatedLetters
            text={profile.heroTitle}
            startDelay={titleStart}
            className="font-display text-[2.4rem] font-bold text-zinc-50 [text-shadow:0_2px_16px_rgb(0_0_0/0.4)] md:text-[3.2rem]"
          />
        </h1>

        <Reveal delay={afterTitle} className="mt-10 flex flex-col gap-2">
          <p className="text-indigo-100">{profile.motto}</p>
          <p className="text-zinc-500">{profile.primaryStack.join(" ㆍ ")}</p>
        </Reveal>

        <Reveal delay={afterTitle + 150} className="grid gap-10 py-10 md:grid-cols-2">
          <div className="pt-10">
            <SocialLinks links={profile.socials} />
          </div>
          <div className="grid gap-10 md:mt-auto md:grid-cols-2">
            <HeroList
              title="Projects"
              href="#projects"
              items={projects.map((project) => ({
                key: project.slug,
                label: project.name,
                description: project.oneLiner,
                href: `/projects/${project.slug}`,
              }))}
            />
            <HeroList
              title="Contact"
              href="#contact"
              items={profile.contacts
                .filter((contact) => contact.href)
                .map((contact) => ({
                  key: contact.label,
                  label: contact.label,
                  description: contact.value,
                  href: contact.href ?? "#contact",
                  external: true,
                }))}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
