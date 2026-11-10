import { Suspense } from "react";

import { BackToTop } from "@/components/layout/back-to-top";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AboutSection } from "@/components/sections/about-section";
import { AchievementsSection, AchievementsSectionSkeleton } from "@/components/sections/achievements-section";
import { ContactSection } from "@/components/sections/contact/contact-section";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { ProjectsSection } from "@/components/sections/projects/projects-section";
import { TroubleshootingSection } from "@/components/sections/troubleshooting-section";
import { navItems } from "@/content/navigation";
import { profile } from "@/content/profile";
import { projects, projectsDescription } from "@/content/projects";
import { troubleshootingHighlights, troubleshootingLesson } from "@/content/troubleshooting";
import { achievementsSeed } from "@/features/achievements/seed-data";

/** 참고 사이트와 같은 순서: 표지 → 소개 → 프로젝트 → 글(트러블슈팅) 카드 → (수상·활동) → 연락 */
export default function HomePage() {
  return (
    <>
      <SiteHeader
        title={`${profile.englishName}' Portfolio`}
        items={navItems}
        githubHref={profile.github.href}
        email={profile.email}
      />
      <main className="relative overflow-hidden bg-charcoal">
        <HeroSection profile={profile} projects={projects} />
        <AboutSection profile={profile} awardCount={achievementsSeed.awards.length} />
        <ProjectsSection projects={projects} description={projectsDescription} />
        <TroubleshootingSection items={troubleshootingHighlights} lesson={troubleshootingLesson} />
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
