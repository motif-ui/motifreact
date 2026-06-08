import type { Meta, StoryObj } from "@storybook/nextjs";

import DateTimePicker from "./DateTimePicker";
import React from "react";

const meta: Meta<typeof DateTimePicker> = {
  title: "Components/DateTimePicker",
  component: DateTimePicker,
  decorators: [
    Story => (
      <div style={{ width: 600, textAlign: "center" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    value: { control: { type: "date" }, description: "Date Object" },
    variant: { table: { defaultValue: { summary: "borderless" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    timeFormat: { table: { defaultValue: { summary: "24h" } } },
  },
  args: {
    variant: "shadow",
  },
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

const renderDateTimePicker = (args: React.ComponentProps<typeof DateTimePicker>, value?: Date) => (
  <DateTimePicker {...args} value={value} />
);

export const Primary: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: args => renderDateTimePicker(args, args.value ? new Date(args.value) : undefined),
};

export const PrimaryStaticForChromatic: Story = {
  tags: ["!autodocs", "!dev"],
  render: args => renderDateTimePicker(args, new Date(2026, 10, 12)),
};
