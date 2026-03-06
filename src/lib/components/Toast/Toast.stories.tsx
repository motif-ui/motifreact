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

export const Primary: Story = {
  render: args => {
    return <Toaster {...args} />;
  },
};
