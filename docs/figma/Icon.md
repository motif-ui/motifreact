# Icon: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-20 with /figma-sync from the migrated code (Icon + IconButton token migration).

## Nodes

| What                                                           | ID                                                      |
| -------------------------------------------------------------- | ------------------------------------------------------- |
| Page                                                           | `361:288`                                               |
| Component set `Icon` (9 variants)                              | `361:317`                                               |
| Doc frame                                                      | `361:322`                                               |
| Playground frame                                               | `361:381`                                               |
| Sections: Documentation, Playground, Component, Internal Icons | `361:318`, `361:319`, `361:320`, `361:321`              |
| Component table labels / spec tables (groups)                  | in `361:320`: `table labels`, `spec tables` (`366:445`) |
| Icons gallery frame (40 `Icon/<name>` components)              | `363:379`                                               |

## Properties

- Variant: `variant` (inherit default, neutral, primary, secondary, accent, info, success, warning, danger). `inherit`
  stands for no variant: in code the icon takes the surrounding text color; Figma draws it with `color/text/default`.
  The others: `color/{variant}/solid`.
- `icon` (instance swap, `icon#361:0`) on the `glyph` layer, preferred values: the 40 embedded glyphs.
- `size` is not a variant (docs/review/figma.md: a prop that only changes the dimensions): the instance width and height
  bind to `sizing/16 · 18 · 20 · 22 · 24 · 28 · 32 · 40 · 52 · 64` (xxs … 5xl, md 22 default). The glyph scales with the box.
- Table: column `variant` (inherit first, equal column widths); one row `md`.

## Embedded icons

- The 40 `Icon/<name>` glyph components (the `motif-icons-default` font in `src/lib/components/Motif/Icon`) moved from
  the deleted Internal page `_Icons` to this page's Internal Icons section (IDs unchanged, so every instance in the file kept
  its link). Their descriptions no longer say temporary.
- `src/lib/components/Icon/motif-icon-names.ts` (274 names) is the app icon set loaded from the CDN (`motif-icons.css`),
  used only by stories and tests. It is the consumer's set and is not in Figma (note on the doc page).

## Decisions (user, 2026-11-20)

- The icon keeps no color of its own in code (inherits); a default color was discussed and rejected.
- Size is the instance size bound to sizing variables, not a variant axis.
