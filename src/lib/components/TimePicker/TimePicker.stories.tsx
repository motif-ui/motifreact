import type { Meta, StoryObj } from "@storybook/nextjs";

import TimePicker from "./TimePicker";

const meta: Meta<typeof TimePicker> = {
  title: "Components/TimePicker",
  component: TimePicker,
  decorators: [
    Story => (
      <div style={{ width: 600, textAlign: "center" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: { table: { defaultValue: { summary: "borderless" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    format: { table: { defaultValue: { summary: "24h" } } },
    locale: { table: { defaultValue: { summary: "Turkish" } } },
  },
  args: {
    variant: "shadow",
    value: { hours: 14, minutes: 3 },
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Primary: Story = {};
