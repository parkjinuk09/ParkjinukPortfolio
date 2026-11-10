export function ChipList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-muted transition-colors duration-300 hover:border-subtle hover:text-fg"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
