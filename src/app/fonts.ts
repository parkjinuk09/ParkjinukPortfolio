import localFont from "next/font/local";

// 빌드 환경에서 Google Fonts 네트워크 접근에 의존하지 않도록 npm 패키지의 폰트 파일을 직접 번들한다.
export const sansFont = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

/** 영문 대제목 전용. 한글은 포함하지 않으므로 한글 제목에는 쓰지 않는다. */
export const displayFont = localFont({
  src: "../../node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2",
  variable: "--font-montserrat",
  weight: "100 900",
  display: "swap",
});

export const monoFont = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
});
