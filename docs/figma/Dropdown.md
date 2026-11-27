# Dropdown: Figma notes (maintained by AI, do not edit by hand)

## Nodes

| What                                                        | ID                                                                |
| ----------------------------------------------------------- | ----------------------------------------------------------------- |
| Page                                                        | `466:793`                                                         |
| Component set `Dropdown` (128 variants)                     | `466:795`                                                         |
| Doc frame                                                   | `466:2275`                                                        |
| Playground frame                                            | `466:2432`                                                        |
| Sections: Documentation, Playground, Component, Internal    | `466:2274`, `466:2431`, `466:794`, `468:881`                      |
| Component table labels / spec tables (groups)               | in `466:794`: `table labels` `469:1096`, `spec tables` `466:2024` |
| Parts `_Dropdown/Item` (12 variants), `_Dropdown/Menu` (12) | `468:934`, `468:1195`                                             |

## Properties

- Variants: `variant` (8) × `shape` (solid, textOnly) × `size` (xs, sm, md, lg; md default) × `disabled`.
- `label` (text) + `showLabel`; `showIcon` + `icon` (instance swap) before the label; `arrow` (instance swap on
  `arrowIcon`, always shown): `Icon/arrow_drop_down`, or `_Dropdown/ArrowUp` (`475:1253`, the same glyph turned 180°)
  while the menu is open. `pill` is a `sizing/radius/round` corner override on the instance.
- `_Dropdown/Item`: `kind` (item, header) × `disabled` × `size`; `label`, `showIcon` + `icon`, `showDivider` (off on the
  first item).
- `_Dropdown/Menu`: `spacing` (callout, withGap, noSpace) × `size`; the MenuList holds four items (header, two items,
  a disabled item).
- Table: column `size`; blocks `shape` × `disabled`; rows `variant` (primary first under solid, neutral first under
  textOnly).

## Decisions

- The button is Button's box and colors (heights 24 · 32 · 40 · 48, `text-{size}` stronger, `sizing/icon/{size}`,
  solid fills, neutral `color/neutral/soft`, textOnly `color/{variant}/text` with a `{variant}/soft` hover). The code
  default variant is primary for solid and neutral for textOnly (#250).
- The menu: `color/surface/raised`, 1px `color/border/default`, radius `sizing/radius/md`, `elevation/2`; items like
  Select's options (`color/text/stronger`, hover `color/neutral/soft`, a `color/border/soft` divider); header
  `color/text/softer` strong; disabled `color/text/disabled`. callout: a caret 12px from the anchor's right edge.
- Hover, active, focus and open are in the Color spec (fills bound to the state tokens, the focus ring frame, the up
  arrow). open keeps the default colors in every variant: only the arrow turns.
- Spec tables: Size spec (xs … lg × label, icon, icon without label), Color spec (variants × default · hover · active · focus · open · disabled per shape).
  Scenarios: open menu by spacing, open menu by size, pill · textOnly.
- No Examples.
