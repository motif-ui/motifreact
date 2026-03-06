import type { Configuration, RuleSetRule } from "webpack";
import { CSSLoaderOptions, CSSModulesObject, UseItemObject } from "./types";
import {
  extractRules,
  generateScopedCSSClassName,
  getResourcePath,
  hasOneOf,
  hasRootContext,
  hasRules,
  hasUse,
  isCSSLoader,
  isRule,
  normalizeResource,
  toUseArray,
} from "./helper";
import { isObj } from "../../../utils/utils";

/**
 * Recursively traverse Webpack rules to locate all css-loader entries and handles nested structures (oneOf, rules) safely.
 */
const collectCSSLoaders = (rules?: RuleSetRule[]) => {
  const found: UseItemObject[] = [];

  const visit = (rule: RuleSetRule) => {
    hasOneOf(rule) && rule.oneOf.filter(isRule).forEach(visit);
    hasRules(rule) && rule.rules.filter(isRule).forEach(visit);
    hasUse(rule) && toUseArray(rule.use).forEach(u => isCSSLoader(u) && found.push(u));
  };
  Array.isArray(rules) && rules.filter(isRule).forEach(visit);
  return found;
};

/**
 * Modifies a given Webpack configuration to ensure consistent and deterministic CSS class naming across environments
 * and OS types. Replaces css-loader’s getLocalIdent with a project-specific implementation.
 */
export const applyCustomCSSModuleNaming = (config: Configuration, opts: { rootDir?: string } = {}) => {
  const rules = extractRules(config);

  if (!rules.length) return config;

  const cssLoaders = collectCSSLoaders(rules);

  // Modify each css-loader instance to use the project’s scoped naming scheme
  for (const loader of cssLoaders) {
    const options: CSSLoaderOptions = loader.options ?? {};
    const { modules } = options;

    // Only adjust loaders where CSS Modules are actually enabled
    if (!modules) {
      loader.options = options;
      continue;
    }

    // Clone existing modules config or create a new one
    const modulesObj: CSSModulesObject = typeof modules === "object" ? { ...modules } : {};

    // Replace css-loader's internal name generator with our scoped one
    modulesObj.getLocalIdent = (ctx, _tpl, localName) => {
      const rp = getResourcePath(ctx);

      const ctxRoot = isObj(ctx) && hasRootContext(ctx) ? (ctx as Record<string, string>)["rootContext"] : undefined;
      const baseRoot = opts.rootDir ?? ctxRoot;

      const normalized = rp ? normalizeResource(rp, baseRoot) : localName; // graceful fallback
      return generateScopedCSSClassName(localName, normalized);
    };

    // Remove template string pattern to avoid conflicts with getLocalIdent
    if ("localIdentName" in modulesObj) {
      modulesObj.localIdentName = undefined;
    }

    options.modules = modulesObj;
    loader.options = options;
  }

  return config;
};
