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
    items: [
      { title: "Ordered", content: "08/03/2026 09:00", icon: "check_circle", appearance: "outlined" },
      { title: "Processing", content: "08/03/2026 10:00", icon: "search" },
      { title: "Shipped", content: "08/03/2026 14:00", icon: "check", appearance: "outlined", disabled: true },
      { title: "Delivered", content: "09/03/2026 11:00", icon: "done_all", disabled: true },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Primary: Story = {};
