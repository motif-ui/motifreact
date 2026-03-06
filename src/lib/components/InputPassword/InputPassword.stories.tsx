import type { Meta, StoryObj } from "@storybook/nextjs";

import InputPassword from "./InputPassword";

const meta: Meta<typeof InputPassword> = {
  title: "Components/InputPassword",
  component: InputPassword,
  argTypes: {
    value: { type: "string" },
    size: { table: { defaultValue: { summary: "md" } } },
    icon: { table: { defaultValue: { summary: "vpn_key" } } },
  },
  args: {
    placeholder: "Placeholder",
    toggleMask: true,
  },
};

export default meta;
type Story = StoryObj<typeof InputPassword>;

export const Primary: Story = {};
