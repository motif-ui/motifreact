# Tab: Figma notes (maintained by AI, do not edit by hand)

## Nodes

| What                                                     | ID                                                               |
| -------------------------------------------------------- | ---------------------------------------------------------------- |
| Page                                                     | `484:22`                                                         |
| Component set `Tab` (8 variants)                         | `484:1176`                                                       |
| Part `_Tab/Item` (6 variants)                            | `484:1023`                                                       |
| Doc frame                                                | `484:24`                                                         |
| Playground frame                                         | `484:89`                                                         |
| Sections: Documentation, Playground, Component, Internal | `484:23`, `484:88`, `484:95`, `484:998`                          |
| Component table labels / spec tables (groups)            | in `484:95`: `table labels` `484:1402`, `spec tables` `484:1481` |

## Properties

- `Tab` variants: `type` (underline, solid) × `position` (fill, left, center, right; fill default). It holds three
  `_Tab/Item` instances (the first selected, the last disabled) over a `panelContainer` (`showPanel`). 480px wide; the
  code fills its container.
- `_Tab/Item` variants: `type` × `state` (default, selected, disabled); `title` + `showTitle`, `showIcon` + `icon`
  (instance swap). The icon takes the title's color: after swapping a glyph, copy the title fill to it.
- Table: column `position`; blocks `type`.

## Decisions

- underline: `color/text/soft` on a 2px `color/border/soft` line; hover `color/text/strong` on `color/border/strong`;
  selected `color/primary/text` on `color/primary/solid`. solid: `color/neutral/soft` with top corners
  `sizing/radius/md`, hover `color/neutral/soft-hover` with `color/text/strong`, selected `color/primary/solid` with
  `color/on-primary`. disabled `color/text/disabled`. Title `text-md` stronger, icon `sizing/icon/md`.
- Keyboard focus: a 2px `color/focus-ring` outline inset by 2px (Color spec).
- The doc's Variants show `type` at `position=fill`; the other positions are in the Component table.
- Spec tables: Size spec (type=underline · type=solid × icon · title, title, icon; no size prop), Color spec (type × default, hover,
  focus, selected, disabled).
- No Examples.
