import type { Meta, StoryObj } from "@storybook/nextjs";

import DateTimePicker from "./DateTimePicker";

const meta: Meta<typeof DateTimePicker> = {
  title: "Components/DateTimePicker",
  component: DateTimePicker,
  decorators: [
    Story => (
      <div style={{ width: 600, textAlign: "center" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    value: { control: { type: "date" }, description: "Date Object" },
    variant: { table: { defaultValue: { summary: "borderless" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    timeFormat: { table: { defaultValue: { summary: "24h" } } },
    locale: { table: { defaultValue: { summary: "LOCALE_DATE_TIME_TR_TR" } } },
  },
  args: {
    variant: "shadow",
  },
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

export const Primary: Story = {
  render: args => {
    const value = args.value ? new Date(args.value) : undefined;
    return <DateTimePicker {...args} value={value} />;
  },
};
