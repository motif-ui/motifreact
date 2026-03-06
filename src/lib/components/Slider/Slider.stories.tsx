import type { Meta, StoryObj } from "@storybook/nextjs";
import Slider from "@/components/Slider/Slider";

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
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
    fill: { table: { defaultValue: { summary: "left" } } },
    min: { table: { defaultValue: { summary: "0" } } },
    max: { table: { defaultValue: { summary: "100" } } },
    value: {
      table: {
        type: { summary: "number" },
      },
      control: { type: "number" },
    },
  },
  args: {
    start: 0,
    min: 0,
    end: 100,
    max: 100,
    step: 1,
    value: 50,
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Primary: Story = {};
