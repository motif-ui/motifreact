import { Meta, StoryObj } from "@storybook/nextjs";

import About3 from "./About3/About3";
import About2 from "./About2/About2";
import about3Source from "./About3/About3.tsx?raw";
import about2Source from "./About2/About2.tsx?raw";

const meta: Meta = {
  title: "Blocks/About",
  tags: ["!autodocs", "!dev"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const About2Block: Story = {
  name: "About2",
  render: () => <About2 />,
  parameters: { docs: { source: { code: about2Source, language: "tsx" } } },
};

export const About3Block: Story = {
  name: "About3",
  render: () => <About3 />,
  parameters: { docs: { source: { code: about3Source, language: "tsx" } } },
};
