import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import Select from "@/components/Select";
import type { SelectItem } from "@/components/Select/types";

// Scenes for the interaction and positioning tests in Select.e2e.spec.ts. They are added to Storybook only in development, see .storybook/main.ts
const meta: Meta<typeof Select> = {
  title: "E2E/Select",
  component: Select,
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Select>;

const data = [
  { label: "Item 1", value: "item1" },
  { label: "Item 2", value: "item2" },
  { label: "Item 3", value: "item3" },
];

export const Default: Story = {
  render: () => {
    const StoryComponent = () => {
      const [selected, setSelected] = useState("");

      return (
        <div style={{ padding: 300, width: 300 }}>
          <Select data={data} onChange={item => setSelected((item as SelectItem | undefined)?.value ?? "")} />
          <div data-testid="selected">{selected}</div>
        </div>
      );
    };

    return <StoryComponent />;
  },
};

export const Multiple: Story = {
  render: () => (
    <div style={{ padding: 300, width: 300 }}>
      <Select data={data} multiple />
    </div>
  ),
};

export const NearTheBottomEdge: Story = {
  render: () => (
    <div style={{ paddingTop: 600, paddingLeft: 300, width: 300 }}>
      <Select data={data} />
    </div>
  ),
};

export const PageScroll: Story = {
  render: () => (
    <div style={{ height: 2000, paddingLeft: 300, paddingTop: 200, width: 300 }}>
      <Select data={data} />
    </div>
  ),
};

export const ScrollingContainer: Story = {
  render: () => (
    <div data-testid="scroller" style={{ overflow: "auto", width: "100%", height: 200, marginTop: 16, border: "1px solid" }}>
      <div style={{ width: 2000, height: 600, paddingLeft: 900, paddingTop: 40, boxSizing: "border-box" }}>
        <div style={{ width: 300 }}>
          <Select data={data} />
        </div>
      </div>
    </div>
  ),
};
