import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dropdown from "./Dropdown";
import { userEvent } from "@testing-library/user-event";
import { Size4SM } from "../../types";
import { Spacing } from "./types";

describe("Dropdown", () => {
  it("should be rendered with only required props and should have default prop values", () => {
    const { container, getByText } = render(<Dropdown label="Dropdown" items={[{ label: "Home" }]} />);
    expect(container.firstElementChild).toMatchSnapshot();

    expect(container.firstElementChild).toHaveClass("primary");
    expect(container.firstElementChild).toHaveClass("solid");
    expect(container.firstElementChild).toHaveClass("md");

    fireEvent.click(getByText("Dropdown"));
    expect(container.querySelector("ul")).toHaveClass("callout");
  });

  it("should be rendered in different color schemas given in the variant prop", () => {
    const variants: ("primary" | "secondary" | "success" | "danger" | "warning" | "info")[] = [
      "primary",
      "secondary",
      "success",
      "danger",
      "warning",
      "info",
    ];
    variants.forEach(variant => {
      expect(render(<Dropdown items={[{ label: "Home" }]} variant={variant} />).container.firstElementChild).toHaveClass(variant);
    });
  });

  it("should render items when dropdown menu is clicked and should remove items when clicked again", async () => {
    render(<Dropdown label="Dropdown Menu" items={[{ label: "Item 1" }]} />);

    const dropdownButton = screen.getByText("Dropdown Menu");
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    fireEvent.click(dropdownButton);
    await waitFor(() => expect(screen.getByText("Item 1")).toBeInTheDocument());

    fireEvent.click(dropdownButton);
    await waitFor(() => expect(screen.queryByText("Item 1")).not.toBeInTheDocument());
  });

  it("should render the icon given in the icon prop of the dropdown menu ", () => {
    render(<Dropdown label="Dropdown Menu" icon="account_circle" items={[{ label: "Item 1" }]} />);
    expect(screen.queryByText("account_circle")).toBeInTheDocument();
  });

  it("should render the label given in the label prop of the dropdown menu ", () => {
    render(<Dropdown label="Dropdown Menu" items={[{ label: "Item 1" }]} />);
    expect(screen.queryByText("Dropdown Menu")).toBeInTheDocument();
  });

  it("should render the icon given in the icon prop of the dropdown menu item", () => {
    render(<Dropdown label="Dropdown Menu" items={[{ label: "Item 1", icon: "home" }]} />);
    fireEvent.click(screen.getByText("Dropdown Menu"));
    expect(screen.queryByText("home")).toBeInTheDocument();
  });

  it("should render the label given in the label prop of the dropdown menu item ", () => {
    render(<Dropdown label="Dropdown Menu" items={[{ label: "Item 1" }]} />);
    fireEvent.click(screen.getByText("Dropdown Menu"));
    expect(screen.queryByText("Item 1")).toBeInTheDocument();
  });

  it("items should display the given header in the header prop of the item'", () => {
    render(<Dropdown label="Dropdown Menu" items={[{ header: "Header" }]} />);
    fireEvent.click(screen.getByText("Dropdown Menu"));
    expect(screen.queryByText("Header")).toBeInTheDocument();
  });

  it("should call the action given in the action prop of the item when dropdown menu item is clicked", () => {
    const mockAction = jest.fn();
    render(<Dropdown label="Dropdown Menu" items={[{ label: "Item 1", action: mockAction }]} />);

    fireEvent.click(screen.getByText("Dropdown Menu"));
    fireEvent.click(screen.getByText("Item 1"));

    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it("should close the dropdown when clicked outside", async () => {
    const { getByText, queryByText, getByTestId } = render(
      <div>
        <Dropdown label="Dropdown Menu" items={[{ label: "Item 1" }]} />
        <div data-testid="outsideArea" />
      </div>,
    );
    const user = userEvent.setup();
    await user.click(getByText("Dropdown Menu"));
    await waitFor(() => expect(queryByText("Item 1")).toBeInTheDocument());
    await user.click(getByTestId("outsideArea"));
    await waitFor(() => expect(queryByText("Item 1")).not.toBeInTheDocument());
  });

  it("should close dropdown menu after an item is clicked", async () => {
    const mockAction = jest.fn();
    render(<Dropdown label="Dropdown Menu" items={[{ label: "Item 1", action: mockAction }]} />);
    fireEvent.click(screen.getByText("Dropdown Menu"));
    fireEvent.click(screen.getByText("Item 1"));
    await waitFor(() => expect(screen.queryByText("Item 1")).not.toBeInTheDocument());
  });

  it("should be rendered as disabled when dropdown menu disabled prop is given", async () => {
    render(<Dropdown label="Dropdown Menu" items={[{ label: "Item 1" }]} disabled />);
    fireEvent.click(screen.getByText("Dropdown Menu"));
    await waitFor(() => expect(screen.queryByText("Item 1")).not.toBeInTheDocument());
  });

  it("should be rendered as disabled when dropdown menu item disabled prop is given", async () => {
    const mockAction = jest.fn();
    render(
      <Dropdown
        label="Dropdown Menu"
        items={[
          { label: "Item 1", disabled: true, action: mockAction },
          { label: "Item 2", action: mockAction },
        ]}
      />,
    );
    fireEvent.click(screen.getByText("Dropdown Menu"));
    await waitFor(() => expect(screen.queryByText("Item 1")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Item 1"));
    expect(mockAction).toHaveBeenCalledTimes(0);
    await waitFor(() => expect(screen.queryByText("Item 1")).toBeInTheDocument());
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes: Size4SM[] = ["xs", "sm", "md", "lg"];

    sizes.forEach(size => {
      expect(render(<Dropdown label="Dropdown Menu" size={size} items={[{ label: "Item 1" }]} />).container.firstElementChild).toHaveClass(
        size,
      );
    });
  });

  it("should be rendered in a pill shape when pill prop is true", () => {
    const { getByTestId } = render(<Dropdown label="Dropdown Menu" pill items={[{ label: "Item 1" }]} />);
    expect(getByTestId("Dropdown")).toHaveClass("pill");
  });

  it("should be rendered with the shape given in shape prop", () => {
    const { container, rerender } = render(<Dropdown label="Dropdown Menu" shape="solid" items={[{ label: "Item 1" }]} />);
    expect(container.firstElementChild).toHaveClass("solid");
    rerender(<Dropdown label="Dropdown Menu" shape="textOnly" items={[{ label: "Item 1" }]} />);
    expect(container.firstElementChild).toHaveClass("textOnly");
  });

  it("items should be rendered with the color given in items' iconColor prop", () => {
    render(<Dropdown label="Dropdown Menu" items={[{ label: "Item 1", icon: "check_circle", iconColor: "red" }]} />);
    fireEvent.click(screen.getByText("Dropdown Menu"));

    expect(screen.getByText("check_circle")).toHaveStyle({
      color: "rgb(255, 0, 0)",
    });
  });

  it("should be rendered in different spacing options given in the spacing prop", () => {
    (["withGap", "callout", "noSpace"] as Spacing[]).forEach(spacing => {
      const { unmount, getByText, container } = render(<Dropdown label="Dropdown Menu" items={[{ label: "Item 1" }]} spacing={spacing} />);
      fireEvent.click(getByText("Dropdown Menu"));
      const menu = container.querySelector("ul");
      expect(menu).toHaveClass(spacing);
      unmount();
    });
  });
});
