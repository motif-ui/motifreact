# Radio: Figma notes (maintained by AI, do not edit by hand)

## Nodes

| What                                           | ID                           |
| ---------------------------------------------- | ---------------------------- |
| Page                                           | `375:22`                     |
| Component set `Radio` (32 variants)            | `375:154`                    |
| Doc frame / Playground frame                   | `377:136` / `377:197`        |
| Sections: Documentation, Playground, Component | `375:23`, `375:24`, `375:25` |

## Properties

- Variants: `size` (md default, xs, sm, lg) × `checked` × `error` / `success` / `disabled` (one at a time, like
  Checkbox). `label` (text) and `showLabel` (boolean).
- Checked is a filled disc (user, 2026-11-23: no dot). success colors the empty disc's border `color/success/border`
  (and Checkbox's empty box, same PR). Checked disabled disc `color/text/disabled`.
- Keyboard focus is not a variant: a hidden `focus ring` ellipse in `radio`, turned on in the Color spec.
- Table: column `size`; rows off / on × default, error, success, disabled.
