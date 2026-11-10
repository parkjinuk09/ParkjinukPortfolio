import Image from "next/image";
import Link from "next/link";

import { PAGE_GUTTER } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import type { TroubleshootingHighlight } from "@/content/types";

interface TroubleshootingSectionProps {
  items: TroubleshootingHighlight[];
  lesson: string;
}

/**
 * 참고 사이트의 글 목록 영역 구성: 제목 · 설명, 왼쪽에 고정된 분류 버튼, 오른쪽 2열 이미지 카드.
 * 카드는 Notion 트러블슈팅 항목이며, 누르면 해당 프로젝트 상세의 트러블슈팅으로 이동한다.
 */
export function TroubleshootingSection({ items, lesson }: TroubleshootingSectionProps) {
  const projectNames = [...new Set(items.map((item) => item.projectName))];

  return (
    <section id="troubleshooting" className={`${PAGE_GUTTER} py-20 md:py-21`}>
      <div className="flex flex-col gap-10 py-20">
        <Reveal>
          <h2 className="mb-5 text-3xl leading-relaxed font-semibold text-zinc-50">
            문제를 재현하고,
            <br />
            원인을 나눠 진단합니다
          </h2>
          <p className="max-w-[600px] leading-relaxed text-zinc-400">{lesson}</p>
        </Reveal>

        <div className="relative grid gap-20 xl:grid-cols-[1fr_3fr] xl:gap-30">
          <div className="xl:mb-9">
            <div className="flex flex-wrap items-start gap-3 xl:sticky xl:top-40 xl:flex-col">
              <span className="border border-zinc-50/15 px-5 py-4 text-sm text-zinc-50">Troubleshooting</span>
              {projectNames.map((name) => (
                <span key={name} className="text-sm text-zinc-500">
                  {name}
                </span>
              ))}
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:gap-12">
            {items.map((item, index) => (
              <Reveal as="li" key={item.title} delay={(index % 2) * 120}>
                <Link href={item.href} className="group flex flex-col gap-4">
                  <div className="relative aspect-[14/9] overflow-hidden rounded-md border border-indigo-300/20 transition-all duration-300 group-hover:border-indigo-200 group-hover:shadow-[0_5px_30px_rgb(99_102_241/0.25)]">
                    <Image
                      src={item.imageSrc}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 360px, (min-width: 640px) 45vw, 100vw"
                      className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  </div>
                  <span className="text-xs text-pink">{item.projectName}</span>
                  <h3 className="text-lg leading-relaxed font-medium text-zinc-100 group-hover:underline">{item.title}</h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-zinc-400">{item.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
