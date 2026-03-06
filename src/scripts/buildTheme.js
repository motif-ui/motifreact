#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import StyleDictionary from "style-dictionary";
import config from "../../style-dictionary.config.js";
import { colorPrint } from "./utils.js";
import { isMainModule } from "./utils.js";

// --- Function to run when executed directly ---
const runCLI = () => {
  // --- Parse CLI args ---
  // eslint-disable-next-line no-undef
  const [, , jsonPathArg, themeName, outputDirArg] = process.argv;

  if (!jsonPathArg || !themeName || !outputDirArg) {
    console.log(" ❌ Missing required arguments. Usage: npm run build:theme <path-to-tokens-json> <theme-name> <output-folder-path>");
    // eslint-disable-next-line no-undef
    process.exit(1);
  }

  // --- Resolve paths ---
  const jsonPath = resolve(jsonPathArg);
  const outputDir = resolve(outputDirArg);
  const outputPath = join(outputDir, `${themeName}.css`);

  if (!existsSync(jsonPath)) {
    console.error(colorPrint.red(` ❌ Tokens file not found: ${jsonPath}`));
    // eslint-disable-next-line no-undef
    process.exit(1);
  }

  console.log(`\nUsing tokens from  : ${jsonPath}`);
  console.log(`Output folder      : ${outputDir}`);
  console.log(colorPrint.cyan(`Theme name         : ${themeName}`));

  return { jsonPath, outputDir, outputPath, themeName };
};

const createTheme = (cssContent, themeName, outputDir, outputPath) => {
  const header = `/**
*
* This is a theme file created for Motif UI
* Theme name: ${themeName}
*
**/

`;

  const bodyStyles = `
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  font-family: var(--theme-typography-font-family), serif;
  -webkit-font-smoothing: antialiased;
}

:where(button, input, select, textarea) {
    font-family: inherit;
}
`;

  const finalOutput = header + cssContent + bodyStyles;
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, finalOutput, "utf8");

  console.log(colorPrint.green(`\n ✅ Theme file saved: ${outputPath}`));
};

export const convertTokens = async tokenPath => {
  // --- Load tokens manually, instead of using 'source' in the config file ---
  const tokens = JSON.parse(readFileSync(tokenPath, "utf8"));

  // -- Load config directly --
  const base = new StyleDictionary(config);

  // -- Put the read tokens from the file into SD process --
  const sd = await base.extend({ tokens });

  // -- Generate CSS values in memory --
  const results = await sd.formatPlatform("css");
  return results[0]?.output ?? "";
};

if (isMainModule(import.meta.url)) {
  (async () => {
    const { jsonPath, outputDir, outputPath, themeName } = runCLI();
    const cssOutput = await convertTokens(jsonPath);
    createTheme(cssOutput, themeName, outputDir, outputPath);
  })().catch(err => {
    console.error(colorPrint.red(`\n ❌ Error: ${err.message}`));
    // eslint-disable-next-line no-undef
    process.exit(1);
  });
}
