import type { Meta, StoryObj } from "@storybook/nextjs";
import ListView from "../ListView";

const meta: Meta<typeof ListView.Item> = {
  title: "Components/ListView/ListView.Item",
  component: ListView.Item,
  argTypes: {},
  args: {
    title: "My Document Folder",
    description: "Personal notes and other files",
    alternateText: "Backup",
    icon: "folder",
    onClick: () => alert("Item clicked"),
  },
};

export default meta;
type Story = StoryObj<typeof ListView.Item>;

export const Primary: Story = {
  parameters: {
    docs: {
      description: {
        story: `\`\`ListView.Item\`\` is a component that is used to display an item in the \`\`ListView\`\`. There are some rules and hints to consider when using it:
- If \`\`selectable\`\` in ListView is true, \`\`id\`\` should be given to each item.
- When the ListView is selectable, \`\`icon\`\`, \`\`image\`\` and \`\`abbr\`\` not shown.
- The visibility priority of the icon, image and abbr is as follows: \`\`icon > image > abbr\`\`.
          `,
      },
    },
  },
  render: args => (
    <ListView>
      <ListView.Item {...args} />
    </ListView>
  ),
};
