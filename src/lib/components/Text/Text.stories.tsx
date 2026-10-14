import type { Meta, StoryObj } from "@storybook/nextjs";

import Text from "@/components/Text";
import { Size5 } from "src/lib/types";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  argTypes: {
    type: { table: { defaultValue: { summary: "body" } } },
    size: { table: { defaultValue: { summary: "md" } } },
  },
  args: {
    text: "Test Content",
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Primary: Story = {};

const types = ["body", "caption", "paragraph", "heading", "display"] as const;
const sizes: Size5[] = ["xs", "sm", "md", "lg", "xl"];

export const Preview: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {types.map(type => (
        <div key={type} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sizes.map(size => (
            <Text key={size} type={type} size={size} text={`${type} ${size} - Lorem ipsum dolor sit amet.`} />
          ))}
        </div>
      ))}
    </div>
  ),
};
