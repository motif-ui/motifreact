/**
 * wrap-with-layer.mjs
 *
 * Each .module.scss file is wrapped with @layer
 *
 * Excluded formats:
 *   @use, @forward, @import
 *   $variable declarations
 *   @mixin, @function
 *
 *
 */

import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";

const LAYER_NAME = "motif-ui"; // projeye göre değiştir
const GLOB_PATTERN = "src/lib/**/*.module.scss";

/**
 * Single-line compile-time directives → remain outside the layer.
 * NOTE: $variable is not handled here, but in isHoistedBlockStart,
 * because they can be multi-line (multiline map/list).
 */
function isAtomicHoistedLine(line) {
  const t = line.trimStart();
  if (t === "") return true; // boş satır
  if (t.startsWith("//")) return true; // // yorum
  if (/^\/\*/.test(t)) return true; // /* blok yorum */
  if (/^@(use|forward|import)\s/.test(t)) return true; // @use / @forward / @import
  return false;
}

/**
 * Directives that will remain outside the layer along with their entire block:
 *   @mixin / @function  → followed by braces {}
 *   $var: value;        → single-line (ends with semicolon)
 *   $var: (...)         → multi-line map/list, followed by parentheses ()
 *
 * IMPORTANT: This check must be performed BEFORE isAtomicHoistedLine.
 * Otherwise, $var lines inside a @mixin body would be counted as atomic,
 * causing the mixin to be cut off midway and @layer to be opened in the wrong place.
 */
function isHoistedBlockStart(line) {
  const t = line.trimStart();
  if (/^@(mixin|function)\s/.test(t)) return true;
  if (/^\$[\w-]+\s*:/.test(t)) return true; // $var: ... (tek veya çok satır)
  return false;
}

/**
 * Returns the depth counter that will track the block's closing.
 * null → single-line (already closed), loop is not entered.
 */
function getDepthCounter(line) {
  const t = line.trimStart();

  if (/^@(mixin|function)\s/.test(t)) {
    return l => (l.match(/\{/g) || []).length - (l.match(/\}/g) || []).length;
  }

  if (/^\$[\w-]+\s*:/.test(t)) {
    if (/;\s*$/.test(line.trimEnd())) return null;
    return l => (l.match(/\(/g) || []).length - (l.match(/\)/g) || []).length;
  }

  return null;
}

/**
 *  Splits the file content into two parts:
 *  - hoisted : will remain outside @layer (SCSS compile-time)
 *  - body    : will be wrapped inside @layer (CSS selector blocks)
 */
function splitContent(content) {
  const lines = content.split("\n");
  const hoisted = [];
  const body = [];
  let bodyStarted = false;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (bodyStarted) {
      body.push(line);
      i++;
      continue;
    }

    // 1. Multi lined hoisted block (@mixin, @function, $var: (...))
    if (isHoistedBlockStart(line)) {
      const counter = getDepthCounter(line);
      hoisted.push(line);
      i++;

      if (counter !== null) {
        let depth = counter(line);
        while (depth > 0 && i < lines.length) {
          const inner = lines[i];
          hoisted.push(inner);
          depth += counter(inner);
          i++;
        }
      }
      continue;
    }

    // 2. Single line compile time
    if (isAtomicHoistedLine(line)) {
      hoisted.push(line);
      i++;
      continue;
    }

    // 3. Firs real css line
    bodyStarted = true;
    body.push(line);
    i++;
  }

  return { hoisted, body };
}

/**
 * Hoisted + body + @layer
 */
function wrapWithLayer(hoisted, body, layerName) {
  while (body.length && body[body.length - 1].trim() === "") body.pop();
  while (hoisted.length && hoisted[hoisted.length - 1].trim() === "") hoisted.pop();

  const indented = body.map(l => (l.trim() === "" ? "" : `  ${l}`));

  const parts = [];
  if (hoisted.length) {
    parts.push(hoisted.join("\n"));
    parts.push("");
  }
  parts.push(`@layer ${layerName} {`);
  parts.push(...indented);
  parts.push(`}`);
  parts.push("");
  return parts.join("\n");
}

// ─── Main Flow ────────────────────────────────────────────────────────────────

const files = await glob(GLOB_PATTERN);

if (files.length === 0) {
  console.warn(`⚠️  There is no file matched on this pattern: ${GLOB_PATTERN}`);
}

let skipped = 0;
let processed = 0;
let errors = 0;

for (const file of files) {
  try {
    const content = readFileSync(file, "utf8");

    if (content.includes(`@layer ${LAYER_NAME}`)) {
      console.log(`⏭  SKIP     ${file}`);
      skipped++;
      continue;
    }

    const { hoisted, body } = splitContent(content);

    if (body.filter(l => l.trim()).length === 0) {
      console.log(`⚠️  NO BODY  ${file}`);
      skipped++;
      continue;
    }

    const result = wrapWithLayer([...hoisted], [...body], LAYER_NAME);
    writeFileSync(file, result, "utf8");
    console.log(`✅ DONE     ${file}`);
    processed++;
  } catch (err) {
    console.error(`❌ ERROR    ${file}:`, err.message);
    errors++;
  }
}

console.log(`\n📊 Result: ${processed} completed, ${skipped} skipped, ${errors} error`);
