import type { Meta, StoryObj } from "@storybook/nextjs";

import AlertModal from "./AlertModal";
import { AlertModalProps } from "./types";
import Button from "../Button/Button";
import MotifIcon from "../Motif/Icon/MotifIcon";
import useToggle from "../../hooks/useToggle";
import { formatStoryTransform } from "../../../utils/docUtils";

const meta: Meta<typeof AlertModal> = {
  title: "Components/AlertModal",
  component: AlertModal,
  argTypes: {
    open: { control: false },
    contentPosition: { table: { defaultValue: { summary: "center" } } },
    buttonsPosition: { table: { defaultValue: { summary: "center" } } },
    size: { table: { defaultValue: { summary: "md" } } },
  },
  args: {
    title: "Are you sure you want to confirm this action?",
    text: "This action cannot be undone. Are you sure you want to proceed?",
    contentPosition: "center",
    buttonsPosition: "center",
  },
};

const AlertModalComponent = (props: AlertModalProps) => {
  const { open, ...otherProps } = props;
  const { visible, show, hide } = useToggle(open);

  return (
    <>
      <Button label="Open Modal" onClick={show} />
      <AlertModal
        open={visible}
        onClose={hide}
        icon={<MotifIcon name="info" size="xl2" />}
        actionButton={{ text: "Confirm", onClick: () => alert("Action clicked!") }}
        alternateButton={{ text: "Close", onClick: hide }}
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
        transform: formatStoryTransform("AlertModal", ["open", "onClose", "actionButton", "alternateButton"], argsString => {
          return `
const { visible, show, hide } = useToggle(false);

return (
  <>
    <Button label="Open Modal" onClick={show} />
    <AlertModal
      open={visible}
      onClose={hide}
      icon={<MotifIcon name="info" size="xl2" />}
      actionButton={{ text: "Confirm", onClick: () => alert("Action clicked!") }}
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
