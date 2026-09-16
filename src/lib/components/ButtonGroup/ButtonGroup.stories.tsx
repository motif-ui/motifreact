import type { Meta, StoryObj } from "@storybook/nextjs";

import ButtonGroup from "./ButtonGroup";

const meta: Meta<typeof ButtonGroup> = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  decorators: [
    Story => (
      <div style={{ padding: "0 0 60px 0" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Primary: Story = {
  render: args => (
    <ButtonGroup {...args}>
      <ButtonGroup.Item label="Pay with Card" icon="credit_card" action={alert} />
      <ButtonGroup.Item label="Money Transfer" icon="payments" disabled />
      <ButtonGroup.Item label="Other">
        <ButtonGroup.Item label="Use Paypal" action={alert} />
        <ButtonGroup.Item label="Use Payoneer" disabled />
      </ButtonGroup.Item>
    </ButtonGroup>
  ),
};
