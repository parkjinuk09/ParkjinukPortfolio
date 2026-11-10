import type { IndexEntry, Profile } from "./types";

export const profile: Profile = {
  name: "박진욱",
  role: "Backend · Software Engineer",
  tagline:
    "데이터 정합성 · 인증과 인가 · 동시성 · 운영 환경을 함께 고민하는 Spring Boot 백엔드 개발자",
  headline: [
    "AI는 도구로 활용하되,",
    "기술적 판단과 검증은 스스로 책임지는",
    "백엔드 개발자 박진욱입니다.",
  ],
  email: "parkjinuk09@gmail.com",
  phone: "010-7673-1674",
  github: { label: "github.com/parkjinuk09", href: "https://github.com/parkjinuk09" },
  school: "경북소프트웨어마이스터고등학교",
  department: "소프트웨어과",
  summaryTitle: "요구사항을 API로 옮길 때, 정합성과 운영까지 함께 봅니다",
  summary: [
    "요구사항을 API로 옮기는 과정에서 ",
    { strong: "데이터 정합성, 인증·인가, 동시성, 운영 환경" },
    "을 함께 고려합니다. Spring Boot 중심의 팀 프로젝트에서 ERD·API 명세·JWT 인증·채팅·배포를 경험했습니다.",
  ],
  desiredRole: "Backend Developer",
  mainSkills: [
    { name: "Java" },
    { name: "Spring Boot" },
    { name: "MySQL" },
    { name: "PostgreSQL" },
    { name: "Redis" },
    { name: "Docker" },
  ],
  experiencedSkills: [
    { name: "AWS EC2" },
    { name: "Nginx" },
    { name: "GitHub Actions" },
    { name: "React" },
    { name: "NestJS" },
  ],
  education: { school: "경북소프트웨어마이스터고등학교", status: "소프트웨어과 재학 중" },
  closing: {
    headline: [
      "기능을 만드는 것에서 멈추지 않고,",
      "예상대로 동작하지 않을 때 원인을 재현하고",
      "시스템의 안정성을 높이는 개발자가 되겠습니다.",
    ],
    body: [
      "Spring Boot를 기반으로 데이터 정합성, 동시성, 성능 검증, 배포 · 운영까지 연결되는 문제를 계속 경험하고 있습니다.",
      "설계의 이유를 설명할 수 있는 코드와 검증 가능한 결과를 쌓겠습니다.",
    ],
  },
};

export const portfolioIndex: IndexEntry[] = [
  { number: "01", title: "Intro", description: "소개 · 기술 스택 · 학력 · 링크", anchor: "intro" },
  {
    number: "02",
    title: "CapTeam",
    description: "캡스톤 협업 플랫폼 — 개요 · 아키텍처 · 트러블슈팅",
    anchor: "capteam",
  },
  {
    number: "03",
    title: "FocusOn",
    description: "학습 집중 분석 서비스 — 개요 · 설계 결정 · 트러블슈팅",
    anchor: "focuson",
  },
  {
    number: "04",
    title: "Awards & Activities",
    description: "수상 · 활동 · 해외 경험 · Closing",
    anchor: "awards",
  },
];
