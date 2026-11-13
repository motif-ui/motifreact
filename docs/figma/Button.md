# Button: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-10 from the token migration clone `ButtonV2`, promoted to `src/lib/components/Button` on 2026-11-11 (the
user approved the Figma page). Figma and code match; the pre-migration Button is in `compare/baseline/Button`.

## Nodes

| What                                           | ID                                                      |
| ---------------------------------------------- | ------------------------------------------------------- |
| Page                                           | `129:22`                                                |
| Component set `Button` (288 variants)          | `129:1770`                                              |
| Doc frame                                      | `131:22`                                                |
| Playground frame                               | `132:528`                                               |
| Sections: Documentation, Playground, Component | `131:539`, `132:539`, `129:1771`                        |
| Component table labels / spec tables (groups)  | in `129:1771`: `table labels`, `spec tables` `133:1155` |

## Properties

- Variants: `variant` (8, default primary), `shape` (solid, outline, textonly; default solid), `size` (xxs…xl; default
  md, left-most column), `disabled`.
- `label` (text), `showLabel` (boolean, off = icon only), `iconLeft` / `iconRight` (booleans), `icon` (instance swap,
  default `Icon/add`; drives both slots).
- Table: column `size`; blocks `shape` × `disabled`; rows `variant` (primary first, so the default sits top-left).

## Decisions

- Set size: the visual props would make ~4,600 variants, so only `variant`, `shape`, `size` and `disabled` are variants
  (288). Approved by the user on 2026-11-10:
  - `iconPosition` is two slots (`iconLeft` / `iconRight`), not a variant.
  - `pill` is a `sizing/radius/round` override on the instance; `fluid` is width Fill.
  - hover, active and focus are not variants. The Color spec table shows them as instance fills bound to the state
    tokens, and focus as a 2px `color/focus-ring` ring with a 2px offset (ring radius `sizing/radius/lg`).
- Spec tables (2026-11-10, user: the set's size columns say nothing about color, and developers need icon sizes per
  size): Size spec (sizes × label / icon left / icon right / icon only, metrics in the column header from `$sizes`) and
  Color spec (variants × states per shape at md). Scenarios: pill · fluid only.
- The label uses the `label-*` text style with a Semi Bold override (code: `typography(label-*, "stronger")`); a style's
  weight wins over a weight variable binding.
- outline: 1px inside stroke with `strokesIncludedInLayout = false`, so it has the same height as solid (code: inset
  box-shadow).
- outline has a `color/surface/default` fill (2026-11-12, user, after the Chromatic review: a transparent outline button
  disappeared on gray surfaces such as Card). Its hover / active fills are the translucent `soft` tones layered over
  that fill (code: `background-image` over `background-color`); the Color spec cells carry both fills. textonly stays
  transparent.
- A neutral solid button uses `neutral/soft` → `soft-hover` → `soft-active` with `neutral/text`, not `neutral/solid`
  (user: neutral must stay close to the page tones).
- disabled: one look for every variant (`surface/disabled`, `border/disabled`, `text/disabled`).
- Radius `sizing/radius/md` (4px): the old Button's `radius-sm` was 4px in the default theme.
- No Examples.
