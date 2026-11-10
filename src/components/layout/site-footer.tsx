import type { Profile } from "@/content/types";

import { PAGE_GUTTER } from "./container";

export function SiteFooter({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-line">
      <div className={`${PAGE_GUTTER} flex flex-col gap-2 py-10 text-xs text-subtle md:flex-row md:justify-between`}>
        <span>
          © {profile.name} · {profile.role}
        </span>
        <span>{profile.contacts[0]?.value}</span>
      </div>
    </footer>
  );
}
