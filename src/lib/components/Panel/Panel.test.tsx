import { render } from "@testing-library/react";
import Panel from "@/components/Panel/Panel";

describe("Panel", () => {
  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { container, getByText } = render(<Panel title="title" />);
    expect(container).toMatchSnapshot();

    // type: default
    expect(container.firstElementChild).toHaveClass("default");
    // titleSize: md
    expect(getByText("title")).toHaveClass("title-md");
  });

  it("should render a border around when bordered is true", () => {
    const { container } = render(<Panel title="title" bordered />);
    expect(container.firstElementChild).toHaveClass("bordered");
  });

  it("should render the given title prop", () => {
    const { getByText } = render(<Panel title="Custom Title" />);
    expect(getByText("Custom Title")).toBeInTheDocument();
  });

  it("should render an icon which is given in titleIcon prop", () => {
    const { getByText } = render(<Panel title="title" titleIcon="home" />);
    expect(getByText("home")).toBeInTheDocument();
  });

  it("should be rendered in the given type prop", () => {
    const { container, rerender } = render(<Panel type="solid" />);
    expect(container.firstElementChild).toHaveClass("solid");
    rerender(<Panel type="elevated" />);
    expect(container.firstElementChild).toHaveClass("elevated");
    rerender(<Panel type="default" />);
    expect(container.firstElementChild).toHaveClass("default");
  });

  it("should render the title in size given in titleSize prop", () => {
    const sizes = ["sm", "md", "lg"] as const;
    for (const size of sizes) {
      const { getByText } = render(<Panel title={size} titleSize={size} />);
      expect(getByText(size)).toHaveClass("title-" + size);
    }
  });

  it("should render with lean prop", () => {
    const leans = [
      "all",
      "top",
      "right",
      "bottom",
      "left",
      "top right",
      "top left",
      "bottom right",
      "bottom left",
      "left right",
      "top bottom",
      "left right top",
      "left right bottom",
      "top right bottom",
      "top left bottom",
    ] as const;
    for (const lean of leans) {
      const { container } = render(<Panel lean={lean} />);
      const leanClasses = lean
        .split(" ")
        .map(l => `lean-${l}`)
        .join(" ");
      expect(container.firstElementChild).toHaveClass(leanClasses);
    }
  });

  it("should render the children", () => {
    const { getByText } = render(<Panel title="title">Panel Content</Panel>);
    expect(getByText("Panel Content")).toBeInTheDocument();
  });

  it("should render all the titles when title prop is given along with multiple Panel.Title components", () => {
    const { getByText } = render(
      <Panel title="title1">
        <Panel.Title title="title2" />
        <Panel.Title title="title3" />
      </Panel>,
    );
    expect(getByText("title1")).toBeInTheDocument();
    expect(getByText("title2")).toBeInTheDocument();
    expect(getByText("title3")).toBeInTheDocument();
  });

  it("should render the children, right after the title when title prop is given", () => {
    const { getByText } = render(
      <Panel title="title">
        <div>child</div>
      </Panel>,
    );
    const title = getByText("title");
    const child = getByText("child");

    expect(title).toBeInTheDocument();
    expect(child).toBeInTheDocument();

    expect(title.compareDocumentPosition(child)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
});

describe("Panel.Title", () => {
  it("should be rendered with given title prop", () => {
    const { getByText } = render(<Panel.Title title="Panel Title" />);
    expect(getByText("Panel Title")).toBeInTheDocument();
  });

  it("should be rendered with the given size prop", () => {
    const sizes = ["sm", "md", "lg"] as const;
    for (const size of sizes) {
      const { getByText } = render(<Panel.Title title={size} size={size} />);
      expect(getByText(size)).toHaveClass("title-" + size);
    }
  });

  it("should render the icon given in the icon prop", () => {
    const { getByText } = render(<Panel.Title title="Panel Title" icon="home" />);
    expect(getByText("home")).toBeInTheDocument();
  });
});
