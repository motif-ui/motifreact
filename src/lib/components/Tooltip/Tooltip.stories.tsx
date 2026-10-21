import type { Meta, StoryObj } from "@storybook/nextjs";

import Button from "@/components/Button";
import { Tooltip } from "../../index";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
    position: { table: { defaultValue: { summary: "top" } } },
    variant: { table: { defaultValue: { summary: "light" } } },
    children: { control: false },
  },
  args: {
    text: "Description",
    children: <Button label="Button Element" />,
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Primary: Story = {};
