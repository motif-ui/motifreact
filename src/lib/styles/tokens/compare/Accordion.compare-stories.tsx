import type { Meta, StoryObj } from "@storybook/nextjs";
import Accordion from "@/components/Accordion/Accordion";
import AccordionBaseline from "./baseline/Accordion/Accordion";
import { CompareSection, TokenCompare } from "./TokenCompare";

const TEXT = "Shipping is free for orders over 50 €. Returns are accepted within 30 days.";

type Props = { group?: "separate" | "condensed"; expanded?: boolean; icon?: string };

// A single accordion, or a group of three whose first item is open
const render = (View: typeof Accordion) => {
  const Rendered = ({ group, expanded, icon }: Props) =>
    group ? (
      <View.Group condensed={group === "condensed"}>
        <View index={0} title="Shipping" text={TEXT} expanded />
        <View index={1} title="Returns" text={TEXT} />
        <View index={2} title="Payment" text={TEXT} />
      </View.Group>
    ) : (
      <View title="Shipping" text={TEXT} expanded={expanded} icon={icon} />
    );
  return Rendered;
};

const sections: CompareSection<Props>[] = [
  {
    title: "Accordion",
    note: "Hover and focus are not shown: the header takes neutral-soft on hover and the focus ring inside on keyboard focus.",
    rows: [
      { label: "collapsed", props: {} },
      { label: "expanded", props: { expanded: true } },
      { label: "with icon", props: { icon: "info" } },
    ],
  },
  {
    title: "Group",
    rows: [
      { label: "separate", props: { group: "separate" } },
      { label: "condensed", props: { group: "condensed" } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Accordion",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Accordion_: StoryObj<typeof TokenCompare> = {
  name: "Accordion",
  render: () => <TokenCompare sections={sections} current={render(AccordionBaseline)} next={render(Accordion)} />,
};
