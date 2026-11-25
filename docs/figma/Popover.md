# Popover: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-23 with /figma-sync from the migrated code (batch 6).

## Nodes

| What                                           | ID                           |
| ---------------------------------------------- | ---------------------------- |
| Page                                           | `381:22`                     |
| Component set `Popover` (48 variants)          | `381:186`                    |
| Doc frame / Playground frame                   | `383:65` / `383:126`         |
| Sections: Documentation, Playground, Component | `381:23`, `381:24`, `381:25` |

## Properties

- Variants: `placeOn` (8, bottom default) × `spacing` (callout, withGap, noSpace) × `elevated`. Text: `content`.
- `elevated` is a variant, not a boolean: it hides the border and adds elevation/2 (a boolean cannot hide one layer and
  show another).
- `inverseColors` is not a variant: set the instance's Semantic mode to the other mode (Figma cannot express "the
  opposite of the page"). The code's `variant` (light / primary / dark) was removed in batch 6 (breaking).
- The caret is a 12 × 10 vector per side; the non-elevated one has the border and a `caret base` strip that hides the
  box border under it.
