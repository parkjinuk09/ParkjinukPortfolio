import { Reveal } from "@/components/motion/reveal";

interface SectionHeadingProps {
  /** 영문 섹션 제목 */
  title: string;
  description?: string;
}

export function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <header className="mb-14 md:mb-20">
      <Reveal>
        <h2 className="font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-tight font-bold tracking-[-0.02em] text-fg">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={100}>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{description}</p>
        </Reveal>
      )}
    </header>
  );
}
