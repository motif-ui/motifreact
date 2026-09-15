import type { Meta, StoryObj } from "@storybook/nextjs";

import Offcanvas from "./Offcanvas";
import { OffcanvasProps } from "./types";
import Button from "../Button/Button";
import useToggle from "../../hooks/useToggle";
import { formatStoryTransform } from "../../../utils/docUtils";

const meta: Meta<typeof Offcanvas> = {
  title: "Components/Offcanvas",
  component: Offcanvas,
  argTypes: {
    children: { control: false },
    open: { control: false },
    position: { table: { defaultValue: { summary: "left" } } },
    size: { table: { defaultValue: { summary: "md" } } },
  },
  args: {
    title: "Offcanvas Title",
    position: "left",
    size: "md",
    closable: true,
    children: (
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
      </p>
    ),
  },
};

const OffcanvasComponent = (props: OffcanvasProps) => {
  const { open, ...otherProps } = props;
  const { visible, show, hide } = useToggle(open);

  return (
    <>
      <Button label="Open Offcanvas" onClick={show} />
      <Offcanvas open={visible} onClose={hide} {...otherProps} />
    </>
  );
};

export default meta;
type Story = StoryObj<typeof Offcanvas>;

export const Primary: Story = {
  render: args => <OffcanvasComponent {...args} />,
  parameters: {
    docs: {
      source: {
        transform: formatStoryTransform("Offcanvas", ["children", "open", "onClose"], argsString => {
          return `
const { visible, show, hide } = useToggle(false);

return (
  <>
    <Button label="Open Offcanvas" onClick={show} />
    <Offcanvas
      open={visible}
      onClose={hide}
      ${argsString.split("\n  ").join("\n      ")}
    >
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
      </p>
    </Offcanvas>
  </>
);`;
        }),
      },
    },
  },
};
