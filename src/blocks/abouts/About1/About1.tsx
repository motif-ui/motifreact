"use client";

import { Card, Grid, ImageView, Text } from "@motif-ui/react";
import styles from "./About1.module.scss";

const HERO_IMAGE_URL = "https://picsum.photos/seed/motifui-about/1600/640";

const About1 = () => {
  return (
    <Grid leanToEdge className={styles.grid}>
      <Grid.Row>
        <Grid.Col>
          <Text fontWeight="bold" style={{ margin: 0 }} variant="title1" text="About Us" className={styles.text} />
        </Grid.Col>
      </Grid.Row>

      <Grid.Row>
        <Grid.Col>
          <ImageView
            src={HERO_IMAGE_URL}
            alt="Our team at work"
            width="100%"
            aspectRatio={2.5}
            scaleType="fillKeepAspectRatio"
            solid
            style={{ display: "block" }}
          />
        </Grid.Col>
      </Grid.Row>

      <Grid.Row>
        <Grid.Col size={12} lg={3}>
          <Text variant="h5" fontWeight="semiBold" text="Our Crew, Our Story" style={{ margin: 0 }} className={styles.text} />
        </Grid.Col>
        <Grid.Col size={12} md={5} lg={5} xl={4}>
          <div className={styles.stack}>
            <Text
              style={{ margin: 0 }}
              variant="h5"
              text="We aim to bring diverse minds together, turning ideas into experiences that matter."
              className={styles.paragraph}
            />
            <Card title="Metin Tekin" subtitle="Chef Executive Officer" icon="person" />
          </div>
        </Grid.Col>
        <Grid.Col size={12} md={7} lg={4} xl={5}>
          <Text
            style={{ margin: 0 }}
            variant="h3"
            fontWeight="bold"
            text="We are a team of creators, thinkers, and builders who believe in crafting experiences that truly connect. Our story is built on passion, innovation, and the  drive to bring meaningful ideas to life."
            className={styles.paragraph}
          />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
};

About1.displayName = "About1";
export default About1;
