import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import * as sass from "sass";

const CLASS_SELECTOR_REGEX = /\.([a-zA-Z_][a-zA-Z0-9_-]*)/g;
const RULE_PRELUDE_REGEX = /([^{}]+)\{/g;

/**
 * Resolves the "@styles" alias (configured in webpack/next as an alias, not something sass knows about)
 * to a real file on disk, mirroring the same candidates css-loader/sass-loader would try.
 */
const resolveStylesAlias = (stylesRoot: string, url: string): string | undefined => {
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

const createStylesImporter = (stylesRoot: string): sass.FileImporter<"sync"> => ({
  findFileUrl(url) {
    if (url !== "@styles" && !url.startsWith("@styles/")) return null;
    const resolved = resolveStylesAlias(stylesRoot, url);
    return resolved ? pathToFileURL(resolved) : null;
  },
});

const collectModuleScssFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? collectModuleScssFiles(full) : entry.isFile() && entry.name.endsWith(".module.scss") ? [full] : [];
  });

/** Extracts every local class-name token from a rule prelude, on already-Sass-compiled (flat) CSS. */
const extractClassNames = (css: string): string[] => {
  const classNames = new Set<string>();

  for (const [, prelude] of css.matchAll(RULE_PRELUDE_REGEX)) {
    if (prelude.trim().startsWith("@")) continue;
    for (const [, className] of prelude.matchAll(CLASS_SELECTOR_REGEX)) classNames.add(className);
  }

  return [...classNames].sort((a, b) => a.localeCompare(b));
};

/**
 * Builds a { [componentScssPath]: string[] } map of every local CSS-module class name per component, by compiling
 * each `.module.scss` with sass directly (outside webpack). This lets MotifDoc's "Styling" tab (CSSClassNames.tsx)
 * reference a plain data object instead of a runtime `import(\`...${scssPath}\`)`. That computed dynamic import
 * forced webpack to build a context module covering every component's `.module.scss`, which made Chromatic's
 * TurboSnap treat any single component's style change as a change to the shared Storybook preview config (since
 * CSSClassNames.tsx is statically imported by MotifDoc -> MotifDocContainer -> preview.tsx), disabling TurboSnap
 * on effectively every PR.
 */
export const buildScssClassNamesManifest = (componentsDir: string, stylesRoot: string): Record<string, string[]> => {
  const importer = createStylesImporter(stylesRoot);
  const files = collectModuleScssFiles(componentsDir);

  const entries: [string, string[]][] = files.map(file => {
    const relativePath = path.relative(componentsDir, file).split(path.sep).join("/");
    try {
      const { css } = sass.compile(file, { importers: [importer], style: "expanded" });
      return [relativePath, extractClassNames(css)];
    } catch (error) {
      console.warn(`[css-class-names-manifest] Failed to compile ${relativePath}:`, (error as Error).message);
      return [relativePath, []];
    }
  });

  return Object.fromEntries(entries.toSorted(([a], [b]) => a.localeCompare(b)));
};
