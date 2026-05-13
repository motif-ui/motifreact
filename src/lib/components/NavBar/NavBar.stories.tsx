import type { Meta, StoryObj } from "@storybook/nextjs";
import NavBar from "./NavBar";
import { NavBarProps } from "@/components/NavBar/types";
import { formatStoryTransform } from "../../../utils/docUtils";
import { LOGO_URL } from "../../../utils/constants";
import { useState } from "react";

const argValues: NavBarProps = {
  logo: {
    href: "https://motif-ui.com/",
    imgPath: LOGO_URL,
  },
  button: { label: "Login", icon: "person" },
  mainMenu: {
    items: [
      { label: "Home", icon: "home" },
      { label: "Contact", icon: "mail", items: [{ label: "Email" }, { label: "Phone" }] },
    ],
    subMenuDirection: "right",
  },
  search: {
    onButtonClick: () => alert("Check 'NavBar/Search' menu on the left for more detail!"),
    onPressEnter: () => alert("Check 'NavBar/Search' menu on the left for more detail!"),
    results: [],
  },
  actionMenu: {
    items: [{ label: "User", icon: "person", items: [{ label: "Profile" }, { label: "Logout", icon: "close" }] }],
    subMenuDirection: "left",
  },
};

const meta: Meta<typeof NavBar> = {
  title: "Components/NavBar",
  component: NavBar,
  decorators: [
    Story => (
      <div style={{ height: 150, width: 950 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: { table: { defaultValue: { summary: "neutral" } } },
    mainMenu: {
      control: { type: "boolean" },
      mapping: { false: undefined, true: argValues.mainMenu },
      table: { type: { summary: undefined } },
    },
    logo: {
      control: { type: "boolean" },
      mapping: { false: undefined, true: argValues.logo },
      table: { type: { summary: undefined } },
    },
    button: {
      control: { type: "boolean" },
      mapping: { false: undefined, true: argValues.button },
    },
    search: {
      control: { type: "boolean" },
      mapping: { false: undefined, true: argValues.search },
      table: { type: { summary: undefined } },
    },
    actionMenu: {
      control: { type: "boolean" },
      mapping: { false: undefined, true: argValues.actionMenu },
      table: { type: { summary: undefined } },
    },
  },
  args: {
    logo: argValues.logo,
    mainMenu: argValues.mainMenu,
    actionMenu: argValues.actionMenu,
    search: argValues.search,
  },
};

export default meta;
type Story = StoryObj<typeof NavBar>;

export const Primary: Story = {
  parameters: {
    docs: {
      source: {
        transform: formatStoryTransform("NavBar", ["children"]),
      },
    },
  },
};

export const Search: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
const [results, setResults] = useState<{ text: string; value?: string }[]>([]);
const [searching, setSearching] = useState(false);

const doSearch = (query: string) => {
  setSearching(true);
  DUMMY_API_CALL().then(res => {
    setResults(res.data);
    setSearching(false);
  });
};

return (
  <NavBar
    {...args}
    search={{
      onPressEnter: doSearch,
      onButtonClick: doSearch,
      onResultClick: result => alert("Clicked: " + result),
      results,
      searching,
    }}
  />
);      
  `,
      },
    },
  },
  render: args => {
    const SearchComponent = () => {
      const [results, setResults] = useState<{ text: string; value?: string }[]>([]);
      const [searching, setSearching] = useState(false);
      const cities = ["Ankara", "İstanbul", "Antalya", "İzmir", "Konya", "Trabzon", "Manisa", "Hatay", "Van"];

      const doSearch = (query: string) => {
        setSearching(true);
        setTimeout(() => {
          setResults(query ? cities.map(c => ({ text: c + " " + query, value: c })) : []);
          setSearching(false);
        }, 700);
      };

      return (
        <NavBar
          {...args}
          search={{
            onPressEnter: doSearch,
            onButtonClick: doSearch,
            onResultClick: result => alert("Clicked: " + result),
            results,
            searching,
          }}
        />
      );
    };
    return <SearchComponent />;
  },
};
