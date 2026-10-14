import type { Meta, StoryObj } from "@storybook/nextjs";

import dashboard1Source from "./dashboard1/Dashboard1.tsx?raw";
import Dashboard1 from "./dashboard1/Dashboard1";

const meta: Meta = {
  title: "Blocks/Dashboards",
  tags: ["!autodocs", "!dev"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const Dashboard1Block: Story = {
  name: "Login",
  render: () => <Dashboard1 />,
  parameters: { docs: { source: { code: dashboard1Source, language: "tsx" } } },
};
