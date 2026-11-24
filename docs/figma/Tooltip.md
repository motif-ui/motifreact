# Tooltip: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-23 with /figma-sync from the migrated code (batch 6).

## Nodes

| What                                           | ID                           |
| ---------------------------------------------- | ---------------------------- |
| Page                                           | `384:22`                     |
| Component set `Tooltip` (64 variants)          | `384:346`                    |
| Doc frame / Playground frame                   | `385:138` / `385:190`        |
| Sections: Documentation, Playground, Component | `384:23`, `384:24`, `384:25` |

## Properties

- Variants: `size` (md default) × `position` (8, top default) × `inverseColors`. Texts `title`, `text`; boolean
  `showTitle`.
- Each variant is auto-layout (the `pointer` row or column next to `textWrapper`), so the pointer follows the box when
  the title is hidden.
- Default: `color/surface/contrast` (new token, 2026-11-23) with elevation/2; inverseColors `color/surface/sunken`, flat.
  The code's `variant` (light / dark) was removed in batch 6 (breaking).
