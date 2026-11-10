import { PAGE_GUTTER } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Profile } from "@/content/types";

/** Notion 「Closing」 */
export function ClosingSection({ profile }: { profile: Profile }) {
  return (
    <section id="closing" className={`${PAGE_GUTTER} py-28 md:py-40`}>
      <SectionHeading title="Closing" />
      <Reveal>
        <p className="max-w-4xl text-[clamp(1.4rem,3vw,2.2rem)] leading-[1.45] font-bold tracking-tight text-fg">
          {profile.closing.headline}
        </p>
      </Reveal>
      <Reveal delay={120}>
        <p className="mt-8 max-w-3xl leading-relaxed text-muted">{profile.closing.body}</p>
      </Reveal>
      <Reveal delay={200} className="mt-10 space-y-2 text-sm">
        <p>
          <span className="text-subtle">GitHub · </span>
          <a href={profile.github.href} target="_blank" rel="noreferrer" className="text-fg hover:text-mint">
            {profile.github.label}
          </a>
        </p>
        <p>
          <span className="text-subtle">Email · </span>
          <a href={`mailto:${profile.email}`} className="text-fg hover:text-mint">
            {profile.email}
          </a>
        </p>
      </Reveal>
    </section>
  );
}
