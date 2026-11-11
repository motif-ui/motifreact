# ProgressCircle: Figma notes (maintained by AI, do not edit by hand)

## Nodes

| What                                           | ID                                                   |
| ---------------------------------------------- | ---------------------------------------------------- |
| Page                                           | `7:10`                                               |
| Component set `ProgressCircle` (80 variants)   | `9:138`                                              |
| Doc frame                                      | `13:2`                                               |
| Playground frame                               | `69:1873`                                            |
| Sections: Documentation, Playground, Component | `57:357`, `69:1883`, `57:358`                        |
| Component table labels / spec tables (groups)  | in `57:358`: `table labels`, `spec tables` `150:565` |

## Properties

- Variants: `variant` (8 values, default primary), `size` (xs, sm, md, lg, xl; default sm, left-most column),
  `indeterminate`.
- Booleans and text: `showPercentage`, `percentage` (text, default 65%). The text layer exists only on lg and xl and
  never on indeterminate variants.
- `progress` / `maxProgress` have no property: drag the arc of the `circle` layer and write the percentage.
- `countdown` deliberately has no property: at any moment it looks like an arc without text; Scenarios show frames.

## Decisions

- indeterminate variants spin: `circle` ROTATION 0 → −360° over 1.5s, linear. The set and the spec tables group
  timelines are 1.4833s (one frame shorter than 1.5s, user saw a stop at the loop on 2026-11-11), so the spin loops
  without repeating its first frame.
- Arc ends are flat in Figma and round in code (stroke-linecap); kept as a documented limitation.
- Spec tables (2026-11-10): Size spec (sizes × progress=65, showPercentage, indeterminate; ⌀, stroke and text style in
  the column header from `$sizes`), Color spec (transposed 2026-11-10: the 8 variants are columns, Light · Dark the rows, at lg; the mode is the axis that changes the
  color, since dark moves neutral, accent and danger to a lighter step).
- No Scenarios (user, 2026-11-10): ProgressCircle has no real prop interaction. The progress and countdown tables only
  restated obvious behavior; the progress formula and the countdown behavior are in the doc's Properties rows and the
  "Not shown in Figma" note.
- No Examples.
