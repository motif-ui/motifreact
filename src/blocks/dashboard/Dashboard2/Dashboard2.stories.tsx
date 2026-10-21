import type { Meta, StoryObj } from "@storybook/nextjs";
import Dashboard2 from "./Dashboard2";

const meta: Meta<typeof Dashboard2> = {
  title: "Blocks/Dashboard/Dashboard2",
  component: Dashboard2,
  tags: ["!autodocs", "!dev"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Dashboard2>;

export const Primary: Story = {};
