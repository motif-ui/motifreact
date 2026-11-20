# Skeleton: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-11 with /figma-new-component from the migrated code (batch 2).

## Nodes

| What                                           | ID                             |
| ---------------------------------------------- | ------------------------------ |
| Page                                           | `171:22`                       |
| Component `Skeleton` (no variants)             | `171:23`                       |
| Sections: Documentation, Playground, Component | `171:209`, `171:221`, `171:27` |

## Decisions

- One component, no properties: the code has one layout (`type="table"`), `tone` is never read and `animation="wave"`
  has no style. Both are on the pre-release cleanup list.
- The pulse is animated (user asked, 2026-11-11): the bars keep their `neutral/soft-hover` fill and get an `OPACITY`
  track 1 → 0.5 → 1 over 2s, linear. Color keyframes only take fixed colors (no variables, so no Dark mode);
  `neutral/soft` is `soft-hover` at half the alpha in both modes, so opacity gives the same two tones. The component's
  and both doc frames' timelines are 2s. Checked by measuring the exported video.
- The Component section has no table (no variants); the component sits on a `color/surface/default` card.
