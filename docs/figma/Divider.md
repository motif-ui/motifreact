# Divider: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-11 with /figma-new-component from the migrated code (batch 2).

## Nodes

| What                                           | ID                                                   |
| ---------------------------------------------- | ---------------------------------------------------- |
| Page                                           | `169:22`                                             |
| Component set `Divider` (18 variants)          | `169:64`                                             |
| Sections: Documentation, Playground, Component | `170:245`, `170:255`, `169:65`                       |
| Component table labels / spec tables (groups)  | in `169:65`: `table labels`, `spec tables` `169:130` |

## Properties

- Variants: `size` (md default, sm, lg), `orientation` (horizontal default, vertical), `shape` (solid default, dashed, dotted).
  Table: column `size`, blocks `orientation`, rows `shape`.
- `size` is a variant although it only changes the thickness: the line is a stroke, so its weight and the component's
  height (width when vertical) would be two separate bindings to change. As a variant it is one choice. The user approved it as a variant (2026-11-11).
- `gap` is not in Figma: it is the outer margin (layout); the Size spec header lists it.
- A horizontal instance is resized to its container's width, a vertical one to its height.

## Decisions

- The line is the `line` rectangle's inside stroke on one side (top or left), weight bound to `sizing/1 · 2 · 4`,
  color `color/border/soft` (user, 2026-11-11). The component's height (width) is bound to the same sizing token.
- Dash patterns approximate the browser: dashed 3× the width, dotted 1× (not bindable).
- No Color spec (one color, shown in Light & Dark), no Scenarios, no Examples.
