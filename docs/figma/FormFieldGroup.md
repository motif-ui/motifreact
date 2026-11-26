# FormFieldGroup: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-24 with /figma-sync from the migrated code (Form and Grid token migration, batch 8).

## Nodes

| What                                           | ID                              |
| ---------------------------------------------- | ------------------------------- |
| Page                                           | `432:531`                       |
| Component set `FormFieldGroup` (80 variants)   | `432:2135`                      |
| Doc frame / Playground frame                   | `436:742` / `436:813`           |
| Sections: Documentation, Playground, Component | `432:532`, `432:533`, `432:534` |

## Properties

- Variants: `size` × `orientation` × `labelOrientation` × the four states; label, helper and `*` as FormField.
- Three exposed Checkbox items in `groupItems`; no wrap by default (code `wrap` is false), set the layer's wrap for
  `wrap`. Width 660 so lg items with a horizontal label fit.
- In a form field every Checkbox / Radio gets its size's vertical padding above and below (code `inFormField`):
  groupItems has that padding, and column items are `gap + 2 × padding` apart. The horizontal label sits the padding
  lower (`space-4 · 6 · 8 · 10`), level with the first item, as in code.
