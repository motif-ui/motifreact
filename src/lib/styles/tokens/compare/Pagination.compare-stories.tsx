import type { Meta, StoryObj } from "@storybook/nextjs";
import Pagination from "@/components/Pagination/Pagination";
import { PaginationProps } from "@/components/Pagination/types";
import PaginationBaseline from "./baseline/Pagination/Pagination";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["sm", "md", "lg"] as const;

const sections: CompareSection<PaginationProps>[] = [
  { title: "Sizes", rows: SIZES.map(size => ({ label: size, props: { size, total: 200, pageSize: 10, current: 6 } })) },
  {
    title: "States",
    rows: [
      { label: "First page", props: { size: "md", total: 200, pageSize: 10, current: 1 } },
      { label: "Last page", props: { size: "md", total: 200, pageSize: 10, current: 20 } },
      { label: "Few pages", props: { size: "md", total: 40, pageSize: 10, current: 2 } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Pagination",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Pagination_: StoryObj<typeof TokenCompare> = {
  name: "Pagination",
  render: () => <TokenCompare sections={sections} current={PaginationBaseline} next={Pagination} />,
};
