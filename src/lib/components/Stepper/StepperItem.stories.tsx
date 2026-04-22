import type { Meta, StoryObj } from "@storybook/nextjs";
import StepperItem from "./components/StepperItem";
import Stepper from "./Stepper";

const meta: Meta<typeof StepperItem> = {
  title: "Components/Stepper/Item",
  component: StepperItem,
  argTypes: {
    variant: { table: { defaultValue: { summary: "[parent variant]" } } },
    icon: { table: { defaultValue: { summary: "motif_ui" } } },
    index: { table: { disable: true } },
  },
  args: {
    title: "Step Title",
    icon: "person",
    variant: "primary",
  },
};

export default meta;
type Story = StoryObj<typeof StepperItem>;

export const Primary: Story = {
  render: args => (
    <Stepper activeStep={1} onStepClick={() => {}}>
      <Stepper.Item title="Previous" icon="check" />
      <Stepper.Item {...args} />
      <Stepper.Item title="Next" icon="info" />
    </Stepper>
  ),
};
