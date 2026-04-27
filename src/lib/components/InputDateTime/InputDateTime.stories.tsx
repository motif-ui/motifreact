import type { Meta, StoryObj } from "@storybook/nextjs";

import { InputDateTime } from "../../index";

const meta: Meta<typeof InputDateTime> = {
  title: "Components/InputDateTime",
  component: InputDateTime,
  argTypes: {
    value: { control: { type: "date" }, description: "Date Object" },
    dateFormat: { description: "Detailed in this document below..." },
    size: { table: { defaultValue: { summary: "md" } } },
    timeFormat: { table: { defaultValue: { summary: "24h" } } },
    placeholder: { table: { defaultValue: { summary: "Reflects format prop and time placeholder" } } },
  },
  args: {},
};

export default meta;
type Story = StoryObj<typeof InputDateTime>;

export const Primary: Story = {
  render: args => {
    const value = args.value ? new Date(args.value) : undefined;
    return <InputDateTime {...args} {...(value && { value })} />;
  },
};
