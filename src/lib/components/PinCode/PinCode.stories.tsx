import type { Meta, StoryObj } from "@storybook/nextjs";

import PinCode from "./PinCode";

const meta: Meta<typeof PinCode> = {
  title: "Components/PinCode",
  component: PinCode,
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
    maskType: { table: { defaultValue: { summary: "asterisks" } } },
    value: {
      table: {
        type: { summary: "string[]" },
      },
      control: false,
    },
  },
  args: {},
};

export default meta;
type Story = StoryObj<typeof PinCode>;

export const Primary: Story = {
  render: args => (
    <PinCode {...args}>
      <PinCode.Item key="p1" masked disabled />
      <PinCode.Item key="p2" />
      <PinCode.Item key="p3" masked disabled />
      <PinCode.Item key="p4" />
      <PinCode.Item key="p5" />
      <PinCode.Item key="p6" masked disabled />
    </PinCode>
  ),
};

export const DefaultValue: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <PinCode id="p" value={["", "X", "Y", ""]}>
  <PinCode.Item disabled masked />
  <PinCode.Item />
  <PinCode.Item disabled />
  <PinCode.Item disabled masked />
</PinCode>
        `,
      },
    },
  },
  render: args => (
    <PinCode {...args} value={["", "X", "Y", ""]}>
      <PinCode.Item disabled masked />
      <PinCode.Item />
      <PinCode.Item disabled />
      <PinCode.Item disabled masked />
    </PinCode>
  ),
};

export const Words: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <PinCode id="p">
  <PinCode.Item disabled masked />
  <PinCode.Item />
  <PinCode.Item disabled masked />
  <PinCode.Item disabled masked />
  <PinCode.Item space />
  <PinCode.Item />
  <PinCode.Item disabled masked />
  <PinCode.Item />
</PinCode>
        `,
      },
    },
  },
  render: args => (
    <PinCode {...args}>
      <PinCode.Item disabled masked />
      <PinCode.Item />
      <PinCode.Item disabled masked />
      <PinCode.Item disabled masked />
      <PinCode.Item space />
      <PinCode.Item />
      <PinCode.Item disabled masked />
      <PinCode.Item />
    </PinCode>
  ),
};
