import type { Meta, StoryObj } from "@storybook/nextjs";

import About1 from "./About1.tsx";

const meta: Meta<typeof About1> = {
  title: "Blocks/Pages/About/About1",
  component: About1,
  tags: ["!autodocs", "!dev"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof About1>;

export const Primary: Story = {};
