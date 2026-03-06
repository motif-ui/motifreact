import type { Meta, StoryObj } from "@storybook/nextjs";

import Text from "@/components/Text";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  argTypes: {
    variant: { table: { defaultValue: { summary: "body2" } } },
  },
  args: {
    text: "Test Content",
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Primary: Story = {};
