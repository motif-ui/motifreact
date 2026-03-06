import type { Meta, StoryObj } from "@storybook/nextjs";

import Divider from "./Divider";
import Checkbox from "../Checkbox/Checkbox";

const meta: Meta<typeof Divider> = {
  title: "Components/Divider",
  component: Divider,
  decorators: [
    Story => (
      <div>
        <Checkbox label="Divider Test 1" />
        <Story />
        <Checkbox label="Divider Test 2" />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `When using this component, **height** value or **display:flex** property should be given to the style properties of the parent element containing the component.`,
      },
    },
  },
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
    gap: { table: { defaultValue: { summary: "md" } } },
    orientation: { table: { defaultValue: { summary: "horizontal" } } },
    shape: { table: { defaultValue: { summary: "solid" } } },
  },
  args: {},
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Primary: Story = {
  render: args => (
    <div {...(args.orientation === "vertical" && { style: { display: "flex" } })}>
      <Divider {...args} />
    </div>
  ),
};
