import type { StackSkill } from "@/content/types";

/** 첫 화면 한 줄 기술 목록: 기술 이름만 가운데 점으로 잇는다(사용 수준 설명은 Stack 말풍선에서만 보여준다). */
export function formatStackLine(skills: StackSkill[]): string {
  return skills.map((skill) => skill.name).join(" ㆍ ");
}
