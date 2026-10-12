import type { Meta, StoryObj } from "@storybook/nextjs";
import { useLayoutEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import Popover from "@/components/Popover";
import Modal from "@/components/Modal";

// Scenes for the positioning tests in Popover.e2e.spec.ts. They are added to Storybook only in development, see .storybook/main.ts
const meta: Meta<typeof Popover> = {
  title: "E2E/Popover",
  component: Popover,
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Popover>;

const fixedWidthContent = <div style={{ padding: 12, width: 220 }}>Popover item...</div>;

export const ScrollingContainer: Story = {
  render: () => {
    const StoryComponent = () => {
      const anchorRef = useRef<HTMLButtonElement | null>(null);

      return (
        <div data-testid="scroller" style={{ overflow: "auto", width: "100%", height: 200, marginTop: 16, border: "1px solid" }}>
          <div style={{ width: 2000, height: 600, paddingLeft: 900, paddingTop: 40, boxSizing: "border-box" }}>
            <Button label="Anchor" ref={anchorRef} />
          </div>
          <Popover anchorRef={anchorRef} placeOn="bottomLeft">
            {fixedWidthContent}
          </Popover>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const GrowingContent: Story = {
  render: () => {
    const StoryComponent = () => {
      const anchorRef = useRef<HTMLButtonElement | null>(null);
      const [wide, setWide] = useState(false);

      return (
        <div style={{ padding: 8 }}>
          <Button label="Anchor" ref={anchorRef} />
          <Popover anchorRef={anchorRef} placeOn="bottom" spacing="noSpace">
            <div style={{ padding: 12, width: wide ? 500 : 300 }}>
              <Button label="Grow" onClick={() => setWide(true)} />
            </div>
          </Popover>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const LongText: Story = {
  render: () => {
    const StoryComponent = () => {
      const anchorRef = useRef<HTMLButtonElement | null>(null);

      return (
        <div style={{ paddingTop: 400, paddingLeft: 300 }}>
          <Button label="Anchor" ref={anchorRef} />
          <Popover anchorRef={anchorRef} placeOn="top" open variant="dark">
            {"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ".repeat(
              4,
            )}
          </Popover>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const TallContent: Story = {
  render: () => {
    const StoryComponent = () => {
      const anchorRef = useRef<HTMLButtonElement | null>(null);

      return (
        <div style={{ height: 3000, paddingTop: 300, paddingLeft: 300, boxSizing: "border-box" }}>
          <Button label="Anchor" ref={anchorRef} />
          <Popover anchorRef={anchorRef} placeOn="bottom" open>
            <div style={{ width: 300, height: 900 }}>Tall content</div>
          </Popover>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const NearTheRightEdge: Story = {
  render: () => {
    const StoryComponent = () => {
      const formAnchorRef = useRef<HTMLButtonElement | null>(null);
      const textAnchorRef = useRef<HTMLButtonElement | null>(null);

      return (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "100px 16px" }}>
          <Button label="Text" ref={textAnchorRef} />
          <Button label="Form" ref={formAnchorRef} />
          <Popover anchorRef={textAnchorRef} placeOn="right" open variant="dark">
            {"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ".repeat(
              3,
            )}
          </Popover>
          <Popover anchorRef={formAnchorRef} placeOn="bottomLeft" open>
            {fixedWidthContent}
          </Popover>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const ShiftedIntoTheScreen: Story = {
  render: () => {
    const StoryComponent = () => {
      const leftAnchorRef = useRef<HTMLButtonElement | null>(null);
      const rightAnchorRef = useRef<HTMLButtonElement | null>(null);
      // wider than the space on both sides of the anchors, so the popovers are shifted to stay in the screen
      const wideContent = <div style={{ padding: 12, width: 700 }}>Wide content</div>;

      return (
        <div style={{ display: "grid", gap: 400, padding: "100px 0", justifyItems: "start" }}>
          <Button label="Left" ref={leftAnchorRef} style={{ marginLeft: 400 }} />
          <Button label="Right" ref={rightAnchorRef} style={{ marginLeft: 520 }} />
          <Popover anchorRef={leftAnchorRef} placeOn="bottomLeft" open>
            {wideContent}
          </Popover>
          <Popover anchorRef={rightAnchorRef} placeOn="topRight" open>
            {wideContent}
          </Popover>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const FlippedAlignment: Story = {
  render: () => {
    const StoryComponent = () => {
      const anchorRef = useRef<HTMLButtonElement | null>(null);

      return (
        <div style={{ padding: "100px 8px" }}>
          <Button label="bottomRight" ref={anchorRef} />
          <Popover anchorRef={anchorRef} placeOn="bottomRight" open>
            <div style={{ padding: 12, width: 300 }}>Wider than the space at the left of the anchor</div>
          </Popover>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const SharedAnchor: Story = {
  render: () => {
    const StoryComponent = () => {
      const anchorRef = useRef<HTMLButtonElement | null>(null);
      const [tooltipOpen, setTooltipOpen] = useState(true);

      return (
        <div style={{ padding: "200px 300px" }}>
          <Button label="Anchor" ref={anchorRef} />
          <Button label="Close top" onClick={() => setTooltipOpen(false)} />
          <Popover anchorRef={anchorRef} placeOn="top" open={tooltipOpen} variant="dark">
            Top
          </Popover>
          <Popover anchorRef={anchorRef} placeOn="bottom" open>
            Bottom
          </Popover>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const GrowingNearTheRightEdge: Story = {
  render: () => {
    const StoryComponent = () => {
      const anchorRef = useRef<HTMLButtonElement | null>(null);
      const [wide, setWide] = useState(false);

      return (
        <div style={{ display: "flex", justifyContent: "space-between", padding: 8 }}>
          <Button label="Grow" onClick={() => setWide(true)} />
          <Button label="Anchor" ref={anchorRef} />
          <Popover anchorRef={anchorRef} placeOn="bottomLeft" spacing="noSpace" open>
            <div style={{ height: 40, width: wide ? 400 : 20 }} />
          </Popover>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const PositionedBody: Story = {
  render: () => {
    const StoryComponent = () => {
      const anchorRef = useRef<HTMLButtonElement | null>(null);

      // the popover is rendered in the body, which starts away from the document's origin when it is positioned
      useLayoutEffect(() => {
        const { style } = document.body;
        style.position = "relative";
        style.top = "37px";
        style.left = "23px";
        return () => {
          style.position = "";
          style.top = "";
          style.left = "";
        };
      }, []);

      return (
        <div style={{ padding: "100px 300px" }}>
          <Button label="Anchor" ref={anchorRef} />
          <Popover anchorRef={anchorRef} placeOn="bottomLeft" open>
            {fixedWidthContent}
          </Popover>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const InModal: Story = {
  render: () => {
    const StoryComponent = () => {
      const anchorRef = useRef<HTMLButtonElement | null>(null);

      // the page behind the modal can be scrolled, the modal and the anchor in it stay fixed on the screen
      return (
        <div style={{ height: 3000 }}>
          <Modal open title="Modal">
            <Button label="Anchor" ref={anchorRef} />
            <Popover anchorRef={anchorRef} placeOn="bottomLeft" open>
              {fixedWidthContent}
            </Popover>
          </Modal>
        </div>
      );
    };

    return <StoryComponent />;
  },
};
