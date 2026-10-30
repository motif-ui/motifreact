import type { Meta, StoryObj } from "@storybook/nextjs";

import Dashboard3 from "./Dashboard3/Dashboard3";
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

export const Dashboard3Block: Story = {
  name: "Dashboard 3",
  render: () => <Dashboard3 />,
  parameters: { docs: { source: { code: dashboard3Source, language: "tsx" } } },
};
