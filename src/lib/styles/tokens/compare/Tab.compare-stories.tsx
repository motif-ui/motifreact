import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import Tab from "@/components/Tab";
import { TabProps } from "@/components/Tab/types";
import TabBaseline from "./baseline/Tab";
import { CompareSection, TokenCompare } from "./TokenCompare";

type Row = Omit<TabProps, "children">;

const TABS: TabProps["tabs"] = [
  { title: "Home", icon: "home", id: "home" },
  { title: "Profile", icon: "person", id: "person" },
  { title: "Archived", icon: "inventory_2", id: "archived", disabled: true },
];

const view = (TabView: ComponentType<TabProps>) => (props: Row) => <TabView {...props} />;
const Current = view(TabBaseline as ComponentType<TabProps>);
const Next = view(Tab);

const sections: CompareSection<Row>[] = [
  {
    title: "Types",
    note: "The first tab is selected, the last one disabled. underline: primary text and line over a border-soft rail; solid: a neutral-soft tab, primary-solid when selected.",
    rows: (["underline", "solid"] as const).map(type => ({ label: type, props: { tabs: TABS, type } })),
  },
  {
    title: "Positions",
    rows: (["left", "center", "right", "fill"] as const).map(position => ({ label: position, props: { tabs: TABS, position } })),
  },
  {
    title: "Content",
    rows: [
      { label: "title only", props: { tabs: TABS.map(tab => ({ ...tab, icon: undefined })) } },
      { label: "icon only", props: { tabs: TABS.map(tab => ({ ...tab, title: undefined })) } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Tab",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Tab_: StoryObj<typeof TokenCompare> = {
  name: "Tab",
  render: () => <TokenCompare sections={sections} current={Current} next={Next} columnWidth={420} />,
};
