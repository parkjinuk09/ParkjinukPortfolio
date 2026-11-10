import type { TechItem } from "@/content/case-study-types";

export function TechList({ items }: { items: TechItem[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item.name}
          className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-fg transition-colors duration-300 hover:border-subtle"
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}
