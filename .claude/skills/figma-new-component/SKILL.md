---
name: figma-new-component
description: Build a new Motif UI component page in Figma from a developer's free-text description, before or while the code is written, for design review. Use when a new component is planned or a component is being migrated to the new tokens and has no Figma page yet. Argument - the component name.
---

# figma-new-component <Component>

The developer describes the component; you design the Figma page. The developer never needs to know Figma.

## Hard rules

Same as [figma-sync](../figma-sync/SKILL.md#hard-rules): the only writable file is "Motif UI Components", follow
[docs/review/figma.md](../../../docs/review/figma.md), get approval before writing, record everything in
`docs/figma/<Component>.md`.

## Steps

1. **Collect the spec:** the developer describes, in their own words, the props and values, defaults, sizes, states
   and behavior. If code already exists, read it instead of asking. Ask only for what decides a visual property;
   never ask Figma questions.
2. **Restate** it as a prop table (prop, type, default, visual effect) and get confirmation.
3. **Propose the Figma structure** and get approval:
   - style-changing props become variants, show/hide props become booleans, icons become instance swaps;
   - Figma-only states (`state: default/hover/focus/…`);
   - private parts (`_<Component>/*`);
   - the set's table: the column property (usually `size`, default first), the blocks and the rows;
   - the spec tables: Size spec (sizes × content variations, metrics from the SCSS size table) and Color spec
     (variants × states per shape; without states, variants as columns × Light · Dark rows), each only when the
     axis exists;
   - the Scenarios tables for real prop interactions (columns = moments or values, cells = instances with content);
   - whether Examples are needed (only for unusual scenarios).
4. **Build**, in order:
   1. parts, then the set (sparse; default variant top-left);
   2. the doc page from the `_Doc/*` blocks: Header, Properties, Variants, Light & Dark, Anatomy, "Not shown in
      Figma";
   3. the Playground (and Examples under it);
   4. the Component section table ([../figma-sync/scripts/component-table.js](../figma-sync/scripts/component-table.js)),
      then the spec tables and the Scenarios tables;
   5. Internal parts.

   Use existing library components (Button, Icon, …) as nested instances.

5. **Hand off** a short summary for the design review: what to look at, open questions.
6. **Apply design feedback** in the same flow, and record each decision in `docs/figma/<Component>.md`.
7. **After the code exists**, run `/figma-sync <Component>` to close any drift.
