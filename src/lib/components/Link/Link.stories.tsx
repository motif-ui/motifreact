import type { Meta, StoryObj } from "@storybook/nextjs";

import Link from "../Link/Link";
import { iconOptions, iconDecorator } from "../../../utils/storybookUtils.tsx";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  decorators: [iconDecorator],
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
    icon: {
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      control: { type: "select" },
    },
  },
  args: {
    label: "Motif",
    url: "https://motif-ui.com",
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Primary: Story = {};
