import type { Meta, StoryObj } from "@storybook/nextjs";

import ListView from "./ListView";

const meta: Meta<typeof ListView> = {
  title: "Components/ListView",
  component: ListView,
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
  },
  args: {},
};

export default meta;

type Story = StoryObj<typeof ListView>;

export const Primary: Story = {
  render: args => (
    <div style={{ width: 400 }}>
      <ListView {...args}>
        <ListView.Item
          title="Contact List"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae fermentum arcu, vitae dignissim quam. Suspendisse eu nisi semper, congue augue tincidunt, porttitor dui. Nam at faucibus turpis, sed ullamcorper augue. Proin odio tortor, tincidunt et malesuada sed, dictum ultrices metus."
          alternateText="Wallet"
          icon="person"
          id="1"
        />
        <ListView.Item title="My Documents" description="Personal notes and stuff" alternateText="Year 2008" icon="assignment" id="2" />
        <ListView.Item title="Appointments" description="Items added to the calendar" alternateText="Active" icon="calendar_month" id="3" />
      </ListView>
    </div>
  ),
};
