import type { Meta, StoryObj } from "@storybook/nextjs";

import Avatar from "./Avatar";
import { iconOptions, iconDecorator } from "../../../utils/storybookUtils.tsx";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  decorators: [iconDecorator],
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
    variant: { table: { defaultValue: { summary: "secondary" } } },
    icon: {
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      control: { type: "select" },
    },
  },
  args: { letters: "AV" },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Primary: Story = {};
