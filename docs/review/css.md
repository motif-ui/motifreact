# CSS rules

General rules for SCSS, independent of the design tokens (those are in [design-tokens.md](./design-tokens.md)).
Apply them to the lines a change adds or modifies in any `.scss` file. Do not flag untouched lines of existing files.

Stylelint enforces part of this: no ID selectors everywhere, and for migrated components (the `overrides` list in
`stylelint.config.mjs`) no `!important`, no type-qualified selectors, specificity at most `0,3,0` and at most 3 compound
selectors. The review covers the rest, and files outside that list.

Stylelint skips selectors that contain SCSS interpolation (`&.#{$size}`, `.#{$variant}`), so loops over sizes and variants
are never checked by lint. Review them by hand: work out the compiled selector and check it against these rules.

## 0. Every component module has a `.Root` rule (blocking)

**This is a release blocker, not a style note. Always check it first, on every `.scss` change.**

- The build turns `.Root` into the component's public class (`mtf-[module]`), and `sanitizeModuleRootClasses` always adds
  `styles.Root`. Without a compiled `.Root` rule the component silently loses that class: consumer overrides, global
  selectors and the `mtf-*` naming all break, and nothing errors.
- An empty `.Root {}` is not enough: Sass drops empty rules. When `.Root` has nothing of its own, keep it with the
  placeholder mixin:

  ```scss
  .Root {
    @include retain-scoped-class;
  }
  ```

- Flag as blocking: a removed or renamed `.Root`, a `.Root` whose only content moved elsewhere, or a refactor that flattens
  everything out of `.Root`.
- `src/tests/cssModuleRoot.test.ts` compiles every module used with `sanitizeModuleRootClasses` and fails when `.Root` is
  missing from the output. A failure there is never fixed by changing the test.

### File order

`.Root` is the first rule of the file. Only the module setup comes before it: `@use`, SCSS variables, lists and maps,
`@mixin` and `@function` definitions. Element rules, size or variant loops and keyframes come after `.Root`.

```scss
@use "@styles" as *;

$variants: "neutral", "primary", …;
$sizes: (("xs", 2, 8), …);

.Root { … }        // first rule

.track { … }
@each $size … { … }
```

Flag a loop, element rule or keyframes placed above `.Root`.

## 1. Keep specificity minimal

Section 0 comes first: never flatten a selector out of `.Root` if that leaves `.Root` empty.

- When `.Root` has nothing of its own, attach a simple rule to it, typically a root modifier, even though this adds one class
  of specificity: `.Root.indeterminate { … }` instead of `.indeterminate { … }`. Keeping `.Root` generated is worth that
  cost.
- A single rule on `.Root` is written flat (`.Root.indeterminate { … }`), not as a one-item nest (`.Root { &.indeterminate
{ … } }`). Nest under `.Root` only when several rules share it (see the grouping rule below).
- Only when there is truly nothing to nest, use `@include retain-scoped-class;`.

- Style with a single class wherever possible. Add nesting only when the relation is the point (a state or modifier on the
  block, a child that only exists inside it).
- No ID selectors and no element-qualified classes (`div.item`).
- A tag selector under a class is fine when the parent holds a single element of that tag and nothing needs to tell them
  apart: `.noData label` instead of a new `.noDataLabel` class. Do not add classes only to shave specificity; give a part
  its own class when the parent holds several elements of the same tag, or the part is reused elsewhere.
- Flag selectors deeper than needed, e.g. `.root .input .inputText` where `.inputText` alone would match the same element.
- When a rule fails to apply, fix the order or the structure; never raise specificity to win (repeated classes, extra parent
  classes, `:is()`/`:where()` tricks used for weight).
- Group rules that share a parent selector under one nested block instead of repeating the parent:

  ```scss
  // Flag
  &.expanded .input { … }
  &.expanded .arrowDown { … }

  // Prefer
  &.expanded {
    .input { … }
    .arrowDown { … }
  }
  ```

  Grouping only changes how the source reads; the compiled selectors and their specificity stay the same.

- Keep everything about a block in its own nest: states (`&:hover`), child tags (`input`, `label`) and modifiers
  (`&.selected`). A modifier that changes a child is written inside the block as `&.modifier child`, so it wins over the
  child's base rule by structure, not by its position in the file:

  ```scss
  .option {
    &:hover { … }

    input { … }

    label { … }

    &.selected {
      label,
      .iconSelected { … }
    }
  }
  ```

  The `.labelText` class stays inside that label because the label holds two `span`s (the text and the icon); without the
  class the two could not be told apart.

- Root modifiers that change a single element are written inside that element's block with a parent selector
  (`.modifier &`). A modifier or size that changes several elements stays grouped around the modifier:

  ```scss
  .circle {
    stroke-linecap: round;

    @each $variant in $variants {
      .#{$variant} & { stroke: … }   // compiles to .primary .circle
    }

    .countdown & { animation-duration: …; }
    .paused & { animation-play-state: paused; }
  }

  @each $size … {
    .#{$size} {                      // track, circle and text all change: grouped by size
      .track, .circle { … }
      .text { … }
    }
  }
  ```

  Watch the order: `.paused &` is "a `.circle` inside `.paused`", while `&.paused` is "a `.circle` that also has
  `.paused`" and matches nothing here. Flag `&.modifier` inside an element block when the modifier lives on the root.

## 2. BEM structure

CSS modules already scope class names (`mtf-{file}--{class}`), so BEM applies to the structure, not to `__`/`--` in names:

- **Block:** the component root class (`.Root` or the module's root class).
- **Element:** a flat class per part (`.input`, `.selectionChip`, `.closeIcon`), named after what the part is, in camelCase.
  Not named after its position or its look (`.leftBox`, `.blueText`).
- **Modifier:** a separate class for a size, variant or state (`.lg`, `.primary`, `.disabled`, `.expanded`) placed on the block
  or on the element it changes.
- Flag elements styled through a deep structure path (`.dropdown li div span`), and modifiers expressed as new element
  classes (`.inputDisabled` instead of `.input` + `.disabled`). A single tag directly under its block or element class is
  allowed (see section 1).

## 3. No `!important`

Flag every new `!important`. If something cannot be overridden without it, the selector structure is the problem
(see section 1).

## 4. Declare a value once per file

Within one file, a property of an element should be set in one place. Avoid setting a value on a class and then overriding it
with another class of the same file whenever possible:

- For values that change by size, variant or state, set the property only inside the modifiers, with no base value that
  they all override (example: each ProgressCircle variant sets the arc `stroke`; there is no default stroke).
- Use a component custom property (`--mtf-{component}-{name}`) only when one value feeds several properties or parts, or is
  meant as a public override point. A custom property used in a single place is an extra indirection; flag it.
- Interaction and state pseudo-classes (`:hover`, `:focus`, `:disabled`) that replace the default are acceptable.
- Flag a property set on a class and redeclared for the same element by another class in the same file when the first value
  is never used on its own.

## 5. Lists and maps hold only what varies

When every entry of an SCSS list, map or table column shares the same prefix or suffix, store only the varying part and add
the fixed part where the value is used. A one-off exception gets its own rule next to the loop, not a map entry for every item.

```scss
// Flag: every value repeats "-solid"
$variants: ("primary": "primary-solid", "secondary": "secondary-solid", …);

// Prefer
$variants: "primary", "secondary", …;

@each $variant in $variants {
  .#{$variant} .circle { stroke: var(--mtf-color-#{$variant}-solid); }
}
```

Inside a loop over a list or map (sizes, variants…), the generated rule holds only the properties that come from that list.
Everything that is the same for every entry goes in the element's own rule outside the loop:

```scss
// Flag: font-size does not depend on the variant
@each $variant in $variants {
  .x.#{$variant} { color: …; font-size: 16px; }
}

// Prefer
.x { font-size: 16px; }

@each $variant in $variants {
  .x.#{$variant} { color: …; }
}
```

The same applies to role names in size tables (`"label-sm", "label-md"` → `"sm", "md"`, see design-tokens.md section 4).
Flag lists and maps whose entries repeat a fixed part.
