# Design token rules

They cover what stylelint cannot see: whether the chosen token fits the element's role.

**Scope (during the migration):** apply these rules only to migrated components, plus the token generator
(`src/scripts/tokens`). A component is migrated when its SCSS uses `--mtf-*` variables after the change (this includes a PR
that migrates it) or its variant prop uses `VariantV2`. Do not apply them to components that still use only the old
`--theme-*` / `--base-sizing-*` / `--typography-*` layer, and do not ask those to migrate. Once every component has migrated,
this scope note is removed and the rules apply everywhere.

The generator (`src/scripts/tokens/buildTokens.ts`) and the generated CSS (`src/lib/styles/tokens/generated/themes/*.css`) are
the source of truth for token names. If a rule here and the generator disagree, flag the mismatch.

Themes: every theme has a seed file in `src/lib/styles/tokens/themes/` and its own generated CSS with the same token names
(the palette is named after each theme's anchor steps). `legacy` keeps the old colors for existing users (`secondary` is the
old gray) and ships in every theme file (`default-theme.css`, `papyrus.css`); `basic` is the first theme of the new system,
does not ship until the stable release, shows in the token compare screens and is the one Figma uses. Components never depend
on a theme: they only read token names, so a rule that holds for one theme holds for all.

## 1. Scope and mixing

- Migrated components use only `--mtf-*` variables. Flag any new `--theme-*`, `--base-sizing-*` or `--typography-*` variable
  in a file that already uses `--mtf-*`; one file must not mix the old and new layers.
- Do not review `src/lib/styles/tokens/compare/baseline/**`. Those are frozen copies of the pre-migration components and are
  meant to stay old. Flag any change there other than import path fixes.
- Never edit `src/lib/styles/tokens/generated/*` by hand. Changes go through the generator, then `npm run build:mtf-tokens`.
  Flag a generated file that changed without a matching generator change.
- Shared files only gain new names during the migration: `src/lib/styles/*.scss` (mixins, functions), `src/lib/types.ts`
  and the theme CSS. Flag a change to the behavior of an existing mixin, function, type or variable; the migration adds
  a new one next to it (`typography` next to `font`, `number-to-px` next to `add-unit`, `VariantV2` next to `Variant`), and
  the old one is removed once every component has migrated.
- A migration changes the component in place, in one PR: the pre-migration code moves to
  `src/lib/styles/tokens/compare/baseline/<Name>` (styles renamed `<Name>Baseline.module.scss`) so the compare screen
  keeps showing today's look. Flag a new `<Name>V2` clone in `src/lib/components`.

## 2. No raw values

Flag literal colors (`#hex`, `rgb()`, `hsl()`, named colors except `transparent`/`currentColor`), literal lengths for spacing
or sizes (`8px`, `0.5rem`), literal `font-size`/`line-height`/`font-weight`, literal `box-shadow` and literal `border-radius`.
Allowed: `0`, percentages, `auto`, `inherit`, unitless multipliers, transforms and durations.

## 3. Spacing vs. fixed sizing

There are three numeric scales and they behave differently:

| Token                  | Use for                                                                     | Follows the theme's space seed |
| ---------------------- | --------------------------------------------------------------------------- | ------------------------------ |
| `--mtf-sizing-space-N` | padding, margin, gap, inset, top/right/bottom/left offsets between elements | yes                            |
| `--mtf-sizing-N`       | an element's own size: width, height, border width, max-height              | no                             |
| `--mtf-sizing-icon-*`  | an icon beside text: `icon-{size}` of the component's size or text step     | no (follows the font seed)     |

- N is the px value in the default theme for both scales (`space-8` = 8px, `sizing-8` = 8px). The value is what Figma shows.
- Stylelint already rejects `--mtf-sizing-N` in spacing properties. Review still catches what lint cannot see:
  - spacing hidden inside `calc()`, SCSS variables, maps or mixins;
  - `number-to-px($n)` used for spacing (it multiplies the fixed 1px and ignores the space seed);
  - `add-unit($n)` in a migrated component: it reads the old `--base-sizing-1x`; use `number-to-px($n)`;
  - `--mtf-sizing-space-N` used for a width, height or icon size.
- `sizing-0` and `sizing-1` are allowed in spacing properties: there is no 1px spacing step, a 1px value is a hairline.

## 4. Typography

Text styles come from `@include typography($step-or-role, $weight)`. Flag the old `font` mixin in migrated components, and
flag `font-size`/`line-height`/`font-weight` set from separate tokens instead of the mixin.

Where the text comes from depends on whether the component has a size prop:

| Component                                                                  | Text from                                                             | Example                                             |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------- |
| Has a size prop: the text grows with the component (button, chip, select…) | The text scale `text-3xs … text-8xl` plus a weight, in the size table | `typography("text-#{$labelStep}", "strong")`        |
| Fixed size: the text is content (alert, modal title, data view, timeline)  | A role: `label-*`, `body-*`, `heading-*`, `display-*`                 | `typography("heading-h5")`, `typography("body-md")` |

- A text step has no weight of its own, so it always takes one (`regular`, `strong`, `stronger`…); the mixin fails the
  build without it.
- Flag a size table that uses a role (`typography("label-#{$size}")`); it must use the text scale. `npm run check:scss`
  catches a role with an interpolated step.
- Flag a fixed-size component that uses a text step; it takes the role that names what the text is: `label-*` for
  short UI text on controls and structure, `body-*` for content and values, `heading-*` for titles, `display-*` for
  hero and marketing text (never inside a library component).
- Size tables store only the step (`"sm"`, `"md"`) and add the prefix where the column is used
  (`typography("text-#{$step}", $weight)`). See css.md section 5.
- If a size needs a step the scale does not have, ask for it in the generator instead of borrowing a neighbor.
- Weight overrides use weight names only: `lightest, lighter, light, regular, strong, stronger, strongest`. Flag numeric
  weights.

## 5. Color

- Components never use `--mtf-color-palette-*`. Palette steps are hidden primitives; use a semantic token.
- Text: `text-stronger, text-strong, text-default, text-soft, text-softer`, `text-disabled`. On a solid intent fill use
  `on-{intent}`; on images use `text-on-media`.
- Surfaces: `surface-canvas` (page), `surface-default` (card, panel), `surface-raised` (popover, dropdown, modal),
  `surface-sunken`, `surface-subtle`, `surface-disabled`, `surface-opposite` (tooltip).
- Intent tokens, by job:
  - `{intent}-solid`, `-solid-hover`, `-solid-active`: filled backgrounds;
  - `{intent}-soft`, `-soft-hover`: tinted backgrounds, ghost/outline hover;
  - `{intent}-text`: colored text on a neutral surface;
  - `{intent}-border`: outlines and validation borders;
  - `{intent}-border-soft`: decorative edges (soft badge).
  - `{intent}-solid`: an alert's left edge, its color mark, like its icon.
- Flag an intent token used outside its job, e.g. `primary-solid` as text color on a white surface.
- An icon colored by a component's variant (alert icon, status icon) uses `{intent}-solid`, the same token as the
  variant's filled button, not `{intent}-text`. On a light surface warning's knocked-out glyph shows the surface and
  reads weakly; this is accepted (user, 2026-11-10).
- Field role (inputs, textarea, select, date picker…): `surface-field`, `text-field`, `text-field-placeholder`,
  `border-field`, `border-field-hover`, `border-field-focus`. Validation uses the intent borders directly (`danger-border`,
  `success-border`); disabled uses the global disabled tokens. Flag a field-like component that uses the generic text or
  border tokens instead of the field ones.
- Dark mode is handled by the tokens (`light-dark()`). Flag component-level dark overrides: `@media (prefers-color-scheme)`,
  `[data-mtf-mode]` selectors, or separate dark variables inside a component.

## 6. Elevation and radius

- Shadows: `box-shadow: var(--mtf-elevation-N)` directly. Flag new uses of `@mixin shadow`.
- Radius: `--mtf-sizing-radius-sm | md | lg | round`. Flag fixed sizing tokens used as a radius.
- When migrating, map radii by pixel value, not by name. The default theme's old scale is larger than the new one:
  old `--base-radius-sm` / `--theme-sizing-radius-default` (4px) is new `radius-md`, old `md` (8px) is new `radius-lg`.
  Flag a migration that keeps the old step name and silently halves the corner (Button had this).

## 7. Color variants (`VariantV2`)

For components moved to the new variant API:

- The prop type is `VariantV2` from `src/lib/types.ts` (`neutral | primary | secondary | accent | info | success | warning |
danger`). Flag a component that redefines this union, uses `string`, or uses the old `Variant` after migration.
- Every variant gets its class, `neutral` included, and the TSX passes `variant` to the class list as is. Flag special cases
  such as `variant !== "neutral" && variant`.
- The default is a prop default, so a class is always present: `variant = "neutral"`, or another variant when the design
  asks for it (see below). Flag a component whose SCSS relies on "no variant class" for its default look.
- SCSS defines a rule for each variant, neutral included, usually from a map of variant to token that sets the property
  directly (ProgressCircle: `.primary .circle { stroke: … }`). See css.md section 4 for when a custom property is justified.
- The variant is named `accent`, not `alternate`.
- A component may default to a variant other than neutral when the design asks for it (`variant = "primary"`).
  ProgressCircle defaults to primary, so existing loaders keep their color. Flag a change of default as a visible change
  the author must confirm.

## 8. Role tokens

- No component-named tokens (`--mtf-color-select-*`). A shared role token is allowed only when at least three component
  families use the role and it has its own states (the field group is the example). Flag new role groups that do not meet
  this.

## 9. Visible changes

Call out, without blocking, any change that alters what consumers see or pass: a different default variant, a renamed or
removed token, different sizes, a changed line height. The author decides whether it goes into the change log.
