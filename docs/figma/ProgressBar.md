# ProgressBar: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-11 with /figma-new-component from `ProgressBarV2` (batch 2; the clone replaces ProgressBar after
approval). Sibling of the ProgressCircle page: same variant rules and Color spec layout.

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
- `secondary` is the secondary brand color (breaking change logged); gray is `neutral`.
- indeterminate is shown at the middle of its animation (fill at left 50%, width 50%).
- Color spec is transposed (variants as columns, Light · Dark rows) at size md with the percentage.
