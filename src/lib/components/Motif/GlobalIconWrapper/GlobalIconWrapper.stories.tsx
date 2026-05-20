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
import InputText from "@/components/InputText/InputText";
import MenuList from "@/components/MenuList/MenuList";
import NavBar from "@/components/NavBar/NavBar";
import Panel from "@/components/Panel/Panel";
import Select from "@/components/Select/Select";
import Stepper from "@/components/Stepper/Stepper";
import Tab from "@/components/Tab/Tab";
import Timeline from "@/components/Timeline/Timeline";
import Toast from "@/components/Toast/Toast";
import { iconObjects } from "../../../../../.storybook/utils.tsx";

const meta: Meta = {
  title: "Chromatic/GlobalIconWrapper",
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "padded" },
  decorators: [
    Story => (
      <div style={{ width: 450, display: "flex", flexDirection: "column", gap: 30 }}>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
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
        <InputPassword key={"ip" + idx} icon={iconItem} toggleMask size="lg" placeholder={`InputPassword ${idx + 1}`} />
      ))}
    </>
  ),
};

export const InputTextIcons: Story = {
  render: () => {
    const icons = Object.values(iconObjects);
    return (
      <>
        {icons.map((iconItem, idx) => (
          <InputText
            key={"it" + idx}
            iconLeft={iconItem}
            iconRight={icons[(idx + 1) % icons.length]}
            placeholder={`InputText ${idx + 1}`}
            size="lg"
          />
        ))}
      </>
    );
  },
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

export const MenuListIcons: Story = {
  render: () => {
    const items = Object.values(iconObjects).map((icon, idx) => ({ label: `Item ${idx + 1}`, icon }));
    return <MenuList items={items} />;
  },
};

export const NavBarIcons: Story = {
  render: () => {
    const mainMenu = {
      items: [
        { label: "Home", icon: "home" },
        { label: "Contact", icon: "mail" },
      ],
      subMenuDirection: "right" as const,
    };
    return (
      <>
        {Object.values(iconObjects).map((iconItem, idx) => (
          <NavBar
            key={"nb" + idx}
            button={{ label: "Login", icon: iconItem }}
            mainMenu={mainMenu}
            actionMenu={{
              items: [{ label: "User", icon: iconItem, items: [{ label: "Profile" }, { label: "Logout", icon: iconItem }] }],
              subMenuDirection: "left",
            }}
          />
        ))}
      </>
    );
  },
};

export const PanelIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <Panel key={"pl" + idx} titleIcon={iconItem} title="Panel" />
      ))}
    </>
  ),
};

export const SelectIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <Select key={"sel" + idx} icon={iconItem} data={[{ label: "Option", value: "option" }]} />
      ))}
    </>
  ),
};

export const StepperIcons: Story = {
  render: () => {
    const stepContent = Object.values(iconObjects).map((icon, idx) => ({ icon, idx }));
    return (
      <Stepper stepType="icon" activeStep={1}>
        {stepContent.map(step => (
          <Stepper.Item key={step.idx} title={`Step ${step.idx + 1}`} icon={step.icon}>
            Content
          </Stepper.Item>
        ))}
      </Stepper>
    );
  },
};

export const TabIcons: Story = {
  render: () => {
    const tabs = Object.values(iconObjects).map((icon, idx) => ({ id: `tab${idx}`, title: `Tab ${idx + 1}`, icon }));
    return (
      <Tab tabs={tabs}>
        {tabs.map(tab => (
          <Tab.Panel key={tab.id} id={tab.id} />
        ))}
      </Tab>
    );
  },
};

export const TimelineIcons: Story = {
  render: () => {
    const items = Object.values(iconObjects).map((icon, idx) => ({ title: `Timeline ${idx + 1}`, icon }));
    return <Timeline items={items} markerType="icon" />;
  },
};

export const ToastIcons: Story = {
  render: () => (
    <>
      {Object.values(iconObjects).map((iconItem, idx) => (
        <Toast
          key={"to" + idx}
          id={`toast-${idx}`}
          icon={iconItem}
          content="Toast message"
          variant="success"
          position="topRight"
          duration={3000}
          closable
          onDismiss={() => {}}
        />
      ))}
    </>
  ),
};
