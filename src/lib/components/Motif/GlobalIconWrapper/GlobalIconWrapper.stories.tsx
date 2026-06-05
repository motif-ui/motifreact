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
  //tags: ["!autodocs", "!dev"],
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

const iconTypes = Object.values(iconObjects);

export const AccordionIcons: Story = {
  render: () => (
    <>
      {iconTypes.map((iconItem, idx) => (
        <Accordion title="String icon" key={"ac" + idx} icon={iconItem} />
      ))}
    </>
  ),
};

export const AvatarIcons: Story = {
  render: () => (
    <>
      {iconTypes.map((iconItem, idx) => (
        <Avatar variant="primary" size="xxl" key={"av" + idx} icon={iconItem} />
      ))}
    </>
  ),
};

export const BadgeIcons: Story = {
  render: () => (
    <>
      {iconTypes.map((iconItem, idx) => (
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
      {iconTypes.map((iconItem, idx) => (
        <Breadcrumb items={[{ label: "Products", path: "/" }, { label: "Current" }]} key={"bc" + idx} homeIcon={iconItem} />
      ))}
    </>
  ),
};

export const BusinessCardIcons: Story = {
  render: () => (
    <>
      {iconTypes.map((iconItem, idx) => (
        <BusinessCard variant="primary" title="Title" outline key={"buc" + idx} icon={iconItem} />
      ))}
    </>
  ),
};

export const ButtonIcons: Story = {
  render: () => (
    <>
      {iconTypes.map((iconItem, idx) => (
        <Button key={"btn" + idx} icon={iconItem} label="Button" variant="primary" />
      ))}
    </>
  ),
};

export const CardIcons: Story = {
  render: () => (
    <>
      {iconTypes.map((iconItem, idx) => (
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
      {iconTypes.map((iconItem, idx) => (
        <Chip key={"ch" + idx} icon={iconItem} label="Chip" />
      ))}
    </>
  ),
};

export const DataViewIcons: Story = {
  render: () => (
    <>
      {iconTypes.map((iconItem, idx) => (
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
      {iconTypes.map((iconItem, idx) => (
        <Dropdown key={"dd" + idx} label="Dropdown" icon={iconItem} items={[{ label: "Item 1" }]} />
      ))}
    </>
  ),
};

export const IconButtonIcons: Story = {
  render: () => (
    <>
      {iconTypes.map((iconItem, idx) => (
        <IconButton key={"ib" + idx} name={iconItem} size="xxl" />
      ))}
    </>
  ),
};

export const InputPasswordIcons: Story = {
  render: () => (
    <>
      {iconTypes.map((iconItem, idx) => (
        <InputPassword key={"ip" + idx} icon={iconItem} placeholder="Placeholder" toggleMask size="lg" />
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
          <InputText key={"it" + idx} placeholder="Placeholder" iconLeft={iconItem} iconRight={icons[(idx + 1) % icons.length]} size="lg" />
        ))}
      </>
    );
  },
};

export const LinkIcons: Story = {
  render: () => (
    <>
      {iconTypes.map((iconItem, idx) => (
        <Link key={"lnk" + idx} url="#" icon={iconItem} label="Link" iconPosition="left" />
      ))}
    </>
  ),
};

export const ListViewIcons: Story = {
  render: () => (
    <>
      {iconTypes.map((iconItem, idx) => (
        <ListView key={"lv" + idx}>
          <ListView.Item title="List Item" icon={iconItem} iconRight={iconItem} />
        </ListView>
      ))}
    </>
  ),
};

export const MenuListIcons: Story = {
  render: () => <MenuList items={iconTypes.map(icon => ({ label: "Item", icon }))} />,
};

export const NavBarIcons: Story = {
  render: () => (
    <>
      {iconTypes.map((iconItem, idx) => (
        <NavBar
          style={{ width: 1100 }}
          key={"nb" + idx}
          button={{ label: "Login", icon: iconItem }}
          mainMenu={{ items: [{ label: "Home", icon: iconItem }] }}
          actionMenu={{ items: [{ label: "User", icon: iconItem }] }}
        />
      ))}
    </>
  ),
};

export const PanelIcons: Story = {
  render: () => (
    <>
      {iconTypes.map((iconItem, idx) => (
        <Panel key={"pl" + idx} titleIcon={iconItem} title="Panel" titleSize="lg">
          <Panel.Title title="Another Title" icon={iconItem} size="lg" />
        </Panel>
      ))}
    </>
  ),
};

export const SelectIcons: Story = {
  render: () => (
    <>
      {iconTypes.map((iconItem, idx) => (
        <Select key={"sel" + idx} icon={iconItem} data={[{ label: "", value: "option" }]} />
      ))}
    </>
  ),
};

export const StepperIcons: Story = {
  render: () => {
    const stepContent = iconTypes.map((icon, idx) => ({ icon, idx }));
    return (
      <Stepper stepType="icon">
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
  render: () => <Tab tabs={iconTypes.map((icon, idx) => ({ id: `tab${idx}`, title: `Tab ${idx + 1}`, icon }))} style={{ width: 500 }} />,
};

export const TimelineIcons: Story = {
  render: () => <Timeline items={iconTypes.map((icon, idx) => ({ title: `Timeline ${idx + 1}`, icon }))} markerType="icon" />,
};

export const ToastIcons: Story = {
  render: () => (
    <>
      {iconTypes.map((iconItem, idx) => (
        <Toast
          key={"to" + idx}
          id={`toast-${idx}`}
          icon={iconItem}
          title="Toast"
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
