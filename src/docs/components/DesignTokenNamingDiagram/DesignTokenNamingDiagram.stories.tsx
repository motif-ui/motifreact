import type { Meta, StoryObj } from "@storybook/react";
import DesignTokenNamingDiagram from "./DesignTokenNamingDiagram";

const meta = {
  title: "_Hidden/DesignTokenNamingDiagram",
  component: DesignTokenNamingDiagram,
  tags: ["!autodocs", "!dev"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DesignTokenNamingDiagram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
