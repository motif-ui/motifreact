import type { Meta, StoryObj } from "@storybook/nextjs";
import Select from "@/components/Select/Select";
import SelectBaseline from "./baseline/Select/Select";
import { SelectGroupItem, SelectItem, SelectProps } from "@/components/Select/types";
import { CompareSection, TokenCompare } from "./TokenCompare";

const items: SelectItem[] = [
  { label: "Istanbul", value: "34" },
  { label: "Ankara", value: "06" },
  { label: "Izmir", value: "35" },
  { label: "Bursa", value: "16" },
];

const grouped: (SelectItem | SelectGroupItem)[] = [
  { label: "All", value: "all" },
  { groupLabel: "Cities", groupKey: "cities", items },
];

const SIZES = ["xs", "sm", "md", "lg"] as const;

const sections: CompareSection<SelectProps>[] = [
  {
    title: "Sizes",
    rows: SIZES.map(size => ({ label: size, props: { data: items, size, placeholder: "Select" } })),
  },
  {
    title: "States",
    rows: [
      { label: "Placeholder", props: { data: items, placeholder: "Select" } },
      { label: "Value selected", props: { data: items, value: "06" } },
      { label: "Multiple", props: { data: items, multiple: true, value: ["34", "06"] } },
      { label: "With icon", props: { data: items, icon: "location_on", placeholder: "Select" } },
      { label: "Error", props: { data: items, error: true, value: "06" } },
      { label: "Success", props: { data: items, success: true, value: "06" } },
      { label: "Disabled", props: { data: items, disabled: true, placeholder: "Select" } },
      { label: "Disabled, filled", props: { data: items, disabled: true, value: "06" } },
      { label: "Readonly", props: { data: items, readOnly: true, value: "06" } },
      { label: "Loading", props: { data: items, loading: true, placeholder: "Select" } },
    ],
  },
  {
    title: "Open list",
    note: "The lists open when the page loads; a click elsewhere closes them and a reload brings them back. The second row is painted with the hover color.",
    rows: [
      { label: "Selected + hover", props: { data: items, value: "34" }, open: true, hover: true },
      { label: "Group + multiple", props: { data: grouped, multiple: true, value: ["06"] }, open: true, hover: true },
      { label: "No data", props: { data: [] }, open: true },
    ],
  },
  {
    title: "Filterable + chip",
    note: "Chips appear only with multiple and filterable together; the chip text comes from chipLabelSize (label-*).",
    rows: [
      ...SIZES.map(size => ({ label: size, props: { data: items, size, multiple: true, filterable: true, value: ["34"] } })),
      { label: "Filterable, single", props: { data: items, filterable: true, value: "06" } },
    ],
  },
  {
    title: "Group label",
    note: "The group label text comes from groupLabelSize (label-*).",
    rows: SIZES.map(size => ({ label: size, props: { data: grouped, size, value: "06" }, open: true })),
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Select",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Select_: StoryObj<typeof TokenCompare> = {
  name: "Select",
  render: () => <TokenCompare sections={sections} current={SelectBaseline} next={Select} />,
};
