import { Meta, StoryObj } from "@storybook/nextjs";

import About3 from "./about3/About3";
import about3Source from "./about3/About3.tsx?raw";

const meta: Meta = {
  title: "Blocks/About",
  tags: ["!autodocs", "!dev"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const About3Block: Story = {
  name: "About3",
  render: () => <About3 />,
  parameters: { docs: { source: { code: about3Source, language: "tsx" } } },
};
