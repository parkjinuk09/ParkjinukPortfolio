/** 강조 표시가 필요한 문장은 조각 배열로 표현한다. strong 조각만 굵게 렌더링된다. */
export type RichText = ReadonlyArray<string | { strong: string }>;

export interface TechItem {
  name: string;
}

export interface ProfileLink {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  headline: string[];
  email: string;
  phone: string;
  github: ProfileLink;
  school: string;
  department: string;
  /** 프로필 사진 경로(public 기준). 없으면 사진 영역을 렌더링하지 않는다. */
  photoSrc?: string;
  summaryTitle: string;
  summary: RichText;
  desiredRole: string;
  mainSkills: TechItem[];
  experiencedSkills: TechItem[];
  education: { school: string; status: string };
  closing: { headline: string[]; body: string[] };
}

export interface IndexEntry {
  number: string;
  title: string;
  description: string;
  anchor: string;
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

export interface ArchitectureNode {
  title: string;
  caption: string;
}

export interface Architecture {
  client: ArchitectureNode;
  clientProtocol: string;
  hostLabel: string;
  proxy: ArchitectureNode;
  proxyLink: string;
  app: ArchitectureNode;
  appLink: string;
  database: ArchitectureNode;
  ci: ArchitectureNode;
  ciLink: string;
  deployTarget: ArchitectureNode;
  notes: RichText[];
}

export interface Project {
  slug: string;
  order: string;
  name: string;
  summary: string;
  screenshotLabel: string;
  /** 서비스 화면 이미지 경로. 없으면 이미지 영역을 렌더링하지 않는다. */
  screenshotSrc?: string;
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
