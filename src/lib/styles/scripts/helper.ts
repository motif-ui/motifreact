import * as path from "path";
import type { RuleSetUseItem, RuleSetRule, Configuration } from "webpack";
import { UseItemObject } from "./types";
import { isObj, hasOwn } from "../../../utils/utils";
const DEFAULT_CLASSNAME_PREFIX = "mtf-";

/** Convert Windows backslashes to POSIX-style forward slashes */
const toPosix = (p: string): string => p.replace(/\\/g, "/");

/**
 * Normalize a resource path relative to an optional root directory.
 * - If rootDir is provided → returns a relative POSIX path.
 * - If not provided → returns the absolute POSIX path.
 * Preserves the original case of the file name (important for accurate module naming).
 */
export const normalizeResource = (resourcePath: string, rootDir?: string): string => {
  const abs = path.resolve(resourcePath);
  const rel = rootDir ? path.relative(rootDir, abs) : abs;
  return toPosix(rel);
};

/**
 * Extract a simplified "module name" from a file path.
 * e.g. "/src/components/Button.module.scss" → "Button"
 */
const getModuleNameFromPath = (resourcePath: string): string => path.basename(resourcePath).replace(/(\.module)?\.(scss|css)$/i, "");

/**
 * Generate a standardized, scoped CSS class name.
 * Root class: mtf-[module]
 * Nested class: mtf-[module]--[local]
 */
export const generateScopedCSSClassName = (localClassName: string, moduleFilePath: string): string => {
  const moduleName = getModuleNameFromPath(moduleFilePath);
  return localClassName === "Root"
    ? `${DEFAULT_CLASSNAME_PREFIX}${moduleName}`
    : `${DEFAULT_CLASSNAME_PREFIX}${moduleName}--${localClassName}`;
};

/**
 * Retrieve resourcePath from css-loader's context object safely.
 * Works across different Webpack versions and avoids unsafe type assertions.
 */
export const getResourcePath = (ctx: unknown): string | undefined => {
  if (!isObj(ctx)) return;
  if (typeof ctx.resourcePath === "string") return ctx.resourcePath;
  if (isObj(ctx._module) && typeof ctx._module.resource === "string") return ctx._module.resource;
  if (typeof ctx.rootContext === "string") return ctx.rootContext;
};

/** Ensure the given value is a use-item object */
const isUseItemObject = (u: RuleSetUseItem): u is UseItemObject => !!u && typeof u === "object" && !Array.isArray(u);

/** Filter out invalid "use" entries (e.g., falsy or numbers) and keeps only string, function, or object values. */
const isValidUseItem = (v: unknown): v is RuleSetUseItem => v != null && ["string", "function", "object"].includes(typeof v);

/** Check if a RuleSetUseItem is a css-loader instance */
export const isCSSLoader = (u: RuleSetUseItem): u is UseItemObject =>
  isUseItemObject(u) && typeof u.loader === "string" && u.loader.includes("css-loader");

/** Check if the loader context has a "rootContext" string property */
export const hasRootContext = (ctx: unknown) => typeof (ctx as Record<string, unknown>)["rootContext"] === "string";

/** Check if a rule has a "use" property */
export const hasUse = (r: RuleSetRule): r is RuleSetRule & { use: RuleSetUseItem | RuleSetUseItem[] } =>
  hasOwn(r, "use") && (r as { use?: unknown }).use !== undefined;

/** Check if a rule has a "oneOf" array (nested rules) */
export const hasOneOf = (r: RuleSetRule): r is RuleSetRule & { oneOf: RuleSetRule[] } =>
  hasOwn(r, "oneOf") && Array.isArray((r as { oneOf?: unknown }).oneOf);

/** Check if a rule has a "rules" array (nested rules) */
export const hasRules = (r: RuleSetRule): r is RuleSetRule & { rules: RuleSetRule[] } =>
  hasOwn(r, "rules") && Array.isArray((r as { rules?: unknown }).rules);

/** Extracts RuleSetRule[] safely without direct casting */
export const extractRules = (cfg: Configuration): RuleSetRule[] =>
  Array.isArray(cfg.module?.rules) ? cfg.module.rules.filter(isRule) : [];

/** Confirm that a value is a valid Webpack rule object */
export const isRule = (x: unknown): x is RuleSetRule => isObj(x);

/** Normalize any "use" entry into an array for easier iteration */
export const toUseArray = (use?: RuleSetUseItem | RuleSetUseItem[]): RuleSetUseItem[] =>
  !use ? [] : (Array.isArray(use) ? use : [use]).filter(isValidUseItem);
