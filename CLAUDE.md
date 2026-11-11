# motifreact

## Code review

When reviewing changes (`/code-review`, "review this branch", a PR review), apply the same rules as the CI review in
`.github/workflows/claude-code-review.yml`:

- [docs/review/general.md](docs/review/general.md): always.
- [docs/review/figma.md](docs/review/figma.md): for token changes and visual changes to migrated components.
- [docs/review/tests.md](docs/review/tests.md): for component tests and changed default prop values.
- [docs/review/css.md](docs/review/css.md): for added or modified lines in `.scss` files.
- [docs/review/design-tokens.md](docs/review/design-tokens.md): only for components migrated to the new tokens (`--mtf-*`
  variables, `VariantV2`) and for `src/scripts/tokens`; see its Scope note.

## Never drop `.Root`

Every component `.module.scss` used with `sanitizeModuleRootClasses` must compile a `.Root` rule (use
`@include retain-scoped-class` when it has nothing else). See section 0 of [docs/review/css.md](docs/review/css.md).

## Writing styles

Follow [docs/review/css.md](docs/review/css.md) when writing SCSS, and [docs/review/design-tokens.md](docs/review/design-tokens.md)
for the SCSS of a migrated component, so the review has nothing to catch.
