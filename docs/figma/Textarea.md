# Textarea: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-24 with /figma-sync from the migrated code (input family token migration, batch 7).

## Nodes

| What                                           | ID                           |
| ---------------------------------------------- | ---------------------------- |
| Page                                           | `403:22`                     |
| Component set `Textarea` (80 variants)         | `403:346`                    |
| Doc frame / Playground frame                   | `404:56` / `404:126`         |
| Sections: Documentation, Playground, Component | `403:23`, `403:24`, `403:25` |

## Properties

- Variants: `size` × states × `filled` × `maxLength` (true: the counter under the field, the field's bottom corners
  square). Text `value`, `placeholder`, `counter` (bound in the filled variants; empty ones show `0/100`).
- `rows` (4) is the `textArea` layer's fixed height: 4 × line height + padding + 2px border (xs 74, sm 94, md 114,
  lg 118; the counter adds its line height + 1).
- disabled and readOnly share one look, as in code (`readOnly` maps to the `disabled` class); the placeholder is
  `color/text/disabled-soft`.
- Focus is a Color spec override of the `textArea` stroke only; the counter keeps its border.
- Table: column `size`; blocks `maxLength=false` / `true`.
- readOnly has its own look (2026-11-24): `color/surface/subtle` + `color/border/soft`, text, placeholder and icons keep
  their normal colors; focus and validation borders still show. The readOnly variants copy their default twin's colors.
