import type { TechItem } from "@/content/types";

export function TechList({ items }: { items: TechItem[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item.name}
          className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink transition-colors duration-300 hover:border-ink"
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}
