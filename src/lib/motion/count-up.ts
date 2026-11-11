/** 큰 수를 "900+"처럼 보여주기 위해 백 단위로 내린다. 실제 값보다 크게 보이지 않도록 반올림하지 않는다. */
export function roundDownToHundreds(value: number): number {
  return Math.floor(value / 100) * 100;
}

/** 처음엔 빠르게 오르고 끝에서 천천히 멈추는 곡선(참고 사이트의 숫자 애니메이션과 같은 느낌). */
export function easeOutExpo(progress: number): number {
  return progress >= 1 ? 1 : 1 - 2 ** (-10 * progress);
}

/** 진행률(0~1)에 맞는 중간 숫자. 범위를 벗어난 진행률은 양 끝으로 고정한다. */
export function countUpValue(from: number, to: number, progress: number): number {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  return Math.round(from + (to - from) * easeOutExpo(clampedProgress));
}
