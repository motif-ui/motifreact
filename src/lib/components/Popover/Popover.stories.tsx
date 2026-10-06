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
