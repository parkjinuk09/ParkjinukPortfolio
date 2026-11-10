import { Suspense } from "react";

import { BackToTop } from "@/components/layout/back-to-top";
import { SiteHeader, type NavItem } from "@/components/layout/site-header";
import { AboutSection } from "@/components/sections/about-section";
import { AchievementsSection, AchievementsSectionSkeleton } from "@/components/sections/achievements-section";
import { ClosingSection } from "@/components/sections/closing-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects/projects-section";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

const navItems: NavItem[] = [
  { label: "About", anchor: "about" },
  { label: "Projects", anchor: "projects" },
  { label: "Awards", anchor: "awards" },
  { label: "Contact", anchor: "contact" },
];

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
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 py-10 text-xs text-subtle md:flex-row md:justify-between md:px-8">
          <span>© {profile.name} · {profile.role}</span>
          <span>{profile.contacts[0]?.value}</span>
        </div>
      </footer>
      <BackToTop />
    </>
  );
}
