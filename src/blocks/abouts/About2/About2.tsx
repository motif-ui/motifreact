import { Grid, ImageView, Panel, Text, Container } from "@motif-ui/react";

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
  <Container>
    <Grid className="about2" rowGap={{ base: "lg", lgUp: "xxl" }} padding={{ base: "lg", lgUp: "xxl" }}>
      <Grid.Row rowGap="lg">
        <Grid.Col size={12}>
          <Text text="About Us" type="display" size="lg" center tone="strong" marginless />
        </Grid.Col>
        <Grid.Col size={12}>
          <Text
            text="Motif UI makes it easy to build customer portals, CRMs, internal tools, and other business applications for your team. In minutes, not months."
            type="heading"
            size="md"
            marginless
            center
            tone="soft"
          />
        </Grid.Col>
      </Grid.Row>
      <Grid.Row columnGap="xl" rowGap="md">
        <Grid.Col size={12} lg={6}>
          <ImageView src="https://picsum.photos/seed/about2-laptop/571/443" width="100%" />
        </Grid.Col>
        <Grid.Col size={12} lg={6}>
          <ImageView src="https://picsum.photos/seed/about2-city/571/443" width="100%" />
        </Grid.Col>
      </Grid.Row>
      <Grid.Row rowGap="md">
        <Grid.Col size={12}>
          <Grid.Row justifyCols="center" rowGap="sm">
            <Grid.Col size={12} lg={6}>
              <Text text="We make creating software easy." type="display" size="md" marginless center tone="strong" />
            </Grid.Col>
            <Grid.Col size={12}>
              <Text
                text="We aim to help empower 1,000,000 teams to create their own software. Here is how we plan on doing it."
                type="heading"
                size="md"
                marginless
                center
                tone="soft"
              />
            </Grid.Col>
          </Grid.Row>
          <Grid.Row gap={{ base: "sm", mdUp: "md" }} stretchItems>
            {features.map(feature => (
              <Grid.Col size={12} md={4} key={feature.title}>
                <Panel bordered title={feature.title} titleIcon={feature.icon} titleSize="lg">
                  <Text text={feature.description} type="caption" size="lg" marginless tone="strong" />
                </Panel>
              </Grid.Col>
            ))}
          </Grid.Row>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  </Container>
);

export default About2;
