import type { Meta, StoryObj } from "@storybook/nextjs";

import Login from "./Login";

const meta: Meta<typeof Login> = {
  title: "Blocks/Authentication/Login",
  component: Login,
  tags: ["!autodocs", "!dev"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Login>;

export const Primary: Story = {};
