import { readFileSync, readdirSync } from "fs";
import { join } from "path";

/**
 * Contract tests for the Storybook internals our custom UI layer depends on.
 *
 * manager-head.html and preview-head.html style Storybook's internal DOM
 * (class names, ids, data attributes, aria-labels), and motifTheme.ts feeds
 * the theming API — none of which are stable public API. These tests extract
 * every token we rely on and assert the corresponding literal still exists in
 * the installed Storybook bundles, so a version bump that renames or removes
 * an internal fails CI instead of silently shipping broken styling.
 *
 * A failure here means: open the named file, find the listed token, and
 * re-check it against the new Storybook version's DOM/API.
 */

const ROOT = process.cwd();

/** Recursively concatenates every .js file under a directory into one haystack. */
const readBundle = (dir: string): string =>
  readdirSync(dir, { withFileTypes: true })
    .map(entry => {
      const fullPath = join(dir, entry.name);
      return entry.isDirectory() ? readBundle(fullPath) : entry.name.endsWith(".js") ? readFileSync(fullPath, "utf-8") : "";
    })
    .join("\n");

const styleOf = (relativePath: string): string => {
  const html = readFileSync(join(ROOT, relativePath), "utf-8");
  const styleBlock = html.match(/<style>([\s\S]*?)<\/style>/);
  if (!styleBlock) {
    throw new Error(`No <style> block found in ${relativePath}`);
  }
  return styleBlock[1].replace(/\/\*[\s\S]*?\*\//g, "");
};

const unique = (matches: IterableIterator<RegExpExecArray>): string[] => [...new Set([...matches].map(match => match[1]))];

const HEX_COLOR = /^[0-9a-fA-F]{3,8}$/;

const extractTokens = (css: string) => ({
  classes: unique(css.matchAll(/\.([a-zA-Z][\w-]*)/g)),
  ids: unique(css.matchAll(/#([a-zA-Z][\w-]*)/g)).filter(token => !HEX_COLOR.test(token)),
  dataAttributes: unique(css.matchAll(/\[(data-[\w-]+)/g)),
  ariaLabels: unique(css.matchAll(/aria-label\*?="([^"]+)"/g)),
});

const missingFrom = (haystack: string, tokens: string[]): string[] => tokens.filter(token => !haystack.includes(token));

describe("manager-head.html → storybook manager bundle", () => {
  const managerBundle = readBundle(join(ROOT, "node_modules/storybook/dist/manager"));
  const tokens = extractTokens(styleOf(".storybook/manager-head.html"));

  // Tokens we define ourselves, verified against our own sources instead.
  const OWN_ARIA_LABELS = ["Global theme for components"];
  // Sidebar tree-level classes computed in manager.tsx (classifySidebarItems),
  // not Storybook internals — see that file for what assigns them.
  const OWN_CLASSES = ["sidebar-level-1", "sidebar-level-2", "nested-component-child"];
  // A standalone story's Controls panel renders addon-docs's ArgsTable block
  // into the manager's own document (not the preview iframe), so these
  // classes come from @storybook/addon-docs, not the manager bundle — same
  // classes preview-head.html's docs-page ArgsTable styling already relies
  // on, verified against the addon-docs bundle below in this same block.
  const ADDON_DOCS_CLASSES = ["docblock-argstable", "docblock-argstable-head", "docblock-argstable-body"];

  it("extracts a plausible token set (guards against a silent parser regression)", () => {
    // Only class selectors are guaranteed to exist; ids/data-attrs/aria-labels
    // may legitimately be absent. All four extractors share one parsing
    // pipeline, so a non-empty class list proves extraction works.
    expect(tokens.classes.length).toBeGreaterThan(0);
  });

  it("only targets class names that still exist in the manager bundle", () => {
    const storybookClasses = tokens.classes.filter(token => !OWN_CLASSES.includes(token) && !ADDON_DOCS_CLASSES.includes(token));
    expect(missingFrom(managerBundle, storybookClasses)).toEqual([]);
  });

  it("only targets addon-docs-sourced class names that still exist in the addon-docs bundle", () => {
    const docsBundle = readBundle(join(ROOT, "node_modules/@storybook/addon-docs/dist"));
    const addonDocsClassesUsed = tokens.classes.filter(token => ADDON_DOCS_CLASSES.includes(token));
    expect(missingFrom(docsBundle, addonDocsClassesUsed)).toEqual([]);
  });

  it("keeps our own sidebar-level classes in sync with manager.tsx", () => {
    const managerSource = readFileSync(join(ROOT, ".storybook/manager.tsx"), "utf-8");
    const ownClassesUsed = tokens.classes.filter(token => OWN_CLASSES.includes(token));
    expect(missingFrom(managerSource, ownClassesUsed)).toEqual([]);
  });

  it("only targets ids that still exist in the manager bundle", () => {
    expect(missingFrom(managerBundle, tokens.ids)).toEqual([]);
  });

  it("only targets data attributes that still exist in the manager bundle", () => {
    expect(missingFrom(managerBundle, tokens.dataAttributes)).toEqual([]);
  });

  it("only targets aria-labels that still exist in the manager bundle", () => {
    const storybookLabels = tokens.ariaLabels.filter(label => !OWN_ARIA_LABELS.includes(label));
    expect(missingFrom(managerBundle, storybookLabels)).toEqual([]);
  });

  it("keeps our own aria-labels in sync with the globalTypes that generate them", () => {
    const previewSource = readFileSync(join(ROOT, ".storybook/preview.tsx"), "utf-8");
    const ownLabelsUsed = tokens.ariaLabels.filter(label => OWN_ARIA_LABELS.includes(label));
    expect(missingFrom(previewSource, ownLabelsUsed)).toEqual([]);
  });
});

describe("preview-head.html → addon-docs bundle", () => {
  const docsBundle = readBundle(join(ROOT, "node_modules/@storybook/addon-docs/dist"));
  const tokens = extractTokens(styleOf(".storybook/preview-head.html"));

  // Classes our own stories/docs components set; not Storybook internals.
  // sbdocs-a: a class OUR css defensively excludes on heading anchors
  // (`a:not(.sbdocs-a)`) — not something addon-docs itself ever applies.
  const OWN_CLASSES = ["no-border", "story-less-margin", "story-no-margin", "sbdocs-a"];

  it("extracts a plausible token set (guards against a silent parser regression)", () => {
    expect(tokens.classes.length).toBeGreaterThan(0);
  });

  it("only targets class names that still exist in the addon-docs bundle", () => {
    const storybookClasses = tokens.classes.filter(token => !OWN_CLASSES.includes(token));
    expect(missingFrom(docsBundle, storybookClasses)).toEqual([]);
  });
});

/**
 * The `mtfdocs-` prefix on every custom property below exists so our own
 * CSS variables can never collide with ones Storybook itself might define —
 * both files share one page (and thus one custom-property namespace) with
 * Storybook's own manager/docs styles at runtime, even though nothing here
 * checks against Storybook's bundles directly (unlike the class/id/data-attr
 * checks above): a collision would be a *value*, not a *name*, mismatch, and
 * Storybook's internal variable names aren't part of any bundle this test
 * can grep — the prefix is the actual guarantee, so that's what's enforced.
 */
describe.each([
  { file: ".storybook/manager-head.html", label: "manager-head.html" },
  { file: ".storybook/preview-head.html", label: "preview-head.html" },
])("$label custom properties (--mtfdocs-*)", ({ file }) => {
  const css = styleOf(file);
  const defined = unique(css.matchAll(/^\s*--([\w-]+)\s*:/gm));
  const referenced = unique(css.matchAll(/var\(\s*--([\w-]+)/g));

  it("extracts a plausible token set (guards against a silent parser regression)", () => {
    expect(defined.length).toBeGreaterThan(0);
    expect(referenced.length).toBeGreaterThan(0);
  });

  it("only defines properties with the mtfdocs- prefix", () => {
    expect(defined.filter(name => !name.startsWith("mtfdocs-"))).toEqual([]);
  });

  it("only references properties with the mtfdocs- prefix", () => {
    expect(referenced.filter(name => !name.startsWith("mtfdocs-"))).toEqual([]);
  });

  it("has no var() reference to a property that isn't defined in :root", () => {
    // Regression guard: manager-head.html once referenced var(--border)
    // with no matching :root definition — a silent no-op, not a CSS error.
    expect(referenced.filter(name => !defined.includes(name))).toEqual([]);
  });

  it("has no :root definition that nothing ever references", () => {
    expect(defined.filter(name => !referenced.includes(name))).toEqual([]);
  });
});

describe("motifTheme.ts → storybook theming API", () => {
  const themeSource = readFileSync(join(ROOT, ".storybook/motifTheme.ts"), "utf-8");
  const themeKeys = unique(themeSource.matchAll(/^ {2}([A-Za-z]\w*):/gm));
  const createDts = readFileSync(join(ROOT, "node_modules/storybook/dist/theming/create.d.ts"), "utf-8");

  it("extracts a plausible key set (guards against a silent parser regression)", () => {
    expect(themeKeys).toContain("base");
    expect(themeKeys.length).toBeGreaterThan(5);
  });

  it("only uses theme keys the installed ThemeVars type still declares", () => {
    const missingKeys = themeKeys.filter(key => !new RegExp(`\\b${key}\\??:`).test(createDts));
    expect(missingKeys).toEqual([]);
  });
});
