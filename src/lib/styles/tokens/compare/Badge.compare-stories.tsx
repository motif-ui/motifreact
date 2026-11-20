import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType, CSSProperties, PropsWithChildren } from "react";
import Badge from "@/components/Badge/Badge";
import { BadgeProps as BadgeOwnProps } from "@/components/Badge/types";
import BadgeBaseline from "./baseline/Badge/Badge";
import { CompareSection, TokenCompare } from "./TokenCompare";

const VARIANTS = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "danger"] as const;
const ALIGNS = ["top-left", "top-right", "bottom-left", "bottom-right"] as const;

// Badge wraps the element it marks
type BadgeProps = PropsWithChildren<BadgeOwnProps>;

// What the badge sits on; the ring around the badge separates the two
const TARGET: CSSProperties = { display: "block", width: 40, height: 40, borderRadius: 8, background: "#cfd6dc" };
const target = <span style={TARGET} />;

// The current Badge has no neutral/accent and its secondary is gray
const Current = BadgeBaseline as ComponentType<BadgeProps>;

const sections: CompareSection<BadgeProps>[] = [
  {
    title: "Variants",
    note: "The Today column has no neutral or accent. secondary is gray on legacy and the brand color on basic.",
    rows: VARIANTS.map(variant => ({ label: variant, props: { variant, content: "8", children: target } })),
  },
  {
    title: "Content",
    rows: [
      { label: "number", props: { content: "8", children: target } },
      { label: "over max", props: { content: "1200", children: target } },
      { label: "icon", props: { icon: "notifications", children: target } },
      { label: "dot", props: { dot: true, children: target } },
    ],
  },
  { title: "Position", rows: ALIGNS.map(align => ({ label: align, props: { align, content: "8", children: target } })) },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Badge",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Badge_: StoryObj<typeof TokenCompare> = {
  name: "Badge",
  render: () => <TokenCompare sections={sections} current={Current} next={Badge} />,
};
