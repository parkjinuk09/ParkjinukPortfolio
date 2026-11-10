import type { CSSProperties } from "react";

import { Reveal } from "@/components/motion/reveal";
import { RichText } from "@/components/ui/rich-text";
import type { Architecture, ArchitectureNode } from "@/content/case-study-types";

function Node({ node, emphasized = false }: { node: ArchitectureNode; emphasized?: boolean }) {
  return (
    <div className="min-w-0 text-center">
      <p className={`text-sm font-bold ${emphasized ? "text-mint" : "text-fg"}`}>{node.title}</p>
      {node.caption && <p className="mt-1 text-xs text-muted">{node.caption}</p>}
    </div>
  );
}

/**
 * 연결선과 라벨. 부모 Reveal이 보이면 지연 시간 순서대로 선이 그려진다.
 * 휴대폰에서는 구성도를 세로로 쌓으므로 가로선 대신 아래 화살표로 표시한다.
 */
function Link({ label, delay }: { label: string; delay: number }) {
  return (
    <div className="flex flex-col items-center gap-1 px-1 md:min-w-14 md:flex-1" aria-hidden>
      <span className="font-mono text-[10px] whitespace-nowrap text-subtle">{label}</span>
      <span className="text-subtle md:hidden">↓</span>
      <span
        className="flow-line hidden h-px w-full bg-subtle/70 md:block"
        style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      />
    </div>
  );
}

/** CapTeam 배포 구조(P03). 요청 경로와 배포 경로를 분리해 보여준다. */
export function ArchitectureDiagram({ architecture }: { architecture: Architecture }) {
  return (
    <div>
      <Reveal bare className="rounded-md bg-raised p-6 md:overflow-x-auto md:p-10">
        <figure aria-label="CapTeam 시스템 구성도" className="space-y-10 md:min-w-[640px]">
          <div className="flex flex-col items-center gap-3 md:flex-row md:gap-0">
            <Node node={architecture.client} />
            <Link label={architecture.clientProtocol} delay={100} />
            <div className="relative flex w-full flex-col items-center gap-3 rounded-md border border-dashed border-subtle/50 px-4 pt-8 pb-4 md:w-auto md:flex-[3] md:flex-row md:gap-0 md:pt-7">
              <span className="absolute top-2 left-4 text-xs font-semibold text-fg">{architecture.hostLabel}</span>
              <Node node={architecture.proxy} />
              <Link label={architecture.proxyLink} delay={300} />
              <Node node={architecture.app} emphasized />
            </div>
            <Link label={architecture.appLink} delay={500} />
            <Node node={architecture.database} />
          </div>
          <div className="flex flex-col items-center justify-center gap-3 border-t border-line pt-8 md:flex-row md:gap-0 md:border-0 md:pt-0">
            <Node node={architecture.ci} />
            <div className="md:w-40">
              <Link label={architecture.ciLink} delay={700} />
            </div>
            <Node node={architecture.deployTarget} />
          </div>
        </figure>
      </Reveal>

      <ul className="mt-6 space-y-2 text-sm leading-relaxed text-muted">
        {architecture.notes.map((note, noteIndex) => (
          <Reveal as="li" key={noteIndex} delay={noteIndex * 80} className="relative pl-4 before:absolute before:top-[0.6em] before:left-0 before:h-1 before:w-1 before:rounded-full before:bg-subtle">
            <RichText value={note} />
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
