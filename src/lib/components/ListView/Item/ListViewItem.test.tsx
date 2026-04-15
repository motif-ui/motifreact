import { render, fireEvent } from "@testing-library/react";
import ListView from "../ListView";

describe("ListView.Item", () => {
  it("should render with only required props", () => {
    expect(render(<ListView.Item title="Test Item" />).container).toMatchSnapshot();
  });

  it("should display given title", () => {
    const { getByText } = render(<ListView.Item title="Test Item" />);
    expect(getByText("Test Item")).toBeInTheDocument();
  });

  it("should display given description", () => {
    const { getByText } = render(<ListView.Item title="Test Item" description="Test Description" />);
    expect(getByText("Test Description")).toBeInTheDocument();
  });

  it("should display given alternative text in alternateText prop", () => {
    const { getByText } = render(<ListView.Item title="Test Item" alternateText="Alternate Text" />);
    expect(getByText("Alternate Text")).toBeInTheDocument();
  });

  it("should display an icon on the left side, given in the icon prop", () => {
    const { container, getByText } = render(<ListView.Item title="Test Item" icon="folder" />);
    expect(container.getElementsByClassName("leftContent")).toHaveLength(1);
    expect(getByText("folder")).toBeInTheDocument();
  });

  it("should display given image on the left side", () => {
    const { container, queryByRole } = render(<ListView.Item title="Test Item" image="https://picsum.photos/seed/motifui/20" />);
    expect(container.getElementsByClassName("leftContent")).toHaveLength(1);
    expect(queryByRole("img")).toBeInTheDocument();
    expect(queryByRole("img")).toHaveAttribute("src", "https://picsum.photos/seed/motifui/20");
  });

  it("should display given abbreviation on the left side", () => {
    const { container, getByText } = render(<ListView.Item title="Test Item" abbr="T" />);
    expect(container.getElementsByClassName("leftContent")).toHaveLength(1);
    expect(getByText("T")).toBeInTheDocument();
  });

  it("should display only first two characters of the abbreviation at max", () => {
    const { getByText } = render(<ListView.Item title="Test Item" abbr="test" />);
    expect(getByText("te")).toBeInTheDocument();
  });

  it("should display an icon on the right side, given in the iconRight prop", () => {
    const { container, getByText } = render(<ListView.Item title="Test Item" iconRight="folder" />);
    expect(container.getElementsByClassName("iconRight")).toHaveLength(1);
    expect(getByText("folder")).toBeInTheDocument();
  });

  it("should display as a link when href prop is given", () => {
    const { container } = render(<ListView.Item title="Test Item" href="https://motif-ui.com" />);
    expect(container.querySelector("a")).toBeInTheDocument();
    expect(container.querySelector("a")).toHaveAttribute("href", "https://motif-ui.com");
  });

  it("should display as a button when onClick prop is given and fire given onClick event when clicked", () => {
    const onClickMock = jest.fn();
    const { getByRole } = render(<ListView.Item title="Test Item" onClick={onClickMock} />);
    const button = getByRole("button");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("should should not render an anchor when disabled prop is given", () => {
    const { container } = render(<ListView.Item title="Test Item" href="https://motif-ui.com" disabled />);
    expect(container.querySelector("a")).toBeNull();
  });

  it("should disable click events when disabled prop is true and onClick prop is given", () => {
    const onClickMock = jest.fn();
    const { queryByRole, getByText } = render(<ListView.Item title="Test Item" onClick={onClickMock} disabled />);
    expect(queryByRole("button")).not.toBeInTheDocument();

    fireEvent.click(getByText("Test Item"));
    expect(onClickMock).toHaveBeenCalledTimes(0);
  });

  it("should visibly show that the item is disabled", () => {
    const { container } = render(<ListView.Item title="Test Item" icon="folder" disabled />);
    expect(container.getElementsByClassName("listItem")[0]).toHaveClass("disabled");
  });
});
