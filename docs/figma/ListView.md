# ListView: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-17 with /figma-new-component from the migrated ListView (batch 4).

## Nodes

| What                                                     | ID                                                    |
| -------------------------------------------------------- | ----------------------------------------------------- |
| Page                                                     | `265:22`                                              |
| Component set `ListView` (3 variants)                    | `283:1143`                                            |
| Part `_ListView/Item` (96 variants)                      | `283:877`                                             |
| Doc frame                                                | `284:1239`                                            |
| Playground frame                                         | `284:1753`                                            |
| Sections: Documentation, Playground, Component, Internal | `265:23`, `265:24`, `265:25`, `265:26`                |
| Component table labels / spec tables (groups)            | in `265:25`: `table labels`, `spec tables` `284:1238` |

## Properties

- `ListView`: variant `size` (md, sm, lg; default md); `enableDividers` (boolean) shows the `divider` lines between
  the rows. The four rows are exposed `_ListView/Item` instances (`item 1` to `item 4`).
- `_ListView/Item` (code: ListView.Item): variants `size`, `leftContent` (icon, image, abbr, none: the prop the item
  gets; code picks icon > image > abbr), `disableAvatars` and `selectable` (ListView props; selectable shows the
  checkbox), `disabled` and `state` (default, hover, focus; Figma-only, hover and focus need href or onClick). Text
  properties `title`, `description`, `alternateText`, `abbr` (md, lg) and `abbr (sm)` (one letter); booleans
  `showDescription`, `showAlternateText`, `showIconRight`; instance swaps `icon` (default `Icon/calendar_month`) and
  `iconRight` (default `Icon/arrow_forward_ios`).
- `enableMultiLine` has no property: the row texts truncate with an ellipsis; turn off the text truncation in the
  instance (Scenarios show it).
- Table: columns `size` (md first), one row.

## Decisions

- Every label on the page uses the code's prop names (user, 2026-11-18).
- The letter avatar is Avatar's neutral: a translucent `color/neutral/soft` fill (no surface layer, so on a hovered
  row it darkens with the row and stays visible) with `color/neutral/text`, Semi Bold (user decision 3 of batch 4). One letter at sm (24px avatar), two above, like
  Avatar (user, 2026-11-18; the code was changed to match).
- `leftContent=image` is a real photo filling the round avatar (an image fill on `leftContent`); with
  `disableAvatars=true` it is square; disabled, grayscale at 60%.
- The checkbox is a `Checkbox` instance (size = the ListView size, `showLabel` off), since Checkbox migrated in batch 5;
  the former private part `_ListView/Checkbox` was removed (2026-11-19).
- Focus is an inner 2px `color/focus-ring` frame (code: outline with a -2px offset).
- Spec tables: Size spec (sm · md · lg × each left content, disableAvatars, selectable, iconRight and the text
  combinations), State spec (default, hover, focus, disabled=true × left contents, Light and Dark). Scenarios:
  ListView options (enableDividers, disableAvatars, selectable, enableMultiLine false and true).
- No Examples.
- 2026-11-25: the right icon takes `sizing/icon/{size}` like the left one (18 · 22 · 24; was 22 · 24 · 28).
