# Breadcrumb: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-11 with /figma-new-component from the migrated code (batch 2).

## Nodes

| What                                                           | ID                                        |
| -------------------------------------------------------------- | ----------------------------------------- |
| Page                                                           | `174:22`                                  |
| Component `Breadcrumb`                                         | `174:34`                                  |
| Part `_Breadcrumb/Item` (kind: link, text, current)            | `174:33`                                  |
| Sections: Documentation, Playground, Component, Internal parts | `176:444`, `176:474`, `175:38`, `175:307` |

## Properties

- `Breadcrumb` is one component (no variants): `homeIcon` (instance swap, default `Icon/home`), five item slots
  (`item 1` to `item 5`, exposed `_Breadcrumb/Item` instances with `kind` and `label`), `showItem2` to `showItem5`.
- `_Breadcrumb/Item`: `kind` link (has a path), text (no path, also the collapsed `...`), current (last item, no
  separator); `label` text.
- `maxVisibleItems` and `collapsedPosition` are behavior: the Scenarios table shows the collapsed trails (5 items ×
  3 · 2 · 1 × left · right).

## Decisions (user, 2026-11-11)

- The structure (one component, home icon, five item slots with `kind`, collapsing in Scenarios) was approved.

- Links `color/primary/text`, hover `color/primary/text-hover` (new token); items without a path `color/text/softer`
  (they are text, not disabled); the current page `color/text/strong`.
- Text `typography/label-lg` with a Semi Bold override (code: `typography("label-lg", "stronger")`).
- Spacing follows the code: each item has an 8px right padding and no gap between items; the separator sits 8px after
  the label; the home icon has an 8px right margin.
