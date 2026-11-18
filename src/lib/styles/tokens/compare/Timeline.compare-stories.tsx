import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import Timeline from "@/components/Timeline/Timeline";
import TimelineV2 from "@/components/TimelineV2/Timeline";
import { TimelineItemProps, TimelineProps } from "@/components/TimelineV2/types";
import { CompareSection, TokenCompare } from "./TokenCompare";

const VARIANTS = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "danger"] as const;
const ORIENTATIONS = ["vertical", "horizontal"] as const;
const POSITIONS = ["after", "before", "alternate"] as const;
const ALIGNS = ["start", "center", "end"] as const;
const MARKERS = ["dot", "number", "icon"] as const;

const items = (extra: TimelineItemProps = {}): TimelineItemProps[] => [
  { title: "Created", content: "The request is open", icon: "add", ...extra },
  { title: "In review", content: "Two approvals", icon: "visibility", ...extra },
  { title: "Merged", content: "Released in 2.0", icon: "check", ...extra },
];

// The current Timeline has light where the new one has neutral (on the root and on items), and no info or accent
type LegacyProps = Omit<TimelineProps, "variant" | "items"> & {
  variant?: string;
  items: (Omit<TimelineItemProps, "variant"> & { variant?: string })[];
};
const Legacy = Timeline as ComponentType<LegacyProps>;
const legacyVariant = (variant?: string) => (variant === "neutral" ? "light" : variant);
const Current = (props: TimelineProps) => (
  <Legacy
    {...props}
    variant={legacyVariant(props.variant)}
    items={props.items.map(item => ({ ...item, variant: legacyVariant(item.variant) }))}
  />
);

const sections: CompareSection<TimelineProps>[] = [
  ...ORIENTATIONS.map(orientation => ({
    title: `Layout · ${orientation}`,
    rows: POSITIONS.flatMap(contentPosition =>
      ALIGNS.map(textAlign => ({
        label: `${contentPosition} · ${textAlign}`,
        props: { orientation, contentPosition, textAlign, items: items() },
      })),
    ),
  })),
  {
    title: "Markers",
    rows: MARKERS.flatMap(markerType =>
      ALIGNS.map(textAlign => ({ label: `${markerType} · ${textAlign}`, props: { markerType, textAlign, items: items() } })),
    ),
  },
  {
    title: "Variants",
    note: "light is now neutral. The Today column has no info or accent and shows neutral as light.",
    rows: VARIANTS.flatMap(variant =>
      (["filled", "outlined"] as const).map(appearance => ({
        label: `${variant} · ${appearance}`,
        props: { variant, markerType: "number" as const, items: items({ appearance }) },
      })),
    ),
  },
  {
    title: "Item variants",
    note: "The middle item sets its own variant over the Timeline's.",
    rows: (
      [
        ["neutral", "primary"],
        ["primary", "neutral"],
        ["neutral", "danger"],
      ] as const
    ).map(([variant, itemVariant]) => ({
      label: `${variant} · item ${itemVariant}`,
      props: {
        variant,
        markerType: "number" as const,
        items: items().map((item, i) => (i === 1 ? { ...item, variant: itemVariant } : item)),
      },
    })),
  },
  {
    title: "Disabled",
    rows: (["filled", "outlined"] as const).map(appearance => ({
      label: appearance,
      props: { variant: "primary" as const, markerType: "number" as const, items: items({ appearance, disabled: true }) },
    })),
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Timeline",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Timeline_: StoryObj<typeof TokenCompare> = {
  name: "Timeline",
  render: () => <TokenCompare sections={sections} current={Current} next={TimelineV2} />,
};
