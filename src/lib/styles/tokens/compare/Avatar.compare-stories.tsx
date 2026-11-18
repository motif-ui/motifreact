import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import Avatar from "@/components/Avatar/Avatar";
import { AvatarProps } from "@/components/Avatar/types";
import AvatarBaseline from "./baseline/Avatar/Avatar";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xs", "sm", "md", "lg", "xl", "xxl"] as const;
const VARIANTS = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "danger"] as const;

// The current Avatar has no neutral/accent; its default is secondary (gray), the new default is neutral
const Current = AvatarBaseline as ComponentType<AvatarProps>;

const sections: CompareSection<AvatarProps>[] = [
  { title: "Sizes", rows: SIZES.map(size => ({ label: size, props: { size, letters: "Motif UI" } })) },
  {
    title: "Variants",
    note: "The default is neutral (it was secondary, gray). The Today column has no neutral or accent.",
    rows: VARIANTS.map(variant => ({ label: variant, props: { variant, letters: "Motif UI" } })),
  },
  {
    title: "Content",
    rows: [
      { label: "icon", props: { icon: "person" } },
      { label: "image", props: { image: "https://picsum.photos/seed/motifui/96" } },
      { label: "image, xxl", props: { image: "https://picsum.photos/seed/motifui/96", size: "xxl" } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Avatar",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Avatar_: StoryObj<typeof TokenCompare> = {
  name: "Avatar",
  render: () => <TokenCompare sections={sections} current={Current} next={Avatar} />,
};
