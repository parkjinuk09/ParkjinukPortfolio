import { describe, expect, it } from "vitest";

import { countUpValue, easeOutExpo, roundDownToHundreds } from "./count-up";

describe("roundDownToHundreds", () => {
  it("실제 값보다 커지지 않도록 백 단위로 내린다", () => {
    expect(roundDownToHundreds(902)).toBe(900);
    expect(roundDownToHundreds(999)).toBe(900);
    expect(roundDownToHundreds(1000)).toBe(1000);
    expect(roundDownToHundreds(42)).toBe(0);
  });
});

describe("countUpValue", () => {
  it("시작과 끝에서 정확한 값을 낸다", () => {
    expect(countUpValue(0, 900, 0)).toBe(0);
    expect(countUpValue(0, 900, 1)).toBe(900);
    expect(countUpValue(2000, 2023, 1)).toBe(2023);
  });

  it("범위를 벗어난 진행률은 양 끝으로 고정한다", () => {
    expect(countUpValue(0, 900, -0.5)).toBe(0);
    expect(countUpValue(0, 900, 1.5)).toBe(900);
  });

  it("진행률이 늘면 값이 줄지 않는다", () => {
    const values = Array.from({ length: 21 }, (_, step) => countUpValue(0, 900, step / 20));
    values.slice(1).forEach((value, index) => expect(value).toBeGreaterThanOrEqual(values[index]!));
  });

  it("앞쪽에서 빠르게 오른다(절반 시점에 이미 90% 이상)", () => {
    expect(easeOutExpo(0.5)).toBeGreaterThan(0.9);
  });
});
