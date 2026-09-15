import type { Meta, StoryObj } from "@storybook/nextjs";

import ProgressBar from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  decorators: [
    Story => (
      <div style={{ width: 200, textAlign: "center" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
* \`interminate\` prop always takes precedence over \`showPercentage\` prop.
* When \`countdown\` prop is given, \`showPercentage\` prop becomes inactive and **percentage text** is not shown.
        `,
      },
    },
  },
  argTypes: {
    size: { table: { defaultValue: { summary: "sm" } } },
    variant: { table: { defaultValue: { summary: "primary" } } },
    progress: { table: { defaultValue: { summary: "0" } } },
    maxProgress: { table: { defaultValue: { summary: "100" } } },
  },
  args: {
    progress: 65,
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Primary: Story = {};
