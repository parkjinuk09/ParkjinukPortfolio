import {
  siDocker,
  siGithubactions,
  siMysql,
  siNestjs,
  siNginx,
  siOpenjdk,
  siPostgresql,
  siReact,
  siRedis,
  siSpringboot,
  type SimpleIcon,
} from "simple-icons";

/** 기술 이름 → 로고. 로고가 없는 기술(AWS EC2 등)은 첫 글자 배지로 대신한다. */
const TECH_ICONS: Record<string, SimpleIcon> = {
  Java: siOpenjdk,
  "Spring Boot": siSpringboot,
  MySQL: siMysql,
  PostgreSQL: siPostgresql,
  Redis: siRedis,
  Docker: siDocker,
  React: siReact,
  NestJS: siNestjs,
  Nginx: siNginx,
  "GitHub Actions": siGithubactions,
};

function TechIcon({ name }: { name: string }) {
  const icon = TECH_ICONS[name];
  if (!icon) {
    return (
      <span aria-hidden className="grid h-5 w-5 place-items-center rounded bg-zinc-50/10 text-[10px] font-bold text-zinc-300">
        {name.charAt(0)}
      </span>
    );
  }
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d={icon.path} />
    </svg>
  );
}

/** 참고 사이트의 기술 칩: 아이콘 + 소문자 이름, 테두리만 있는 둥근 상자 */
export function TechChip({ name }: { name: string }) {
  return (
    <li className="flex items-center gap-2 rounded-lg border border-zinc-50/10 bg-zinc-50/[0.03] px-3 py-2 text-zinc-300 transition-colors duration-300 hover:border-zinc-50/30">
      <TechIcon name={name} />
      <span className="text-xs text-zinc-400">{name.toLowerCase()}</span>
    </li>
  );
}

export function TechChipList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <TechChip key={item} name={item} />
      ))}
    </ul>
  );
}
