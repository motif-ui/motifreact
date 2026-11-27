# Form: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-24 with /figma-sync from the migrated code (Form and Grid token migration, batch 8).

## Nodes

| What                                           | ID                           |
| ---------------------------------------------- | ---------------------------- |
| Page                                           | `434:22`                     |
| Component set `Form` (64 variants)             | `434:3757`                   |
| Doc frame / Playground frame                   | `437:1526` / `437:1597`      |
| Sections: Documentation, Playground, Component | `434:23`, `434:24`, `434:25` |

## Properties

- Variants: `size` × `formOrientation` × `labelOrientation` × `buttonPosition` (right default).
- `title` + `showTitle`: text-md · lg · xl · xxl strongest for xs … lg (fixed 2026-11-24: it was inverted, lg 16px).
- `enableClearButton`: a neutral Clear button; the buttons are exposed (submit label, alternate buttons).
- Two exposed FormField instances. In a horizontal Form with vertical labels the submit area's top padding is the
  label line plus its gap (a number: Figma cannot add two variables).
- `alternateButtons` (boolean) shows one exposed neutral outline button before Clear. The Spec has a Submit area
  table: every formOrientation × labelOrientation with Submit, Clear + Submit, all buttons and fluid.
- The title had no size in code: `h2 &` compiled to `h2 .title` and never matched, so browsers' default heading sizes
  showed. Fixed 2026-11-24 with a size class on the title.
- Doc Variants: every formOrientation × labelOrientation at md, each on a plain card.
