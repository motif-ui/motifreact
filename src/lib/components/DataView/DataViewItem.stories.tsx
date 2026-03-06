import type { Meta, StoryObj } from "@storybook/nextjs";
import DataView from "@/components/DataView/DataView";
import Button from "@/components/Button";

const meta: Meta<typeof DataView.Item> = {
  title: "Components/DataView/DataView.Item",
  component: DataView.Item,
  decorators: [
    Story => (
      <div style={{ minWidth: 500 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    children: {
      type: undefined,
      description: "Any element can be used as a child instead of value prop.",
      control: { type: "boolean" },
      mapping: {
        false: undefined,
        true: (
          <div>
            <strong>My very custom value with a</strong>
            <br />
            <Button label="button" size="xxs" /> <strong>in it</strong>
          </div>
        ),
      },
    },
  },
  args: {
    label: "Country",
    value: "Türkiye",
  },
};

export default meta;
type Story = StoryObj<typeof DataView.Item>;

export const Primary: Story = {
  render: args => (
    <DataView rowVariant="solid">
      <DataView.Item {...args} />
      <DataView.Item {...args} />
    </DataView>
  ),
};
