import type { Meta, StoryObj } from "@storybook/nextjs";
import InputDateRange from "@/components/InputDateRange/InputDateRange";
import type { ComponentProps } from "react";

const today = new Date();

const meta: Meta<typeof InputDateRange> = {
  title: "Components/InputDateRange",
  component: InputDateRange,
  argTypes: {
    format: { description: "Detailed in this document below..." },
    value: {
      table: {
        type: { summary: "Date[]" },
      },
    },
    locale: { table: { defaultValue: { summary: "Turkish" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    placeholder: { table: { defaultValue: { summary: "Reflects format prop" } } },
    firstDayOfWeek: { table: { defaultValue: { summary: "1" } } },
  },
  args: {
    value: [new Date(today), new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)],
  },
};

export default meta;
type Story = StoryObj<typeof InputDateRange>;

const renderInputDateRange = (args: ComponentProps<typeof InputDateRange>, value?: [Date, Date]) => (
  <InputDateRange {...args} value={value} />
);

export const Primary: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: args => renderInputDateRange(args, [new Date(today), new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)]),
};

export const PrimaryStaticForChromatic: Story = {
  tags: ["!autodocs", "!dev"],
  render: args => renderInputDateRange(args, [new Date(2026, 10, 12), new Date(2026, 10, 16)]),
};

// Fixture for the overlay positioning tests in .e2e, not shown in the docs
export const ScrollingContainerForE2E: Story = {
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen", chromatic: { disableSnapshot: true } },
  render: args => (
    <div data-testid="scroller" style={{ overflow: "auto", height: 150, width: 400, margin: 16, border: "1px solid" }}>
      <div style={{ height: 600, paddingTop: 20 }}>{renderInputDateRange(args, [new Date(2026, 10, 12), new Date(2026, 10, 16)])}</div>
    </div>
  ),
};
