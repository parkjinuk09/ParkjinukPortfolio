import { Reveal } from "@/components/motion/reveal";
import { RichText } from "@/components/ui/rich-text";
import type { RichText as RichTextValue, TroubleshootingCase } from "@/content/case-study-types";

function BeforeAfterTable({ before, after }: { before: string; after: string }) {
  return (
    <table className="mt-6 w-full text-left text-sm">
      <tbody>
        <tr className="border-y border-line">
          <th scope="row" className="w-14 py-3 pr-4 align-top font-semibold text-subtle">전</th>
          <td className="py-3 text-muted">{before}</td>
        </tr>
        <tr className="border-b border-line">
          <th scope="row" className="w-14 py-3 pr-4 align-top font-semibold text-mint">후</th>
          <td className="py-3 text-fg">{after}</td>
        </tr>
      </tbody>
    </table>
  );
}

/** 트러블슈팅(P04, P06): 증상 → 원인 → 해결 순서의 문단과 전/후 비교, 마지막에 배운 점 */
export function TroubleshootingList({ cases, lesson }: { cases: TroubleshootingCase[]; lesson: RichTextValue }) {
  return (
    <div id="troubleshooting" className="scroll-mt-24">
      <Reveal>
        <h3 className="text-xl font-bold text-fg md:text-2xl">트러블슈팅</h3>
      </Reveal>

      <div className="mt-8 divide-y divide-line border-y border-line">
        {cases.map((troubleCase) => (
          <article key={troubleCase.number} className="grid grid-cols-1 gap-6 py-10 md:grid-cols-[18rem_1fr] md:gap-12">
            <Reveal>
              <p className="font-mono text-sm text-mint">{troubleCase.number}</p>
              <h4 className="mt-2 text-lg leading-snug font-bold text-fg md:text-xl">{troubleCase.title}</h4>
            </Reveal>
            <Reveal delay={100} className="min-w-0">
              <div className="space-y-4 text-sm leading-relaxed text-muted">
                {troubleCase.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>
                    <RichText value={paragraph} />
                  </p>
                ))}
              </div>
              {troubleCase.code && (
                <pre className="mt-5 overflow-x-auto rounded-md bg-raised p-4 font-mono text-xs leading-relaxed text-fg">
                  {troubleCase.code}
                </pre>
              )}
              <BeforeAfterTable before={troubleCase.beforeAfter.before} after={troubleCase.beforeAfter.after} />
            </Reveal>
          </article>
        ))}
      </div>

      <Reveal className="mt-10 rounded-md bg-surface p-6 md:p-8">
        <p className="text-sm font-bold text-fg">배운 점</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          <RichText value={lesson} />
        </p>
      </Reveal>
    </div>
  );
}
