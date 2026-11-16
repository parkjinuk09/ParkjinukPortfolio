import type { Project } from "./types";

/** Notion 「Main Projects」 각 프로젝트의 머리말(한 줄 소개 · 기간 · 기술 · 링크) */
export const projects: Project[] = [
  {
    slug: "capteam",
    number: "01",
    name: "CapTeam",
    tag: "Spring Boot",
    oneLiner: "학교 캡스톤 프로젝트의 팀 구성·공지·채팅·활동 기록을 하나의 서비스에서 관리하는 협업 플랫폼",
    period: "2026.03 ~ 2026.07",
    teamType: "팀 프로젝트",
    role: "백엔드 개발",
    stack: ["Java 21", "Spring Boot 3", "MySQL", "STOMP", "Docker", "AWS EC2", "Nginx"],
    link: { label: "capteam.choies.kr", href: "https://capteam.choies.kr/" },
    imageSrc: "/images/project-capteam-thumb.webp",
    category: "main",
  },
  {
    slug: "focuson",
    number: "02",
    name: "FocusOn",
    tag: "Spring Boot",
    oneLiner: "사용자의 학습 목표와 현재 브라우징 맥락을 비교해 집중 흐름을 분석하는 Chrome 확장 프로그램 및 데스크탑 대시보드",
    period: "2026.09 ~ 진행 중",
    teamType: "팀 프로젝트",
    role: "백엔드 개발",
    stack: ["Java", "Spring Boot", "Spring Security", "PostgreSQL", "Spring Data JPA", "Flyway", "Swagger", "Docker"],
    link: { label: "FocusOn GitHub", href: "https://github.com/What-a-move/FocusOn" },
    imageSrc: "/images/project-focuson-thumb.webp",
    category: "main",
  },
  {
    slug: "ai-todo",
    number: "03",
    name: "AI Todo Assistant",
    tag: "FastAPI",
    oneLiner: "말로 할 일을 추가 · 수정 · 완료하는 개인용 AI 비서. 내 맥의 로컬 AI 모델(Ollama)로 외부 API 키 없이 동작",
    period: "2026.11",
    teamType: "개인 프로젝트",
    role: "기획 · 방향 결정 · 검증",
    stack: ["FastAPI", "PostgreSQL", "Redis", "Ollama", "React", "Swift"],
    link: { label: "AI Todo Assistant GitHub", href: "https://github.com/parkjinuk09/ai-todo-assistant" },
    imageSrc: "/images/project-ai-todo-thumb.webp",
    category: "other",
  },
];

/** Projects 영역 설명 (Notion 상단 요약 문장) */
export const projectsDescription = "Spring Boot 중심의 팀 프로젝트에서 ERD · API 명세 · JWT 인증 · 채팅 · 배포를 경험했습니다.";

export const mainProjects = projects.filter((project) => project.category === "main");
export const otherProjects = projects.filter((project) => project.category === "other");
