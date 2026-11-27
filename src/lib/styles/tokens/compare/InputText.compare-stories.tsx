import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import InputText from "@/components/InputText/InputText";
import InputPassword from "@/components/InputPassword/InputPassword";
import InputNumber from "@/components/InputNumber/InputNumber";
import { InputTextProps } from "@/components/InputText/types";
import InputTextBaseline from "./baseline/InputText/InputText";
import InputPasswordBaseline from "./baseline/InputPassword/InputPassword";
import InputNumberBaseline from "./baseline/InputNumber/InputNumber";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xs", "sm", "md", "lg"] as const;
type Kind = "text" | "password" | "number";
type Props = InputTextProps & { kind?: Kind; toggleMask?: boolean; numberValue?: number };
type AnyInput = ComponentType<Record<string, unknown>>;

// One cell shows an empty field (placeholder) and a filled one
const render = (Text: AnyInput, Password: AnyInput, Num: AnyInput) => {
  const Rendered = ({ kind = "text", numberValue, ...props }: Props) => {
    const Field = kind === "password" ? Password : kind === "number" ? Num : Text;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Field placeholder="Placeholder" {...props} value={undefined} />
        <Field {...props} {...(kind === "number" ? { value: numberValue ?? 42 } : { value: props.value ?? "Motif" })} />
      </div>
    );
  };
  return Rendered;
};

// Typed rows keep kind a Kind
const row = (label: string, props: Props) => ({ label, props });

const sections: CompareSection<Props>[] = [
  { title: "Sizes", rows: SIZES.map(size => ({ label: size, props: { size } })) },
  {
    title: "States",
    note: "Focus is not shown: the border turns border-field-focus.",
    rows: [
      { label: "default", props: {} },
      { label: "error", props: { error: true } },
      { label: "success", props: { success: true } },
      { label: "disabled", props: { disabled: true } },
      { label: "readOnly", props: { readOnly: true } },
      { label: "readOnly · icons", props: { readOnly: true, iconLeft: "search", iconRight: "info" } },
      { label: "readOnly · error", props: { readOnly: true, error: true } },
    ],
  },
  {
    title: "Icons and options",
    rows: [
      { label: "icons", props: { iconLeft: "search", iconRight: "info" } },
      { label: "clearable", props: { clearable: true } },
      { label: "pill", props: { pill: true } },
    ],
  },
  {
    title: "InputPassword",
    rows: [
      row("toggleMask", { kind: "password", toggleMask: true, value: "secret" }),
      row("disabled", { kind: "password", toggleMask: true, value: "secret", disabled: true }),
      row("readOnly", { kind: "password", toggleMask: true, value: "secret", readOnly: true }),
    ],
  },
  {
    title: "InputNumber",
    note: "The - and + buttons: neutral-soft, hover neutral-soft-hover.",
    rows: [
      ...SIZES.map(size => row(size, { kind: "number", size })),
      row("disabled", { kind: "number", disabled: true }),
      row("readOnly", { kind: "number", readOnly: true }),
    ],
  },
];

const meta: Meta<typeof TokenCompare> = { title: "Token Compare/InputText", component: TokenCompare, parameters: { layout: "padded" } };
export default meta;

export const InputText_: StoryObj<typeof TokenCompare> = {
  name: "InputText",
  render: () => (
    <TokenCompare
      sections={sections}
      current={render(InputTextBaseline, InputPasswordBaseline, InputNumberBaseline)}
      next={render(InputText, InputPassword, InputNumber)}
      columnWidth={280}
    />
  ),
};
