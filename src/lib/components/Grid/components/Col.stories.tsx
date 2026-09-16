import type { Meta, StoryObj } from "@storybook/nextjs";

import Grid from "@/components/Grid/Grid";

const meta: Meta<typeof Grid.Col> = {
  title: "Components/Grid/Grid.Col",
  component: Grid.Col,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {},
  args: {
    size: 3,
  },
};

export default meta;
type Story = StoryObj<typeof Grid.Col>;

export const Primary: Story = {
  render: args => (
    <Grid colProps={{ style: { border: "solid 1px #CCC" } }}>
      <Grid.Row>
        <Grid.Col {...args}>Column 1</Grid.Col>
        <Grid.Col {...args}>Column 2</Grid.Col>
      </Grid.Row>
    </Grid>
  ),
};
