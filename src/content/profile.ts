import type { Profile } from "./types";

/** Notion 「박진욱 (Backend · Software Engineer)」 페이지 기준 */
export const profile: Profile = {
  name: "박진욱",
  englishName: "Park Jinuk",
  role: "Backend · Software Engineer",
  heroEyebrow: "판단과 검증을 책임지는 개발자",
  heroTitle: "Back-end Developer",
  // 순서: 면접관이 가장 경계하는 "AI 의존"에 답하도록 검증 · 책임 → 규칙 설계 → 이해 · 기본기 순으로 둔다.
  aiPractices: [
    {
      title: "검증까지 한 흐름으로",
      description: "테스트 실행은 AI에게 맡기고, 테스트 기준 설계 · 결과 검토 · 머지 판단은 제가 합니다.",
      points: ["구현 → API · 동시성 테스트 → 문서화 → 커밋을 한 흐름으로 운영", "실패는 어디서 · 왜 · 어떻게 터졌는지 기록한 뒤 수정"],
      result: "AI Todo 부하 테스트에서 경쟁 상태를 찾아 실패율 0.2% → 0%",
      // 결과 문장과 같은 사례를 가리키도록 해당 프로젝트 상세의 트러블슈팅으로 연결한다.
      evidence: { label: "AI Todo 트러블슈팅 02", href: "/projects/ai-todo#troubleshooting" },
    },
    {
      title: "규칙부터 설계",
      description: "코드를 바로 만들게 하지 않고, 아키텍처 · 보안 · 코딩 규칙을 먼저 문서로 정해 작업 기준으로 씁니다.",
      points: [
        "계층 책임 · DTO / Entity 분리 · 트랜잭션 경계를 미리 명시",
        "하드코딩 · 빈 catch · 민감정보 로그 · 범위 밖 리팩터링 금지",
      ],
    },
    {
      title: "이해는 직접",
      description: "생성된 코드를 복사하지 않고, 원리를 이해하는 데 AI를 씁니다.",
      points: ["새 개념은 정의 → 쓰는 이유 → 동작 원리 → 예제 → 활용 순서로 학습"],
      result: "JPA flush 시점을 이해하고 FocusOn 재저장 500 에러의 원인을 찾아 수정",
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
  // 말풍선 문구는 참고 사이트처럼 "어디에 쓰는지"를 짧은 명사구로 적는다(프로젝트 이름 · 문장형 서술 없이).
  primaryStack: [
    { name: "Java", level: "객체지향 설계와 예외 처리" },
    { name: "Spring Boot", level: "REST API 서버와 인증·인가 구현" },
    { name: "MySQL", level: "관계형 테이블 설계와 제약조건 관리" },
    { name: "PostgreSQL", level: "마이그레이션과 제약조건 기반 정합성 관리" },
    { name: "Redis", level: "캐시와 만료 시간 기반 임시 데이터 관리" },
    { name: "Docker", level: "Compose 기반 서버 · DB 실행 환경 구성" },
  ],
  alsoUsed: [
    { name: "AWS EC2", level: "Nginx · HTTPS 설정과 자동 배포" },
    { name: "React", level: "API 연동과 기본 화면 구성" },
    { name: "NestJS", level: "모듈 구조 기반 CRUD API 작성" },
  ],
  closing: {
    headline:
      "단순히 기능을 만드는 개발자가 아니라, 서비스가 예상대로 동작하지 않을 때 원인을 재현하고 시스템의 안정성을 높일 수 있는 개발자가 되고자 합니다.",
    body: "Spring Boot를 기반으로 데이터 정합성, 동시성, 성능 검증, 배포·운영까지 연결되는 문제를 계속 경험하고 있습니다. 설계의 이유를 설명할 수 있는 코드와 검증 가능한 결과를 쌓겠습니다.",
  },
};
