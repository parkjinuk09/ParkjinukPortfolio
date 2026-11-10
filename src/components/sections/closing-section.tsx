import { Reveal } from "@/components/motion/reveal";
import type { Profile } from "@/content/types";

import { ContactForm } from "./contact-form";

/** Closing(P07 하단) + 연락 폼 */
export function ClosingSection({ profile }: { profile: Profile }) {
  return (
    <section id="contact" className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-36">
        <Reveal className="font-serif text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] font-medium tracking-[-0.03em] text-subtle/60">
          Closing
        </Reveal>

        <Reveal delay={100} className="mt-10">
          <p className="text-[clamp(1.5rem,3.4vw,2.5rem)] leading-[1.35] font-bold tracking-tight text-ink">
            {profile.closing.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </Reveal>

        <Reveal delay={180} className="mt-8 max-w-3xl space-y-1 leading-relaxed text-muted">
          {profile.closing.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </Reveal>

        <Reveal delay={240} className="mt-12 grid gap-8 sm:grid-cols-2 md:max-w-xl">
          <div>
            <p className="text-xs font-semibold text-subtle">GitHub</p>
            <a
              href={profile.github.href}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-ink underline-offset-4 hover:text-accent hover:underline"
            >
              {profile.github.label}
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold text-subtle">Email</p>
            <a href={`mailto:${profile.email}`} className="mt-1 inline-block text-ink underline-offset-4 hover:text-accent hover:underline">
              {profile.email}
            </a>
          </div>
        </Reveal>

        <div className="mt-24 grid gap-10 border-t border-line pt-14 md:grid-cols-[18rem_1fr] md:gap-16">
          <Reveal>
            <h2 className="text-xl font-bold text-ink md:text-2xl">메시지 남기기</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              채용 · 협업 제안이나 프로젝트에 대한 질문을 남겨 주세요. 남겨 주신 이메일로 답장드립니다.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
