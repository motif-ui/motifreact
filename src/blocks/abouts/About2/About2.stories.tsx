import type { Meta, StoryObj } from "@storybook/nextjs";
import About2 from "./About2";
import about2Source from "./About2.tsx?raw";

const meta: Meta<typeof About2> = {
  title: "Blocks/Abouts/About2",
  component: About2,
  tags: ["!autodocs", "!dev"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof About2>;

export const Primary: Story = {
  parameters: { docs: { source: { code: about2Source, language: "tsx" } } },
};
