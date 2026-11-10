import type { ReactNode } from "react";

function Node({ title, caption, emphasized = false }: { title: string; caption?: string; emphasized?: boolean }) {
  return (
    <div className="text-center">
      <p className={`text-sm font-bold ${emphasized ? "text-mint" : "text-fg"}`}>{title}</p>
      {caption && <p className="mt-1 text-[11px] text-subtle">{caption}</p>}
    </div>
  );
}

function Link({ label }: { label: string }) {
  return (
    <div aria-hidden className="flex min-w-14 flex-1 flex-col items-center gap-1 px-1">
      <span className="font-mono text-[10px] whitespace-nowrap text-subtle">{label}</span>
      <span className="h-px w-full bg-subtle/60" />
    </div>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="relative flex flex-[3] items-center rounded-lg border border-dashed border-subtle/50 px-4 pt-8 pb-4">
      <span className="absolute top-2 left-4 text-[11px] font-semibold text-muted">{label}</span>
      {children}
    </div>
  );
}

/**
 * CapTeam 요청·배포 경로. Notion의 아키텍처 이미지 내용을 코드로 다시 그려 다크 테마에서도 선명하게 보이게 한다.
 * 좁은 화면에서는 가로로 스크롤된다.
 */
export function CapTeamDiagram() {
  return (
    <figure aria-label="CapTeam 시스템 구성도: 웹 클라이언트에서 HTTPS로 Nginx, Spring Boot, MySQL로 요청이 전달되고 GitHub Actions가 EC2에 배포한다" className="overflow-x-auto">
      <div className="min-w-[640px] space-y-10 py-2">
        <div className="flex items-center">
          <Node title="Web Client" caption="React · HTTPS" />
          <Link label="HTTPS / WSS" />
          <Group label="AWS EC2 · Docker">
            <Node title="Nginx" caption="HTTPS · Reverse Proxy" />
            <Link label="proxy_pass" />
            <Node title="Spring Boot" caption="REST · STOMP" emphasized />
          </Group>
          <Link label="JPA" />
          <Node title="MySQL" />
        </div>
        <div className="flex items-center justify-center">
          <Node title="GitHub Actions" caption="checkout · 키 검증" />
          <div className="w-40">
            <Link label="tar 패키징 · 전송" />
          </div>
          <Node title="EC2" caption="압축 해제 → docker build → 컨테이너 재생성" />
        </div>
      </div>
    </figure>
  );
}
