import type { Meta, StoryObj } from "@storybook/nextjs";

import { InputTime } from "../../index";

const meta: Meta<typeof InputTime> = {
  title: "Components/InputTime",
  component: InputTime,
  argTypes: {
    placeholder: { table: { defaultValue: { summary: "__:__ (adds ':__' if secondsEnabled )" } } },
  },
  args: {
    value: { hours: 18, minutes: 12 },
    format: "24h",
  },
};

export default meta;
type Story = StoryObj<typeof InputTime>;

export const Primary: Story = {};
