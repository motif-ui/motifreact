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
    closeOnEscape: { table: { defaultValue: { summary: "true (uncont`d), false (cont`d)" } } },
    closeOnOutsideClick: { table: { defaultValue: { summary: "true (uncont`d), false (cont`d)" } } },
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

export const Uncontrolled: Story = {
  parameters: {
    docs: {
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

export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
const anchorRef = useRef(null);
const [open, setOpen] = useState(false);

<Button label="Click" ref={anchorRef} onClick={() => setOpen(!open)} />
<Popover anchorRef={anchorRef} open={open} onClose={() => setOpen(false)} closeOnOutsideClick closeOnEscape>
  <div>Popover item...</div>
</Popover>
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
          <Popover {...args} anchorRef={anchorRef} open={open} onClose={() => setOpen(false)} closeOnOutsideClick closeOnEscape>
            {item}
          </Popover>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const UsePopover: Story = {
  name: "usePopover",
  parameters: {
    docs: {
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
