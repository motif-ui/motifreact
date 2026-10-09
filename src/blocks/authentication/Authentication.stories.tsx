import type { Meta, StoryObj } from "@storybook/nextjs";

import Login from "./login/Login";
import Register from "./register/Register";
import loginSource from "./login/Login.tsx?raw";
import registerSource from "./register/Register.tsx?raw";

const meta: Meta = {
  title: "Blocks/Authentication",
  tags: ["!autodocs", "!dev"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const LoginBlock: Story = {
  name: "Login",
  render: () => <Login />,
  parameters: { docs: { source: { code: loginSource, language: "tsx" } } },
};

export const RegisterBlock: Story = {
  name: "Register",
  render: () => <Register />,
  parameters: { docs: { source: { code: registerSource, language: "tsx" } } },
};
