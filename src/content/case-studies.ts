import type { CaseStudy } from "./case-study-types";

const capTeam: CaseStudy = {
  slug: "capteam",
  order: "02",
  name: "CapTeam",
  summary: "흩어진 캡스톤 운영(팀·공지·채팅·활동 일지)을 하나의 도메인으로 묶은 학교 협업 플랫폼입니다",
  screenshotLabel: "CapTeam 서비스 첫 화면 — 설문 기반 캡스톤 팀 빌딩",
  screenshotSrc: "/images/project-capteam-screen.webp",
  screenshotWidth: 1048,
  screenshotHeight: 524,
  service: {
    title: "학교 캡스톤 협업 플랫폼",
    description:
      "학생과 교사가 같은 정보를 보더라도 수행하는 작업과 권한이 다릅니다. 팀 관리·공지·활동 일지·메시지를 역할 기반으로 한곳에서 관리합니다.",
    link: { label: "capteam.choies.kr", href: "https://capteam.choies.kr" },
  },
  period: "2026.03 ~ 2026.07",
  periodNote: "캡스톤 프로젝트 대상 수상",
  stack: [
    { title: "백엔드", items: [{ name: "Java 21" }, { name: "Spring Boot 3" }, { name: "Spring Security" }, { name: "MySQL" }] },
    { title: "통신 · 개발 도구", items: [{ name: "STOMP" }] },
    { title: "인프라", items: [{ name: "Docker" }, { name: "AWS EC2" }, { name: "Nginx" }, { name: "GitHub Actions" }] },
  ],
  team: { type: "팀 프로젝트", role: "백엔드 개발 담당" },
  roles: [
    {
      title: "Backend",
      items: [
        "Access / Refresh Token 분리, Spring Security 인가 정책",
        "사전 등록 학교 계정 기반 로그인, 최초 비밀번호 해시 저장",
        "공지 · 활동 일지 CRUD (DTO · Service · JPA 계층 분리)",
        "STOMP 팀 채널 실시간 메시지 + 이력 엔티티 분리",
      ],
    },
    {
      title: "Infra",
      items: ["EC2 · Nginx · Docker, HTTPS 도메인 연결", "GitHub Actions → EC2 자동 배포"],
    },
  ],
  architecture: {
    description:
      "CapTeam 시스템 아키텍처: React 클라이언트가 AWS EC2의 Spring Boot와 통신하고, Spring Boot는 Python 분석 서버 · MySQL과 연결된다. Python 분석 서버는 OpenAI API로 팀 매칭 후보를 만들고, 파일 · 로그는 Amazon S3에 저장한다.",
    viewBox: [1000, 540],
    groups: [{ label: "AWS EC2", icon: "aws", at: [220, 40], size: [480, 470] }],
    nodes: [
      { id: "react", at: [100, 230], icon: "react", label: "React Client", caption: "웹 화면" },
      { id: "spring", at: [340, 230], icon: "spring", label: "Core 서버 (Spring Boot)", caption: "설문 · 팀 · 채팅" },
      { id: "python", at: [590, 230], icon: "python", label: "분석 서버 (Python)", caption: "팀 매칭 후보 생성" },
      { id: "mysql", at: [465, 410], icon: "mysql", label: "Main DB (MySQL)" },
      { id: "s3", at: [880, 80], icon: "aws", label: "Amazon S3", caption: "파일 · 로그 저장" },
      { id: "openai", at: [880, 230], icon: "ai", label: "LLM (OpenAI API)" },
    ],
    edges: [
      { from: "react", to: "spring" },
      { from: "spring", to: "python" },
      { from: "python", to: "openai" },
      { from: "spring", to: "mysql" },
      { from: "spring", to: "s3", oneWay: true },
    ],
    notes: [
      ["사용자는 ", { strong: "React 웹" }, "에서 로그인 · 설문 · 팀 생성 · 채팅 · 공지 · 일지를 이용합니다."],
      [
        { strong: "Spring Boot" },
        "가 설문 · 팀 생성 비즈니스 로직을 처리하고, 사용자 정보는 ",
        { strong: "MySQL" },
        ", 파일 · 로그는 ",
        { strong: "S3" },
        "에 저장합니다.",
      ],
      [
        { strong: "Python 분석 서버" },
        "가 OpenAI로 학생을 분석해 팀 매칭 후보와 이유를 만들고, 결과를 Spring Boot에 전달합니다.",
      ],
      ["팀 채팅은 ", { strong: "STOMP 채널 구독" }, " 방식으로 전달하고, 메시지는 별도 엔티티로 이력을 유지합니다."],
    ],
  },
  designDecision: {
    title: "설계 결정 — UserTeam 연결 엔티티로 팀 소속 표현",
    background: [
      "User와 Team은 다대다처럼 보이지만, 팀장과 팀원을 구분하고 소속을 기준으로 권한을 검증해야 했습니다.",
    ],
    choice: [
      "@ManyToMany 대신 ",
      { strong: "UserTeam을 별도 엔티티" },
      "로 모델링하고 역할(teamRole)을 저장했습니다.",
    ],
    diagramCode: "User (1) ── (N) UserTeam (N) ── (1) Team\n                   └─ teamRole: LEADER / MEMBER",
    benefits: [
      "관계에 역할 · 가입 시점 등 속성을 추가할 수 있습니다.",
      "팀장 권한을 사용자 전역 권한과 구별할 수 있습니다.",
      "팀 탈퇴 · 학기 종료 등 관계의 생명주기를 관리하기 쉽습니다.",
    ],
    notes: [
      "후속 검증: “한 팀에 팀장은 한 명” 규칙은 서비스 로직뿐 아니라 동시 요청 정합성까지 검증할 예정입니다.",
    ],
  },
  troubleshooting: [
    {
      number: "01",
      title: "HTTPS 환경에서 HTTP API 요청이 차단됐습니다",
      paragraphs: [
        [
          "HTTPS로 배포된 프론트엔드에서 EC2의 HTTP API를 호출하자 요청이 막혔습니다. 처음엔 CORS 문제로 봤지만 ",
          { strong: "Spring Boot 로그에 요청이 남지 않았고" },
          ", 브라우저 콘솔에 Mixed Content 오류가 찍혀 있었습니다.",
        ],
        [
          "Mixed Content는 요청이 서버에 도달하기 전에 ",
          { strong: "브라우저가 차단" },
          "하는 문제이고, CORS는 서버가 다른 출처를 허용할지 정하는 정책입니다. 백엔드 CORS 설정만으로는 해결할 수 없었습니다.",
        ],
        [
          { strong: "Nginx에 HTTPS를 적용" },
          "하고 리버스 프록시로 Spring Boot에 전달하도록 바꾼 뒤, 프론트 API 주소를 HTTPS 도메인으로 변경했습니다. CORS 허용 출처도 실제 프론트 주소 기준으로 다시 설정해 일반 · 인증 API 모두 정상 동작을 확인했습니다.",
        ],
      ],
      beforeAfter: {
        before: "HTTPS 프론트 → http://EC2:8080 (브라우저 차단)",
        after: "HTTPS 프론트 → https://도메인 → Nginx → Spring Boot",
      },
    },
    {
      number: "02",
      title: "GitHub Actions 배포 중 SSH 인증이 실패했습니다",
      paragraphs: [
        [
          "Actions에서 EC2로 배포하는 단계에서 ",
          { strong: "ssh: handshake failed" },
          " 오류가 났습니다. 보안 그룹을 의심했지만 연결 자체는 되었고, ",
          { strong: "인증 단계" },
          "에서 실패하고 있었습니다.",
        ],
        [
          "Secret에 등록한 개인 키가 인증 수단으로 정상 로드되지 않았습니다. 게다가 EC2가 직접 git pull 하는 구조라 ",
          { strong: "SSH 인증과 GitHub 저장소 인증에 동시에 의존" },
          "하고 있었습니다.",
        ],
        [
          "Runner에서 키 파일 권한을 600으로 제한하고 ",
          { strong: "ssh-keygen -y -f로 키 형식을 먼저 검증" },
          "했습니다. 소스는 Actions에서 tar로 패키징해 전송하고, EC2는 압축 해제 · docker build · 컨테이너 재생성만 하도록 책임을 나눴습니다.",
        ],
      ],
      code: "ssh: handshake failed\nunable to authenticate, attempted methods [none]",
      beforeAfter: {
        before: "EC2가 비공개 저장소를 git pull (EC2에 GitHub 인증 정보 보관)",
        after: "Actions: checkout → 키 검증 → tar 전송 / EC2: 빌드 · 실행만 담당",
      },
    },
  ],
  lesson: [
    "배포 문제는 명령을 재시도하기보다 ",
    { strong: "네트워크 연결 · SSH 인증 · 소스 전달 · 컨테이너 실행 단계를 나눠" },
    " 확인해야 합니다. CI가 배포 대상을 확정하고 서버는 실행 환경에 집중하도록 책임을 나누는 것이 보안과 유지보수 모두에 유리했습니다.",
  ],
};

const focusOn: CaseStudy = {
  slug: "focuson",
  order: "03",
  name: "FocusOn",
  summary: "학습 목표와 현재 브라우징 맥락을 비교해 집중 흐름을 분석하는 Chrome 확장 + 데스크탑 대시보드입니다",
  screenshotLabel: "FocusOn 데스크탑 대시보드 홈 — 집중 달력과 지난 목표",
  screenshotSrc: "/images/project-focuson-screen.webp",
  screenshotWidth: 1342,
  screenshotHeight: 694,
  service: {
    title: "학습 집중 흐름 분석 서비스",
    description:
      "사용자가 설정한 학습 목표와 활동 맥락을 연결합니다. 백엔드에서 사용자 설정, 학습 목표와 세션 API를 맡아 데이터 검증과 동시 요청 정합성을 다뤘습니다.",
    link: { label: "github.com/What-a-move/FocusOn", href: "https://github.com/What-a-move/FocusOn" },
  },
  period: "2026.09 ~ 진행 중",
  stack: [
    {
      title: "백엔드",
      items: [{ name: "Java" }, { name: "Spring Boot" }, { name: "Spring Security" }, { name: "Spring Data JPA" }, { name: "PostgreSQL" }],
    },
    { title: "통신 · 개발 도구", items: [{ name: "Flyway" }, { name: "Swagger" }] },
    { title: "인프라", items: [{ name: "Docker" }] },
  ],
  team: { type: "팀 프로젝트", role: "백엔드 개발 담당" },
  roles: [
    {
      title: "사용자 설정",
      items: ["프로필 · 동의 · 집중 설정 · 분석 제외 도메인 API", "도메인 정규화 · 중복 제거 · 개수 제한"],
    },
    {
      title: "학습 목표 · 세션",
      items: [
        "목표 CRUD + 입력값 · 소유권 검증, soft delete",
        "세션 시작 · 활성 세션 조회, 사용자별 활성 세션 제약",
        "멱등성 키로 중복 세션 생성 방지",
      ],
    },
    {
      title: "DB · 검증",
      items: [
        "PostgreSQL 제약 + Flyway migration 이력 관리",
        "Swagger 수동 확인, 자동 테스트, 격리 PostgreSQL 동시 요청 검증",
      ],
    },
  ],
  architecture: {
    description:
      "FocusOn 시스템 아키텍처: Electron 데스크탑 앱과 Chrome 확장이 AWS EC2(Docker Compose)의 Spring Boot로 요청을 보낸다. Spring Boot는 Python 분석 서버 · PostgreSQL · Redis와 연결되고, 로그인은 Google OAuth로 처리한다.",
    viewBox: [1000, 540],
    groups: [{ label: "AWS EC2 · Docker Compose", icon: "aws", at: [230, 40], size: [480, 470] }],
    nodes: [
      { id: "electron", at: [100, 130], icon: "electron", label: "Electron 데스크탑", caption: "세션 제어 · 카메라 분석" },
      { id: "chrome", at: [100, 340], icon: "chrome", label: "Chrome 확장", caption: "탭 이동 흐름 수집" },
      { id: "spring", at: [350, 230], icon: "spring", label: "Core 서버 (Spring Boot)", caption: "인증 · 요청 처리" },
      { id: "python", at: [600, 230], icon: "python", label: "분석 서버 (Python)", caption: "목표 관련성 · 이탈 판단" },
      { id: "postgresql", at: [370, 420], icon: "postgresql", label: "Main DB (PostgreSQL)" },
      { id: "redis", at: [590, 420], icon: "redis", label: "Cache (Redis)", caption: "연결 코드 · 분석 캐시" },
      { id: "google", at: [880, 80], icon: "google", label: "Google OAuth", caption: "소셜 로그인" },
    ],
    edges: [
      { from: "electron", to: "spring" },
      { from: "chrome", to: "spring", oneWay: true },
      { from: "spring", to: "python" },
      { from: "spring", to: "postgresql" },
      { from: "spring", to: "redis" },
      { from: "spring", to: "google" },
    ],
    notes: [
      [
        "사용자는 ",
        { strong: "Electron 데스크탑 앱" },
        "(세션 제어 · 로컬 카메라 분석)과 ",
        { strong: "Chrome 확장" },
        "(이동 흐름 수집)을 함께 사용합니다.",
      ],
      [
        "데스크탑은 REST API로, 확장은 수집 데이터로 ",
        { strong: "Spring Boot" },
        "에 요청하고, Spring Boot가 사용자 인증과 요청을 처리합니다.",
      ],
      [
        "Spring Boot는 ",
        { strong: "Python 분석 서버" },
        "에 분석을 요청해 목표 관련성 · 이탈을 판단하고, 사용자 정보 · 학습 기록 · AI 분석 결과는 ",
        { strong: "PostgreSQL" },
        ", 연결 코드 · 분석 캐시는 ",
        { strong: "Redis" },
        "에 둡니다.",
      ],
      ["로그인은 ", { strong: "Google OAuth" }, "로 처리하고, 서버 전체는 AWS EC2의 Docker Compose로 운영합니다."],
    ],
  },
  designDecision: {
    title: "설계 결정 — 목표 변경과 세션 시작의 정합성",
    description: "목표 수정 · 삭제와 학습 세션 시작이 동시에 들어오면, 세션에 저장되는 목표 문구가 어긋날 수 있습니다.",
    flowInputs: [
      { title: "세션 시작", lines: ["POST /sessions", "멱등성 키 포함"] },
      { title: "목표 수정 · 삭제", lines: ["PATCH · DELETE", "/goals/{id}"] },
    ],
    flowConnectorLabel: "동시 요청",
    flow: [
      { title: "사용자 행 잠금", lines: ["두 요청이 같은 순서로", "사용자 행 잠금을 획득"], highlighted: true },
      { title: "참조 검사", lines: ["활성 세션이 참조하는", "목표의 변경을 차단"] },
      { title: "스냅샷 유지", lines: ["종료된 세션은 당시", "목표 문구를 그대로 보존"] },
    ],
    notes: [
      "사용자별 활성 세션은 하나만 허용하고(DB 제약), 멱등성 키로 같은 요청의 중복 생성을 막습니다.",
      "목표 삭제는 soft delete로 처리해 종료된 세션의 목표 스냅샷을 유지합니다.",
      "검증: 격리 PostgreSQL에서 동시 출발과 잠금 대기를 유도해 허용 응답과 스냅샷 정합성을 확인했습니다.",
    ],
  },
  troubleshooting: [
    {
      number: "01",
      title: "분석 제외 도메인을 다시 저장하면 500이 발생했습니다",
      paragraphs: [
        [
          "사용자가 기존 분석 제외 도메인 목록을 그대로 다시 저장하면 ",
          { strong: "두 번째 요청에서 500 오류" },
          "가 났습니다.",
        ],
        [
          "기존 목록을 삭제한 뒤 같은 도메인을 다시 저장하는 과정에서, ",
          { strong: "삭제 SQL이 먼저 flush되지 않아" },
          " PostgreSQL의 (사용자, 도메인) 유일 제약과 충돌했습니다.",
        ],
        [
          "사용자 행을 잠가 같은 사용자의 목록 교체를 순서대로 처리하고, ",
          { strong: "기존 목록 삭제를 flush한 뒤" },
          " 새 목록을 저장하도록 수정했습니다. H2와 격리 PostgreSQL에서 동일한 50개 도메인을 두 번 교체하는 회귀 테스트로 확인했습니다.",
        ],
      ],
      beforeAfter: {
        before: "기존 목록 삭제 → 새 목록 저장 (flush 시 INSERT가 먼저 실행되어 unique 위반)",
        after: "사용자 행 잠금 → 기존 목록 삭제 → flush → 새 목록 저장",
      },
    },
  ],
  lesson: [
    "JPA에서 메서드 호출 순서와 실제 SQL 실행 시점은 다를 수 있습니다. ",
    { strong: "데이터베이스 제약과 flush 시점을 함께" },
    " 확인해야 한다는 것을 배웠습니다.",
  ],
};

/**
 * AI Todo Assistant: 사용자가 정리한 프로젝트 설명(2026.11.16) 기준.
 * 구현은 Claude Code로 했고 사용자는 기획 · 방향 결정 · 문제 발견 · 결과 검증을 맡았으므로, 역할도 그 기준으로 적는다.
 */
const aiTodo: CaseStudy = {
  slug: "ai-todo",
  order: "04",
  name: "AI Todo Assistant",
  summary: "말로 할 일을 추가 · 수정 · 완료하는 개인용 AI 비서입니다. 내 맥의 로컬 AI 모델로 외부 API 키 없이 동작합니다",
  screenshotLabel: "AI Todo Assistant 할 일 화면 — 오늘 · 다가오는 일 자동 분류",
  screenshotSrc: "/images/project-ai-todo-screen.webp",
  screenshotWidth: 1600,
  screenshotHeight: 1034,
  logoSrc: "/images/project-ai-todo-logo.webp",
  service: {
    title: "말로 관리하는 개인용 AI 할 일 비서",
    description:
      "\"다음주 화요일 7시 발표 준비 추가\"처럼 말하면 할 일을 추가 · 수정 · 완료 · 삭제합니다. Claude Code(AI 코딩 도구)로 구현하고, 기획 · 방향 결정 · 문제 발견 · 결과 검증을 직접 맡았습니다. 배포본은 로컬 모델이 없어 비서 기능만 꺼져 있습니다.",
    link: { label: "ai-todo-web-rho.vercel.app", href: "https://ai-todo-web-rho.vercel.app" },
    repository: { label: "github.com/parkjinuk09/ai-todo-assistant", href: "https://github.com/parkjinuk09/ai-todo-assistant" },
  },
  period: "2026.11.15 ~ 11.16",
  stack: [
    {
      title: "백엔드",
      items: [{ name: "FastAPI" }, { name: "SQLAlchemy 2.0" }, { name: "Pydantic v2" }, { name: "PostgreSQL 16" }, { name: "Redis 7" }],
    },
    { title: "AI", items: [{ name: "Ollama (qwen2.5:7b)" }, { name: "Tool calling" }] },
    {
      title: "프론트엔드 · 앱",
      items: [{ name: "React 19" }, { name: "Vite" }, { name: "Tailwind CSS v4" }, { name: "PWA" }, { name: "Swift (AppKit)" }],
    },
    {
      title: "테스트 · 배포",
      items: [{ name: "pytest" }, { name: "k6" }, { name: "GitHub Actions" }, { name: "Vercel" }, { name: "Neon" }, { name: "Upstash" }],
    },
  ],
  team: { type: "개인 프로젝트", role: "기획 · 방향 결정 · 검증" },
  roles: [
    {
      title: "기획 · 방향 결정",
      items: [
        "할 일 · 캘린더 · 월간 기록 · 맥 빠른 추가(⌘⇧D) 기능 범위 기획",
        "외부 AI API를 쓸 수 없게 되자 로컬 모델(Ollama)로 전환 결정",
        "AI 권한을 5개 함수로 제한하고, 계산 · 조회는 코드가 맡도록 원칙 설정",
      ],
    },
    {
      title: "문제 발견 · 검증",
      items: [
        "k6 부하 테스트로 병목 · 경쟁 상태 · 캐시 몰림 발견",
        "단계별 측정으로 실제 병목(응답 변환 · 검증) 확인",
        "pytest 37개 · GitHub Actions로 회귀 검증",
      ],
    },
    {
      title: "구현 방식",
      items: ["Claude Code로 구현, 이슈 → PR 단위로 작업 (커밋 17개)"],
    },
  ],
  results: {
    condition: "k6 · 동시 사용자 50명 · 30초 · 할 일 3,000개",
    metrics: [
      { label: "처리량", before: "85.9 RPS", after: "372.6 RPS", change: "4.3배" },
      { label: "p95 응답시간", before: "1,072ms", after: "252ms", change: "76% 감소" },
      { label: "읽기 전용 처리량", before: "92.0 RPS", after: "864.3 RPS", change: "9.4배" },
      { label: "부하 시 실패율", before: "0.2%", after: "0%" },
      { label: "지난 달 리포트 AI 호출", before: "요청마다", after: "월 1회" },
    ],
  },
  architecture: {
    description:
      "AI Todo Assistant 시스템 아키텍처: React 웹(PWA)과 Mac 앱이 FastAPI 서버로 요청하고, FastAPI는 로컬 Ollama 모델로 의도를 파악하며 PostgreSQL에 할 일을, Redis에 응답 캐시와 락을 둔다.",
    viewBox: [1000, 520],
    groups: [],
    nodes: [
      { id: "react", at: [120, 140], icon: "react", label: "React 웹 (PWA)", caption: "할 일 · 캘린더 · 월간 기록" },
      { id: "mac", at: [120, 370], icon: "apple", label: "Mac 앱 (Swift)", caption: "⌘⇧D 빠른 추가" },
      { id: "fastapi", at: [470, 250], icon: "fastapi", label: "API 서버 (FastAPI)", caption: "검증 · 캐시 규칙 한 곳" },
      { id: "ollama", at: [840, 80], icon: "ai", label: "LLM (Ollama)", caption: "qwen2.5:7b · 의도 파악" },
      { id: "postgresql", at: [840, 250], icon: "postgresql", label: "Main DB (PostgreSQL)", caption: "할 일 · 통계 계산" },
      { id: "redis", at: [840, 420], icon: "redis", label: "Cache (Redis)", caption: "응답 캐시 · 락" },
    ],
    edges: [
      { from: "react", to: "fastapi" },
      { from: "mac", to: "fastapi" },
      { from: "fastapi", to: "ollama" },
      { from: "fastapi", to: "postgresql" },
      { from: "fastapi", to: "redis" },
    ],
    notes: [
      [
        "사용자는 ",
        { strong: "React 웹(PWA)" },
        "과 ",
        { strong: "Mac 메뉴 막대 앱" },
        "을 씁니다. Mac 앱은 어느 앱에서든 ⌘⇧D로 한 줄을 입력하면 결과를 맥 알림으로 알려 줍니다.",
      ],
      [
        "AI 비서 경로와 일반 API가 ",
        { strong: "같은 서비스 코드" },
        "를 써서 검증 · 캐시 규칙이 한 곳에 있습니다.",
      ],
      [
        "AI는 내 맥에서 도는 ",
        { strong: "Ollama 로컬 모델" },
        "로 의도만 파악하고, 숫자 계산과 조회는 ",
        { strong: "PostgreSQL" },
        "이, 응답 캐시와 재계산 락은 ",
        { strong: "Redis" },
        "가 맡습니다.",
      ],
      ["배포본은 Vercel · Neon(Postgres) · Upstash(Redis)로 운영하며, 로컬 모델이 없어 비서 기능만 꺼집니다."],
    ],
  },
  designDecision: {
    title: "설계 결정 — 계산 · 조회는 코드가, 의도 파악만 AI가",
    description:
      "작은 로컬 모델은 \"다음주 화요일\"을 일요일로 계산하거나, \"추가했어\"라고 답하고 실제로는 실행하지 않는 경우가 있었습니다.",
    flowInputs: [{ title: "사용자 문장", lines: ["다음주 화요일 7시", "발표 준비 추가"] }],
    flowConnectorLabel: "요청",
    flow: [
      { title: "날짜 미리 계산", lines: ["서버가 \"다음주 화요일\"을", "실제 날짜로 계산해 전달"] },
      { title: "AI는 의도만 파악", lines: ["허용된 5개 함수 중", "무엇을 할지만 결정"], highlighted: true },
      { title: "실행 확인", lines: ["실제 반영 여부를 확인하고", "안 됐으면 다시 시키거나 정직하게 답변"] },
    ],
    notes: [
      "AI에게 DB를 직접 주지 않고 추가 · 조회 · 수정 · 완료 · 삭제 5개 함수만 허용합니다.",
      "조회 질문은 AI 없이 DB에서 바로 답하고, 월간 통계 숫자도 DB가 계산해 AI에게는 결과만 줘서 회고 문장만 쓰게 합니다(숫자 환각 방지).",
      "결과: 같은 문장 세트 기준 실제 반영률 1/6 → 6/6.",
    ],
  },
  troubleshooting: [
    {
      number: "01",
      title: "Redis 캐시를 붙였는데 빨라지지 않았습니다",
      paragraphs: [
        ["캐시 적중률이 44%인데도 ", { strong: "p95 응답시간이 그대로" }, "였습니다(1,667 → 1,677ms)."],
        [
          "단계별로 측정해 보니 DB 조회는 47ms뿐이었고, 진짜 병목은 캐시에서 꺼낸 뒤에도 반복되던 ",
          { strong: "JSON 변환 · 검증(CPU 작업)" },
          "이었습니다. Python은 CPU 작업을 한 번에 하나씩 처리(GIL)해서 처리량이 막혔습니다.",
        ],
        ["변환이 끝난 ", { strong: "응답 바이트를 그대로 캐시" }, "하고 그대로 응답하도록 바꿔 55 → 372 RPS가 됐습니다."],
      ],
      beforeAfter: {
        before: "캐시 적중 후에도 매번 JSON 변환 · 검증 (55 RPS)",
        after: "변환이 끝난 응답 바이트를 캐시해 그대로 응답 (372 RPS)",
      },
    },
    {
      number: "02",
      title: "부하 테스트에서만 500 에러가 났습니다",
      paragraphs: [
        ["동시 요청 시 ", { strong: "0.2%가 중복 키 에러" }, "로 실패했습니다."],
        [
          "두 요청이 동시에 \"저장본 없음\"을 확인하고 둘 다 저장을 시도하는 ",
          { strong: "check-then-act 경쟁 상태" },
          "였습니다.",
        ],
        [
          "확인과 저장을 하나로 합친 ",
          { strong: "UPSERT(INSERT … ON CONFLICT DO UPDATE)" },
          "로 바꿔 실패율 0%가 됐고, 같은 요청을 반복해도 결과가 같은지 확인하는 테스트를 추가했습니다.",
        ],
      ],
      beforeAfter: {
        before: "저장본이 있는지 확인 → 없으면 저장 (두 요청이 동시에 저장 시도)",
        after: "INSERT … ON CONFLICT DO UPDATE 한 번으로 확인과 저장을 처리",
      },
    },
    {
      number: "03",
      title: "캐시가 비는 순간 같은 무거운 계산이 몰렸습니다",
      paragraphs: [
        ["할 일 추가로 캐시가 지워진 직후, ", { strong: "50개 요청이 동시에 같은 무거운 계산" }, "을 시작했습니다(cache stampede)."],
        [
          { strong: "Redis SET NX 락" },
          "으로 한 요청만 다시 계산하고, 나머지는 기다렸다가 캐시를 쓰게 했습니다.",
        ],
        [
          "락에는 유효기간(TTL)을 두고, 너무 오래 기다리면 직접 계산하도록 해 ",
          { strong: "가용성을 우선" },
          "했습니다.",
        ],
      ],
      beforeAfter: {
        before: "캐시 삭제 직후 50개 요청이 모두 같은 계산을 DB에서 실행",
        after: "SET NX 락으로 한 요청만 계산, 나머지는 대기 후 캐시 사용 (락 TTL · 대기 초과 시 직접 계산)",
      },
    },
  ],
  lesson: [
    "외부 AI API를 쓸 수 없게 됐을 때, ",
    { strong: "처음부터 AI 호출 부분을 분리해 둔 덕분에" },
    " 설정 3줄만 바꿔 로컬 모델로 전환할 수 있었습니다. 캐시 무효화도 버전 번호를 1 올리는 것만으로 관련 캐시 전체를 한 번에 처리하도록 단순하게 유지했습니다.",
  ],
};

export const caseStudies: CaseStudy[] = [capTeam, focusOn, aiTodo];
