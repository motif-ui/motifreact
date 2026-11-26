# PinCode: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-24 with /figma-sync from the migrated code (input family token migration, batch 7).

## Nodes

| What                                           | ID                           |
| ---------------------------------------------- | ---------------------------- |
| Page                                           | `405:22`                     |
| Component set `PinCode` (80 variants)          | `405:1226`                   |
| Doc frame / Playground frame                   | `406:56` / `406:126`         |
| Sections: Documentation, Playground, Component | `405:23`, `405:24`, `405:25` |

## Properties

- Variants: `size` × states × `circle` × `filled`. Each variant holds six boxes (`item 1` … `item 6`) and an
  `item space` after the third, shown by the `space` boolean.
- Boxes are plain frames (not field instances): padding `sizing/space/4 · 6 · 8 · 10`, a `sizing/16 · 20 · 24 · 28`
  square text centered (the line height), 1px stroke not in layout (24 · 32 · 40 · 48, a field's height), gap
  `4 · 8 · 12 · 16`.
- Item length, masked characters (• while typed, `*` or the number when masked and disabled) and a single disabled
  box are layer overrides; the Parts spec shows each.
- Table: column `size`; blocks `circle=false` / `true`.
- size × state × circle × filled stay crossed: a missing combination makes Figma jump to the nearest variant when a
  prop is switched (size=sm + disabled would fall back to md).
- readOnly has its own look (2026-11-24): `color/surface/subtle` + `color/border/soft`, text, placeholder and icons keep
  their normal colors; focus and validation borders still show. The readOnly variants copy their default twin's colors.
