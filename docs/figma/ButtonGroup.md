# ButtonGroup: Figma notes (maintained by AI, do not edit by hand)

## Nodes

| What                                                     | ID                                         |
| -------------------------------------------------------- | ------------------------------------------ |
| Page                                                     | `353:22`                                   |
| Component set `ButtonGroup` (4 variants)                 | `353:217`                                  |
| Part `_ButtonGroup/Item` (16 variants)                   | `353:123`                                  |
| Part `_ButtonGroup/Menu`                                 | `353:124`                                  |
| Doc frame                                                | `353:485`                                  |
| Playground frame                                         | `353:543`                                  |
| Sections: Documentation, Playground, Component, Internal | `353:23`, `353:24`, `353:25`, `353:26`     |
| Component table labels / spec tables (groups)            | in `353:25`: `table labels`, `spec tables` |

## Properties

- `ButtonGroup`: variant `size` (md default, xs, sm, lg). One frame (sizing/1 `color/border/default`, radius
  `sizing/radius/md`, clipped) holds three exposed `_ButtonGroup/Item` instances (`item 1` to `item 3`) with sizing/1
  `divider` lines between them; the items stretch to the tallest one, like the code's flex row.
- `_ButtonGroup/Item`: variants `size`, `type` (single, dropdown: the arrow and square padding) and `disabled`; `label`
  (text), `showIcon` (boolean, off) and `icon` (instance swap, default `Icon/add`). Fill `color/neutral/soft`, text and
  icons `color/neutral/text`, typography text-* strong.
- hover, active, open and keyboard focus are not variants: the Color spec overrides the fill and text (hover and open
  `color/primary/solid`, active `color/primary/solid-active`, with `color/on-primary`), swaps the open arrow to
  `Icon/keyboard_arrow_up` (an instance cannot be rotated) and turns on the hidden `focus ring` layer.
- `_ButtonGroup/Menu`: the list (md): `color/surface/raised`, `color/border/default`, radius md, `elevation/2`; items
  text-md regular `color/text/strong`, disabled `color/surface/disabled` + `color/text/disabled`. The Scenarios table
  shows it open under the dropdown item: its right edge on the item's right edge, 1px below (measured in the browser).
- Table: column `size` (md first), one row.

## Decisions (user, 2026-11-19)

- Hover keeps today's primary fill (option A), active `color/primary/solid-active`, an open dropdown stays primary.
- The resting fill is `color/neutral/soft` (today's light gray), not white.
- The menu keeps an opaque `color/surface/raised` on the list itself, so translucent item tones never show the page.
- The dropdown button carries `aria-haspopup` and `aria-expanded` (code change in this batch).
