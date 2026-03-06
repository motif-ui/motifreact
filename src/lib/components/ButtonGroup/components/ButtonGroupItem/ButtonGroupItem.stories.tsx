import type { Meta, StoryObj } from "@storybook/nextjs";
import ButtonGroup from "@/components/ButtonGroup";

const meta: Meta<typeof ButtonGroup.Item> = {
  title: "Components/ButtonGroup/ButtonGroup.Item",
  component: ButtonGroup.Item,
  argTypes: {
    disabled: { control: "boolean" },
    children: {
      type: { name: "boolean" },
      description: "`ButtonGroup.Item[]`",
      control: { type: "boolean" },
      mapping: { false: undefined, true: <ButtonGroup.Item label="ButtonGroup SubItem" /> },
    },
  },
  args: {
    label: "ButtonGroup Item",
    icon: "person",
    action: alert,
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup.Item>;

export const Primary: Story = {
  parameters: {
    docs: {
      description: {
        story: `\`\`ButtonGroup.Item\`\` is used to display button items in the 
        \`\`ButtonGroup\`\`. It may contain children of itself to provide a 
        **_sub ButtonGroup_**. Only single level of nesting is allowed.
          `,
      },
    },
  },
  render: args => (
    <ButtonGroup>
      <ButtonGroup.Item {...args} />
    </ButtonGroup>
  ),
};
