import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import Textarea from "@/components/Textarea/Textarea";
import { TextareaProps } from "@/components/Textarea/types";
import TextareaBaseline from "./baseline/Textarea/Textarea";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xs", "sm", "md", "lg"] as const;
type AnyArea = ComponentType<TextareaProps>;

const render = (Area: AnyArea) => {
  const Rendered = (props: TextareaProps) => <Area rows={2} {...props} />;
  return Rendered;
};

const sections: CompareSection<TextareaProps>[] = [
  { title: "Sizes", rows: SIZES.map(size => ({ label: size, props: { size, placeholder: "Placeholder" } })) },
  {
    title: "Counter",
    rows: SIZES.map(size => ({ label: size, props: { size, maxLength: 120, value: "Motif" } })),
  },
  {
    title: "States",
    rows: [
      { label: "default", props: { value: "Motif", maxLength: 120 } },
      { label: "error", props: { value: "Motif", maxLength: 120, error: true } },
      { label: "success", props: { value: "Motif", maxLength: 120, success: true } },
      { label: "disabled", props: { value: "Motif", maxLength: 120, disabled: true } },
      { label: "readOnly", props: { value: "Motif", maxLength: 120, readOnly: true } },
      { label: "disabled · empty", props: { placeholder: "Placeholder", maxLength: 120, disabled: true } },
      { label: "readOnly · empty", props: { placeholder: "Placeholder", maxLength: 120, readOnly: true } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = { title: "Token Compare/Textarea", component: TokenCompare, parameters: { layout: "padded" } };
export default meta;

export const Textarea_: StoryObj<typeof TokenCompare> = {
  name: "Textarea",
  render: () => <TokenCompare sections={sections} current={render(TextareaBaseline)} next={render(Textarea)} columnWidth={280} />,
};
