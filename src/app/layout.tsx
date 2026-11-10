import type { Metadata, Viewport } from "next";

import { profile } from "@/content/profile";

import { displayFont, monoFont, sansFont } from "./fonts";
import "./globals.css";

const title = `${profile.name} | Backend Developer Portfolio`;

export const metadata: Metadata = {
  title,
  description: profile.motto,
  openGraph: { title, description: profile.motto, type: "website", locale: "ko_KR" },
};

export const viewport: Viewport = {
  themeColor: "#181818",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${sansFont.variable} ${displayFont.variable} ${monoFont.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
