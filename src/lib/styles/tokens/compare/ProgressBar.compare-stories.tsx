import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import ProgressBar from "@/components/ProgressBar/ProgressBar";
import { ProgressBarProps } from "@/components/ProgressBar/types";
import ProgressBarBaseline from "./baseline/ProgressBar/ProgressBar";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;
const VARIANTS = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "danger"] as const;

// The baseline has no neutral/accent and its secondary is gray
const Current = ProgressBarBaseline as ComponentType<ProgressBarProps>;

const sections: CompareSection<ProgressBarProps>[] = [
  { title: "Sizes", rows: SIZES.map(size => ({ label: size, props: { size, progress: 65, showPercentage: true } })) },
  {
    title: "Variants",
    note: "The Today column has no neutral or accent. secondary is gray on legacy and the brand color on basic.",
    rows: VARIANTS.map(variant => ({ label: variant, props: { variant, size: "md" as const, progress: 65, showPercentage: true } })),
  },
  {
    title: "States",
    rows: [
      { label: "0%", props: { size: "md", progress: 0, showPercentage: true } },
      { label: "100%", props: { size: "md", progress: 100, showPercentage: true } },
      { label: "Indeterminate", props: { size: "md", indeterminate: true } },
      { label: "Countdown, paused", props: { size: "md", countdown: { duration: 10000, paused: true } } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/ProgressBar",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const ProgressBar_: StoryObj<typeof TokenCompare> = {
  name: "ProgressBar",
  render: () => <TokenCompare sections={sections} current={Current} next={ProgressBar} />,
};
