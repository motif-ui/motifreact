import type { Meta, StoryObj } from "@storybook/nextjs";
import InputDateRange from "@/components/InputDateRange/InputDateRange";
import React from "react";

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
  },
  args: {
    value: [new Date(today), new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)],
  },
};

export default meta;
type Story = StoryObj<typeof InputDateRange>;

const renderInputDateRange = (args: React.ComponentProps<typeof InputDateRange>, value?: [Date, Date]) => (
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
