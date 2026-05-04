import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Timeline from "@/components/Timeline/Timeline";
import { TimelineItemProps, TimelineMarkerType, TimelineVariant } from "@/components/Timeline/types";

const items: TimelineItemProps[] = [
  { title: "Step 1", content: "First step content" },
  { title: "Step 2", content: "Second step content" },
  { title: "Step 3", content: "Third step content" },
];

describe("Timeline", () => {
  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { container } = render(<Timeline items={items} />);
    expect(container).toMatchSnapshot();

    const root = container.firstChild as HTMLElement;

    // orientation: vertical
    expect(root).toHaveClass("vertical");

    // contentPosition: after
    expect(root).toHaveClass("after");

    // markerType: dot
    expect(root).toHaveClass("dot");

    // textAlign: start
    expect(root).toHaveClass("start");

    // variant: primary
    expect(root).toHaveClass("primary");
  });

  it("should be rendered as given in orientation prop", () => {
    const { container, rerender } = render(<Timeline items={items} />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("vertical");

    rerender(<Timeline items={items} orientation="horizontal" />);
    expect(root).toHaveClass("horizontal");
  });

  it("should be rendered as given in contentPosition prop", () => {
    const { container, rerender } = render(<Timeline items={items} />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("after");

    rerender(<Timeline items={items} contentPosition="before" />);
    expect(root).toHaveClass("before");

    rerender(<Timeline items={items} contentPosition="alternate" />);
    expect(root).toHaveClass("alternate");
  });

  it("should be rendered as given in textAlign prop", () => {
    const { container, rerender } = render(<Timeline items={items} />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("start");

    rerender(<Timeline items={items} textAlign="center" />);
    expect(root).toHaveClass("center");

    rerender(<Timeline items={items} textAlign="end" />);
    expect(root).toHaveClass("end");
  });

  it("should be rendered in the variant given in the variant prop", () => {
    const variants: TimelineVariant[] = ["primary", "secondary", "success", "warning", "danger", "light"];
    variants.forEach(variant => {
      const { container, unmount } = render(<Timeline items={items} variant={variant} />);
      expect(container.firstChild).toHaveClass(variant);
      unmount();
    });
  });

  it("should be rendered as given in markerType prop", () => {
    const markerTypes: TimelineMarkerType[] = ["dot", "number", "icon"];
    markerTypes.forEach(markerType => {
      const { container, unmount } = render(<Timeline items={items} markerType={markerType} />);
      expect(container.firstChild).toHaveClass(markerType);
      unmount();
    });
  });

  it("should render the correct number of items", () => {
    const { container } = render(<Timeline items={items} />);
    expect(container.firstChild?.childNodes.length).toBe(items.length);
  });

  it("should render item title text", () => {
    render(<Timeline items={[{ title: "My Title" }]} />);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("should render item content text", () => {
    render(<Timeline items={[{ content: "My Content" }]} />);
    expect(screen.getByText("My Content")).toBeInTheDocument();
  });

  it("should render title and content when both are provided", () => {
    render(<Timeline items={[{ title: "My Title", content: "My Content" }]} />);
    expect(screen.getByText("My Title")).toBeInTheDocument();
    expect(screen.getByText("My Content")).toBeInTheDocument();
  });

  it("should not render content span when only title is provided", () => {
    const { container } = render(<Timeline items={[{ title: "My Title" }]} />);
    expect(container.querySelector(".title")).toBeInTheDocument();
    expect(container.querySelector(".content")).not.toBeInTheDocument();
  });

  it("should not render title span when only content is provided", () => {
    const { container } = render(<Timeline items={[{ content: "My Content" }]} />);
    expect(container.querySelector(".content")).toBeInTheDocument();
    expect(container.querySelector(".title")).not.toBeInTheDocument();
  });

  it("should not render section when item has neither title nor content", () => {
    const { container } = render(<Timeline items={[{}]} />);
    expect(container.querySelector(".section")).not.toBeInTheDocument();
  });

  it("should render number markers with correct incremental order when markerType is number", () => {
    const { container } = render(<Timeline items={items} markerType="number" />);
    const itemElements = container.querySelectorAll(".item");
    expect(itemElements[0].querySelector(".markerNumber")).toHaveTextContent("1");
    expect(itemElements[1].querySelector(".markerNumber")).toHaveTextContent("2");
    expect(itemElements[2].querySelector(".markerNumber")).toHaveTextContent("3");
  });

  it("should render default motif_ui icon when markerType is icon and no icon prop is set", () => {
    render(<Timeline items={[{ title: "Item" }]} markerType="icon" />);
    expect(screen.getByText("motif_ui")).toBeInTheDocument();
  });

  it("should render custom icon name when markerType is icon and icon prop is set", () => {
    render(<Timeline items={[{ title: "Item", icon: "check" }]} markerType="icon" />);
    expect(screen.getByText("check")).toBeInTheDocument();
  });

  it("should apply disabled class on item when disabled prop is true", () => {
    const { container } = render(<Timeline items={[{ title: "Item", disabled: true }]} />);
    expect(container.querySelector(".item")).toHaveClass("disabled");
  });

  it("should apply filled appearance class by default on items", () => {
    const { container } = render(<Timeline items={[{ title: "Item" }]} />);
    expect(container.querySelector(".item")).toHaveClass("filled");
  });

  it("should apply outlined appearance class when appearance prop is outlined", () => {
    const { container } = render(<Timeline items={[{ title: "Item", appearance: "outlined" }]} />);
    expect(container.querySelector(".item")).toHaveClass("outlined");
  });

  it("should apply item-level variant class only on the item that has variant prop", () => {
    const { container } = render(
      <Timeline items={[{ title: "Default item" }, { title: "Success item", variant: "success" }]} variant="primary" />,
    );
    const itemElements = container.querySelectorAll(".item");
    expect(itemElements[0]).not.toHaveClass("success");
    expect(itemElements[1]).toHaveClass("success");
  });

  it("should apply item-level variant for all item variant values", () => {
    const variants: TimelineVariant[] = ["primary", "secondary", "success", "warning", "danger", "light"];
    variants.forEach(variant => {
      const { container, unmount } = render(<Timeline items={[{ title: "Item", variant }]} />);
      expect(container.querySelector(".item")).toHaveClass(variant);
      unmount();
    });
  });

  it("should not render any items when items array is empty", () => {
    const { container } = render(<Timeline items={[]} />);
    expect(container.firstChild?.childNodes.length).toBe(0);
  });
});
