import type { Meta, StoryObj } from "@storybook/nextjs";
import { Form, Validations } from "../../../index";
import FormFieldGroup from "@/components/Form/FormFields/FormFieldGroup";
import Checkbox from "@/components/Checkbox";
import RadioGroup from "@/components/RadioGroup";
import Radio from "@/components/Radio";
import InputPassword from "@/components/InputPassword";

const meta: Meta<typeof Form.FieldGroup> = {
  title: "Components/Form/Form.FieldGroup",
  component: Form.FieldGroup,
  argTypes: {
    name: { control: false },
    groupValidations: { control: false },
    orientation: { table: { defaultValue: { summary: "horizontal" } } },
    wrap: { table: { defaultValue: { summary: "false" } } },
  },
  args: {
    label: "Sports",
    helperText: "Please choose your favourite sports",
    name: "sports",
    groupValidations: [Validations.AtLeastN(2)],
  },
};

export default meta;
type Story = StoryObj<typeof Form.FieldGroup>;

export const Primary: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "This component is designed to hold couple of input items together. Input values are submitted under the **name** prop of the ``Form.FieldGroup``. Theoritically, it is possible to use any input component inside the ``Form.FieldGroup``.",
      },
    },
  },
  render: args => (
    <Form onSubmit={console.log}>
      <FormFieldGroup {...args}>
        <Checkbox name="football" label="Football" />
        <Checkbox name="basketball" label="Basketball" />
        <Checkbox name="tennis" label="Tennis" />
      </FormFieldGroup>
    </Form>
  ),
};

export const SideBySideByDefault: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "By default (**wrap={false}**), group items are kept on a single line, which is important when grouping a couple of wider items (e.g. a RadioGroup next to an input) that should always sit side by side rather than stack.",
      },
    },
  },
  args: {
    label: "Gender",
    helperText: undefined,
    name: "gender",
    groupValidations: undefined,
    orientation: "horizontal",
  },
  render: args => (
    <Form onSubmit={console.log} formOrientation="horizontal" labelOrientation="horizontal">
      <FormFieldGroup {...args}>
        <RadioGroup name="gender" orientation="vertical">
          <Radio value="male" label="Male" />
          <Radio value="female" label="Female" />
        </RadioGroup>
        <InputPassword name="password" />
      </FormFieldGroup>
    </Form>
  ),
};

export const Wrap: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Set **wrap={true}** to let group items wrap onto multiple lines when they don't fit on one, which is useful for groups with many small items (e.g. checkboxes) in a narrow container.",
      },
    },
  },
  args: {
    wrap: true,
  },
  render: args => (
    <Form onSubmit={console.log} style={{ width: 220 }}>
      <FormFieldGroup {...args}>
        <Checkbox name="football" label="Football" />
        <Checkbox name="basketball" label="Basketball" />
        <Checkbox name="tennis" label="Tennis" />
      </FormFieldGroup>
    </Form>
  ),
};
