import type { Meta, StoryObj } from "@storybook/nextjs";
import Link from "@/components/Link/Link";
import { LinkProps } from "@/components/Link/types";
import LinkBaseline from "./baseline/Link/Link";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["sm", "md", "lg"] as const;

const sections: CompareSection<LinkProps>[] = [
  { title: "Sizes", rows: SIZES.map(size => ({ label: size, props: { size, label: "Link", icon: "arrow_forward", url: "#" } })) },
  {
    title: "States",
    note: "Hover and keyboard focus cannot be shown statically; hover over it and press Tab in Storybook.",
    rows: [
      { label: "Default", props: { label: "Link", url: "#" } },
      { label: "underline", props: { label: "Link", url: "#", underline: true } },
      { label: "external", props: { label: "Link", url: "#", external: true } },
      { label: "icon right", props: { label: "Link", url: "#", icon: "arrow_forward", iconPosition: "right" } },
      { label: "disabled", props: { label: "Link", url: "#", disabled: true } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Link",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Link_: StoryObj<typeof TokenCompare> = {
  name: "Link",
  render: () => <TokenCompare sections={sections} current={LinkBaseline} next={Link} />,
};
