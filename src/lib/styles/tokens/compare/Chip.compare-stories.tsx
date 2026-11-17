import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import Chip from "@/components/Chip/Chip";
import ChipV2 from "@/components/ChipV2/Chip";
import { ChipProps } from "@/components/ChipV2/types";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xs", "sm", "md", "lg"] as const;
const VARIANTS = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "danger"] as const;
const SHAPES = ["solid", "outline"] as const;

// The current Chip has no neutral/accent; its default is secondary (light gray), the new default is neutral
const Current = Chip as ComponentType<ChipProps>;

const sections: CompareSection<ChipProps>[] = [
  { title: "Sizes", rows: SIZES.map(size => ({ label: size, props: { size, label: "Chip", icon: "check", closable: true } })) },
  ...SHAPES.map(shape => ({
    title: `Variants · ${shape}`,
    note:
      shape === "solid"
        ? "The default is neutral (it was secondary, light gray), which keeps that look. secondary is gray on legacy."
        : undefined,
    rows: VARIANTS.map(variant => ({ label: variant, props: { variant, shape, label: "Chip", closable: true } })),
  })),
  {
    title: "Options",
    note: "A closable chip changes its fill on hover; hover over it in Storybook.",
    rows: [
      { label: "pill", props: { label: "Chip", pill: true } },
      { label: "icon", props: { label: "Chip", icon: "check" } },
      { label: "not closable", props: { label: "Chip" } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Chip",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Chip_: StoryObj<typeof TokenCompare> = {
  name: "Chip",
  render: () => <TokenCompare sections={sections} current={Current} next={ChipV2} />,
};
