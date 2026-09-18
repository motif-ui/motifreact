import type { Meta, StoryObj } from "@storybook/nextjs";

import AlertModal from "./AlertModal";
import { AlertModalProps } from "./types";
import Button from "../Button/Button";
import useToggle from "../../hooks/useToggle";
import { formatStoryTransform } from "../../../utils/docUtils";
import { MotifIcon } from "../Motif/Icon";

const meta: Meta<typeof AlertModal> = {
  title: "Components/AlertModal",
  component: AlertModal,
  argTypes: {
    open: { control: false },
    alternateButton: { control: false },
    contentPosition: { table: { defaultValue: { summary: "center" } } },
    buttonsPosition: { table: { defaultValue: { summary: "center" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    variant: { table: { defaultValue: { summary: "primary" } } },
  },
  args: {
    title: "Alert Modal Title",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ",
    icon: <MotifIcon name="info" size="xxl" />,
    closable: true,
    actionButton: { text: "Action", onClick: () => alert("Action clicked!") },
    alternateButton: { text: "Close", onClick: () => {} },
  },
};

const AlertModalComponent = (props: AlertModalProps) => {
  const { open, alternateButton, ...otherProps } = props;
  const { visible, show, hide } = useToggle({ initialVisible: open });

  return (
    <>
      <Button label="Open Modal" onClick={show} />
      <AlertModal
        open={visible}
        onClose={hide}
        alternateButton={alternateButton && { ...alternateButton, onClick: hide }}
        {...otherProps}
      />
    </>
  );
};

export default meta;
type Story = StoryObj<typeof AlertModal>;

export const Primary: Story = {
  render: args => <AlertModalComponent {...args} />,
  parameters: {
    docs: {
      source: {
        transform: formatStoryTransform("AlertModal", ["open", "onClose", "alternateButton", "icon"], argsString => {
          return `
const { visible, show, hide } = useToggle();

return (
  <>
    <Button label="Open Modal" onClick={show} />
    <AlertModal
      open={visible}
      onClose={hide}
      icon={<MotifIcon name="info" size="xxl" />}
      alternateButton={{ text: "Close", onClick: hide }}
      ${argsString.split("\n  ").join("\n      ")}
    />
  </>
);`;
        }),
      },
    },
  },
};
