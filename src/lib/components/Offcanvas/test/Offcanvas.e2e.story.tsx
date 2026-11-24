import type { Meta, StoryObj } from "@storybook/nextjs";
import { useRef, useState } from "react";
import Button from "@/components/Button";
import Popover from "@/components/Popover";
import Offcanvas from "@/components/Offcanvas";
import { OffcanvasPosition } from "../types";
import { Size3 } from "../../../types";

// Scenes for the tests in Offcanvas.e2e.spec.ts. They are added to Storybook only in development, see .storybook/main.ts
const meta: Meta<typeof Offcanvas> = {
  title: "E2E/Offcanvas",
  component: Offcanvas,
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Offcanvas>;

const LONG_TITLE = "A very long offcanvas title that does not fit in a single line of the narrowest panel";

// The props are set with the native controls before opening, so each test picks its own case on the same scene
export const Playground: Story = {
  render: () => {
    const StoryComponent = () => {
      const anchorRef = useRef<HTMLButtonElement | null>(null);
      const [open, setOpen] = useState(false);
      const [position, setPosition] = useState<OffcanvasPosition>("left");
      const [size, setSize] = useState<Size3>("md");
      const [closable, setClosable] = useState(true);
      const [hideBackdrop, setHideBackdrop] = useState(false);
      const [includePadding, setIncludePadding] = useState(false);
      const [longTitle, setLongTitle] = useState(false);

      return (
        <div style={{ padding: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <label>
            Position
            <select value={position} onChange={e => setPosition(e.target.value as OffcanvasPosition)}>
              {["left", "right", "top", "bottom"].map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label>
            Size
            <select value={size} onChange={e => setSize(e.target.value as Size3)}>
              {["sm", "md", "lg"].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            <input type="checkbox" checked={closable} onChange={e => setClosable(e.target.checked)} />
            Closable
          </label>
          <label>
            <input type="checkbox" checked={hideBackdrop} onChange={e => setHideBackdrop(e.target.checked)} />
            Hide backdrop
          </label>
          <label>
            <input type="checkbox" checked={includePadding} onChange={e => setIncludePadding(e.target.checked)} />
            Include padding
          </label>
          <label>
            <input type="checkbox" checked={longTitle} onChange={e => setLongTitle(e.target.checked)} />
            Long title
          </label>
          <Button label="Open offcanvas" onClick={() => setOpen(true)} />

          <Offcanvas
            open={open}
            onClose={() => setOpen(false)}
            title={longTitle ? LONG_TITLE : "Offcanvas"}
            position={position}
            size={size}
            closable={closable}
            removeBackdrop={hideBackdrop}
            includePadding={includePadding}
          >
            <p data-testid="text">A text to select in the offcanvas</p>
            <Button label="Anchor" ref={anchorRef} />
            <Popover anchorRef={anchorRef} placeOn="bottom">
              <div style={{ padding: 12 }}>
                <Button label="In popover" />
              </div>
            </Popover>
            <Button label="Close from inside" onClick={() => setOpen(false)} />
          </Offcanvas>
        </div>
      );
    };

    return <StoryComponent />;
  },
};
