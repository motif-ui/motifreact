import { render, screen } from "@testing-library/react";
import MenuList from "./MenuList";
import { userEvent } from "@testing-library/user-event";
import { Size3 } from "../../types";
import { MainMenuItemProps } from "@/components/MenuList/types";

describe("MenuList", () => {
  const user = userEvent.setup();
  const items: MainMenuItemProps[] = [{ label: "Home", icon: "home" }];
  const subMenuItems: MainMenuItemProps[] = [
    {
      label: "SubMenu",
      icon: "folder",
      chip: { label: "chip1", variant: "danger" },
      items: [{ label: "SubMenu 1", chip: { label: "chip2", variant: "warning" } }],
    },
  ];

  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { container } = render(<MenuList items={items} variant="solid" />);
    expect(container).toMatchSnapshot();
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("solid");
  });

  it("should display logo given in logo prop", () => {
    const logo = "testLogo.png";
    render(<MenuList items={items} logo={logo} />);

    const img = screen.queryByRole("img") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain(logo);
  });

  it("should display footer text given in footerText prop", () => {
    const footerText = "Test Footer Text";
    render(<MenuList items={items} footerText={footerText} />);

    expect(screen.queryByText(footerText)).toBeInTheDocument();
  });

  it("should display menu item as given variant in variant prop", () => {
    const { rerender, container } = render(<MenuList items={items} variant="solid" />);

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("solid");

    rerender(<MenuList items={items} variant="textOnly" />);
    expect(root).toHaveClass("textOnly");

    rerender(<MenuList items={items} variant="underline" />);
    expect(root).toHaveClass("underline");
  });

  it("should be rendered in dark mode when darkMode prop is true", () => {
    const { container } = render(<MenuList items={items} darkMode />);
    expect(container.firstElementChild).toHaveClass("dark");
  });

  it("should be rendered as collapsed when collapsed prop is true", () => {
    const { container, rerender } = render(<MenuList items={items} collapsed />);
    const menuListContainer = container.firstElementChild;
    expect(menuListContainer).toHaveClass("collapsed");

    rerender(<MenuList items={items} collapsed={false} />);
    expect(menuListContainer).not.toHaveClass("collapsed");
  });

  it("should be rendered as collapsed or not depending on the defaultCollapsed prop and changing the prop should not effect collapsing state anymore", () => {
    const render1 = render(<MenuList items={items} defaultCollapsed />);
    expect(render1.container.firstElementChild).toHaveClass("collapsed");
    render1.rerender(<MenuList items={items} defaultCollapsed={false} />);
    expect(render1.container.firstElementChild).toHaveClass("collapsed");

    const render2 = render(<MenuList items={items} />);
    expect(render2.container.firstElementChild).not.toHaveClass("collapsed");
    render2.rerender(<MenuList items={items} defaultCollapsed={false} />);
    expect(render2.container.firstElementChild).not.toHaveClass("collapsed");
  });

  it("should not reflect defaultCollapsed prop value when collapsed prop is given", () => {
    const firstRender = render(<MenuList items={items} collapsed={false} defaultCollapsed />);
    expect(firstRender.container.firstElementChild).not.toHaveClass("collapsed");

    const secondRender = render(<MenuList items={items} collapsed defaultCollapsed={false} />);
    expect(secondRender.container.firstElementChild).toHaveClass("collapsed");
  });

  it("should render collapse button when enableCollapseButton prop is true", () => {
    render(<MenuList items={items} enableCollapseButton />);
    expect(screen.queryByTestId("menuListCollapseButton")).toBeInTheDocument();
  });

  it("should collapse menu when collapse button is clicked", async () => {
    const { container } = render(<MenuList items={items} enableCollapseButton />);
    const menuListContainer = container.firstElementChild;
    const collapseButton = screen.queryByTestId("menuListCollapseButton");

    expect(menuListContainer).not.toHaveClass("collapsed");
    await user.click(collapseButton!);
    expect(menuListContainer).toHaveClass("collapsed");
  });

  it("should display mainMenu item's label given in the 'label' property of the mainMenu item", () => {
    render(<MenuList items={items} />);
    expect(screen.queryByText("Home")).toBeInTheDocument();
  });

  it("should display subMenu item's label given in the 'label' property of the subMenu item", async () => {
    render(<MenuList items={subMenuItems} />);

    await user.click(screen.queryByText("SubMenu") as Element);
    expect(screen.queryByText("SubMenu 1")).toBeInTheDocument();
  });

  it("should render chip with the given text and variant in chip property of the mainMenu and subMenu item", async () => {
    render(<MenuList items={subMenuItems} />);

    const chipMain = screen.queryByText("chip1");
    expect(chipMain).toBeInTheDocument();
    expect(chipMain?.parentElement).toHaveClass("danger");
    await user.click(screen.queryByText("SubMenu") as Element);

    const chipSub = screen.queryByText("chip2");
    expect(chipSub).toBeInTheDocument();
    expect(chipSub?.parentElement).toHaveClass("warning");
  });

  it("should display mainMenu item's icon given in the 'icon' property of the mainMenu item", () => {
    render(<MenuList items={items} />);
    expect(screen.queryByText("home")).toBeInTheDocument();
  });

  it("should display mainMenu item as active when 'active' property of the mainMenu item is true", () => {
    const activeItems = [{ label: "Home", icon: "home", active: true }];
    render(<MenuList items={activeItems} />);
    expect(screen.queryByText("Home")?.parentElement).toHaveClass("active");
  });

  it("should display subMenu item as active when 'active' property of the subMenu item is true", () => {
    const activeItems = [{ label: "SubMenu", icon: "folder", items: [{ label: "SubMenu 1", active: true }] }];
    render(<MenuList items={activeItems} />);

    expect(screen.queryByText("SubMenu")?.parentElement).toHaveClass("subMenuOpen");
    expect(screen.queryByText("SubMenu 1")?.parentElement).toHaveClass("active");
  });

  it("should display mainMenu item as disabled when 'disabled' property of the mainMenu item is true", async () => {
    const handleAction = jest.fn();
    const disabledItems = [{ label: "Home", icon: "home", disabled: true, action: handleAction }];
    render(<MenuList items={disabledItems} />);

    const item = screen.queryByText("Home")?.parentElement;
    expect(item).toHaveClass("disabled");

    await user.click(item as Element);
    expect(handleAction).not.toHaveBeenCalled();
  });

  it("should display subMenu item as disabled when 'disabled' property of the subMenu item is true", async () => {
    const handleAction = jest.fn();
    const disabledItems = [{ label: "SubMenu", icon: "folder", items: [{ label: "SubMenu 1", disabled: true, action: handleAction }] }];
    render(<MenuList items={disabledItems} />);

    await user.click(screen.queryByText("SubMenu") as Element);

    const subItem = screen.queryByText("SubMenu 1")?.parentElement;
    expect(subItem).toHaveClass("disabled");

    await user.click(subItem as Element);
    expect(handleAction).not.toHaveBeenCalled();
  });

  it("should render the anchor with the correct path given in the 'href' property of the mainMenu item, also with considering the targetBlank property", () => {
    const hrefItems = [{ label: "Home", icon: "home", href: "http://test/test", targetBlank: true }];
    render(<MenuList items={hrefItems} />);

    const linkElement = screen.queryByRole("link");
    expect(linkElement).toHaveAttribute("href", "http://test/test");
    expect(linkElement).toHaveAttribute("target", "_blank");
  });

  it("should render the anchor with the correct path given in the 'href' property of the subMenu item, also with considering the targetBlank property", async () => {
    const hrefItems = [{ label: "SubMenu", icon: "folder", items: [{ label: "SubMenu 1", href: "http://test/test", targetBlank: true }] }];
    render(<MenuList items={hrefItems} />);

    await user.click(screen.queryByText("SubMenu") as Element);

    const linkElement = screen.queryByRole("link");
    expect(linkElement).toHaveAttribute("href", "http://test/test");
    expect(linkElement).toHaveAttribute("target", "_blank");
  });

  it("should trigger the event given in the 'action' property of the mainMenu item when mainMenu item is clicked", async () => {
    const handleAction = jest.fn();
    const actionItems = [{ label: "Home", icon: "home", action: handleAction }];
    render(<MenuList items={actionItems} />);

    await user.click(screen.queryByText("Home")?.parentElement as Element);
    expect(handleAction).toHaveBeenCalled();
  });

  it("should trigger the event given in the 'action' property of the subMenu item when subMenu item is clicked", async () => {
    const handleAction = jest.fn();
    const actionItems = [{ label: "SubMenu", icon: "folder", items: [{ label: "SubMenu 1", action: handleAction }] }];
    render(<MenuList items={actionItems} />);

    await user.click(screen.queryByText("SubMenu") as Element);

    await user.click(screen.queryByText("SubMenu 1")?.parentElement as Element);
    expect(handleAction).toHaveBeenCalled();
  });

  it("should display an arrow down icon when any item has sub menus", async () => {
    const controlItem = (item: HTMLElement | null | undefined, className: string, hasArrowDownIcon: boolean) => {
      const iconName = "keyboard_arrow_down";
      expect(item).toHaveClass(className);
      hasArrowDownIcon ? expect(item).toHaveTextContent(iconName) : expect(item).not.toHaveTextContent(iconName);
    };
    const menuItems = [
      { label: "Home", icon: "home" },
      { label: "SubMenu", icon: "folder", items: [{ label: "SubMenu 1" }, { label: "SubMenu 2", items: [{ label: "Nested" }] }] },
    ];

    render(<MenuList items={menuItems} />);

    controlItem(screen.queryByText("Home")?.parentElement, "mainMenuItem", false);
    controlItem(screen.queryByText("SubMenu")?.parentElement, "mainMenuItem", true);

    await user.click(screen.queryByText("SubMenu")?.parentElement as Element);

    controlItem(screen.queryByText("SubMenu 1")?.parentElement, "subMenuItem", false);
    controlItem(screen.queryByText("SubMenu 2")?.parentElement, "subMenuItem", true);
  });

  it("should not display logo and label of items when collapsed prop is true", () => {
    render(<MenuList items={items} logo="testLogo.png" collapsed />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.queryByText("home")).toBeInTheDocument();
  });

  it("should toggle subMenu items when the item is clicked", async () => {
    render(<MenuList items={subMenuItems} />);

    const item = screen.queryByText("SubMenu")?.parentElement;
    expect(item).not.toHaveClass("subMenuOpen");
    expect(screen.queryByText("SubMenu 1")).not.toBeInTheDocument();

    await user.click(item as Element);

    expect(item).toHaveClass("subMenuOpen");
    expect(screen.queryByText("SubMenu 1")).toBeInTheDocument();

    await user.click(item as Element);

    expect(item).not.toHaveClass("subMenuOpen");
    expect(screen.queryByText("SubMenu 1")).not.toBeInTheDocument();
  });

  it("should close open subMenu items when clicked outside of the item only when the menu is collapsed", async () => {
    const { container, rerender } = render(<MenuList items={subMenuItems} collapsed />);

    await user.click(screen.queryByText("folder") as Element);
    const subItem = screen.queryByText("SubMenu 1");
    expect(subItem).toBeInTheDocument();

    await user.click(container);
    expect(subItem).not.toBeInTheDocument();

    rerender(<MenuList items={subMenuItems} />);

    await user.click(screen.queryByText("folder") as Element);
    const subItemReRendered = screen.queryByText("SubMenu 1");
    expect(subItemReRendered).toBeInTheDocument();

    await user.click(container);
    expect(subItemReRendered).toBeInTheDocument();
  });

  it("should open all the subMenus until the active item, on first render and should not behave the same when menu items are toggled again", async () => {
    const menuItems = [
      {
        label: "SubMenu",
        icon: "folder",
        items: [
          { label: "SubMenu 1", items: [{ label: "Nested 1" }] },
          { label: "SubMenu 2", items: [{ label: "Nested 2", active: true }] },
        ],
      },
    ];
    render(<MenuList items={menuItems} />);

    const item = screen.queryByText("SubMenu")?.parentElement;
    expect(item).toHaveClass("subMenuOpen");
    expect(screen.queryByText("SubMenu 1")?.parentElement).not.toHaveClass("subMenuOpen");
    expect(screen.queryByText("SubMenu 2")?.parentElement).toHaveClass("subMenuOpen");
    expect(screen.queryByText("Nested 2")?.parentElement).toHaveClass("active");

    await user.click(item as Element);
    expect(item).not.toHaveClass("subMenuOpen");

    await user.click(item as Element);
    expect(item).toHaveClass("subMenuOpen");
    expect(screen.queryByText("SubMenu 2")?.parentElement).not.toHaveClass("subMenuOpen");

    await user.click(screen.queryByText("SubMenu 2")?.parentElement as Element);
    expect(screen.queryByText("SubMenu 2")?.parentElement).toHaveClass("subMenuOpen");
    expect(screen.queryByText("Nested 2")?.parentElement).toHaveClass("active");
  });

  it("should render the open menu with the size given in the size prop", async () => {
    const sizes: Size3[] = ["sm", "md", "lg"];
    for (const size of sizes) {
      const { container, getByTestId, queryByText, unmount } = render(<MenuList items={items} size={size} enableCollapseButton />);
      expect(container.firstElementChild).toHaveClass(size);
      await userEvent.click(getByTestId("menuListCollapseButton"));
      expect(queryByText("Home")).not.toBeInTheDocument();
      unmount();
    }
  });
});
