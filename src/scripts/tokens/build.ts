#!/usr/bin/env node

import process from "node:process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { colorPrint, isMainModule } from "../utils.js";
import { buildTokens } from "./buildTokens.ts";
import { toCss, toDtcg, toFigma } from "./formats.ts";
import { validateFigma, validateTheme, validateTokens } from "./validate.ts";
import type { Theme } from "./types.ts";

export const OUTPUT_DIR = resolve("src/lib/styles/tokens/generated");
const THEMES_DIR = resolve("src/lib/styles/tokens/themes");

// Every theme gets its own CSS (themes/<name>.css). legacy keeps the old colors for existing users (secondary is the old
// gray); basic is the standard theme. Figma and the JSON exports follow FIGMA_THEME.
export const THEMES = ["basic", "legacy"] as const;
export const FIGMA_THEME = "basic";

export const loadTheme = (name: string = FIGMA_THEME) => JSON.parse(readFileSync(join(THEMES_DIR, `${name}.json`), "utf8")) as Theme;

type Generated = { files: Record<string, string>; errors: string[]; warnings: string[]; count: number };

const buildFiles = (name: string, theme: Theme): Generated => {
  const { tokens, warnings } = buildTokens(theme);
  const figma = toFigma(tokens);
  const exports =
    name === FIGMA_THEME
      ? {
          [`${name}.tokens.json`]: `${JSON.stringify(toDtcg(tokens), null, 2)}\n`,
          [`${name}.figma.json`]: `${JSON.stringify(figma, null, 2)}\n`,
        }
      : {};
  return {
    files: { [`themes/${name}.css`]: toCss(tokens), ...exports },
    errors: [...validateTokens(tokens), ...(name === FIGMA_THEME ? validateFigma(figma) : [])].map(error => `${name}: ${error}`),
    warnings: warnings.map(warning => `${name}: ${warning}`),
    count: tokens.length,
  };
};

const generateTheme = (name: string, theme: Theme): Generated => {
  const themeErrors = validateTheme(theme);
  return themeErrors.length
    ? { files: {}, errors: themeErrors.map(error => `${name}: ${error}`), warnings: [], count: 0 }
    : buildFiles(name, theme);
};

/** Everything the generator produces for every theme, keyed by file name, plus validation results. A broken seed file stops before generation. */
export const generate = (themes: Record<string, Theme> = Object.fromEntries(THEMES.map(name => [name, loadTheme(name)]))) =>
  Object.entries(themes)
    .map(([name, theme]) => generateTheme(name, theme))
    .reduce<Generated>(
      (all, one) => ({
        files: { ...all.files, ...one.files },
        errors: [...all.errors, ...one.errors],
        warnings: [...all.warnings, ...one.warnings],
        count: Math.max(all.count, one.count),
      }),
      { files: {}, errors: [], warnings: [], count: 0 },
    );

/** Files whose committed content differs from a fresh generation. */
export const staleFiles = (files: Record<string, string>, dir = OUTPUT_DIR) =>
  Object.entries(files)
    .filter(([name, content]) => !existsSync(join(dir, name)) || readFileSync(join(dir, name), "utf8") !== content)
    .map(([name]) => name);

const checkFiles = ({ files, count }: Generated) => {
  const stale = staleFiles(files);
  stale.forEach(name => console.error(colorPrint.red(` ❌ ${name} is out of date, run npm run build:mtf-tokens`)));
  stale.length && process.exit(1);
  console.log(colorPrint.green(` ✅ ${count} tokens per theme (${THEMES.join(", ")}) valid, generated files up to date`));
};

const writeFiles = ({ files, count }: Generated) => {
  Object.entries(files).forEach(([name, content]) => {
    mkdirSync(dirname(join(OUTPUT_DIR, name)), { recursive: true });
    writeFileSync(join(OUTPUT_DIR, name), content, "utf8");
  });
  console.log(colorPrint.green(` ✅ ${count} tokens per theme (${THEMES.join(", ")}) valid, written to ${OUTPUT_DIR}`));
};

const runCLI = () => {
  const generated = generate();
  const { errors, warnings } = generated;

  warnings.forEach(warning => console.log(colorPrint.yellow(` ⚠️  ${warning}`)));
  errors.forEach(error => console.error(colorPrint.red(` ❌ ${error}`)));
  errors.length && process.exit(1);

  process.argv.includes("--check") ? checkFiles(generated) : writeFiles(generated);
};

isMainModule(import.meta.url) && runCLI();
