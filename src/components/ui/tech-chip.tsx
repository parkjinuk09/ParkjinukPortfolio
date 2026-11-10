/**
 * 기술 이름 → 컬러 로고 파일(public/icons/tech, Devicon MIT 라이선스).
 * Spring Boot는 Devicon의 Spring 로고를, AWS EC2는 AWS 로고를 쓴다. 로고가 없는 기술은 첫 글자 배지로 대신한다.
 */
const TECH_ICON_FILES: Record<string, string> = {
  Java: "java",
  "Spring Boot": "spring",
  MySQL: "mysql",
  PostgreSQL: "postgresql",
  Redis: "redis",
  Docker: "docker",
  "AWS EC2": "aws",
  React: "react",
  NestJS: "nestjs",
  Nginx: "nginx",
  "GitHub Actions": "githubactions",
};

function TechIcon({ name }: { name: string }) {
  const file = TECH_ICON_FILES[name];
  if (!file) {
    return (
      <span aria-hidden className="grid h-5 w-5 place-items-center rounded bg-zinc-50/10 text-[10px] font-bold text-zinc-300">
        {name.charAt(0)}
      </span>
    );
  }
  // 평소에는 흑백으로 두고, 칩에 마우스를 올리면 로고 원래 색이 보이게 한다.
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 20px 정적 SVG라 next/image 최적화가 필요 없다.
    <img
      src={`/icons/tech/${file}.svg`}
      alt=""
      width={20}
      height={20}
      className="h-5 w-5 opacity-70 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0"
    />
  );
}

/** 참고 사이트의 기술 칩: 아이콘 + 소문자 이름, 테두리만 있는 둥근 상자 */
export function TechChip({ name }: { name: string }) {
  return (
    <li className="group flex items-center gap-2 rounded-lg border border-zinc-50/10 bg-zinc-50/[0.03] px-3 py-2 transition-colors duration-300 hover:border-zinc-50/30">
      <TechIcon name={name} />
      <span className="text-xs text-zinc-400 transition-colors group-hover:text-zinc-100">{name.toLowerCase()}</span>
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
