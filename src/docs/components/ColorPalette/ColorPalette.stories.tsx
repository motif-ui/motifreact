import type { Meta, StoryObj } from "@storybook/nextjs";
import { ColorPalettePage } from "./ColorPalettePage";
import Button from "../../../lib/components/Button/Button";

const meta: Meta<typeof ColorPalettePage> = {
  title: "_Hidden/ColorPalette",
  component: ColorPalettePage,
  tags: ["!autodocs", "!dev"],
};

export default meta;
type Story = StoryObj<typeof ColorPalettePage>;

export const Primary: Story = {};

export const Solid: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Button label="Primary" variant="primary" />
      <Button label="Disabled" variant="primary" disabled />
    </div>
  ),
};

export const Outline: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Button label="Primary" variant="primary" shape="outline" />
      <Button label="Disabled" variant="primary" shape="outline" disabled />
    </div>
  ),
};
