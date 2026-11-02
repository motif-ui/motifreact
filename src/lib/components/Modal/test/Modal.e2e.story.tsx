import type { Meta, StoryObj } from "@storybook/nextjs";
import { useRef, useState } from "react";
import Button from "@/components/Button";
import Popover from "@/components/Popover";
import Modal from "@/components/Modal";
import AlertModal from "@/components/AlertModal";

// Scenes for the dismiss and focus tests in Modal.e2e.spec.ts. They are added to Storybook only in development, see .storybook/main.ts
const meta: Meta<typeof Modal> = {
  title: "E2E/Modal",
  component: Modal,
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const WithOverlays: Story = {
  render: () => {
    const StoryComponent = () => {
      const anchorRef = useRef<HTMLButtonElement | null>(null);
      const [modalOpen, setModalOpen] = useState(false);
      const [alertOpen, setAlertOpen] = useState(false);

      return (
        <div style={{ padding: 8 }}>
          <Button label="Open modal" onClick={() => setModalOpen(true)} />
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} closable title="Modal">
            <p data-testid="text">A text to select in the modal</p>
            <Button label="Anchor" ref={anchorRef} />
            <Popover anchorRef={anchorRef} placeOn="bottom">
              <div style={{ padding: 12 }}>
                <Button label="In popover" />
              </div>
            </Popover>
            <Button label="Confirm" onClick={() => setAlertOpen(true)} />
          </Modal>
          <AlertModal
            open={alertOpen}
            onClose={() => setAlertOpen(false)}
            closable
            title="Sure?"
            alternateButton={{ text: "Cancel", onClick: () => setAlertOpen(false) }}
          />
        </div>
      );
    };

    return <StoryComponent />;
  },
};
