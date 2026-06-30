import type { Meta, StoryObj } from "@storybook/nextjs";

import InputNumber from "./InputNumber";

const meta: Meta<typeof InputNumber> = {
  title: "Components/InputNumber",
  component: InputNumber,
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
    step: { table: { defaultValue: { summary: "1" } } },
  },
  args: {
    value: 2008,
    min: 2005,
    max: 2012,
  },
};

export default meta;
type Story = StoryObj<typeof InputNumber>;

export const Primary: Story = {};
