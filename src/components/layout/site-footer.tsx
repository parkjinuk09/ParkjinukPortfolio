import type { Profile } from "@/content/types";

import { PAGE_GUTTER } from "./container";

export function SiteFooter({ profile }: { profile: Profile }) {
  return (
    <footer className="bg-charcoal pt-20 pb-10 text-xs">
      <div className={`${PAGE_GUTTER} border-t border-zinc-50/5 pt-10`}>
        <p className="my-3 leading-6 opacity-75">
          {profile.name} · {profile.role}
          <br />
          {profile.contacts[0]?.value}
        </p>
        <p>Copyright ⓒ {profile.englishName}</p>
      </div>
    </footer>
  );
}
