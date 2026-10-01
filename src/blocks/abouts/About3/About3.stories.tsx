import type { Meta, StoryObj } from "@storybook/nextjs";
import About3 from "./About3";

const meta: Meta<typeof About3> = {
  title: "Blocks/Abouts/About3",
  component: About3,
  tags: ["!autodocs", "!dev"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof About3>;

export const Primary: Story = {};
