import { defineConfig } from "tsup";

export default defineConfig(() => {
  return {
    entry: {
      appearence: "src/appearence/index.ts",
      provider: "src/provider/index.ts",
      adapter: "src/adapter.ts",
      config: "src/config.ts",
      cookie: "src/cookie.ts",
      error: "src/errors.ts",
      index: "src/index.ts",
      localization: "src/localization.ts",
      symbol: "src/symbol.ts",
      //   cookie: "src/cookie.ts",
    },
    entryPoints: ["src/**/*.ts", "src/*.ts"],
    minify: false,
    clean: true,
    sourcemap: true,
    format: ["cjs", "esm"],
    dts: true,
    legacyOutput: true,
  };
});
