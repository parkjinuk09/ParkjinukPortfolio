import { Reveal } from "@/components/motion/reveal";
import { ChipList } from "@/components/ui/chip-list";
import { RichText } from "@/components/ui/rich-text";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Profile } from "@/content/types";

function ValueLabel({ index }: { index: number }) {
  return <p className="font-mono text-[11px] tracking-wider text-subtle">value {String(index).padStart(2, "0")}</p>;
}

/**
 * 소개: 왼쪽에는 한 줄 소개와 요약을 고정(sticky)하고,
 * 오른쪽에서 연락처 · 주요 기술 · 함께 다뤄본 기술을 스크롤하며 보여준다.
 */
export function AboutSection({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="mx-auto max-w-5xl px-5 py-28 md:px-8 md:py-40">
      <SectionHeading title="About" />

      <div className="grid grid-cols-1 gap-14 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-20">
        <div className="md:sticky md:top-28 md:self-start">
          <Reveal>
            <p className="text-[15px] leading-relaxed text-muted">
              <RichText value={profile.summary} />
            </p>
          </Reveal>
          <Reveal delay={120}>
            <a
              href="#contact"
              className="group mt-8 inline-flex items-center gap-3 border border-line px-5 py-3 text-sm text-fg transition-colors duration-300 hover:border-mint hover:text-mint"
            >
              Contact me
              <span aria-hidden className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                ›
              </span>
            </a>
          </Reveal>
        </div>

        <div className="space-y-20">
          <Reveal>
            <ValueLabel index={1} />
            <h3 className="mt-2 text-xl font-bold text-fg">Contact</h3>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {profile.contacts.map((contact) => (
                <div key={contact.label} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 py-4 text-sm">
                  <dt className="font-semibold text-subtle">{contact.label}</dt>
                  <dd className="text-fg">
                    {contact.href ? (
                      <a
                        href={contact.href}
                        target={contact.href.startsWith("http") ? "_blank" : undefined}
                        rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
                        className="break-all transition-colors hover:text-mint"
                      >
                        {contact.value}
                      </a>
                    ) : (
                      contact.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal>
            <ValueLabel index={2} />
            <h3 className="mt-2 text-xl font-bold text-fg">Primary Stack</h3>
            <div className="mt-6">
              <ChipList items={profile.primaryStack} />
            </div>
          </Reveal>

          <Reveal>
            <ValueLabel index={3} />
            <h3 className="mt-2 text-xl font-bold text-fg">Also Used</h3>
            <div className="mt-6">
              <ChipList items={profile.alsoUsed} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
