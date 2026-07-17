import { fireEvent, render } from "@testing-library/react";
import NavBar from "./NavBar";
import { runIconPropTest } from "../../../utils/testUtils";
import { MenuItemProps } from "@/components/NavBar/components/NavBarMenu/types";
import { userEvent } from "@testing-library/user-event";
import { Size3 } from "src/lib/types.ts";

export const items: MenuItemProps[] = [
  { label: "Home", icon: "home", href: "https://motif-ui.com/", active: true },
  {
    label: "Services",
    icon: "person",
    items: [
      { label: "Basic", icon: "blind", href: "https://motif-ui.com/", target: "_blank" },
      { label: "Middle Tier" },
      {
        label: "Premium",
        items: [
          {
            label: "Email Services",
            icon: "home",
            items: [
              { label: "< 10000 Emails", onClick: () => alert("< 10000 Emails") },
              { label: "> 10000 Emails", onClick: () => alert("> 10000 Emails") },
            ],
          },
          {
            label: "Social Media Related",
            items: [{ label: "Youtube Videos", onClick: () => alert("Youtube Videos") }, { label: "Other Services" }],
          },
        ],
      },
    ],
  },
  { label: "Contact", onClick: () => alert("Contact") },
];

describe("NavBar", () => {
  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { container } = render(<NavBar />);
    expect(container).toMatchSnapshot();

    // variant default: "neutral"
    expect(container.firstChild).toHaveClass("neutral");
  });

  it("should be rendered in the color variant given in the variant prop", () => {
    const variants = ["neutral", "primary", "secondary", "info", "success", "warning", "danger"] as const;
    variants.forEach(variant => {
      const { container, unmount } = render(<NavBar variant={variant} />);
      expect(container.firstChild).toHaveClass(variant);
      unmount();
    });
  });

  it("should be rendered as elevated when elevated prop is true", () => {
    const { getByRole } = render(<NavBar elevated />);
    expect(getByRole("navigation")).toHaveClass("elevated");
  });

  it("should render a text input as a search area when search prop is given", () => {
    const { getByRole, getByPlaceholderText } = render(<NavBar search={{ placeholder: "Search..." }} />);
    expect(getByRole("textbox")).toBeInTheDocument();
    expect(getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("should render the search box in a pill shape when pill is true in the search prop", () => {
    const { getByRole } = render(<NavBar search={{ pill: true }} />);
    expect(getByRole("textbox").parentElement?.parentElement).toHaveClass("pill");
  });

  it("should fire onPressEnter in search props with typed query when 'enter' key is pressed", async () => {
    const mockActionSubmit = jest.fn();
    const { getByRole } = render(<NavBar search={{ onPressEnter: mockActionSubmit }} />);
    const searchInput = getByRole("textbox");
    await userEvent.type(searchInput, "test query");
    fireEvent.keyUp(searchInput, { key: "Enter", code: "Enter" });
    expect(mockActionSubmit).toHaveBeenCalledWith("test query");
  });

  it("should fire onButtonClick in search props with typed query when search button is clicked", async () => {
    const mockActionSubmit = jest.fn();
    const { getByRole, getByText } = render(<NavBar search={{ onButtonClick: mockActionSubmit }} />);
    await userEvent.type(getByRole("textbox"), "test query");
    const searchButton = getByText("search");
    fireEvent.click(searchButton);
    expect(mockActionSubmit).toHaveBeenCalledWith("test query");
  });

  it("should render the search results in a dropdown when results prop is given in search props", () => {
    const { getByText } = render(<NavBar search={{ results: [{ text: "Result 1" }, { text: "Result 2" }] }} />);
    expect(getByText("Result 1")).toBeInTheDocument();
    expect(getByText("Result 2")).toBeInTheDocument();
  });

  it("should fire onResultClick with the clicked result item value when a search result is clicked", () => {
    const mockOnResultClick = jest.fn();
    const { getByText } = render(
      <NavBar
        search={{
          results: [{ text: "Result 1", value: "val 1" }],
          onResultClick: mockOnResultClick,
        }}
      />,
    );
    fireEvent.click(getByText("Result 1"));
    expect(mockOnResultClick).toHaveBeenCalledWith("val 1");
  });

  it("should disable the search input and show a loader instead of search button when searching is true in search props", () => {
    const { getByRole, queryByText } = render(<NavBar search={{ searching: true }} />);
    expect(getByRole("textbox")).toBeDisabled();
    expect(queryByText("search")).not.toBeInTheDocument();
    expect(document.querySelector(".loader")).toBeInTheDocument();
  });

  it("should render the search results in the scrollable container with the height given in visibleContainerSize in search props", () => {
    const visibleContainerSizes: Size3[] = ["sm", "md", "lg"];
    visibleContainerSizes.forEach(size => {
      const { getByRole, unmount } = render(
        <NavBar
          search={{
            results: [{ text: "Result 1" }, { text: "Result 2" }, { text: "Result 3" }, { text: "Result 4" }, { text: "Result 5" }],
            visibleContainerSize: size,
          }}
        />,
      );
      expect(getByRole("listbox")).toHaveStyle(`max-height: ${size === "sm" ? 116 : size === "md" ? 194 : 272}px`);
      unmount();
    });
  });

  it("should close the search results dropdown when clicked outside", async () => {
    const { queryByText } = render(<NavBar search={{ results: [{ text: "Result 1" }] }} />);
    expect(queryByText("Result 1")).toBeInTheDocument();
    await userEvent.click(document.body);
    expect(queryByText("Result 1")).not.toBeInTheDocument();
  });

  it("should close the search results dropdown when a search result is clicked", () => {
    const { queryByText, getByText } = render(<NavBar search={{ results: [{ text: "Result 1" }] }} />);
    expect(getByText("Result 1")).toBeInTheDocument();
    fireEvent.click(getByText("Result 1"));
    expect(queryByText("Result 1")).not.toBeInTheDocument();
  });

  it("should re-open the search results dropdown when the search input is clicked while there are results and the dropdown is closed", async () => {
    const { queryByText, getByRole } = render(<NavBar search={{ results: [{ text: "Result 1" }] }} />);
    expect(queryByText("Result 1")).toBeInTheDocument();
    await userEvent.click(document.body);
    expect(queryByText("Result 1")).not.toBeInTheDocument();
    await userEvent.click(getByRole("textbox"));
    expect(queryByText("Result 1")).toBeInTheDocument();
  });

  it("should not render a clear button in the search input when clearable is not set in the search prop", async () => {
    const { getByRole, queryByText } = render(<NavBar search={{}} />);
    await userEvent.type(getByRole("textbox"), "test query");
    expect(queryByText("cancel_outline")).not.toBeInTheDocument();
  });

  it("should render a clear button in the search input when clearable is true in the search prop and text has been typed", async () => {
    const { getByRole, queryByText } = render(<NavBar search={{ clearable: true }} />);
    const searchInput = getByRole("textbox") as HTMLInputElement;
    expect(queryByText("cancel_outline")).not.toBeInTheDocument();
    await userEvent.type(searchInput, "test query");
    expect(queryByText("cancel_outline")).toBeInTheDocument();
  });

  it("should clear the search input and close the results dropdown when the clear button is clicked", async () => {
    const { getByRole, getByText, queryByText } = render(
      <NavBar search={{ clearable: true, results: [{ text: "Result 1" }] }} />,
    );
    const searchInput = getByRole("textbox") as HTMLInputElement;
    await userEvent.type(searchInput, "test query");
    expect(queryByText("Result 1")).toBeInTheDocument();

    fireEvent.click(getByText("cancel_outline"));
    expect(searchInput.value).toBe("");
    expect(queryByText("Result 1")).not.toBeInTheDocument();
  });

  it("should render the search box with the given placeholder in the search prop", () => {
    const { getByPlaceholderText } = render(<NavBar search={{ placeholder: "Search..." }} />);
    expect(getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("should render an action button on the right side with the given props in button prop", () => {
    const mockOnClick = jest.fn();
    const { getByText } = render(<NavBar button={{ label: "Login", icon: "person", pill: true, onClick: mockOnClick }} />);
    expect(getByText("Login")).toBeInTheDocument();
    expect(getByText("person")).toBeInTheDocument();
    expect(getByText("Login").parentElement).toHaveClass("pill");
    fireEvent.click(getByText("Login"));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("should render logo with the given props in the logo prop", () => {
    const { getByRole } = render(
      <NavBar
        logo={{
          imgPath: "some_image",
          alt: "logo",
          href: "https://motif-ui.com/",
        }}
      />,
    );
    expect(getByRole("link")).toHaveAttribute("href", "https://motif-ui.com/");
    expect(getByRole("img")).toHaveAttribute("src", "some_image");
  });

  it("should render custom component using logoSlot prop", () => {
    const { getByRole } = render(
      <NavBar
        logoSlot={
          <a href="https://example.com/">
            <img src="logo.png" alt="Logo" />
          </a>
        }
      />,
    );

    expect(getByRole("link")).toHaveAttribute("href", "https://example.com/");
    expect(getByRole("img")).toHaveAttribute("src", "logo.png");
  });

  it("should prioritize logoSlot over logo prop when both are provided", () => {
    const { getByRole, queryByAltText } = render(
      <NavBar
        logo={{ imgPath: "logo-prop.png", alt: "Logo prop" }}
        logoSlot={
          <a href="https://example.com/">
            <img src="logo-slot.png" alt="Logo slot" />
          </a>
        }
      />,
    );

    expect(getByRole("img")).toHaveAttribute("src", "logo-slot.png");
    expect(queryByAltText("Logo prop")).not.toBeInTheDocument();
  });

  it("should render either an action menu with the props in the actionMenu prop or a main menu with the props in the mainMenu prop", () => {
    const mockClick = jest.fn();
    const { getByText, getByRole, rerender } = render(
      <NavBar
        actionMenu={{
          items: [{ label: "Menu", icon: "person", href: "https://motif-ui.com", onClick: mockClick, target: "_blank", active: true }],
          subMenuDirection: "left",
        }}
      />,
    );

    const checkAssertions = (isMainMenu: boolean) => {
      expect(getByText("Menu")).toBeInTheDocument();
      expect(getByText("person")).toBeInTheDocument();
      expect(getByRole(isMainMenu ? "menubar" : "menu")).toHaveClass(isMainMenu ? "menu_right" : "menu_left");
      const linkItem = getByRole("menuitem");
      expect(linkItem).toBeInTheDocument();
      expect(linkItem).toHaveAttribute("href", "https://motif-ui.com");
      expect(linkItem).toHaveAttribute("target", "_blank");
      expect(linkItem.parentElement).toHaveClass("active");
      fireEvent.click(linkItem);
      expect(mockClick).toHaveBeenCalled();
    };

    checkAssertions(false);

    rerender(
      <NavBar
        mainMenu={{
          items: [{ label: "Menu", icon: "person", href: "https://motif-ui.com", onClick: mockClick, target: "_blank", active: true }],
          subMenuDirection: "right",
        }}
      />,
    );
    checkAssertions(true);
  });

  // MENU PART

  it("should allow rendering nested menu items via the items prop within each menu item", () => {
    const { getByText } = render(<NavBar mainMenu={{ items }} />);
    expect(getByText("Services")).toBeInTheDocument();
    fireEvent.click(getByText("Services"));
    fireEvent.click(getByText("Premium"));
    expect(getByText("Email Services")).toBeInTheDocument();
    fireEvent.click(getByText("Email Services"));
    expect(getByText("< 10000 Emails")).toBeInTheDocument();
  });

  it("should render first level menus as a bar", () => {
    const { container, getByText } = render(<NavBar mainMenu={{ items }} />);
    expect(container.firstElementChild?.children).toHaveLength(2);
    expect(getByText("Home").closest("ul")).toHaveRole("menubar");
  });

  it("should render second level menus under the first level menus", () => {
    const { getByText } = render(<NavBar mainMenu={{ items }} />);
    fireEvent.click(getByText("Services"));
    const secondLevelMenu = getByText("Premium").closest("ul");
    expect(secondLevelMenu).toHaveClass("subMenu");
    expect(secondLevelMenu!.closest("li")).toHaveTextContent("Services");
  });

  it("should render the label given in the label prop of the menu item", () => {
    const { getByText } = render(<NavBar mainMenu={{ items }} />);
    expect(getByText("Home")).toBeInTheDocument();
    fireEvent.click(getByText("Services"));
    expect(getByText("Premium")).toBeInTheDocument();
  });

  it("should render the icon given in the icon prop of the menu item", () => {
    runIconPropTest(icon => render(<NavBar mainMenu={{ items: [{ label: "Nav Item", icon, href: "#" }] }} />));
    runIconPropTest(icon =>
      render(<NavBar mainMenu={{ items: [{ label: "Services", items: [{ label: "Sub Item", icon, href: "#" }] }] }} />),
    );
  });

  it("should redirect to the given href prop of the menu item when menu item is clicked and consider the related targetBlank prop", () => {
    const { getByText } = render(<NavBar mainMenu={{ items }} />);
    fireEvent.click(getByText("Services"));
    const linkItem = getByText("Basic").closest("a");
    expect(linkItem).toHaveAttribute("href", "https://motif-ui.com/");
    expect(linkItem).toHaveAttribute("target", "_blank");
  });

  it("should fire onClick event of the menu item that has a given onClick prop", () => {
    const onClick = jest.fn();
    const { getByText } = render(<NavBar mainMenu={{ items: [{ label: "Contact", onClick }] }} />);

    fireEvent.click(getByText("Contact"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should render the sub menus to the direction given in the subMenuDirection prop", () => {
    const { rerender, getByRole } = render(<NavBar mainMenu={{ items, subMenuDirection: "left" }} />);

    expect(getByRole("menubar")).toHaveClass("menu_left");
    rerender(<NavBar mainMenu={{ items, subMenuDirection: "right" }} />);
    expect(getByRole("menubar")).toHaveClass("menu_right");
  });

  it("should close the submenus when clicked outside", async () => {
    const { queryByText, queryByRole, getByText } = render(<NavBar mainMenu={{ items }} />);

    const user = userEvent.setup();
    await user.click(getByText("Services"));
    await user.click(getByText("Premium"));
    expect(getByText("Email Services")).toBeInTheDocument();

    await user.click(document.body);
    expect(queryByText("Email Services")).not.toBeInTheDocument();
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });
});
