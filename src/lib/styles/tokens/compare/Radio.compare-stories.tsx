import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import Radio from "@/components/Radio/Radio";
import { RadioProps } from "@/components/Radio/types";
import RadioBaseline from "./baseline/Radio/Radio";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xs", "sm", "md", "lg"] as const;
type Props = Omit<RadioProps, "value">;

// One cell shows the radio off and on side by side
const render = (Item: ComponentType<RadioProps>) => {
  const Rendered = (props: Props) => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <Item {...props} value="off" label="Off" />
      <Item {...props} value="on" label="On" checked />
    </div>
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
    note: "Focus is not shown: Tab now draws a focus ring around the radio.",
    rows: [
      { label: "default", props: {} },
      { label: "error", props: { error: true } },
      { label: "success", props: { success: true } },
      { label: "disabled", props: { disabled: true } },
      { label: "readonly", props: { readOnly: true } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Radio",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Radio_: StoryObj<typeof TokenCompare> = {
  name: "Radio",
  render: () => <TokenCompare sections={sections} current={render(RadioBaseline)} next={render(Radio)} />,
};
