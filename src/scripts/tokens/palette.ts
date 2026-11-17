import Color from "colorjs.io";

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
// OKLCH lightness per step, and how much of the seed chroma each step keeps by its distance from the anchor step
const LIGHTNESS = [0.975, 0.945, 0.89, 0.82, 0.72, 0.62, 0.54, 0.46, 0.37, 0.28, 0.21];
const CHROMA_DECAY = [1, 0.92, 0.8, 0.64, 0.48, 0.36, 0.27, 0.2, 0.15, 0.12, 0.1];

// The only alpha values a token may use. Same percentages in light and dark.
export const ALPHA_LADDER = [0.04, 0.08, 0.16, 0.32, 0.64, 0.8];

export const WHITE = "#ffffff";
export const BLACK = "#000000";

const toHex = (color: Color) => color.clone().toGamut({ space: "srgb" }).to("srgb").toString({ format: "hex", collapse: false });

export const lightnessOf = (hex: string) => new Color(hex).to("oklch").coords[0];

export const contrast = (a: string, b: string) => Math.round(new Color(a).contrast(new Color(b), "WCAG21") * 100) / 100;

export const alphaSuffix = (alpha: number) => {
  if (!ALPHA_LADDER.includes(alpha)) throw new Error(`Alpha ${alpha} is not on the ladder (${ALPHA_LADDER.join(", ")})`);
  return `a${String(Math.round(alpha * 100)).padStart(2, "0")}`;
};

export const alphaByte = (alpha: number) =>
  Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");

export const withAlpha = (hex: string, alpha: number) => `${hex}${alphaByte(alpha)}`;

/**
 * Builds an 11-step ramp around a seed. The seed lands unchanged on the step whose lightness is closest to it (the anchor),
 * the lightness curve is bent so both ends stay fixed, and chroma decays with distance from the anchor.
 */
export const buildRamp = (seed: string) => {
  const [seedL, seedC, seedH] = new Color(seed).to("oklch").coords;
  const anchor = LIGHTNESS.reduce((best, l, i) => (Math.abs(l - seedL) < Math.abs(LIGHTNESS[best] - seedL) ? i : best), 0);
  const first = LIGHTNESS[0];
  const last = LIGHTNESS[LIGHTNESS.length - 1];
  const warp = (l: number, i: number) =>
    i === anchor
      ? seedL
      : i < anchor
        ? first + (l - first) * ((seedL - first) / (LIGHTNESS[anchor] - first || 1))
        : last + (l - last) * ((seedL - last) / (LIGHTNESS[anchor] - last || 1));
  const hue = Number.isNaN(seedH) ? 0 : seedH;
  const steps = LIGHTNESS.map((l, i) =>
    i === anchor ? seed.toLowerCase() : toHex(new Color("oklch", [warp(l, i), seedC * CHROMA_DECAY[Math.abs(i - anchor)], hue])),
  );
  return { anchor, steps };
};
