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

- readOnly has its own look (2026-11-24): `color/surface/subtle` + `color/border/soft`, text, placeholder and icons keep
  their normal colors; focus and validation borders still show. The readOnly variants copy their default twin's colors.

## Decisions

- Chips show only when `multiple` and `filterable` are both true.
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
- 2026-11-25 (control heights, #249): the field's stroke is not counted in layout (code: inset box-shadow), so heights
  are 24 · 32 · 40 · 48, a button's of the same size; the left icon and the arrow use `sizing/icon/xs … lg` (16 · 18 · 22 · 24); the chips' close icon `sizing/icon/{chip step}` and the option check `sizing/icon/{size}`. The loader stays centered in the right container.

## Known code issues (not Figma)

- Double tab stop (combobox `div` and inner input); no keyboard navigation. See the project notes.
- 2026-11-25: the xs chip is one step under the field like the others: `typography/label-xs` (text-xxs, 11/16) and a
  `sizing/icon/xxs` close icon.
