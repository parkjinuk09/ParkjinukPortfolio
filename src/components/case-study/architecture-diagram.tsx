import { Reveal } from "@/components/motion/reveal";
import { RichText } from "@/components/ui/rich-text";
import type {
  Architecture,
  ArchitectureEdge,
  ArchitectureGroup,
  ArchitectureIcon,
  ArchitectureNode,
  Point,
} from "@/content/case-study-types";

/** 모든 노드를 같은 크기로 그려 칸 단위 배치가 어긋나지 않게 한다. */
const NODE_WIDTH = 176;
const NODE_HEIGHT = 128;
const ICON_SIZE = 36;
const EDGE_LABEL_HEIGHT = 22;

/** 휴대폰에서 설명 글자가 10px 아래로 줄지 않도록 구성도의 최소 폭을 둔다(넘치면 가로 스크롤). */
const MIN_DIAGRAM_WIDTH = 920;

/** 라벨 배경 폭 계산용 대략적인 글자 폭. 한글은 영문보다 넓다. */
function estimateTextWidth(text: string, fontSize: number) {
  return [...text].reduce((width, char) => width + (char.charCodeAt(0) > 0xff ? fontSize : fontSize * 0.6), 0);
}

/** Devicon에 없는 사용자 · AI는 같은 선 굵기의 단순 아이콘으로 그린다(브랜드 로고를 흉내 내지 않음). */
function LineIcon({ icon, x, y }: { icon: "user" | "ai"; x: number; y: number }) {
  return (
    <svg x={x} y={y} width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" className="stroke-fg" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {icon === "user" ? (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </>
      ) : (
        <>
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
          <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
        </>
      )}
    </svg>
  );
}

function NodeIcon({ icon, x, y }: { icon: ArchitectureIcon; x: number; y: number }) {
  if (icon === "user" || icon === "ai") return <LineIcon icon={icon} x={x} y={y} />;
  return <image href={`/icons/tech/${icon}.svg`} x={x} y={y} width={ICON_SIZE} height={ICON_SIZE} />;
}

function DiagramNode({ node }: { node: ArchitectureNode }) {
  const [x, y] = node.at;
  const centerX = x + NODE_WIDTH / 2;

  return (
    <g>
      <rect x={x} y={y} width={NODE_WIDTH} height={NODE_HEIGHT} rx={10} className="fill-raised stroke-line" />
      <NodeIcon icon={node.icon} x={centerX - ICON_SIZE / 2} y={y + 16} />
      <text x={centerX} y={y + 76} textAnchor="middle" className="fill-fg text-[15px] font-semibold">
        {node.label}
      </text>
      {node.caption.map((line, lineIndex) => (
        <text key={line} x={centerX} y={y + 98 + lineIndex * 17} textAnchor="middle" className="fill-muted text-[13px]">
          {line}
        </text>
      ))}
    </g>
  );
}

/** 그룹(배포 단위 · 계층)은 점선 테두리, 이름표는 위쪽 테두리에 걸쳐 둔다. */
function DiagramGroup({ group }: { group: ArchitectureGroup }) {
  const [x, y] = group.at;
  const [width, height] = group.size;
  const labelWidth = estimateTextWidth(group.label, 12) + 20;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={14} fill="none" strokeDasharray="4 4" className="stroke-subtle/60" />
      <rect x={x + 14} y={y - 11} width={labelWidth} height={22} rx={11} className="fill-surface stroke-line" />
      <text x={x + 14 + labelWidth / 2} y={y + 4} textAnchor="middle" className="fill-muted font-mono text-[12px]">
        {group.label}
      </text>
    </g>
  );
}

function midpointOfFirstSegment(path: readonly Point[]): Point {
  const [[x1, y1], [x2, y2]] = path;
  return [(x1 + x2) / 2, (y1 + y2) / 2];
}

function DiagramEdge({ edge, markerId }: { edge: ArchitectureEdge; markerId: string }) {
  const points = edge.path.map(([x, y]) => `${x},${y}`).join(" ");
  const tone = edge.primary ? "mint" : "muted";
  const marker = `url(#${markerId}-${tone})`;

  return (
    <g>
      <polyline
        points={points}
        fill="none"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeDasharray={edge.dashed ? "5 5" : undefined}
        markerEnd={marker}
        markerStart={edge.bidirectional ? marker : undefined}
        className={edge.primary ? "stroke-mint" : "stroke-muted/70"}
      />
      {edge.label && <EdgeLabel text={edge.label} at={edge.labelAt ?? midpointOfFirstSegment(edge.path)} primary={edge.primary} />}
    </g>
  );
}

/** 선 위에 얹는 라벨. 배경을 페이지 색으로 칠해 선이 글자를 가로지르지 않게 한다. */
function EdgeLabel({ text, at, primary }: { text: string; at: Point; primary?: boolean }) {
  const [x, y] = at;
  const width = estimateTextWidth(text, 13) + 16;

  return (
    <g>
      <rect x={x - width / 2} y={y - EDGE_LABEL_HEIGHT / 2} width={width} height={EDGE_LABEL_HEIGHT} rx={EDGE_LABEL_HEIGHT / 2} className="fill-surface" />
      <text x={x} y={y + 4} textAnchor="middle" className={`text-[13px] ${primary ? "fill-mint" : "fill-muted"}`}>
        {text}
      </text>
    </g>
  );
}

/** 화살표 머리. 주 흐름(강조색)과 일반 흐름 두 가지를 둔다. 페이지에 구성도가 하나뿐이지만 id 충돌을 막으려 접두사를 받는다. */
function ArrowMarkers({ markerId }: { markerId: string }) {
  return (
    <defs>
      {(["mint", "muted"] as const).map((tone) => (
        <marker
          key={tone}
          id={`${markerId}-${tone}`}
          viewBox="0 0 10 10"
          refX={9}
          refY={5}
          markerWidth={7}
          markerHeight={7}
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" className={tone === "mint" ? "fill-mint" : "fill-muted"} />
        </marker>
      ))}
    </defs>
  );
}

/**
 * 시스템 아키텍처: 구성 요소(노드) · 배포 단위(그룹) · 요청 흐름(선)을 데이터로 받아 SVG로 그린다.
 * 휴대폰에서는 글자가 너무 작아지지 않도록 최소 폭을 두고 가로 스크롤로 본다.
 */
export function ArchitectureDiagram({ architecture, diagramId }: { architecture: Architecture; diagramId: string }) {
  const [viewWidth, viewHeight] = architecture.viewBox;
  const markerId = `${diagramId}-arrow`;
  const titleId = `${diagramId}-architecture-title`;

  return (
    <div>
      <Reveal>
        <figure className="overflow-hidden rounded-md border border-line bg-surface">
          <div className="overflow-x-auto">
            <svg
              role="img"
              aria-labelledby={titleId}
              viewBox={`0 0 ${viewWidth} ${viewHeight}`}
              style={{ minWidth: MIN_DIAGRAM_WIDTH }}
              className="block h-auto w-full p-4 md:p-6"
            >
              <title id={titleId}>{architecture.description}</title>
              <ArrowMarkers markerId={markerId} />
              {architecture.groups.map((group) => (
                <DiagramGroup key={group.label} group={group} />
              ))}
              {architecture.edges.map((edge, edgeIndex) => (
                <DiagramEdge key={edgeIndex} edge={edge} markerId={markerId} />
              ))}
              {architecture.nodes.map((node) => (
                <DiagramNode key={node.id} node={node} />
              ))}
            </svg>
          </div>
        </figure>
        <p className="mt-2 text-xs text-subtle md:hidden">구성도를 옆으로 밀어 전체 구조를 볼 수 있습니다.</p>
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
