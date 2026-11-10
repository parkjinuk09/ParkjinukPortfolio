import { describe, expect, it } from "vitest";

import { readSupabaseConfig } from "./config";

describe("readSupabaseConfig", () => {
  it("URL과 anon 키가 모두 있으면 앞뒤 공백을 제거해 반환한다", () => {
    expect(readSupabaseConfig({ SUPABASE_URL: " https://x.supabase.co ", SUPABASE_ANON_KEY: "key\n" })).toEqual({
      url: "https://x.supabase.co",
      anonKey: "key",
    });
  });

  it("하나라도 비어 있으면 null을 반환한다", () => {
    expect(readSupabaseConfig({ SUPABASE_URL: "https://x.supabase.co" })).toBeNull();
    expect(readSupabaseConfig({ SUPABASE_URL: "", SUPABASE_ANON_KEY: "key" })).toBeNull();
    expect(readSupabaseConfig({})).toBeNull();
  });
});
