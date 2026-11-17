---
name: figma-sync
description: Sync a migrated Motif UI component's Figma page with its code. Use when a change touches a migrated component's props, styles or tokens, when the review says "Figma sync needed", or when asked to build or update a component page from code. Argument - the component name.
---

# figma-sync <Component>

Keeps the "Motif UI Components" Figma library identical to the code. Developers never edit Figma or write specs for
it; this skill does the Figma side.

## Hard rules

- Write only to the file `tc4bv51WElCIfZD6WjHqWL` ("Motif UI Components"). Never open or edit any other Figma file;
  the old active library is strictly read-only.
- Code is the source of truth. Every layout, naming and color decision follows
  [docs/review/figma.md](../../../docs/review/figma.md).
- Read [docs/figma/README.md](../../../docs/figma/README.md) and `docs/figma/<Component>.md` first; update the
  component file at the end.
- Load the `figma:figma-use` and `figma:figma-generate-library` skills before any `use_figma` call. Keep calls small
  and sequential; re-read state after a failure.
- Summarize the planned Figma changes and get approval before writing.
- Stop and ask for a design sign-off when the change is visual beyond existing tokens and patterns: a new token, a
  new part, a changed layout or look. A new prop value or a token swap within the same role does not need it.
- Never edit product variables or styles by hand; token changes go through `npm run figma:mtf-tokens`.

## Steps

1. **Read the code:** `types.ts` and the component's destructuring (props, defaults), the `.module.scss` (classes,
   tokens per size and state), and behavior that Figma cannot show.
2. **Read Figma (MCP):** component set properties and variants, default variant, parts, the doc page (Properties
   rows, Variants, Light & Dark, Anatomy, notes), the Playground, the Component section table and the Scenarios
   tables.
3. **Diff and report** in a short list:
   - props missing or extra in Figma; changed defaults or values;
   - token or size changes per part;
   - variants to add or remove; Properties rows, Anatomy lines or notes that are now wrong;
   - Scenarios or Examples that no longer match the behavior.
4. **Apply after approval**, in this order:
   1. parts;
   2. the set, then re-layout the Component table with [scripts/component-table.js](scripts/component-table.js);
   3. the doc rows and notes, and the set description;
   4. the spec tables (Size spec metrics come from the SCSS size table, so update them with any size change) and the
      Scenarios cells;
   5. Playground, if the default changed.
5. **Verify** with a page screenshot (a section screenshot omits grouped labels). Fix and re-check only what changed.
6. **Record** decisions and new node IDs in `docs/figma/<Component>.md`. If a Figma property was renamed or removed,
   add a "Figma migration" note: consumers' instances lose that override on library update.
7. **Close** with a summary for the PR: what changed in Figma, and anything that needs design sign-off.
