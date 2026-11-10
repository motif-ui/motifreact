import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import Button from "@/components/Button/Button";
import ButtonV2 from "@/components/ButtonV2/Button";
import { ButtonProps } from "@/components/ButtonV2/types";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xxs", "xs", "sm", "md", "lg", "xl"] as const;
const VARIANTS = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "danger"] as const;
const SHAPES = ["solid", "outline", "textonly"] as const;

// Until promotion the current Button is the original; it has no neutral/accent and its secondary is gray
const Current = Button as ComponentType<ButtonProps>;

const sections: CompareSection<ButtonProps>[] = [
  {
    title: "Boyutlar",
    rows: SIZES.map(size => ({ label: size, props: { size, label: "Button", icon: "add" } })),
  },
  ...SHAPES.map(shape => ({
    title: `Varyantlar · ${shape}`,
    note: shape === "solid" ? "Bugün sütununda neutral ve accent yok; secondary gri. Yeni sistemde gri olan neutral." : undefined,
    rows: VARIANTS.map(variant => ({ label: variant, props: { variant, shape, label: "Button" } })),
  })),
  {
    title: "Durumlar",
    rows: [
      ...SHAPES.map(shape => ({ label: `disabled · ${shape}`, props: { shape, disabled: true, label: "Button" } })),
      { label: "ikon sağda", props: { label: "Button", icon: "arrow_forward", iconPosition: "right" } },
      { label: "yalnızca ikon", props: { icon: "add" } },
      { label: "pill", props: { label: "Button", pill: true } },
      { label: "fluid", props: { label: "Button", fluid: true } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Karşılaştırma/Button",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Button_: StoryObj<typeof TokenCompare> = {
  name: "Button",
  render: () => <TokenCompare sections={sections} current={Current} next={ButtonV2} />,
};
