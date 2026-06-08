import type { Meta, StoryObj } from "@storybook/nextjs";

import DatePicker from "./DatePicker";
import React from "react";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  decorators: [
    Story => (
      <div style={{ width: 600, textAlign: "center" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    value: { control: { type: "date" } },
    variant: { table: { defaultValue: { summary: "borderless" } } },
    size: { table: { defaultValue: { summary: "md" } } },
  },
  args: {
    variant: "shadow",
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

const renderDatePicker = (args: React.ComponentProps<typeof DatePicker>, value?: Date) => <DatePicker {...args} value={value} />;

export const Primary: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: args => renderDatePicker(args, args.value ? new Date(args.value) : undefined),
};

export const PrimaryStaticForChromatic: Story = {
  tags: ["!autodocs", "!dev"],
  render: args => renderDatePicker(args, new Date(2013, 1, 18)),
};
