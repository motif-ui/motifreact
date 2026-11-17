#!/usr/bin/env node

import process from "node:process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { colorPrint, isMainModule } from "../utils.js";
import { buildTokens } from "./buildTokens.ts";
import { toCss, toDtcg, toFigma } from "./formats.ts";
import { validateFigma, validateTheme, validateTokens } from "./validate.ts";
import type { Theme } from "./types.ts";

export const OUTPUT_DIR = resolve("src/lib/styles/tokens/generated");
const THEMES_DIR = resolve("src/lib/styles/tokens/themes");

export const loadTheme = (name = "default") => JSON.parse(readFileSync(join(THEMES_DIR, `${name}.json`), "utf8")) as Theme;

type Generated = { files: Record<string, string>; errors: string[]; warnings: string[]; count: number };

const buildFiles = (theme: Theme) => {
  const { tokens, warnings } = buildTokens(theme);
  const figma = toFigma(tokens);
  return {
    files: {
      "motif.tokens.json": `${JSON.stringify(toDtcg(tokens), null, 2)}\n`,
      "motif.css": toCss(tokens),
      "motif.figma.json": `${JSON.stringify(figma, null, 2)}\n`,
    },
    errors: [...validateTokens(tokens), ...validateFigma(figma)],
    warnings,
    count: tokens.length,
  };
};

/** Everything the generator produces, keyed by file name, plus validation results. A broken seed file stops before generation. */
export const generate = (theme = loadTheme()) => {
  const themeErrors = validateTheme(theme);
  return themeErrors.length ? { files: {}, errors: themeErrors, warnings: [], count: 0 } : buildFiles(theme);
};

/** Files whose committed content differs from a fresh generation. */
export const staleFiles = (files: Record<string, string>, dir = OUTPUT_DIR) =>
  Object.entries(files)
    .filter(([name, content]) => !existsSync(join(dir, name)) || readFileSync(join(dir, name), "utf8") !== content)
    .map(([name]) => name);

const checkFiles = ({ files, count }: Generated) => {
  const stale = staleFiles(files);
  stale.forEach(name => console.error(colorPrint.red(` ❌ ${name} is out of date, run npm run build:mtf-tokens`)));
  stale.length && process.exit(1);
  console.log(colorPrint.green(` ✅ ${count} tokens valid, generated files up to date`));
};

const writeFiles = ({ files, count }: Generated) => {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  Object.entries(files).forEach(([name, content]) => writeFileSync(join(OUTPUT_DIR, name), content, "utf8"));
  console.log(colorPrint.green(` ✅ ${count} tokens valid, written to ${OUTPUT_DIR}`));
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
