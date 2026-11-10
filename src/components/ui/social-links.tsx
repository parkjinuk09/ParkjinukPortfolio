import { siGithub } from "simple-icons";

interface SocialLinksProps {
  githubHref: string;
  email: string;
}

const buttonClassName =
  "group relative grid h-9 w-9 place-items-center rounded-lg border border-zinc-50/10 transition-colors duration-100 hover:border-zinc-50/40";

/** 참고 사이트의 아이콘 버튼: 얇은 테두리, 마우스를 올리면 뒤에서 인디고 빛이 번진다. */
export function SocialLinks({ githubHref, email }: SocialLinksProps) {
  return (
    <div className="flex gap-2">
      <a href={githubHref} target="_blank" rel="noreferrer" aria-label="GitHub" className={buttonClassName}>
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100" fill="currentColor">
          <path d={siGithub.path} />
        </svg>
        <span className="absolute -inset-1 -z-10 scale-0 rounded-full bg-indigo-400/20 blur-md transition-transform duration-300 group-hover:scale-100" />
      </a>
      <a href={`mailto:${email}`} aria-label="이메일 보내기" className={buttonClassName}>
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        <span className="absolute -inset-1 -z-10 scale-0 rounded-full bg-indigo-400/20 blur-md transition-transform duration-300 group-hover:scale-100" />
      </a>
    </div>
  );
}
