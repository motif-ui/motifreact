# _MotifInputText: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-24 with /figma-sync from the migrated code (input family token migration, batch 7).

## Nodes

| What                                           | ID                                      |
| ---------------------------------------------- | --------------------------------------- |
| Divider page "———— Common Components"          | `386:22`                                |
| Page `_MotifInputText`                         | `386:23`                                |
| Component set `_MotifInputText` (40 variants)  | `386:1150`                              |
| Doc frame / Playground frame                   | `388:901` / `388:966`                   |
| Sections: Documentation, Playground, Component | `386:24`, `386:25`, `386:26`            |
| Spec tables (group)                            | in `386:26`: `spec tables` (`387:2102`) |

## Properties

- The shared internal field (`Motif/InputText`): every prop it takes, for reference. Designs use the public pages.
- Variants: `size` × `error` / `success` / `disabled` / `readOnly` × `filled`.
- Booleans: `iconLeft`, `iconRight` (exposed Icon instances, swap the glyph), `buttonRight` (exposed IconButton),
  `clearable`, `loader`, `numberSpinner`. Text: `value`, `placeholder`.
- Field geometry: padding `sizing/space` (xs 4·8, sm 6·12, md 8·16, lg 10·20), gap the vertical padding, 1px
  inside stroke counted in layout, radius `sizing/radius/md`. Heights hug: xs 26, sm 34, md 42, lg 46 (more with an
  icon taller than the line).
- States: `error`, `success`, `disabled`, `readOnly` booleans (one true at a time) × `filled` (value or placeholder).
  Focus is not a variant: the Color spec overrides the border with `color/border/field-focus`.
- Table: column `size` (md first, equal column widths); rows the five states, empty and filled.
- Spec "Part order": a wide field with every part numbered in render order (iconLeft, input with the clear button
  inside it at the right, iconRight, buttonRight, numberButtons) and a loader row (the loader replaces iconRight and
  buttonRight).
- Number buttons: divider `color/border/disabled` when disabled or readOnly. The spacer is `2 × button − paddingH`
  wide, so the field's gap sits before the buttons as in code.
- The number buttons are an absolutely placed frame at the right edge (`x = width − w − 1`, `y = 1`, height − 2,
  constraints right / stretch) with a spacer frame bound to the same boolean; the wrapper has no fill.

- disabled and readOnly: placeholder `color/text/disabled-soft` (a step under the value's `color/text/disabled`);
  the clear button is unbound from `clearable` and hidden in disabled, readOnly and empty variants, as code never
  renders it there.
- Parts spec columns: all five states (default, error, success, disabled, readOnly).

- readOnly has its own look (2026-11-24): `color/surface/subtle` + `color/border/soft`, text, placeholder and icons keep
  their normal colors; focus and validation borders still show. The readOnly variants copy their default twin's colors.

## Decisions (user, 2026-11-24)

- A "Common Components" page group holds shared internals; public pages stay standalone.
- Figma cannot bind a parent property to a nested instance's layers ("Cannot set component property references on
  instance sublayer"), so InputText, InputPassword and InputNumber each have their own field set with only their own
  props (option b). A change to the field must be applied to all four sets.
