import type { TroubleshootingHighlight } from "./types";

/** Notion 각 프로젝트의 트러블슈팅 제목과 「문제」 문단 요약. 카드를 누르면 해당 프로젝트 상세의 트러블슈팅으로 이동한다. */
export const troubleshootingHighlights: TroubleshootingHighlight[] = [
  {
    title: "HTTPS 환경에서 HTTP API 요청 차단 해결",
    excerpt:
      "HTTPS로 배포된 프론트엔드에서 EC2의 HTTP API를 호출하자 브라우저에서 요청이 차단됐습니다. CORS가 아니라 Mixed Content 문제였습니다.",
    projectName: "CapTeam",
    href: "/projects/capteam#troubleshooting",
    imageSrc: "/images/trouble-mixed-content.webp",
  },
  {
    title: "GitHub Actions 배포 인증 실패와 배포 책임 분리",
    excerpt:
      "Actions에서 EC2로 배포하는 과정에서 ssh: handshake failed 오류가 발생했습니다. 연결은 됐지만 인증 단계에서 실패하고 있었습니다.",
    projectName: "CapTeam",
    href: "/projects/capteam#troubleshooting",
    imageSrc: "/images/trouble-deploy-ssh.webp",
  },
  {
    title: "분석 제외 도메인 반복 저장 시 500 오류",
    excerpt:
      "기존 목록을 다시 저장하면 두 번째 요청에서 500 오류가 발생했습니다. 삭제 SQL이 먼저 flush되지 않아 유일 제약과 충돌했습니다.",
    projectName: "FocusOn",
    href: "/projects/focuson#troubleshooting",
    imageSrc: "/images/trouble-flush.webp",
  },
];

/** 트러블슈팅 영역 설명 (Notion CapTeam 트러블슈팅 「배운 점」) */
export const troubleshootingLesson =
  "문제를 해결할 때는 단순히 명령을 재시도하기보다 네트워크 연결, 인증, 소스 전달, 실행 단계를 분리해 확인해야 한다는 점을 배웠습니다.";
