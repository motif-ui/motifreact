import type { Meta, StoryObj } from "@storybook/nextjs";
import InputDateTime from "@/components/InputDateTime/InputDateTime";
import Modal from "@/components/Modal";

// Scenes for the positioning tests in InputDateTime.e2e.spec.ts. They are added to Storybook only in development, see .storybook/main.ts
const meta: Meta<typeof InputDateTime> = {
  title: "E2E/InputDateTime",
  component: InputDateTime,
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof InputDateTime>;

const value = new Date(2026, 10, 12, 18, 12);

export const ScrollingContainer: Story = {
  render: args => (
    <div data-testid="scroller" style={{ overflow: "auto", height: 150, width: 400, margin: 16, border: "1px solid" }}>
      <div style={{ height: 600, paddingTop: 20 }}>
        <InputDateTime {...args} value={value} />
      </div>
    </div>
  ),
};

export const InModal: Story = {
  render: args => (
    <div style={{ height: 3000 }}>
      <Modal open title="Modal">
        <InputDateTime {...args} value={value} />
      </Modal>
    </div>
  ),
};
