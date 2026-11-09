import { Button, Container, Grid, ImageView, Text } from "@motif-ui/react";

const Hero2 = () => (
  <Container>
    <Grid padding={{ base: "lg", lgUp: "xl" }} rowGap="lg">
      <Grid.Row justifyCols="center" rowGap="sm">
        <Grid.Col size={12} lg={8}>
          <Text text="Move every project forward." type="display" size="lg" tone="strong" weight="bold" center marginless />
        </Grid.Col>
        <Grid.Col size={12} lg={6}>
          <Text
            text="Plan tasks, track progress, and keep your entire software workflow connected in one place."
            type="heading"
            size="sm"
            tone="normal"
            center
            marginless
          />
        </Grid.Col>
      </Grid.Row>
      <Grid.Row justifyCols="center" columnGap="sm" colsAuto>
        <Grid.Col>
          <Button label="Get Started" variant="secondary" />
        </Grid.Col>
        <Grid.Col>
          <Button label="Explore Components" variant="secondary" shape="outline" />
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col size={12}>
          <ImageView src="https://picsum.photos/seed/motifui-hero2/1200/600" alt="Project board preview" width="100%" />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  </Container>
);

export default Hero2;
