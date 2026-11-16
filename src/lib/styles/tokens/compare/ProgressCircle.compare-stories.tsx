import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import ProgressCircle from "@/components/ProgressCircle/ProgressCircle";
import { ProgressCircleProps } from "@/components/ProgressCircle/types";
import ProgressCircleBaseline from "./baseline/ProgressCircle/ProgressCircle";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;
const VARIANTS = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "danger"] as const;

// The baseline has no neutral/accent: it drops the unknown class, so those rows show only the track
const Baseline = ProgressCircleBaseline as ComponentType<ProgressCircleProps>;

const sections: CompareSection<ProgressCircleProps>[] = [
  {
    title: "Boyutlar",
    rows: SIZES.map(size => ({ label: size, props: { size, progress: 65, showPercentage: true } })),
  },
  {
    title: "Varyantlar",
    rows: [
      { label: "(yok)", props: { size: "lg", progress: 65, showPercentage: true } },
      ...VARIANTS.map(variant => ({ label: variant, props: { variant, size: "lg" as const, progress: 65, showPercentage: true } })),
    ],
  },
  {
    title: "Durumlar",
    rows: [
      { label: "0%", props: { size: "lg", progress: 0, showPercentage: true } },
      { label: "100%", props: { size: "lg", progress: 100, showPercentage: true } },
      { label: "Yüzdesiz", props: { size: "lg", progress: 40 } },
      { label: "Indeterminate", props: { size: "lg", indeterminate: true } },
      { label: "Countdown, duraklatılmış", props: { size: "lg", countdown: { duration: 10, paused: true } } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Karşılaştırma/ProgressCircle",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const ProgressCircle_: StoryObj<typeof TokenCompare> = {
  name: "ProgressCircle",
  render: () => <TokenCompare sections={sections} current={Baseline} next={ProgressCircle} />,
};
