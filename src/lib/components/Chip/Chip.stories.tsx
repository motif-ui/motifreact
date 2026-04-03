import type { Meta, StoryObj } from "@storybook/nextjs";

import Chip from "./Chip";

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  argTypes: {
    variant: { table: { defaultValue: { summary: "secondary" } } },
    shape: { table: { defaultValue: { summary: "solid" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    pill: { table: { defaultValue: { summary: "true" } } },
    icon: { description: "Icon name (string) or a custom icon component (ReactElement), e.g. `<FontAwesomeIcon />`" },
  },
  args: {
    label: "Chips",
    pill: true,
    closable: true,
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Primary: Story = {};
