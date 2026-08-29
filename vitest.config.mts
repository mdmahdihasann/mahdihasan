import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

/**
 * Vitest runs the components directly through the React plugin — Next's own
 * build is not involved, so `tsconfig-paths` is what resolves the `@/*` alias
 * that every component imports through.
 */
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    // No `globals`: each test imports what it uses, so `tsconfig.json` needs no
    // extra `types` entry and `next build` still typechecks the suite.
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    css: false,
    restoreMocks: true,
  },
});
