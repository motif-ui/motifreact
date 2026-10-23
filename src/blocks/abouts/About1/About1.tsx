import { Card, Grid, ImageView, Text, Container } from "@motif-ui/react";

const About1 = () => (
  <Container>
    <Grid className="about1" gap="xl" padding="none">
      <Grid.Row>
        <Grid.Col size={12}>
          <Text marginless weight="bold" type="display" size="lg" tone="strong" text="About Us" />
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col size={12}>
          <ImageView src="https://picsum.photos/seed/motifui-about/1600/640" alt="Our team at work" width="100%" solid />
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col size={12} lg={3}>
          <Text type="body" size="xl" weight="semibold" tone="strong" text="Our Crew, Our Story" />
        </Grid.Col>
        <Grid.Col size={12} md={5} lg={5} xl={4}>
          <Grid.Row rowGap="lg">
            <Grid.Col size={12}>
              <Text
                type="body"
                size="xl"
                weight="semibold"
                tone="soft"
                text="We aim to bring diverse minds together, turning ideas into experiences that matter."
              />
            </Grid.Col>
            <Grid.Col size={12}>
              <Card
                variant="neutral"
                title="Metin Tekin"
                subtitle="Chief Executive Officer"
                icon={
                  <ImageView
                    src="https://cdn.jsdelivr.net/gh/motif-ui/assets@HEAD/images/motifui-logo-mark.svg"
                    alt="Motif UI"
                    width="100%"
                    height="100%"
                  />
                }
              />
            </Grid.Col>
          </Grid.Row>
        </Grid.Col>
        <Grid.Col size={12} md={7} lg={4} xl={5}>
          <Text
            marginless
            weight="bold"
            type="heading"
            size="lg"
            text="We are a team of creators, thinkers, and builders who believe in crafting experiences that truly connect. Our story is built on passion, innovation, and the drive to bring meaningful ideas to life."
          />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  </Container>
);

export default About1;
