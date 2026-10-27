import { Container, Grid, ImageView, Link, Panel, Text } from "src/lib";
import "./about3.css";

const aboutUsParagraphs = [
  "For years, the process of building custom software has remained challenging. Today, visual builders exist, but tailored solutions still require technical expertise and a lot of time. This is a problem for businesses and individuals alike",
  "What if you could create custom software without writing a single line of code? What if you could build your own tools",
  "With our platform, you can! Our tools let you design layouts and create functionality—all without needing to code.",
  "We believe that everyone should be able to build their own solutions, regardless of their technical background.",
];

const creatorsParagraphs = [
  "Our Company has been building web tools for over a decade, focusing on efficiency and user control in every project. We know that the best solutions are the ones that you can create yourself.",
  "We initially developed these solutions for our own team, and now everyone can benefit from them too. We are proud to offer a platform that is accessible to all, regardless of technical expertise.",
  "Our team is made up of talented individuals who are passionate about creating tools that empower users to build their own solutions with ease. We are dedicated to helping you achieve your goals, and we can’t wait to see what you create!",
];

const About3 = () => (
  <Container>
    <Grid rowGap={{ base: "md", mdUp: "lg" }} columnGap="md" padding={{ base: "none", smUp: "md", mdUp: "lg", lgUp: "xxl" }} fluid>
      <Grid.Row justifyCols="center">
        <Grid.Col size={12} lg={8}>
          <Text text="Our Background" type="display" size="lg" marginless center />
          <Text
            text="Discover how our solution simplifies complex processes, making it easier to manage key operations and deliver exceptional experiences."
            type="heading"
            tone="soft"
            center
          />
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col size={12} md={4}>
          <ImageView src="https://picsum.photos/seed/about1/384/320" width="100%" />
        </Grid.Col>
        <Grid.Col size={12} md={4}>
          <ImageView src="https://picsum.photos/seed/about2/384/320" width="100%" />
        </Grid.Col>
        <Grid.Col size={12} md={4}>
          <ImageView src="https://picsum.photos/seed/about3/384/320" width="100%" />
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col size={12} lg={6}>
          <Grid.Row rowGap="lg">
            <Text text="About Us" type="display" size="sm" marginless />
          </Grid.Row>
          <Grid.Row rowGap="md">
            {aboutUsParagraphs.map(text => (
              <Text key={text} text={text} type="paragraph" size="lg" tone="soft" weight="medium" marginless />
            ))}
          </Grid.Row>
        </Grid.Col>
        <Grid.Col size={12} lg={6}>
          <Grid.Row rowGap="lg">
            <Text text="Our Creators" type="display" size="sm" marginless />
          </Grid.Row>
          <Grid.Row rowGap="md">
            {creatorsParagraphs.map(text => (
              <Text key={text} text={text} type="paragraph" size="lg" tone="soft" weight="medium" marginless />
            ))}
          </Grid.Row>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col size={12}>
          <Panel className="about3-footer">
            <Text text="Part of Our Global Team" type="body" size="xl" weight="bold" />
            <Link className="about3-footer-link" size="sm" label="Get to know the team" url="https://www.motif-ui.com/" targetBlank />
          </Panel>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  </Container>
);
export default About3;
