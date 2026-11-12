/**
 * Element "recipe"leri: hangi HTML elemanının hangi parçası/durumu hangi SEMANTIC tokenı kullanıyor.
 * Component seviyesinde token YOK — her değer doğrudan `--theme-*` semantic tokenına bağlanır.
 * Aynı veri hem CSS'i üretir hem de inspector'ın gösterdiği eşleşmeyi.
 */
import { CHROMATIC, INTENTS, type Intent, derivedNeutralTokens, tokenValue, v } from "./theme";

export type Decls = Record<string, string>;
export const STATES = ["base", "hover", "active", "focus", "placeholder", "disabled"] as const;
export type StateKey = (typeof STATES)[number];
export type Recipe = { id: string; label: string; selector?: string; states: Partial<Record<StateKey, Decls>>; note?: string };

const c = (name: string) => v(`--theme-color-${name}`);
const size = (name: string) => v(`--theme-size-${name}`);
const type = (name: string) => v(`--theme-typography-${name}`);

/* --------------------------------- Surface --------------------------------- */

const surface = (name: string, surfaceToken: string, extra: Decls = {}, note?: string): Recipe => ({
  id: `surface/${name}`,
  label: `Surface · ${name}`,
  selector: `[data-tk-root] [data-surface="${name}"]`,
  states: {
    base: {
      "background-color": c(surfaceToken),
      color: c("text-default"),
      "--theme-color-surface-current": c(surfaceToken),
      ...extra,
    },
  },
  note,
});

const brandContrast = v("--theme-color-palette-primary-contrast");
const brandSeed = v("--theme-color-seed-primary");
const brandMix = (percent: number) => `color-mix(in oklch, ${brandContrast} ${percent}%, transparent)`;

const surfaces: Recipe[] = [
  {
    ...surface("canvas", "surface-canvas"),
    selector: `[data-tk-root], [data-tk-root] [data-surface="canvas"]`,
    states: {
      base: {
        "background-color": c("surface-canvas"),
        color: c("text-default"),
        "--theme-color-surface-current": c("surface-canvas"),
        "font-family": type("family-base"),
        "font-size": type("size-md"),
        "line-height": type("line-height-normal"),
      },
    },
  },
  surface("default", "surface-default", { border: `1px solid ${c("border-subtle")}`, "border-radius": size("radius-lg") }),
  surface("raised", "surface-raised", { "box-shadow": v("--theme-shadow-raised"), "border-radius": size("radius-lg") }),
  surface("sunken", "surface-sunken", { "border-radius": size("radius-lg") }),
  surface(
    "inverse",
    "surface-default",
    { "border-radius": size("radius-lg") },
    "color-scheme'i ters çevirir; surface-default ve tüm tokenlar karşı moddan çözülür.",
  ),
  surface(
    "brand",
    "surface-brand",
    {
      "border-radius": size("radius-lg"),
      "color-scheme": v("--theme-color-scheme-brand"),
      "--theme-color-text-default": brandContrast,
      ...Object.fromEntries(derivedNeutralTokens().map(token => [token.name, tokenValue(token)])),
      "--theme-color-primary-solid": brandContrast,
      "--theme-color-primary-solid-hover": `color-mix(in oklch, ${brandContrast} 88%, ${brandSeed})`,
      "--theme-color-primary-solid-active": `color-mix(in oklch, ${brandContrast} 76%, ${brandSeed})`,
      "--theme-color-on-primary": brandSeed,
      "--theme-color-primary-soft": brandMix(14),
      "--theme-color-primary-soft-hover": brandMix(22),
      "--theme-color-primary-text": brandContrast,
      "--theme-color-primary-border": brandMix(60),
      "--theme-color-focus-ring": brandContrast,
    },
    "Renkli zemin: text-default'u primary'nin kontrast rengine çevirir, alfa nötrleri yeniden türetir, primary intent'i tersler.",
  ),
];

/* --------------------------------- Button --------------------------------- */

export const BUTTON_VARIANTS = ["solid", "soft", "outline", "ghost"] as const;
type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

const buttonShape: Decls = {
  display: "inline-flex",
  "align-items": "center",
  "justify-content": "center",
  gap: size("space-2"),
  height: size("control-md"),
  padding: `0 ${size("space-4")}`,
  "border-radius": size("radius-md"),
  border: "1px solid transparent",
  "font-family": "inherit",
  "font-size": type("size-md"),
  "font-weight": type("weight-medium"),
  cursor: "pointer",
  "white-space": "nowrap",
  transition: "background-color .12s, color .12s, border-color .12s",
};

const focusRing: Decls = { outline: `2px solid ${c("focus-ring")}`, "outline-offset": "2px" };

const buttonColors: Record<ButtonVariant, (intent: Intent) => Partial<Record<StateKey, Decls>>> = {
  solid: intent => ({
    base: { "background-color": c(`${intent}-solid`), color: c(`on-${intent}`) },
    hover: { "background-color": c(`${intent}-solid-hover`) },
    active: { "background-color": c(`${intent}-solid-active`) },
    disabled: { "background-color": c("surface-disabled"), color: c("text-disabled") },
  }),
  soft: intent => ({
    base: { "background-color": c(`${intent}-soft`), color: c(`${intent}-text`) },
    hover: { "background-color": c(`${intent}-soft-hover`) },
    active: { "background-color": c(`${intent}-soft-hover`) },
    disabled: { "background-color": c("surface-disabled"), color: c("text-disabled") },
  }),
  outline: intent => ({
    base: { "background-color": "transparent", color: c(`${intent}-text`), "border-color": c(`${intent}-border`) },
    hover: { "background-color": c("state-hover") },
    active: { "background-color": c("state-active") },
    disabled: { "background-color": "transparent", color: c("text-disabled"), "border-color": c("border-disabled") },
  }),
  ghost: intent => ({
    base: { "background-color": "transparent", color: c(`${intent}-text`) },
    hover: { "background-color": c("state-hover") },
    active: { "background-color": c("state-active") },
    disabled: { "background-color": "transparent", color: c("text-disabled") },
  }),
};

const buttons: Recipe[] = BUTTON_VARIANTS.flatMap(variant =>
  INTENTS.map(intent => {
    const { base, ...rest } = buttonColors[variant](intent);
    return {
      id: `btn/${variant}/${intent}`,
      label: `Button · ${variant} · ${intent}`,
      states: { base: { ...buttonShape, ...base }, focus: focusRing, ...rest, disabled: { ...rest.disabled, cursor: "not-allowed" } },
    };
  }),
);

/* ------------------------------ Form elemanları ------------------------------ */

const fieldShape = (ringToken: string, ringSoftToken: string, borderToken: string): Recipe["states"] => ({
  base: {
    height: size("control-md"),
    padding: `0 ${size("space-3")}`,
    "border-radius": size("radius-md"),
    border: `1px solid ${c(borderToken)}`,
    "background-color": c("surface-field"),
    color: c("text-default"),
    "font-family": "inherit",
    "font-size": type("size-md"),
    outline: "none",
    "min-width": "0",
  },
  placeholder: { color: c("text-subtle") },
  hover: { "border-color": c(borderToken === "border-default" ? "border-strong" : borderToken) },
  focus: { "border-color": c(ringToken), "box-shadow": `0 0 0 3px ${c(ringSoftToken)}` },
  disabled: {
    "background-color": c("surface-disabled"),
    color: c("text-disabled"),
    "border-color": c("border-disabled"),
    cursor: "not-allowed",
  },
});

const forms: Recipe[] = [
  { id: "field", label: "Field (input / select / textarea)", states: fieldShape("focus-ring", "focus-ring-soft", "border-default") },
  { id: "field/invalid", label: "Field · invalid", states: fieldShape("danger-border", "danger-soft", "danger-border") },
  {
    id: "check",
    label: "Checkbox / radio (native)",
    states: { base: { "accent-color": c("primary-solid"), width: "16px", height: "16px", margin: "0" } },
    note: "Native kontrol: accent-color + color-scheme yetiyor.",
  },
  {
    id: "label",
    label: "Label",
    states: { base: { color: c("text-default"), "font-size": type("size-sm"), "font-weight": type("weight-medium") } },
  },
  { id: "help", label: "Yardım metni", states: { base: { color: c("text-muted"), "font-size": type("size-xs") } } },
  { id: "help/danger", label: "Hata metni", states: { base: { color: c("danger-text"), "font-size": type("size-xs") } } },
];

/* ---------------------------------- Metin ---------------------------------- */

const texts: Recipe[] = [
  {
    id: "heading",
    label: "Başlık",
    states: {
      base: {
        color: c("text-default"),
        "font-size": type("size-lg"),
        "font-weight": type("weight-semibold"),
        "line-height": type("line-height-tight"),
        margin: "0",
      },
    },
  },
  ...(["default", "muted", "subtle", "disabled"] as const).map(level => ({
    id: `text/${level}`,
    label: `Metin · ${level}`,
    states: { base: { color: c(`text-${level}`), margin: "0" } },
  })),
  {
    id: "link",
    label: "Link",
    states: {
      base: {
        color: c("primary-text"),
        "text-decoration": "underline",
        "text-underline-offset": "3px",
        "text-decoration-color": "color-mix(in oklch, currentColor 40%, transparent)",
      },
      hover: { "text-decoration-color": "currentColor" },
      focus: { ...focusRing, "border-radius": size("radius-sm") },
    },
  },
  {
    id: "code",
    label: "Inline code",
    states: {
      base: {
        "background-color": c("surface-subtle"),
        color: c("text-default"),
        border: `1px solid ${c("border-subtle")}`,
        "border-radius": size("radius-sm"),
        padding: "1px 5px",
        "font-family": type("family-mono"),
        "font-size": type("size-xs"),
      },
    },
  },
  {
    id: "divider",
    label: "Divider (hr)",
    states: { base: { border: "none", "border-top": `1px solid ${c("border-subtle")}`, margin: "0", width: "100%" } },
  },
];

/* ------------------------------ Badge / Alert ------------------------------ */

const badgeShape: Decls = {
  display: "inline-flex",
  "align-items": "center",
  gap: size("space-1"),
  height: "22px",
  padding: `0 ${size("space-2")}`,
  "border-radius": size("radius-full"),
  "font-size": type("size-xs"),
  "font-weight": type("weight-medium"),
  border: "1px solid transparent",
};

const badges: Recipe[] = INTENTS.flatMap(intent => [
  {
    id: `badge/soft/${intent}`,
    label: `Badge · soft · ${intent}`,
    states: { base: { ...badgeShape, "background-color": c(`${intent}-soft`), color: c(`${intent}-text`) } },
  },
  {
    id: `badge/solid/${intent}`,
    label: `Badge · solid · ${intent}`,
    states: { base: { ...badgeShape, "background-color": c(`${intent}-solid`), color: c(`on-${intent}`) } },
  },
  {
    id: `badge/outline/${intent}`,
    label: `Badge · outline · ${intent}`,
    states: {
      base: { ...badgeShape, "background-color": "transparent", color: c(`${intent}-text`), "border-color": c(`${intent}-border`) },
    },
  },
]);

const alerts: Recipe[] = INTENTS.flatMap((intent): Recipe[] => [
  {
    id: `alert/${intent}`,
    label: `Alert · ${intent}`,
    states: {
      base: {
        display: "flex",
        "flex-direction": "column",
        gap: size("space-1"),
        padding: `${size("space-3")} ${size("space-4")}`,
        "border-radius": size("radius-md"),
        "background-color": c(`${intent}-soft`),
        color: c("text-default"),
        "border-inline-start": `3px solid ${c(`${intent}-solid`)}`,
      },
    },
  },
  {
    id: `alert-title/${intent}`,
    label: `Alert başlığı · ${intent}`,
    states: { base: { color: c(`${intent}-text`), "font-weight": type("weight-semibold") } },
  },
]);

/* ---------------------------------- Tablo ---------------------------------- */

const cellPadding = `${size("space-2")} ${size("space-3")}`;

const tables: Recipe[] = [
  {
    id: "table",
    label: "Tablo",
    states: { base: { width: "100%", "border-collapse": "collapse", color: c("text-default"), "font-size": type("size-sm") } },
  },
  {
    id: "table/head-cell",
    label: "Tablo · başlık hücresi",
    states: {
      base: {
        "background-color": c("surface-subtle"),
        color: c("text-muted"),
        "font-weight": type("weight-semibold"),
        "font-size": type("size-xs"),
        "text-align": "start",
        padding: cellPadding,
        "border-bottom": `1px solid ${c("border-default")}`,
        "white-space": "nowrap",
      },
    },
  },
  {
    id: "table/cell",
    label: "Tablo · hücre",
    states: { base: { padding: cellPadding, "border-bottom": `1px solid ${c("border-subtle")}`, "vertical-align": "middle" } },
  },
  {
    id: "table/row",
    label: "Tablo · satır",
    states: { base: { "background-color": "transparent" }, hover: { "background-color": c("state-hover") } },
  },
  {
    id: "table/row-striped",
    label: "Tablo · zebra satır",
    states: { base: { "background-color": c("surface-subtle") }, hover: { "background-color": c("state-hover") } },
  },
  {
    id: "table/row-selected",
    label: "Tablo · seçili satır",
    states: { base: { "background-color": c("primary-soft") }, hover: { "background-color": c("primary-soft-hover") } },
  },
];

/* ------------------------------ Diğer örnekler ------------------------------ */

const misc: Recipe[] = [
  {
    id: "nav-item",
    label: "Navigasyon öğesi",
    states: {
      base: {
        display: "flex",
        "align-items": "center",
        gap: size("space-2"),
        height: size("control-md"),
        padding: `0 ${size("space-3")}`,
        "border-radius": size("radius-md"),
        color: c("text-muted"),
        "background-color": "transparent",
        border: "none",
        "font-family": "inherit",
        "font-size": type("size-md"),
        "text-align": "start",
        width: "100%",
        cursor: "pointer",
      },
      hover: { "background-color": c("state-hover"), color: c("text-default") },
      focus: focusRing,
    },
  },
  {
    id: "nav-item/selected",
    label: "Navigasyon öğesi · seçili",
    states: {
      base: {
        display: "flex",
        "align-items": "center",
        gap: size("space-2"),
        height: size("control-md"),
        padding: `0 ${size("space-3")}`,
        "border-radius": size("radius-md"),
        color: c("text-default"),
        "background-color": c("neutral-soft"),
        "font-weight": type("weight-medium"),
        border: "none",
        "font-family": "inherit",
        "font-size": type("size-md"),
        width: "100%",
        cursor: "pointer",
      },
      focus: focusRing,
    },
  },
  ...CHROMATIC.map(intent => ({
    id: `avatar/${intent}`,
    label: `Avatar · ${intent}`,
    states: {
      base: {
        display: "inline-grid",
        "place-items": "center",
        width: "32px",
        height: "32px",
        "border-radius": size("radius-full"),
        "background-color": c(`${intent}-solid`),
        color: c(`on-${intent}`),
        "font-size": type("size-xs"),
        "font-weight": type("weight-semibold"),
        border: `2px solid ${c("surface-current")}`,
      },
    },
    note: "Halka rengi surface-current: hangi zemindeyse o rengi alır, üst üste binen avatarları ayırır.",
  })),
  {
    id: "progress/track",
    label: "Progress · iz",
    states: { base: { height: "6px", "border-radius": size("radius-full"), "background-color": c("neutral-soft"), overflow: "hidden" } },
  },
  {
    id: "progress/bar",
    label: "Progress · dolu kısım",
    states: { base: { height: "100%", "border-radius": "inherit", "background-color": c("primary-solid") } },
  },
];

export const RECIPES: Recipe[] = [...surfaces, ...buttons, ...forms, ...texts, ...badges, ...alerts, ...tables, ...misc];
export const RECIPE_MAP = new Map(RECIPES.map(recipe => [recipe.id, recipe]));

/* ------------------------------- CSS üretimi ------------------------------- */

const STATE_SELECTOR: Record<StateKey, (selector: string) => string> = {
  base: selector => selector,
  hover: selector => `${selector}:hover:not(:disabled, [aria-disabled="true"]), ${selector}[data-force="hover"]`,
  active: selector => `${selector}:active:not(:disabled, [aria-disabled="true"]), ${selector}[data-force="active"]`,
  focus: selector => `${selector}:focus-visible, ${selector}[data-force="focus"]`,
  placeholder: selector => `${selector}::placeholder`,
  disabled: selector => `${selector}:disabled, ${selector}[aria-disabled="true"]`,
};

const recipeSelector = ({ id, selector }: Recipe) => selector ?? `[data-tk-root] [data-recipe="${id}"]`;

const STRUCTURAL_CSS = `
[data-tk-root] textarea[data-recipe^="field"] { height: auto; min-height: 72px; padding-block: 8px; resize: vertical; }
[data-tk-root] [data-size="sm"] { height: var(--theme-size-control-sm); padding-inline: var(--theme-size-space-3); font-size: var(--theme-typography-size-sm); }
[data-tk-root] [data-size="icon"] { height: var(--theme-size-control-sm); width: var(--theme-size-control-sm); padding: 0; }
`;

export const buildRecipeCss = () =>
  RECIPES.flatMap(recipe =>
    STATES.filter(key => recipe.states[key]).map(key => {
      const body = Object.entries(recipe.states[key] ?? {})
        .map(([prop, value]) => `  ${prop}: ${value};`)
        .join("\n");
      return `${STATE_SELECTOR[key](recipeSelector(recipe))} {\n${body}\n}`;
    }),
  )
    .join("\n")
    .concat(STRUCTURAL_CSS);
