import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import ImageView from "@/components/ImageView/ImageView";
import { ImageViewProps } from "@/components/ImageView/types";
import ImageViewBaseline from "./baseline/ImageView/ImageView";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SRC = "https://picsum.photos/seed/motifui/200/300";
// A missing file: the image shows the broken-image placeholder
const BROKEN = "/missing-image.png";
const SIZE = { width: 160, height: 120 };

const Current = ImageViewBaseline as ComponentType<ImageViewProps>;

const sections: CompareSection<ImageViewProps>[] = [
  {
    title: "Image",
    note: "The radius, the bordered line and the solid fill come from the tokens.",
    rows: [
      { label: "default", props: { src: SRC, ...SIZE } },
      { label: "bordered", props: { src: SRC, bordered: true, ...SIZE } },
      { label: "solid · fit", props: { src: SRC, solid: true, scaleType: "fit", ...SIZE } },
    ],
  },
  {
    title: "Broken image",
    rows: [
      { label: "default", props: { src: BROKEN, ...SIZE } },
      { label: "bordered + solid", props: { src: BROKEN, bordered: true, solid: true, ...SIZE } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/ImageView",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const ImageView_: StoryObj<typeof TokenCompare> = {
  name: "ImageView",
  render: () => <TokenCompare sections={sections} current={Current} next={ImageView} />,
};
