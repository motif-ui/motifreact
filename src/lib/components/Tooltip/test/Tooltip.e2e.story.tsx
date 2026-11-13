import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import type { CSSProperties } from "react";
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

const edgeText = "A tooltip text long enough to be shifted at the screen edge";
const tallText = "Tooltip text\nSecond line\nThird line";

export const ShiftedIntoTheScreen: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "200px 16px" }}>
      <Tooltip text={edgeText} position="top">
        <Button label="Left" />
      </Tooltip>
      <Tooltip text={edgeText} position="bottom">
        <Button label="Right" />
      </Tooltip>
    </div>
  ),
};

export const OppositeSide: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: 16 }}>
      <Tooltip text={edgeText} position="right">
        <Button label="Right" />
      </Tooltip>
    </div>
  ),
};

const tallEdges: { label: string; style: CSSProperties; position: OverlayPlaceOn }[] = [
  { label: "Top left", style: { top: 16, left: 16 }, position: "right" },
  { label: "Top right", style: { top: 16, right: 16 }, position: "left" },
  { label: "Bottom left", style: { bottom: 16, left: 16 }, position: "right" },
  { label: "Bottom right", style: { bottom: 16, right: 16 }, position: "left" },
];

export const TallAtTheEdges: Story = {
  render: () => (
    <>
      {tallEdges.map(({ label, style, position }) => (
        <div key={label} style={{ position: "absolute", ...style }}>
          <Tooltip text={tallText} title="Title" size="lg" position={position}>
            <Button label={label} />
          </Tooltip>
        </div>
      ))}
    </>
  ),
};

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

export const GrowingContent: Story = {
  render: () => {
    const StoryComponent = () => {
      const [copied, setCopied] = useState(false);

      return (
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "200px 8px" }}>
          <Tooltip text={copied ? longText : "Copy"}>
            <Button label="Hover" onClick={() => setCopied(true)} />
          </Tooltip>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const TallContent: Story = {
  render: () => (
    <div style={{ padding: "300px 300px 0" }}>
      <Tooltip text={Array.from({ length: 40 }, (_, i) => `Line ${i + 1}`).join("\n")} position="bottom" size="lg">
        <Button label="Hover" />
      </Tooltip>
    </div>
  ),
};
