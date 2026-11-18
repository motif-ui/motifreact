import { Button, Container, Grid, Panel, Text } from "@motif-ui/react";

const Hero5 = () => (
  <Container>
    <Grid className="hero-5" padding={{ base: "lg", lgUp: "xxl" }} rowGap="xl">
      <Grid.Row justifyCols="center" rowGap="sm">
        <Grid.Col size={12} lg={10}>
          <Text text="Platform" weight="bold" tone="softer" size="md" type="paragraph" center marginless />
        </Grid.Col>
        <Grid.Col size={12} lg={10}>
          <Text
            text="Motif UI Components built for the modern stack."
            weight="bold"
            tone="strong"
            size="lg"
            type="display"
            marginless
            center
          />
        </Grid.Col>
        <Grid.Col size={12} lg={10}>
          <Text
            text="Plan tasks, track progress, and keep your entire software workflow connected in one place."
            weight="medium"
            tone="soft"
            size="md"
            type="heading"
            center
            marginless
          />
        </Grid.Col>
        <Grid.Col size={12}>
          <Grid.Row justifyCols="center" gap="sm" colsAuto>
            <Grid.Col>
              <Button label="Get Started" icon="arrow_right_alt" iconPosition="right" variant="secondary" />
            </Grid.Col>
            <Grid.Col>
              <Button label="View Docs" shape="outline" variant="secondary" />
            </Grid.Col>
          </Grid.Row>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row rowGap="xs" columnGap="xs" stretchItems>
        <Grid.Col size={12} xl={3} lg={6}>
          <Panel bordered title="Composable Patterns" titleIcon="expand_content" titleSize="lg">
            <Text text="Ship faster with structured sections and consistent spacing." />
          </Panel>
        </Grid.Col>
        <Grid.Col size={12} xl={3} lg={6}>
          <Panel bordered title="Design Tokens" titleIcon="dashboard" titleSize="lg">
            <Text text="Theme and scale colors, type, and radii from a single coherent system." />
          </Panel>
        </Grid.Col>
        <Grid.Col size={12} xl={3} lg={6}>
          <Panel bordered title="Accessible Defaults" titleIcon="keyboard" titleSize="lg">
            <Text text="Keyboard and screen-reader friendly building blocks out of the box." />
          </Panel>
        </Grid.Col>
        <Grid.Col size={12} xl={3} lg={6}>
          <Panel bordered title="Lightning fast" titleIcon="flash_on" titleSize="lg">
            <Text text="Optimized bundles and lazy loading for instant page transitions." />
          </Panel>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  </Container>
);

export default Hero5;
