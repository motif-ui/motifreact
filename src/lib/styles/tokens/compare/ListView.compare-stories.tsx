import type { Meta, StoryObj } from "@storybook/nextjs";
import ListView from "@/components/ListView/ListView";
import { ListViewDefaultableProps } from "@/components/ListView/types";
import ListViewBaseline from "./baseline/ListView/ListView";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["sm", "md", "lg"] as const;

// The rows cover every avatar kind (icon, letters, image) and a disabled item
const render = (List: typeof ListView) => {
  const Rendered = (props: ListViewDefaultableProps) => (
    <List {...props}>
      <List.Item id="1" title="Projects" description="Active work items" alternateText="12 items" icon="folder" iconRight="chevron_right" />
      <List.Item id="2" title="Motif UI" description="Design system" alternateText="Today" abbr="MU" />
      <List.Item id="3" title="Profile" description="Account settings" image="https://i.pravatar.cc/80?img=3" />
      <List.Item id="4" title="Archive" description="Not available" icon="inventory_2" disabled />
    </List>
  );
  return Rendered;
};

const Current = render(ListViewBaseline);
const Next = render(ListView);

const sections: CompareSection<ListViewDefaultableProps>[] = [
  { title: "Sizes", rows: SIZES.map(size => ({ label: size, props: { size } })) },
  {
    title: "Options",
    note: "Rows change their fill on hover; hover over them in Storybook.",
    rows: [
      { label: "Dividers", props: { enableDividers: true } },
      { label: "Selectable", props: { selectable: true } },
      { label: "No avatars", props: { disableAvatars: true } },
      { label: "Multi-line", props: { enableMultiLine: true } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/ListView",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const ListView_: StoryObj<typeof TokenCompare> = {
  name: "ListView",
  render: () => <TokenCompare sections={sections} current={Current} next={Next} />,
};
