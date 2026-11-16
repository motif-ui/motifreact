/**
 * Token hiyerarşisi (3 katman):
 *
 *   1. SEED      → kullanıcının verdiği birkaç değer (renk, radius, space, font-size)
 *   2. PALETTE   → seed'lerden otomatik üretilen skala (oklch relative color). Componentler KULLANMAZ.
 *   3. SEMANTIC  → role göre isimlenmiş tokenlar (surface, text, border, intent × emphasis). Componentler SADECE bunu kullanır.
 *
 * Light / dark tek tanımda `light-dark()` ile tutulur; hangi tarafın seçileceğine tüketen elemanın
 * `color-scheme` değeri karar verir. Böylece `data-surface="inverse"` gibi bir bağlam sadece
 * color-scheme'i çevirerek altındaki her şeyi doğru renge geçirir.
 */

export const INTENTS = ["primary", "accent", "neutral", "danger", "warning", "success"] as const;
export type Intent = (typeof INTENTS)[number];

export const CHROMATIC = ["primary", "accent", "danger", "warning", "success"] as const;
type Chromatic = (typeof CHROMATIC)[number];

export type ColorSeedKey = Chromatic | "neutral";
export const COLOR_SEEDS: ColorSeedKey[] = ["primary", "accent", "neutral", "danger", "warning", "success"];

export type Seeds = Record<ColorSeedKey, string> & { radius: number; space: number; fontSize: number };

export const DEFAULT_SEEDS: Seeds = {
  primary: "#4888fb",
  accent: "#ff630f",
  neutral: "#64748b",
  danger: "#e5484d",
  warning: "#ffdb00",
  success: "#2f9e5f",
  radius: 8,
  space: 4,
  fontSize: 14,
};

export const PRESETS: { name: string; seeds: Partial<Seeds> }[] = [
  { name: "Motif", seeds: { primary: "#4888fb", accent: "#ff630f", neutral: "#64748b" } },
  { name: "Orman", seeds: { primary: "#2f7d55", accent: "#d69e2e", neutral: "#5f6b62" } },
  { name: "Üzüm", seeds: { primary: "#7c3aed", accent: "#ec4899", neutral: "#6b6880" } },
  { name: "Mono", seeds: { primary: "#18181b", accent: "#6366f1", neutral: "#71717a" } },
  { name: "Limon", seeds: { primary: "#e8d44d", accent: "#0ea5e9", neutral: "#78716c" } },
];

export type Layer = "seed" | "palette" | "semantic";
export type Token = { name: string; layer: Layer; group: string; light: string; dark?: string; note?: string };

export const v = (name: string) => `var(${name})`;
const mix = (color: string, percent: number) => `color-mix(in oklch, ${color} ${percent}%, transparent)`;

const seedName = (key: ColorSeedKey) => `--theme-color-seed-${key}`;
const paletteName = (key: ColorSeedKey, step: number | string) => `--theme-color-palette-${key}-${step}`;
const n = (step: number) => v(paletteName("neutral", step));

// [step, lightness, chroma çarpanı]. Lightness sabit → her seed'den aynı "parlaklık ritminde" skala çıkar.
const INTENT_STEPS = [
  [50, 0.97, 0.14],
  [100, 0.935, 0.28],
  [200, 0.88, 0.48],
  [300, 0.81, 0.68],
  [400, 0.73, 0.86],
  [500, 0.65, 1],
  [600, 0.57, 1],
  [700, 0.49, 0.92],
  [800, 0.41, 0.8],
  [900, 0.33, 0.66],
  [950, 0.26, 0.52],
] as const;

const NEUTRAL_STEPS = [
  [0, 1, 0],
  [50, 0.975, 0.3],
  [100, 0.95, 0.4],
  [150, 0.925, 0.45],
  [200, 0.895, 0.5],
  [300, 0.83, 0.6],
  [400, 0.71, 0.8],
  [500, 0.57, 1],
  [600, 0.47, 1],
  [700, 0.39, 0.95],
  [800, 0.31, 0.9],
  [850, 0.27, 0.85],
  [900, 0.235, 0.8],
  [925, 0.21, 0.8],
  [950, 0.185, 0.75],
  [975, 0.16, 0.7],
  [1000, 0.13, 0.6],
] as const;

export const NEUTRAL_STEP_LIST = NEUTRAL_STEPS.map(([step]) => step);
export const INTENT_STEP_LIST = INTENT_STEPS.map(([step]) => step);

/** Verilen lightness ifadesine göre siyah ya da beyaz döner (eşik: oklch L 0.66). */
const contrastExpr = (seed: string, lightness: string) =>
  `oklch(from ${seed} calc(0.16 + clamp(0, (0.66 - ${lightness}) * 1000, 0.84)) 0 0)`;

/* ---------- JS tarafında hesaplanan tek şey: brand zemininin scheme'i ---------- */

const toLinear = (channel: number) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);

export const oklchLightness = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map(i => toLinear(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  return 0.2104542553 * Math.cbrt(l) + 0.793617785 * Math.cbrt(m) - 0.0040720468 * Math.cbrt(s);
};

export const brandScheme = (primary: string) => (oklchLightness(primary) < 0.66 ? "dark" : "light");

/* ---------------------------------- SEED ---------------------------------- */

const seedTokens = (seeds: Seeds): Token[] => [
  ...COLOR_SEEDS.map(key => ({ name: seedName(key), layer: "seed" as const, group: "Seed · renk", light: seeds[key] })),
  { name: "--theme-size-seed-radius", layer: "seed", group: "Seed · ölçü", light: `${seeds.radius}px` },
  { name: "--theme-size-seed-space", layer: "seed", group: "Seed · ölçü", light: `${seeds.space}px` },
  { name: "--theme-typography-seed-size", layer: "seed", group: "Seed · tipografi", light: `${seeds.fontSize}px` },
  { name: "--theme-typography-seed-family", layer: "seed", group: "Seed · tipografi", light: "Inter, system-ui, sans-serif" },
];

/** Root'a inline style olarak basılan değerler (seed değişince sadece bunlar değişir). */
export const seedVars = (seeds: Seeds): Record<string, string> => ({
  ...Object.fromEntries(seedTokens(seeds).map(({ name, light }) => [name, light])),
  "--theme-color-scheme-brand": brandScheme(seeds.primary),
});

/* --------------------------------- PALETTE --------------------------------- */

const intentRamp = (key: Chromatic): Token[] => [
  ...INTENT_STEPS.map(([step, lightness, chroma]) => ({
    name: paletteName(key, step),
    layer: "palette" as const,
    group: `Palette · ${key}`,
    light: `oklch(from ${v(seedName(key))} ${lightness} calc(c * ${chroma}) h)`,
  })),
  {
    name: paletteName(key, "contrast"),
    layer: "palette",
    group: `Palette · ${key}`,
    light: contrastExpr(v(seedName(key)), "l"),
    note: "Seed'in üzerinde okunacak siyah/beyaz (otomatik kontrast)",
  },
];

const neutralRamp = (): Token[] =>
  NEUTRAL_STEPS.map(([step, lightness, chroma]) => ({
    name: paletteName("neutral", step),
    layer: "palette",
    group: "Palette · neutral",
    light: `oklch(from ${v(seedName("neutral"))} ${lightness} calc(min(c, 0.04) * ${chroma}) h)`,
  }));

const generatedTokens = (seeds: Seeds): Token[] => [
  {
    name: "--theme-color-scheme-brand",
    layer: "palette",
    group: "Palette · hesaplanan",
    light: brandScheme(seeds.primary),
    note: "JS generator primary'nin parlaklığına bakıp hesaplar (CSS bunu yapamıyor)",
  },
];

/* --------------------------------- SEMANTIC --------------------------------- */

const sem =
  (group: string) =>
  (name: string, light: string, dark?: string, note?: string): Token => ({ name, layer: "semantic", group, light, dark, note });

const surface = sem("Zemin · surface");
const text = sem("Metin · text");
const border = sem("Border");
const state = sem("Durum");

const TEXT = v("--theme-color-text-default");

/**
 * text-default'tan alfa ile türeyen nötr tokenlar. Opak gri yerine "yazı renginin şeffaf hali"
 * oldukları için hangi zeminde durursa dursun uyum sağlarlar. Rengi farklı bağlamlar (brand)
 * text-default'u ezip bu listeyi yeniden tanımlar.
 */
export const derivedNeutralTokens = (): Token[] => [
  text("--theme-color-text-muted", mix(TEXT, 72)),
  text("--theme-color-text-subtle", mix(TEXT, 52)),
  text("--theme-color-text-disabled", mix(TEXT, 34)),
  border("--theme-color-border-subtle", mix(TEXT, 10)),
  border("--theme-color-border-default", mix(TEXT, 18)),
  border("--theme-color-border-strong", mix(TEXT, 36)),
  border("--theme-color-border-disabled", mix(TEXT, 10)),
  surface("--theme-color-surface-subtle", mix(TEXT, 4), undefined, "Zebra satır, tablo başlığı vb. — her zeminde çalışır"),
  surface("--theme-color-surface-disabled", mix(TEXT, 7)),
  surface("--theme-color-surface-field", n(0), mix(TEXT, 5), "Input zemini; dark'ta alfa"),
  sem("Intent · neutral")("--theme-color-neutral-soft", mix(TEXT, 7)),
  sem("Intent · neutral")("--theme-color-neutral-soft-hover", mix(TEXT, 12)),
  sem("Intent · neutral")("--theme-color-neutral-text", TEXT),
  sem("Intent · neutral")("--theme-color-neutral-border", v("--theme-color-border-strong")),
];

const surfaceTokens = (): Token[] => [
  surface("--theme-color-surface-canvas", n(50), n(975), "Sayfa zemini"),
  surface("--theme-color-surface-default", n(0), n(925), "Card, panel"),
  surface("--theme-color-surface-raised", n(0), n(850), "Popover, modal, dropdown"),
  surface("--theme-color-surface-sunken", n(100), n(1000), "İçe gömük alan (well)"),
  surface("--theme-color-surface-brand", v(seedName("primary")), undefined, "Marka zemini (banner, hero)"),
  surface("--theme-color-surface-current", v("--theme-color-surface-canvas"), undefined, "Bulunulan zeminin rengi; her surface bunu ezer"),
  text("--theme-color-text-default", n(950), n(50), "Yazı ve ikon rengi"),
];

const stateTokens = (): Token[] => [
  state(
    "--theme-color-state-hover",
    "color-mix(in oklch, currentColor 8%, transparent)",
    undefined,
    "Yazı renginin %8'i — her zeminde, her intent'te çalışan overlay",
  ),
  state("--theme-color-state-active", "color-mix(in oklch, currentColor 14%, transparent)"),
  state("--theme-color-focus-ring", v(paletteName("primary", 500)), v(paletteName("primary", 400))),
  state("--theme-color-focus-ring-soft", mix(v("--theme-color-focus-ring"), 30)),
];

const chromaticIntentTokens = (key: Chromatic): Token[] => {
  const seed = v(seedName(key));
  const p = (step: number) => v(paletteName(key, step));
  const t = sem(`Intent · ${key}`);
  return [
    t(`--theme-color-${key}-solid`, seed, `oklch(from ${seed} max(l, 0.6) c h)`, "Light'ta seed birebir"),
    t(`--theme-color-${key}-solid-hover`, `oklch(from ${seed} calc(l - 0.06) c h)`, `oklch(from ${seed} calc(max(l, 0.6) + 0.05) c h)`),
    t(`--theme-color-${key}-solid-active`, `oklch(from ${seed} calc(l - 0.11) c h)`, `oklch(from ${seed} calc(max(l, 0.6) + 0.09) c h)`),
    t(`--theme-color-on-${key}`, v(paletteName(key, "contrast")), contrastExpr(seed, "max(l, 0.6)"), "Solid üzerindeki yazı/ikon"),
    t(`--theme-color-${key}-soft`, mix(seed, 12), mix(seed, 22), "Alfa tint — zeminden bağımsız"),
    t(`--theme-color-${key}-soft-hover`, mix(seed, 18), mix(seed, 30)),
    t(`--theme-color-${key}-text`, p(700), p(300), "Zemin üzerinde intent renkli yazı ve ikon"),
    t(`--theme-color-${key}-border`, p(500), p(400)),
  ];
};

const neutralIntentTokens = (): Token[] => {
  const t = sem("Intent · neutral");
  return [
    t("--theme-color-neutral-solid", n(900), n(100)),
    t("--theme-color-neutral-solid-hover", n(800), n(200)),
    t("--theme-color-neutral-solid-active", n(700), n(300)),
    t("--theme-color-on-neutral", n(0), n(950)),
  ];
};

const typographyTokens = (): Token[] => {
  const t = sem("Tipografi");
  const size = (factor: number) => `calc(${v("--theme-typography-seed-size")} * ${factor})`;
  return [
    t("--theme-typography-family-base", v("--theme-typography-seed-family")),
    t("--theme-typography-family-mono", "ui-monospace, SFMono-Regular, Menlo, monospace"),
    t("--theme-typography-size-xs", size(0.857)),
    t("--theme-typography-size-sm", size(0.929)),
    t("--theme-typography-size-md", size(1)),
    t("--theme-typography-size-lg", size(1.143)),
    t("--theme-typography-size-xl", size(1.429)),
    t("--theme-typography-size-2xl", size(1.857)),
    t("--theme-typography-weight-regular", "400"),
    t("--theme-typography-weight-medium", "500"),
    t("--theme-typography-weight-semibold", "600"),
    t("--theme-typography-line-height-tight", "1.25"),
    t("--theme-typography-line-height-normal", "1.5"),
  ];
};

const sizeTokens = (): Token[] => {
  const t = sem("Ölçü");
  const radius = (factor: number) => `calc(${v("--theme-size-seed-radius")} * ${factor})`;
  const space = (factor: number) => `calc(${v("--theme-size-seed-space")} * ${factor})`;
  return [
    t("--theme-size-radius-sm", radius(0.5)),
    t("--theme-size-radius-md", radius(1)),
    t("--theme-size-radius-lg", radius(1.5)),
    t("--theme-size-radius-full", "9999px"),
    ...[1, 2, 3, 4, 5, 6, 8, 10, 12].map(step => t(`--theme-size-space-${step}`, space(step))),
    t("--theme-size-control-sm", space(7), undefined, "Button, input, select ortak yükseklik"),
    t("--theme-size-control-md", space(9)),
    t("--theme-size-control-lg", space(11)),
  ];
};

const shadowTokens = (): Token[] => {
  const t = sem("Gölge");
  return [
    t(
      "--theme-shadow-raised",
      "0 1px 2px light-dark(rgb(0 0 0 / 0.06), rgb(0 0 0 / 0.4)), 0 6px 20px light-dark(rgb(0 0 0 / 0.08), rgb(0 0 0 / 0.45))",
    ),
    t("--theme-shadow-overlay", "0 12px 40px light-dark(rgb(0 0 0 / 0.16), rgb(0 0 0 / 0.6))"),
  ];
};

export const buildTokens = (seeds: Seeds): Token[] => [
  ...seedTokens(seeds),
  ...neutralRamp(),
  ...CHROMATIC.flatMap(intentRamp),
  ...generatedTokens(seeds),
  ...surfaceTokens(),
  ...derivedNeutralTokens(),
  ...stateTokens(),
  ...CHROMATIC.flatMap(chromaticIntentTokens),
  ...neutralIntentTokens(),
  ...typographyTokens(),
  ...sizeTokens(),
  ...shadowTokens(),
];

export const tokenValue = ({ light, dark }: Token) => (dark && dark !== light ? `light-dark(${light}, ${dark})` : light);

export const isColorToken = (name: string) => name.startsWith("--theme-color-") && name !== "--theme-color-scheme-brand";

/* ------------------------------- CSS üretimi ------------------------------- */

const declarations = (tokens: Token[]) => tokens.map(token => `  ${token.name}: ${tokenValue(token)};`).join("\n");

export const buildThemeCss = (seeds: Seeds, scope = "[data-tk-root]") =>
  [
    `${scope} {\n${declarations(buildTokens(seeds))}\n}`,
    `${scope} { color-scheme: light; }`,
    `${scope}[data-mode="dark"] { color-scheme: dark; }`,
    `${scope}[data-mode="light"] [data-surface="inverse"] { color-scheme: dark; }`,
    `${scope}[data-mode="dark"] [data-surface="inverse"] { color-scheme: light; }`,
  ].join("\n\n");
