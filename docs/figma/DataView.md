# DataView: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-17 with /figma-new-component from the `DataViewV2` clone (batch 4).

## Nodes

| What                                                     | ID                                                    |
| -------------------------------------------------------- | ----------------------------------------------------- |
| Page                                                     | `269:22`                                              |
| Component set `DataView` (6 variants)                    | `269:558`                                             |
| Part `_DataView/Item` (38 variants)                      | `269:347`                                             |
| Doc frame                                                | `287:912`                                             |
| Playground frame                                         | `287:1397`                                            |
| Sections: Documentation, Playground, Component, Internal | `269:23`, `269:24`, `269:25`, `269:26`                |
| Component table labels / spec tables (groups)            | in `269:25`: `table labels`, `spec tables` `286:1087` |

## Properties

- `DataView`: variants `rowVariant` (plain, solid, stripe; default plain) and `orientation` (horizontal, vertical;
  default horizontal). Each variant is a two-column grid (column gap `sizing/space/32`) of four exposed
  `_DataView/Item` instances (`item 1` to `item 4`), 480px each.
- `_DataView/Item` (code: DataView.Item): variants `orientation`, `rowVariant` (plain, solid, stripe = the tinted
  row of a striped DataView; stripe only with no variant, since code keeps the stripe tone) and `variant` (none,
  neutral … danger). Text properties `label` and `value`; `showIcon` and `icon` (instance swap, default
  `Icon/person`); `bordered` shows the absolute `border` line (code: every row but the last, off with removeBorder).
- `cols` and the breakpoint props have no property: resize the instance or add rows. `valueAlignment` is the value
  text's horizontal alignment (Scenarios show center and right).
- Table: columns `orientation` (horizontal first), rows `rowVariant` (plain first).

## Decisions

- The item tint is `color/{variant}/soft` and optional, no tint by default (user decision 2 of batch 4); neutral,
  secondary and accent are new.
- The horizontal label takes 30% of the row, so the rows are 480px wide in Figma (360px wraps "Version" at 30%; the
  code wraps the same way in narrow columns).
- stripe rows and the solid label cell use `color/neutral/soft`, the same tone as variant=neutral (user,
  2026-11-18; the code was changed to match).
- Spec tables: Item content (orientation horizontal · vertical × label/value, icon, long value, long label,
  valueAlignment, bordered, solid, stripe) and Color spec (variants, solid, stripe × Light · Dark; orientation does
  not change colors). Scenarios: DataView options (both orientations × plain, removeBorder, solid, solid without
  borders, stripe, cols=1, an item variant).
- Spec and scenario rail labels of item props start with `DataView.Item` on their own line, since `variant`
  belongs to the item; labels without it are DataView props (user, 2026-11-18).
- No Examples.
