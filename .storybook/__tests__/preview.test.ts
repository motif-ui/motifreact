import { iconOptions } from "../utils.tsx";

// preview.tsx pulls in MotifDocContainer -> @storybook/addon-docs/blocks,
// which ships ESM-only and isn't in jest's transformIgnorePatterns
// exceptions. This test only exercises argTypesEnhancers, which has no
// dependency on docs rendering, so a stub is enough to let the module load.
jest.mock("@storybook/addon-docs/blocks", () => ({
  DocsContainer: () => null,
  Controls: () => null,
  Description: () => null,
  DocsContext: { Provider: () => null },
  Primary: () => null,
  Subtitle: () => null,
  Title: () => null,
}));
// motifTheme.ts imports storybook/theming/create, which has the same
// ESM-only problem. Its actual theme values are irrelevant to this test.
jest.mock("../motifTheme", () => ({ default: {} }));

import { argTypesEnhancers } from "../preview";

const enhance = argTypesEnhancers[0] as (context: { argTypes: Record<string, unknown> }) => Record<string, unknown>;

describe("argTypesEnhancers", () => {
  it("adds the icon select control to args typed as IconGlobalType", () => {
    const result = enhance({
      argTypes: {
        icon: { table: { type: { summary: "IconGlobalType" } } },
      },
    });

    expect(result.icon).toMatchObject({
      table: { type: { summary: "IconGlobalType" } },
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      control: { type: "select" },
    });
  });

  it("leaves non-icon argTypes untouched", () => {
    const plainArgType = { table: { type: { summary: "string" } } };
    const result = enhance({ argTypes: { label: plainArgType } });

    expect(result.label).toBe(plainArgType);
  });
});
