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
- The pulse (`neutral/soft-hover` ↔ `neutral/soft`, 1s alternate) is not animated in Figma; the bars show the first
  color and the doc's "Not shown in Figma" note describes it.
- The Component section has no table (no variants); the component sits on a `color/surface/default` card.
