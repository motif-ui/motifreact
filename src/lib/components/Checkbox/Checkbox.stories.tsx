import type { Meta, StoryObj } from "@storybook/nextjs";

import Checkbox from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
  },
  args: { label: "Please Approve", checked: true, disabled: false },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Primary: Story = {};
