import { CSSProperties, ComponentProps, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import Stepper from "./Stepper";

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
};

const orderItems = [
  { title: "Cart", icon: "shopping_cart" },
  { title: "Address", icon: "location_on" },
  { title: "Payment", icon: "credit_card" },
  { title: "Confirm", icon: "check_circle" },
];

const OrderPanels = () => (
  <>
    <Stepper.Panel index={0}>Review your cart items.</Stepper.Panel>
    <Stepper.Panel index={1}>Enter your delivery address.</Stepper.Panel>
    <Stepper.Panel index={2}>Choose a payment method.</Stepper.Panel>
    <Stepper.Panel index={3}>Your order is confirmed!</Stepper.Panel>
  </>
);

export const CustomColors: Story = {
  args: {
    items: [
      { ...orderItems[0], variant: "primary" },
      { ...orderItems[1], variant: "secondary" },
      { ...orderItems[2], variant: "warning" },
      { ...orderItems[3], variant: "success" },
    ],
  },
  render: function Render(args) {
    const [step, setStep] = useState(0);
    return (
      <Stepper {...args} activeStep={step} onStepClick={setStep}>
        <OrderPanels />
      </Stepper>
    );
  },
};

export const StyleOverride: Story = {
  args: {
    items: orderItems,
  },
  render: function Render(args) {
    const [step, setStep] = useState(0);
    return (
      <Stepper
        {...args}
        activeStep={step}
        onStepClick={setStep}
        style={
          {
            "--theme-color-surface-primary-default": "#8b5cf6",
            "--theme-color-text-base-global-light": "#ffffff",
            "--theme-color-text-primary-default": "#8b5cf6",
          } as CSSProperties
        }
      >
        <OrderPanels />
      </Stepper>
    );
  },
};
