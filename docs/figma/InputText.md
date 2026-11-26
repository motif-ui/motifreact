# InputText: Figma notes (maintained by AI, do not edit by hand)

## Nodes

| What                                           | ID                           |
| ---------------------------------------------- | ---------------------------- |
| Page                                           | `389:22`                     |
| Component set `InputText` (40 variants)        | `389:669`                    |
| Doc frame / Playground frame                   | `394:22` / `394:92`          |
| Sections: Documentation, Playground, Component | `389:23`, `389:24`, `389:25` |

## Properties

- Own field set (see MotifInputText.md, option b): only InputText's props.
- Variants: `size` × states × `filled`. Booleans `iconLeft`, `iconRight` (exposed Icon), `clearable`; text `value`,
  `placeholder`. `pill` is an instance override (radius round).
- Field geometry: padding `sizing/space` (xs 4·8, sm 6·12, md 8·16, lg 10·20), gap the vertical padding, 1px
  inside stroke not counted in layout (code: inset box-shadow), radius `sizing/radius/md`. Heights hug: xs 24, sm 32,
  md 40, lg 48, a button's of the same size. Icons are sized by `sizing/icon/xs … lg` (16 · 18 · 22 · 24: font × 4/3, never taller than the line).
- States: `error`, `success`, `disabled`, `readOnly` booleans (one true at a time) × `filled` (value or placeholder).
  Focus is not a variant: the Color spec overrides the border with `color/border/field-focus`.
- Table: column `size` (md first, equal column widths); rows the five states, empty and filled.
- disabled and readOnly: placeholder `color/text/disabled-soft` (a step under the value's `color/text/disabled`);
  the clear button is unbound from `clearable` and hidden in disabled, readOnly and empty variants, as code never
  renders it there.
- Parts spec columns: all five states (default, error, success, disabled, readOnly).
- readOnly has its own look (2026-11-24): `color/surface/subtle` + `color/border/soft`, text, placeholder and icons keep
  their normal colors; focus and validation borders still show. The readOnly variants copy their default twin's colors.
