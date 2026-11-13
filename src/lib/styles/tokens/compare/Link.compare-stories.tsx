import type { Meta, StoryObj } from "@storybook/nextjs";
import Link from "@/components/Link/Link";
import { LinkProps } from "@/components/Link/types";
import LinkBaseline from "./baseline/Link/Link";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["sm", "md", "lg"] as const;

const sections: CompareSection<LinkProps>[] = [
  { title: "Boyutlar", rows: SIZES.map(size => ({ label: size, props: { size, label: "Bağlantı", icon: "arrow_forward", url: "#" } })) },
  {
    title: "Durumlar",
    note: "Hover ve klavye odağı sabit gösterilemez; Storybook'ta üzerine gelerek ve Tab ile bakın.",
    rows: [
      { label: "Varsayılan", props: { label: "Bağlantı", url: "#" } },
      { label: "underline", props: { label: "Bağlantı", url: "#", underline: true } },
      { label: "external", props: { label: "Bağlantı", url: "#", external: true } },
      { label: "ikon sağda", props: { label: "Bağlantı", url: "#", icon: "arrow_forward", iconPosition: "right" } },
      { label: "disabled", props: { label: "Bağlantı", url: "#", disabled: true } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Karşılaştırma/Link",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Link_: StoryObj<typeof TokenCompare> = {
  name: "Link",
  render: () => <TokenCompare sections={sections} current={LinkBaseline} next={Link} />,
};
