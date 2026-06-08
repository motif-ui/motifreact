import type { Meta, StoryObj } from "@storybook/nextjs";

import DateRangePicker from "./DateRangePicker";
import React from "react";
const today = new Date();

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
  argTypes: {
    variant: { table: { defaultValue: { summary: "borderless" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    locale: { table: { defaultValue: { summary: "LOCALE_DATE_RANGE_TR_TR" } } },
  },
  args: {
    variant: "shadow",
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

const renderDateRangePicker = (args: React.ComponentProps<typeof DateRangePicker>, value?: Date[]) => (
  <DateRangePicker {...args} value={value} />
);

export const Primary: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: args => renderDateRangePicker(args, [new Date(today), new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)]),
};

export const PrimaryStaticForChromatic: Story = {
  tags: ["!autodocs", "!dev"],
  render: args => renderDateRangePicker(args, [new Date(2026, 10, 12), new Date(2026, 10, 18)]),
};
