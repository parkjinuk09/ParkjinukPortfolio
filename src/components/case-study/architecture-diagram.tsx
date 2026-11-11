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

const ICON_SIZE = 56;
const LABEL_FONT_SIZE = 15;
const CAPTION_FONT_SIZE = 13;
/** 로고 가운데에서 이름 · 설명 글자 기준선까지의 거리 */
const LABEL_OFFSET = ICON_SIZE / 2 + 24;
const CAPTION_OFFSET = LABEL_OFFSET + 20;
/** 화살표 끝이 로고 · 글자에 닿기 직전에 멈추도록 남기는 간격 */
const EDGE_GAP = 6;

const GROUP_BADGE_SIZE = 44;

/** 휴대폰에서 설명 글자가 10px 아래로 줄지 않도록 구성도의 최소 폭을 둔다(넘치면 가로 스크롤). */
const MIN_DIAGRAM_WIDTH = 880;

/** 글자 영역 폭 계산용 대략적인 글자 폭. 한글은 영문보다 넓다. */
function estimateTextWidth(text: string, fontSize: number) {
  return [...text].reduce((width, char) => width + (char.charCodeAt(0) > 0xff ? fontSize : fontSize * 0.58), 0);
}

/**
 * 로고 가운데(anchor)를 기준으로 한 구성 요소 영역. 로고(정사각형)와 그 아래 글자(로고보다 넓음) 두 부분으로 나눈다.
 * 하나의 큰 사각형으로 보면 옆으로 나가는 선이 글자 폭만큼 일찍 끊겨 로고와 너무 떨어져 보인다.
 */
interface NodeBox {
  anchor: Point;
  iconHalf: number;
  textHalfWidth: number;
  textBottom: number;
}

function getNodeBox(node: ArchitectureNode): NodeBox {
  const textWidth = Math.max(
    estimateTextWidth(node.label, LABEL_FONT_SIZE),
    node.caption ? estimateTextWidth(node.caption, CAPTION_FONT_SIZE) : 0,
  );
  return {
    anchor: node.at,
    iconHalf: ICON_SIZE / 2,
    textHalfWidth: textWidth / 2,
    textBottom: (node.caption ? CAPTION_OFFSET : LABEL_OFFSET) + 4,
  };
}

/**
 * 로고 가운데에서 target 쪽으로 나가는 직선이 영역(로고 ∪ 글자)을 벗어나는 점(+간격).
 * 선을 로고 가운데끼리 이어서, 같은 높이의 로고는 설명 줄 수와 상관없이 수평선으로 연결된다.
 */
function exitPoint(box: NodeBox, target: Point): Point {
  const [cx, cy] = box.anchor;
  const dx = target[0] - cx;
  const dy = target[1] - cy;
  const length = Math.hypot(dx, dy) || 1;

  // 직선 위의 점 = anchor + (dx, dy) * t. 각 영역을 벗어나는 t를 구해 더 먼 쪽을 쓴다.
  const exitX = (halfWidth: number) => (dx === 0 ? Infinity : halfWidth / Math.abs(dx));
  const iconExit = Math.min(exitX(box.iconHalf), dy === 0 ? Infinity : box.iconHalf / Math.abs(dy));

  let textExit = 0;
  if (dy > 0) {
    // 글자 영역은 로고 바로 아래(y: iconHalf ~ textBottom)에 있다. 선이 그 높이에 들어설 때 아직 글자 폭 안이면 통과하는 것이다.
    const enterTextRow = box.iconHalf / dy;
    const leaveTextColumn = exitX(box.textHalfWidth);
    if (enterTextRow < leaveTextColumn) {
      textExit = Math.min(box.textBottom / dy, leaveTextColumn);
    }
  }

  const scaleToEdge = Math.max(iconExit, textExit) + EDGE_GAP / length;
  return [cx + dx * scaleToEdge, cy + dy * scaleToEdge];
}

/** Devicon에 없는 AI(LLM)는 단순 선 아이콘으로 그린다(특정 회사 로고를 흉내 내지 않음). */
function AiIcon({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" fill="none" className="stroke-fg" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
    </svg>
  );
}

function DiagramIcon({ icon, center, size }: { icon: ArchitectureIcon; center: Point; size: number }) {
  const x = center[0] - size / 2;
  const y = center[1] - size / 2;
  if (icon === "ai") return <AiIcon x={x} y={y} size={size} />;
  return <image href={`/icons/tech/${icon}.svg`} x={x} y={y} width={size} height={size} />;
}

/** 참고 구성도처럼 상자 없이 로고 아래에 이름과 역할을 적는다. */
function DiagramNode({ node }: { node: ArchitectureNode }) {
  const [x, y] = node.at;
  return (
    <g>
      <DiagramIcon icon={node.icon} center={node.at} size={ICON_SIZE} />
      <text x={x} y={y + LABEL_OFFSET} textAnchor="middle" className="fill-fg text-[15px] font-semibold">
        {node.label}
      </text>
      {node.caption && (
        <text x={x} y={y + CAPTION_OFFSET} textAnchor="middle" className="fill-muted text-[13px]">
          {node.caption}
        </text>
      )}
    </g>
  );
}

/** 배포 단위: 점선 둥근 테두리 + 왼쪽 위 테두리에 걸친 아이콘 배지와 이름 */
function DiagramGroup({ group }: { group: ArchitectureGroup }) {
  const [x, y] = group.at;
  const [width, height] = group.size;
  const badgeX = x + 28;
  const badgeY = y - GROUP_BADGE_SIZE / 2;
  const labelX = badgeX + GROUP_BADGE_SIZE + 12;
  const labelWidth = estimateTextWidth(group.label, 13) + 16;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={36} fill="none" strokeDasharray="4 5" className="stroke-subtle" />
      <rect x={badgeX} y={badgeY} width={GROUP_BADGE_SIZE} height={GROUP_BADGE_SIZE} rx={8} className="fill-raised stroke-line" />
      <DiagramIcon icon={group.icon} center={[badgeX + GROUP_BADGE_SIZE / 2, y]} size={28} />
      {/* 점선이 글자를 가로지르지 않도록 이름 뒤에 배경색을 깐다. */}
      <rect x={labelX - 8} y={y - 11} width={labelWidth} height={22} className="fill-surface" />
      <text x={labelX} y={y + 5} className="fill-muted text-[13px]">
        {group.label}
      </text>
    </g>
  );
}

function DiagramEdge({ edge, boxes, markerId }: { edge: ArchitectureEdge; boxes: Map<string, NodeBox>; markerId: string }) {
  const fromBox = boxes.get(edge.from);
  const toBox = boxes.get(edge.to);
  if (!fromBox || !toBox) {
    // 데이터의 오타를 조용히 넘기지 않도록 개발 중 바로 드러낸다.
    throw new Error(`구성도 연결선의 노드를 찾을 수 없습니다: ${edge.from} → ${edge.to}`);
  }
  const [x1, y1] = exitPoint(fromBox, toBox.anchor);
  const [x2, y2] = exitPoint(toBox, fromBox.anchor);
  const marker = `url(#${markerId})`;

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      strokeWidth={1.3}
      markerEnd={marker}
      markerStart={edge.oneWay ? undefined : marker}
      className="stroke-zinc-300"
    />
  );
}

function ArrowMarker({ markerId }: { markerId: string }) {
  return (
    <defs>
      <marker id={markerId} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" className="fill-zinc-300" />
      </marker>
    </defs>
  );
}

/**
 * 시스템 아키텍처: 로고 중심 구성 요소 · 점선 배포 단위 · 양방향 직선 화살표로 그린다.
 * 연결선은 두 구성 요소의 영역 테두리에서 시작 · 끝나도록 자동 계산하므로 데이터에는 어떤 요소를 잇는지만 적는다.
 */
export function ArchitectureDiagram({ architecture, diagramId }: { architecture: Architecture; diagramId: string }) {
  const [viewWidth, viewHeight] = architecture.viewBox;
  const markerId = `${diagramId}-arrow`;
  const titleId = `${diagramId}-architecture-title`;
  const boxes = new Map(architecture.nodes.map((node) => [node.id, getNodeBox(node)]));

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
              <ArrowMarker markerId={markerId} />
              {architecture.groups.map((group) => (
                <DiagramGroup key={group.label} group={group} />
              ))}
              {architecture.edges.map((edge) => (
                <DiagramEdge key={`${edge.from}-${edge.to}`} edge={edge} boxes={boxes} markerId={markerId} />
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
