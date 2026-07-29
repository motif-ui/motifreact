import type { Meta, StoryObj } from "@storybook/nextjs";

import Grid from "@/components/Grid/Grid";

const meta: Meta<typeof Grid.Col> = {
  title: "Components/Grid/Grid.Col",
  component: Grid.Col,
  argTypes: {},
  args: {
    size: 3,
  },
};

export default meta;
type Story = StoryObj<typeof Grid.Col>;

export const Primary: Story = {
  render: args => (
    <div style={{ width: 900 }}>
      <Grid colProps={{ style: { border: "solid 1px #CCC", margin: 1 } }}>
        <Grid.Row>
          <Grid.Col {...args}>Column 1</Grid.Col>
          <Grid.Col {...args}>Column 2</Grid.Col>
        </Grid.Row>
      </Grid>
    </div>
  ),
};
