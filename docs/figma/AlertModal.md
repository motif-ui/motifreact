# AlertModal: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-10 with /figma-new-component, before the code migration (`AlertModal` still uses the old tokens). The
page is the target for `AlertModalV2`; run `/figma-sync AlertModal` once the code is migrated.

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

- alternateButton: neutral outline pill (old code: `secondary`, which was gray). actionButton: AlertModal variant,
  solid, pill.
- elevated: `elevation/4` (old: shadow level 6). Backdrop: `color/backdrop` (black 64%; old 50%).
- Radius `sizing/radius/lg` (8px; old 4px, the user chose lg).
- Box: `color/surface/raised`, padding `sizing/space/8`; content and actions padding `sizing/space/16`;
  bordered and the divider use `color/border/soft`.
- Title `heading-h5` `text/strong`, text `body-md` `text/default` (old code used one title color for both; the
  separate colors were approved in the design review).
- Icon 52px (`sizing/52`), color `{variant}/solid`, the action button's fill (user, 2026-11-10; option b: one color,
  warning's glyph reads weakly on light surfaces).
- left / right content: icon and text block centered vertically (a title-only box was misaligned).
- Dark: `surface/raised` is now one step lighter than the page (`neutral-800`), so the box no longer disappears into
  the page (generator change, 2026-11-10; also affects Select's dropdown).
- Playground instance: elevated. Doc Variants: size sm, three per row.
- Color spec is transposed (user, 2026-11-10): the 8 variants are columns (primary first), Light and Dark are rows
  (`size=sm`, `elevated=true`), so it is wide and short like the one-row Component table.

## Design review (answered 2026-11-10)

- Dark backdrop: black 64% is enough in Dark too; one value for both modes.
- Title and text colors: keep them separate (`text/strong` title, `text/default` text).
- Neutral variant: the action button (soft gray solid) stands apart from the Cancel outline. In Dark it had looked
  disabled; that was fixed at the token level (`neutral/text` dark is `neutral-200`, generator, 2026-11-10).
- Warning icon: the weak glyph on light surfaces is accepted (one color with the action button).
- Still open, to confirm visually with the design team: the new radius and elevation (listed in the review page's
  changes table).

## Code migration notes (for AlertModalV2)

Status 2026-11-10: `src/lib/components/AlertModalV2/` applies all of these; compare story
`Token Karşılaştırma/AlertModal`. Pending: user approval, then promotion and `/figma-sync AlertModal`.

- The alternate button changes from `variant="secondary"` to `neutral`.
- Radius: `radius-lg` by the user's choice, not the pixel mapping of the old 4px (which would be `radius-md`).
- `@include shadow(6)` → `box-shadow: var(--mtf-elevation-4)`.
- Icon: `{variant}-solid` (today it uses the old text color of the variant).
- `.content_left` / `.content_right .alertModalContent`: `align-items: center` (today `flex-start`, which misaligns a
  title-only box).
