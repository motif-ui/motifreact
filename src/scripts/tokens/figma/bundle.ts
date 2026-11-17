#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { FIGMA_THEME, OUTPUT_DIR } from "../build.ts";
import type { FigmaCollection, FigmaPayload, FigmaValue } from "../types.ts";

// Ready-to-run Figma scripts, one per part: each collection needs the ones before it (aliases), styles need all of them
const BUNDLE_DIR = resolve("node_modules/.cache/mtf-figma-tokens");

const payload = JSON.parse(readFileSync(join(OUTPUT_DIR, `${FIGMA_THEME}.figma.json`), "utf8")) as FigmaPayload;
const importer = readFileSync(new URL("./importTokens.figma.js", import.meta.url), "utf8");

// The compact form importTokens.figma.js expands: scopes listed once, one array per variable, aliases as "@name"
const compactValue = (value: FigmaValue) => (typeof value === "object" ? `@${value.alias}` : value);
const compact = ({ name, modes, variables }: FigmaCollection) => {
  const scopes = [...new Set(variables.map(({ scopes }) => scopes.join(",")))];
  return {
    name,
    modes,
    scopes,
    variables: variables.map(({ name: variableName, type, scopes: variableScopes, hiddenFromPublishing, values, description }) => [
      variableName,
      type[0],
      scopes.indexOf(variableScopes.join(",")),
      hiddenFromPublishing ? 1 : 0,
      modes.map(mode => compactValue(values[mode])),
      ...(description ? [description] : []),
    ]),
  };
};

const [palette, semantic, dimension] = payload.collections.map(compact);
// Two parts keep each script under the 50 KB use_figma limit; inside a part the order matters (aliases need their targets)
const parts = [
  { name: "Colors", part: { collections: [palette, semantic] } },
  { name: "Dimensions-and-styles", part: { collections: [dimension], effectStyles: payload.effectStyles, textStyles: payload.textStyles } },
];

mkdirSync(BUNDLE_DIR, { recursive: true });
parts.forEach(({ name, part }, index) =>
  writeFileSync(join(BUNDLE_DIR, `${index + 1}-${name}.js`), `${importer}\nreturn await importTokens(${JSON.stringify(part)});\n`),
);
console.log(parts.map(({ name }, index) => join(BUNDLE_DIR, `${index + 1}-${name}.js`)).join("\n"));
