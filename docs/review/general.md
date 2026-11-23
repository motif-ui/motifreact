# General review rules

Used by the Claude code review in CI (`.github/workflows/claude-code-review.yml`) and by local reviews.
SCSS rules live in [css.md](./css.md), token rules in [design-tokens.md](./design-tokens.md), test rules in [tests.md](./tests.md).

## Focus

- Code quality and best practices
- Correctness and potential bugs
- React/TypeScript best practices
- SCSS/styling concerns
- Test coverage gaps for changed components
- Breaking changes in component APIs
- Security implications
- Performance considerations

Do not review or comment on accessibility (a11y) concerns; this is out of scope for this review.

## Code

- Do not allow `var` or `let`; prefer `const` and functional programming patterns.
- Avoid the `any` type; prefer explicit types or generics.
- Use ES6+ syntax throughout: arrow functions, destructuring, template literals, nullish coalescing, `&&` short-circuits,
  optional chaining.
- Do not allow usages like `React.MouseEvent`. Import `MouseEvent` along with the other React imports.
- Do not write a return type on a function whose return type TypeScript already infers correctly. Keep it only when inference
  gets it wrong, typically when the returned object has a literal field that would widen to `string` (a discriminated union
  such as `type: "color"`, or `unit: "rem"`), or when the function is recursive. Type predicates (`value is string`) are part
  of the behavior and always stay.
- When a prop can use an existing type such as `IconGlobalType` or `VariantV2`, do not allow `string` or a redefinition of the
  same type.

## Tests

Test rules live in [tests.md](./tests.md).
