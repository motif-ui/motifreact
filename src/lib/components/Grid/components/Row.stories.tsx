import type { Meta, StoryObj } from "@storybook/nextjs";

import Grid from "@/components/Grid/Grid";

const meta: Meta<typeof Grid.Row> = {
  title: "Components/Grid/Grid.Row",
  component: Grid.Row,
  argTypes: {
    justifyCols: { table: { defaultValue: { summary: "start" } } },
  },
  args: {},
};

export default meta;
type Story = StoryObj<typeof Grid.Row>;

export const Primary: Story = {
  render: args => (
    <div style={{ width: 900 }}>
      <Grid colProps={{ style: { border: "solid 1px #CCC", margin: 1 } }}>
        <Grid.Row {...args}>
          <Grid.Col size={3}>My short content</Grid.Col>
          <Grid.Col size={4}>My medium medium content</Grid.Col>
        </Grid.Row>
      </Grid>
    </div>
  ),
};
