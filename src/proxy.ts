import { NextResponse, type NextRequest } from "next/server";

import { caseStudies } from "@/content/case-studies";

/** 목록에 있는 프로젝트 상세 경로. 빌드 시점에 정해지는 정적 목록이다. */
const KNOWN_PROJECT_SLUGS = new Set(caseStudies.map((caseStudy) => caseStudy.slug));

/** 일치하는 라우트가 없는 경로. 여기로 rewrite하면 Next.js가 not-found 화면을 404 상태 코드로 응답한다. */
const NOT_FOUND_PATH = "/__not-found";

/**
 * 없는 프로젝트 주소를 페이지 렌더링 전에 404로 돌린다.
 * Cache Components에서는 목록에 없는 경로가 정적 셸을 먼저 스트리밍(200)한 뒤 notFound()를 처리하므로,
 * 첫 요청의 상태 코드가 200이 되는 문제가 있어 라우트 앞단에서 판단한다.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && KNOWN_PROJECT_SLUGS.has(slug)) {
    return NextResponse.next();
  }
  return NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url));
}

export const config = {
  matcher: "/projects/:slug",
};
