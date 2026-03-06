import type { Meta, StoryObj } from "@storybook/nextjs";

import RadioGroup from "./RadioGroup";
import Radio from "../Radio/Radio";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  argTypes: {
    orientation: { table: { defaultValue: { summary: "vertical" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    value: { type: "string" },
  },
  args: {
    name: "language",
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Primary: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "This component is designed to use multiple `<Radio>` components under the same name. There is only one restriction! In order to give a default value to be checked, **value** prop of `<RadioGroup>` should be used instead of using the **checked** prop of `<Radio>`",
      },
    },
  },

  render: args => (
    <RadioGroup {...args}>
      <Radio label="HTML" value="html" />
      <Radio label="CSS" value="css" />
      <Radio label="JavaScript" value="js" />
    </RadioGroup>
  ),
};
