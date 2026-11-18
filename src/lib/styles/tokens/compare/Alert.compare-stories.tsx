import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import Alert from "@/components/Alert/Alert";
import AlertV2 from "@/components/AlertV2/Alert";
import { AlertProps } from "@/components/AlertV2/types";
import { CompareSection, TokenCompare } from "./TokenCompare";

const VARIANTS = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "danger"] as const;
const TEXT = { title: "Changes saved", message: "Your profile is up to date." };

// The current Alert has no neutral/accent; its default is secondary (light gray), the new default is neutral
const Current = Alert as ComponentType<AlertProps>;

const sections: CompareSection<AlertProps>[] = [
  {
    title: "Variants",
    note: "The default is neutral (it was secondary, light gray). The Today column has no neutral or accent.",
    rows: VARIANTS.map(variant => ({ label: variant, props: { ...TEXT, variant } })),
  },
  {
    title: "Options",
    rows: [
      { label: "closable", props: { ...TEXT, variant: "info", closable: true } },
      { label: "no icon", props: { ...TEXT, variant: "info", hideIcon: true } },
      { label: "message only", props: { message: TEXT.message, variant: "info" } },
      { label: "title only", props: { title: TEXT.title, variant: "info" } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Alert",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Alert_: StoryObj<typeof TokenCompare> = {
  name: "Alert",
  render: () => <TokenCompare sections={sections} current={Current} next={AlertV2} />,
};
