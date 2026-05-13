import type { Meta, StoryObj } from "@storybook/nextjs";

import Button from "./Button";
import { iconOptions, iconDecorator } from "../../../utils/storybookUtils.tsx";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  decorators: [iconDecorator],
  argTypes: {
    variant: { table: { defaultValue: { summary: "primary" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    shape: { table: { defaultValue: { summary: "solid" } } },
    icon: {
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      control: { type: "select" },
    },
  },
  args: {
    label: "Button",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};
