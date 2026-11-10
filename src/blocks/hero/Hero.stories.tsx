import { Meta, StoryObj } from "@storybook/nextjs";

import Hero4 from "./hero4/Hero4";
import hero4Source from "./hero4/Hero4.tsx?raw";

const meta: Meta = {
  title: "Blocks/Hero",
  tags: ["!autodocs", "!dev"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const Hero4Block: Story = {
  name: "Hero4",
  render: () => <Hero4 />,
  parameters: { docs: { source: { code: hero4Source, language: "tsx" } } },
};
