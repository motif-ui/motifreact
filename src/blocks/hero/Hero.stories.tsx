import { Meta, StoryObj } from "@storybook/nextjs";

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

export const Hero2Block: Story = {
  name: "Hero2",
  render: () => <Hero2 />,
  parameters: { docs: { source: { code: hero2Source, language: "tsx" } } },
};
