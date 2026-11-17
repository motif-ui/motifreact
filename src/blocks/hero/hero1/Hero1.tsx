import { Container, Grid, Text, Link, Button, ImageView } from "@motif-ui/react";
import "./hero1.css";

const Hero1 = () => (
  <Container>
    <Grid className="hero-1" padding={{ base: "lg", lgUp: "xl" }} columnGap={{ base: "lg", lgUp: "xl" }}>
      <Grid.Row rowGap="xl">
        <Grid.Col size={12} lg={4}>
          <Grid.Row>
            <Text text="A modern foundation for your next product" weight="semibold" type="body" tone="soft" size="xs" marginless />
          </Grid.Row>
          <Grid.Row rowGap="sm" columnGap="sm">
            <Grid.Col size={12}>
              <Text text="Build Better Interfaces. Faster." size="lg" type="display" tone="strong" marginless />
            </Grid.Col>
            <Grid.Col size={12}>
              <Text
                type="paragraph"
                marginless
                weight="medium"
                tone="soft"
                text="Production-ready components built with Motif UI, React and TypeScript, powered by design tokens. Create consistent and accessible digital experiences from a single design foundation."
              />
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col className="buttons">
              <Link label="Documentation" url="https://docs.motif-ui.com" targetBlank external size="lg" />
              <Button label="Get Started" pill variant="secondary" icon="external" iconPosition="right" size="md" />
            </Grid.Col>
          </Grid.Row>
        </Grid.Col>
        <Grid.Col size={12} lg={8} className="hero-1-images">
          <ImageView src="https://picsum.photos/seed/motifui-hero5/594/922" alt="Code editor" />
          <ImageView src="https://picsum.photos/seed/motifui-hero7/594/912" alt="Laptop on a desk" />
          <ImageView src="https://picsum.photos/seed/motifui-hero9/594/912" alt="Monitor with code" />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  </Container>
);

export default Hero1;
