import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import Divider from "@/components/Divider/Divider";
import { DividerProps } from "@/components/Divider/types";
import DividerBaseline from "./baseline/Divider/Divider";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["sm", "md", "lg"] as const;
const SHAPES = ["solid", "dashed", "dotted"] as const;

// A vertical divider fills its parent's height, so it gets a parent with a height
const InRow = (Component: ComponentType<DividerProps>) => (props: DividerProps) =>
  props.orientation === "vertical" ? (
    <div style={{ display: "flex", height: 48 }}>
      <Component {...props} />
    </div>
  ) : (
    <Component {...props} />
  );

const sections: CompareSection<DividerProps>[] = [
  { title: "Boyutlar", rows: SIZES.map(size => ({ label: size, props: { size } })) },
  { title: "Şekiller", rows: SHAPES.map(shape => ({ label: shape, props: { shape, size: "md" } })) },
  {
    title: "Dikey",
    rows: SIZES.map(size => ({ label: `vertical · ${size}`, props: { size, orientation: "vertical" } })),
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Karşılaştırma/Divider",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Divider_: StoryObj<typeof TokenCompare> = {
  name: "Divider",
  render: () => <TokenCompare sections={sections} current={InRow(DividerBaseline)} next={InRow(Divider)} />,
};
