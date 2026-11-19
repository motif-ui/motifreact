import type { Meta, StoryObj } from "@storybook/nextjs";
import ButtonGroup from "@/components/ButtonGroup/ButtonGroup";
import ButtonGroupBaseline from "./baseline/ButtonGroup/ButtonGroup";
import { ButtonGroupProps } from "@/components/ButtonGroup/types";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xs", "sm", "md", "lg"] as const;

type Props = ButtonGroupProps & { disabled?: boolean };

// An icon button, a text button and a dropdown button with two items, the second disabled
const render = (Group: typeof ButtonGroup) => {
  const Rendered = ({ size, disabled }: Props) => (
    <Group size={size}>
      <Group.Item icon="add" label="New" disabled={disabled} />
      <Group.Item label="Edit" />
      <Group.Item label="More">
        <Group.Item label="Duplicate" />
        <Group.Item label="Archive" disabled />
      </Group.Item>
    </Group>
  );
  return Rendered;
};

const sections: CompareSection<Props>[] = [
  {
    title: "Sizes",
    rows: SIZES.map(size => ({ label: size, props: { size } })),
  },
  {
    title: "States",
    note: "Hover takes the primary fill like the open dropdown; the focus ring is not shown. The open list's second item is disabled. Today's dropdown cannot be opened here: it has no aria-expanded.",
    rows: [
      { label: "disabled item", props: { disabled: true } },
      { label: "open dropdown", props: {}, open: true },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/ButtonGroup",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const ButtonGroup_: StoryObj<typeof TokenCompare> = {
  name: "ButtonGroup",
  render: () => <TokenCompare sections={sections} current={render(ButtonGroupBaseline)} next={render(ButtonGroup)} />,
};
