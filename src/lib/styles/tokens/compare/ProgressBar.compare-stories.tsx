import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import ProgressBar from "@/components/ProgressBar/ProgressBar";
import ProgressBarV2 from "@/components/ProgressBarV2/ProgressBar";
import { ProgressBarProps } from "@/components/ProgressBarV2/types";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;
const VARIANTS = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "danger"] as const;

// Until promotion the current ProgressBar is the original; it has no neutral/accent and its secondary is gray
const Current = ProgressBar as ComponentType<ProgressBarProps>;

const sections: CompareSection<ProgressBarProps>[] = [
  { title: "Boyutlar", rows: SIZES.map(size => ({ label: size, props: { size, progress: 65, showPercentage: true } })) },
  {
    title: "Varyantlar",
    note: "Bugün sütununda neutral ve accent yok; secondary gri. Yeni sistemde gri olan neutral.",
    rows: VARIANTS.map(variant => ({ label: variant, props: { variant, size: "md" as const, progress: 65, showPercentage: true } })),
  },
  {
    title: "Durumlar",
    rows: [
      { label: "0%", props: { size: "md", progress: 0, showPercentage: true } },
      { label: "100%", props: { size: "md", progress: 100, showPercentage: true } },
      { label: "Indeterminate", props: { size: "md", indeterminate: true } },
      { label: "Countdown, duraklatılmış", props: { size: "md", countdown: { duration: 10000, paused: true } } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Karşılaştırma/ProgressBar",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const ProgressBar_: StoryObj<typeof TokenCompare> = {
  name: "ProgressBar",
  render: () => <TokenCompare sections={sections} current={Current} next={ProgressBarV2} />,
};
