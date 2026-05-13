import type { Meta, StoryObj } from "@storybook/nextjs";

import { MOTIF_ICONS_DEFAULT_CLASS } from "../../constants";
import IconButton from "../IconButton/IconButton";

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  parameters: {
    docs: {
      description: {
        component: `
\`<IconButton>\` is very similar to \`Icon\` in terms of usage. Only differences are:

- It does not support color prop due to possible coloring issues when hovering.
- SVGs <u>are not</u> currently supported.

ℹ️ Please refer to <a href="../?path=/docs/components-icon--docs">**\\<Icon />**</a> for more details.
`,
      },
    },
  },
  argTypes: {
    iconClass: { table: { defaultValue: { summary: MOTIF_ICONS_DEFAULT_CLASS } } },
    size: { table: { defaultValue: { summary: "md" } } },
    variant: { table: { defaultValue: { summary: "secondary" } } },
  },
  args: {
    name: "motif_ui",
    size: "xxl",
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Primary: Story = {};
