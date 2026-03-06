import { fireEvent, render } from "@testing-library/react";
import Tab from "./Tab";

describe("Tab", () => {
  it("should render with only required props", () => {
    expect(
      render(
        <Tab tabs={[{ id: "home" }, { id: "profile" }]}>
          <Tab.Panel id="home" />
          <Tab.Panel id="profile" />
        </Tab>,
      ).container,
    ).toMatchSnapshot();
  });

  it("fires onChangeTab when selected tab is changed", () => {
    const mockOnTabChange = jest.fn();

    const { getByText } = render(
      <Tab
        tabs={[
          { id: "first", title: "First Tab" },
          { id: "second", title: "Second Tab" },
        ]}
        onTabChange={mockOnTabChange}
      >
        <Tab.Panel id="first">Content 1</Tab.Panel>
        <Tab.Panel id="second">Content 2</Tab.Panel>
      </Tab>,
    );

    fireEvent.click(getByText("Second Tab"));
    expect(mockOnTabChange).toHaveBeenCalled();
  });

  it("should render tab item as disabled and disable pointer events when disabled prop of the tab item is true", () => {
    const mockOnTabChange = jest.fn();

    const { getByText } = render(
      <Tab
        tabs={[
          { id: "first", title: "First Tab" },
          { id: "second", title: "Second Tab", disabled: true },
        ]}
        onTabChange={mockOnTabChange}
      >
        <Tab.Panel id="first">Content 1</Tab.Panel>
        <Tab.Panel id="second">Content 2</Tab.Panel>
      </Tab>,
    );
    fireEvent.click(getByText("Second Tab"));
    expect(getByText("Second Tab").parentElement).toBeDisabled();
    expect(mockOnTabChange).not.toHaveBeenCalled();
  });

  it("should select the tab given in defaultTabId and render the content of the Tab.Panel with the same id", () => {
    const { getByText } = render(
      <Tab
        tabs={[
          { id: "first", title: "First Tab" },
          { id: "second", title: "Second Tab" },
        ]}
        defaultTabId="second"
      >
        <Tab.Panel id="first">Content 1</Tab.Panel>
        <Tab.Panel id="second">Content 2</Tab.Panel>
      </Tab>,
    );

    expect(getByText("Content 2")).toBeInTheDocument();
  });

  it("should be rendered with the type given in type prop", () => {
    const types: ("underline" | "solid")[] = ["underline", "solid"];
    types.forEach(type => {
      const { container } = render(
        <Tab
          tabs={[
            { id: "first", title: "First Tab" },
            { id: "second", title: "Second Tab" },
          ]}
          type={type}
        >
          <Tab.Panel id="first">Content 1</Tab.Panel>
          <Tab.Panel id="second">Content 2</Tab.Panel>
        </Tab>,
      );
      expect(container.firstElementChild).toHaveClass(type);
    });
  });

  it("should be rendered with the position given in position prop", () => {
    const positions: ("left" | "right" | "fill" | "center")[] = ["left", "right", "fill", "center"];
    positions.forEach(position => {
      const { container } = render(
        <Tab
          tabs={[
            { id: "first", title: "First Tab" },
            { id: "second", title: "Second Tab" },
          ]}
          position={position}
        >
          <Tab.Panel id="first">Content 1</Tab.Panel>
          <Tab.Panel id="second">Content 2</Tab.Panel>
        </Tab>,
      );
      expect(container.firstElementChild).toHaveClass(position);
    });
  });

  it("should render the content of the Tab.Panel when a Tab item with the same id is clicked", () => {
    const { getByText } = render(
      <Tab
        tabs={[
          { id: "first", title: "First Tab" },
          { id: "second", title: "Second Tab" },
        ]}
      >
        <Tab.Panel id="first">Content 1</Tab.Panel>
        <Tab.Panel id="second">Content 2</Tab.Panel>
      </Tab>,
    );

    fireEvent.click(getByText("Second Tab"));
    expect(getByText("Content 2")).toBeInTheDocument();
  });

  it("should not render content of any panel when no id is matched in the tabs prop", () => {
    const { queryByText } = render(
      <Tab
        tabs={[
          { id: "first", title: "First Tab" },
          { id: "second", title: "Second Tab" },
        ]}
      >
        <Tab.Panel id="third">Content 3</Tab.Panel>
        <Tab.Panel id="forth">Content 4</Tab.Panel>
      </Tab>,
    );

    expect(queryByText("Content 3")).toBeNull();
  });

  it("should allow rendering only tab item part but Tab.Panels", () => {
    const { queryByText } = render(
      <Tab
        tabs={[
          { id: "first", title: "First Tab" },
          { id: "second", title: "Second Tab" },
        ]}
      />,
    );

    expect(queryByText("First Tab")).toBeInTheDocument();
    expect(queryByText("Second Tab")).toBeInTheDocument();
  });
});
