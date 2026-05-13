import type { Meta, StoryObj } from "@storybook/nextjs";

import InputPassword from "./InputPassword";
import { iconOptions, iconDecorator } from "../../../utils/storybookUtils.tsx";

const meta: Meta<typeof InputPassword> = {
  title: "Components/InputPassword",
  component: InputPassword,
  decorators: [iconDecorator],
  argTypes: {
    value: { type: "string" },
    size: { table: { defaultValue: { summary: "md" } } },
    icon: {
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      control: { type: "select" },
    },
  },
  args: {
    placeholder: "Placeholder",
    toggleMask: true,
  },
};

export default meta;
type Story = StoryObj<typeof InputPassword>;

export const Primary: Story = {};
