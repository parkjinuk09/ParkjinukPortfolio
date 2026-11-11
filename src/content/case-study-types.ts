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

/** 시스템 아키텍처: 직접 그린 구성도 이미지와, 이미지에 담긴 흐름을 글로 풀어 쓴 설명 */
export interface Architecture {
  image: {
    src: string;
    /** next/image가 레이아웃 이동 없이 공간을 잡도록 원본 크기를 둔다. */
    width: number;
    height: number;
    alt: string;
  };
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
