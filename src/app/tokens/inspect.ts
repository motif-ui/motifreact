/** Inspector yardımcıları: elemandan recipe'ye, recipe'den token zincirine, tokendan gerçek renge. */
import { RECIPE_MAP, STATES, type Recipe } from "./recipes";
import { type Token, isColorToken } from "./theme";

export type TokenMap = Map<string, Token>;

export type ChainNode = {
  name: string;
  /** "theme" ya da tokenı ezen bağlamın recipe id'si (örn. surface/brand) */
  source: string;
  token?: Token;
  expr: string;
  activeBranch?: "light" | "dark";
  children: ChainNode[];
};

const VAR_REF = /var\((--[\w-]+)\)/g;
export const varRefs = (expr: string) => [...new Set([...expr.matchAll(VAR_REF)].map(([, name]) => name))];

export const recipeIdOf = (el: Element) => {
  const { recipe, surface } = (el as HTMLElement).dataset;
  return recipe ?? (surface && `surface/${surface}`) ?? (el.hasAttribute("data-tk-root") ? "surface/canvas" : undefined);
};

export const recipeOf = (el: Element): Recipe | undefined => {
  const id = recipeIdOf(el);
  return id ? RECIPE_MAP.get(id) : undefined;
};

export const findInspectable = (target: EventTarget | null) => {
  const el = target instanceof Element ? target.closest("[data-recipe], [data-surface], [data-token]") : null;
  return el && !el.closest("[data-tk-chrome]") ? (el as HTMLElement) : null;
};

export const schemeOf = (el: Element): "light" | "dark" => (getComputedStyle(el).colorScheme.includes("dark") ? "dark" : "light");

/** Token'ın `start` elemanında hangi tanımdan geldiğini bulur: en yakın bağlam override'ı ya da tema. */
const lookup = (name: string, start: Element | null, root: Element): { expr?: string; at: Element; source: string } => {
  const id = start ? recipeIdOf(start) : undefined;
  const override = id ? RECIPE_MAP.get(id)?.states.base?.[name] : undefined;
  return override
    ? { expr: override, at: start as Element, source: id as string }
    : !start || start === root
      ? { at: root, source: "theme" }
      : lookup(name, start.parentElement, root);
};

export const buildChain = (
  name: string,
  start: Element,
  root: Element,
  tokens: TokenMap,
  scheme: "light" | "dark",
  depth = 0,
): ChainNode => {
  const { expr: overrideExpr, at, source } = lookup(name, start, root);
  const token = tokens.get(name);
  const hasDark = !overrideExpr && token?.dark !== undefined && token.dark !== token.light;
  const activeBranch = hasDark ? scheme : undefined;
  const expr = overrideExpr ?? (activeBranch === "dark" ? token?.dark : token?.light) ?? "";
  const children = depth > 8 ? [] : varRefs(expr).map(ref => buildChain(ref, at, root, tokens, scheme, depth + 1));
  return { name, source, token, expr, activeBranch, children };
};

/* ------------------------------ Gerçek değer ------------------------------ */

const VOID_TAGS = new Set(["INPUT", "SELECT", "TEXTAREA", "HR", "IMG"]);

export const resolveToken = (name: string, el: Element) => {
  const host = VOID_TAGS.has(el.tagName) ? (el.parentElement ?? el) : el;
  const probe = document.createElement("span");
  const isSize = name.includes("-size-") && !name.includes("seed-family");
  probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;display:block;";
  isColorToken(name) && probe.style.setProperty("color", `var(${name})`);
  isSize && probe.style.setProperty("width", `var(${name})`);
  host.appendChild(probe);
  const style = getComputedStyle(probe);
  const value = isColorToken(name) ? style.color : isSize ? style.width : style.getPropertyValue(name).trim();
  probe.remove();
  return value;
};

/* -------------------------------- Kontrast -------------------------------- */

type Rgba = [number, number, number, number];

const getCanvasContext = (() => {
  const holder: { ctx?: CanvasRenderingContext2D | null } = {};
  return () => {
    holder.ctx =
      holder.ctx ?? Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true });
    return holder.ctx;
  };
})();

const toRgba = (css: string): Rgba => {
  const ctx = getCanvasContext();
  ctx?.clearRect(0, 0, 1, 1);
  ctx && (ctx.fillStyle = css);
  ctx?.fillRect(0, 0, 1, 1);
  const data = ctx?.getImageData(0, 0, 1, 1).data ?? [0, 0, 0, 0];
  return [data[0], data[1], data[2], data[3] / 255];
};

const over = ([r, g, b, a]: Rgba, [br, bg, bb]: Rgba): Rgba => [r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb * (1 - a), 1];

const backgroundLayers = (el: Element | null): Rgba[] => {
  const layer = el ? toRgba(getComputedStyle(el).backgroundColor) : ([255, 255, 255, 1] as Rgba);
  return !el || layer[3] >= 1
    ? [layer]
    : layer[3] > 0
      ? [layer, ...backgroundLayers(el.parentElement)]
      : backgroundLayers(el.parentElement);
};

const luminance = ([r, g, b]: Rgba) => {
  const [lr, lg, lb] = [r, g, b].map(channel => channel / 255).map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
};

export const contrastOf = (el: Element) => {
  const layers = backgroundLayers(el);
  const background = layers.reduceRight<Rgba>((below, layer) => over(layer, below), [255, 255, 255, 1]);
  const text = over(toRgba(getComputedStyle(el).color), background);
  const [light, dark] = [luminance(text), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
};

/* --------------------------- Ters arama (token → eleman) --------------------------- */

export const recipeTokenRefs = (recipe: Recipe) =>
  new Set(STATES.flatMap(state => Object.values(recipe.states[state] ?? {}).flatMap(value => varRefs(value))));

/** `name` tokenına doğrudan ya da dolaylı bağlı tüm tokenlar (kendisi dahil). */
export const dependentsOf = (name: string, tokens: TokenMap) => {
  const dependsOn = (candidate: string, seen: Set<string>): boolean => {
    const token = tokens.get(candidate);
    const refs = token ? varRefs(`${token.light} ${token.dark ?? ""}`) : [];
    return candidate === name || refs.some(ref => !seen.has(ref) && dependsOn(ref, new Set([...seen, ref])));
  };
  return new Set([...tokens.keys()].filter(candidate => dependsOn(candidate, new Set([candidate]))));
};
