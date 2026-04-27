import type { Meta, StoryObj } from "@storybook/nextjs";

import Avatar from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
    variant: { table: { defaultValue: { summary: "secondary" } } },
    icon: { description: "Icon name (string) or a custom icon uses <span>, <i> or <svg>" },
  },
  args: { letters: "AV" },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Primary: Story = {};
