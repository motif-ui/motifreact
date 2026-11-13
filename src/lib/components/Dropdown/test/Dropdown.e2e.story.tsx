import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import Dropdown from "@/components/Dropdown";

// Scenes for the interaction and positioning tests in Dropdown.e2e.spec.ts. They are added to Storybook only in development, see .storybook/main.ts
const meta: Meta<typeof Dropdown> = {
  title: "E2E/Dropdown",
  component: Dropdown,
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  render: () => {
    const StoryComponent = () => {
      const [lastAction, setLastAction] = useState("");

      return (
        <div style={{ padding: 300 }}>
          <Dropdown
            label="Dropdown"
            items={[
              { label: "Item 1", action: () => setLastAction("item1") },
              { label: "Item 2", action: () => setLastAction("item2") },
              { label: "Disabled", disabled: true },
            ]}
          />
          <div data-testid="last-action">{lastAction}</div>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const NearTheBottomEdge: Story = {
  render: () => (
    <div style={{ paddingTop: 600, paddingLeft: 300 }}>
      <Dropdown label="Dropdown" items={[{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }]} />
    </div>
  ),
};

export const PageScroll: Story = {
  render: () => (
    <div style={{ height: 2000, paddingLeft: 300, paddingTop: 200 }}>
      <Dropdown label="Dropdown" items={[{ label: "Item 1" }, { label: "Item 2" }]} />
    </div>
  ),
};

export const ScrollingContainer: Story = {
  render: () => {
    const StoryComponent = () => (
      <div data-testid="scroller" style={{ overflow: "auto", width: "100%", height: 200, marginTop: 16, border: "1px solid" }}>
        <div style={{ width: 2000, height: 600, paddingLeft: 900, paddingTop: 40, boxSizing: "border-box" }}>
          <Dropdown label="Dropdown" items={[{ label: "Item 1" }, { label: "Item 2" }]} />
        </div>
      </div>
    );

    return <StoryComponent />;
  },
};
