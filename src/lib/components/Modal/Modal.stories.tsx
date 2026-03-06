import type { Meta, StoryObj } from "@storybook/nextjs";

import Modal from "./Modal";
import { ModalProps } from "./types";
import Button from "../Button/Button";
import useToggle from "../../hooks/useToggle";
import { formatStoryTransform } from "../../../utils/docUtils";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  argTypes: {
    children: { control: false },
    open: { control: false },
    alternateButton: { control: false },
    size: { table: { defaultValue: { summary: "md" } } },
  },
  args: {
    title: "Modal Title",
    subtitle: "Modal Subtitle",
    closable: true,
    children: (
      <div>
        <h4>MODAL</h4>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text
          ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived
          not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the
          1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of Lorem Ipsum
        </p>
      </div>
    ),
    actionButton: { text: "Action", onClick: () => alert("Action clicked!") },
  },
};

const ModalComponent = (props: ModalProps) => {
  const { open, ...otherProps } = props;
  const { visible, show, hide } = useToggle(open);

  return (
    <>
      <Button label="Modal Aç" onClick={show} />
      <Modal open={visible} onClose={hide} alternateButton={{ text: "Close", onClick: hide }} {...otherProps} />
    </>
  );
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Primary: Story = {
  render: args => <ModalComponent {...args} />,
  parameters: {
    docs: {
      source: {
        transform: formatStoryTransform("Modal", ["children", "open", "onClose", "alternateButton"], argsString => {
          return `
const { visible, show, hide } = useToggle(false);

return (
  <>
    <Button label="Modal Aç" onClick={show} />
    <Modal
      open={visible}
      onClose={hide}
      alternateButton={{ text: "Close", onClick: hide }}
      ${argsString.split("\n  ").join("\n      ")}
    >
      <h4>MODAL</h4>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived
        not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the
        1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
        Aldus PageMaker including versions of Lorem Ipsum
      </p>
    </Modal>
  </>
);`;
        }),
      },
    },
  },
};
