import type { Meta, StoryObj } from "@storybook/nextjs";

import MonthPicker from "./MonthPicker";

const meta: Meta<typeof MonthPicker> = {
  title: "Components/MonthPicker",
  component: MonthPicker,
  argTypes: {
    value: { control: { type: "number", min: 0, max: 11 } },
    variant: { table: { defaultValue: { summary: "borderless" } } },
    size: { table: { defaultValue: { summary: "md" } } },
  },
  args: {
    variant: "shadow",
  },
};

export default meta;
type Story = StoryObj<typeof MonthPicker>;

export const Primary: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const PrimaryStaticForChromatic: Story = {
  tags: ["!autodocs", "!dev"],
  args: { value: 1 },
};
