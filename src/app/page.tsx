import { Suspense } from "react";

import { SiteHeader, type NavItem } from "@/components/layout/site-header";
import { AchievementsSection, AchievementsSectionSkeleton } from "@/components/sections/achievements-section";
import { ClosingSection } from "@/components/sections/closing-section";
import { HeroSection } from "@/components/sections/hero-section";
import { IntroSection } from "@/components/sections/intro-section";
import { ProjectSection } from "@/components/sections/project/project-section";
import { portfolioIndex, profile } from "@/content/profile";
import { projects } from "@/content/projects";

const navItems: NavItem[] = [
  { label: "Intro", anchor: "intro" },
  ...projects.map((project) => ({ label: project.name, anchor: project.slug })),
  { label: "Awards", anchor: "awards" },
  { label: "Contact", anchor: "contact" },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader name={profile.name} items={navItems} />
      <main>
        <HeroSection profile={profile} index={portfolioIndex} />
        <IntroSection profile={profile} />
        {projects.map((project) => (
          <ProjectSection key={project.slug} project={project} />
        ))}
        <Suspense fallback={<AchievementsSectionSkeleton />}>
          <AchievementsSection />
        </Suspense>
        <ClosingSection profile={profile} />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 text-xs text-subtle md:flex-row md:justify-between md:px-10">
          <span>
            © {profile.name} · {profile.school} {profile.department}
          </span>
          <a href="#top" className="hover:text-ink">
            맨 위로 ↑
          </a>
        </div>
      </footer>
    </>
  );
}
