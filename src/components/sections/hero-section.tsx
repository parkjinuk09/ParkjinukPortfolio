import { PAGE_GUTTER } from "@/components/layout/container";
import Image from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties } from "react";

import { TOP_ANCHOR } from "@/components/layout/site-header";
import { Reveal } from "@/components/motion/reveal";
import type { Profile, Project } from "@/content/types";

/** 사용자가 제공한 표지 사진 (원본 HEIC를 2400px WebP로 변환) */
const HERO_PHOTO_SRC = "/images/hero-dome.webp";
const LETTER_STAGGER_MS = 35;
const TITLE_START_DELAY_MS = 250;

/** 표지: 영문 대제목이 글자 단위로 올라오고, 아래에 프로젝트 바로가기와 연락처를 둔다. */
export function HeroSection({ profile, projects }: { profile: Profile; projects: Project[] }) {
  const titleWords = profile.heroTitle.split(" ");
  // 단어가 바뀌어도 등장 순서가 이어지도록 각 단어의 시작 글자 위치를 미리 계산한다.
  const wordOffsets = titleWords.map((_, index) =>
    titleWords.slice(0, index).reduce((total, word) => total + word.length, 0),
  );
  const letterCount = titleWords.reduce((total, word) => total + word.length, 0);
  const afterTitleDelay = TITLE_START_DELAY_MS + letterCount * LETTER_STAGGER_MS;

  return (
    <section id={TOP_ANCHOR} className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* 배경 사진은 장식이라 대체 텍스트를 비우고, 아래쪽을 배경색으로 덮어 다음 섹션과 자연스럽게 이어지게 한다. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src={HERO_PHOTO_SRC}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-photo object-cover object-[50%_45%]"
        />
        <div className="absolute inset-0 bg-charcoal/70" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent to-charcoal" />
      </div>

      <div className={`${PAGE_GUTTER} relative flex flex-1 flex-col justify-center pt-28`}>
        <Reveal className="text-lg font-semibold text-muted md:text-2xl">{profile.name}</Reveal>

        <h1
          aria-label={profile.heroTitle}
          className="mt-3 overflow-hidden pb-1 font-display text-[clamp(2.6rem,8.2vw,5.6rem)] leading-[1.05] font-bold tracking-[-0.02em] text-fg"
        >
          {titleWords.map((word, wordIndex) => (
            // 글자마다 inline-block이라 단어 중간에서 줄이 바뀌지 않도록 단어 단위로 묶고, 단어 사이에만 공백을 둔다.
            <Fragment key={wordIndex}>
              {wordIndex > 0 && " "}
              <span className="inline-block whitespace-nowrap">
              {word.split("").map((letter, letterIndex) => (
                <span
                  key={letterIndex}
                  aria-hidden
                  className="letter-rise"
                  style={
                    {
                      "--letter-delay": `${TITLE_START_DELAY_MS + (wordOffsets[wordIndex] + letterIndex) * LETTER_STAGGER_MS}ms`,
                    } as CSSProperties
                  }
                >
                  {letter}
                </span>
              ))}
              </span>
            </Fragment>
          ))}
        </h1>

        <Reveal delay={afterTitleDelay} className="mt-8 space-y-3">
          <p className="text-base text-fg md:text-lg">{profile.motto}</p>
          <p className="text-sm text-subtle md:text-base">{profile.primaryStack.join("  ·  ")}</p>
        </Reveal>
      </div>

      <Reveal
        delay={afterTitleDelay + 200}
        className={`${PAGE_GUTTER} relative grid gap-10 pt-16 pb-14 sm:grid-cols-2 md:grid-cols-[1fr_16rem_16rem]`}
      >
        <p className="hidden text-sm leading-relaxed text-subtle md:block">{profile.role}</p>
        <div>
          <a href="#projects" className="text-sm text-muted transition-colors hover:text-fg">
            Projects
          </a>
          <ul className="mt-4 space-y-3 border-l border-line pl-4">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link href={`/projects/${project.slug}`} className="group block">
                  <span className="block text-sm text-fg transition-colors group-hover:text-mint">{project.name}</span>
                  <span className="mt-0.5 block truncate text-xs text-subtle">{project.oneLiner}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <a href="#contact" className="text-sm text-muted transition-colors hover:text-fg">
            Contact
          </a>
          <ul className="mt-4 space-y-3 border-l border-line pl-4 text-sm">
            {profile.contacts
              .filter((contact) => contact.href)
              .map((contact) => (
                <li key={contact.label}>
                  <a href={contact.href} className="block text-fg transition-colors hover:text-mint">
                    {contact.label}
                  </a>
                  <span className="mt-0.5 block truncate text-xs text-subtle">{contact.value}</span>
                </li>
              ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
