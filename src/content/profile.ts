import type { Profile } from "./types";

/** Notion 「박진욱 (Backend · Software Engineer)」 페이지 기준 */
export const profile: Profile = {
  name: "박진욱",
  englishName: "Park Jinuk",
  role: "Backend · Software Engineer",
  heroTitle: "Backend Software Engineer",
  motto: "AI는 도구로 활용하되, 기술적 판단과 검증은 스스로 책임지는 개발자입니다.",
  summary: [
    "요구사항을 API로 옮기는 과정에서 ",
    { strong: "데이터 정합성, 인증·인가, 동시성, 운영 환경" },
    "을 함께 고려합니다. ",
    { strong: "Spring Boot" },
    " 중심의 팀 프로젝트에서 ",
    { strong: "ERD·API 명세·JWT 인증·채팅·배포" },
    "를 경험했습니다.",
  ],
  contacts: [
    { label: "Edu", value: "경북소프트웨어마이스터고등학교 소프트웨어과 재학 중" },
    { label: "GitHub", value: "github.com/parkjinuk09", href: "https://github.com/parkjinuk09" },
    { label: "Email", value: "parkjinuk09@gmail.com", href: "mailto:parkjinuk09@gmail.com" },
    { label: "TEL", value: "010-7673-1674", href: "tel:01076731674" },
  ],
  github: { label: "github.com/parkjinuk09", href: "https://github.com/parkjinuk09" },
  email: "parkjinuk09@gmail.com",
  primaryStack: ["Java", "Spring Boot", "MySQL", "PostgreSQL", "Redis", "Docker"],
  alsoUsed: ["AWS EC2", "React", "NestJS"],
  closing: {
    headline:
      "단순히 기능을 만드는 개발자가 아니라, 서비스가 예상대로 동작하지 않을 때 원인을 재현하고 시스템의 안정성을 높일 수 있는 개발자가 되고자 합니다.",
    body: "Spring Boot를 기반으로 데이터 정합성, 동시성, 성능 검증, 배포·운영까지 연결되는 문제를 계속 경험하고 있습니다. 설계의 이유를 설명할 수 있는 코드와 검증 가능한 결과를 쌓겠습니다.",
  },
};
