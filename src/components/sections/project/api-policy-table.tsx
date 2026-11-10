import { Reveal } from "@/components/motion/reveal";
import type { ApiPolicyRow } from "@/content/types";

export function ApiPolicyTable({ rows }: { rows: ApiPolicyRow[] }) {
  return (
    <div>
      <Reveal>
        <h3 className="text-xl font-bold text-ink md:text-2xl">API 정책 요약</h3>
      </Reveal>
      <Reveal delay={80} className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink text-xs text-subtle">
              <th scope="col" className="py-3 pr-4 font-normal">도메인</th>
              <th scope="col" className="py-3 pr-4 font-normal">API</th>
              <th scope="col" className="py-3 font-normal">검증 · 제약</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.domain} className="border-b border-line transition-colors duration-300 hover:bg-surface">
                <th scope="row" className="py-4 pr-4 font-semibold text-ink">{row.domain}</th>
                <td className="py-4 pr-4 text-muted">{row.api}</td>
                <td className="py-4 text-muted">{row.constraint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </div>
  );
}
