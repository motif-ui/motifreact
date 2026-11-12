import { ALPHA_LADDER, alphaByte } from "./palette.ts";
import { FIGMA_SCOPES, aliasPath, cssName, isAlias } from "./formats.ts";
import { INTENTS } from "./buildTokens.ts";
import type { FigmaCollection, FigmaPayload, FigmaVariable, Theme, Token } from "./types.ts";

type TokensByKey = Map<string, Token>;

// Groups a theme may define; everything else under --mtf- (e.g. --mtf-icon-size) is an internal component channel
const RESERVED_GROUPS = ["color", "typography", "sizing", "elevation", "opacity"];
const SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const HEX = /^#[0-9a-f]{6}([0-9a-f]{2})?$/;
const ALPHA_SEGMENT = /-a(\d\d)$/;
const MAX_ALIAS_DEPTH = 10;

const isPrimitive = ({ path }: Token) => path[0] === "color" && ["palette", "seed"].includes(path[1]);

const duplicates = (names: string[]) => [...new Set(names.filter((name, i) => names.indexOf(name) !== i))];

/** Follows an alias chain to its literal; returns an error string when it breaks or loops. */
const resolveAlias = (byKey: TokensByKey, value: string, seen: string[] = []): { error?: string; token?: Token } => {
  const key = aliasPath(value).join(".");
  const target = byKey.get(key);
  return seen.includes(key) || seen.length > MAX_ALIAS_DEPTH
    ? { error: `alias cycle: ${[...seen, key].join(" → ")}` }
    : !target
      ? { error: `unresolved alias ${value}` }
      : isAlias(target.value)
        ? resolveAlias(byKey, target.value, [...seen, key])
        : { token: target };
};

const tokenErrors = (byKey: TokensByKey, token: Token) => {
  const { path, type, value, dark } = token;
  const name = cssName(path);
  const last = path[path.length - 1];
  const alphaMatch = last.match(ALPHA_SEGMENT);
  const alpha = alphaMatch ? Number(alphaMatch[1]) / 100 : 0;
  const hexAlpha = typeof value === "string" ? value.slice(7) : "";
  const colorValues = type === "color" ? [value, dark].filter(Boolean) : type === "shadow" ? [value.color] : [];
  // A shadow points at a color; every other alias must land on a token of its own type
  const [aliasType, aliases]: [string, unknown[]] = type === "shadow" ? ["color", [value.color]] : [type, [value, dark]];
  const aliasErrors = aliases.filter(isAlias).flatMap(alias => {
    const { error, token: target } = resolveAlias(byKey, alias);
    return error ? [`${name}: ${error}`] : target?.type !== aliasType ? [`${name}: alias ${alias} is not a ${aliasType}`] : [];
  });
  return [
    ...path.filter(segment => !SEGMENT.test(segment)).map(segment => `${name}: segment "${segment}" is not kebab-case`),
    ...(RESERVED_GROUPS.includes(path[0]) ? [] : [`${name}: "${path[0]}" is not a reserved group`]),
    ...(alphaMatch && !ALPHA_LADDER.includes(alpha) ? [`${name}: alpha ${alpha} is not on the ladder`] : []),
    ...(alphaMatch && ALPHA_LADDER.includes(alpha) && hexAlpha !== alphaByte(alpha)
      ? [`${name}: hex alpha ${hexAlpha} does not match ${last}`]
      : []),
    ...colorValues.filter(v => !isAlias(v) && !HEX.test(String(v))).map(v => `${name}: "${v}" is not a hex color`),
    ...(isPrimitive(token) && (dark || isAlias(value)) ? [`${name}: palette and seed tokens are single literal values`] : []),
    ...(type === "color" && !isPrimitive(token) && !colorValues.every(isAlias)
      ? [`${name}: semantic colors must reference the palette`]
      : []),
    ...aliasErrors,
  ];
};

export const validateTokens = (tokens: Token[]) => {
  const byKey = new Map(tokens.map(token => [token.path.join("."), token]));
  return [
    ...duplicates(tokens.map(({ path }) => cssName(path))).map(name => `${name}: defined more than once`),
    ...tokens.flatMap(token => tokenErrors(byKey, token)),
  ];
};

const variableErrors = (
  types: Map<string, FigmaVariable["type"]>,
  { name: collection, modes }: FigmaCollection,
  { name, type, scopes, hiddenFromPublishing, values }: FigmaVariable,
) => [
  ...(Object.keys(values).sort().join() === [...modes].sort().join() ? [] : [`${name}: values must cover modes ${modes.join(", ")}`]),
  ...scopes.filter(scope => !FIGMA_SCOPES.includes(scope)).map(scope => `${name}: unknown scope ${scope}`),
  ...(scopes.length === 0 && !hiddenFromPublishing ? [`${name}: has no scope but is published`] : []),
  ...(collection === "Palette" && !hiddenFromPublishing ? [`${name}: palette must be hidden from publishing`] : []),
  ...Object.values(values).flatMap(value =>
    typeof value === "object"
      ? !types.has(value.alias)
        ? [`${name}: alias ${value.alias} does not exist in Figma`]
        : types.get(value.alias) !== type
          ? [`${name}: alias ${value.alias} has a different type`]
          : []
      : type === "COLOR" && !HEX.test(String(value))
        ? [`${name}: "${value}" is not a hex color`]
        : type === "FLOAT" && !Number.isFinite(value)
          ? [`${name}: "${value}" is not a number`]
          : [],
  ),
];

const TEXT_STYLE_TYPES: Record<string, FigmaVariable["type"]> = {
  fontFamily: "STRING",
  fontSize: "FLOAT",
  lineHeight: "FLOAT",
  fontWeight: "FLOAT",
};

export const validateFigma = ({ collections, effectStyles, textStyles }: FigmaPayload) => {
  const variables = collections.flatMap(({ variables }) => variables);
  const types = new Map(variables.map(({ name, type }) => [name, type]));
  return [
    ...duplicates(variables.map(({ name }) => name)).map(name => `${name}: defined more than once in Figma`),
    ...collections.flatMap(collection => collection.variables.flatMap(variable => variableErrors(types, collection, variable))),
    ...effectStyles.flatMap(({ name, effects }) =>
      effects
        .filter(({ color }) => types.get(color.alias) !== "COLOR")
        .map(({ color }) => `${name}: effect color ${color.alias} is not a color variable`),
    ),
    ...textStyles.flatMap(({ name, ...properties }) =>
      Object.entries(properties)
        .filter(([property, { alias }]) => types.get(alias) !== TEXT_STYLE_TYPES[property])
        .map(([property, { alias }]) => `${name}: ${property} ${alias} is not a ${TEXT_STYLE_TYPES[property]} variable`),
    ),
  ];
};

// [field, check, rule] for the numeric seeds; ranges keep the derived scales usable
const NUMERIC_SEEDS: [keyof Theme, (value: number) => boolean, string][] = [
  ["radius", value => Number.isInteger(value) && value >= 0 && value <= 12, "an integer between 0 and 12"],
  ["space", value => value >= 3 && value <= 6, "between 3 and 6"],
  ["fontSize", value => Number.isInteger(value) && value >= 12 && value <= 20, "an integer between 12 and 20"],
];

/** Checks a theme seed file before anything is derived from it. */
type ThemeInput = { colors?: Record<string, string | undefined>; background?: string; text?: string; [seed: string]: unknown };

export const validateTheme = ({ colors = {}, background, text, ...numbers }: ThemeInput) => [
  ...INTENTS.filter(key => !HEX.test(colors[key]?.toLowerCase() ?? "")).map(
    key => `seed colors.${key}: "${colors[key]}" is not a hex color`,
  ),
  ...Object.keys(colors)
    .filter(key => !INTENTS.includes(key))
    .map(key => `seed colors.${key}: unknown seed`),
  ...Object.entries({ background, text })
    .filter(([, value]) => value !== undefined && !HEX.test(value.toLowerCase()))
    .map(([key, value]) => `seed ${key}: "${value}" is not a hex color`),
  ...NUMERIC_SEEDS.filter(([key, check]) => typeof numbers[key] !== "number" || !check(numbers[key])).map(
    ([key, , rule]) => `seed ${key}: ${String(numbers[key])} must be ${rule}`,
  ),
];
