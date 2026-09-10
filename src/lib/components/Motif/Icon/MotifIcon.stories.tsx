import type { Meta, StoryObj } from "@storybook/nextjs";
import iconMoon from "./assets/motif-default-icons.json" with { type: "json" };
import MotifIcon from "@/components/Motif/Icon/MotifIcon";

const meta: Meta = {
  title: "Chromatic/MotifIcon",
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

export const Icons: Story = {
  render: () => (
    <div style={{ width: 440, display: "flex", flexWrap: "wrap", gap: 10 }}>
      {iconMoon.glyphs.flatMap(icon => icon.extras.ligatures.map(name => <MotifIcon key={name} size="xxl" name={name} />))}
    </div>
  ),
};
