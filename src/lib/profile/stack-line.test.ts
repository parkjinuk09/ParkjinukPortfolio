import { describe, expect, it } from "vitest";

import { profile } from "@/content/profile";

import { formatStackLine } from "./stack-line";

describe("formatStackLine", () => {
  it("기술 이름만 가운데 점으로 잇는다", () => {
    expect(
      formatStackLine([
        { name: "Java", level: "객체지향 설계와 예외 처리" },
        { name: "Redis", level: "캐시" },
      ]),
    ).toBe("Java ㆍ Redis");
  });

  it("실제 프로필 데이터로도 객체 문자열([object Object])이 나오지 않는다", () => {
    const line = formatStackLine(profile.primaryStack);
    expect(line).not.toContain("[object Object]");
    expect(line.split(" ㆍ ")).toEqual(profile.primaryStack.map((skill) => skill.name));
  });
});
