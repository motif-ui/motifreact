import { Container, Grid, ImageView, Text } from "@motif-ui/react";
import "./hero3.css";

const Hero3 = () => (
  <Container>
    <Grid className="hero-3" rowGap="xl" padding={{ smUp: "md", mdUp: "lg", lgUp: "xxl" }}>
      <Grid.Row justifyCols="center" rowGap="sm">
        <Grid.Col size={12} lg={8}>
          <Text type="display" size="lg" weight="bold" tone="strong" center marginless>
            Turn{" "}
            <Text tone="strong" weight="bold" italic style={{ fontSize: "inherit", lineHeight: "inherit" }}>
              ideas
            </Text>{" "}
            into shipped{" "}
            <Text tone="strong" weight="bold" italic style={{ fontSize: "inherit", lineHeight: "inherit" }}>
              products
            </Text>
            .
          </Text>
        </Grid.Col>
        <Grid.Col size={12} md={10} lg={8}>
          <Text
            text="Move seamlessly from planning to development with flexible tools designed for modern software teams."
            type="paragraph"
            size="xl"
            weight="medium"
            tone="soft"
            center
            marginless
          />
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col size={12} className="gallery">
          <ImageView
            className="side"
            src="https://picsum.photos/id/11/297/382"
            alt="Analytics dashboard"
            width="31%"
            aspectRatio={297 / 382}
          />
          <ImageView
            className="main"
            src="https://picsum.photos/id/950/422/541"
            alt="Code, review and workflow tools"
            width="44%"
            aspectRatio={422 / 541}
          />
          <ImageView
            className="side"
            src="https://picsum.photos/id/907/297/382"
            alt="Cloud infrastructure"
            width="31%"
            aspectRatio={297 / 382}
          />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  </Container>
);

export default Hero3;
