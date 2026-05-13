import type { Meta, StoryObj } from "@storybook/nextjs";

import Breadcrumb from "./Breadcrumb";
import { iconOptions, iconDecorator } from "../../../utils/storybookUtils.tsx";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  decorators: [iconDecorator],
  argTypes: {
    collapsedPosition: { table: { defaultValue: { summary: "left" } } },
    homeIcon: {
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      control: { type: "select" },
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
