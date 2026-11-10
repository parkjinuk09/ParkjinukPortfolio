import localFont from "next/font/local";

// 빌드 환경에서 Google Fonts 네트워크 접근에 의존하지 않도록 npm 패키지의 폰트 파일을 직접 번들한다.
export const sansFont = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const serifFont = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2",
      style: "normal",
    },
  ],
  variable: "--font-source-serif",
  weight: "200 900",
  display: "swap",
});

export const monoFont = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
});
