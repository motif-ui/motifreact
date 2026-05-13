import BusinessCard from "./BusinessCard";
import { Meta, StoryObj } from "@storybook/nextjs";
import { iconOptions, iconDecorator } from "../../../utils/storybookUtils.tsx";

const meta: Meta<typeof BusinessCard> = {
  title: "Components/BusinessCard",
  component: BusinessCard,
  decorators: [iconDecorator],
  argTypes: {
    position: { table: { defaultValue: { summary: "center" } } },
    variant: { table: { defaultValue: { summary: "secondary" } } },
    onClick: {
      control: { type: "boolean" },
      mapping: {
        false: undefined,
        true: () => alert("Card clicked!"),
      },
    },
    iconButton: {
      control: { type: "boolean" },
      mapping: {
        false: undefined,
        true: {
          icon: "download",
          onClick: () => alert("Button clicked!"),
        },
      },
    },
    icon: {
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      control: { type: "select" },
    },
  },
  args: {
    title: "Custom Card Title",
    outline: true,
    description: "This is a small text to describe the card",
    icon: "folder",
    link: {
      text: "Link Item",
      href: "https://motif-ui.com",
      targetBlank: true,
    },
    onClick: undefined,
  },
};

export default meta;
type Story = StoryObj<typeof BusinessCard>;

export const Primary: Story = {};
