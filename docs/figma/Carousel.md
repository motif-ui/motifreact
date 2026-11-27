# Carousel: Figma notes (maintained by AI, do not edit by hand)

## Nodes

| What                                                     | ID                                                              |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| Page                                                     | `485:22`                                                        |
| Component set `Carousel` (4 variants)                    | `486:560`                                                       |
| Part `_Carousel/Indicators` (4 variants)                 | `485:1027`                                                      |
| Doc frame                                                | `485:24`                                                        |
| Playground frame                                         | `485:89`                                                        |
| Sections: Documentation, Playground, Component, Internal | `485:23`, `485:88`, `485:95`, `485:998`                         |
| Component table labels / spec tables (groups)            | in `485:95`: `table labels` `486:774`, `spec tables` `486:1139` |

## Properties

- Variants: `colorScheme` (dark, light; dark default) × `contentBackdrop` (false, true). `colorScheme` is the content's
  color; the variant forces the Semantic mode like the code's `data-mtf-mode` (dark → Light, light → Dark).
- `title` + `showTitle`, `subtitle` + `showSubtitle`; `showControls` and `showIndicators` (the inverse of
  `removeControls` / `removeIndicators`). The `indicators` instance (`_Carousel/Indicators`) is exposed: its `shape`
  is `indicatorShape`.
- The `image` layer is a gradient placeholder (bright for dark content, dark for light content): put the slide's
  image as its fill. 480 × 260; the code fills its container and takes `height`.
- Table: column `contentBackdrop`; blocks `colorScheme`.

## Decisions

- Title `heading-h5` `color/text/strong`, subtitle `body-md` `color/text/soft`, sizing/space/48 above the bottom.
  Controls: IconButton `strong` xxl, sizing/space/16 from the sides, centered. Indicators `color/text/softer`, active
  `color/text/strong`.
- `contentBackdrop`: `color/surface/default` at 80% behind the title (padding 2 × 10), the subtitle (0 × 6), the
  controls (round, 2) and a 2px ring around each indicator.
- Scenarios: Bright image and Dark image (colorScheme × contentBackdrop on each, the image layer's fill overridden),
  Indicators (colorScheme × indicatorShape) and Content (title only, no text, removeControls · removeIndicators).
- No Examples.
