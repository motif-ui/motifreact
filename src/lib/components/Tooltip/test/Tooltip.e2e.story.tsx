import type { Meta, StoryObj } from "@storybook/nextjs";
import Tooltip from "@/components/Tooltip/Tooltip";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { OverlayPlaceOn } from "../../../types";

// Scenes for the positioning tests in Tooltip.e2e.spec.ts. They are added to Storybook only in development, see .storybook/main.ts
const meta: Meta<typeof Tooltip> = {
  title: "E2E/Tooltip",
  component: Tooltip,
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

const longText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

// tall: taller than the space the button and the screen edge leave, so a left or right tooltip is shifted along the button
const Corners = ({ position, tall }: { position: OverlayPlaceOn; tall?: boolean }) => (
  // a button in each corner of the screen, so the tooltip has no room on the sides facing the screen edges
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
        <Tooltip
          text={tall ? "Tooltip text\nSecond line\nThird line" : "Tooltip text"}
          title={tall ? "Title" : undefined}
          size={tall ? "lg" : "md"}
          position={position}
        >
          <Button label="Hover" />
        </Tooltip>
      </div>
    ))}
  </div>
);

export const CornersTop: Story = { render: () => <Corners position="top" /> };
export const CornersBottom: Story = { render: () => <Corners position="bottom" /> };
export const CornersLeft: Story = { render: () => <Corners position="left" /> };
export const CornersRight: Story = { render: () => <Corners position="right" /> };
export const CornersLeftTall: Story = { render: () => <Corners position="left" tall /> };
export const CornersRightTall: Story = { render: () => <Corners position="right" tall /> };

export const LongText: Story = {
  render: () => (
    <div style={{ padding: "200px 16px" }}>
      <Tooltip text={longText} position="right">
        <Button label="Hover" />
      </Tooltip>
    </div>
  ),
};

export const ScrollingContainer: Story = {
  render: () => (
    <div data-testid="scroller" style={{ overflow: "auto", height: 150, width: 400, margin: 16, border: "1px solid" }}>
      <div style={{ height: 600, paddingTop: 80, paddingLeft: 100 }}>
        <Tooltip text="Tooltip text">
          <Button label="Hover" />
        </Tooltip>
      </div>
    </div>
  ),
};

export const InModal: Story = {
  render: () => (
    // the page behind the modal can be scrolled, the modal and the button in it stay fixed on the screen
    <div style={{ height: 3000 }}>
      <Modal open title="Modal">
        <div style={{ paddingTop: 60 }}>
          <Tooltip text="Tooltip text">
            <Button label="Hover" />
          </Tooltip>
        </div>
      </Modal>
    </div>
  ),
};
