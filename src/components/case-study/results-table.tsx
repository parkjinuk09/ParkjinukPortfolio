import { Reveal } from "@/components/motion/reveal";
import type { CaseStudyResults } from "@/content/case-study-types";

/**
 * 핵심 성과: 측정 조건을 먼저 밝히고, 지표마다 개선 전 → 후와 변화량을 한 줄로 보여준다.
 * 숫자만 있으면 어떤 조건의 값인지 알 수 없어서 조건 문구를 제목 바로 아래에 둔다.
 */
export function ResultsTable({ results }: { results: CaseStudyResults }) {
  return (
    <div>
      <Reveal>
        <h3 className="text-xl font-bold text-fg md:text-2xl">핵심 성과</h3>
        <p className="mt-3 text-sm text-muted">측정 조건: {results.condition}</p>
      </Reveal>

      <Reveal delay={80}>
        <table className="mt-8 w-full text-left">
          <thead className="sr-only">
            <tr>
              <th scope="col">지표</th>
              <th scope="col">개선 전 → 후</th>
              <th scope="col">변화</th>
            </tr>
          </thead>
          <tbody className="border-y border-line">
            {results.metrics.map((metric) => (
              <tr key={metric.label} className="flex flex-col gap-1 border-b border-line py-4 last:border-b-0 md:table-row">
                <th scope="row" className="text-sm font-normal text-muted md:w-56 md:py-4 md:pr-6">
                  {metric.label}
                </th>
                <td className="text-base text-zinc-300 md:py-4 md:pr-6">
                  {metric.before} <span aria-hidden className="text-subtle">→</span>
                  <span className="sr-only">에서</span> <strong className="font-semibold text-fg">{metric.after}</strong>
                </td>
                <td className="text-sm font-semibold text-mint md:py-4 md:text-right">{metric.change}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </div>
  );
}
