import type { Meta, StoryObj } from "@storybook/nextjs";
import InputTime from "@/components/InputTime/InputTime";
import Modal from "@/components/Modal";

// Scenes for the positioning tests in InputTime.e2e.spec.ts. They are added to Storybook only in development, see .storybook/main.ts
const meta: Meta<typeof InputTime> = {
  title: "E2E/InputTime",
  component: InputTime,
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof InputTime>;

const value = { hours: 18, minutes: 12 };

export const ScrollingContainer: Story = {
  render: args => (
    <div data-testid="scroller" style={{ overflow: "auto", height: 150, width: 400, margin: 16, border: "1px solid" }}>
      <div style={{ height: 600, paddingTop: 20 }}>
        <InputTime {...args} value={value} />
      </div>
    </div>
  ),
};

export const InModal: Story = {
  render: args => (
    <div style={{ height: 3000 }}>
      <Modal open title="Modal">
        <InputTime {...args} value={value} />
      </Modal>
    </div>
  ),
};
