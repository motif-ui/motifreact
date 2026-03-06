#!/usr/bin/env node

import process from "node:process";
import { existsSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { colorPrint } from "./utils.js";
import { convertTokens } from "./buildTheme.js";
import { isMainModule } from "./utils.js";

const runCLI = async () => {
  // --- Parse CLI args ---
  const [, , jsonPathArg, outputPathArg] = process.argv;

  if (!jsonPathArg || !outputPathArg) {
    console.log(" ❌ Missing required arguments. Usage: npm run build:tokens <path-to-tokens-json> <output-file-path>");
    process.exit(1);
  }

  // --- Resolve paths ---
  const jsonPath = resolve(jsonPathArg);
  const outputPath = resolve(outputPathArg);

  if (!existsSync(jsonPath)) {
    console.error(colorPrint.red(` ❌ Tokens file not found: ${jsonPath}`));
    process.exit(1);
  }

  console.log(`\nUsing tokens from  : ${jsonPath}`);
  console.log(`Output file        : ${outputPath}`);

  // --- Convert tokens ---
  const finalOutput = await convertTokens(jsonPath);

  // --- Ensure output directory exists ---
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, finalOutput, "utf8");

  console.log(colorPrint.green(`\n ✅ Tokens file saved: ${outputPath}`));
};

if (isMainModule(import.meta.url)) {
  runCLI().catch(err => {
    console.error(colorPrint.red(`\n ❌ Error: ${err.message}`));
    process.exit(1);
  });
}
