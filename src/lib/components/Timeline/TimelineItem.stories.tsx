import type { Meta, StoryObj } from "@storybook/nextjs";

import Timeline from "./Timeline";
import { TimelineItemProps, TimelineMarkerType } from "./types";

type StoryArgs = TimelineItemProps & { markerType: TimelineMarkerType };

const meta: Meta<StoryArgs> = {
  title: "Components/Timeline/Item",
  argTypes: {
    title: { table: { type: { summary: "ReactNode" } } },
    variant: {
      control: "select",
      options: ["primary", "danger", "success", "warning", "light", "secondary"],
    },
    icon: { table: { defaultValue: { summary: "motif_ui" } } },
    appearance: { control: "radio", options: ["filled", "outlined"], table: { defaultValue: { summary: "filled" } } },
  },
  args: {
    title: "Ordered",
    content: "08/03/2026 09:00",
    icon: "motif_ui",
    variant: "success",
    appearance: "outlined",
  },
  render: args => <Timeline markerType="icon" textAlign="center" items={[args]} />,
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Primary: Story = {};
