import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src/**/*"],
  format: ["esm", "cjs"],
  outDir: "dist",
  minify: false,
  sourcemap: false,
  clean: true,
  dts: true,
  splitting: true,
});
