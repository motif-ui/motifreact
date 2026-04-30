import type { Meta, StoryObj } from "@storybook/nextjs";

import Link from "../Link/Link";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
    icon: { description: "Icon name (string) or a custom icon uses <span>, <i> or <svg>" },
  },
  args: {
    label: "Motif",
    url: "https://motif-ui.com",
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Primary: Story = {};
