# Test rules

Apply these rules to component test files (`*.test.tsx`).

## 1. The first test checks the defaults

Every component test suite starts with `runSnapshotDefaultsAndStandardPropsTest` from `src/utils/testUtils.tsx`. It renders
the component with only its required props, matches the snapshot and checks the standard props (`className`, `style`,
`ref`). Its `assertDefaults` option checks the default prop values.

- `assertDefaults` checks every prop that has a default value in the component (`variant = "primary"`, `size = "sm"`…),
  through what the default produces, usually a class.
- It checks prop defaults only. Do not assert things that are not a prop default (ARIA attributes, inner markup) there. An
  ARIA attribute is fine when it is the only visible result of a prop default (ProgressCircle's `maxProgress: 100` →
  `aria-valuemax="100"`).
- Each assertion has a comment on the line right above it naming the prop and its default value:

  ```tsx
  runSnapshotDefaultsAndStandardPropsTest((props: StandardPropsWithRef<SVGSVGElement>) => render(<ProgressCircle {...props} />), {
    assertDefaults: ({ container }) => {
      // variant: primary
      expect(container.firstElementChild).toHaveClass("primary");
      // size: sm
      expect(container.firstElementChild).toHaveClass("sm");
    },
  });
  ```

- Flag a separate test that checks a default value (e.g. "should use the primary variant when no variant is given"); it
  belongs in `assertDefaults`.
- Flag a component whose defaults changed without the matching `assertDefaults` change, and an assertion without its
  `// prop: value` comment.

## 2. General

- Use consts instead of repeating the same hardcoded text.
- Use only props relevant to the test case; avoid unrelated or unnecessary props.
- Class names in tests come from a CSS module mock that rejects keys with spaces (`jest.cssModuleMock.cjs`), like real CSS
  modules. Pass several classes as separate entries, never as one space-joined string.
