import { Card, Grid, ImageView, Panel, Text } from "src/lib";
import styles from "./About3.module.scss";

const About3 = () => {
  return (
    <Panel>
      <Grid gutter="xl">
        <Grid.Row justifyCols="center" style={{ marginBottom: "clamp(var(--base-sizing-8x), 2vw, var(--base-sizing-24x))" }}>
          <Grid.Col size={12} lg={8} className={styles.centered}>
            <Text text="Our Background" variant="display-xl" className={styles.noMargin} />
            <Text
              text="Discover how our solution simplifies complex processes, making it easier to manage key operations and deliver exceptional experiences."
              variant="h5"
              className={styles.centered}
            />
          </Grid.Col>
        </Grid.Row>
        <Grid.Row style={{ marginBottom: "clamp(var(--base-sizing-8x), 2vw, var(--base-sizing-24x))" }}>
          <Grid.Col size={12} md={4}>
            <ImageView
              src="https://picsum.photos/seed/about1/800/500"
              width="100%"
              aspectRatio={460 / 385}
              scaleType="fillKeepAspectRatio"
            />
          </Grid.Col>
          <Grid.Col size={12} md={4}>
            <ImageView
              src="https://picsum.photos/seed/about2/800/500"
              width="100%"
              aspectRatio={460 / 385}
              scaleType="fillKeepAspectRatio"
            />
          </Grid.Col>
          <Grid.Col size={12} md={4}>
            <ImageView
              src="https://picsum.photos/seed/about3/800/500"
              width="100%"
              aspectRatio={460 / 385}
              scaleType="fillKeepAspectRatio"
            />
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col size={12} lg={6}>
            <Text text="About Us" variant="heading1" className={styles.noMargin} />
            <Text
              variant="p1"
              text="For years, the process of building custom software has remained challenging. Today, visual builders exist, 
              but tailored solutions still require technical expertise and a lot of time. This is a problem for businesses and individuals alike"
            />
            <Text
              variant="p1"
              text="What if you could create custom software without writing a single line of code? What if you could build your own tools"
            />
            <Text
              variant="p1"
              text="With our platform, you can! Our tools let you design layouts and create functionality—all without needing to code."
            />
            <Text
              variant="p1"
              text="We believe that everyone should be able to build their own solutions, regardless of their technical background."
            />
          </Grid.Col>
          <Grid.Col size={12} lg={6}>
            <Text text="Our Creators" variant="heading1" className={styles.noMargin} />
            <Text
              variant="p1"
              text="Our Company has been building web tools for over a decade, focusing on efficiency and user control in every project.
               We know that the best solutions are the ones that you can create yourself."
            />
            <Text
              variant="p1"
              text="We initially developed these solutions for our own team, and now everyone can benefit from them too. We are proud to offer a platform that is accessible to all, regardless of technical expertise."
            />
            <Text
              variant="p1"
              text="Our team is made up of talented individuals who are passionate about creating tools that empower users to build their own solutions with ease. We are dedicated to helping you achieve your goals, and we can’t wait to see what you create!"
            />
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col size={12}>
            <Card
              className={styles.card}
              title="Part of Our Global Team"
              contentLink={{ text: "Get to know the team", href: "#", targetBlank: true }}
            />
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </Panel>
  );
};
export default About3;
