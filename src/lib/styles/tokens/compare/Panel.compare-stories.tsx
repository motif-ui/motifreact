import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType, ReactNode } from "react";
import Panel from "@/components/Panel/Panel";
import { PanelProps } from "@/components/Panel/types";
import PanelBaseline from "./baseline/Panel/Panel";
import { CompareSection, TokenCompare } from "./TokenCompare";

type Props = PanelProps & { children?: ReactNode };

const render = (Box: ComponentType<Props>) => {
  const Rendered = (props: Props) => (
    <Box title="Panel title" {...props}>
      Panel content
    </Box>
  );
  return Rendered;
};

const TYPES = ["default", "solid", "elevated"] as const;

const sections: CompareSection<Props>[] = [
  {
    title: "Types",
    rows: TYPES.map(type => ({ label: type, props: { type } })),
  },
  {
    title: "Bordered",
    rows: TYPES.map(type => ({ label: type, props: { type, bordered: true } })),
  },
  {
    title: "Title sizes",
    note: "With a title icon.",
    rows: (["sm", "md", "lg"] as const).map(titleSize => ({ label: titleSize, props: { titleSize, titleIcon: "home", bordered: true } })),
  },
  {
    title: "Lean",
    rows: [{ label: "lean, bordered", props: { lean: true, bordered: true } }],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Panel",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Panel_: StoryObj<typeof TokenCompare> = {
  name: "Panel",
  render: () => <TokenCompare sections={sections} current={render(PanelBaseline)} next={render(Panel)} />,
};
