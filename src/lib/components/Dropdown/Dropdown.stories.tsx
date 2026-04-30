import type { Meta, StoryObj } from "@storybook/nextjs";
import Dropdown from "./Dropdown";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  argTypes: {
    shape: { table: { defaultValue: { summary: "solid" } } },
    variant: { table: { defaultValue: { summary: "primary" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    spacing: { table: { defaultValue: { summary: "callout" } } },
    icon: { description: "Icon name (string) or a custom icon uses <span>, <i> or <svg>" },
  },
  args: {
    label: "Dropdown Menu",
    icon: "account_circle",
    items: [
      { header: "This Is A Header" },
      { label: "Item With Icon", icon: "home" },
      { label: "Item With Action", action: () => alert("Item Clicked") },
      { label: "Item Disabled", icon: "home", disabled: true },
      { label: "Item With Colored Icon", icon: "check_circle", iconColor: "red" },
      { icon: "check_circle", iconColor: "green" },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Primary: Story = {};
