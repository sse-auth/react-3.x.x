import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/actions/oauth/*"],
  format: ["esm", "cjs"],
  outDir: "dist",
  minify: false,
  sourcemap: false,
  clean: true,
  dts: true,
  splitting: true,
});
