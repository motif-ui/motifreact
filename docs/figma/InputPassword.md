# InputPassword: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-24 with /figma-sync from the migrated code (input family token migration, batch 7).

## Nodes

| What                                           | ID                           |
| ---------------------------------------------- | ---------------------------- |
| Page                                           | `390:22`                     |
| Component set `InputPassword` (40 variants)    | `390:749`                    |
| Doc frame / Playground frame                   | `395:103` / `395:173`        |
| Sections: Documentation, Playground, Component | `390:23`, `390:24`, `390:25` |

## Properties

- Own field set: only InputPassword's props. The key icon (`iconLeft`, `vpn_key`) is always shown: an exposed Icon to
  swap the glyph, not a boolean, as in code.
- Variants: `size` × states × `filled` (a masked value). Booleans `toggleMask` (IconButton `visibility`; code shows
  `visibility_off` while the value is visible), `clearable`; text `value`, `placeholder`. `pill` is an instance override.
- Field geometry: padding `sizing/space` (xs 4·8, sm 6·12, md 8·16, lg 10·20), gap the vertical padding, 1px
  inside stroke counted in layout, radius `sizing/radius/md`. Heights hug: xs 26, sm 34, md 42, lg 46 (more with an
  icon taller than the line).
- States: `error`, `success`, `disabled`, `readOnly` booleans (one true at a time) × `filled` (value or placeholder).
  Focus is not a variant: the Color spec overrides the border with `color/border/field-focus`.
- Table: column `size` (md first, equal column widths); rows the five states, empty and filled.
- disabled and readOnly: placeholder `color/text/disabled-soft` (a step under the value's `color/text/disabled`);
  the clear button is unbound from `clearable` and hidden in disabled, readOnly and empty variants, as code never
  renders it there.
- Parts spec columns: all five states (default, error, success, disabled, readOnly).
- readOnly has its own look (2026-11-24): `color/surface/subtle` + `color/border/soft`, text, placeholder and icons keep
  their normal colors; focus and validation borders still show. The readOnly variants copy their default twin's colors.
