# Figma rules

The Figma library "Motif UI Components" mirrors the code. Code is the source of truth for tokens and behavior; Figma is the
visual specification of migrated components. These rules keep the two from drifting apart.

## 1. Tokens

- Tokens reach Figma only through the generator. When `src/lib/styles/tokens/themes/*.json` or `src/scripts/tokens` changes the
  generated files, run `npm run figma:mtf-tokens` and import the bundled scripts into the library
  (`src/scripts/tokens/figma/importTokens.figma.js` explains how). The import is idempotent: it updates by name.
- Never edit variables or text/effect styles by hand in Figma; the next import overwrites them. A change starts in the seeds.
- Flag a PR that changes generated token files without mentioning the Figma import.

- The doc page template (`_Doc/*` blocks, page backgrounds, cards, captions) uses the hidden "Docs" collection: Motif brand
  colors from the Storybook theme (`.storybook/motifTheme.ts`, `manager-head.html`) and the `_Doc/Logo` component. It is not
  a product token set and the token import does not touch it. Component examples and Light/Dark panels keep product tokens.

## 2. Components

- When a change alters what a migrated component looks like (a token, size, spacing, state or a new prop value), the Figma
  component is updated in the same piece of work. Flag a visual change to a migrated component whose PR does not mention it.
- Figma names follow the code exactly, in English: the component set is named like the code export (`ProgressCircle`),
  properties and values are the code props (`size: xs/sm/md/lg`, `variant: neutral/primary/…`), layer names follow the SCSS
  classes (`input`, `dropdown`, `option`).
- Style-changing props are true/false variant properties; props that only show or hide a part are boolean properties; icons
  are instance-swap properties. Interaction states that are not props use `state: default/hover/focus` and say so in the
  description.
  - Keep the variant axes to the props that define the look together. A prop that changes one thing on its own is not a
    variant axis, or the set repeats the same component along it:
    - a single on/off layer (`bordered`, `elevated`): a boolean showing a `border` or `shadow` layer;
    - only the width (AlertModal `size`): the instance width bound to the size tokens;
    - a position of a part (`iconPosition`): two slots with booleans;
    - a radius or width option (`pill`, `fluid`): an instance override;
    - interaction states: Scenarios or Color spec cells with fills bound to the state tokens.
  - Write each mapping in the set description and the Properties table (Button, AlertModal).
- Every fill, stroke, radius, spacing and text style is bound to a variable or style; no hard-coded values.
- Figma takes the left-most variant of a set as its default. Put the column of the code's default value first in the set
  (Select: md, xs, sm, lg; ProgressCircle: sm, xs, md, lg, xl); doc page matrices keep the natural order. Figma picks
  the default row by row (a variant must sit clearly above the others to win), so there is no way to keep the natural
  order in the set. Lay the set out as a table so it scales to components with many properties:
  - one column property (usually `size`); each variant centered in its column;
  - the column band has exactly the set's x and width; the column property is a chip (same as the block chips) inside
    it at its far left (8px in), at least 8px from the first column's value (widen the set's left padding if not);
    the band shows only the values, the default one as `md (default)`, in the same style as the row values
    (`typography/label-sm`, `docs/text-strong`);
  - a column band above the set and a row rail on its left, both `docs/background` with a `docs/border` stroke and
    radius 8; the rail stays narrow;
  - properties that group rows into blocks (`multiple`, `filterable`, …) are a block chip in the rail
    (`docs/brand-soft` fill, `docs/brand-strong` text, radius 6), one `prop=value` per line, centered in the rail
    above the block's first row, with a `docs/border` divider across the table between blocks; more block
    properties make the chip taller, never the table wider;
  - rows show only the value (`default`, `focus`, `open`), right-aligned in the rail next to the set, without the
    property name; rows of boolean modifiers show the property name (`error`, `disabled`), since `true` alone says
    nothing;
  - rows align to the center (ProgressCircle) or, when variants open downwards, to the top (Select);
  - the labels are a group named `table labels` inside the Component section (a frame would show its name), the
    bands at the bottom of the group; the set sits 12px from both the column band and the row rail.
- What Figma cannot show (behavior, animation timing, computed geometry) goes into the component description and the doc
  page, never into a hard-coded approximation.
- Every prop and prop combination that changes how a component looks is visible: in **Variants** (the property matrix
  on the doc page and the set's own table) or in **Scenarios**. Examples never replace them.
- **Scenarios** live in the Component section, under the set's table (a `docs/border` divider and a "Scenarios"
  heading in between), as one group named `scenario tables`. Each scenario is a small table in the same design as the
  set's table: a title, a column band with the moments or values (`empty · value · open · open · typing`,
  `0 · 25 · 50 · 75 · 100`, …), a rail with the block chip (`multiple=true` / `filterable=true`), a
  `color/surface/default` panel holding instances of the set with their content (value, typed query, filtered list,
  arc length), and a muted note under it wrapped to the panel width. Instances only, never detached copies, so Dev
  Mode shows their tokens. The doc page has no Scenarios section.
- **Spec tables** come first under the set (heading "Spec"), before Scenarios. The set's table is laid out for Figma
  (every variant once); developers read the spec tables. A table only pairs axes that affect each other, so every cell
  shows something its row and column change together; independent axes get separate tables:
  - **Size spec**: columns are the sizes in natural order, each column header lists the size's metrics taken from the
    component's SCSS size table (height, padding, gap, icon, text style); rows are content variations that size
    changes (label only, icon left, icon right, icon only; chips; long text…).
  - **Color spec**: rows are the color variants, columns the states (default, hover, active, focus, disabled), one
    block per shape, at the default size. A component without interaction states uses the axis that does change its
    color, the mode, and is transposed: the variants are the columns and Light · Dark the two rows, so the table is
    wide and short like a one-row Component table (ProgressCircle, AlertModal). A component without color variants
    uses its states as columns and its content as rows (Select). States that are not variants of the set are
    instance fills bound to the state tokens; focus is a ring frame with the focus-ring token.
  - Columns are as wide as their widest cell plus the cell padding, so small instances sit close together. A table
    should not run past the set's table unless its columns need the room.
  - Scenarios then hold only real prop interactions (Select's `multiple` × `filterable`, Button's pill and fluid).
  - Skip a spec table whose axis does not exist (no sizes, no color variants). One group `spec tables` holds the spec
    and Scenarios tables.
- Every component has a **Playground**: its own frame with one live instance of the default variant on an empty stage
  (tall enough for open states) for trying the properties.
- **Examples** only where a component needs it: unusual scenarios a developer must see that Variants and Scenarios
  do not cover. Simple components have none.
- Pages: inside each group of the page list (the pages after a `————` divider: Foundations, Components, Internal, and
  the ones before the first divider) the pages are in alphabetical order (user, 2026-11-11). A new or renamed page
  goes to its alphabetical place; [sort-pages.js](../../.claude/skills/figma-sync/scripts/sort-pages.js) re-sorts the
  whole list. Flag a page out of order.
- Component pages, from left to right: the **Documentation** section (the doc frame), the **Playground** section (the
  Playground frame, with the Examples frame under it when the component has examples), the **Component** section (the
  set's table, then the Scenarios tables), then **Internal parts** (private `_Name/*` components, not repeated in the
  doc).
  - Each is a labelled Section with no fill (a fill never matches the page canvas exactly) and no stroke (Figma adds a
    10% one by default; clear it).
  - A section fits its content with no side or bottom margin: content starts at its left edge, 72px from its top,
    which leaves room for the section and frame name labels. Sections sit 160px apart.
  - The page canvas is light lavender `#ECEAF1`. Doc frames, component sets and parts get a 1px `docs/border` stroke
    (Playground and Examples frames have none); component sets also get a `color/surface/default` fill so translucent
    tokens read correctly.
- Surface colors: every surface that holds a component instance or the component set (doc Variants card, Light &
  Dark panels, Anatomy preview, Playground stage, Examples cards, the set and its parts, Scenarios panels) is
  `color/surface/default`, the product's own surface token, so it follows the mode (white in Light) and matches the
  white doc cards. Surfaces that hold only text and tables (Properties, Anatomy without a preview) are `docs/surface`;
  the column bands and row rails of the Component and Scenarios tables are `docs/background`. Never
  `color/surface/canvas` or a raw color for these.
- A variable-bound fill on a Section or an instance needs the variable's resolved color as its base color, or it renders
  black in exports.
