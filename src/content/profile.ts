import type { Profile } from "./types";

/** Notion 「박진욱 (Backend · Software Engineer)」 페이지 기준 */
export const profile: Profile = {
  name: "박진욱",
  englishName: "Park Jinuk",
  role: "Backend · Software Engineer",
  heroEyebrow: "판단과 검증을 책임지는 개발자",
  heroTitle: "Back-end Developer",
  aiPractices: [
    {
      title: "규칙부터 정하기",
      description: "작업 흐름과 검증 기준을 먼저 정하고, AI가 만든 변경도 테스트를 통과해야 커밋합니다.",
    },
    {
      title: "판단은 직접 하기",
      description: "무엇을 넣고 뺄지는 직접 정하고, 추천안도 근거를 비교해 고릅니다.",
    },
    {
      title: "결과 화면으로 검수하기",
      description: "결과 화면을 사용자 입장에서 확인하고, 문제를 짚어 작은 단위로 고칩니다.",
    },
  ],
  motto: "AI는 도구로 활용하되, 기술적 판단과 검증은 스스로 책임집니다.",
  summary: {
    before: "요구사항을 API로 옮길 때",
    keywords: ["데이터 정합성", "인증·인가", "동시성", "운영 환경"],
    after: "을 함께 고려합니다.",
  },
  socials: [
    { kind: "github", label: "GitHub", href: "https://github.com/parkjinuk09" },
    { kind: "blog", label: "Blog", href: "https://parkjinuk09.tistory.com/" },
    { kind: "instagram", label: "Instagram", href: "https://www.instagram.com/parkjinuk09/" },
    { kind: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/parkjinuk/" },
    { kind: "email", label: "Email", href: "mailto:parkjinuk09@gmail.com" },
  ],
  contacts: [
    { label: "Edu", value: "경북소프트웨어마이스터고등학교 소프트웨어과 재학 중" },
    { label: "GitHub", value: "github.com/parkjinuk09", href: "https://github.com/parkjinuk09" },
    { label: "Blog", value: "parkjinuk09.tistory.com", href: "https://parkjinuk09.tistory.com/" },
    { label: "Instagram", value: "@parkjinuk09", href: "https://www.instagram.com/parkjinuk09/" },
    { label: "LinkedIn", value: "linkedin.com/in/parkjinuk", href: "https://www.linkedin.com/in/parkjinuk/" },
    { label: "Email", value: "parkjinuk09@gmail.com", href: "mailto:parkjinuk09@gmail.com" },
    { label: "TEL", value: "010-7673-1674", href: "tel:01076731674" },
  ],
  github: { label: "github.com/parkjinuk09", href: "https://github.com/parkjinuk09" },
  githubContributionsLastYear: 902,
  email: "parkjinuk09@gmail.com",
  // 말풍선에는 프로젝트 이름 없이 "무엇을 할 수 있는 수준인지"만 한 줄로 적는다.
  primaryStack: [
    { name: "Java", level: "객체지향 설계와 예외 처리로 서비스 로직을 작성할 수 있는 수준" },
    { name: "Spring Boot", level: "Security · JPA · WebSocket으로 API 서버를 설계하고 구현할 수 있는 수준" },
    { name: "MySQL", level: "테이블 설계와 제약조건 · 인덱스를 적용할 수 있는 수준" },
    { name: "PostgreSQL", level: "마이그레이션 관리와 제약조건으로 정합성을 지킬 수 있는 수준" },
    { name: "Redis", level: "캐시와 만료 시간 기반 임시 데이터에 사용할 수 있는 수준" },
    { name: "Docker", level: "Compose로 서버 · DB 실행 환경을 구성할 수 있는 수준" },
  ],
  alsoUsed: [
    { name: "AWS EC2", level: "Nginx · HTTPS 설정과 자동 배포를 구성할 수 있는 수준" },
    { name: "React", level: "API 연동과 기본 화면 구성을 할 수 있는 수준" },
    { name: "NestJS", level: "모듈 구조를 이해하고 기본 CRUD API를 작성할 수 있는 수준" },
  ],
  closing: {
    headline:
      "단순히 기능을 만드는 개발자가 아니라, 서비스가 예상대로 동작하지 않을 때 원인을 재현하고 시스템의 안정성을 높일 수 있는 개발자가 되고자 합니다.",
    body: "Spring Boot를 기반으로 데이터 정합성, 동시성, 성능 검증, 배포·운영까지 연결되는 문제를 계속 경험하고 있습니다. 설계의 이유를 설명할 수 있는 코드와 검증 가능한 결과를 쌓겠습니다.",
  },
};
