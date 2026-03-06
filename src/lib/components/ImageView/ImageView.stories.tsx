import type { Meta, StoryObj } from "@storybook/nextjs";
import ImageView from "./ImageView";

const meta: Meta<typeof ImageView> = {
  title: "Components/ImageView",
  component: ImageView,
  argTypes: {
    positionHorizontal: { table: { defaultValue: { summary: "left" } } },
    positionVertical: { table: { defaultValue: { summary: "top" } } },
    width: { table: { defaultValue: { summary: "auto" } } },
    scaleType: { table: { defaultValue: { summary: "fit" } } },
    height: { table: { defaultValue: { summary: "auto" } } },
  },
  args: {
    src: "https://picsum.photos/200/300",
    width: 200,
    height: 300,
  },
};

export default meta;
type Story = StoryObj<typeof ImageView>;

export const Primary: Story = {};
