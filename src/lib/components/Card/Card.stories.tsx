import type { Meta, StoryObj } from "@storybook/nextjs";

import Card from "./Card";
import { formatStoryTransform } from "../../../utils/docUtils";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  argTypes: {
    imagePosition: { table: { defaultValue: { summary: "left" } } },
    variant: { table: { defaultValue: { summary: "secondary" } } },
    icon: { description: "Icon name (string) or a custom icon component (ReactElement), e.g. `<FontAwesomeIcon />`" },
  },
  args: {
    title: "Card Header Title",
    subtitle: "Motif Card Subtitle",
    icon: "folder",
    action: { icon: "download", onClick: () => console.log("Action clicked!") },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Primary: Story = {
  parameters: {
    docs: {
      source: {
        transform: formatStoryTransform("Card", ["children"]),
      },
    },
  },
};

export const Header: Story = {
  render: args => (
    <Card
      {...args}
      title="Card Header Title"
      subtitle="Motif Card Subtitle"
      imagePosition="right"
      icon="folder"
      image="https://picsum.photos/100"
      action={{ icon: "download", onClick: () => console.log("asd") }}
    />
  ),
};

export const Content: Story = {
  render: args => (
    <Card
      {...args}
      contentText="Motif Card Supporting Text"
      contentTitle="Card Content Title"
      contentSubtitle="Card Content Subtitle"
      contentLink={{ text: "Motif Link", href: "https://motif-ui.com/", targetBlank: true }}
      contentImage="https://picsum.photos/400/200"
      contentActionButton={{ text: "Action", onClick: () => console.log("Contant action clicked!") }}
      contentAlternateButton={{ text: "Alternate", onClick: () => console.log("Content alternate clicked!") }}
      contentActionLink={{ text: "Motif Link", href: "https://motif-ui.com/", targetBlank: true, icon: "arrow_forward" }}
    />
  ),
};

export const HeaderAndContent: Story = {
  render: args => (
    <Card
      {...args}
      title="Card Header Title"
      subtitle="Motif Card Subtitle"
      avatarText="AB"
      action={{ icon: "download", onClick: () => console.log("Action clicked!") }}
      contentText="Motif Card Supporting Text"
      contentTitle="Card Content Title"
      contentSubtitle="Card Content Subtitle"
      contentLink={{ text: "Motif Link", href: "https://motif-ui.com/", targetBlank: true }}
      contentImage="https://picsum.photos/400/200"
      contentActionButton={{ text: "Action", onClick: () => console.log("Content action clicked!") }}
      contentAlternateButton={{ text: "Alternate", onClick: () => console.log("Content alternate clicked!") }}
      contentActionLink={{ text: "Motif Link", href: "https://motif-ui.com/", targetBlank: true, icon: "arrow_forward" }}
    />
  ),
};
