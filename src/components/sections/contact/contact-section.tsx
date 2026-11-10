import Image from "next/image";

import { PAGE_GUTTER } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import type { Profile } from "@/content/types";

import { ContactPopup } from "./contact-popup";

/** 사용자가 제공한 사진을 가로로 잘라 흑백으로 깐 배경 */
const CONTACT_BACKGROUND_SRC = "/images/contact-bg.webp";

/**
 * 마지막 연락 영역: 참고 사이트처럼 흑백 사진 배경 위에 다짐 문구 · 연락처 · 메시지 버튼을 둔다.
 * 문구는 Notion 「Closing」을 그대로 쓴다.
 */
export function ContactSection({ profile }: { profile: Profile }) {
  const phone = profile.contacts.find((contact) => contact.label === "TEL");

  return (
    <section id="contact" className="relative flex w-full items-center overflow-hidden">
      <div aria-hidden className="absolute inset-0 z-0 translate-y-[100px] grayscale">
        <Image src={CONTACT_BACKGROUND_SRC} alt="" fill sizes="100vw" className="object-cover object-bottom" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-charcoal/20 to-charcoal" />
        <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-charcoal via-charcoal/80 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-l from-charcoal via-charcoal/50 to-transparent" />
      </div>

      <div className={`${PAGE_GUTTER} relative mb-5 grid py-25 md:grid-cols-2`}>
        <Reveal className="z-10 flex w-full flex-col gap-10">
          <h2 className="text-[clamp(1.5rem,2vw,1.9rem)] leading-normal font-semibold text-zinc-50">{profile.closing.headline}</h2>
          <p className="max-w-[500px] leading-relaxed text-zinc-400">{profile.closing.body}</p>
          <div>
            <div className="mb-10 flex flex-col gap-1 border-l border-zinc-50/20 pl-5 text-sm text-zinc-300">
              {phone?.href && (
                <a href={phone.href} className="hover:text-zinc-50">
                  {phone.value}
                </a>
              )}
              <a href={`mailto:${profile.email}`} className="hover:text-zinc-50">
                {profile.email}
              </a>
              <a href={profile.github.href} target="_blank" rel="noreferrer" className="hover:text-zinc-50">
                {profile.github.label}
              </a>
            </div>
            <div className="mt-20">
              <ContactPopup />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
