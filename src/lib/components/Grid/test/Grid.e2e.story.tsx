import type { Meta, StoryObj } from "@storybook/nextjs";
import Grid from "@/components/Grid";

// Scenes for the gap and padding tests in Grid.e2e.spec.ts. They are added to Storybook only in development, see .storybook/main.ts
const meta: Meta<typeof Grid> = {
  title: "E2E/Grid",
  component: Grid,
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Grid>;

const cols = (count: number, size: number) =>
  Array.from({ length: count }, (_, i) => (
    <Grid.Col key={i} size={size}>
      col
    </Grid.Col>
  ));

export const ResponsiveGaps: Story = {
  render: () => (
    <>
      <Grid className="responsive" gap={{ base: "sm", mdUp: "xl" }}>
        <Grid.Row className="responsive-row">{cols(2, 6)}</Grid.Row>
      </Grid>
      <Grid className="precedence" gap={{ mdUp: "xl" }} columnGap={{ smUp: "xs" }}>
        <Grid.Row className="precedence-row">{cols(2, 6)}</Grid.Row>
      </Grid>
    </>
  ),
};

export const RowGaps: Story = {
  render: () => (
    <Grid gap={{ base: "sm", lgUp: "xl" }}>
      <Grid.Row className="inheriting-row">{cols(2, 6)}</Grid.Row>
      <Grid.Row className="base-row" gap="xs">
        {cols(2, 6)}
      </Grid.Row>
      <Grid.Row className="partial-row" gap={{ mdUp: "xxl" }}>
        {cols(2, 6)}
      </Grid.Row>
    </Grid>
  ),
};

export const NestedGrids: Story = {
  render: () => (
    <Grid className="outer" gap={{ base: "xl", lgUp: "xxl" }} padding="xl">
      <Grid.Row className="outer-row" columnGap="lg">
        <Grid.Col size={12}>
          <Grid className="inner" gap="xs">
            <Grid.Row className="inner-row">{cols(2, 6)}</Grid.Row>
          </Grid>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  ),
};

export const NestedRows: Story = {
  render: () => (
    <Grid gap="sm">
      <Grid.Row className="parent-row" rowGap="md" columnGap="xl">
        <Grid.Col size={12}>
          <Grid.Row className="nested-row">
            <Grid.Col size={4}>col</Grid.Col>
            <Grid.Col size={8}>col</Grid.Col>
          </Grid.Row>
          <Grid.Row className="second-nested-row" gap="xs">
            {cols(3, 4)}
          </Grid.Row>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  ),
};

export const ColWidths: Story = {
  render: () => (
    <>
      {/* Not in the library's layer, like the CSS of the users, so it overrides the gap classes */}
      <style>{".custom-gap { --mtf-grid-base-gap: 30px; --mtf-grid-lg-gap: 120px; }"}</style>
      <Grid gap="xxl">
        <Grid.Row className="widest-row">{cols(3, 4)}</Grid.Row>
      </Grid>
      <Grid gap="none">
        <Grid.Row className="no-gap-row">{cols(3, 4)}</Grid.Row>
      </Grid>
      <Grid className="custom-gap">
        <Grid.Row className="custom-row">{cols(3, 4)}</Grid.Row>
      </Grid>
    </>
  ),
};

export const Paddings: Story = {
  render: () => (
    <>
      <style>{".custom-padding { --mtf-grid-md-padding: 120px; }"}</style>
      <Grid className="default-padding" gap="xl">
        <Grid.Row>{cols(1, 12)}</Grid.Row>
      </Grid>
      <Grid className="responsive-padding" padding={{ base: "xs", lgUp: "xxl" }}>
        <Grid.Row>{cols(1, 12)}</Grid.Row>
      </Grid>
      <Grid className="custom-padding" padding="lg">
        <Grid.Row>{cols(1, 12)}</Grid.Row>
      </Grid>
      <Grid className="lean" padding="lg" leanToEdge>
        <Grid.Row>{cols(1, 12)}</Grid.Row>
      </Grid>
    </>
  ),
};

export const StretchItems: Story = {
  render: () => (
    <Grid>
      <Grid.Row className="stretch-row" stretchItems>
        <Grid.Col size={6}>
          <div className="item">short</div>
        </Grid.Col>
        <Grid.Col size={6}>
          <div className="item">
            long long long long long long long long long long long long long long long long long long long long long long long long long
            long long long long long long long long long long long long long long long long long long long
          </div>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  ),
};
