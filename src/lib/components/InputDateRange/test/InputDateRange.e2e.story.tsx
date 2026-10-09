import type { Meta, StoryObj } from "@storybook/nextjs";
import InputDateRange from "@/components/InputDateRange/InputDateRange";

// Scenes for the positioning tests in InputDateRange.e2e.spec.ts. They are added to Storybook only in development, see .storybook/main.ts
const meta: Meta<typeof InputDateRange> = {
  title: "E2E/InputDateRange",
  component: InputDateRange,
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof InputDateRange>;

export const ScrollingContainer: Story = {
  render: args => (
    <div data-testid="scroller" style={{ overflow: "auto", height: 150, width: 400, margin: 16, border: "1px solid" }}>
      <div style={{ height: 600, paddingTop: 20 }}>
        <InputDateRange {...args} value={[new Date(2026, 10, 12), new Date(2026, 10, 16)]} />
      </div>
    </div>
  ),
};
