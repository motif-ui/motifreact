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

    // appearance: filled
    expect(container.querySelector(".item")).toHaveClass("filled");

    // disabled: false (default, no disabled class)
    expect(container.querySelector(".item")).not.toHaveClass("disabled");

    // icon: motif_ui (default when markerType is icon)
    const { container: iconContainer } = render(<Timeline items={[{ title: "Item" }]} markerType="icon" />);
    expect(iconContainer.textContent).toContain("motif_ui");
  });

  it("should be rendered as given in orientation prop", () => {
    const { container, rerender } = render(<Timeline items={items} />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("vertical");

    rerender(<Timeline items={items} orientation="horizontal" />);
    expect(root).toHaveClass("horizontal");
  });

  it("should position the content for each item as given in contentPosition prop", () => {
    const { container, rerender } = render(<Timeline items={items} />);
    const positions = ["after", "before", "alternate"] as const;
    positions.forEach(position => {
      rerender(<Timeline items={items} contentPosition={position} />);
      expect(container.firstChild).toHaveClass(position);
    });
  });

  it("should render the content aligned as given in textAlign prop", () => {
    const { container, rerender } = render(<Timeline items={items} />);
    const alignments = ["start", "center", "end"] as const;
    alignments.forEach(alignment => {
      rerender(<Timeline items={items} textAlign={alignment} />);
      expect(container.firstChild).toHaveClass(alignment);
    });
  });

  it("should render in the given variant", () => {
    const variants: TimelineVariant[] = ["primary", "secondary", "success", "warning", "danger", "light"];
    variants.forEach(variant => {
      const { container, unmount } = render(<Timeline items={items} variant={variant} />);
      expect(container.firstChild).toHaveClass(variant);
      unmount();
    });
  });

  it("should render the markers in appearance as given in markerType prop", () => {
    const markerTypes: TimelineMarkerType[] = ["dot", "number", "icon"];
    markerTypes.forEach(markerType => {
      const { container, unmount } = render(<Timeline items={items} markerType={markerType} />);
      expect(container.firstChild).toHaveClass(markerType);
      unmount();
    });
  });

  it("should render the correct number of items", () => {
    const { container } = render(<Timeline items={items} />);
    const itemElements = container.querySelectorAll(".item");
    itemElements.forEach((item, idx) => {
      expect(item.textContent).toContain(`Step ${idx + 1}`);
    });
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

  it("should render number markers with correct incremental order when markerType is number", () => {
    const { container } = render(<Timeline items={items} markerType="number" />);
    const itemElements = container.querySelectorAll(".item");
    itemElements.forEach((item, idx) => {
      expect(item.querySelector(".markerNumber")).toHaveTextContent(`${idx + 1}`);
    });
  });

  it("should render the icons in icon prop of the items only when markerType is icon", () => {
    const { rerender } = render(<Timeline items={[{ title: "Item", icon: "check" }]} markerType="icon" />);
    expect(screen.getByText("check")).toBeInTheDocument();

    rerender(<Timeline items={[{ title: "Item", icon: "check" }]} markerType="dot" />);
    expect(screen.queryByText("check")).not.toBeInTheDocument();
  });

  it("should render the item with disabled is true, as disabled", () => {
    const { container } = render(<Timeline items={[{ title: "Item", disabled: true }]} />);
    expect(container.querySelector(".item")).toHaveClass("disabled");
  });

  it("should render items in the appearance given in appearance prop", () => {
    const { container, rerender } = render(<Timeline items={[{ title: "Item", appearance: "filled" }]} />);
    expect(container.querySelector(".item")).toHaveClass("filled");

    rerender(<Timeline items={[{ title: "Item", appearance: "outlined" }]} />);
    expect(container.querySelector(".item")).toHaveClass("outlined");
  });

  it("should render the variant given in item when both Timeline variant and item variant are provided", () => {
    const { container } = render(<Timeline items={[{ title: "Item", variant: "success" }]} variant="primary" />);
    expect(container.querySelector(".item")).toHaveClass("success");
  });

  it("should render item in the given variant when variant prop in Timeline itself is not set", () => {
    const variants: TimelineVariant[] = ["primary", "secondary", "success", "warning", "danger", "light"];
    variants.forEach(variant => {
      const { container, unmount } = render(<Timeline items={[{ title: "Item", variant }]} />);
      expect(container.querySelector(".item")).toHaveClass(variant);
      unmount();
    });
  });
});
