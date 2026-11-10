import { Suspense } from "react";

import { BackToTop } from "@/components/layout/back-to-top";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AboutSection } from "@/components/sections/about-section";
import { AchievementsSection, AchievementsSectionSkeleton } from "@/components/sections/achievements-section";
import { ClosingSection } from "@/components/sections/closing-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects/projects-section";
import { navItems } from "@/content/navigation";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

/** 섹션 순서는 Notion 포트폴리오와 같다: 소개 → 프로젝트 → Closing → 수상·활동, 마지막에 연락 폼 */
export default function HomePage() {
  return (
    <>
      <SiteHeader
        title={`${profile.englishName}' Portfolio`}
        items={navItems}
        githubHref={profile.github.href}
        email={profile.email}
      />
      <main>
        <HeroSection profile={profile} projects={projects} />
        <AboutSection profile={profile} />
        <ProjectsSection projects={projects} />
        <ClosingSection profile={profile} />
        <Suspense fallback={<AchievementsSectionSkeleton />}>
          <AchievementsSection />
        </Suspense>
        <ContactSection profile={profile} />
      </main>
      <SiteFooter profile={profile} />
      <BackToTop />
    </>
  );
}
