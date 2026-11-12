/** 강조 표시가 필요한 문장은 조각 배열로 표현한다. strong 조각만 굵게, code 조각은 코드 글꼴로 렌더링된다. */
export type RichText = ReadonlyArray<string | { strong: string } | { code: string }>;

export interface LinkItem {
  label: string;
  href: string;
}

export type SocialKind = "github" | "blog" | "instagram" | "linkedin" | "email";

export interface SocialLink {
  kind: SocialKind;
  label: string;
  href: string;
}

/** About 요약: 한 문장을 "무엇을 고려하는지 / 무엇을 경험했는지"로 나눠 읽기 쉽게 보여준다. */
/** About 왼쪽 한 문장 소개: 앞 문장 + 강조할 키워드 + 뒷 문장 */
export interface ProfileSummary {
  before: string;
  keywords: string[];
  after: string;
}

export interface ContactItem {
  label: string;
  value: string;
  href?: string;
}

/** 기술 스택 한 항목: 이름과 마우스를 올렸을 때 보여줄 사용 수준 한 줄 */
export interface StackSkill {
  name: string;
  level: string;
}

export interface AiPractice {
  title: string;
  description: string;
}

export interface Profile {
  name: string;
  englishName: string;
  role: string;
  /** 표지 대제목 위의 짧은 수식어 */
  heroEyebrow: string;
  /** 표지 대제목(영문). 글자 단위 애니메이션을 위해 한 줄 문자열로 둔다. */
  heroTitle: string;
  /** About 영역의 강점 카드 (Notion 「배운 점」 문장 기준) */
  /** AI 활용 방식: 원칙 이름과 한 문장 요약 */
  aiPractices: AiPractice[];
  /** Notion 상단 인용 문구. 표지 설명으로 쓴다. */
  motto: string;
  summary: ProfileSummary;
  socials: SocialLink[];
  contacts: ContactItem[];
  github: LinkItem;
  /** GitHub 프로필의 "contributions in the last year" 값. 갱신할 때 이 숫자만 바꾼다. */
  githubContributionsLastYear: number;
  email: string;
  primaryStack: StackSkill[];
  alsoUsed: StackSkill[];
  closing: { headline: string; body: string };
}

/**
 * 메인 페이지 프로젝트 카드 정보 (Notion 「Main Projects」 머리말 기준).
 * 카드를 누르면 보이는 상세 내용은 Figma 형식을 따르는 case-studies.ts에 있다.
 */
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
  /** 카드 이미지 (사용자가 제공한 사진을 잘라 만든 public 경로) */
  imageSrc: string;
}
