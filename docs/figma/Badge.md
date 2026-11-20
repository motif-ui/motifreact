# Badge: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-16 with /figma-new-component from the `BadgeV2` clone (batch 3), which replaced Badge on 2026-11-18.

## Nodes

| What                                           | ID                                                    |
| ---------------------------------------------- | ----------------------------------------------------- |
| Page                                           | `230:439`                                             |
| Component set `Badge` (16 variants)            | `230:483`                                             |
| Doc frame                                      | `232:289`                                             |
| Playground frame                               | `232:540`                                             |
| Sections: Documentation, Playground, Component | `230:440`, `230:441`, `230:442`                       |
| Component table labels / spec tables (groups)  | in `230:442`: `table labels`, `spec tables` `235:371` |

## Properties

- Variants: `variant` (8, default primary), `dot` (false, true; default false, left-most column).
- `content` (text, default 8) and `showContent` (boolean) on the `content` layer; `showIcon` (boolean, default off) and
  `icon` (instance swap, default `Icon/check`) on the `icon` layer. icon replaces content in code: turn showContent off
  when showIcon is on.
- `max` and `align` have no property: `max` is written into content (999+), `align` is a position on the target and is
  shown in Scenarios.
- Table: column `dot`; one block; rows `variant` (primary first, so the default sits top-left).

## Decisions

- The badge is the marker only; Figma cannot wrap a target. The ring is a 2px inside stroke of `color/surface/default`
  (code: border, box-sizing border-box), so the badge is 28px tall, like the code.
- neutral is `color/neutral/soft` layered over `color/surface/default` with `color/neutral/text` (user, 2026-11-16: the
  solid neutral was too dark; the soft tone over the surface stays opaque on what the badge sits on).
- Spec tables: Color spec (variants as columns × Light · Dark rows, badge and dot per cell). No Size spec: Badge has no
  sizes. Scenarios: Content (number · over max · icon · dot) and Position (the four `align` corners on a stand-in
  target, translate(±50%, ±75%)).
- No Examples.
