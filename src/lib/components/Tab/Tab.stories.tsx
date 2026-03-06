import type { Meta, StoryObj } from "@storybook/nextjs";

import Tab from "./Tab";
const meta: Meta<typeof Tab> = {
  title: "Components/Tab",
  parameters: {
    docs: {
      description: {
        component:
          "``<Tab>`` consists of decoupled header and panel parts. In order to link a tab item and a ``<Tab.Panel>`` component, they need to have the same id prop.",
      },
    },
  },
  component: Tab,
  argTypes: {
    type: { table: { defaultValue: { summary: "underline" } } },
    position: { table: { defaultValue: { summary: "fill" } } },
  },
  args: {
    defaultTabId: "motif_ui",
    tabs: [
      { title: "Tab 1", icon: "home", id: "home" },
      { title: "Tab 2", icon: "person", id: "person", disabled: true },
      { title: "Tab 3", icon: "motif_ui", id: "motif_ui" },
      { title: "Tab 4", icon: "feed", id: "feed" },
    ],
  },
};

const dummyText =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

export default meta;
type Story = StoryObj<typeof Tab>;

export const Primary: Story = {
  render: args => (
    <Tab {...args}>
      <Tab.Panel id="home">
        <div style={{ display: "flex" }}>
          <img src="https://picsum.photos/150" alt="tab panel home imade" />
          <p style={{ marginLeft: 15 }}>{dummyText}</p>
        </div>
      </Tab.Panel>
      <Tab.Panel id="motif_ui">
        <div style={{ display: "flex" }}>
          <p style={{ marginRight: 15 }}>{dummyText}</p>
          <img src="https://picsum.photos/150" alt="tab panel 3 image" />
        </div>
      </Tab.Panel>
      <Tab.Panel id="feed">
        <div>
          <p style={{ marginRight: 15, textAlign: "justify" }}>{dummyText}</p>
        </div>
      </Tab.Panel>
    </Tab>
  ),
};
