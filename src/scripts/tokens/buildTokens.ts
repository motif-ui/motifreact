import { aliasPath } from "./formats.ts";
import { BLACK, STEPS, WHITE, alphaSuffix, buildRamp, contrast, lightnessOf, withAlpha } from "./palette.ts";
import type { Dimension, Theme, Token } from "./types.ts";

export const INTENTS = ["primary", "secondary", "accent", "neutral", "info", "success", "warning", "danger"];
const WEIGHTS: [string, number][] = [
  ["lightest", 100],
  ["lighter", 200],
  ["light", 300],
  ["regular", 400],
  ["strong", 500],
  ["stronger", 600],
  ["strongest", 700],
];
// [role, font size px, line height px, weight]. Weights follow today's theme: display/body 400, heading 700, base (label) 500.
const TYPE_SCALE: [string, number, number, string][] = [
  ["display-lg", 56, 64, "regular"],
  ["display-md", 48, 56, "regular"],
  ["display-sm", 40, 48, "regular"],
  ["heading-h1", 40, 56, "strongest"],
  ["heading-h2", 32, 40, "strongest"],
  ["heading-h3", 28, 36, "strongest"],
  ["heading-h4", 24, 32, "strongest"],
  ["heading-h5", 20, 28, "strongest"],
  ["heading-h6", 16, 24, "strongest"],
  ["body-lg", 18, 24, "regular"],
  ["body-md", 16, 24, "regular"],
  ["body-sm", 14, 20, "regular"],
  ["body-xs", 12, 16, "regular"],
  ["body-xxs", 11, 16, "regular"],
  ["label-xl", 18, 24, "strong"],
  ["label-lg", 16, 24, "strong"],
  ["label-md", 14, 20, "strong"],
  ["label-sm", 12, 16, "strong"],
  ["label-xs", 11, 16, "strong"],
];
const SIZES = [
  0, 1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 38, 40, 44, 48, 52, 56, 64, 72, 80, 96, 120, 128, 160, 176, 190, 216,
  256, 266, 320, 342, 360, 400, 418, 480, 512, 720, 960,
];
// Spacing is named by its px at the default space seed, so Figma values read 1:1 (space-8 = 8px);
// the value still follows the seed (space-8 = 10px at space 5). Half-unit steps keep today's 2px, 6px and 10px paddings
const DEFAULT_SPACE = 4;
const SPACING = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 40, 48, 64];
const CONTAINERS: [string, number][] = [
  ["sm", 540],
  ["md", 720],
  ["lg", 960],
  ["xl", 1140],
];
// [level, [x, y, blur, spread] px, light alpha, dark alpha, usage]
const ELEVATION: [number, [number, number, number, number], number, number, string][] = [
  [1, [0, 2, 4, 1], 0.08, 0.32, "card"],
  [2, [0, 4, 6, 2], 0.08, 0.32, "dropdown, popover"],
  [3, [0, 6, 12, 4], 0.16, 0.64, "toast, drawer"],
  [4, [0, 8, 20, 6], 0.16, 0.64, "modal"],
];
const ROUND_PX = 999;
// Default border: the step closest to surface-default that still reaches BORDER_CONTRAST. Design chose a softer border
// than WCAG 1.4.11's 3:1 (today's input border is 2.09:1); raising the constant to 3 restores the strict rule.
const BORDER_CONTRAST = 2.4;
// Step indexes, lightest first and darkest first
const ASCENDING = [...STEPS.keys()];
const DESCENDING = [...ASCENDING].reverse();
// Alpha primitives exist only when a token references them; Figma can't put alpha on an alias, so each one is its own variable.
// The a80 steps have no semantic consumer yet; black/white keep them available (backdrop, on-media).
const ALPHA_REF = /^\{color\.palette\.(.+)-a(\d\d)\}$/;
const ALPHA_EXTRAS = ["{color.palette.black-a80}", "{color.palette.white-a80}"];
const LITERALS: Record<string, string> = { black: BLACK, white: WHITE };

export const ref = (path: string[]) => `{${path.join(".")}}`;
export const rem = (px: number): Dimension => ({ value: +(px / 16).toFixed(4), unit: "rem" });
const px = (value: number): Dimension => ({ value, unit: "px" });

/** md is the seed, sm half of it (whole px, at least 1 unless the seed is 0), lg double. */
export const radiusScale = (seed: number) => ({ sm: seed && Math.max(1, Math.round(seed / 2)), md: seed, lg: seed * 2 });

/** Type roles scale with the font size seed (16 = today's sizes); line heights stay on the 4px grid. */
export const typeSize = (fontSize: number, size: number, lineHeight: number) => ({
  size: Math.round((size * fontSize) / 16),
  lineHeight: Math.max(4, Math.round((lineHeight * fontSize) / 16 / 4) * 4),
});

/**
 * Theme seeds (src/lib/styles/tokens/themes/*.json) → flat token list. A token is `{ path, type, value, dark?, description? }`; `value` is either a literal or a DTCG alias
 * (`{color.palette.neutral.50}`), `dark` is only present when the dark mode value differs.
 */
export const buildTokens = ({ colors, background, text: textSeed, radius: radiusSeed, space, fontSize }: Theme) => {
  const ramps = Object.fromEntries(Object.entries(colors).map(([key, seed]) => [key, buildRamp(seed)]));
  const hexOf = (key: string, step: number) => ramps[key].steps[STEPS.indexOf(step)];
  const anchorOf = (key: string) => ramps[key].anchor;
  const stepAt = (index: number) => STEPS[Math.max(0, Math.min(STEPS.length - 1, index))];
  const neutral = (step: number) => hexOf("neutral", step);

  const pal = (key: string, step: number) => ref(["color", "palette", key, String(step)]);
  const palAlpha = (key: string, step: number, alpha: number) => ref(["color", "palette", key, `${step}-${alphaSuffix(alpha)}`]);
  const literalAlpha = (name: string, alpha: number) => ref(["color", "palette", `${name}-${alphaSuffix(alpha)}`]);
  const white = ref(["color", "palette", "white"]);
  const color = (path: string[], light: string, dark?: string, description?: string): Token => ({
    path: ["color", ...path],
    type: "color",
    value: light,
    ...(dark && dark !== light && { dark }),
    ...(description && { description }),
  });

  // Optional overrides: used as given, warned about rather than corrected
  const overrides = (
    [
      ["background", background],
      ["text", textSeed],
    ] as const
  ).flatMap(([name, hex]): Token[] =>
    hex ? [{ path: ["color", "palette", name], type: "color", value: hex.toLowerCase(), description: "theme seed" }] : [],
  );
  const canvas = background ? ref(["color", "palette", "background"]) : pal("neutral", 50);
  const textDefault = textSeed ? ref(["color", "palette", "text"]) : pal("neutral", 800);

  const surface = [
    color(
      ["surface", "canvas"],
      canvas,
      pal("neutral", 900),
      "page background; in dark it equals the card, border or elevation separates them",
    ),
    color(["surface", "default"], white, pal("neutral", 900), "card, panel"),
    // In dark a raised surface is one step lighter than the page, or it disappears into it (shadows barely show on dark)
    color(["surface", "raised"], white, pal("neutral", 800), "popover, dropdown, modal · dark one step above the page"),
    color(["surface", "sunken"], pal("neutral", 100), pal("neutral", 950), "well, inset area"),
    color(["surface", "subtle"], palAlpha("neutral", 950, 0.04), palAlpha("neutral", 50, 0.04), "zebra, readonly"),
    color(["surface", "field"], white, pal("neutral", 950), "input background; lighter than the page in light, darker in dark"),
    color(["surface", "disabled"], palAlpha("neutral", 950, 0.08), palAlpha("neutral", 50, 0.08), "disabled background, no intent"),
    color(["surface", "opposite"], pal("neutral", 900), pal("neutral", 50), "tooltip, dark toast"),
    color(["surface", "brand"], pal("primary", STEPS[anchorOf("primary")]), undefined, "brand band"),
  ];

  const textLevels: [string, number, number][] = [
    ["stronger", 950, 50],
    ["strong", 900, 100],
    ["default", 800, 200],
    ["soft", 700, 300],
    ["softer", 600, 400],
  ];
  const text = [
    ...textLevels.map(([level, light, dark]) =>
      color(
        ["text", level],
        level === "default" ? textDefault : pal("neutral", light),
        pal("neutral", dark),
        `${contrast(level === "default" && textSeed ? textSeed : neutral(light), WHITE)}:1 · ${contrast(neutral(dark), neutral(900))}:1`,
      ),
    ),
    color(["text", "disabled"], palAlpha("neutral", 950, 0.32), palAlpha("neutral", 50, 0.32), "a state, not a level"),
    color(["text", "on-media"], white, undefined, "on images"),
    color(["text", "on-media-soft"], literalAlpha("white", 0.64)),
  ];

  const boundary = (order: number[], surface: string) => order.find(step => contrast(neutral(step), surface) >= BORDER_CONTRAST);
  // No step reaching the contrast falls back to the far end of the ramp
  const defaultLight = boundary(STEPS, WHITE) ?? 950;
  const defaultDark = boundary([...STEPS].reverse(), neutral(900)) ?? 50;
  const strongerStep = (step: number, direction: number) => stepAt(STEPS.indexOf(step) + direction);
  const border = [
    color(["border", "soft"], palAlpha("neutral", 950, 0.16), palAlpha("neutral", 50, 0.16), "divider, table row"),
    color(
      ["border", "default"],
      pal("neutral", defaultLight),
      pal("neutral", defaultDark),
      `input and control border · ${contrast(neutral(defaultLight), WHITE)}:1 · ${contrast(neutral(defaultDark), neutral(900))}:1`,
    ),
    color(
      ["border", "strong"],
      pal("neutral", strongerStep(defaultLight, 1)),
      pal("neutral", strongerStep(defaultDark, -1)),
      "hover, emphasis",
    ),
    color(["border", "disabled"], palAlpha("neutral", 950, 0.08), palAlpha("neutral", 50, 0.08), "disabled border, not a divider"),
    color(
      ["focus-ring"],
      pal("primary", STEPS[anchorOf("primary")]),
      pal("primary", stepAt(anchorOf("primary") - 1)),
      "global, single ring",
    ),
  ];

  // Field role: input, textarea, select, date picker… share one look. Aliases of the shared tokens, so modes follow them.
  // Disabled and validation states stay on the global tokens (border-disabled, danger-border…); surface-field is the background.
  const semantic = (...path: string[]) => ref(["color", ...path]);
  const field = [
    color(["text", "field"], semantic("text", "strong"), undefined, "input value"),
    color(["text", "field-placeholder"], semantic("text", "softer"), undefined, "input placeholder"),
    color(["border", "field"], semantic("border", "default"), undefined, "input border"),
    color(["border", "field-hover"], semantic("border", "strong"), undefined, "input hover"),
    color(["border", "field-focus"], semantic("primary", "border"), undefined, "input focus"),
  ];

  // Every step choice of an intent, computed once; tokens and warnings are both read from it
  const scales = INTENTS.map(key => {
    const anchor = anchorOf(key);
    const passes = (index: number, background: string, ratio: number) => contrast(hexOf(key, STEPS[index]), background) >= ratio;
    // Dark mode moves the solid and the border to the nearest lighter step with 3:1 against the dark surface (WCAG 1.4.11), so
    // every variant stays visible there (neutral, accent, danger). Light keeps the anchor: a light seed such as warning stays
    // bright instead of turning mustard; only its border darkens.
    const darkStep = DESCENDING.find(i => i <= anchor && passes(i, neutral(900), 3)) ?? 0;
    const solidLightHex = hexOf(key, STEPS[anchor]);
    const solidDarkHex = hexOf(key, STEPS[darkStep]);
    const onLight = lightnessOf(solidLightHex) < 0.7 ? WHITE : neutral(950);
    // A moved dark solid is lighter, so its text takes whichever of white / neutral-950 reads better on it
    const onDark =
      darkStep === anchor ? onLight : contrast(WHITE, solidDarkHex) >= contrast(neutral(950), solidDarkHex) ? WHITE : neutral(950);
    return {
      key,
      anchor,
      darkStep,
      textLight: ASCENDING.find(i => i >= Math.max(anchor, 6) && passes(i, WHITE, 4.5)) ?? STEPS.length - 1,
      // neutral carries no color, so in dark its text reads like body text (text-default's step) instead of the first passing
      // step, which sat next to the disabled text and made neutral buttons look disabled
      textDark:
        key === "neutral" ? STEPS.indexOf(200) : (DESCENDING.find(i => i <= Math.min(anchor, 4) && passes(i, neutral(900), 4.5)) ?? 2),
      borderLight: ASCENDING.find(i => i >= anchor && passes(i, WHITE, 3)) ?? STEPS.length - 1,
      onLight,
      onDark,
      onRatioLight: contrast(onLight, solidLightHex),
      onRatioDark: contrast(onDark, solidDarkHex),
    };
  });

  const intents = scales.flatMap(
    ({ key, anchor, darkStep, textLight, textDark, borderLight, onLight, onDark, onRatioLight, onRatioDark }) => {
      const onRef = (hex: string) => (hex === WHITE ? white : pal("neutral", 950));
      const borderNote = (index: number, background: string) =>
        `${index === anchor ? "= solid" : `solid ${STEPS[anchor]} → ${STEPS[index]}`} · ${contrast(hexOf(key, STEPS[index]), background)}:1`;
      return [
        color(
          [key, "solid"],
          pal(key, STEPS[anchor]),
          pal(key, STEPS[darkStep]),
          darkStep === anchor ? "filled button, selected" : `filled button, selected · dark ${STEPS[anchor]} → ${STEPS[darkStep]}`,
        ),
        color([key, "solid-hover"], pal(key, stepAt(anchor + 1)), pal(key, stepAt(darkStep - 1))),
        color([key, "solid-active"], pal(key, stepAt(anchor + 2)), pal(key, stepAt(darkStep - 2))),
        color(
          [key, "soft"],
          palAlpha(key, STEPS[anchor], 0.08),
          palAlpha(key, STEPS[darkStep], 0.16),
          darkStep === anchor ? "light tint, ghost/outline hover" : `light tint · dark base ${STEPS[darkStep]}`,
        ),
        color([key, "soft-hover"], palAlpha(key, STEPS[anchor], 0.16), palAlpha(key, STEPS[darkStep], 0.32)),
        color([key, "soft-active"], palAlpha(key, STEPS[anchor], 0.32), palAlpha(key, STEPS[darkStep], 0.64), "pressed tint"),
        color(
          [key, "text"],
          pal(key, STEPS[textLight]),
          pal(key, STEPS[textDark]),
          `${contrast(hexOf(key, STEPS[textLight]), WHITE)}:1 · ${contrast(hexOf(key, STEPS[textDark]), neutral(900))}:1`,
        ),
        color(
          [key, "border"],
          pal(key, STEPS[borderLight]),
          pal(key, STEPS[darkStep]),
          `outline button, invalid input · light ${borderNote(borderLight, WHITE)} · dark ${borderNote(darkStep, neutral(900))}`,
        ),
        color(
          [key, "border-soft"],
          // Fixed steps, not relative to the seed: a light seed (warning) would otherwise land on 50 and a dark one on 900,
          // both invisible against their surface
          pal(key, 300),
          pal(key, 700),
          "decorative: alert edge, soft badge",
        ),
        color([`on-${key}`], onRef(onLight), onRef(onDark), `on solid ${onRatioLight}:1 · dark ${onRatioDark}:1`),
      ];
    },
  );

  const overlay = [
    color(["backdrop"], literalAlpha("black", 0.64), undefined, "behind modal, drawer"),
    color(["surface", "on-media"], literalAlpha("black", 0.32), undefined, "carousel arrow, indicator"),
    color(["surface", "on-media-strong"], literalAlpha("black", 0.64), undefined, "navbar on images"),
  ];

  const elevation = ELEVATION.flatMap(([level, [x, y, blur, spread], light, dark, description]): Token[] => [
    {
      path: ["elevation", `${level}-color`],
      type: "color",
      value: literalAlpha("black", light),
      dark: literalAlpha("black", dark),
    },
    {
      path: ["elevation", `${level}`],
      type: "shadow",
      value: { color: ref(["elevation", `${level}-color`]), offsetX: px(x), offsetY: px(y), blur: px(blur), spread: px(spread) },
      description,
    },
  ]);

  const typography: Token[] = [
    { path: ["typography", "font-family"], type: "fontFamily", value: '"Inter", system-ui, sans-serif' },
    { path: ["typography", "font-family-mono"], type: "fontFamily", value: "ui-monospace, SFMono-Regular, Menlo, monospace" },
    ...WEIGHTS.map(([name, weight]): Token => ({ path: ["typography", "weight", name], type: "fontWeight", value: weight })),
    ...TYPE_SCALE.flatMap(([role, baseSize, baseLineHeight, weight]): Token[] => {
      const { size, lineHeight } = typeSize(fontSize, baseSize, baseLineHeight);
      return [
        { path: ["typography", role, "font-size"], type: "dimension", value: rem(size), description: `${size}px` },
        { path: ["typography", role, "line-height"], type: "dimension", value: rem(lineHeight), description: `${lineHeight}px` },
        { path: ["typography", role, "font-weight"], type: "fontWeight", value: ref(["typography", "weight", weight]) },
      ];
    }),
  ];

  const sizing: Token[] = [
    ...SIZES.map((size): Token => ({ path: ["sizing", `${size}`], type: "dimension", value: rem(size), description: `${size}px` })),
    ...Object.entries(radiusScale(radiusSeed)).map(([name, size]): Token => ({
      path: ["sizing", "radius", name],
      type: "dimension",
      value: rem(size),
      description: `${size}px`,
    })),
    {
      path: ["sizing", "radius", "round"],
      type: "dimension",
      value: rem(ROUND_PX),
      description: `${ROUND_PX}px · independent of the seed`,
    },
    ...SPACING.map((size): Token => ({
      path: ["sizing", "space", `${size}`],
      type: "dimension",
      value: rem((size * space) / DEFAULT_SPACE),
      description: `${(size * space) / DEFAULT_SPACE}px · padding, margin, gap`,
    })),
    ...CONTAINERS.map(([name, size]): Token => ({
      path: ["sizing", "container", name],
      type: "dimension",
      value: rem(size),
      description: `${size}px`,
    })),
  ];

  const semanticTokens = [...surface, ...text, ...border, ...intents, ...field, ...overlay];
  // Each referenced alpha step becomes a primitive: "{color.palette.neutral.950-a08}" or "{color.palette.black-a64}"
  const alphaRefs = [
    ...new Set([
      ...ALPHA_EXTRAS,
      ...[...semanticTokens, ...elevation].flatMap(({ type, value, dark }) => (type === "color" ? [value, dark ?? ""] : [])),
    ]),
  ].filter(value => ALPHA_REF.test(value));
  const alphaPrimitive = (alias: string): Token => {
    const [, base, percent] = alias.match(ALPHA_REF) ?? [];
    const [key, step] = base.split(".");
    const alpha = Number(percent) / 100;
    return {
      path: aliasPath(alias),
      type: "color",
      value: withAlpha(step ? hexOf(key, Number(step)) : LITERALS[key], alpha),
      description: "alpha primitive",
    };
  };

  const palette: Token[] = [
    ...Object.entries(ramps).flatMap(([key, { anchor, steps }]) =>
      steps.map((hex, i): Token => ({
        path: ["color", "palette", key, String(STEPS[i])],
        type: "color",
        value: hex,
        ...(i === anchor && { description: "seed" }),
      })),
    ),
    { path: ["color", "palette", "white"], type: "color", value: WHITE },
    { path: ["color", "palette", "black"], type: "color", value: BLACK },
    ...overrides,
    ...alphaRefs.toSorted().map(alphaPrimitive),
  ];

  const warnings = [
    ...(background && contrast(background, WHITE) < 1.1
      ? [`background ${background} is nearly surface-default (white): cards only separate from the page by border/elevation`]
      : []),
    ...(textSeed
      ? [WHITE, background]
          .filter((surface): surface is string => !!surface && contrast(textSeed, surface) < 4.5)
          .map(surface => `text ${textSeed} on ${surface}: ${contrast(textSeed, surface)}:1 (below AA 4.5)`)
      : []),
    // The override must still sit between text-strong and text-soft, or the ladder reads out of order
    ...(textSeed && !(lightnessOf(neutral(900)) < lightnessOf(textSeed) && lightnessOf(textSeed) < lightnessOf(neutral(700)))
      ? [`text ${textSeed} falls outside text-strong…text-soft (neutral-900…700), the text ladder is out of order`]
      : []),
    ...scales.flatMap(({ key, anchor, darkStep, onRatioLight, onRatioDark }) => [
      ...(onRatioLight < 4.5 ? [`on-${key} / ${key}-solid: ${onRatioLight}:1 (below AA 4.5)`] : []),
      ...(darkStep !== anchor && onRatioDark < 4.5 ? [`on-${key} / ${key}-solid (dark): ${onRatioDark}:1 (below AA 4.5)`] : []),
    ]),
  ];

  return {
    tokens: [...palette, ...semanticTokens, ...typography, ...sizing, ...elevation],
    warnings,
  };
};
