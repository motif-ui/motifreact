import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import Button from "@/components/Button/Button";
import { ButtonProps } from "@/components/Button/types";
import ButtonBaseline from "./baseline/Button/Button";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xxs", "xs", "sm", "md", "lg", "xl"] as const;
const VARIANTS = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "danger"] as const;
const SHAPES = ["solid", "outline", "textonly"] as const;

// The baseline has no neutral/accent and its secondary is gray
const Baseline = ButtonBaseline as ComponentType<ButtonProps>;

const sections: CompareSection<ButtonProps>[] = [
  {
    title: "Sizes",
    rows: SIZES.map(size => ({ label: size, props: { size, label: "Button", icon: "add" } })),
  },
  ...SHAPES.map(shape => ({
    title: `Variants · ${shape}`,
    note:
      shape === "solid"
        ? "The Today column has no neutral or accent. secondary is gray on legacy and the brand color on basic."
        : undefined,
    rows: VARIANTS.map(variant => ({ label: variant, props: { variant, shape, label: "Button" } })),
  })),
  {
    title: "States",
    rows: [
      ...SHAPES.map(shape => ({ label: `disabled · ${shape}`, props: { shape, disabled: true, label: "Button" } })),
      { label: "icon right", props: { label: "Button", icon: "arrow_forward", iconPosition: "right" } },
      { label: "icon only", props: { icon: "add" } },
      { label: "pill", props: { label: "Button", pill: true } },
      { label: "fluid", props: { label: "Button", fluid: true } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Button",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Button_: StoryObj<typeof TokenCompare> = {
  name: "Button",
  render: () => <TokenCompare sections={sections} current={Baseline} next={Button} />,
};
