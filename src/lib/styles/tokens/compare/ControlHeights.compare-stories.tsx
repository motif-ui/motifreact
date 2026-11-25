import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import InputNumber from "@/components/InputNumber/InputNumber";
import Select from "@/components/Select/Select";
import ButtonBaseline from "./baseline/Button/Button";
import InputTextBaseline from "./baseline/InputText/InputText";
import InputNumberBaseline from "./baseline/InputNumber/InputNumber";
import SelectBaseline from "./baseline/Select/Select";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xs", "sm", "md", "lg"] as const;
type Props = { size: (typeof SIZES)[number] };
type AnyControl = ComponentType<Record<string, unknown>>;
type Controls = { Btn: AnyControl; Text: AnyControl; Num: AnyControl; Sel: AnyControl };

const cities = [
  { label: "Istanbul", value: "34" },
  { label: "Ankara", value: "06" },
];

// Top-aligned in one row, so a control taller than the others shows at the bottom edge
const render = ({ Btn, Text, Num, Sel }: Controls) => {
  const Rendered = ({ size }: Props) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
      <Btn size={size} label="Save" />
      <Btn size={size} shape="outline" label="Cancel" />
      <Btn size={size} icon="home" label="Home" />
      <div style={{ flex: "none", width: 180 }}>
        <Text size={size} placeholder="Search" iconLeft="search" />
      </div>
      <div style={{ flex: "none", width: 150 }}>
        <Sel size={size} data={cities} placeholder="City" />
      </div>
      <div style={{ flex: "none", width: 180 }}>
        <Num size={size} value={42} />
      </div>
    </div>
  );
  return Rendered;
};

const sections: CompareSection<Props>[] = [
  {
    title: "Sizes",
    note: "Button (solid, outline, with an icon), InputText with an icon, Select and InputNumber of one size, top-aligned. New: 24 · 32 · 40 · 48 for all of them.",
    rows: SIZES.map(size => ({ label: size, props: { size } })),
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Control heights",
  component: TokenCompare,
  parameters: { layout: "padded" },
};
export default meta;

export const ControlHeights: StoryObj<typeof TokenCompare> = {
  name: "Control heights",
  render: () => (
    <TokenCompare
      sections={sections}
      current={render({
        Btn: ButtonBaseline,
        Text: InputTextBaseline,
        Num: InputNumberBaseline,
        Sel: SelectBaseline as unknown as AnyControl,
      })}
      next={render({
        Btn: Button,
        Text: InputText,
        Num: InputNumber,
        Sel: Select as unknown as AnyControl,
      })}
      columnWidth={900}
    />
  ),
};
