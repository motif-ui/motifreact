import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType, ReactElement } from "react";
import Tooltip from "@/components/Tooltip/Tooltip";
import { TooltipProps } from "@/components/Tooltip/types";
import TooltipBaseline from "./baseline/Tooltip/Tooltip";
import { CompareSection, TokenCompare } from "./TokenCompare";

// look is today's variant: today's light was the default, the new default is dark like today's dark
type Look = "light" | "dark";
type Props = Omit<TooltipProps, "text" | "inverseColors"> & { look?: Look };
type AnyTooltip = ComponentType<{ text: string; title?: string; children: ReactElement; className?: string } & Record<string, unknown>>;

// The anchor is marked data-compare-open, so the compare hovers it open
const render = (Tip: AnyTooltip, today: boolean) => {
  const Rendered = ({ look = "dark", ...props }: Props) => {
    const lookProps = today ? { variant: look } : { inverseColors: look === "light" };
    return (
      <div style={{ paddingTop: 64 }}>
        <Tip text="Tooltip text" title="Title" {...props} {...lookProps}>
          <span data-compare-open style={{ display: "inline-block", padding: "4px 12px", border: "1px dashed #aeb4ba", borderRadius: 4 }}>
            Anchor
          </span>
        </Tip>
      </div>
    );
  };
  return Rendered;
};

const sections: CompareSection<Props>[] = [
  {
    title: "Looks",
    note: "The tooltips open when the page loads. variant is removed: the default is dark in both modes (surface-contrast, one step lighter in dark); inverseColors replaces light with the page's sunken surface (light gray, near black in dark).",
    rows: [
      { label: "default (today dark)", props: { look: "dark" }, open: true },
      { label: "inverseColors (today light)", props: { look: "light" }, open: true },
    ],
  },
  {
    title: "Sizes",
    rows: (["xs", "sm", "md", "lg"] as const).map(size => ({ label: size, props: { size }, open: true })),
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Tooltip",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Tooltip_: StoryObj<typeof TokenCompare> = {
  name: "Tooltip",
  render: () => <TokenCompare sections={sections} current={render(TooltipBaseline, true)} next={render(Tooltip, false)} />,
};
