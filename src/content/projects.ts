import type { Project } from "./types";

/**
 * Notion 「Main Projects」 기준.
 * Notion의 "서비스 화면 및 구현 증빙"(스크린샷 자리)과 FocusOn의 "예상 문제와 검증 계획 — SAMPLE" 표는
 * 실제 결과물이 아니라 작성 예정 항목이어서 사이트에는 싣지 않는다.
 */
const capTeam: Project = {
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
  summary: {
    lead: "학교 캡스톤은 학생과 교사가 같은 정보를 보더라도 수행하는 작업과 권한이 다릅니다. 팀 관리, 공지, 활동 일지, 메시지가 흩어져 있으면 운영 현황을 파악하기 어렵습니다. CapTeam은 이러한 기능을 하나의 도메인으로 묶은 서비스입니다.",
    items: [
      "학생·교사 계정의 로그인과 역할 기반 API 접근 제어",
      "공지사항 작성·수정·삭제와 사용자별 조회",
      "팀 채널의 실시간 메시지 전송 및 메시지 이력 조회",
      "캡스톤 활동 일지 작성·수정·삭제",
      "학기·팀·팀원 관계를 고려한 데이터 모델 설계",
      "범위 구분: AI 기반 팀 추천과 팀 관리 일부는 후속 기능으로, 완료한 구현처럼 표기하지 않습니다.",
    ],
  },
  architecture: {
    title: "시스템 플로우 및 인프라 아키텍처",
    showDiagram: true,
    note: [
      { strong: "모델링 핵심: " },
      { code: "User" }, ", ", { code: "Team" }, ", ", { code: "UserTeam" }, ", ", { code: "Semester" }, ", ",
      { code: "Notice" }, ", ", { code: "ChatChannel" }, ", ", { code: "ChatMessage" }, ", ", { code: "Journal" },
      " 등으로 데이터 책임을 나누었습니다. 학생·교사 계정은 공통 User로 관리하되 권한을 구분하고, 사용자-팀 관계는 역할 정보가 담기는 연결 엔티티로 설계했습니다.",
    ],
  },
  coreImplementation: [
    {
      label: "인증·인가",
      text: ["Access Token/Refresh Token을 구분하고 Spring Security를 통해 인증된 사용자 정보와 API 접근 정책을 처리했습니다."],
    },
    {
      label: "사용자 계정 정책",
      text: ["일반 공개 회원가입 대신 사전 등록된 학교 계정으로 접근하게 하고, 최초 비밀번호의 해시 저장 흐름을 고려했습니다."],
    },
    { label: "공지·일지 API", text: ["HTTP 메서드와 DTO, 서비스 계층, JPA 리포지토리로 CRUD 책임을 분리했습니다."] },
    {
      label: "실시간 채팅",
      text: ["STOMP 채널을 구독하여 팀 메시지를 전달하고, 서버에서 이력을 유지할 수 있도록 메시지 엔티티를 분리했습니다."],
    },
    { label: "인프라", text: ["EC2, Nginx, Docker 및 서비스 도메인 연결을 다루며 로컬과 배포 환경의 차이를 경험했습니다."] },
    {
      label: "협업",
      text: ["적극적으로 요구사항과 진행 상황을 공유하고, 기술 선택 시 일정과 팀 숙련도를 함께 고려했습니다."],
    },
  ],
  designDecision: {
    title: [{ code: "UserTeam" }, " 연결 엔티티로 팀 소속을 표현"],
    background: [
      { code: "User" }, "와 ", { code: "Team" },
      "은 다대다처럼 보이지만, 실제 요구사항은 \"누가 어느 팀에 속하는가\"만으로 끝나지 않았습니다. 팀장과 팀원을 구분해야 하고 팀 소속을 기준으로 권한도 검증해야 했습니다.",
    ],
    choice: ["단순 ", { code: "@ManyToMany" }, " 대신 ", { code: "UserTeam" }, "을 별도 엔티티로 모델링하고 역할을 저장하도록 구성했습니다."],
    code: "User (1) ── (N) UserTeam (N) ── (1) Team\n└── teamRole: LEADER / MEMBER",
    reasons: [
      "관계에 역할·가입 시점 등을 추가할 수 있습니다.",
      "팀장 권한을 사용자 전역 권한과 구별할 수 있습니다.",
      "팀 탈퇴·학기 종료 등 관계의 생명주기를 관리하기 쉽습니다.",
    ],
    followUp: "한 팀에 팀장이 한 명만 존재해야 한다는 규칙은 서비스 로직뿐 아니라 동시 요청에서의 정합성까지 고려해 검증해야 합니다.",
  },
  troubleshooting: [
    {
      title: "HTTPS 환경에서 HTTP API 요청 차단 해결",
      problem: [
        [
          "HTTPS로 배포된 프론트엔드에서 EC2의 HTTP API를 호출하자 브라우저에서 요청이 차단됐습니다. 처음에는 CORS 설정 문제로 판단했지만, Spring Boot 로그에는 해당 요청이 기록되지 않았고 브라우저 콘솔에서 ",
          { code: "Mixed Content" },
          " 오류가 확인됐습니다.",
        ],
      ],
      cause: [
        ["HTTPS 페이지에서 보안 수준이 낮은 HTTP API를 호출해 브라우저의 Mixed Content 정책에 의해 요청이 차단된 것이 원인이었습니다."],
        [
          "Mixed Content는 요청이 서버에 도달하기 전에 브라우저에서 차단되는 문제이고, CORS는 서로 다른 출처의 요청을 서버가 허용할지 결정하는 정책입니다. 따라서 백엔드의 CORS 설정만 변경해서는 문제를 해결할 수 없었습니다.",
        ],
      ],
      solution: [
        ["브라우저 콘솔과 Network 탭에서 요청이 백엔드에 도달하기 전에 차단되는 것을 확인했습니다."],
        ["Nginx에 HTTPS를 적용하고 외부 API 요청을 Spring Boot 서버로 전달하도록 리버스 프록시를 설정했습니다."],
        ["프론트엔드의 API 주소를 HTTP 기반 EC2 주소에서 HTTPS가 적용된 도메인 주소로 변경했습니다."],
        ["실제 프론트엔드 주소를 기준으로 Spring Security의 CORS 허용 출처를 설정했습니다."],
        ["변경 후 일반 API와 인증이 필요한 API 요청이 정상적으로 전달되는지 확인했습니다."],
      ],
      result: [
        [
          "Mixed Content와 CORS를 분리해 진단하면서 문제 발생 지점을 정확히 확인했습니다. 이후 모든 외부 요청은 HTTPS로 받고, Nginx가 내부 Spring Boot 서버로 전달하도록 구성해 API 호출 문제를 해결했습니다.",
        ],
      ],
    },
    {
      title: "GitHub Actions 배포 인증 실패와 배포 책임 분리",
      problem: [
        ["GitHub Actions에서 EC2로 자동 배포하는 과정에서 다음 SSH 인증 오류가 발생했습니다."],
        [
          "처음에는 EC2의 SSH 포트나 보안 그룹 문제로 의심했지만, Actions Runner에서 EC2까지의 연결은 이루어졌으며 인증 단계에서 실패하고 있었습니다.",
        ],
      ],
      problemCode: "ssh: handshake failed\nunable to authenticate, attempted methods [none]",
      cause: [
        ["GitHub Actions에 등록된 SSH 개인 키가 인증 수단으로 정상 로드되지 않아 발생한 문제였습니다."],
        [
          "또한 EC2에서 직접 저장소를 ",
          { code: "git clone" },
          " 또는 ",
          { code: "git pull" },
          "하는 구조는 EC2에도 별도의 GitHub 인증 정보를 설정해야 했습니다. 이로 인해 배포 과정이 SSH 인증과 GitHub 저장소 인증에 동시에 의존하고 있었습니다.",
        ],
      ],
      solution: [
        ["GitHub Actions Runner에서 SSH 키를 파일로 생성하고 권한을 ", { code: "600" }, "으로 제한했습니다."],
        [{ code: "ssh-keygen -y -f" }, " 명령으로 개인 키 형식을 먼저 검증해 잘못된 Secret을 배포 전에 발견하도록 구성했습니다."],
        ["Actions에서 확정된 소스 코드를 ", { code: "tar" }, "로 패키징해 EC2로 전송했습니다."],
        ["EC2는 전달받은 소스를 압축 해제한 뒤 Docker 이미지를 빌드하고 컨테이너를 재생성하도록 역할을 제한했습니다."],
        [
          "EC2에서 비공개 GitHub 저장소를 직접 ",
          { code: "git pull" },
          "하는 과정을 제거해, EC2에 GitHub Deploy Key나 Access Token을 보관하지 않도록 개선했습니다.",
        ],
      ],
      solutionCode:
        "GitHub push\n    ↓\nGitHub Actions\n소스 체크아웃 → SSH 키 검증 → 소스 패키징·전송\n    ↓\nEC2\n소스 압축 해제 → Docker 빌드 → 컨테이너 실행",
      result: [
        ["SSH 연결 실패와 키 형식 오류를 배포 초기에 구분할 수 있게 됐습니다."],
        ["EC2에 GitHub 인증 정보를 저장하지 않아도 배포할 수 있게 됐습니다."],
        ["CI와 배포 서버의 책임이 명확해져 실패 지점을 추적하기 쉬워졌습니다."],
        ["불필요한 원격 저장소 인증 단계를 제거해 배포 절차를 단순화했습니다."],
      ],
      resultAsList: true,
      lesson: [
        [
          "CI/CD 문제를 해결할 때는 단순히 명령을 재시도하기보다 ",
          { strong: "네트워크 연결, SSH 인증, 소스 전달, 컨테이너 실행 단계를 분리해 확인해야 한다는 점" },
          "을 배웠습니다.",
        ],
        [
          "또한 배포 서버가 소스 저장소와 빌드 절차를 모두 책임지게 하기보다, GitHub Actions가 배포 대상을 확정하고 EC2는 실행 환경에 집중하도록 책임을 나누는 것이 보안과 유지보수 측면에서 유리했습니다.",
        ],
      ],
    },
  ],
  lessons: [
    ["데이터 모델은 테이블을 나누는 작업을 넘어 권한과 상태 전이를 표현하는 일입니다."],
    ["JWT 검증만으로 리소스 접근 권한이 보장되지 않으며 소속 검증이 중요합니다."],
    ["배포 문제를 해결할 때는 브라우저, 프록시, 애플리케이션, 데이터베이스의 책임을 구분해야 합니다."],
    ["팀장 역할에서는 기능 구현 능력과 함께 의사결정 근거를 공유하는 능력이 중요했습니다."],
  ],
};

const focusOn: Project = {
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
  summary: {
    lead: "FocusOn은 사용자가 설정한 학습 목표와 활동 맥락을 연결해 집중 흐름을 살펴보는 프로젝트입니다. 백엔드 개발에서 사용자 설정, 학습 목표와 세션 API를 맡아 데이터 검증과 동시 요청의 정합성을 다뤘습니다.",
    items: [
      "학습 목표 저장·조회·수정·삭제와 세션 시작·활성 세션 조회",
      "사용자 프로필·동의·집중 설정·분석 제외 도메인 관리",
      "Desktop과 Extension을 연결하는 서비스 구조를 바탕으로 개발",
      "활동 분석과 AI 연동은 후속 개발 범위",
    ],
  },
  architecture: {
    title: "계획 아키텍처 — 설계안",
  },
  coreImplementation: [
    {
      label: "접근 검증",
      text: ["기존 인증 구조를 활용해 사용자 설정과 목표·세션 요청에서 인증된 사용자와 자원 소유 관계를 확인했습니다."],
    },
    {
      label: "사용자 설정",
      text: ["프로필·동의·집중 설정·분석 제외 도메인 API를 구현하고, 도메인 정규화와 중복 제거 및 개수 제한을 적용했습니다."],
    },
    {
      label: "학습 목표",
      text: [
        "목표 생성·조회·수정·삭제 API에 입력값과 소유권 검증을 적용했습니다. 삭제는 soft delete로 처리해 종료된 세션의 목표 스냅샷을 유지합니다.",
      ],
    },
    { label: "학습 세션", text: ["세션 시작·활성 조회 API에 사용자별 활성 세션 제약과 멱등성 키를 적용했습니다."] },
    { label: "데이터베이스", text: ["PostgreSQL 제약과 Flyway migration으로 스키마 이력을 관리했습니다."] },
    {
      label: "검증",
      text: ["Swagger 수동 확인, 자동 테스트, 격리 PostgreSQL의 migration과 동시 요청 검증 결과를 기능별 문서에 기록했습니다."],
    },
  ],
  designDecision: {
    title: ["목표 변경과 세션 시작의 정합성"],
    background: ["목표 수정·삭제와 학습 세션 시작이 동시에 요청되면 세션에 저장되는 목표 문구의 일관성이 중요합니다."],
    choice: [
      "세션 시작과 목표 수정·삭제가 같은 순서로 사용자 행 잠금을 획득하고, 활성 세션이 참조하는 목표의 변경을 차단했습니다. 종료된 세션은 당시 목표 문구 스냅샷을 유지합니다.",
    ],
    verification: ["격리 PostgreSQL에서 동시 출발과 잠금 대기를 유도한 테스트로 허용 응답과 스냅샷 정합성을 확인했습니다."],
  },
  troubleshooting: [
    {
      title: "분석 제외 도메인 반복 저장 시 500 오류",
      problem: [["사용자가 기존 분석 제외 도메인 목록을 다시 저장하면 두 번째 요청에서 500 오류가 발생했습니다."]],
      cause: [
        [
          "기존 목록을 삭제한 뒤 같은 도메인을 다시 저장하는 과정에서 삭제 SQL이 먼저 flush되지 않아 PostgreSQL의 사용자·도메인 유일 제약과 충돌했습니다.",
        ],
      ],
      solution: [
        ["사용자 행을 잠가 같은 사용자의 목록 교체를 순서대로 처리했습니다."],
        ["기존 목록의 삭제를 flush한 뒤 새 목록을 저장하도록 수정했습니다."],
        ["H2와 격리 PostgreSQL 환경에서 동일한 50개 도메인을 두 번 교체하는 회귀 테스트를 확인했습니다."],
      ],
      lesson: [
        [
          "JPA에서 메서드 호출 순서와 실제 SQL 실행 시점은 다를 수 있으므로, 데이터베이스 제약과 flush 시점을 함께 확인해야 한다는 점을 배웠습니다.",
        ],
      ],
    },
  ],
  lessons: [
    [
      "인증된 사용자라도 요청 대상이 본인의 기기와 목표인지 별도로 확인해야 합니다. 또한 동시 요청에 대한 정합성은 서비스 검증뿐 아니라 데이터베이스 제약과 잠금, 실제 PostgreSQL 검증까지 함께 살펴야 한다는 점을 배웠습니다.",
    ],
  ],
};

export const projects: Project[] = [capTeam, focusOn];
