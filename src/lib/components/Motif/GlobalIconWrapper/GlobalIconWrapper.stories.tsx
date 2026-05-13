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

const meta: Meta = {
  title: "Chromatic/GlobalIconWrapper",
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "padded" },
  decorators: [
    Story => (
      <div style={{ width: 250, display: "flex", flexDirection: "column", gap: 30 }}>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj;

const BrightnessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708" />
  </svg>
);

const breadcrumbItems = [{ label: "Products", path: "/" }, { label: "Current" }];

const iconItems = [
  "folder",
  <i className="bi bi-amazon" key="1" />,
  <span className="material-symbols-outlined" key="2">
    android
  </span>,
  <BrightnessIcon key="3" />,
];

export const AccordionIcons: Story = {
  render: () => (
    <>
      {iconItems.map((iconItem, idx) => (
        <Accordion title="String icon" key={"ac" + idx} icon={iconItem} />
      ))}
    </>
  ),
};

export const AvatarIcons: Story = {
  render: () => (
    <>
      {iconItems.map((iconItem, idx) => (
        <Avatar variant="primary" size="xxl" key={"av" + idx} icon={iconItem} />
      ))}
    </>
  ),
};

export const BadgeIcons: Story = {
  render: () => (
    <>
      {iconItems.map((iconItem, idx) => (
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
      {iconItems.map((iconItem, idx) => (
        <Breadcrumb items={breadcrumbItems} key={"bc" + idx} homeIcon={iconItem} />
      ))}
    </>
  ),
};

export const BusinessCardIcons: Story = {
  render: () => (
    <>
      {iconItems.map((iconItem, idx) => (
        <BusinessCard variant="primary" title="Title" outline key={"buc" + idx} icon={iconItem} />
      ))}
    </>
  ),
};

export const ButtonIcons: Story = {
  render: () => (
    <>
      {iconItems.map((iconItem, idx) => (
        <Button key={"btn" + idx} icon={iconItem} label="Button" variant="primary" />
      ))}
    </>
  ),
};

export const CardIcons: Story = {
  render: () => (
    <>
      {iconItems.map((iconItem, idx) => (
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
      {iconItems.map((iconItem, idx) => (
        <Chip key={"ch" + idx} icon={iconItem} label="Chip" />
      ))}
    </>
  ),
};

export const DataViewIcons: Story = {
  render: () => (
    <>
      {iconItems.map((iconItem, idx) => (
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
      {iconItems.map((iconItem, idx) => (
        <Dropdown key={"dd" + idx} label="Dropdown" icon={iconItem} items={[{ label: "Item 1" }]} />
      ))}
    </>
  ),
};

export const IconButtonIcons: Story = {
  render: () => (
    <>
      {iconItems.map((iconItem, idx) => (
        <IconButton key={"ib" + idx} name={iconItem} size="xxl" />
      ))}
    </>
  ),
};

export const InputPasswordIcons: Story = {
  render: () => (
    <>
      {iconItems.map((iconItem, idx) => (
        <InputPassword key={"ip" + idx} icon={iconItem} toggleMask size="lg" />
      ))}
    </>
  ),
};

export const LinkIcons: Story = {
  render: () => (
    <>
      {iconItems.map((iconItem, idx) => (
        <Link key={"lnk" + idx} url="#" icon={iconItem} label="Link" />
      ))}
    </>
  ),
};

export const ListViewIcons: Story = {
  render: () => (
    <>
      {iconItems.map((iconItem, idx) => (
        <ListView key={"lv" + idx}>
          <ListView.Item title="Item" icon={iconItem} />
        </ListView>
      ))}
    </>
  ),
};
