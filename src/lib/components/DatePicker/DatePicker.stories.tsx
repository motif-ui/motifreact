import type { Meta, StoryObj } from "@storybook/nextjs";

import DatePicker from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  decorators: [
    Story => (
      <div style={{ width: 600, textAlign: "center" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    value: { control: { type: "date" } },
    variant: { table: { defaultValue: { summary: "borderless" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    locale: { table: { defaultValue: { summary: "LOCALE_DATE_TR_TR" } } },
  },
  args: {
    variant: "shadow",
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Primary: Story = {
  render: args => {
    const value = args.value ? new Date(args.value) : undefined;
    return <DatePicker {...args} value={value} />;
  },
};
