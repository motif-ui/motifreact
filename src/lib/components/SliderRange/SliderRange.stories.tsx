import type { Meta, StoryObj } from "@storybook/nextjs";
import SliderRange from "@/components/SliderRange/SliderRange";

const meta: Meta<typeof SliderRange> = {
  title: "Components/SliderRange",
  component: SliderRange,
  decorators: [
    Story => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    start: { table: { defaultValue: { summary: "0" } } },
    end: { table: { defaultValue: { summary: "100" } } },
    step: { table: { defaultValue: { summary: "1" } } },
    variant: { table: { defaultValue: { summary: "primary" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    min: { table: { defaultValue: { summary: "0" } } },
    max: { table: { defaultValue: { summary: "100" } } },
  },
  args: {
    start: 0,
    end: 100,
    step: 1,
    value: [20, 60],
    min: 0,
    max: 100,
  },
};

export default meta;
type Story = StoryObj<typeof SliderRange>;

export const Primary: Story = {};
