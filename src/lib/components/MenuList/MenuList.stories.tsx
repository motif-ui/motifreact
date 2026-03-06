import type { Meta, StoryObj } from "@storybook/nextjs";

import MenuList from "@/components/MenuList/MenuList";
import { useState } from "react";
import Button from "@/components/Button";
import { MenuListProps } from "@/components/MenuList/types";

const meta: Meta<typeof MenuList> = {
  title: "Components/MenuList",
  component: MenuList,
  decorators: [
    Story => (
      <div style={{ width: 320, display: "flex", alignItems: "flex-start" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: { table: { defaultValue: { summary: "solid" } } },
  },
  args: {
    items: [
      { label: "Home", icon: "home", href: "/", active: true },
      { label: "About", icon: "info", disabled: true },
      {
        label: "Contact",
        icon: "person",
        targetBlank: true,
        href: "https://motif-ui.com/",
        chip: { label: "New", variant: "success" },
      },
      {
        label: "SubMenu",
        icon: "folder",
        items: [
          { label: "SubMenu 1", href: "#" },
          {
            label: "SubMenu 2 Nested",
            items: [
              { label: "Nested 1", href: "#" },
              {
                label: "Nested Again",
                items: [
                  { label: "Leaf", href: "#" },
                  { label: "Leaf 2", href: "#" },
                ],
              },
            ],
          },
          { label: "SubMenu 2", href: "#" },
        ],
      },
    ],
    logo: "https://cdn.e-devlet.gov.tr/downloads/kurumsal-kimlik/logo/e-devlet-logo.png",
    footerText: "© 2024 All rights reserved.",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof MenuList>;

export const Primary: Story = {};

const ControlledTemplate = (args: MenuListProps) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div>
      <Button label="Toggle MenuList" onClick={() => setCollapsed(c => !c)} style={{ marginBottom: 16 }} />
      <MenuList {...args} collapsed={collapsed} onCollapsedChange={setCollapsed} />
    </div>
  );
};

export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
const [collapsed, setCollapsed] = useState(false);
return (
  <div>
    <Button label="Toggle MenuList" onClick={() => setCollapsed(c => !c)} />
    <MenuList items={items} collapsed={collapsed} onCollapsedChange={setCollapsed} />
  </div>
);
        `,
      },
    },
  },
  render: args => <ControlledTemplate {...args} />,
};

export const Uncontrolled: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `<MenuList items={items} defaultCollapsed enableCollapseButton />`,
      },
    },
  },
  render: args => <MenuList {...args} defaultCollapsed enableCollapseButton />,
};
