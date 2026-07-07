import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    sourcemap: true,
    target: "es2020",
  },
  {
    // Standalone IIFE bundle for <script src> usage via unpkg/jsdelivr.
    entry: { "viber-button": "src/index.ts" },
    format: ["iife"],
    globalName: "ViberButtonElement",
    minify: true,
    sourcemap: false,
    target: "es2019",
    noExternal: [/@puralex\/viber-connect/],
  },
]);
