# InputNumber: Figma notes (maintained by AI, do not edit by hand)

## Nodes

| What                                           | ID                           |
| ---------------------------------------------- | ---------------------------- |
| Page                                           | `391:22`                     |
| Component set `InputNumber` (80 variants)      | `391:1549`                   |
| Doc frame / Playground frame                   | `396:22` / `396:92`          |
| Sections: Documentation, Playground, Component | `391:23`, `391:24`, `391:25` |

## Properties

- Own field set: only InputNumber's props.
- Variants: `size` × states × `filled` × `removeSpinner` (false: the - and + buttons). Booleans `iconLeft`, `iconRight`,
  `clearable`; text `value`, `placeholder`. `pill` is an instance override (the + button follows).
- Field geometry: padding `sizing/space` (xs 4·8, sm 6·12, md 8·16, lg 10·20), gap the vertical padding, 1px
  inside stroke not counted in layout (code: inset box-shadow), radius `sizing/radius/md`. Heights hug: xs 24, sm 32,
  md 40, lg 48, a button's of the same size. Icons are sized by `sizing/icon/xs … lg` (16 · 18 · 22 · 24: font × 4/3, never taller than the line).
- States: `error`, `success`, `disabled`, `readOnly` booleans (one true at a time) × `filled` (value or placeholder).
  Focus is not a variant: the Color spec overrides the border with `color/border/field-focus`.
- Number buttons: square (aspect-ratio 1), as tall as the field inside its 1px stroke: 22 · 30 · 38 · 46, `color/neutral/soft`, a `color/border/default` divider,
  `text-{size}` stronger, divider `color/border/disabled` when disabled or readOnly; placed like the shared field's
  (absolute, right / stretch, spacer `2 × button − paddingH` so the gap before them matches code).
- Table: column `size`; blocks `removeSpinner=false` / `true`; rows the five states, empty and filled. Spec cells are
  280 wide: at 220 the lg value squeezed with both icons and the clear button.
- disabled and readOnly: placeholder `color/text/disabled-soft` (a step under the value's `color/text/disabled`);
  the clear button is unbound from `clearable` and hidden in disabled, readOnly and empty variants, as code never
  renders it there.
- Parts spec columns: all five states (default, error, success, disabled, readOnly).
- readOnly has its own look (2026-11-24): `color/surface/subtle` + `color/border/soft`, text, placeholder and icons keep
  their normal colors; focus and validation borders still show. The readOnly variants copy their default twin's colors.
