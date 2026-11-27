# Chip: Figma notes (maintained by AI, do not edit by hand)

## Nodes

| What                                           | ID                                                   |
| ---------------------------------------------- | ---------------------------------------------------- |
| Page                                           | `239:22`                                             |
| Component set `Chip` (256 variants)            | `239:474`                                            |
| Doc frame                                      | `239:505`                                            |
| Playground frame                               | `239:951`                                            |
| Sections: Documentation, Playground, Component | `239:23`, `239:24`, `239:25`                         |
| Component table labels / spec tables (groups)  | in `239:25`: `table labels`, `spec tables` `240:771` |

## Properties

- Variants: `shape` (solid, outline; default solid), `variant` (8, default neutral), `size` (xs, sm, md, lg; default
  md, left-most column), `showIcon` and `closable` (false, true; default false).
- `label` (text, default Chip) and `icon` (instance swap, default `Icon/check`) on `icon-left`; `icon-close` is
  `Icon/cancel`.
- `pill` is the code default: the set's radius is `sizing/radius/round`; pill=false is a `sizing/radius/md` override on
  the instance.
- Table: column `size`; blocks `shape` × `showIcon` × `closable`; rows `variant` (neutral first, so the default sits
  top-left).

## Decisions

- showIcon and closable are variants, not booleans (2026-11-17): they change the padding, and Figma cannot change a
  padding by a boolean.
- Sizes (user, 2026-11-17, settled on option C of a side-by-side page): text only, padding vertical · horizontal
  sizing/space/2 · 8 (xs), 4 · 12 (sm), 4 · 16 (md), 6 · 20 (lg). With an icon on either side, both sides take
  sizing/space/6 · 8 · 10 · 12 (the label's visible space above and below) and the gap between icons and label is
  sizing/space/4 · 6 · 6 · 8, so the chip stays balanced whichever side the icon is on and is not chubby at lg. Icons
  `sizing/icon/xxs · xs · sm · md` (14 · 16 · 18 · 22) fit the label's line, so every chip of a size has one height (20 · 24 · 28 · 36). The code sets
  the icon size on the close button's inner icon, since IconButton gives that icon its own size class, and makes the
  close button as tall as its icon.
- outline: 1px inside stroke that counts in the layout (`strokesIncludedInLayout`), so an outline chip is 2px larger,
  like the code's border. The border takes `{variant}/solid` (decoration: the label names the chip), the icons
  `{variant}/border`, the label `{variant}/text` (user, 2026-11-17: warning's border must read yellow, success was too
  dark).
- neutral solid is `color/neutral/soft` with `color/neutral/text` (code: like the neutral solid button); the close icon
  is colored like the label (code: `color: inherit`).
- Default variant is neutral.
- Only a closable chip has a hover state; it is not a variant: the Color spec's hover column overrides the instance
  fill (solid: `{variant}/solid-hover`, neutral `neutral/soft-hover`; outline: `{variant}/soft`).
- Spec tables: Size spec (sizes × label · icon + label · label + close · all three), Color spec (per shape: variants ×
  default · hover). Scenarios: pill.
- No Examples.
