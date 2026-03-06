import type { Meta, StoryObj } from "@storybook/nextjs";

import Panel from "@/components/Panel/Panel";
import Text from "@/components/Text";

const textLong =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const textShort =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const meta: Meta<typeof Panel> = {
  title: "Components/Panel",
  component: Panel,
  decorators: [
    Story => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    titleSize: { table: { defaultValue: { summary: "md" } } },
    type: { table: { defaultValue: { summary: "default" } } },
    children: { control: false },
  },
  args: {
    bordered: true,
    title: "Panel Title",
    titleIcon: "home",
    children: <Text text={textLong} />,
  },
};

export default meta;
type Story = StoryObj<typeof Panel>;

export const Primary: Story = {};

export const Sample: Story = {
  render: () => (
    <Panel type="elevated">
      <Panel.Title title="Panel Title" icon="home" />
      <Text text={textLong} />
      <Panel.Title title="Panel Title" size="sm" />
      <Text text={textShort} />
    </Panel>
  ),
};

export const Lean: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <Panel bordered lean="left" title="Left">
        <Text>{textShort}</Text>
      </Panel>
      <Panel bordered lean="bottom right" title="Bottom Right">
        <Text>{textShort}</Text>
      </Panel>
      <Panel bordered lean="all" title="All">
        <Text>{textShort}</Text>
      </Panel>
    </div>
  ),
};
