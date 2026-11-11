import { Meta, StoryObj } from "@storybook/nextjs";

import Hero3 from "./hero3/Hero3";
import hero3Source from "./hero3/Hero3.tsx?raw";

const meta: Meta = {
  title: "Blocks/Hero",
  tags: ["!autodocs", "!dev"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const Hero3Block: Story = {
  name: "Hero3",
  render: () => <Hero3 />,
  parameters: { docs: { source: { code: hero3Source, language: "tsx" } } },
};
