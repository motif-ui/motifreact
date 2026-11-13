import type { Meta, StoryObj } from "@storybook/nextjs";

import Dashboard2 from "./Dashboard2/Dashboard2";
import dashboard2Source from "./Dashboard2/Dashboard2.tsx?raw";

const meta: Meta = {
  title: "Blocks/Dashboard",
  tags: ["!autodocs", "!dev"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const Dashboard2Block: Story = {
  name: "Dashboard2",
  render: () => <Dashboard2 />,
  parameters: { docs: { source: { code: dashboard2Source, language: "tsx" } } },
};
