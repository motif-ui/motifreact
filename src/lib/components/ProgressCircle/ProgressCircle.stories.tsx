import type { Meta, StoryObj } from "@storybook/nextjs";

import ProgressCircle from "./ProgressCircle";
import { useEffect, useState } from "react";

const meta: Meta<typeof ProgressCircle> = {
  title: "Components/ProgressCircle",
  component: ProgressCircle,
  parameters: {
    docs: {
      description: {
        component: `
* Due to font size limitations in **ProgressCircle**, \`showPercentage\` prop is only available for sizes **lg** and **xl**.
* \`interminate\` prop always takes precedence over \`showPercentage\` prop.
* When \`countdown\` prop is given, \`showPercentage\` prop becomes inactive and **percentage text** is not shown.
        `.trim(),
      },
    },
  },
  argTypes: {
    size: { table: { defaultValue: { summary: "sm" } } },
    variant: { table: { defaultValue: { summary: "primary" } } },
    progress: { table: { defaultValue: { summary: "0" } } },
    maxProgress: { table: { defaultValue: { summary: "100" } } },
  },
  args: {
    progress: 65,
  },
};

export default meta;
type Story = StoryObj<typeof ProgressCircle>;

export const Primary: Story = {
  render: args => (
    <div style={{ width: 300, textAlign: "center" }}>
      <ProgressCircle {...args} />
    </div>
  ),
};

const ProgressWithTimer = () => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress < 100) {
        setProgress(prev => prev + 10);
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [progress]);

  return <ProgressCircle size="xl" progress={progress} showPercentage />;
};

export const RealExample: Story = {
  render: () => <ProgressWithTimer />,
};
