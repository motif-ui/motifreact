# Link: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-11 with /figma-new-component from the migrated code (batch 2).

## Nodes

| What                                           | ID                                         |
| ---------------------------------------------- | ------------------------------------------ |
| Page                                           | `171:958`                                  |
| Component set `Link` (6 variants)              | `171:995`                                  |
| Sections: Documentation, Playground, Component | `173:377`, `173:389`, `172:22`             |
| Component table labels / spec tables (groups)  | in `172:22`: `table labels`, `spec tables` |

## Properties

- Variants: `size` (md default, sm, lg), `disabled`. Table: column `size`, rows default / disabled.
- `label` (text), `iconLeft` / `iconRight` (booleans, both off by default; code default iconPosition is right),
  `icon` (instance swap, default `Icon/arrow_forward`; external links use `Icon/external`).
- `underline` is not a variant: underline the label as a text override (it changes one thing).

## Decisions (user, 2026-11-11)

- Hover color `color/primary/text-hover` (new generator token `{intent}-text-hover`, one step further from the surface).
- Keyboard focus: a 2px `color/focus-ring` ring 2px outside (`:focus-visible`), like Button; the old color change on
  focus is gone.
- Disabled: `color/text/disabled` (one disabled look, like Button).
- hover and focus are not variants: the Color spec shows them as overridden instances (focus as a ring frame).
