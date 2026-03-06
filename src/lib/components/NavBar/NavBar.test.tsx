import { fireEvent, render } from "@testing-library/react";
import NavBar from "./NavBar";
import { MenuItemProps } from "@/components/NavBar/components/NavBarMenu/types";
import { userEvent } from "@testing-library/user-event";

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
    const { getByRole, getByPlaceholderText } = render(<NavBar search={{ placeholder: "Search...", onSubmit: jest.fn() }} />);
    expect(getByRole("textbox")).toBeInTheDocument();
    expect(getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("should render the search box in a pill shape when pill is true in the search prop", () => {
    const { getByRole } = render(<NavBar search={{ onSubmit: jest.fn(), pill: true }} />);
    expect(getByRole("textbox").parentElement).toHaveClass("pill");
  });

  it("should submit typed query in the search box when 'enter' key is pressed", () => {
    const mockActionSubmit = jest.fn();
    const { getByRole } = render(<NavBar search={{ onSubmit: mockActionSubmit }} />);
    const input = getByRole("textbox");
    fireEvent.change(input, { target: { value: "test query" } });
    fireEvent.keyUp(input, { key: "Enter", code: "Enter" });
    expect(mockActionSubmit).toHaveBeenCalledWith("test query");
  });

  it("should render the search box with the given placeholder in the search prop", () => {
    const { getByPlaceholderText } = render(<NavBar search={{ placeholder: "Search...", onSubmit: jest.fn() }} />);
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
          href: "https://motif-ui.com/",
        }}
      />,
    );
    expect(getByRole("link")).toHaveAttribute("href", "https://motif-ui.com/");
    expect(getByRole("img")).toHaveAttribute("src", "some_image");
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
    const { getByText } = render(<NavBar mainMenu={{ items }} />);
    expect(getByText("home")).toBeInTheDocument();
    fireEvent.click(getByText("Services"));
    expect(getByText("person")).toBeInTheDocument();
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
