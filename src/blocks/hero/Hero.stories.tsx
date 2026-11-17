import { Meta, StoryObj } from "@storybook/nextjs";

import Hero4 from "./hero4/Hero4";
import hero4Source from "./hero4/Hero4.tsx?raw";
import Hero2 from "./hero2/Hero2";
import hero2Source from "./hero2/Hero2.tsx?raw";
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

export const Hero2Block: Story = {
  name: "Hero2",
  render: () => <Hero2 />,
  parameters: { docs: { source: { code: hero2Source, language: "tsx" } } },
};

export const Hero3Block: Story = {
  name: "Hero3",
  render: () => <Hero3 />,
  parameters: { docs: { source: { code: hero3Source, language: "tsx" } } },
};

export const Hero4Block: Story = {
  name: "Hero4",
  render: () => <Hero4 />,
  parameters: { docs: { source: { code: hero4Source, language: "tsx" } } },
};
