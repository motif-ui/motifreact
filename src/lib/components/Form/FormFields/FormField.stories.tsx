import type { Meta, StoryObj } from "@storybook/nextjs";
import { Form, InputText, Validations } from "../../../index";
import FormField from "@/components/Form/FormFields/FormField";

const meta: Meta<typeof Form.Field> = {
  title: "Components/Form/Form.Field",
  component: Form.Field,
  argTypes: {
    name: { control: false },
    validations: { control: false },
  },
  args: {
    label: "Application Name",
    helperText: "Please enter the application name",
    name: "appName",
    validations: [Validations.Required],
  },
};

export default meta;
type Story = StoryObj<typeof Form.Field>;

export const Primary: Story = {
  render: args => (
    <Form onSubmit={console.log}>
      <FormField {...args}>
        <InputText />
      </FormField>
    </Form>
  ),
};
