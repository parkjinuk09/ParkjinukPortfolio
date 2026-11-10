import type { NavItem } from "@/components/layout/site-header";

/** 메인 페이지 섹션 순서와 같은 상단 메뉴. 메인과 프로젝트 상세 페이지가 함께 쓴다. */
export const navItems: NavItem[] = [
  { label: "About", anchor: "about" },
  { label: "Work", anchor: "projects" },
  { label: "Main Projects", anchor: "main-projects" },
  { label: "Awards", anchor: "awards" },
  { label: "Contact", anchor: "contact" },
];
