import type { Meta, StoryObj } from "@storybook/nextjs";
import Skeleton from "@/components/Skeleton/Skeleton";
import SkeletonBaseline from "./baseline/Skeleton/Skeleton";
import { CompareSection, TokenCompare } from "./TokenCompare";

const sections: CompareSection<object>[] = [
  { title: "Table", note: "The color moves between two tones every second.", rows: [{ label: "pulse", props: {} }] },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Skeleton",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Skeleton_: StoryObj<typeof TokenCompare> = {
  name: "Skeleton",
  render: () => <TokenCompare sections={sections} current={SkeletonBaseline} next={Skeleton} />,
};
