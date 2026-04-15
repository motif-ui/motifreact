import { ComponentProps, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import Stepper from "./Stepper";
import { formatStoryTransform } from "../../../utils/docUtils";

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  component: Stepper,
  argTypes: {
    stepType: { table: { defaultValue: { summary: "number" } } },
    orientation: { table: { defaultValue: { summary: "horizontal" } } },
    itemOrientation: { table: { defaultValue: { summary: "vertical" } } },
    connectorAlign: { table: { defaultValue: { summary: "center" } } },
    variant: { table: { defaultValue: { summary: "primary" } } },
    activeStep: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const StepperStory = (args: ComponentProps<typeof Stepper>) => {
  const [step, setStep] = useState(0);

  return (
    <Stepper {...args} activeStep={step} onStepClick={setStep}>
      <Stepper.Item title="Account" icon="person">
        Account step content goes here.
      </Stepper.Item>
      <Stepper.Item title="Personal" icon="info">
        Personal info form or content.
      </Stepper.Item>
      <Stepper.Item title="Payment" icon="credit_card">
        Payment details content.
      </Stepper.Item>
      <Stepper.Item title="Review" icon="check_circle">
        Review and confirm your details.
      </Stepper.Item>
    </Stepper>
  );
};

export const Primary: Story = {
  render: args => <StepperStory {...args} />,
  parameters: {
    docs: {
      source: {
        transform: formatStoryTransform(
          "Stepper",
          [],
          argsString => `
const [step, setStep] = useState(0);

return (
  <Stepper
    activeStep={step}
    onStepClick={setStep}${argsString ? `\n    ${argsString}` : ""}
  >
    <Stepper.Item title="Account" icon="person">Account step content goes here.</Stepper.Item>
    <Stepper.Item title="Personal" icon="info">Personal info form or content.</Stepper.Item>
    <Stepper.Item title="Payment" icon="credit_card">Payment details content.</Stepper.Item>
    <Stepper.Item title="Review" icon="check_circle">Review and confirm your details.</Stepper.Item>
  </Stepper>
);`,
        ),
      },
    },
  },
};
