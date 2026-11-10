/** 강조 표시가 필요한 문장은 조각 배열로 표현한다. strong 조각만 굵게, code 조각은 코드 글꼴로 렌더링된다. */
export type RichText = ReadonlyArray<string | { strong: string } | { code: string }>;

export interface LinkItem {
  label: string;
  href: string;
}

export interface ContactItem {
  label: string;
  value: string;
  href?: string;
}

export interface Profile {
  name: string;
  englishName: string;
  role: string;
  /** 표지 대제목(영문). 글자 단위 애니메이션을 위해 한 줄 문자열로 둔다. */
  heroTitle: string;
  /** Notion 상단 인용 문구. 표지 설명으로 쓴다. */
  motto: string;
  summary: RichText;
  contacts: ContactItem[];
  github: LinkItem;
  email: string;
  primaryStack: string[];
  alsoUsed: string[];
  closing: { headline: string; body: string };
}

/** 핵심 구현처럼 "라벨: 설명" 형태의 항목 */
export interface LabeledItem {
  label?: string;
  text: RichText;
}

export interface DesignDecision {
  title: RichText;
  background: RichText;
  choice: RichText;
  code?: string;
  reasons?: string[];
  verification?: RichText;
  followUp?: string;
}

export interface Troubleshooting {
  title: string;
  problem: RichText[];
  problemCode?: string;
  cause: RichText[];
  solution: RichText[];
  solutionCode?: string;
  /** 문단 하나 또는 목록 */
  result?: RichText[];
  resultAsList?: boolean;
  lesson?: RichText[];
}

export interface ProjectArchitecture {
  title: string;
  /** public 기준 이미지 경로. 없으면 코드로 그린 구성도 또는 설명만 표시한다. */
  imageSrc?: string;
  /** 코드로 그린 구성도를 쓸지 여부 (CapTeam) */
  showDiagram?: boolean;
  note?: RichText;
}

export interface Project {
  slug: string;
  number: string;
  name: string;
  /** 카드에 표시하는 대표 기술 태그 */
  tag: string;
  oneLiner: string;
  period: string;
  teamType: string;
  role: string;
  stack: string[];
  link: LinkItem;
  summary: { lead: string; items: string[] };
  architecture: ProjectArchitecture;
  coreImplementation: LabeledItem[];
  designDecision: DesignDecision;
  troubleshooting: Troubleshooting[];
  lessons: RichText[];
}
