import type { Meta, StoryObj } from "@storybook/nextjs";
import Carousel from "./Carousel";

const meta: Meta<typeof Carousel> = {
  title: "Components/Carousel",
  component: Carousel,
  argTypes: {
    indicatorShape: { table: { defaultValue: { summary: "dot" } } },
    theme: { table: { defaultValue: { summary: "light" } } },
    autoplayInterval: { table: { defaultValue: { summary: "3000" } } },
    children: { control: false },
  },
  args: {
    height: 500,
    children: [
      <Carousel.Item title="Slide of an Image" subtitle="This slide contains a single image and designed to show it!" key={0}>
        <img src="https://picsum.photos/id/114/700/500" alt="Image 1" />
      </Carousel.Item>,
      <Carousel.Item title="Slide with Only Title" key={1}>
        <img src="https://picsum.photos/id/142/700/500" alt="Image 2" />
      </Carousel.Item>,
      <Carousel.Item key={2}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <span style={{ color: "#951313" }}>Custom Content</span>
          <p style={{ color: "#777" }}>This slide contains custom html content instead of an image.</p>
          <img src="https://media1.tenor.com/m/MWE_h3DoVBQAAAAd/cat-dance-rainbow-cat-dance.gif" height={100} alt="Cat" />
        </div>
      </Carousel.Item>,
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

export const Primary: Story = {};
