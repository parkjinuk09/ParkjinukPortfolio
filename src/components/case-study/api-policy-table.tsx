import { Reveal } from "@/components/motion/reveal";
import type { ApiPolicyRow } from "@/content/case-study-types";

export function ApiPolicyTable({ rows }: { rows: ApiPolicyRow[] }) {
  return (
    <div>
      <Reveal>
        <h3 className="text-xl font-bold text-fg md:text-2xl">API 정책 요약</h3>
      </Reveal>
      <Reveal delay={80} className="mt-6 overflow-x-auto">
        <table className="block w-full text-left text-sm md:table md:min-w-[560px]">
          <thead className="hidden md:table-header-group">
            <tr className="border-b border-subtle text-xs text-subtle">
              <th scope="col" className="py-3 pr-4 font-normal">도메인</th>
              <th scope="col" className="py-3 pr-4 font-normal">API</th>
              <th scope="col" className="py-3 font-normal">검증 · 제약</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {rows.map((row) => (
              <tr key={row.domain} className="flex flex-col gap-1 border-b border-line py-4 transition-colors duration-300 hover:bg-raised md:table-row md:py-0">
                <th scope="row" className="block font-semibold text-fg md:table-cell md:py-4 md:pr-4">{row.domain}</th>
                <td className="block text-muted md:table-cell md:py-4 md:pr-4">{row.api}</td>
                <td className="block text-muted md:table-cell md:py-4">{row.constraint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </div>
  );
}
