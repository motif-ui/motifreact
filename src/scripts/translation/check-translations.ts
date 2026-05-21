import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import process from "node:process";

const SOURCE_DIR = "src/docs/v1/en";
const OUTPUT_DIR = "src/docs/v1/tr";
const CACHE_FILE = "src/scripts/translation/.translation-cache.json";

type Cache = Record<string, string | undefined>;

const hashContent = (content: string): string => crypto.createHash("sha256").update(content).digest("hex");

const collectMdxFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectMdxFiles(fullPath);
    if (entry.isFile() && entry.name.endsWith(".mdx")) return [fullPath];
    return [];
  });

function loadCacheOrExit(): Cache {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) as Cache;
  } catch {
    console.error("❌ Translation cache not found:", CACHE_FILE);
    process.exit(1);
  }
}

const cache = loadCacheOrExit();
const files = collectMdxFiles(SOURCE_DIR);

const errors = files.flatMap(enFile => {
  const rel = path.relative(SOURCE_DIR, enFile);
  const trFile = path.join(OUTPUT_DIR, rel);
  const hash = hashContent(fs.readFileSync(enFile, "utf8"));

  const expected = cache[`${hash}:cb`] ?? cache[hash];

  if (!expected) return [`UNTRANSLATED  ${rel}`];
  if (!fs.existsSync(trFile)) return [`MISSING TR    ${rel}`];

  const trContent = fs.readFileSync(trFile, "utf8");
  if (trContent !== expected) return [`OUT OF SYNC   ${rel}`];
  return [];
});

if (errors.length > 0) {
  console.error("\n❌ Translation check failed — run: npm run check:translations\n");
  errors.forEach(e => console.error("  •", e));
  console.error("");
  process.exit(1);
}

console.log(`✅ All ${files.length} TR translations are in sync.`);
