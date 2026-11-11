/** Figma 형식 프로젝트 상세(케이스 스터디) 데이터 타입. 강조 문장은 조각 배열로 표현하며 strong 조각만 굵게 렌더링된다. */
export type RichText = ReadonlyArray<string | { strong: string }>;

export interface TechItem {
  name: string;
}

export interface ProfileLink {
  label: string;
  href: string;
}

export interface RoleGroup {
  title: string;
  items: string[];
}

export interface BeforeAfter {
  before: string;
  after: string;
}

export interface TroubleshootingCase {
  number: string;
  title: string;
  paragraphs: RichText[];
  code?: string;
  beforeAfter: BeforeAfter;
}

export interface FlowStep {
  title: string;
  lines: string[];
  highlighted?: boolean;
}

export interface DesignDecision {
  title: string;
  description?: string;
  background?: RichText;
  choice?: RichText;
  diagramCode?: string;
  benefits?: string[];
  flowInputs?: FlowStep[];
  flowConnectorLabel?: string;
  flow?: FlowStep[];
  notes: string[];
}

export interface ApiPolicyRow {
  domain: string;
  api: string;
  constraint: string;
}

/** 구성도에서 쓰는 아이콘. user · ai는 직접 그린 선 아이콘, 나머지는 public/icons/tech의 Devicon 파일 이름이다. */
export type ArchitectureIcon =
  | "user"
  | "ai"
  | "aws"
  | "chrome"
  | "electron"
  | "google"
  | "mysql"
  | "postgresql"
  | "python"
  | "react"
  | "redis"
  | "spring";

/** 구성도 좌표: SVG viewBox 기준 픽셀. 노드 크기는 렌더러에서 고정해 칸 단위로 배치한다. */
export type Point = readonly [x: number, y: number];

export interface ArchitectureNode {
  id: string;
  /** 노드 왼쪽 위 좌표 */
  at: Point;
  icon: ArchitectureIcon;
  label: string;
  /** 노드 안에 두 줄까지 표시하는 역할 설명 */
  caption: readonly string[];
}

export interface ArchitectureGroup {
  label: string;
  /** 왼쪽 위 좌표와 크기 */
  at: Point;
  size: Point;
}

export interface ArchitectureEdge {
  /** 꺾이는 지점을 순서대로 적은 경로. 마지막 지점에 화살표가 붙는다. */
  path: readonly Point[];
  label?: string;
  /** 라벨 위치. 없으면 경로 첫 구간의 가운데에 둔다. */
  labelAt?: Point;
  /** 사용자 요청이 서버로 들어가는 주 흐름은 강조색으로 그린다. */
  primary?: boolean;
  /** 서비스 밖 외부 인증처럼 보조 흐름은 점선으로 그린다. */
  dashed?: boolean;
  /** 양방향 호출 */
  bidirectional?: boolean;
}

/** 시스템 아키텍처: 구성 요소와 요청 흐름을 코드로 그린 구성도와, 흐름을 글로 풀어 쓴 설명 */
export interface Architecture {
  /** 스크린리더와 검색용 구성도 요약 */
  description: string;
  viewBox: Point;
  groups: ArchitectureGroup[];
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  notes: RichText[];
}

export interface CaseStudy {
  slug: string;
  order: string;
  name: string;
  summary: string;
  screenshotLabel: string;
  /** 서비스 화면 이미지 경로. 없으면 이미지 영역을 렌더링하지 않는다. */
  screenshotSrc?: string;
  /** next/image가 레이아웃 이동 없이 공간을 잡도록 원본 크기를 함께 둔다. */
  screenshotWidth?: number;
  screenshotHeight?: number;
  service: { title: string; description: string; link: ProfileLink };
  period: string;
  periodNote?: string;
  stack: TechItem[];
  team: { type: string; role: string };
  roles: RoleGroup[];
  retrospective: RichText[];
  architecture?: Architecture;
  authFlow?: { title: string; steps: FlowStep[]; notes: string[] };
  designDecision?: DesignDecision;
  apiPolicy?: ApiPolicyRow[];
  troubleshooting: TroubleshootingCase[];
  lesson: RichText;
}
