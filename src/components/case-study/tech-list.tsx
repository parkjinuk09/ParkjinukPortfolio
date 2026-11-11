import type { TechItem } from "@/content/case-study-types";

/**
 * 기술 이름을 가운데 점(·)으로 이어 한 줄로 나열한다. 상자 없이 글자만 둬서 마우스를 올리지 않아도 한 번에 읽힌다.
 * 구분점은 각 이름 왼쪽 여백에 두고, 목록 전체를 그 여백만큼 왼쪽으로 당긴 뒤 바깥을 잘라낸다.
 * 그래서 줄바꿈이 일어나도 줄 맨 앞의 구분점은 잘린 영역에 들어가 보이지 않는다.
 */
export function TechList({ items }: { items: TechItem[] }) {
  return (
    <div className="overflow-hidden">
      <ul className="-ml-6 flex flex-wrap gap-y-1 text-base leading-relaxed text-zinc-200">
        {items.map((item) => (
          <li
            key={item.name}
            className="relative pl-6 whitespace-nowrap before:absolute before:left-2.5 before:text-subtle before:content-['·']"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
