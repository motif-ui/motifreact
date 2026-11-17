import { describe, expect, test } from "@jest/globals";
import { generate, loadTheme, staleFiles } from "./build.ts";
import { buildTokens, radiusScale, typeSize } from "./buildTokens.ts";
import { toCss, toFigma } from "./formats.ts";
import { LEGACY_MAP } from "./legacyMap.ts";
import { alphaSuffix } from "./palette.ts";
import { validateFigma, validateTheme, validateTokens } from "./validate.ts";
import type { FigmaPayload, FigmaVariable, Theme, Token } from "./types.ts";

const color = (path: string[], value: string, dark?: string): Token => ({ path, type: "color", value, ...(dark && { dark }) });
const palette = color(["color", "palette", "neutral", "50"], "#f5f7f9");

const theme = loadTheme();
const cssOf = (overrides: Partial<Theme>) => toCss(buildTokens({ ...theme, ...overrides }).tokens);
const warningsOf = (overrides: Partial<Theme>) => buildTokens({ ...theme, ...overrides }).warnings.join("\n");

describe("token generator", () => {
  const { tokens } = buildTokens(theme);
  const figma = toFigma(tokens);
  const variable = (name: string) => figma.collections.flatMap(({ variables }) => variables).find(v => v.name === name);

  test("generated tokens and Figma payload pass validation", () => {
    expect(validateTokens(tokens)).toEqual([]);
    expect(validateFigma(figma)).toEqual([]);
  });

  test("committed generated files are up to date", () => {
    expect(staleFiles(generate().files)).toEqual([]);
  });

  test("every legacy name points at an existing token", () => {
    const css = toCss(tokens);
    expect(Object.values(LEGACY_MAP).filter(name => !css.includes(`${name}:`))).toEqual([]);
  });

  test("radius derives from the seed", () => {
    expect(radiusScale(4)).toEqual({ sm: 2, md: 4, lg: 8 });
    expect(radiusScale(8)).toEqual({ sm: 4, md: 8, lg: 16 });
    expect(radiusScale(5)).toEqual({ sm: 3, md: 5, lg: 10 });
    expect(radiusScale(1)).toEqual({ sm: 1, md: 1, lg: 2 });
    expect(radiusScale(0)).toEqual({ sm: 0, md: 0, lg: 0 });
  });

  test("seeds stay out of the output", () => {
    expect(toCss(tokens)).not.toContain("seed-");
  });

  test("spacing is named by its default px and follows the space seed", () => {
    expect(toCss(tokens)).toContain("--mtf-sizing-space-10: 0.625rem;");
    expect(cssOf({ space: 6 })).toContain("--mtf-sizing-space-10: 0.9375rem;");
  });

  test("type scale follows the font size seed on a 4px line grid", () => {
    expect(typeSize(16, 16, 24)).toEqual({ size: 16, lineHeight: 24 });
    expect(typeSize(14, 16, 24)).toEqual({ size: 14, lineHeight: 20 });
    expect(typeSize(18, 40, 56)).toEqual({ size: 45, lineHeight: 64 });
  });

  test("background and text overrides are used as given", () => {
    expect(cssOf({ background: "#FFFFFF" })).toContain(
      "--mtf-color-surface-canvas: light-dark(var(--mtf-color-palette-background), var(--mtf-color-palette-neutral-900));",
    );
    expect(cssOf({ text: "#222222" })).toContain("--mtf-color-palette-text: #222222;");
    expect(toCss(tokens)).not.toContain("palette-background");
  });

  test("overrides warn instead of failing", () => {
    expect(warningsOf({ background: "#ffffff" })).toContain("cards only separate from the page");
    expect(warningsOf({ text: "#aaaaaa" })).toContain("below AA 4.5");
    expect(warningsOf({ text: "#000000" })).toContain("out of order");
    expect(warningsOf({ text: "#3a4752" })).toBe(warningsOf({}));
  });

  test("type roles keep today's weights", () => {
    const css = toCss(tokens);
    expect(css).toContain("--mtf-typography-heading-h1-font-weight: var(--mtf-typography-weight-strongest);");
    expect(css).toContain("--mtf-typography-body-md-font-weight: var(--mtf-typography-weight-regular);");
    expect(css).toContain("--mtf-typography-label-md-font-weight: var(--mtf-typography-weight-strong);");
  });

  test("field role aliases the shared text and border tokens", () => {
    const css = toCss(tokens);
    expect(css).toContain("--mtf-color-text-field: var(--mtf-color-text-strong);");
    expect(css).toContain("--mtf-color-border-field-focus: var(--mtf-color-primary-border);");
    expect(variable("color/border/field-focus")).toMatchObject({
      scopes: ["STROKE_COLOR"],
      values: { Light: { alias: "color/primary/border" }, Dark: { alias: "color/primary/border" } },
    });
  });

  test("default radius seed keeps today's 4px corner", () => {
    expect(toCss(tokens)).toContain("--mtf-sizing-radius-md: 0.25rem;");
  });

  test("alpha outside the ladder is rejected", () => {
    expect(alphaSuffix(0.8)).toBe("a80");
    expect(() => alphaSuffix(0.5)).toThrow("not on the ladder");
  });

  test("CSS uses light-dark only when modes differ", () => {
    const css = toCss(tokens);
    expect(css).toContain(
      "--mtf-color-surface-canvas: light-dark(var(--mtf-color-palette-neutral-50), var(--mtf-color-palette-neutral-900));",
    );
    expect(css).toContain("--mtf-color-backdrop: var(--mtf-color-palette-black-a64);");
  });

  test("Figma gets px numbers, hidden palette and two semantic modes", () => {
    expect(variable("sizing/4")?.values).toEqual({ Value: 4 });
    expect(variable("sizing/radius/round")?.values).toEqual({ Value: 999 });
    expect(variable("color/palette/primary/500")).toMatchObject({ hiddenFromPublishing: true, scopes: [] });
    expect(variable("color/surface/canvas")?.values).toEqual({
      Light: { alias: "color/palette/neutral/50" },
      Dark: { alias: "color/palette/neutral/900" },
    });
    expect(variable("typography/font-family")?.values).toEqual({ Value: "Inter" });
    expect(variable("typography/font-family-mono")).toBeUndefined();
    expect(figma.effectStyles[0].effects[0].color).toEqual({ alias: "elevation/1-color" });
    expect(figma.textStyles.find(({ name }) => name === "typography/heading-h1")).toEqual({
      name: "typography/heading-h1",
      fontFamily: { alias: "typography/font-family" },
      fontSize: { alias: "typography/heading-h1/font-size" },
      lineHeight: { alias: "typography/heading-h1/line-height" },
      fontWeight: { alias: "typography/heading-h1/font-weight" },
    });
  });
});

describe("validateTokens", () => {
  test.each<[string, Token[], string]>([
    ["unresolved alias", [color(["color", "text", "default"], "{color.palette.missing.1}")], "unresolved alias"],
    ["alias cycle", [color(["color", "text", "a"], "{color.text.b}"), color(["color", "text", "b"], "{color.text.a}")], "alias cycle"],
    ["alpha off the ladder", [color(["color", "palette", "black-a50"], "#00000080")], "not on the ladder"],
    ["alpha byte mismatch", [color(["color", "palette", "black-a64"], "#00000080")], "does not match"],
    ["raw hex in a semantic token", [color(["color", "text", "default"], "#000000")], "must reference the palette"],
    ["palette with a dark value", [color(["color", "palette", "white"], "#ffffff", "#000000")], "single literal"],
    ["unreserved group", [{ path: ["icon", "size"], type: "dimension", value: { value: 1, unit: "rem" } }], "not a reserved group"],
    ["duplicate name", [palette, palette], "more than once"],
    [
      "alias of another type",
      [palette, { path: ["typography", "body-md", "font-weight"], type: "fontWeight", value: "{color.palette.neutral.50}" }],
      "is not a fontWeight",
    ],
  ])("%s", (_, input, message) => {
    expect(validateTokens(input).join("\n")).toContain(message);
  });
});

describe("validateTheme", () => {
  test("default theme is valid", () => {
    expect(validateTheme(theme)).toEqual([]);
  });

  test.each([
    ["missing intent", { colors: { ...theme.colors, info: undefined } }, "colors.info"],
    ["unknown intent", { colors: { ...theme.colors, brand: "#ffffff" } }, "unknown seed"],
    ["bad override", { background: "white" }, "seed background"],
    ["radius out of range", { radius: 16 }, "seed radius"],
    ["fractional font size", { fontSize: 15.5 }, "seed fontSize"],
  ])("%s", (_, overrides, message) => {
    expect(validateTheme({ ...theme, ...overrides }).join("\n")).toContain(message);
  });
});

describe("validateFigma", () => {
  const collection = (variables: FigmaVariable[]): FigmaPayload => ({
    collections: [{ name: "Semantic", modes: ["Light", "Dark"], variables }],
    effectStyles: [],
    textStyles: [],
  });
  const semantic = (overrides: Partial<FigmaVariable>): FigmaVariable => ({
    name: "color/text/default",
    type: "COLOR",
    scopes: ["TEXT_FILL"],
    hiddenFromPublishing: false,
    values: { Light: "#000000", Dark: "#ffffff" },
    ...overrides,
  });

  test.each([
    ["missing mode", semantic({ values: { Light: "#000000" } }), "must cover modes"],
    ["unknown scope", semantic({ scopes: ["TEXT_COLOR"] }), "unknown scope"],
    ["published without scope", semantic({ scopes: [] }), "no scope but is published"],
    ["dangling alias", semantic({ values: { Light: { alias: "color/nope" }, Dark: "#ffffff" } }), "does not exist"],
  ])("%s", (_, input, message) => {
    expect(validateFigma(collection([input])).join("\n")).toContain(message);
  });
});
