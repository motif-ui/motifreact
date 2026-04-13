import type { Meta, StoryObj } from "@storybook/nextjs";
import TimelineItem from "@/components/Timeline/TimelineItem";
import Timeline from "@/components/Timeline/Timeline";

const meta: Meta<typeof TimelineItem> = {
  title: "Components/Timeline/Item",
  component: TimelineItem,
  argTypes: {
    appearance: { table: { defaultValue: { summary: "filled" } } },
    icon: { table: { defaultValue: { summary: "motif_ui" } } },
    variant: { table: { defaultValue: { summary: "[parent variant]" } } },
    order: { table: { disable: true } },
    markerType: { table: { disable: true } },
  },
  args: {
    title: "Ordered",
    content: "08/03/2026 09:00",
    icon: "receipt",
    variant: "success",
  },
};

export default meta;
type Story = StoryObj<typeof TimelineItem>;

export const Primary: Story = {
  render: args => <Timeline markerType="icon" textAlign="center" items={[args, args]} />,
};
