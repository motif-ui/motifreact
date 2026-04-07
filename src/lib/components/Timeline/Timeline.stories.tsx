import type { Meta, StoryObj } from "@storybook/nextjs";

import Timeline from "./Timeline";

const meta: Meta<typeof Timeline> = {
  title: "Components/Timeline",
  component: Timeline,
  argTypes: {
    markerType: { table: { defaultValue: { summary: "dot" } } },
    orientation: { table: { defaultValue: { summary: "vertical" } } },
    contentPosition: { table: { defaultValue: { summary: "after" } } },
    textAlign: { table: { defaultValue: { summary: "start" } } },
    variant: { table: { defaultValue: { summary: "primary" } } },
  },
  args: {
    markerType: "dot",
    items: [
      { title: "Ordered", content: "08/03/2026 09:00", icon: "check_circle", variant: "success", appearance: "outlined" },
      { title: "Processing", content: "08/03/2026 10:00", icon: "search", variant: "primary" },
      { title: "Shipped", content: "08/03/2026 14:00", icon: "check", variant: "warning", appearance: "outlined" },
      { title: "Delivered", content: "09/03/2026 11:00", icon: "done_all", variant: "danger", disabled: true },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Primary: Story = {};
