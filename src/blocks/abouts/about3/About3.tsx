import { Container, Grid, ImageView, Link, Panel, Text } from "src/lib";
import "./about3.css";

const About3 = () => (
  <Container>
    <Grid rowGap={{ base: "md", mdUp: "xl" }} columnGap="md" padding={{ base: "none", smUp: "md", mdUp: "lg", lgUp: "xxl" }} fluid>
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
          <ImageView src="https://picsum.photos/seed/about1/384/320" width="100%" aspectRatio={384 / 320} scaleType="fillKeepAspectRatio" />
        </Grid.Col>
        <Grid.Col size={12} md={4}>
          <ImageView src="https://picsum.photos/seed/about2/384/320" width="100%" aspectRatio={384 / 320} scaleType="fillKeepAspectRatio" />
        </Grid.Col>
        <Grid.Col size={12} md={4}>
          <ImageView src="https://picsum.photos/seed/about3/384/320" width="100%" aspectRatio={384 / 320} scaleType="fillKeepAspectRatio" />
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col size={12} lg={6}>
          <Text text="About Us" type="display" size="sm" marginless />
          <Text
            type="paragraph"
            size="lg"
            tone="soft"
            weight="medium"
            text="For years, the process of building custom software has remained challenging. Today, visual builders exist, 
              but tailored solutions still require technical expertise and a lot of time. This is a problem for businesses and individuals alike"
          />
          <Text
            type="paragraph"
            size="lg"
            tone="soft"
            weight="medium"
            text="What if you could create custom software without writing a single line of code? What if you could build your own tools"
          />
          <Text
            type="paragraph"
            size="lg"
            tone="soft"
            weight="medium"
            text="With our platform, you can! Our tools let you design layouts and create functionality—all without needing to code."
          />
          <Text
            type="paragraph"
            size="lg"
            tone="soft"
            weight="medium"
            text="We believe that everyone should be able to build their own solutions, regardless of their technical background."
          />
        </Grid.Col>
        <Grid.Col size={12} lg={6}>
          <Text text="Our Creators" type="display" size="sm" marginless />
          <Text
            type="paragraph"
            size="lg"
            tone="soft"
            weight="medium"
            text="Our Company has been building web tools for over a decade, focusing on efficiency and user control in every project.
               We know that the best solutions are the ones that you can create yourself."
          />
          <Text
            type="paragraph"
            size="lg"
            tone="soft"
            weight="medium"
            text="We initially developed these solutions for our own team, and now everyone can benefit from them too. We are proud to offer a platform that is accessible to all, regardless of technical expertise."
          />
          <Text
            type="paragraph"
            size="lg"
            tone="soft"
            weight="medium"
            text="Our team is made up of talented individuals who are passionate about creating tools that empower users to build their own solutions with ease. We are dedicated to helping you achieve your goals, and we can’t wait to see what you create!"
          />
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col size={12}>
          <Panel>
            <Text text="Part of Our Global Team" type="caption" weight="bold" />
            <Link label="Get to know the team" url="www.motif-ui.com/" targetBlank />
          </Panel>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  </Container>
);
export default About3;
