import { Button, Container, Grid, ImageView, Text } from "@motif-ui/react";

const Hero4 = () => (
  <Container>
    <Grid padding={{ base: "lg", lgUp: "xl" }}>
      <Grid.Row gap={{ base: "lg", xsUp: "xl" }}>
        <Grid.Col size={12} lg={5}>
          <Grid gap={{ base: "lg", xsUp: "xl" }} padding="none">
            <Grid.Row>
              <Grid.Col size={12}>
                <Text text="Your website builder" type="caption" size="md" tone="soft" weight="semibold" uppercase marginless />
              </Grid.Col>
            </Grid.Row>
            <Grid.Row rowGap="sm">
              <Grid.Col size={12}>
                <Text text="Components built for production." type="display" size="lg" tone="strong" weight="bold" marginless />
              </Grid.Col>
              <Grid.Col size={12} lg={10}>
                <Text
                  text="Finely crafted components built with React, Tailwind and Motif UI. Developers can copy and paste these blocks directly into their project."
                  type="heading"
                  size="sm"
                  tone="soft"
                  marginless
                />
              </Grid.Col>
            </Grid.Row>
            <Grid.Row gap="sm" colsAuto>
              <Grid.Col>
                <Button label="Discover All Components" variant="secondary" />
              </Grid.Col>
              <Grid.Col>
                <Button label="View on GitHub" iconPosition="left" icon="chevron_right" variant="secondary" shape="outline" />
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </Grid.Col>
        <Grid.Col size={12} lg={7}>
          <ImageView src="https://picsum.photos/seed/motifui-hero4/800/700" alt="Component showcase preview" width="100%" />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  </Container>
);

export default Hero4;
