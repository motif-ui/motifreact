# ImageView: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-19 with /figma-new-component from the migrated code (batch 5).

## Nodes

| What                                                     | ID                                         |
| -------------------------------------------------------- | ------------------------------------------ |
| Page                                                     | `352:22`                                   |
| Component set `ImageView` (3 variants)                   | `352:55`                                   |
| Parts `_ImageView/placeholder`, `_ImageView/broken`      | `352:30`, `352:36`                         |
| Doc frame                                                | `352:397`                                  |
| Sections: Documentation, Playground, Component, Internal | `352:23`, `352:24`, `352:25`, `352:26`     |
| Component table labels / spec tables (groups)            | in `352:25`: `table labels`, `spec tables` |

## Properties

- Variant `state` (Figma only): loaded (default, the image), loading (the placeholder icon at 60% of the width,
  centered) and broken (the broken-image icon, centered). They are content states the code switches, not interaction
  states.
- Booleans `bordered` (the `border` layer: sizing/1 `color/border/default` inside the edge) and `solid` (the `solid`
  layer: `color/surface/subtle` behind the image). Radius `sizing/radius/md`; the set is 240 × 160, resize instances.
- The two icons are private parts imported from the code's SVGs (`ImageView.module.scss` placeholder,
  `BROKEN_IMG_SRC`); their gray `#AEB4BA` is fixed in the code, not a token, and reads on both modes.
- scaleType and positionVertical/positionHorizontal are a Scenarios table (`scenario tables`), drawn from the CSS (not
  instances), 240 × 160 boxes. One block per scaleType, each a positionVertical (rows) × positionHorizontal (columns)
  grid, since the two props are independent (user, 2026-11-19): original (a 96 × 96 image, both props move it), fit
  (default; a 200 × 300 image fills the height, only positionHorizontal moves it), fillKeepAspectRatio (the same image
  fills the width, positionVertical picks the crop) and fill (one cell: stretched, position has no effect). The default
  variant shows fit at top · left. In an instance set the image fill's scale mode and crop.
- Table: column `state` (loaded first), one row. Color spec: plain, bordered, solid, bordered + solid on the broken
  state, Light and Dark.

## Decisions (user, 2026-11-19)

- bordered `color/border/default` (today's line was a dark gray, now lighter); solid `color/surface/subtle`.
- The placeholder and broken icons keep the code's fixed gray (a mask would hide bordered and solid while loading).
