import type { Meta, StoryObj } from "@storybook/nextjs";
import Dropdown from "./Dropdown";
import { iconOptions, iconDecorator } from "../../../utils/storybookUtils.tsx";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  decorators: [iconDecorator],
  argTypes: {
    shape: { table: { defaultValue: { summary: "solid" } } },
    variant: { table: { defaultValue: { summary: "primary" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    spacing: { table: { defaultValue: { summary: "callout" } } },
    icon: {
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      control: { type: "select" },
    },
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
      { label: "Bootstrap Icon", icon: <i className="bi bi-amazon" /> },
      {
        label: "Material Icon",
        icon: (
          <span className="material-symbols-outlined" key="mat-android">
            android
          </span>
        ),
        iconColor: "red",
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Primary: Story = {};
