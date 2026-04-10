import BusinessCard from "./BusinessCard";
import { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof BusinessCard> = {
  title: "Components/BusinessCard",
  component: BusinessCard,
  argTypes: {
    position: { table: { defaultValue: { summary: "center" } } },
    variant: { table: { defaultValue: { summary: "secondary" } } },
    icon: { description: "Icon name (string) or a custom icon component (ReactElement), e.g. `<FontAwesomeIcon />`" },
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
  },
  args: {
    title: "Custom Card Title",
    outline: true,
    description: "This is a small text to describe the card",
    icon: "motif_ui",
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
