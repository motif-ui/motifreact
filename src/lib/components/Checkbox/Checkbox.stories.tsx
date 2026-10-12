import type { Meta, StoryObj } from "@storybook/nextjs";

import Checkbox from "./Checkbox";
import { Link } from "src/lib";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
    children: {
      table: { type: { summary: "ReactNode" } },
      control: { type: "boolean" },
      mapping: { false: undefined, true: <Link label="I agree to the Terms & Privacy Policy" url="#" /> },
    },
  },
  args: { label: "Please Approve", checked: true, disabled: false },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Primary: Story = {};
