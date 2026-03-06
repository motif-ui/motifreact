import type { Meta, StoryObj } from "@storybook/nextjs";

import Breadcrumb from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  argTypes: {
    collapsedPosition: { table: { defaultValue: { summary: "left" } } },
    homeIcon: { table: { defaultValue: { summary: "home" } } },
    maxVisibleItems: { table: { defaultValue: { summary: "3" } } },
  },
  args: {
    items: [
      { label: "Ana Sayfa", path: "https://www.motif-ui.com" },
      { label: "Kurumlar", path: "https://www.motif-ui.com" },
      { label: "Google", path: "https://google.com" },
      { label: "Microsoft", path: "https://microsoft.com" },
      { label: "MotifUI", path: "https://www.motif-ui.com" },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Primary: Story = {};
