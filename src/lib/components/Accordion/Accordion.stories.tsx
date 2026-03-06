import type { Meta, StoryObj } from "@storybook/nextjs";
import Accordion from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  argTypes: {
    expanded: { table: { defaultValue: { summary: "false" } } },
  },
  args: {
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae fermentum arcu, vitae dignissim quam. Suspendisse eu nisi
        semper, congue augue tincidunt, porttitor dui. Nam at faucibus turpis, sed ullamcorper augue. Proin odio tortor, tincidunt et
        malesuada sed, dictum ultrices metus. Mauris commodo ut magna at imperdiet. Suspendisse tincidunt elementum vulputate. Sed rhoncus
        enim vel libero pretium dignissim. Mauris placerat egestas mauris et molestie. Suspendisse potenti. Pellentesque habitant morbi
        tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam erat volutpat. Etiam facilisis odio non lacinia iaculis.
        Maecenas nec felis eu mauris semper maximus vitae ac purus.`,
    title: "Accordion Title",
    icon: "person",
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Primary: Story = {};

export const AnyContent: Story = {
  render: args => (
    <div style={{ width: 300 }}>
      <Accordion {...args}>
        <img src="https://picsum.photos/400/200" alt="image" />
      </Accordion>
    </div>
  ),
};

// Group Stories

const groupItems = [
  <Accordion
    key="1"
    index={1}
    title="Accordion 1"
    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae fermentum arcu, vitae dignissim quam. Suspendisse eu nisi
          semper, congue augue tincidunt, porttitor dui. Nam at faucibus turpis, sed ullamcorper augue. Proin odio tortor, tincidunt et
          malesuada sed, dictum ultrices metus. Mauris commodo ut magna at imperdiet."
  />,
  <Accordion
    key="2"
    index={2}
    title="Accordion 2"
    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae fermentum arcu, vitae dignissim quam. Suspendisse eu nisi
          semper, congue augue tincidunt, porttitor dui."
  />,
  <Accordion
    key="3"
    index={3}
    title="Accordion 3"
    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae fermentum arcu, vitae dignissim quam. Suspendisse eu nisi
          semper, congue augue tincidunt, porttitor dui. Nam at faucibus turpis, sed ullamcorper augue."
  />,
];

export const Group: Story = {
  parameters: {
    docs: {
      description: {
        story: `\`\`AccordionGroup\`\` is used to provide grouping functionalities such as single expand at a time and 
        condensed mode. There must be at least two \`\`Accordion\`\` items inside and each one of them should have its 
        index prop set correctly.
          `,
      },
    },
  },
  render: () => (
    <div style={{ width: "300px" }}>
      <Accordion.Group>{groupItems}</Accordion.Group>
    </div>
  ),
};

export const GroupCondensed: Story = {
  render: () => (
    <div style={{ width: "300px" }}>
      <Accordion.Group condensed>{groupItems}</Accordion.Group>
    </div>
  ),
};

export const GroupMultiExpand: Story = {
  render: () => (
    <div style={{ width: "300px" }}>
      <Accordion.Group multiExpand>{groupItems}</Accordion.Group>
    </div>
  ),
};
