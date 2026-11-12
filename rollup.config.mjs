import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import styles from "rollup-plugin-styler";
import dts from "rollup-plugin-dts";
import url from "postcss-url";
import del from "rollup-plugin-delete";
import alias from "@rollup/plugin-alias";
import removeJsxAttributes from "rollup-plugin-jsx-remove-attributes";
import path from "path";
import fs from "fs";
import process from "node:process";
import { fileURLToPath } from "url";
import json from "@rollup/plugin-json";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const wrapLayerPlugin = require("./src/scripts/postcssWrapLayer.cjs");

process.env.NODE_ENV = process.env.NODE_ENV || "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_CLASSNAME_PREFIX = "mtf-";

const generateScopedCssClassName = (localClassName, moduleFilePath) => {
  const moduleName = moduleFilePath.match(/[\\/]([^\\/]+)\.module\.scss$/)?.[1];

  return localClassName === "Root"
    ? `${DEFAULT_CLASSNAME_PREFIX}${moduleName}`
    : `${DEFAULT_CLASSNAME_PREFIX}${moduleName}--${localClassName}`;
};

// Ships each theme with the legacy design tokens (--mtf-*) appended, so the theme file users already import also brings
// the tokens, with the old colors (secondary stays gray). Once every component has migrated, the generator writes the
// theme files itself and this step goes away.
const themesWithTokens = () => ({
  name: "themes-with-tokens",
  generateBundle() {
    const tokens = fs.readFileSync(path.resolve(__dirname, "src/lib/styles/tokens/generated/themes/legacy.css"), "utf8");
    const themesDir = path.resolve(__dirname, "src/lib/styles/themes");
    fs.readdirSync(themesDir)
      .filter(file => file.endsWith(".css"))
      .forEach(file =>
        this.emitFile({
          type: "asset",
          fileName: `themes/${file}`,
          source: `${fs.readFileSync(path.join(themesDir, file), "utf8")}\n${tokens}`,
        }),
      );
  },
});

export default [
  {
    input: {
      index: "src/lib/index.ts",
      hooks: "src/lib/hooks/index.ts",
    },
    output: [
      {
        dir: "dist",
        format: "cjs",
        sourcemap: false,
        entryFileNames: "[name].cjs",
        chunkFileNames: "chunks/[name]-[hash].cjs",
      },
      {
        dir: "dist",
        format: "esm",
        sourcemap: false,
        entryFileNames: "[name].es.js",
        chunkFileNames: "chunks/[name]-[hash].js",
      },
    ],
    plugins: [
      peerDepsExternal(),
      removeJsxAttributes({
        attributes: ["data-testid"],
      }),
      alias({
        entries: [
          { find: "@/components", replacement: path.resolve(__dirname, "src/lib/components") },
          { find: "@/hooks", replacement: path.resolve(__dirname, "src/lib/hooks") },
          { find: "@/types", replacement: path.resolve(__dirname, "src/lib/types") },
        ],
      }),
      resolve({
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        skip: ["react", "react-dom"],
        preferBuiltins: true,
      }),
      typescript({
        compilerOptions: {
          outDir: "dist",
          declaration: true,
          declarationMap: true,
          declarationDir: "./dist/types",
          jsx: "react-jsx",
          rootDir: "src",
          incremental: false,
          noEmit: false,
          emitDeclarationOnly: true,
        },
        exclude: ["**/*.test.*", "**/*.spec.*", "**/testHelper.*", "**/*.stories.*", "**/*.story.*", ".storybook"],
      }),
      commonjs(),
      json(),
      styles({
        modules: {
          generateScopedName: generateScopedCssClassName,
        },
        sass: {
          includePaths: [path.resolve(__dirname, "src/lib/styles")],
          importer: [
            function (url) {
              // resolves @styles/... imports
              if (url.startsWith("@styles/") || url === "@styles") {
                const normalizedUrl = url.replace(/^@styles\/?/, "");
                const resolved = path.resolve(__dirname, "src/lib/styles", normalizedUrl);
                return { file: resolved };
              }
              return null;
            },
          ],
        },
        plugins: [
          url({
            url: "inline", // enable inline assets using base64 encoding
          }),
          wrapLayerPlugin,
        ],
      }),
      themesWithTokens(),
      terser({
        mangle: {
          keep_fnames: true,
        },
      }),
    ],
    external: ["react", "react-dom", "react/jsx-runtime"],
    onwarn: (warning, warn) => {
      if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes("use client")) {
        return;
      }
      warn(warning);
    },
  },
  {
    input: {
      index: "dist/types/lib/index.d.ts",
      hooks: "dist/types/lib/hooks/index.d.ts",
      types: "dist/types/lib/types/index.d.ts",
    },
    output: [
      {
        dir: "dist",
        format: "esm",
        entryFileNames: "[name].d.ts",
      },
    ],
    plugins: [
      dts(),
      del({
        hook: "buildEnd",
        targets: "./dist/types",
      }),
    ],
    external: [/\.css$/],
  },
];
