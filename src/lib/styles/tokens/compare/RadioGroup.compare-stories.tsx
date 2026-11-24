import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType, useId } from "react";
import Radio from "@/components/Radio/Radio";
import RadioGroup from "@/components/RadioGroup/RadioGroup";
import { RadioProps } from "@/components/Radio/types";
import { RadioGroupProps } from "@/components/RadioGroup/types";
import RadioBaseline from "./baseline/Radio/Radio";
import RadioGroupBaseline from "./baseline/RadioGroup/RadioGroup";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xs", "sm", "md", "lg"] as const;
type Props = Omit<RadioGroupProps, "children" | "name">;

// Every cell gets its own name, so the groups of the four columns do not share one native radio group
const render = (Group: ComponentType<RadioGroupProps>, Item: ComponentType<RadioProps>) => {
  const Rendered = (props: Props) => {
    const name = useId();
    return (
      <Group {...props} name={name} value="css">
        <Item label="HTML" value="html" />
        <Item label="CSS" value="css" />
        <Item label="JavaScript" value="js" />
      </Group>
    );
  };
  return Rendered;
};

const sections: CompareSection<Props>[] = [
  {
    title: "Vertical",
    rows: SIZES.map(size => ({ label: size, props: { size } })),
  },
  {
    title: "Horizontal",
    rows: SIZES.map(size => ({ label: size, props: { size, orientation: "horizontal" } })),
  },
  {
    title: "States",
    rows: [
      { label: "error", props: { error: true } },
      { label: "disabled", props: { disabled: true } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/RadioGroup",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const RadioGroup_: StoryObj<typeof TokenCompare> = {
  name: "RadioGroup",
  render: () => (
    <TokenCompare
      sections={sections}
      current={render(RadioGroupBaseline as ComponentType<RadioGroupProps>, RadioBaseline as ComponentType<RadioProps>)}
      next={render(RadioGroup, Radio)}
      columnWidth={400}
    />
  ),
};
