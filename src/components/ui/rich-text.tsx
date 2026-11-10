import type { RichText as RichTextValue } from "@/content/types";

/** 콘텐츠 데이터의 강조 조각만 굵게 렌더링한다. HTML 문자열을 쓰지 않아 XSS 여지가 없다. */
export function RichText({ value }: { value: RichTextValue }) {
  return (
    <>
      {value.map((part, index) =>
        typeof part === "string" ? (
          <span key={index}>{part}</span>
        ) : (
          <strong key={index} className="font-semibold text-ink">
            {part.strong}
          </strong>
        ),
      )}
    </>
  );
}
