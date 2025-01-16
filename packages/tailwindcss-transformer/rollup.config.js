import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";

const isProd = process.env.NODE_ENV === "production";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: `dist/index.js`,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: `dist/index.mjs`,
        format: "esm",
        sourcemap: true,
      },
    ],
    external: ["react", "react-dom"],
    plugins: [
      resolve(),
      commonjs({
        dynamicRequireTargets: [
          // Specify the paths to the files that use dynamic require
          "D:\\next\\sse-school-management\\main\\3.0.0\\packages\\react\\package.json",
        ],
        // Alternatively, you can use ignoreDynamicRequires to ignore dynamic requires
        // ignoreDynamicRequires: true,
      }),
      typescript({
        tsconfig: "./tsconfig.json",
        useTsconfigDeclarationDir: true,
      }),
      json(),
      isProd && terser(), // Minify in production
    ],
  },
  {
    input: "src/index.ts", // Adjust this path based on your output directory for .d.ts files
    output: [
      {
        file: `dist/index.d.mts`,
        format: "es",
      },
      {
        file: `dist/index.d.ts`,
        format: "cjs",
      },
    ],
    plugins: [dts()],
  },
];
