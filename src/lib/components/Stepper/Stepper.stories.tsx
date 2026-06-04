import type { Meta, StoryObj } from "@storybook/nextjs";

import Stepper from "./Stepper";
import useStepper from "@/components/Stepper/hooks/useStepper.ts";
import Form from "@/components/Form";
import InputText from "@/components/InputText";
import Alert from "@/components/Alert";
import { useState } from "react";

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  component: Stepper,
  argTypes: {
    stepType: { table: { defaultValue: { summary: "number" } } },
    orientation: { table: { defaultValue: { summary: "horizontal" } } },
    itemOrientation: { table: { defaultValue: { summary: "vertical" } } },
    variant: { table: { defaultValue: { summary: "primary" } } },
    activeStep: { control: false, table: { defaultValue: { summary: "0" } } },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Primary: Story = {
  render: args => (
    <Stepper {...args}>
      <Stepper.Item title="Account" icon="person" key="1">
        Account step content goes here.
      </Stepper.Item>
      <Stepper.Item title="Personal" icon="info" key="2">
        Personal info form or content.
      </Stepper.Item>
      <Stepper.Item title="Payment" icon="credit_card" key="3">
        Payment details content.
      </Stepper.Item>
      <Stepper.Item title="Review" icon="check_circle" key="4">
        Review and confirm your details.
      </Stepper.Item>
    </Stepper>
  ),
};

const StepperDataStoring = () => {
  const stepper = useStepper();
  const { stepData, setStepData } = stepper;
  const accountCode = (stepData[0]?.accountCode ?? "") as string;

  return (
    <Stepper state={stepper}>
      <Stepper.Item title="Account" icon="person">
        <Form>
          <Form.Field name="accountCode" label="Account Code">
            <InputText value={accountCode} onChange={val => setStepData(0, { accountCode: val })} />
          </Form.Field>
        </Form>
      </Stepper.Item>
      <Stepper.Item title="Review" icon="check_circle">
        <Alert variant="warning" title="Account Code" message={"Your code is " + accountCode} />
      </Stepper.Item>
    </Stepper>
  );
};
export const DataStoring: Story = {
  render: () => <StepperDataStoring />,
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
const stepper = useStepper();
const { stepData, setStepData } = stepper;
const accountCode = (stepData[0]?.accountCode ?? "") as string;

return (
  <Stepper state={stepper}>
    <Stepper.Item title="Account" icon="person">
      <Form>
        <Form.Field name="accountCode" label="Account Code">
          <InputText value={accountCode} onChange={val => setStepData(0, { accountCode: val })} />
        </Form.Field>
      </Form>
    </Stepper.Item>
    <Stepper.Item title="Review" icon="check_circle">
      <Alert variant="warning" title="Account Code" message={"Your code is " + accountCode} />
    </Stepper.Item>
  </Stepper>
);
        `,
      },
    },
  },
};

const StepperCustomNavigation = () => {
  const stepper = useStepper();
  const { stepData, setStepData, goToNextStep } = stepper;
  const [step2Disabled, setStep2Disabled] = useState(false);
  const code = (stepData[0]?.code ?? "") as string;

  const onNextClick = () => {
    switch (code) {
      case "1":
        setStep2Disabled(true);
        goToNextStep();
        break;
      case "2":
        setStep2Disabled(false);
        alert("You shall not pass! Input cannot be 2.");
        break;
      default:
        setStep2Disabled(false);
        goToNextStep();
    }
  };

  return (
    <Stepper state={stepper} onNextClick={onNextClick} style={{ width: 340 }}>
      <Stepper.Item title="Account" icon="person">
        <>
          <Alert variant="info">
            Type &#34;1&#34; to disable next step
            <br />
            Type &#34;2&#34; to show an alert and stop
          </Alert>
          <br />
          <Form>
            <Form.Field name="code" label="Code">
              <InputText value={code} onChange={val => setStepData(0, { code: val })} />
            </Form.Field>
          </Form>
        </>
      </Stepper.Item>
      <Stepper.Item title="Credit Card" icon="credit_card" disabled={step2Disabled}>
        This is step 2
      </Stepper.Item>
      <Stepper.Item title="Review" icon="check_circle">
        <Alert variant="success" title="Perfect" message="You've reached the end!" />
      </Stepper.Item>
    </Stepper>
  );
};
export const CustomNavigation: Story = {
  render: () => <StepperCustomNavigation />,
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
const stepper = useStepper();
const { stepData, setStepData, goToNextStep } = stepper;
const [step2Disabled, setStep2Disabled] = useState(false);
const accountCode = (stepData[0]?.accountCode ?? "") as string;

const onNextClick = () => {
  switch (step2Disabled) {
    case accountCode === "1":
      setStep2Disabled(true);
      goToNextStep();
      break;
    case accountCode === "2":
      setStep2Disabled(false);
      alert("You shall not pass! Input cannot be 2.");
      break;
    default:
      setStep2Disabled(false);
      goToNextStep();
  }
};

return (
  <Stepper state={stepper} onNextClick={onNextClick}>
    <Stepper.Item title="Account" icon="person">
      <>
        <Alert variant="info">
          Type &#34;1&#34; to disable next step
          <br />
          Type &#34;2&#34; to show an alert and stop
        </Alert>
        <br />
        <Form>
          <Form.Field name="code" label="Code">
            <InputText value={accountCode} onChange={val => setStepData(0, { accountCode: val })} />
          </Form.Field>
        </Form>
      </>
    </Stepper.Item>
    <Stepper.Item title="Credit Card" icon="credit_card" disabled={step2Disabled}>
      This is step 2
    </Stepper.Item>
    <Stepper.Item title="Review" icon="check_circle">
      <Alert variant="success" title="Perfect" message="You've reached the end!" />
    </Stepper.Item>
  </Stepper>
);
        `,
      },
    },
  },
};
