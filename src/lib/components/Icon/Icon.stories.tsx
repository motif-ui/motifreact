import type { Meta, StoryObj } from "@storybook/nextjs";
import Icon from "../Icon/Icon";
import { motifIconNames } from "./motif-icon-names";
import { MOTIF_ICONS_DEFAULT_CLASS } from "../../constants";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  argTypes: {
    iconClass: { table: { defaultValue: { summary: MOTIF_ICONS_DEFAULT_CLASS } } },
    size: { table: { defaultValue: { summary: "md" } } },
  },
  args: {
    size: "xxl",
  },
  parameters: {
    docs: {
      description: {
        component:
          "This component is designed to use any icon set around. We provide a font icon family to test here or in your project, right out of the box. This font family is a very small subset of the icons derived from <a href='https://fonts.google.com/icons' target='_blank'>Google Font Icons</a> and served from our servers. More detail about the usage of this icon set and external icons is stated below.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Primary: Story = {
  args: {
    name: "motif_ui",
  },
  render: args => (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/motif-ui/assets/css/motif-icons.css" />
      <Icon {...args} />
    </>
  ),
};

export const DefaultIcons: Story = {
  render: () => (
    <>
      {motifIconNames.map(icon => (
        <div
          key={icon}
          style={{
            display: "inline-flex",
            alignItems: "center",
            border: "solid 1px #DDD",
            borderRadius: 4,
            margin: 4,
            padding: 4,
          }}
        >
          <Icon name={icon} variant="secondary" size="xs" />
          <span style={{ fontSize: 10, color: "#555", marginLeft: 2 }}>{icon}</span>
        </div>
      ))}
    </>
  ),
};

export const ExternalFontIcons: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
//...
<Icon iconClass="material-icons" name="android" size="xxl" />
        `,
      },
    },
  },
  args: {
    iconClass: "material-icons",
    name: "android",
  },
  render: args => (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <Icon {...args} />
    </>
  ),
};

export const SvgUsage: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
<Icon svgColorType="fill" color="purple">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
    <path d="M480-720q-33 0-56.5-23.5T400-800q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800q0 33-23.5 56.5T480-720ZM360-80v-520H120v-80h720v80H600v520h-80v-240h-80v240h-80Z"/>
  </svg>
</Icon>
        `,
      },
    },
  },
  args: {
    svgColorType: "fill",
    color: "purple",
    children: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path d="M480-720q-33 0-56.5-23.5T400-800q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800q0 33-23.5 56.5T480-720ZM360-80v-520H120v-80h720v80H600v520h-80v-240h-80v240h-80Z" />
      </svg>
    ),
  },
  render: args => <Icon {...args} />,
};

export const AnyExternalIcon: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
//...
<Icon color="green">
  <i class="material-icons">android</i>
</Icon>
        `,
      },
    },
  },
  args: {
    children: <i className="material-icons">android</i>,
    color: "green",
  },
  render: args => (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <Icon {...args} />
    </>
  ),
};
