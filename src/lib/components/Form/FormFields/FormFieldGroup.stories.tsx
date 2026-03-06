import type { Meta, StoryObj } from "@storybook/nextjs";
import { Form, Validations } from "../../../index";
import FormFieldGroup from "@/components/Form/FormFields/FormFieldGroup";
import Checkbox from "@/components/Checkbox";

const meta: Meta<typeof Form.FieldGroup> = {
  title: "Components/Form/Form.FieldGroup",
  component: Form.FieldGroup,
  argTypes: {
    name: { control: false },
    groupValidations: { control: false },
    orientation: { table: { defaultValue: { summary: "horizontal" } } },
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
