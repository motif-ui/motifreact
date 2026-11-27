import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType, ReactElement } from "react";
import Carousel from "@/components/Carousel";
import { CarouselProps } from "@/components/Carousel/types";
import CarouselBaseline from "./baseline/Carousel";
import { CompareSection, TokenCompare } from "./TokenCompare";

type Row = CarouselProps & { image: string; title?: string; subtitle?: string };

type View = ComponentType<CarouselProps & { children: ReactElement[] }> & {
  Item: ComponentType<{ title?: string; subtitle?: string; children: ReactElement }>;
};

const view =
  (CarouselView: View) =>
  ({ image, title, subtitle, ...props }: Row) => (
    <CarouselView height={220} {...props}>
      {[0, 1, 2].map(index => (
        <CarouselView.Item key={index} title={title} subtitle={subtitle}>
          <img src={image} alt="" />
        </CarouselView.Item>
      ))}
    </CarouselView>
  );

// Today's theme is the image's tone: theme="light" gave the dark content that colorScheme="dark" gives now
const CurrentView = view(CarouselBaseline);
const Current = ({ colorScheme = "dark", ...props }: Row) => (
  <CurrentView {...props} {...({ theme: colorScheme === "dark" ? "light" : "dark" } as object)} />
);
const Next = view(Carousel);

const BRIGHT = "https://picsum.photos/id/1036/700/500";
const DARK = "https://picsum.photos/id/1067/700/500";
const base: Row = { image: BRIGHT, title: "Mountain lake", subtitle: "A slide with a title and a subtitle" };

const sections: CompareSection<Row>[] = [
  {
    title: "colorScheme",
    note: 'theme is replaced by colorScheme, the color of the content: dark (default, was theme="light") for a bright image, light (was theme="dark") for a dark one. It sets data-mtf-mode on the root, so it holds in every page mode.',
    rows: [
      { label: "dark · bright image", props: { ...base, colorScheme: "dark" } },
      { label: "light · dark image", props: { ...base, image: DARK, colorScheme: "light" } },
    ],
  },
  {
    title: "contentBackdrop",
    note: "New: the title, the subtitle, the controls (round) and each indicator (a 2px ring) sit on the page surface at 80%: light behind dark content, dark behind light content. Today has no backdrop.",
    rows: [
      { label: "dark · bright image", props: { ...base, colorScheme: "dark", contentBackdrop: true } },
      { label: "light · dark image", props: { ...base, image: DARK, colorScheme: "light", contentBackdrop: true } },
    ],
  },
  {
    title: "Indicators",
    rows: [
      { label: "dot", props: { ...base, indicatorShape: "dot" } },
      { label: "line", props: { ...base, indicatorShape: "line" } },
    ],
  },
  {
    title: "Content",
    rows: [
      { label: "title only", props: { ...base, subtitle: undefined } },
      { label: "no text", props: { ...base, title: undefined, subtitle: undefined } },
      { label: "removeControls · removeIndicators", props: { ...base, removeControls: true, removeIndicators: true } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Carousel",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Carousel_: StoryObj<typeof TokenCompare> = {
  name: "Carousel",
  render: () => <TokenCompare sections={sections} current={Current} next={Next} columnWidth={360} />,
};
