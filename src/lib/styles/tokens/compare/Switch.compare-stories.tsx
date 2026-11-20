import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import Switch from "@/components/Switch/Switch";
import { SwitchProps } from "@/components/Switch/types";
import SwitchBaseline from "./baseline/Switch/Switch";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xs", "sm", "md", "lg"] as const;

// One cell shows the switch off and on side by side
const render = (Toggle: ComponentType<SwitchProps>) => {
  const Rendered = (props: SwitchProps) => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <Toggle {...props} label="Off" />
      <Toggle {...props} label="On" checked />
    </div>
  );
  return Rendered;
};

const sections: CompareSection<SwitchProps>[] = [
  {
    title: "Sizes",
    rows: SIZES.map(size => ({ label: size, props: { size } })),
  },
  {
    title: "States",
    note: "Focus is not shown: the new Switch takes keyboard focus and draws the focus ring around the track.",
    rows: [
      { label: "default", props: {} },
      { label: "disabled", props: { disabled: true } },
      { label: "readonly", props: { readOnly: true } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Switch",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Switch_: StoryObj<typeof TokenCompare> = {
  name: "Switch",
  render: () => <TokenCompare sections={sections} current={render(SwitchBaseline)} next={render(Switch)} />,
};
