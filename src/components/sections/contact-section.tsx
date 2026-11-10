import { Reveal } from "@/components/motion/reveal";
import type { Profile } from "@/content/types";

import { ContactForm } from "./contact-form";

/** 페이지 마지막 연락 섹션: 연락처와 메시지 폼 */
export function ContactSection({ profile }: { profile: Profile }) {
  const phone = profile.contacts.find((contact) => contact.label === "TEL");

  return (
    <section id="contact" className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-14 px-5 py-28 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-20 md:px-8 md:py-36">
        <Reveal>
          <h2 className="font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-tight font-bold tracking-[-0.02em] text-fg">
            Contact
          </h2>
          <ul className="mt-10 space-y-3 text-lg">
            {phone?.href && (
              <li>
                <a href={phone.href} className="text-fg transition-colors hover:text-mint">
                  {phone.value}
                </a>
              </li>
            )}
            <li>
              <a href={`mailto:${profile.email}`} className="break-all text-fg transition-colors hover:text-mint">
                {profile.email}
              </a>
            </li>
          </ul>
        </Reveal>
        <Reveal delay={100}>
          <h3 className="text-lg font-bold text-fg">메시지 남기기</h3>
          <div className="mt-6">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
