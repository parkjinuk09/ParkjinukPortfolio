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
  apiPolicy: [
    {
      domain: "사용자 설정",
      api: "프로필 · 동의 · 집중 설정 · 분석 제외 도메인",
      constraint: "도메인 정규화 → 중복 제거 → 개수 제한",
    },
    { domain: "학습 목표", api: "생성 · 조회 · 수정 · 삭제", constraint: "입력값 검증 + 소유권 검증, soft delete" },
    { domain: "학습 세션", api: "세션 시작 · 활성 세션 조회", constraint: "사용자별 활성 세션 제약 + 멱등성 키" },
    { domain: "스키마", api: "PostgreSQL 제약 · Flyway", constraint: "migration으로 스키마 이력 관리" },
  ],
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

export const caseStudies: CaseStudy[] = [capTeam, focusOn];
