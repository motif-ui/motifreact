import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import Checkbox from "@/components/Checkbox/Checkbox";
import { CheckboxProps } from "@/components/Checkbox/types";
import CheckboxBaseline from "./baseline/Checkbox/Checkbox";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xs", "sm", "md", "lg"] as const;

// One cell shows the three marks side by side: unchecked, checked and partial
const render = (Box: ComponentType<CheckboxProps>) => {
  const Rendered = (props: CheckboxProps) => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <Box {...props} label="Off" />
      <Box {...props} label="On" checked />
      <Box {...props} label="Partial" partialCheck />
    </div>
  );
  return Rendered;
};

const sections: CompareSection<CheckboxProps>[] = [
  {
    title: "Sizes",
    rows: SIZES.map(size => ({ label: size, props: { size } })),
  },
  {
    title: "States",
    note: "Focus is not shown: it draws the focus ring around the box on keyboard focus.",
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
  title: "Token Compare/Checkbox",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Checkbox_: StoryObj<typeof TokenCompare> = {
  name: "Checkbox",
  render: () => <TokenCompare sections={sections} current={render(CheckboxBaseline)} next={render(Checkbox)} />,
};
