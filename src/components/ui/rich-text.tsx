import type { RichText as RichTextValue } from "@/content/types";

/** 콘텐츠 데이터의 강조·코드 조각을 렌더링한다. HTML 문자열을 쓰지 않아 XSS 여지가 없다. */
export function RichText({ value }: { value: RichTextValue }) {
  return (
    <>
      {value.map((part, index) => {
        if (typeof part === "string") {
          return <span key={index}>{part}</span>;
        }
        if ("strong" in part) {
          return (
            <strong key={index} className="font-semibold text-fg">
              {part.strong}
            </strong>
          );
        }
        return (
          <code key={index} className="rounded bg-raised px-1.5 py-0.5 font-mono text-[0.85em] text-mint">
            {part.code}
          </code>
        );
      })}
    </>
  );
}
