import "@testing-library/jest-dom";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { render, screen } from "@testing-library/react";
import { runIconPropTest } from "@/components/Motif/GlobalIconWrapper/GlobalIconWrapper.test";

describe("Breadcrumb", () => {
  const testItems = [
    { label: "Ana Sayfa", path: "https://www.motif-ui.com" },
    { label: "Kurumlar", path: "https://www.motif-ui.com" },
    { label: "Google", path: "https://google.com" },
    { label: "Microsoft", path: "https://microsoft.com" },
    { label: "Motif", path: "https://www.motif-ui.com" },
  ];

  it("should render with only required props", () => {
    expect(render(<Breadcrumb items={testItems} />).container).toMatchSnapshot();
  });

  it("should render the right number of elements", () => {
    render(<Breadcrumb items={testItems} maxVisibleItems={5} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });
  it("should render the right number of elements", () => {
    render(<Breadcrumb items={testItems} maxVisibleItems={testItems.length} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(testItems.length);
  });

  it("should render all items when maxVisibleItems is larger than items length", () => {
    render(<Breadcrumb items={testItems} maxVisibleItems={testItems.length + 2} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(testItems.length);
  });

  it("should collapse items when maxVisibleItems value is exceeded", () => {
    const itemCount = 2;
    render(<Breadcrumb items={testItems} maxVisibleItems={itemCount} />);
    expect(screen.queryByText("...")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(itemCount + 1);
  });

  runIconPropTest(icon => render(<Breadcrumb items={testItems} homeIcon={icon} />), "homepage-icon");

  it("should render links to all items  without collapse", () => {
    render(<Breadcrumb items={testItems} maxVisibleItems={5} />);

    testItems.forEach((item, index) => {
      if (item.path) {
        const breadcrumbItem = screen.getAllByTestId("breadcrumb")[index];
        const linkElement = breadcrumbItem.querySelector("a");
        if (linkElement) {
          expect(linkElement).toBeInTheDocument();
          expect(linkElement.getAttribute("href")).toBe(item.path);
        }
      }
    });
  });

  it("should put collapsing three dots to the position defined in collapsedPosition prop", () => {
    const { rerender } = render(<Breadcrumb items={testItems} maxVisibleItems={2} collapsedPosition="right" />);
    const breadcrumbItemsRight = screen.getAllByTestId("breadcrumb");
    expect(breadcrumbItemsRight[breadcrumbItemsRight.length - 2].textContent).toContain("...");
    expect(breadcrumbItemsRight[breadcrumbItemsRight.length - 1].textContent).toContain(testItems[testItems.length - 1].label);

    rerender(<Breadcrumb items={testItems} maxVisibleItems={2} collapsedPosition="left" />);
    const breadcrumbItemsLeft = screen.getAllByTestId("breadcrumb");
    expect(breadcrumbItemsLeft[0].textContent).toContain(testItems[0].label);
    expect(breadcrumbItemsLeft[1].textContent).toContain("...");
  });

  it("should not display collapsing three dots when the number of items is less than maxVisibleItems and collapsedPosition is right and left ", () => {
    const { rerender } = render(<Breadcrumb items={testItems} maxVisibleItems={testItems.length + 1} collapsedPosition="right" />);
    expect(screen.queryByText("...")).not.toBeInTheDocument();
    rerender(<Breadcrumb items={testItems} maxVisibleItems={testItems.length + 1} collapsedPosition="left" />);
    expect(screen.queryByText("...")).not.toBeInTheDocument();
  });

  it("should not display items when the maxVisibleItems is less than 0 and collapsedPosition is right and left ", () => {
    const { rerender } = render(<Breadcrumb items={testItems} maxVisibleItems={-2} collapsedPosition="right" />);
    expect(screen.queryByTestId("breadcrumb")).toBeNull();
    rerender(<Breadcrumb items={testItems} maxVisibleItems={-2} collapsedPosition="left" />);
    expect(screen.queryByTestId("breadcrumb")).toBeNull();
  });
});
