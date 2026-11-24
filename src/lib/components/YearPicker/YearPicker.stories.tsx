import type { Meta, StoryObj } from "@storybook/nextjs";

import YearPicker from "./YearPicker";

const meta: Meta<typeof YearPicker> = {
  title: "Components/YearPicker",
  component: YearPicker,
  argTypes: {
    value: { control: { type: "number" } },
    variant: { table: { defaultValue: { summary: "borderless" } } },
    size: { table: { defaultValue: { summary: "md" } } },
  },
  args: {
    variant: "shadow",
  },
};

export default meta;
type Story = StoryObj<typeof YearPicker>;

export const Primary: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const PrimaryStaticForChromatic: Story = {
  tags: ["!autodocs", "!dev"],
  args: { value: 2013 },
};
