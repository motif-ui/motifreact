# Switch: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-19 with /figma-new-component from the migrated code (batch 5).

## Nodes

| What                                           | ID                                         |
| ---------------------------------------------- | ------------------------------------------ |
| Page                                           | `344:22`                                   |
| Component set `Switch` (16 variants)           | `344:106`                                  |
| Doc frame                                      | `344:552`                                  |
| Playground frame                               | `344:616`                                  |
| Sections: Documentation, Playground, Component | `344:23`, `344:24`, `344:25`               |
| Component table labels / spec tables (groups)  | in `344:25`: `table labels`, `spec tables` |

## Properties

- Variants: `size` (md default, xs, sm, lg), `checked`, `disabled`. `label` (text) and `showLabel` (boolean, on).
- The track (`slider`) pads sizing/space/2 and the thumb's travel (12 · 16 · 20 · 24) on its end: off pads the right,
  checked pads the left, so the thumb sits at the end like the code's translateX.
- Keyboard focus is not a variant: every variant has a hidden `focus ring` layer in `slider` that the Color spec's
  focus cells turn on. Switch has no hover color, so there is no hover cell.
- Table: column `size` (md first); blocks `checked=false`, `checked=true`; rows default, disabled.

## Decisions (user, 2026-11-19)

- The off track is `color/neutral/solid` (darker than today's light gray, for contrast); the off thumb is
  `color/surface/default` (dark in dark mode); checked: `color/primary/solid` with a `color/on-primary` thumb.
- Disabled and readOnly: track `color/surface/disabled`, thumb and label `color/text/disabled`.
- The switch is keyboard accessible (role switch, Space toggles) with a 2px `color/focus-ring` ring 2px outside the
  track; the input is visually hidden and not drawn in Figma.
