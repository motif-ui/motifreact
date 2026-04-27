import type { Meta, StoryObj } from "@storybook/nextjs";

import Alert from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  argTypes: {
    variant: { table: { defaultValue: { summary: "secondary" } } },
    children: {
      control: { type: "boolean" },
      mapping: {
        false: undefined,
        true: (
          <div>
            <span style={{ color: "green", display: "block" }}>
              <strong>Bold</strong> and <i>italic</i> green text with an image!
            </span>
            <img src="https://picsum.photos/seed/motifui/200/100" alt="Alert children example" style={{ width: 200, borderRadius: 8 }} />
          </div>
        ),
      },
      table: { type: { summary: "React.ReactNode" } },
    },
  },
  args: {
    title: "Warning Title",
    message: "This is a test message.",
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Primary: Story = {};
