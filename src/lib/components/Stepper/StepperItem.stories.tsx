import type { Meta, StoryObj } from "@storybook/nextjs";
import Stepper from "./Stepper";

const meta: Meta<typeof Stepper.Item> = {
  title: "Components/Stepper/Stepper.Item",
  component: Stepper.Item,
  argTypes: {
    variant: { table: { defaultValue: { summary: "[parent variant]" } } },
    icon: { table: { defaultValue: { summary: "motif_ui" } } },
    children: { control: "text", table: { type: { summary: "ReactNode" } } },
  },
  args: {
    title: "Step Title",
    children: "Step content goes here.",
  },
};

export default meta;
type Story = StoryObj<typeof Stepper.Item>;

export const Primary: Story = {
  render: args => (
    <Stepper activeStep={1} stepType="icon">
      <Stepper.Item {...args} title={`${args.title} Completed`} />
      <Stepper.Item {...args} />
      <Stepper.Item {...args} title={`${args.title} Upcoming`} />
    </Stepper>
  ),
};
