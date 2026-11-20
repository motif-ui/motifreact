# Accordion: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-19 with /figma-new-component from the migrated code (batch 5).

## Nodes

| What                                                 | ID                                         |
| ---------------------------------------------------- | ------------------------------------------ |
| Page                                                 | `349:22`                                   |
| Component set `Accordion` (2 variants)               | `349:44`                                   |
| Doc frame                                            | `349:319`                                  |
| Playground frame                                     | `349:378`                                  |
| Sections: Documentation, Playground, Component       | `349:23`, `349:24`, `349:25`               |
| Component table labels / spec and scenarios (groups) | in `349:25`: `table labels`, `spec tables` |

## Properties

- Variant `expanded` (false default, true). Text properties `title` and `text`; `showIcon` (boolean, off) with the
  instance swap `icon` (default `Icon/info`). The width is 400 in the set; instances stretch to their container.
- The open header has a `color/border/default` bottom line (the code's content overlaps it by 1px while closed); the
  arrow is `Icon/keyboard_arrow_down`, `Icon/keyboard_arrow_up` while open.
- hover and keyboard focus are not variants: the Color spec overrides the header fill with `color/neutral/soft` for
  hover and turns on the hidden `focus ring` layer (2px `color/focus-ring` inside the header) for focus.
- `children` replaces the `textContent` layer; Accordion.Group (`condensed`) is a Scenarios table: separate (gap
  `sizing/space/8`) and condensed (one frame, the accordions lose their border and radius, `sizing/1` lines between).
- Table: column `expanded` (false first), one row.

## Decisions (user, 2026-11-19)

- Header `color/surface/subtle`, hover `color/neutral/soft`, borders `color/border/default` (the user wanted to judge
  the header tone on the compare screen).
- Title `typography/label-lg` with weight stronger; text `typography/body-sm` in `color/text/soft`.
- Keyboard focus draws the ring inside the header, since the rounded root clips its content.
