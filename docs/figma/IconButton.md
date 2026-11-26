# IconButton: Figma notes (maintained by AI, do not edit by hand)

## Nodes

| What                                           | ID                                                       |
| ---------------------------------------------- | -------------------------------------------------------- |
| Page                                           | `361:289`                                                |
| Component set `IconButton` (20 variants)       | `364:143`                                                |
| Doc frame                                      | `364:147`                                                |
| Playground frame                               | `364:220`                                                |
| Sections: Documentation, Playground, Component | `364:144`, `364:145`, `364:146`                          |
| Component table labels / spec tables (groups)  | in `364:146`: `table labels`, `spec tables` (`366:1397`) |

## Properties

- Variants: `variant` (neutral default, primary, secondary, accent, info, success, warning, danger, strong, negative)
  × `disabled`.
- The `icon` layer is an exposed instance of Icon (`variant=inherit`) with its glyph fill overridden per variant: swap
  the glyph through the exposed `icon` property.
- `size` is not a variant: the instance width and height bind to `sizing/icon/xxs … xxl` (14 · 16 · 18 · 22 · 24 · 26 · 32, md 22 default). The
  nested icon has no size binding of its own (constraints scale), so it grows with the button.
- Hover, pressed and keyboard focus are not variants (feedback: no state variants): the Color spec overrides the glyph
  fill with `-solid-hover` / `-solid-active` (strong: `color/text/soft`; negative: `color/text/on-media-soft`) and turns
  on the hidden `focus ring` layer (stroke `sizing/2` `color/focus-ring`, 2px outside the box).
- negative is white (`color/text/on-media`), invisible on the set's light panel; the Color spec draws its row on
  `color/surface/on-media-strong`.
- Table: column `variant` (neutral first, equal column widths); rows default, disabled.
- Size spec has a focus row: the ring shows the button's real box at every size (user, 2026-11-20).
- The doc Variants matrix shows the variants and the sizes; disabled lives in the Component table and Color spec.

## Decisions (user, 2026-11-20)

- Disabled `color/text/disabled`; negative disabled `color/text/on-media-soft` (same as its hover: the media tokens have
  two tones only).
