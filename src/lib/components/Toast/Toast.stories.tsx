import type { Meta, StoryObj } from "@storybook/nextjs";

import Toast from "./Toast";
import { useToast } from "@/components/Toast/useToast";
import Button from "@/components/Button";
import { ToastProps } from "@/components/Toast/types";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  argTypes: {
    id: { table: { disable: true } },
    onDismiss: { table: { disable: true } },
    position: { table: { defaultValue: { summary: "topRight" } }, type: { name: "string", required: false } },
    duration: { table: { defaultValue: { summary: "3000" } }, type: { name: "number", required: false } },
    closable: { table: { defaultValue: { summary: "true" } }, type: { name: "boolean", required: false } },
  },
  args: {
    variant: "warning",
    title: "Be Careful!",
    content: "This is a test warning",
    icon: "info",
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

const Toaster = (props: ToastProps) => {
  const toast = useToast();
  const { variant, content, ...rest } = props;

  return (
    <>
      <Button label="Show Toast" onClick={() => toast[variant](content, rest)} />
      {toast.toasts}
    </>
  );
};

// Renders synchronously with no button/hook involved, so Chromatic (and docs) get a stable,
// deterministic layout instead of racing a button click or an auto-dismiss timer. duration is kept
// at 24h (rather than the real 3s default) so the progress bar renders while the auto-dismiss timer
// never actually fires — the close icon stays visible no matter when the snapshot is taken.
export const Primary: Story = {
  args: {
    id: "toast-primary",
    position: "topRight",
    duration: 24 * 60 * 60 * 1000,
    closable: true,
    onDismiss: () => {},
  },
  render: args => <Toast {...args} />,
};

export const Interactive: Story = {
  tags: ["!test"],
  render: args => <Toaster {...args} />,
};
