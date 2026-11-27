import type { Meta, StoryObj } from "@storybook/nextjs";

import Dashboard2 from "./Dashboard2/Dashboard2";
import Dashboard3 from "./Dashboard3/Dashboard3";
import dashboard2Source from "./Dashboard2/Dashboard2.tsx?raw";
import dashboard3Source from "./Dashboard3/Dashboard3.tsx?raw";

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

export const Dashboard3Block: Story = {
  name: "Dashboard3",
  render: () => <Dashboard3 />,
  parameters: { docs: { source: { code: dashboard3Source, language: "tsx" } } },
};
