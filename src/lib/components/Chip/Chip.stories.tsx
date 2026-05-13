import type { Meta, StoryObj } from "@storybook/nextjs";

import Chip from "./Chip";
import { iconOptions, iconDecorator } from "../../../utils/storybookUtils.tsx";

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  argTypes: {
    variant: { table: { defaultValue: { summary: "secondary" } } },
    shape: { table: { defaultValue: { summary: "solid" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    pill: { table: { defaultValue: { summary: "true" } } },
    icon: {
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      control: { type: "select" },
    },
  },
  args: {
    label: "Chips",
    pill: true,
    closable: true,
  },
  decorators: [iconDecorator],
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Primary: Story = {};
