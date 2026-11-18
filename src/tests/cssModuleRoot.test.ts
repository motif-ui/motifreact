/**
 * @jest-environment node
 */
import { readdirSync, readFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { pathToFileURL } from "url";
import { compile } from "sass";

// The CSS module naming turns ".Root" into the component's public class (mtf-[module]), and sanitizeModuleRootClasses
// always adds styles.Root. A module without a compiled .Root rule silently drops that class from the component.
const LIB = resolve(__dirname, "../lib");
const STYLES = join(LIB, "styles");

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry => (entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]));

const resolveImport = (file: string, path: string) => (path.startsWith("@/") ? join(LIB, path.slice(2)) : join(dirname(file), path));

const stylesImportOf = (file: string) => {
  const source = readFileSync(file, "utf8");
  const [, path] = source.match(/import \w+ from "([^"]+\.module\.scss)"/) ?? [];
  return source.includes("sanitizeModuleRootClasses(") && path ? resolveImport(file, path) : undefined;
};

const stylesImporter = { findFileUrl: (url: string) => (url.startsWith("@styles") ? pathToFileURL(`${STYLES}/`) : null) };

const modules = [
  ...new Set(
    walk(LIB)
      .filter(file => file.endsWith(".tsx"))
      .map(stylesImportOf)
      .filter((path): path is string => !!path),
  ),
];

describe("CSS module root class", () => {
  it("finds the modules to check", () => {
    expect(modules.length).toBeGreaterThan(0);
  });

  it.each(modules.map(path => [path.replace(`${LIB}/`, ""), path]))("%s compiles a .Root rule", (_, path) => {
    const { css } = compile(path, { importers: [stylesImporter], loadPaths: [STYLES] });
    expect(css).toMatch(/\.Root\b[^{]*\{/);
  });
});
