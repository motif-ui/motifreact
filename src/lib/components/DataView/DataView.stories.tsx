import type { Meta, StoryObj } from "@storybook/nextjs";

import DataView from "./DataView";

const meta: Meta<typeof DataView> = {
  title: "Components/DataView",
  parameters: {
    docs: {
      description: {
        component: ` \`\`<DataView>\`\` provides a simple way to display data in a grid format. 
 
 The prop **cols** is used to determine the number of columns (1-4) in a row. It's responsiveness can be customized with 
 different number of columns for different screen sizes (sm, md, lg, xl). Each size prop also stands for the bigger size 
 unless it is given explicitly. For example, if **md=2** and other size props are not given, than all the screen sizes 
 greater than medium will have 2 columns. `,
      },
    },
  },
  component: DataView,
  decorators: [
    Story => (
      <div style={{ minWidth: 500 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    cols: { control: { type: "inline-radio" }, table: { defaultValue: { summary: "1" } } },
    sm: { control: { type: "inline-radio" } },
    md: { control: { type: "inline-radio" } },
    lg: { control: { type: "inline-radio" } },
    xl: { control: { type: "inline-radio" } },
    rowVariant: { table: { defaultValue: { summary: "plain" } } },
    orientation: { table: { defaultValue: { summary: "horizontal" } } },
    valueAlignment: { table: { defaultValue: { summary: "left" } } },
  },
  args: {},
};

export default meta;
type Story = StoryObj<typeof DataView>;

export const Primary: Story = {
  render: args => (
    <DataView {...args}>
      <DataView.Item label="Name" value="Motif" />
      <DataView.Item label="Platform" value="Web, mobile" />
      <DataView.Item label="Founded" value={2008} />
      <DataView.Item label="Website" value="https://www.motif-ui.com" />
      <DataView.Item label="Platform Failures" />
      <DataView.Item label="Country" value="Türkiye" />
      <DataView.Item label="Developer" value="Türksat" />
    </DataView>
  ),
};
