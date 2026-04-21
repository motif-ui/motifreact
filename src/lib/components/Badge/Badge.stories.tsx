import type { Meta, StoryObj } from "@storybook/nextjs";

import Badge from "../Badge";
import Button from "@/components/Button";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  decorators: [
    Story => (
      <div>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: { table: { defaultValue: { summary: "primary" } } },
    max: { table: { defaultValue: { summary: "999" } } },
    align: { table: { defaultValue: { summary: "top-right" } } },
    children: { control: false },
    icon: { description: "Icon name (string) or a custom icon uses <span>, <i> or <svg>" },
  },
  args: {
    content: "badge",
    children: <Button label="Button" variant="secondary" />,
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Primary: Story = {};

export const Dot: Story = {
  render: args => (
    <Badge {...args} dot>
      <Button label="Button" variant="secondary" />
    </Badge>
  ),
};

export const Icon: Story = {
  render: args => (
    <Badge {...args} icon="mail">
      <Button label="Button" variant="secondary" />
    </Badge>
  ),
};

export const MaxNumber: Story = {
  render: args => (
    <Badge {...args} max={10} content="11">
      <Button label="Button" variant="secondary" />
    </Badge>
  ),
};
