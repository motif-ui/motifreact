import { fireEvent, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import ButtonGroup from "./ButtonGroup";
import { Size4SM } from "../../types";

describe("ButtonGroup", () => {
  it("should render with only required props", () => {
    const { container } = render(<ButtonGroup />);
    expect(container).toMatchSnapshot();

    // size: md
    expect(container.firstElementChild).toHaveClass("md");
  });

  it("should be rendered with the size given in size prop", () => {
    const sizes: Size4SM[] = ["xs", "sm", "md", "lg"];
    sizes.forEach(size => {
      const { container } = render(<ButtonGroup size={size} />);
      expect(container.firstElementChild).toHaveClass(size);
    });
  });

  it("should render ButtonGrop.Item components given as children", () => {
    const { getByText } = render(
      <ButtonGroup>
        <ButtonGroup.Item label="Item 1" />
        <ButtonGroup.Item label="Item 2" />
      </ButtonGroup>,
    );

    expect(getByText("Item 1")).toBeInTheDocument();
    expect(getByText("Item 2")).toBeInTheDocument();
  });

  it("should render a dropdown icon near the ButtonGroup.Item component that has children", () => {
    const { getByText } = render(
      <ButtonGroup>
        <ButtonGroup.Item label="Item 1" />
        <ButtonGroup.Item label="Item 2">
          <ButtonGroup.Item label="Item 2.1" />
        </ButtonGroup.Item>
      </ButtonGroup>,
    );

    expect(getByText("keyboard_arrow_down")).toBeInTheDocument();
  });

  it("should render a submenu when the dropdown icon near the ButtonGroup.Item component that has children is clicked", async () => {
    const { getByText, queryByText } = render(
      <ButtonGroup>
        <ButtonGroup.Item label="Item 1" />
        <ButtonGroup.Item label="Item 2">
          <ButtonGroup.Item label="Item 2.1" />
        </ButtonGroup.Item>
      </ButtonGroup>,
    );

    expect(queryByText("Item 2.1")).not.toBeInTheDocument();
    await userEvent.click(getByText("keyboard_arrow_down"));
    expect(queryByText("Item 2.1")).toBeInTheDocument();
  });

  it("should close the submenu when the dropdown icon near the ButtonGroup.Item component that has children is clicked again", async () => {
    const { getByText, queryByText } = render(
      <ButtonGroup>
        <ButtonGroup.Item label="Item 1" />
        <ButtonGroup.Item label="Item 2">
          <ButtonGroup.Item label="Item 2.1" />
        </ButtonGroup.Item>
      </ButtonGroup>,
    );

    await userEvent.click(getByText("keyboard_arrow_down"));
    expect(queryByText("Item 2.1")).toBeInTheDocument();
    await userEvent.click(getByText("keyboard_arrow_down"));
    expect(queryByText("Item 2.1")).not.toBeInTheDocument();
  });

  it("should close the submenu when clicked outside of it", async () => {
    const { getByText, queryByText } = render(
      <ButtonGroup>
        <ButtonGroup.Item label="Item 1" />
        <ButtonGroup.Item label="Item 2">
          <ButtonGroup.Item label="Item 2.1" />
        </ButtonGroup.Item>
      </ButtonGroup>,
    );

    await userEvent.click(getByText("keyboard_arrow_down"));
    expect(queryByText("Item 2.1")).toBeInTheDocument();
    await userEvent.click(document.body);
    expect(queryByText("Item 2.1")).not.toBeInTheDocument();
  });
});

describe("ButtonGroup.Item", () => {
  it("should fire an event when an item with the action prop is clicked", async () => {
    const action = jest.fn();
    const { getByText } = render(
      <ButtonGroup>
        <ButtonGroup.Item label="Item" action={action} />
      </ButtonGroup>,
    );

    await userEvent.click(getByText("Item"));
    expect(action).toHaveBeenCalled();
  });

  it("should disable item when disabled prop is true", () => {
    const action = jest.fn();
    const { getByText } = render(
      <ButtonGroup>
        <ButtonGroup.Item label="Item" action={action} disabled />
      </ButtonGroup>,
    );

    fireEvent.click(getByText("Item"));
    expect(action).not.toHaveBeenCalled();
  });

  it("should render the icon given in the icon prop", () => {
    const { getByText } = render(
      <ButtonGroup>
        <ButtonGroup.Item label="Item" icon="folder" />
      </ButtonGroup>,
    );

    expect(getByText("folder")).toBeInTheDocument();
  });

  it("should render the label given in the label prop", () => {
    const { getByText } = render(
      <ButtonGroup>
        <ButtonGroup.Item label="Item" />
      </ButtonGroup>,
    );

    expect(getByText("Item")).toBeInTheDocument();
  });
});
