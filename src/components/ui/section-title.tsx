import { Reveal } from "@/components/motion/reveal";

interface SectionTitleProps {
  /** 섹션 번호(예: "02"). 표지 목차와 같은 번호를 써서 위치를 알 수 있게 한다. */
  number: string;
  /** 큰 세리프 제목 */
  title: string;
  eyebrow?: string;
  description?: string;
}

export function SectionTitle({ number, title, eyebrow, description }: SectionTitleProps) {
  return (
    <header className="mb-14 md:mb-20">
      <Reveal className="flex items-baseline gap-4 font-mono text-xs tracking-[0.2em] text-subtle uppercase">
        <span className="text-accent">{number}</span>
        {eyebrow && <span>{eyebrow}</span>}
      </Reveal>
      <Reveal delay={80}>
        <h2 className="mt-4 font-serif text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] font-medium tracking-[-0.03em] text-ink">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{description}</p>
        </Reveal>
      )}
    </header>
  );
}
