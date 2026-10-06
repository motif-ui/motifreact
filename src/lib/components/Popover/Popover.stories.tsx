import type { Meta, StoryObj } from "@storybook/nextjs";

import Button from "@/components/Button";
import Popover from "@/components/Popover";
import { useRef, useState } from "react";
import Avatar from "@/components/Avatar";
import { usePopover } from "../../hooks";
import { PopoverProps } from "@/components/Popover/types";

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
  argTypes: {
    placeOn: { table: { defaultValue: { summary: "bottom" } } },
    variant: { table: { defaultValue: { summary: "light" } } },
    spacing: { table: { defaultValue: { summary: "callout" } } },
    anchorRef: {
      control: false,
    },
  },
  args: {},
};

export default meta;
type Story = StoryObj<typeof Popover>;

const item = <div style={{ padding: 12 }}>Popover item...</div>;
const containerStyle = { paddingTop: 40, paddingBottom: 40 };

const PopoverExample = (args: PopoverProps) => {
  const ref = useRef(null);

  return (
    <div style={containerStyle}>
      <Avatar letters="AA" ref={ref} />
      <Popover {...args} anchorRef={ref}>
        {item}
      </Popover>
    </div>
  );
};

export const Primary: Story = {
  render: args => <PopoverExample {...args} />,
};

export const HandleWithState: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
const anchorRef = useRef(null);
const [open, setOpen] = useState(false);
  
<Popover open={open} anchorRef={anchorRef} >
  <div>Popover item...</div>
</Popover>
<Button label="Click" ref={anchorRef} onClick={() => setOpen(!open)} />    
        `,
      },
    },
  },
  render: args => {
    const StoryComponent = () => {
      const anchorRef = useRef(null);
      const [open, setOpen] = useState(false);

      return (
        <div style={containerStyle}>
          <Button label="Click" ref={anchorRef} onClick={() => setOpen(!open)} />
          <Popover {...args} anchorRef={anchorRef} open={open}>
            {item}
          </Popover>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const OutsideClickWithHook: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When the ``open`` prop is given, ``Popover`` only depends on it to appear/disappear and does not close itself with an outside click unless ``closeOnOutsideClick`` is set. The ``usePopover`` hook keeps the ``open`` state and closes it with an outside click. <br /><br />Click outside the popover to close it.",
      },
      source: {
        type: "code",
        code: `
const anchorRef = useRef(null);
const { ref, open, toggle } = usePopover(anchorRef);
  
<Popover open={open} ref={ref} anchorRef={anchorRef} >
  <div>Popover item...</div>
</Popover>
<Button label="Click" ref={anchorRef} onClick={toggle} />    
        `,
      },
    },
  },
  render: args => {
    const StoryComponent = () => {
      const anchorRef = useRef<HTMLButtonElement | null>(null);
      const { ref, open, toggle } = usePopover(anchorRef);

      return (
        <div style={containerStyle}>
          <Button label="Click" ref={anchorRef} onClick={toggle} />
          <Popover {...args} ref={ref} anchorRef={anchorRef} open={open}>
            {item}
          </Popover>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const Uncontrolled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When the ``open`` prop is not given, ``Popover`` manages its own state: clicking the anchor toggles it, and an outside click or Escape closes it. ``defaultOpen`` sets the initial state. <br /><br />Click the button to toggle the popover.",
      },
      source: {
        type: "code",
        code: `
const anchorRef = useRef(null);

<Button label="Click" ref={anchorRef} />
<Popover anchorRef={anchorRef}>
  <div>Popover item...</div>
</Popover>
        `,
      },
    },
  },
  render: args => {
    const StoryComponent = () => {
      const anchorRef = useRef<HTMLButtonElement | null>(null);

      return (
        <div style={containerStyle}>
          <Button label="Click" ref={anchorRef} />
          <Popover {...args} anchorRef={anchorRef}>
            {item}
          </Popover>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

// Fixtures for the overlay positioning tests in .e2e, not shown in the docs
const e2eContent = <div style={{ padding: 12, width: 220 }}>Popover item...</div>;

export const ScrollingContainerForE2E: Story = {
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen", chromatic: { disableSnapshot: true } },
  render: () => {
    const StoryComponent = () => {
      const anchorRef = useRef<HTMLButtonElement | null>(null);

      return (
        <div data-testid="scroller" style={{ overflow: "auto", width: "100%", height: 200, marginTop: 16, border: "1px solid" }}>
          <div style={{ width: 2000, height: 600, paddingLeft: 900, paddingTop: 40, boxSizing: "border-box" }}>
            <Button label="Anchor" ref={anchorRef} />
          </div>
          <Popover anchorRef={anchorRef} placeOn="bottomLeft">
            {e2eContent}
          </Popover>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const GrowingContentForE2E: Story = {
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen", chromatic: { disableSnapshot: true } },
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

export const LongTextForE2E: Story = {
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen", chromatic: { disableSnapshot: true } },
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

export const TallContentForE2E: Story = {
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen", chromatic: { disableSnapshot: true } },
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

export const NearTheRightEdgeForE2E: Story = {
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen", chromatic: { disableSnapshot: true } },
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
            {e2eContent}
          </Popover>
        </div>
      );
    };

    return <StoryComponent />;
  },
};
