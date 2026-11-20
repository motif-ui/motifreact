# Checkbox: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-19 with /figma-new-component from the migrated code (batch 5).

## Nodes

| What                                           | ID                                         |
| ---------------------------------------------- | ------------------------------------------ |
| Page                                           | `339:22`                                   |
| Component set `Checkbox` (48 variants)         | `339:327`                                  |
| Doc frame                                      | `340:342`                                  |
| Playground frame                               | `340:395`                                  |
| Sections: Documentation, Playground, Component | `339:23`, `339:24`, `339:25`               |
| Component table labels / spec tables (groups)  | in `339:25`: `table labels`, `spec tables` |

## Properties

- Variants: `size` (md default, xs, sm, lg), `checked`, `partialCheck` (only with `checked=false`), `error`, `success`,
  `disabled`. The set is sparse: per size and mark, the default and one variant per boolean modifier.
- hover and keyboard focus are not variants (user, 2026-11-19): the Color spec shows them as overrides. Every variant
  has a hidden `focus ring` layer in `input` that the focus cells turn on; the hover cells recolor the empty box's
  border to `color/border/field-hover`.
- `label` (text) and `showLabel` (boolean, on by default).
- Table: column `size` (md first); blocks `checked × partialCheck` (off, on, partial); rows default, error,
  success, disabled.

## Decisions (user, 2026-11-19)

- Keyboard focus draws a 2px `color/focus-ring` ring 2px outside the box (like Button); in Figma it is a `focus ring`
  rectangle inside `input`, absolutely positioned.
- Disabled and readOnly use one neutral look: `color/surface/disabled`, `color/border/disabled`, mark and label
  `color/text/disabled` (today's light-primary disabled look is gone).
- The error border stays on a checked box, as today.
- The partial mark is a rectangle (the code's SVG line); the check mark is `Icon/check` with its fill overridden.
- ListView's selectable rows use this Checkbox (the private `_ListView/Checkbox` part was removed).
