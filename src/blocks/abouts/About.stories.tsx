import type { Meta, StoryObj } from "@storybook/nextjs";

import About1 from "./About1/About1";
import about1Source from "./About1/About1.tsx?raw";

const meta: Meta = {
  title: "Blocks/About",
  tags: ["!autodocs", "!dev"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const About1Block: Story = {
  name: "About 1",
  render: () => <About1 />,
  parameters: { docs: { source: { code: about1Source, language: "tsx" } } },
};
