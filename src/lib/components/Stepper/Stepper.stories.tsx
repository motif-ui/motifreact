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
    variant: { table: { defaultValue: { summary: "primary" } } },
    activeStep: { control: false },
  },
  args: {
    items: [
      { title: "Account", icon: "person" },
      { title: "Personal", icon: "info" },
      { title: "Payment", icon: "credit_card" },
      { title: "Review", icon: "check_circle" },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const StepperStory = (args: ComponentProps<typeof Stepper>) => {
  const [step, setStep] = useState(0);

  return (
    <Stepper {...args} activeStep={step} onStepClick={setStep}>
      <Stepper.Panel index={0}>Account step content goes here.</Stepper.Panel>
      <Stepper.Panel index={1}>Personal info form or content.</Stepper.Panel>
      <Stepper.Panel index={2}>Payment details content.</Stepper.Panel>
      <Stepper.Panel index={3}>Review and confirm your details.</Stepper.Panel>
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
          ["items"],
          argsString => `
const items = [
  { title: "Account", icon: "person" },
  { title: "Personal", icon: "info" },
  { title: "Payment", icon: "credit_card" },
  { title: "Review", icon: "check_circle" },
];

const [step, setStep] = useState(0);

return (
  <Stepper
    items={items}
    activeStep={step}
    onStepClick={setStep}${argsString ? `\n    ${argsString}` : ""}
  >
    <Stepper.Panel index={0}>Account step content goes here.</Stepper.Panel>
    <Stepper.Panel index={1}>Personal info form or content.</Stepper.Panel>
    <Stepper.Panel index={2}>Payment details content.</Stepper.Panel>
    <Stepper.Panel index={3}>Review and confirm your details.</Stepper.Panel>
  </Stepper>
);`,
        ),
      },
    },
  },
};
