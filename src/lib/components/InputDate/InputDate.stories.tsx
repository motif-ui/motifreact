import type { Meta, StoryObj } from "@storybook/nextjs";

import InputDate from "./InputDate";

const meta: Meta<typeof InputDate> = {
  title: "Components/InputDate",
  component: InputDate,
  argTypes: {
    format: { description: "Detailed in this document below..." },
    value: { control: { type: "date" }, description: "Date Object" },
    size: { table: { defaultValue: { summary: "md" } } },
    placeholder: { table: { defaultValue: { summary: "Reflects format prop" } } },
  },
  args: {},
};

export default meta;
type Story = StoryObj<typeof InputDate>;

export const Primary: Story = {
  render: args => {
    const value = args.value ? new Date(args.value as number) : undefined;
    return <InputDate {...args} {...(value && { value })} />;
  },
};
