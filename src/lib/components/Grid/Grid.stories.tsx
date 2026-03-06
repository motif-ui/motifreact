import type { Meta, StoryObj } from "@storybook/nextjs";

import Grid from "@/components/Grid/Grid";

const meta: Meta<typeof Grid> = {
  title: "Components/Grid",
  component: Grid,
  argTypes: {},
  args: {},
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const Primary: Story = {
  render: args => (
    <div style={{ width: 900 }}>
      <Grid {...args} colProps={{ style: { border: "solid 1px #CCC" } }}>
        <Grid.Row>
          <Grid.Col>12</Grid.Col>
          <Grid.Col>12</Grid.Col>
          <Grid.Col>12</Grid.Col>
          <Grid.Col>12</Grid.Col>
          <Grid.Col>12</Grid.Col>
          <Grid.Col>12</Grid.Col>
          <Grid.Col>12</Grid.Col>
          <Grid.Col>12</Grid.Col>
          <Grid.Col>12</Grid.Col>
          <Grid.Col>12</Grid.Col>
          <Grid.Col>12</Grid.Col>
          <Grid.Col>12</Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col size={2}>6 Cols</Grid.Col>
          <Grid.Col size={2}>6 Cols</Grid.Col>
          <Grid.Col size={2}>6 Cols</Grid.Col>
          <Grid.Col size={2}>6 Cols</Grid.Col>
          <Grid.Col size={2}>6 Cols</Grid.Col>
          <Grid.Col size={2}>6 Cols</Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col size={3}>4 Columns</Grid.Col>
          <Grid.Col size={3}>4 Columns</Grid.Col>
          <Grid.Col size={3}>4 Columns</Grid.Col>
          <Grid.Col size={3}>4 Columns</Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col size={4}>3 Columns</Grid.Col>
          <Grid.Col size={4}>3 Columns</Grid.Col>
          <Grid.Col size={4}>3 Columns</Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col size={6}>2 Columns</Grid.Col>
          <Grid.Col size={6}>2 Columns</Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col size={12}>1 Column</Grid.Col>
        </Grid.Row>
      </Grid>
    </div>
  ),
};
