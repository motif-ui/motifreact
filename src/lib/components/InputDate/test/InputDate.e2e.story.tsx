import type { Meta, StoryObj } from "@storybook/nextjs";
import InputDate from "@/components/InputDate/InputDate";
import Modal from "@/components/Modal";

// Scenes for the positioning tests in InputDate.e2e.spec.ts. They are added to Storybook only in development, see .storybook/main.ts
const meta: Meta<typeof InputDate> = {
  title: "E2E/InputDate",
  component: InputDate,
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof InputDate>;

export const ScrollingContainer: Story = {
  render: args => (
    <div data-testid="scroller" style={{ overflow: "auto", height: 150, width: 400, margin: 16, border: "1px solid" }}>
      <div style={{ height: 600, paddingTop: 20 }}>
        <InputDate {...args} value={new Date(2026, 10, 12)} />
      </div>
    </div>
  ),
};

export const InModal: Story = {
  render: args => (
    <div style={{ height: 3000 }}>
      <Modal open title="Modal">
        <InputDate {...args} value={new Date(2026, 10, 12)} />
      </Modal>
    </div>
  ),
};

export const Corners: Story = {
  render: args => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto",
        justifyContent: "space-between",
        alignContent: "space-between",
        height: "100vh",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      {["topLeft", "topRight", "bottomLeft", "bottomRight"].map(corner => (
        <div key={corner} data-testid={corner}>
          <InputDate {...args} value={new Date(2026, 10, 12)} />
        </div>
      ))}
    </div>
  ),
};
