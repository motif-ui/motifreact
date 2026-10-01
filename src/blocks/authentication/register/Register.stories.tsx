import type { Meta, StoryObj } from "@storybook/nextjs";

import Register from "./Register";

const meta: Meta<typeof Register> = {
  title: "Blocks/Authentication/Register",
  component: Register,
  tags: ["!autodocs", "!dev"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Register>;

export const Primary: Story = {};
