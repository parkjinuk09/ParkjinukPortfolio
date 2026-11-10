import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseStudyContent } from "@/components/case-study/case-study-content";
import { BackToTop } from "@/components/layout/back-to-top";
import { PAGE_GUTTER } from "@/components/layout/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { caseStudies } from "@/content/case-studies";
import { navItems } from "@/content/navigation";
import { profile } from "@/content/profile";

/**
 * 정해진 프로젝트만 빌드 시점에 만든다. (Cache Components에서는 dynamicParams 설정을 쓸 수 없으므로)
 * 목록에 없는 slug는 아래 페이지에서 notFound()로 404 처리한다.
 */
export function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

function findCaseStudy(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = findCaseStudy(slug);
  if (!caseStudy) {
    return {};
  }
  return { title: `${caseStudy.name} | ${profile.name} Portfolio`, description: caseStudy.summary };
}

/** 프로젝트 상세: 메인의 프로젝트 카드를 누르면 Figma 포트폴리오 형식으로 보여준다. */
export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const caseStudy = findCaseStudy(slug);
  if (!caseStudy) {
    notFound();
  }

  const currentIndex = caseStudies.indexOf(caseStudy);
  // 마지막 프로젝트에서는 첫 프로젝트로 돌아가 상세 페이지 사이를 계속 넘겨볼 수 있게 한다.
  const nextCaseStudy = caseStudies[(currentIndex + 1) % caseStudies.length];

  return (
    <>
      <SiteHeader
        title={`${profile.englishName}' Portfolio`}
        items={navItems}
        githubHref={profile.github.href}
        email={profile.email}
        linkPrefix="/"
      />
      <main>
        <div className={`${PAGE_GUTTER} pt-24`}>
          <Link href="/#projects" className="text-sm text-muted transition-colors hover:text-mint">
            ← 프로젝트 목록
          </Link>
        </div>
        <CaseStudyContent project={caseStudy} />
        {nextCaseStudy && nextCaseStudy.slug !== caseStudy.slug && (
          <nav aria-label="다음 프로젝트" className="border-t border-line">
            <Link href={`/projects/${nextCaseStudy.slug}`} className={`${PAGE_GUTTER} group flex items-end justify-between gap-6 py-16 md:py-24`}>
              <span>
                <span className="block text-sm text-subtle">Next Project</span>
                <span className="mt-2 block font-display text-4xl font-bold tracking-tight text-fg transition-colors group-hover:text-mint md:text-6xl">
                  {nextCaseStudy.name}
                </span>
              </span>
              <span aria-hidden className="text-3xl text-muted transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                →
              </span>
            </Link>
          </nav>
        )}
      </main>
      <SiteFooter profile={profile} />
      <BackToTop />
    </>
  );
}
