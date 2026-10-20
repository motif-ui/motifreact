import { Grid, ImageView, Panel, Text } from "@motif-ui/react";
import "./about2.css";

const features = [
  {
    icon: "handshake",
    title: "Being radically open",
    description:
      "We believe there's no room for big egos and there's always time to help each other. We strive to give and receive feedback, ideas, perspectives. By working openly and supporting one another, we grow stronger as a team.",
  },
  {
    icon: "dashboard",
    title: "Design Tokens",
    description:
      "Boldly, bravely, and with clear aims. We seek out the big opportunities and double down on the most important things to work on. We focus our energy where it can create the greatest impact and move the team forward and more.",
  },
  {
    icon: "shield",
    title: "Accessible Defaults",
    description:
      "We believe that everyone should be empowered to do what they think is in the company's best interests. By giving people trust, ownership, and freedom. We enable confident decisions and meaningful contributions.",
  },
];

const About2 = () => (
  <Panel className="panel">
    <Grid gutter="xxl" leanToEdge>
      <Grid.Row justifyCols="center">
        <Grid.Col size={12} lg={8}>
          <Grid gutter="lg" leanToEdge>
            <Grid.Row justifyCols="center">
              <Text text="About Us" type="display" size="lg" marginless center tone="strong" />
            </Grid.Row>
            <Grid.Row justifyCols="center">
              <Text
                text="Motif UI makes it easy to build customer portals, CRMs, internal tools, and other business applications for your team. In minutes, not months."
                type="heading"
                size="md"
                marginless
                center
                tone="soft"
              />
            </Grid.Row>
          </Grid>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col size={12} md={6}>
          <ImageView
            src="https://picsum.photos/seed/about2-laptop/571/443"
            width="100%"
            aspectRatio={571 / 443}
            scaleType="fillKeepAspectRatio"
          />
        </Grid.Col>
        <Grid.Col size={12} md={6}>
          <ImageView
            src="https://picsum.photos/seed/about2-city/571/443"
            width="100%"
            aspectRatio={571 / 443}
            scaleType="fillKeepAspectRatio"
          />
        </Grid.Col>
      </Grid.Row>
      <Grid.Row justifyCols="center">
        <Grid.Col size={12} lg={8}>
          <Grid gutter="lg" leanToEdge>
            <Grid.Row justifyCols="center">
              <Text text="We make creating software easy." type="display" size="lg" marginless center tone="strong" />
            </Grid.Row>
            <Grid.Row justifyCols="center">
              <Text
                text="We aim to help empower 1,000,000 teams to create their own software. Here is how we plan on doing it."
                type="heading"
                size="md"
                marginless
                center
                tone="soft"
              />
            </Grid.Row>
          </Grid>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid gutterX="md" leanToEdge>
          <Grid.Row>
            {features.map(feature => (
              <Grid.Col size={12} md={4} key={feature.title}>
                <Panel bordered title={feature.title} titleIcon={feature.icon} titleSize="lg">
                  <Text text={feature.description} type="caption" size="lg" marginless tone="strong" />
                </Panel>
              </Grid.Col>
            ))}
          </Grid.Row>
        </Grid>
      </Grid.Row>
    </Grid>
  </Panel>
);

export default About2;
