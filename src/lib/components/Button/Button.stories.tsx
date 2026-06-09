import type { Meta, StoryObj } from "@storybook/nextjs";

import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { table: { defaultValue: { summary: "primary" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    shape: { table: { defaultValue: { summary: "solid" } } },
    iconPosition: { table: { defaultValue: { summary: "left" } } },
    icon: {
      description: "When set without a label or children, the button renders in icon-only mode.",
    },
    onClick: { action: "clicked" },
  },
  args: {
    label: "Button",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const IconOnly: Story = {
  args: {
    icon: "motif_ui",
    label: "",
    "aria-label": "Button",
  },
};
