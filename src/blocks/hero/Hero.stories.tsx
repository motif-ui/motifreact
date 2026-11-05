import { Meta, StoryObj } from "@storybook/nextjs";

import Hero1 from "./hero1/Hero1";
import hero1Source from "./hero1/Hero1.tsx?raw";

const meta: Meta = {
  title: "Blocks/Hero",
  tags: ["!autodocs", "!dev"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const Hero1Block: Story = {
  name: "Hero1",
  render: () => <Hero1 />,
  parameters: { docs: { source: { code: hero1Source, language: "tsx" } } },
};
