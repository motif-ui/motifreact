import type { Meta, StoryObj } from "@storybook/nextjs";

import Switch from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
  },

  args: { label: "Switch Label" },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Primary: Story = {};
