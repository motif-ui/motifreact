# Avatar: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-16 with /figma-new-component from the `AvatarV2` clone (batch 3), which replaced Avatar on 2026-11-18.

## Nodes

| What                                           | ID                                                    |
| ---------------------------------------------- | ----------------------------------------------------- |
| Page                                           | `236:798`                                             |
| Component set `Avatar` (102 variants)          | `236:1060`                                            |
| Doc frame                                      | `237:76`                                              |
| Playground frame                               | `237:396`                                             |
| Sections: Documentation, Playground, Component | `236:799`, `236:800`, `236:801`                       |
| Component table labels / spec tables (groups)  | in `236:801`: `table labels`, `spec tables` `237:621` |

## Properties

- Variants: `content` (letters, icon, image), `variant` (8, default neutral), `size` (xs…xxl; default md, left-most
  column). The set is sparse: content=image exists only with variant=neutral, since the image covers the fill.
- `letters` (text, default MO) on the `letters` layer of md and up, `initial` (text, default M) on the `initial` layer
  of xs and sm; `icon` (instance swap, default `Icon/person`) on the `icon`
  layer. content=image shows a photo filling the avatar (image fill); the `imagesmode` placeholder under it is hidden, since
  the code shows it only while the image loads.
- Table: column `size`; blocks `content`; rows `variant` (neutral first, so the default sits top-left).

## Decisions

- Default variant is neutral (code default changed from secondary on 2026-11-16).
- neutral is `color/neutral/soft` layered over `color/surface/default` with `color/neutral/text` (user, 2026-11-16: the
  solid neutral was too dark; neutral stays close to the page tones like the neutral button).
- Text: label-xs (weight strong, the style's own Medium) at xs; label-sm, label-lg, label-xl with a Semi Bold override
  (code: `typography(label-*, "stronger")`) at sm, md, lg; heading-h4 and heading-h3 at xl and xxl.
- The code shows one letter at xs and sm (user, 2026-11-17: never two there): those variants use their own `initial`
  text property (default M), md and up use `letters` (default MO).
- Spec tables: Size spec (sizes × letters · icon · image, metrics in the header from `$sizes`) and Color spec (variants
  as columns × Light · Dark rows, letters and icon per cell). No Scenarios: Avatar has no prop interaction.
- content=image is a real photo, and its row in the set's table has no variant label: the photo covers the fill, so
  the variant does not show (user, 2026-11-18).
- No Examples.
