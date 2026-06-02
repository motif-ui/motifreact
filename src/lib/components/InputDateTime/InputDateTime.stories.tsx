import type { Meta, StoryObj } from "@storybook/nextjs";

import { InputDateTime } from "../../index";
import React from "react";

const meta: Meta<typeof InputDateTime> = {
  title: "Components/InputDateTime",
  component: InputDateTime,
  argTypes: {
    value: { control: { type: "date" }, description: "Date Object" },
    dateFormat: { description: "Detailed in this document below..." },
    size: { table: { defaultValue: { summary: "md" } } },
    timeFormat: { table: { defaultValue: { summary: "24h" } } },
    placeholder: { table: { defaultValue: { summary: "Reflects format prop and time placeholder" } } },
  },
  args: {},
};

export default meta;
type Story = StoryObj<typeof InputDateTime>;

const renderInputDateTime = (args: React.ComponentProps<typeof InputDateTime>, value?: Date) => <InputDateTime {...args} value={value} />;

export const Primary: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: args => renderInputDateTime(args, args.value ? new Date(args.value) : undefined),
};

export const Secondary: Story = {
  tags: ["!autodocs", "!dev"],
  render: args => renderInputDateTime(args, new Date(2026, 10, 12)),
};
