import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { RichText } from "@/components/ui/rich-text";
import type { Architecture } from "@/content/case-study-types";

/**
 * 시스템 아키텍처: 직접 그린 구성도를 원본 비율 그대로 보여주고, 흐름을 글로 풀어 쓴다.
 * 구성도 글자가 작아서 이미지를 누르면 원본 크기로 새 탭에서 열 수 있게 한다.
 */
export function ArchitectureDiagram({ architecture }: { architecture: Architecture }) {
  const { image } = architecture;

  return (
    <div>
      <Reveal>
        <figure>
          <a href={image.src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-md border border-line">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1100px) 1100px, 100vw"
              className="h-auto w-full"
            />
          </a>
          <figcaption className="mt-2 text-xs text-subtle">이미지를 누르면 원본 크기로 볼 수 있습니다.</figcaption>
        </figure>
      </Reveal>

      <ul className="mt-6 space-y-2 text-sm leading-relaxed text-muted">
        {architecture.notes.map((note, noteIndex) => (
          <Reveal
            as="li"
            key={noteIndex}
            delay={noteIndex * 80}
            className="relative pl-4 before:absolute before:top-[0.6em] before:left-0 before:h-1 before:w-1 before:rounded-full before:bg-subtle"
          >
            <RichText value={note} />
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
