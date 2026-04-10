import type { Meta, StoryObj } from "@storybook/nextjs";

import DateRangePicker from "./DateRangePicker";
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
    value: [new Date(today), new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)],
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Primary: Story = {};
