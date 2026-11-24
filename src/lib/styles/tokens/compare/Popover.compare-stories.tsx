import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType, ReactNode, RefObject, useRef } from "react";
import Popover from "@/components/Popover/Popover";
import { PopoverProps } from "@/components/Popover/types";
import PopoverBaseline from "./baseline/Popover/Popover";
import { CompareSection, TokenCompare } from "./TokenCompare";

// look is today's variant; the new popover has one look and inverseColors for today's dark
type Look = "light" | "primary" | "dark";
type Props = Omit<PopoverProps, "anchorRef" | "inverseColors"> & { look?: Look };
type AnyPopover = ComponentType<{ anchorRef: RefObject<HTMLElement | null>; children?: ReactNode } & Record<string, unknown>>;

// The anchor carries aria-expanded so the compare clicks it open; outside clicks do not close the others
const render = (Pop: AnyPopover, today: boolean) => {
  const Rendered = ({ look = "light", ...props }: Props) => {
    const anchorRef = useRef<HTMLSpanElement>(null);
    const lookProps = today ? { variant: look } : { inverseColors: look === "dark" };
    return (
      <>
        <span
          ref={anchorRef}
          aria-expanded="false"
          style={{ display: "inline-block", padding: "4px 12px", border: "1px dashed #aeb4ba", borderRadius: 4 }}
        >
          Anchor
        </span>
        <Pop anchorRef={anchorRef} closeOnOutsideClick={false} {...props} {...lookProps}>
          Popover content
        </Pop>
      </>
    );
  };
  return Rendered;
};

const LOOKS: [string, Look][] = [
  ["default (today light)", "light"],
  ["inverseColors (today dark)", "dark"],
  ["today primary (removed)", "primary"],
];

const sections: CompareSection<Props>[] = [
  {
    title: "Looks",
    note: "The popovers open when the page loads. variant is removed: the default is today's light, inverseColors replaces dark (the opposite surface: dark on a light page, light on a dark one), primary has no replacement.",
    rows: LOOKS.map(([label, look]) => ({ label, props: { look }, open: true })),
  },
  {
    title: "Elevated",
    rows: LOOKS.slice(0, 2).map(([label, look]) => ({ label, props: { look, elevated: true }, open: true })),
  },
  {
    title: "Spacing",
    rows: [
      { label: "withGap", props: { spacing: "withGap" }, open: true },
      { label: "noSpace", props: { spacing: "noSpace" }, open: true },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Popover",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Popover_: StoryObj<typeof TokenCompare> = {
  name: "Popover",
  render: () => <TokenCompare sections={sections} current={render(PopoverBaseline, true)} next={render(Popover, false)} />,
};
