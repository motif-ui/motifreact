import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType, ReactElement } from "react";
import PinCode from "@/components/PinCode/PinCode";
import PinCodeBaseline from "./baseline/PinCode/PinCode";
import { CompareSection, TokenCompare } from "./TokenCompare";

const SIZES = ["xs", "sm", "md", "lg"] as const;
type Props = {
  size?: (typeof SIZES)[number];
  circle?: boolean;
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
};
type AnyPin = ComponentType<Props & { children: ReactElement[]; value?: string[] } & Record<string, unknown>> & {
  Item: ComponentType<Record<string, unknown>>;
};

// Four characters, a space and two more; the first two are filled
const render = (Pin: AnyPin) => {
  const Rendered = (props: Props) => (
    <Pin {...props} value={["1", "2", "", "", "", "", ""]}>
      {[
        ...[0, 1, 2, 3].map(i => <Pin.Item key={`a${i}`} />),
        <Pin.Item key="space" space />,
        ...[0, 1].map(i => <Pin.Item key={`b${i}`} />),
      ]}
    </Pin>
  );
  return Rendered;
};

const sections: CompareSection<Props>[] = [
  { title: "Sizes", rows: SIZES.map(size => ({ label: size, props: { size } })) },
  {
    title: "States",
    rows: [
      { label: "default", props: {} },
      { label: "circle", props: { circle: true } },
      { label: "error", props: { error: true } },
      { label: "success", props: { success: true } },
      { label: "disabled", props: { disabled: true } },
      { label: "readOnly", props: { readOnly: true } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = { title: "Token Compare/PinCode", component: TokenCompare, parameters: { layout: "padded" } };
export default meta;

export const PinCode_: StoryObj<typeof TokenCompare> = {
  name: "PinCode",
  render: () => (
    <TokenCompare
      sections={sections}
      current={render(PinCodeBaseline as unknown as AnyPin)}
      next={render(PinCode as unknown as AnyPin)}
      columnWidth={480}
    />
  ),
};
