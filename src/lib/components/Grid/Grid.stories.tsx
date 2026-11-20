import type { Meta, StoryObj } from "@storybook/nextjs";

import Grid from "@/components/Grid/Grid";

export const gridSpacingType = {
  summary: "GridSpacing",
  detail: `type Size = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "none";

type GridSpacing =
  | Size
  | {
      base?: Size;
      xsUp?: Size;
      smUp?: Size;
      mdUp?: Size;
      lgUp?: Size;
      xlUp?: Size;
      xxlUp?: Size;
    };`,
};

const meta: Meta<typeof Grid> = {
  title: "Components/Grid",
  component: Grid,
  excludeStories: ["gridSpacingType"],
  argTypes: {
    gap: { table: { type: gridSpacingType, defaultValue: { summary: "sm" } } },
    rowGap: { table: { type: gridSpacingType } },
    columnGap: { table: { type: gridSpacingType } },
    padding: { table: { type: gridSpacingType, defaultValue: { summary: "sm" } } },
    gutter: { table: { defaultValue: { summary: "sm" } } },
  },
  parameters: {
    layout: "fullscreen",
  },
  args: {
    colProps: { style: { border: "solid 1px #CCC" } },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const Primary: Story = {
  render: args => (
    <Grid {...args}>
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
  ),
};
