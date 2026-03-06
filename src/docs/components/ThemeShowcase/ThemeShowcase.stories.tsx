import type { Meta, StoryObj } from "@storybook/nextjs";

import ThemeShowcase from "./ThemeShowcase";

const meta: Meta<typeof ThemeShowcase> = {
  title: "_Hidden/ThemeDemo",
  component: ThemeShowcase,
  tags: ["!autodocs", "!dev"],
};

export default meta;
type Story = StoryObj<typeof ThemeShowcase>;

export const Primary: Story = {};
