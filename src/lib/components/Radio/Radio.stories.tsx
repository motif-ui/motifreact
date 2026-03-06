import type { Meta, StoryObj } from "@storybook/nextjs";

import Radio from "./Radio";

const meta: Meta<typeof Radio> = {
  title: "Components/Radio",
  component: Radio,
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
  },
  args: {
    label: "Radio",
    value: "radio",
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Primary: Story = {};
