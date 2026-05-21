import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import process from "node:process";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SOURCE_DIR = "src/docs/v1/en";
const OUTPUT_DIR = "src/docs/v1/tr";
const CACHE_FILE = "src/scripts/translation/.translation-cache.json";
const MODEL = "gemini-2.5-flash";
const REQUEST_DELAY_MS = 13000;

const args = process.argv.slice(2);
const forceFlag = args.includes("--force");
const dryRunFlag = args.includes("--dry-run");
const skipCodeBlocks = args.includes("--skip-code-blocks");
const singleFile = args.find(a => !a.startsWith("--"));

const ai = new GoogleGenerativeAI(process.env.TRANSLATION_API_KEY ?? "");

type Cache = Record<string, string | undefined>;
type ProcessResult = { cached: true } | { cached: false; madeApiCall: boolean };
type CodeBlockResult = { content: string; apiCalled: boolean; success: boolean };
type CodeFence = {
  full: string;
  ticks: string;
  lang: string;
  inner: string;
  start: number;
  end: number;
};

// Load .env.local if present
const envPath = new URL("../../../.env.local", import.meta.url).pathname;
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .forEach(line => {
      const [key, ...rest] = line.split("=");
      if (key.trim() && rest.length && !process.env[key.trim()]) {
        process.env[key.trim()] = rest.join("=").trim();
      }
    });
}

// ─── Prompts ──────────────────────────────────────────────────────────────────

const PROSE_PROMPT = `You are a technical documentation translator for a React UI library called Motif UI. Translate MDX documentation files from English to Turkish.

Rules:
1. Translate all natural language prose to natural, fluent Turkish. Keep technical terminology consistent throughout the file.

2. Preserve exactly — do NOT translate:
   - Code block contents (everything between \`\`\` fences)
   - Inline code (text wrapped in single backticks \`like this\`) — keep the backticks, never remove them
   - JSX component names and attribute names (e.g. <Button>, <Canvas>, <Meta>)
   - JSX attribute values that are code/identifiers (e.g. variant="outline", size="lg")
   - URLs, file paths, CSS class names, CSS property names, JS/TS identifiers
   - HTML/JSX tag names that appear inside markdown headings (e.g. ### Using the \`<style>\` tag — keep the backticks around the tag)

3. <Meta title="X/Y" /> line: output <Meta title="X/Y (TR)" /> — keep all path segments identical, only append " (TR)" to the LAST segment (e.g. "Getting Started/Overview" → "Getting Started/Overview (TR)").

4. Import statements: copy ALL import lines verbatim — paths will be adjusted automatically after translation.

5. Output ONLY the translated MDX content. No explanations, no surrounding code fences.`;

const CODE_BLOCKS_PROMPT = `You translate code comments and user-facing string literals from English to Turkish inside code snippets.

Each code block is wrapped between <<<BLOCK_N_START>>> and <<<BLOCK_N_END>>> delimiters.
Return the blocks using the EXACT SAME delimiter format, with translations applied inside.

For each block, translate ONLY:
- Single-line comments (// ... or # ...)
- Multi-line comments (/* ... */ or <!-- ... -->)
- Quoted string values that are clearly natural language: user-visible messages, placeholder text, labels, button text, descriptions (typically phrases with spaces)

Do NOT translate:
- Variable names, function names, class names, any identifiers
- CSS property names or their values (e.g. flex, 16px, outline, lg, solid, center)
- Import/require paths, URLs, file paths, package names
- Short single-word or technical strings (e.g. "primary", "default", "true", "false", "outline")
- HTML/JSX attribute names

Output ONLY the delimited blocks — no extra text, no explanations, no markdown fences.`;

// ─── Import path adjustment ────────────────────────────────────────────────────

const adjustImportPaths = (translated: string, sourceFilePath: string): string => {
  const subdir = path.basename(path.dirname(sourceFilePath));
  return translated.replace(
    /((?:from|import)\s+)(["'])(\.\/[^"']+)(["'])/g,
    (_match, keyword: string, q1: string, importPath: string, q2: string) =>
      `${keyword}${q1}../../en/${subdir}/${importPath.slice(2)}${q2}`,
  );
};

// ─── Code block extraction ─────────────────────────────────────────────────────

const extractCodeFences = (mdxContent: string): CodeFence[] =>
  [...mdxContent.matchAll(/^(`{3,})([^\n]*)$([\s\S]*?)^\1$/gm)].map(m => {
    const start = m.index;
    return {
      full: m[0],
      ticks: m[1],
      lang: m[2].trim(),
      inner: m[3].replace(/^\n/, "").replace(/\n$/, ""),
      start,
      end: start + m[0].length,
    };
  });

const hasTranslatableContent = (inner: string): boolean =>
  /^\s*\/\//m.test(inner) ||
  /\/\*[\s\S]*?\*\//.test(inner) ||
  /<!--[\s\S]*?-->/.test(inner) ||
  /^\s*#\s+\S/m.test(inner) ||
  /["'][^"'\n]*\s\S{3,}[^"'\n]*["']/.test(inner);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const hashContent = (content: string): string => crypto.createHash("sha256").update(content).digest("hex");

// ─── Gemini calls ─────────────────────────────────────────────────────────────

async function callGemini(prompt: string, systemInstruction: string, attempt = 0): Promise<string> {
  const model = ai.getGenerativeModel({ model: MODEL, systemInstruction });
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "";
    const is503 = errMsg.includes("503") || errMsg.includes("Service Unavailable");
    const isFetchFailed = errMsg.includes("fetch failed");
    if ((is503 || isFetchFailed) && attempt < 4) {
      const wait = 30000 * (attempt + 1);
      process.stdout.write(`\n    geçici hata — ${wait / 1000}s bekleniliyor… `);
      await delay(wait);
      return callGemini(prompt, systemInstruction, attempt + 1);
    }
    throw err;
  }
}

const translateProse = (source: string): Promise<string> => callGemini(source, PROSE_PROMPT);

const buildDelimitedPayload = (blocks: string[]): string =>
  blocks.map((b, i) => `<<<BLOCK_${i}_START>>>\n${b}\n<<<BLOCK_${i}_END>>>`).join("\n\n");

const parseDelimitedResponse = (response: string, count: number): string[] | null => {
  const results = Array.from({ length: count }, (_, i) => {
    const startTag = `<<<BLOCK_${i}_START>>>`;
    const endTag = `<<<BLOCK_${i}_END>>>`;
    const si = response.indexOf(startTag);
    const ei = response.indexOf(endTag);
    if (si === -1 || ei === -1 || ei <= si) return null;
    return response
      .slice(si + startTag.length, ei)
      .replace(/^\n/, "")
      .replace(/\n$/, "");
  });
  if (results.some(r => r === null)) return null;
  return results as string[];
};

async function translateCodeBlocks(innerBlocks: string[]): Promise<string[]> {
  const payload = buildDelimitedPayload(innerBlocks);
  const raw = await callGemini(
    `Translate comments and natural-language strings in these code blocks to Turkish:\n\n${payload}`,
    CODE_BLOCKS_PROMPT,
  );
  const parsed = parseDelimitedResponse(raw, innerBlocks.length);
  if (!parsed) throw new Error("delimiter parse failed");
  return parsed;
}

// ─── Code block pass ──────────────────────────────────────────────────────────

async function applyCodeBlockTranslation(mdxContent: string): Promise<CodeBlockResult> {
  const fences = extractCodeFences(mdxContent);
  const translatablePairs = fences.map((f, i) => ({ fenceIndex: i, inner: f.inner })).filter(({ inner }) => hasTranslatableContent(inner));

  if (translatablePairs.length === 0) {
    return { content: mdxContent, apiCalled: false, success: true };
  }

  const indices = translatablePairs.map(({ fenceIndex }) => fenceIndex);
  const toTranslate = translatablePairs.map(({ inner }) => inner);

  const translated = await translateCodeBlocks(toTranslate).catch(err => {
    const errMsg = err instanceof Error ? err.message : String(err);
    process.stdout.write(`[code-block-err: ${errMsg.split("\n")[0]}] `);
    return null;
  });

  if (!translated) return { content: mdxContent, apiCalled: true, success: false };

  if (translated.length !== toTranslate.length) {
    process.stdout.write("[code-block-len-mismatch] ");
    return { content: mdxContent, apiCalled: true, success: false };
  }

  // Replace fences in reverse order to preserve earlier start/end positions
  const content = indices.reduceRight((acc, fenceIdx, j) => {
    const f = fences[fenceIdx];
    const rebuilt = `${f.ticks}${f.lang}\n${translated[j]}\n${f.ticks}`;
    return `${acc.slice(0, f.start)}${rebuilt}${acc.slice(f.end)}`;
  }, mdxContent);

  return { content, apiCalled: true, success: true };
}

// ─── Cache ────────────────────────────────────────────────────────────────────

const loadCache = (): Cache => {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) as Cache;
  } catch {
    return {};
  }
};

const saveCache = (cache: Cache): void => {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
};

// ─── File processor ───────────────────────────────────────────────────────────

async function processFile(filePath: string, cache: Cache): Promise<ProcessResult> {
  const source = fs.readFileSync(filePath, "utf8");
  const hash = hashContent(source);
  const cbKey = `${hash}:cb`;

  const relPath = path.relative(SOURCE_DIR, filePath);
  const outPath = path.join(OUTPUT_DIR, relPath);

  const writeOutput = (content: string): void => {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, content);
  };

  // Early return: fully cached (prose + code blocks)
  const cbCached = !forceFlag ? cache[cbKey] : undefined;
  if (cbCached && !skipCodeBlocks) {
    if (!dryRunFlag) writeOutput(cbCached);
    process.stdout.write("(cached)\n");
    return { cached: true };
  }

  // Early return: prose cached when skipping code blocks
  const proseCached = !forceFlag ? cache[hash] : undefined;
  if (skipCodeBlocks && proseCached) {
    if (!dryRunFlag) writeOutput(proseCached);
    process.stdout.write("(cached)\n");
    return { cached: true };
  }

  // Phase 1: prose translation
  if (proseCached) process.stdout.write("prose↑ ");
  const proseOutput = proseCached ?? adjustImportPaths(await translateProse(source), filePath);
  const proseMadeApiCall = proseCached === undefined;

  if (!dryRunFlag && proseMadeApiCall) cache[hash] = proseOutput;

  // Phase 2: code block strings & comments
  if (skipCodeBlocks || dryRunFlag) {
    if (!dryRunFlag && skipCodeBlocks) {
      writeOutput(proseOutput);
      cache[hash] = proseOutput;
    }
    process.stdout.write("✓\n");
    return { cached: false, madeApiCall: proseMadeApiCall };
  }

  if (proseMadeApiCall) await delay(REQUEST_DELAY_MS);

  const { content: finalOutput, apiCalled: cbApiCalled, success: cbSuccess } = await applyCodeBlockTranslation(proseOutput);

  writeOutput(finalOutput);
  if (cbSuccess) cache[cbKey] = finalOutput;

  process.stdout.write("✓\n");
  return { cached: false, madeApiCall: proseMadeApiCall || cbApiCalled };
}

// ─── Directory walker ─────────────────────────────────────────────────────────

const collectMdxFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectMdxFiles(fullPath);
    if (entry.isFile() && entry.name.endsWith(".mdx")) return [fullPath];
    return [];
  });

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (!process.env.TRANSLATION_API_KEY) {
    console.error("Error: TRANSLATION_API_KEY environment variable is not set.");
    console.error("Get a free key at https://aistudio.google.com");
    process.exit(1);
  }

  const cache = loadCache();
  const files = singleFile ? [singleFile] : collectMdxFiles(SOURCE_DIR);

  if (files.length === 0) {
    console.log("No MDX files found.");
    return;
  }

  const mode = skipCodeBlocks ? "prose-only" : "prose + code blocks";
  console.log(`\n🌍 translate-docs (${MODEL}) — ${files.length} file(s) [${mode}]${dryRunFlag ? " [dry-run]" : ""}\n`);

  const stats = { cached: 0, success: 0, failed: 0 };

  for (const [i, file] of files.entries()) {
    process.stdout.write(`  ${file}… `);
    let madeApiCall = false;
    let isDailyLimitHit = false;

    try {
      const result = await processFile(file, cache);
      if (result.cached) {
        stats.cached++;
      } else {
        stats.success++;
        ({ madeApiCall } = result);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      isDailyLimitHit = errMsg.includes("429") && errMsg.includes("PerDay");
      process.stdout.write(`✗ ${errMsg.split("\n")[0]}\n`);
      stats.failed++;
      if (isDailyLimitHit) {
        console.log("\n  Günlük limit doldu. Yarın tekrar çalıştırın — cache sayesinde kaldığı yerden devam eder.");
      }
    }

    if (isDailyLimitHit) break;
    if (!dryRunFlag && madeApiCall && i < files.length - 1) await delay(REQUEST_DELAY_MS);
  }

  if (!dryRunFlag) saveCache(cache);

  console.log(`\nDone. ${stats.success} translated, ${stats.cached} cached, ${stats.failed} failed.`);
  if (stats.failed > 0) console.log("  Re-run to retry failed files.");
  if (stats.success > 0) console.log("  Run with --force to re-translate all files.");
}

void main();
