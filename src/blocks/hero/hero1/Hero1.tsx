import { Container, Grid, Text, Link, Button, ImageView } from "@motif-ui/react";
import "./hero1.css";

const Hero1 = () => (
  <Container>
    <Grid
      className="hero-1"
      padding={{ base: "lg", lgUp: "xl" }}
      rowGap={{ base: "xxl", lgUp: "xl" }}
      columnGap={{ base: "lg", lgUp: "xl" }}
    >
      <Grid.Row stretchItems>
        <Grid.Col size={12} xl={4}>
          <Text text="A modern foundation for your next product" weight="semibold" type="caption" tone="soft" size="sm" />
          <Text text="Build Better Interfaces. Faster." size="lg" type="display" tone="strong" />
          <Text
            type="paragraph"
            marginless
            weight="medium"
            tone="soft"
            text="Production-ready components built with Motif UI, React and TypeScript, powered by design tokens. Create consistent and accessible digital experiences from a single design foundation."
          />
          <div className="hero-1-buttons">
            <Link label="Documentation" url="https://docs.motif-ui.com" targetBlank external size="lg" />
            <Button
              label="Get Started"
              pill
              variant="secondary"
              icon="external"
              iconPosition="right"
              size="md"
              onClick={() => window.open("https://motif-ui.com", "_blank", "noopener,noreferrer")}
            />
          </div>
        </Grid.Col>
        <Grid.Col size={12} xl={8}>
          <div className="hero-1-images">
            <ImageView src="https://picsum.photos/seed/motifui-hero5/594/922" alt="Code editor" />
            <ImageView src="https://picsum.photos/seed/motifui-hero7/594/912" alt="Laptop on a desk" />
            <ImageView src="https://picsum.photos/seed/motifui-hero9/594/912" alt="Monitor with code" />
          </div>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  </Container>
);

export default Hero1;
