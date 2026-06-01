import type { Meta, StoryObj } from "@storybook/nextjs";

import Avatar from "@/components/Avatar/Avatar";
import Accordion from "@/components/Accordion/Accordion";
import Badge from "@/components/Badge/Badge";
import BusinessCard from "@/components/BusinessCard/BusinessCard";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import Dropdown from "@/components/Dropdown/Dropdown";
import Link from "@/components/Link/Link";
import ListView from "@/components/ListView/ListView";
import Card from "@/components/Card/Card";
import Chip from "@/components/Chip/Chip";
import DataView from "@/components/DataView/DataView";
import IconButton from "@/components/IconButton/IconButton";
import InputPassword from "@/components/InputPassword/InputPassword";
import { iconObjects } from "../../../../../.storybook/utils.tsx";

const meta: Meta = {
  title: "Chromatic/GlobalIconWrapper",
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "padded" },
  decorators: [
    Story => (
      <div style={{ width: 250, display: "flex", flexDirection: "column", gap: 30 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const AccordionIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <Accordion title="String icon" key={"ac" + idx} icon={iconItem} />
      ))}
    </>
  ),
};

export const AvatarIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <Avatar variant="primary" size="xxl" key={"av" + idx} icon={iconItem} />
      ))}
    </>
  ),
};

export const BadgeIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <Badge variant="danger" align="bottom-right" key={"ba" + idx} icon={iconItem}>
          <button>btn</button>
        </Badge>
      ))}
    </>
  ),
};

export const BreadcrumbIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <Breadcrumb items={[{ label: "Products", path: "/" }, { label: "Current" }]} key={"bc" + idx} homeIcon={iconItem} />
      ))}
    </>
  ),
};

export const BusinessCardIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <BusinessCard variant="primary" title="Title" outline key={"buc" + idx} icon={iconItem} />
      ))}
    </>
  ),
};

export const ButtonIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <Button key={"btn" + idx} icon={iconItem} label="Button" variant="primary" />
      ))}
    </>
  ),
};

export const CardIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <Card
          key={"cdf" + idx}
          title="Full Card"
          icon={iconItem}
          action={{ icon: iconItem, onClick: () => {} }}
          contentActionLink={{ text: "Details", href: "#", icon: iconItem }}
          contentText="Card with all icon types"
        />
      ))}
    </>
  ),
};

export const ChipIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <Chip key={"ch" + idx} icon={iconItem} label="Chip" />
      ))}
    </>
  ),
};

export const DataViewIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <DataView key={"dv" + idx} cols={1}>
          <DataView.Item label="Data" value="Item" icon={iconItem} />
        </DataView>
      ))}
    </>
  ),
};

export const DropdownIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <Dropdown key={"dd" + idx} label="Dropdown" icon={iconItem} items={[{ label: "Item 1" }]} />
      ))}
    </>
  ),
};

export const IconButtonIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <IconButton key={"ib" + idx} name={iconItem} size="xxl" />
      ))}
    </>
  ),
};

export const InputPasswordIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <InputPassword key={"ip" + idx} icon={iconItem} toggleMask size="lg" />
      ))}
    </>
  ),
};

export const LinkIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <Link key={"lnk" + idx} url="#" icon={iconItem} label="Link" />
      ))}
    </>
  ),
};

export const ListViewIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <ListView key={"lv" + idx}>
          <ListView.Item title="Item" icon={iconItem} iconRight={iconItem} />
        </ListView>
      ))}
    </>
  ),
};
