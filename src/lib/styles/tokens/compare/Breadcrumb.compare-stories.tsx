import type { Meta, StoryObj } from "@storybook/nextjs";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { BreadcrumbProps } from "@/components/Breadcrumb/types";
import BreadcrumbBaseline from "./baseline/Breadcrumb/Breadcrumb";
import { CompareSection, TokenCompare } from "./TokenCompare";

const items = [
  { label: "Anasayfa", path: "#" },
  { label: "Hizmetler", path: "#" },
  { label: "Başvurular", path: "#" },
  { label: "Yeni başvuru" },
];

const sections: CompareSection<BreadcrumbProps>[] = [
  {
    title: "Durumlar",
    note: "Link hover rengi sabit gösterilemez; Storybook'ta üzerine gelerek bakın.",
    rows: [
      { label: "Varsayılan", props: { items } },
      { label: "Daraltılmış", props: { items, maxVisibleItems: 2 } },
      { label: "Daraltılmış, sağda", props: { items, maxVisibleItems: 2, collapsedPosition: "right" } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Karşılaştırma/Breadcrumb",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Breadcrumb_: StoryObj<typeof TokenCompare> = {
  name: "Breadcrumb",
  render: () => <TokenCompare sections={sections} current={BreadcrumbBaseline} next={Breadcrumb} />,
};
