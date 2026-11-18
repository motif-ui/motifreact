import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import DataView from "@/components/DataView/DataView";
import DataViewV2 from "@/components/DataViewV2/DataView";
import { DataViewDefaultableProps, DataViewItemProps } from "@/components/DataViewV2/types";
import { CompareSection, TokenCompare } from "./TokenCompare";

const VARIANTS = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "danger"] as const;

type Props = DataViewDefaultableProps & { variant?: DataViewItemProps["variant"] };

const render = (View: typeof DataViewV2) => {
  const Rendered = ({ variant, ...props }: Props) => (
    <View cols={2} {...props}>
      <View.Item label="Name" value="Motif UI" icon="person" variant={variant} />
      <View.Item label="Version" value="2.0" icon="info" />
      <View.Item label="License" value="MIT" />
      <View.Item label="Status" value="Stable" />
    </View>
  );
  return Rendered;
};

// The current DataView.Item has no neutral, secondary or accent tint
const Current = render(DataView as ComponentType as typeof DataViewV2);
const Next = render(DataViewV2);

const sections: CompareSection<Props>[] = [
  {
    title: "Row variants",
    rows: [
      { label: "plain", props: { rowVariant: "plain" } },
      { label: "solid", props: { rowVariant: "solid" } },
      { label: "stripe", props: { rowVariant: "stripe" } },
      { label: "no border", props: { removeBorder: true } },
      { label: "vertical", props: { orientation: "vertical" } },
    ],
  },
  {
    title: "Item variants",
    note: "The first item is tinted. The Today column has no neutral, secondary or accent tint.",
    rows: VARIANTS.map(variant => ({ label: variant, props: { variant } })),
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/DataView",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const DataView_: StoryObj<typeof TokenCompare> = {
  name: "DataView",
  render: () => <TokenCompare sections={sections} current={Current} next={Next} columnWidth={760} />,
};
