import type { Meta, StoryObj } from "@storybook/nextjs";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { BreadcrumbProps } from "@/components/Breadcrumb/types";
import BreadcrumbBaseline from "./baseline/Breadcrumb/Breadcrumb";
import { CompareSection, TokenCompare } from "./TokenCompare";

const items = [
  { label: "Home", path: "#" },
  { label: "Services", path: "#" },
  { label: "Applications", path: "#" },
  { label: "New application" },
];

const sections: CompareSection<BreadcrumbProps>[] = [
  {
    title: "States",
    note: "The link hover color cannot be shown statically; hover over it in Storybook.",
    rows: [
      { label: "Default", props: { items } },
      { label: "Collapsed", props: { items, maxVisibleItems: 2 } },
      { label: "Collapsed, right", props: { items, maxVisibleItems: 2, collapsedPosition: "right" } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Breadcrumb",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Breadcrumb_: StoryObj<typeof TokenCompare> = {
  name: "Breadcrumb",
  render: () => <TokenCompare sections={sections} current={BreadcrumbBaseline} next={Breadcrumb} />,
};
