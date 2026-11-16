# Select: Figma notes (maintained by AI, do not edit by hand)

## Nodes

| What                                                                | ID                                                     |
| ------------------------------------------------------------------- | ------------------------------------------------------ |
| Page                                                                | `7:11`                                                 |
| Component set `Select` (72 variants)                                | `18:110`                                               |
| Parts `_Select/Chip`, `InputText`, `Option`, `GroupLabel`, `NoData` | `15:20`, `15:37`, `15:86`, `15:95`, `15:104`           |
| Doc frame                                                           | `20:110`                                               |
| Playground frame / Examples frame                                   | `69:1571` / `59:1974`                                  |
| Sections: Documentation, Playground, Component, Internal parts      | `57:1862`, `69:1573`, `57:1863`, `57:1864`             |
| Component table labels / spec tables (groups)                       | in `57:1863`: `table labels`, `spec tables` `135:2719` |

## Properties

- Variants: `size` (xs, sm, md, lg; default md, left-most column), `state` (Figma only: default, focus, open),
  `multiple`, `filterable`, `error`, `success`, `disabled`, `readOnly`, `loading`.
- Sparse set: `state` × `multiple` × `filterable` for every size; the modifiers only with multiple=false and
  filterable=false, plus `disabled` with multiple=true and filterable=true.
- Booleans: `showIcon` (+ swap `icon`), `hasValue` (Figma only; shows the chips).
- Nested `inputText` (`_Select/InputText`): `placeholder`, `value`, `hasValue`, `disabled`, `caret` (Figma only).
- `_Select/Chip`: `label`, `size`, `closable` (false when the Select is disabled, readOnly or loading).

## Decisions

- 2026-11-05: `showChips` was replaced by the code props `multiple` / `filterable`; chips show only when both are true.
  Consumers' instances that used `showChips` lose their chips on update.
- Chips are direct children of `inputTextAndItemsContainer` (named `selectionChip`), so they wrap like the code
  (the input keeps at least `sizing/64`).
- The input text hugs and clips, like a native input (no ellipsis); the caret sits after the value, or before the
  placeholder when empty.
- multiple alone shows the labels comma-separated; single filterable keeps the selected label when open.
- Spec tables (2026-11-10):
  - Size spec: sizes × placeholder, value + icon, open, loading, chips; metrics in the column header from `$sizes`.
  - Color spec: states (default, focus, open, error, success, disabled, readOnly, loading) × placeholder, value, chips.
    Chips with error, success or loading are not in the set (shown as —). Chips with readOnly use the disabled
    variant: the same look.
  - The code has no hover style on the field; option hover shows in the open rows.
- Scenarios: multiple × filterable (empty · value · open · open · typing), Content (grouped data · open, data = [] ·
  open).
- Examples: icon + value only.
- No data text comes from `src/i18n/locales/en.json` `g.noData` ("No data found...").

## Known code issues (not Figma)

- Double tab stop (combobox `div` and inner input); no keyboard navigation. See the project notes.
