import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import * as sass from "sass";

/**
 * Produces a static, gitignored JSON map of { [componentScssPath]: string[] } listing every local
 * CSS-module class name per component. MotifDoc's "Styling" tab (CSSClassNames.tsx) reads this file
 * with a single static import instead of a runtime `import(\`...${scssPath}\`)`. That runtime dynamic
 * import forced webpack to build a context module covering every component's .module.scss, which made
 * Chromatic's TurboSnap treat any component style change as a change to the shared Storybook preview
 * config (since CSSClassNames.tsx is statically imported by MotifDoc -> MotifDocContainer -> preview.tsx),
 * disabling TurboSnap on effectively every PR. Because this file is generated fresh before Storybook/tsc
 * run and is never committed, it never shows up in the git diff Chromatic traces either.
 */

// eslint-disable-next-line no-undef
const rootDir = process.cwd();
const stylesRoot = path.resolve(rootDir, "src/lib/styles");
const componentsRoot = path.resolve(rootDir, "src/lib/components");
const outFile = path.resolve(rootDir, "src/docs/components/CSSDocumentation/generated/classNames.generated.json");

const resolveStylesAlias = url => {
  const rest = url.replace(/^@styles\/?/, "");
  const base = rest ? path.join(stylesRoot, rest) : stylesRoot;
  const candidates = [
    `${base}.scss`,
    path.join(path.dirname(base), `_${path.basename(base)}.scss`),
    path.join(base, "_index.scss"),
    path.join(base, "index.scss"),
  ];

  return candidates.find(candidate => fs.existsSync(candidate));
};

const stylesImporter = {
  findFileUrl(url) {
    if (url !== "@styles" && !url.startsWith("@styles/")) return null;
    const resolved = resolveStylesAlias(url);
    return resolved ? pathToFileURL(resolved) : null;
  },
};

const walk = dir =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.isFile() && entry.name.endsWith(".module.scss") ? [full] : [];
  });

/** Extracts every local class-name token from a rule prelude, on already-Sass-compiled (flat) CSS. */
const extractClassNames = css => {
  const classNames = new Set();
  const preludeRegex = /([^{}]+)\{/g;
  let preludeMatch;

  while ((preludeMatch = preludeRegex.exec(css))) {
    const prelude = preludeMatch[1];
    if (prelude.trim().startsWith("@")) continue;

    const classRegex = /\.([a-zA-Z_][a-zA-Z0-9_-]*)/g;
    let classMatch;
    while ((classMatch = classRegex.exec(prelude))) classNames.add(classMatch[1]);
  }

  return [...classNames].sort((a, b) => a.localeCompare(b));
};

const generate = () => {
  const files = walk(componentsRoot);
  const map = {};

  for (const file of files) {
    const relativePath = path.relative(componentsRoot, file).split(path.sep).join("/");
    try {
      const result = sass.compile(file, { importers: [stylesImporter], style: "expanded" });
      map[relativePath] = extractClassNames(result.css);
    } catch (error) {
      console.warn(`[generate:css-class-names] Failed to compile ${relativePath}:`, error.message);
      map[relativePath] = [];
    }
  }

  const sortedMap = Object.fromEntries(
    Object.keys(map)
      .sort()
      .map(key => [key, map[key]]),
  );

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, `${JSON.stringify(sortedMap, null, 2)}\n`);
  console.log(`[generate:css-class-names] Wrote ${Object.keys(sortedMap).length} entries to ${path.relative(rootDir, outFile)}`);
};

generate();
