import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import ButtonGroup from "@/components/ButtonGroup";

// Scenes for the interaction and positioning tests in ButtonGroup.e2e.spec.ts. They are added to Storybook only in development, see .storybook/main.ts
const meta: Meta<typeof ButtonGroup> = {
  title: "E2E/ButtonGroup",
  component: ButtonGroup,
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

const Group = ({ onAction }: { onAction?: (action: string) => void }) => (
  <ButtonGroup>
    <ButtonGroup.Item label="Item" action={() => onAction?.("item")} />
    <ButtonGroup.Item label="Menu" action={() => onAction?.("menu")}>
      <ButtonGroup.Item label="Sub 1" action={() => onAction?.("sub1")} />
      <ButtonGroup.Item label="Sub 2" action={() => onAction?.("sub2")} />
      <ButtonGroup.Item label="Sub Disabled" disabled action={() => onAction?.("disabled")} />
    </ButtonGroup.Item>
  </ButtonGroup>
);

export const Default: Story = {
  render: () => {
    const StoryComponent = () => {
      const [lastAction, setLastAction] = useState("");

      return (
        <div style={{ padding: 300 }}>
          <Group onAction={setLastAction} />
          <div data-testid="last-action">{lastAction}</div>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const NearTheBottomEdge: Story = {
  render: () => (
    <div style={{ paddingTop: 620, paddingLeft: 300 }}>
      <Group />
    </div>
  ),
};

// The submenu is wider than the "Menu" button, so aligning it with the button's right edge would overflow the left of the screen
export const NearTheLeftEdge: Story = {
  render: () => (
    <div style={{ paddingTop: 40 }}>
      <ButtonGroup>
        <ButtonGroup.Item label="Menu">
          <ButtonGroup.Item label="Sub 1 with a long label" />
          <ButtonGroup.Item label="Sub 2 with an even longer label" />
        </ButtonGroup.Item>
        <ButtonGroup.Item label="Item" />
      </ButtonGroup>
    </div>
  ),
};

export const PageScroll: Story = {
  render: () => (
    <div style={{ height: 2000, paddingLeft: 300, paddingTop: 200 }}>
      <Group />
    </div>
  ),
};

export const ScrollingContainer: Story = {
  render: () => (
    <div data-testid="scroller" style={{ overflow: "auto", width: "100%", height: 200, marginTop: 16, border: "1px solid" }}>
      <div style={{ width: 2000, height: 600, paddingLeft: 900, paddingTop: 40, boxSizing: "border-box" }}>
        <Group />
      </div>
    </div>
  ),
};
