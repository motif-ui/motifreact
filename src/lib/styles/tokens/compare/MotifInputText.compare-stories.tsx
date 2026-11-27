import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import MotifInputText from "@/components/Motif/InputText/InputText";
import { InternalInputProps } from "@/components/Motif/InputText/types";
import MotifInputTextBaseline from "./baseline/MotifInputText/InputText";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xs", "sm", "md", "lg"] as const;
const STATES: [string, InternalInputProps][] = [
  ["default", {}],
  ["error", { error: true }],
  ["success", { success: true }],
  ["disabled", { disabled: true }],
  ["readOnly", { readOnly: true }],
];
const noop = () => {};
const BUTTON = { name: "visibility", onClick: noop };

const render = (Field: ComponentType<InternalInputProps>) => {
  // The field has no size of its own (InputText and the others pass md by default)
  const Rendered = (props: InternalInputProps) => <Field size="md" value="Motif" {...props} />;
  return Rendered;
};

// One block per prop, each across the states, so every combination the field draws is on the screen
const across = (title: string, base: InternalInputProps, note?: string): CompareSection<InternalInputProps> => ({
  title,
  note,
  rows: STATES.map(([label, state]) => ({ label, props: { ...base, ...state } })),
});

const sections: CompareSection<InternalInputProps>[] = [
  { title: "Sizes · placeholder", rows: SIZES.map(size => ({ label: size, props: { size, value: "", placeholder: "Placeholder" } })) },
  { title: "Sizes · value", rows: SIZES.map(size => ({ label: size, props: { size } })) },
  {
    title: "Sizes · icons, clear, spinner",
    rows: SIZES.map(size => ({ label: size, props: { size, iconLeft: "search", clearable: true, numberSpinner: {}, value: "42" } })),
  },
  across("States", {}, "Focus is not shown: the border turns border-field-focus (error and success keep their border)."),
  across("States · placeholder", { value: "", placeholder: "Placeholder" }),
  across("iconLeft", { iconLeft: "search" }),
  across("iconRight", { iconRight: "info" }, "error and success color the right icon (danger-text, success-text)."),
  across("iconLeft + iconRight", { iconLeft: "search", iconRight: "info" }),
  across("buttonRight", { buttonRight: BUTTON }, "The button keeps IconButton's colors; disabled and readOnly gray it."),
  across("clearable", { clearable: true }, "The clear button shows only with a value and hides when disabled or readOnly."),
  across("loader", { loader: true, iconRight: "info" }, "The loader replaces the right icon and the right button."),
  across("numberSpinner", { numberSpinner: { min: 0, max: 99 }, value: "42" }),
  across("numberSpinner + iconLeft", { numberSpinner: {}, iconLeft: "search", value: "42" }),
  across("pill", { pill: true }),
  across("pill + icons", { pill: true, iconLeft: "search", iconRight: "info" }),
  across("pill + numberSpinner", { pill: true, numberSpinner: {}, value: "42" }),
  {
    title: "Types and typing",
    rows: [
      { label: "type=password", props: { type: "password", value: "secret" } },
      { label: "type=tel", props: { type: "tel", value: "+90 555 000 00 00" } },
      { label: "disableTyping", props: { disableTyping: true } },
      { label: "maxLength=3", props: { maxLength: 3, value: "Mot" } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/MotifInputText",
  component: TokenCompare,
  parameters: { layout: "padded" },
};
export default meta;

export const MotifInputText_: StoryObj<typeof TokenCompare> = {
  name: "MotifInputText",
  render: () => (
    <TokenCompare sections={sections} current={render(MotifInputTextBaseline)} next={render(MotifInputText)} columnWidth={280} />
  ),
};
