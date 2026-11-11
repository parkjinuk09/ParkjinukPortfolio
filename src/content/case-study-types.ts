/** Figma 형식 프로젝트 상세(케이스 스터디) 데이터 타입. 강조 문장은 조각 배열로 표현하며 strong 조각만 굵게 렌더링된다. */
export type RichText = ReadonlyArray<string | { strong: string }>;

export interface TechItem {
  name: string;
}

export interface ProfileLink {
  label: string;
  href: string;
}

/** 기술 스택 묶음(백엔드 · 통신 · 개발 도구 · 인프라) */
export interface TechGroup {
  title: string;
  items: TechItem[];
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

/** 구성도에서 쓰는 아이콘. ai는 직접 그린 선 아이콘, 나머지는 public/icons/tech의 Devicon 파일 이름이다. */
export type ArchitectureIcon =
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

/** 구성도 좌표: SVG viewBox 기준 픽셀 */
export type Point = readonly [x: number, y: number];

/** 상자 없이 로고 · 이름 · 역할 한 줄로 그리는 구성 요소. at은 로고의 가운데 좌표다. */
export interface ArchitectureNode {
  id: string;
  at: Point;
  icon: ArchitectureIcon;
  label: string;
  caption?: string;
}

/** 배포 단위(예: AWS EC2). 점선 둥근 테두리, 왼쪽 위에 아이콘 배지와 이름을 단다. */
export interface ArchitectureGroup {
  label: string;
  icon: ArchitectureIcon;
  /** 왼쪽 위 좌표와 크기 */
  at: Point;
  size: Point;
}

/** 두 구성 요소를 잇는 직선. 기본은 양방향, 한쪽으로만 보내는 흐름은 oneWay로 표시한다. */
export interface ArchitectureEdge {
  from: string;
  to: string;
  oneWay?: boolean;
}

/** 시스템 아키텍처: 구성 요소와 연결을 코드로 그린 구성도와, 흐름을 글로 풀어 쓴 설명 */
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
  stack: TechGroup[];
  team: { type: string; role: string };
  roles: RoleGroup[];
  architecture?: Architecture;
  designDecision?: DesignDecision;
  apiPolicy?: ApiPolicyRow[];
  troubleshooting: TroubleshootingCase[];
  lesson: RichText;
}
