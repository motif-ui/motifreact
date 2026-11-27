import type { Meta, StoryObj } from "@storybook/nextjs";

import Drawer from "./Drawer";
import { DrawerProps } from "./types";
import Button from "../Button/Button";
import useToggle from "../../hooks/useToggle";
import { formatStoryTransform } from "../../../utils/docUtils";

const meta: Meta<typeof Drawer> = {
  title: "Components/Drawer",
  component: Drawer,
  argTypes: {
    children: { control: false },
    open: { control: false },
    position: { table: { defaultValue: { summary: "left" } } },
    size: { table: { defaultValue: { summary: "md" } } },
  },
  args: {
    title: "Drawer Title",
    position: "left",
    size: "md",
    closable: true,
    includePadding: true,
    children: (
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
      </p>
    ),
  },
};

const DrawerComponent = (props: DrawerProps) => {
  const { open, ...otherProps } = props;
  const { visible, show, hide } = useToggle({ initialVisible: open });

  return (
    <>
      <Button label="Open Drawer" onClick={show} />
      <Drawer open={visible} onClose={hide} {...otherProps} />
    </>
  );
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Primary: Story = {
  render: args => <DrawerComponent {...args} />,
  parameters: {
    docs: {
      source: {
        transform: formatStoryTransform("Drawer", ["children", "open", "onClose"], argsString => {
          return `
const { visible, show, hide } = useToggle(false);

return (
  <>
    <Button label="Open Drawer" onClick={show} />
    <Drawer
      open={visible}
      onClose={hide}
      ${argsString.split("\n  ").join("\n      ")}
    >
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
      </p>
    </Drawer>
  </>
);`;
        }),
      },
    },
  },
};
