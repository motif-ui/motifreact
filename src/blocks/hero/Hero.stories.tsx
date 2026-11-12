import { Meta, StoryObj } from "@storybook/nextjs";

import Hero1 from "./hero1/Hero1";
import hero1Source from "./hero1/Hero1.tsx?raw";
import Hero2 from "./hero2/Hero2";
import hero2Source from "./hero2/Hero2.tsx?raw";

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

export const Hero2Block: Story = {
  name: "Hero2",
  render: () => <Hero2 />,
  parameters: { docs: { source: { code: hero2Source, language: "tsx" } } },
};
