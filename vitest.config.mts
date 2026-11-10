import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const alias = {
  "@": fileURLToPath(new URL("./src", import.meta.url)),
  // server-only는 React Server 환경 밖에서 import되면 예외를 던진다. 테스트에서는 빈 모듈로 대체한다.
  "server-only": fileURLToPath(new URL("./tests/stubs/server-only.ts", import.meta.url)),
};

export default defineConfig({
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: "unit",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        resolve: { alias },
        test: {
          name: "db",
          environment: "node",
          include: ["tests/db/**/*.test.ts"],
          // 같은 데이터베이스를 쓰므로 파일 단위 병렬 실행을 끈다.
          fileParallelism: false,
          testTimeout: 30_000,
        },
      },
    ],
  },
});
