import type { Meta, StoryObj } from "@storybook/nextjs";
import InputDateRange from "@/components/InputDateRange/InputDateRange";

const today = new Date();

const meta: Meta<typeof InputDateRange> = {
  title: "Components/InputDateRange",
  component: InputDateRange,
  argTypes: {
    format: { description: "Detailed in this document below..." },
    value: {
      table: {
        type: { summary: "Date[]" },
      },
    },
    locale: { table: { defaultValue: { summary: "Turkish" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    placeholder: { table: { defaultValue: { summary: "Reflects format prop" } } },
  },
  args: {
    value: [new Date(today), new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)],
  },
};

export default meta;
type Story = StoryObj<typeof InputDateRange>;

export const Primary: Story = {};
