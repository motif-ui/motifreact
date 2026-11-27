# ProgressBar: Figma notes (maintained by AI, do not edit by hand)

Sibling of the ProgressCircle page: same variant rules and Color spec layout.

## Nodes

| What                                           | ID                                                      |
| ---------------------------------------------- | ------------------------------------------------------- |
| Page                                           | `176:810`                                               |
| Component set `ProgressBar` (80 variants)      | `176:1091`                                              |
| Sections: Documentation, Playground, Component | `177:363`, `177:375`, `176:1092`                        |
| Component table labels / spec tables (groups)  | in `176:1092`: `table labels`, `spec tables` `176:1298` |

## Properties

- Variants: `variant` (8, default primary), `size` (sm default left-most, xs, md, lg, xl), `indeterminate`.
  Table: column `size`, blocks `indeterminate`, rows `variant` (primary first).
- `showPercentage` (boolean) + `percentage` (text, default 65%); the text exists only on determinate variants.
- `progress` / `maxProgress` have no property: the `fill` layer's width is the progress (65% in the set).
- `countdown` has no property: the doc's "Not shown in Figma" note describes it.

## Decisions (user, 2026-11-11)

- Fill `color/{variant}/solid`, track `color/neutral/soft`, text `color/text/soft` (like ProgressCircle).
- neutral fill: the generator's `neutral-solid` is `neutral-500` in Light too (3.54:1 on white). Its tints, text and
  border keep the 700 anchor.
- `secondary` is the secondary brand color; gray is `neutral`.
- indeterminate animates like the code (user asked, 2026-11-11): the `fill` layer has `TRANSLATION_X` and `SCALE_X`
  keyframes at 0 · 0.6 · 1.2s, easing `cubic-bezier(0.5, 0.1, 0.9, 1)` per step; left 0 → 50% → 100%, width
  0 → 50% → 0. Scale works around the fill's center, so the translation compensates
  (`left = restX + tx + restW/2 × (1 − s)`). The set's timeline is 1.2s so the preview loops. At rest the fill shows
  the middle of the animation (left 50%, width 50%). Scale, not a `WIDTH` track: a `WIDTH` keyframe track does not
  render in the export.
- Color spec is transposed (variants as columns, Light · Dark rows) at size md with the percentage.
