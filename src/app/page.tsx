import { Suspense } from "react";

import { BackToTop } from "@/components/layout/back-to-top";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AboutSection } from "@/components/sections/about-section";
import { AchievementsSection, AchievementsSectionSkeleton } from "@/components/sections/achievements-section";
import { ContactSection } from "@/components/sections/contact/contact-section";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { ProjectGridSection } from "@/components/sections/projects/project-grid-section";
import { ProjectsSection } from "@/components/sections/projects/projects-section";
import { navItems } from "@/content/navigation";
import { profile } from "@/content/profile";
import { projects, projectsDescription } from "@/content/projects";
import { achievementsSeed } from "@/features/achievements/seed-data";

/** 참고 사이트와 같은 순서: 표지 → 소개 → 프로젝트 → 프로젝트 카드 목록 → (수상·활동) → 연락 */
export default function HomePage() {
  return (
    <>
      <SiteHeader
        title={`${profile.englishName}' Portfolio`}
        items={navItems}
        socials={profile.socials}
      />
      <main className="relative overflow-hidden bg-charcoal">
        <HeroSection profile={profile} projects={projects} />
        <AboutSection profile={profile} awardCount={achievementsSeed.awards.length} />
        <ProjectsSection projects={projects} description={projectsDescription} />
        <ProjectGridSection projects={projects} />
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
