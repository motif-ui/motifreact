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
        <Grid.Col size={12} lg={4}>
          <Text text="A modern foundation for your next product" marginless weight="semibold" type="caption" tone="soft" size="sm" />
          <Text text="Build Better Interfaces. Faster." marginless size="lg" type="display" tone="strong" />
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
        <Grid.Col size={12} lg={8}>
          <div className="hero-1-images">
            <ImageView
              src="https://images.unsplash.com/photo-1731839329389-906c44fa1328?auto=format&fit=crop&w=528&h=704&q=80"
              alt="Code editor"
            />
            <ImageView
              src="https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1?auto=format&fit=crop&w=594&h=912&q=80"
              alt="Laptop on a desk"
            />
            <ImageView
              src="https://images.unsplash.com/photo-1618389041494-8fab89c3f22b?auto=format&fit=crop&w=528&h=704&q=80"
              alt="Monitor with code"
            />
          </div>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  </Container>
);

export default Hero1;
