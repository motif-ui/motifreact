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
          "By default, ``Popover`` only depends on the ``open`` prop to appear/disappear and does not close itself with an outside click. In order to make it disappear with an outside click, a custom ``usePopover`` hook might be used. <br /><br />Click outside the popover to close it.",
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
