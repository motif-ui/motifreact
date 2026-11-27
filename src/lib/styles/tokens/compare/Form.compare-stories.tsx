import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType, ReactElement } from "react";
import Form from "@/components/Form";
import { Validations } from "@/components/Form/validation/validations";
import InputText from "@/components/InputText";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import FormBaseline from "./baseline/Form/Form";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xs", "sm", "md", "lg"] as const;
type Orientation = "horizontal" | "vertical";
type State = "required" | "error" | "success" | "disabled" | "readOnly";
type Props = {
  kind?: "fields" | "noLabel" | "state" | "group";
  size?: (typeof SIZES)[number];
  formOrientation?: Orientation;
  labelOrientation?: Orientation;
  title?: boolean;
  state?: State;
  groupOrientation?: Orientation;
  wrap?: boolean;
};
type FieldProps = { name: string; label?: string; helperText?: string; children: ReactElement } & Record<string, unknown>;
type AnyForm = ComponentType<Record<string, unknown>> & {
  Field: ComponentType<FieldProps>;
  FieldGroup: ComponentType<Omit<FieldProps, "children"> & { children: ReactElement[] }>;
};

const cities = [
  { label: "Istanbul", value: "34" },
  { label: "Ankara", value: "06" },
];
const noop = () => {};

// The inputs are the migrated ones in every column; the rows compare the Form's own parts: title, labels, helper
// texts, the required mark and the gaps
const render = (F: AnyForm) => {
  const Rendered = ({
    kind = "fields",
    size = "md",
    formOrientation = "vertical",
    labelOrientation = "vertical",
    title,
    state,
    groupOrientation,
    wrap,
  }: Props) => {
    const field = (name: string, label?: string, extra: Record<string, unknown> = {}) => (
      <F.Field key={name} name={name} label={label} helperText="Helper text" {...extra}>
        <InputText placeholder="Placeholder" />
      </F.Field>
    );
    const stateProps =
      state === "required"
        ? { validations: [Validations.Required] }
        : state === "success" || state === "disabled" || state === "readOnly"
          ? { [state]: true }
          : {};
    return (
      <F
        size={size}
        formOrientation={formOrientation}
        labelOrientation={labelOrientation}
        title={title ? "Form title" : undefined}
        onSubmit={kind === "fields" || kind === "noLabel" ? noop : undefined}
        externalErrors={state === "error" ? { name: "Error message" } : undefined}
      >
        {kind === "fields" && [
          field("name", "Name", { validations: [Validations.Required] }),
          <F.Field key="city" name="city" label="City">
            <Select data={cities} placeholder="Select" />
          </F.Field>,
        ]}
        {kind === "noLabel" && [field("name", "Name"), field("surname")]}
        {kind === "state" && field("name", "Name", stateProps)}
        {kind === "group" && (
          <F.FieldGroup name="options" label="Options" helperText="Helper text" orientation={groupOrientation} wrap={wrap}>
            {["First option", "Second option", "Third option"].map(label => (
              <Checkbox key={label} name={label} label={label} />
            ))}
          </F.FieldGroup>
        )}
      </F>
    );
  };
  return Rendered;
};

const sections: CompareSection<Props>[] = [
  {
    title: "Sizes",
    note: "Title, labels, helper texts and gaps.",
    rows: SIZES.map(size => ({ label: size, props: { size, title: true } })),
  },
  {
    title: "Orientation",
    rows: [
      { label: "horizontal form", props: { formOrientation: "horizontal" } },
      { label: "horizontal labels", props: { labelOrientation: "horizontal" } },
      { label: "both horizontal", props: { formOrientation: "horizontal", labelOrientation: "horizontal" } },
      { label: "field without label", props: { kind: "noLabel", formOrientation: "horizontal" } },
    ],
  },
  {
    title: "Field states",
    rows: (["required", "error", "success", "disabled", "readOnly"] as const).map(state => ({
      label: state,
      props: { kind: "state", state },
    })),
  },
  {
    title: "Field states, horizontal label",
    rows: (["required", "error"] as const).map(state => ({
      label: state,
      props: { kind: "state", state, labelOrientation: "horizontal" },
    })),
  },
  {
    title: "Horizontal label alignment",
    note: "The label lines up with the first line of the field: the input's text, the first checkbox.",
    rows: SIZES.flatMap(size => [
      { label: `${size} field`, props: { kind: "state" as const, size, labelOrientation: "horizontal" as const } },
      {
        label: `${size} group`,
        props: { kind: "group" as const, size, labelOrientation: "horizontal" as const, groupOrientation: "horizontal" as const },
      },
    ]),
  },
  {
    title: "FieldGroup",
    rows: [
      { label: "horizontal", props: { kind: "group", groupOrientation: "horizontal" } },
      { label: "vertical", props: { kind: "group", groupOrientation: "vertical" } },
      { label: "wrap", props: { kind: "group", groupOrientation: "horizontal", wrap: true } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = { title: "Token Compare/Form", component: TokenCompare, parameters: { layout: "padded" } };
export default meta;

export const Form_: StoryObj<typeof TokenCompare> = {
  name: "Form",
  render: () => (
    <TokenCompare
      sections={sections}
      current={render(FormBaseline as unknown as AnyForm)}
      next={render(Form as unknown as AnyForm)}
      columnWidth={460}
    />
  ),
};
