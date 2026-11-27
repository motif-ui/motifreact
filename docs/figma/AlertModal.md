# AlertModal: Figma notes (maintained by AI, do not edit by hand)

Figma and code match; the pre-migration AlertModal is in `compare/baseline/AlertModal`.

## Nodes

| What                                                           | ID                                                      |
| -------------------------------------------------------------- | ------------------------------------------------------- |
| Page                                                           | `137:22`                                                |
| Component set `AlertModal` (128 variants)                      | `138:1725`                                              |
| Parts `_AlertModal/Content`, `_AlertModal/Actions`             | `137:41`, `137:124`                                     |
| Doc frame                                                      | `139:1725`                                              |
| Sections: Documentation, Playground, Component, Internal parts | `139:2218`, Playground, `138:1726`, Internal parts      |
| Component table labels / spec tables (groups)                  | in `138:1726`: `table labels`, `spec tables` `153:2520` |

## Properties

- Variants: `variant` only (8, default primary). Table: one row, column `variant`, variants 24px apart, no row label or block chip
  (size and the booleans are not variant axes).
- `bordered` and `elevated` are booleans (user, 2026-11-10: as variant axes they repeated the same box): they show a
  `border` layer (1px `border/soft`, inside, on top) and a `shadow` layer (`elevation/4`, behind). They combine; the
  Surface Scenarios table shows default, bordered, elevated, bordered + elevated and enableDivider.
- `size` is not a variant (user, 2026-11-10: it only changes the width, and the size columns repeated the same box):
  the instance width is bound to `sizing/320 · 480 · 720 · 960` (sm · md default · lg · xl). The Size spec table shows
  the four widths.
- `enableDivider` (boolean).
- Exposed `alertModalContent` (`_AlertModal/Content`): `contentPosition` (center, left, right), `showIcon` + `icon`,
  `title`, `showText` + `text`.
- Exposed `alertModalActions` (`_AlertModal/Actions`): `buttonsPosition` (center, left, right, spaceBetween, stretch,
  fullWidth), `showAlternate`, `showAction`, and both Buttons exposed (label, icon).
- The set is the dialog box only. The backdrop (`removeBackdrop`) shows in the Backdrop Scenarios table, in Light and Dark
  rows (user, 2026-11-10): the token is the same in both modes, but the dimmed page and the box contrast differ. The page mock's panels have a 1px `border/soft` stroke: in Dark `surface/canvas` and
  `surface/default` are the same color, so only the border separates them.

## Decisions (user, 2026-11-10)

- alternateButton: neutral outline pill. actionButton: AlertModal variant,
  solid, pill.
- elevated: `elevation/4`. Backdrop: `color/backdrop` (black 64%).
- Radius `sizing/radius/lg` (8px).
- Box: `color/surface/raised`, padding `sizing/space/8`; content and actions padding `sizing/space/16`;
  bordered and the divider use `color/border/soft`.
- Title `heading-h5` `text/strong`, text `body-md` `text/default`.
- Icon 52px (`sizing/52`), color `{variant}/solid`, the action button's fill (user, 2026-11-10; option b: one color,
  warning's glyph reads weakly on light surfaces).
- left / right content: icon and text block centered vertically.
- Dark: `surface/raised` is one step lighter than the page (`neutral-800`).
- Playground instance: elevated. Doc Variants: size sm, three per row.
- Color spec is transposed (user, 2026-11-10): the 8 variants are columns (primary first), Light and Dark are rows
  (`size=sm`, `elevated=true`), so it is wide and short like the one-row Component table.
