import type { Meta, StoryObj } from "@storybook/nextjs";

import Breadcrumb from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  argTypes: {
    collapsedPosition: { table: { defaultValue: { summary: "left" } } },
    homeIcon: {
      description: "Icon name (string) or a custom icon uses <span>, <i> or <svg>",
      table: { defaultValue: { summary: "home" } },
    },
    maxVisibleItems: { table: { defaultValue: { summary: "3" } } },
  },
  args: {
    items: [
      { label: "Main Page", path: "https://www.motif-ui.com" },
      { label: "Second Page", path: "https://www.motif-ui.com" },
      { label: "Third Page", path: "https://www.motif-ui.com" },
      { label: "Fourth Page", path: "https://www.motif-ui.com" },
      { label: "MotifUI", path: "https://www.motif-ui.com" },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Primary: Story = {};
