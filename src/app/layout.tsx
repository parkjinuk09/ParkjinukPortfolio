import type { Metadata, Viewport } from "next";

import { profile } from "@/content/profile";

import { monoFont, sansFont, serifFont } from "./fonts";
import "./globals.css";

const description = profile.tagline;

export const metadata: Metadata = {
  title: `${profile.name} | Backend Developer Portfolio`,
  description,
  openGraph: {
    title: `${profile.name} | Backend Developer Portfolio`,
    description,
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f6f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${sansFont.variable} ${serifFont.variable} ${monoFont.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
