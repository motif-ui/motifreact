import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Pagination from "./Pagination";

describe("Pagination", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("should render pagination with correct number of pages", () => {
    render(<Pagination total={100} current={1} pageSize={10} onChange={mockOnChange} />);

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("should not render when total is 0", () => {
    render(<Pagination total={0} current={1} pageSize={10} onChange={mockOnChange} />);

    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("should not render when there is only one page", () => {
    render(<Pagination total={5} current={1} pageSize={10} onChange={mockOnChange} />);

    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("should call onChange when a page number is clicked", () => {
    render(<Pagination total={100} current={1} pageSize={10} onChange={mockOnChange} />);

    const page2Button = screen.getByText("2");
    fireEvent.click(page2Button);

    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  it("should call onChange when next button is clicked", () => {
    render(<Pagination total={100} current={1} pageSize={10} onChange={mockOnChange} />);

    const pagination = screen.getByTestId("pagination");
    const buttons = pagination.querySelectorAll("button");
    const nextButton = Array.from(buttons).find(btn => btn.className.includes("arrowIcon") && !btn.disabled);
    nextButton && fireEvent.click(nextButton);

    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  it("should call onChange when previous button is clicked", () => {
    render(<Pagination total={100} current={3} pageSize={10} onChange={mockOnChange} />);

    const pagination = screen.getByTestId("pagination");
    const buttons = pagination.querySelectorAll("button");
    const prevButton = Array.from(buttons).find(btn => btn.className.includes("arrowIcon"));

    if (prevButton) fireEvent.click(prevButton);

    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  it("should disable previous button on first page", () => {
    render(<Pagination total={100} current={1} pageSize={10} onChange={mockOnChange} />);

    const pagination = screen.getByTestId("pagination");
    const buttons = pagination.querySelectorAll("button");
    const prevButton = Array.from(buttons).find(btn => btn.className.includes("arrowIcon") && btn.disabled);

    expect(prevButton).toBeDisabled();
  });

  it("should disable next button on last page", () => {
    render(<Pagination total={100} current={10} pageSize={10} onChange={mockOnChange} />);

    const pagination = screen.getByTestId("pagination");
    const buttons = pagination.querySelectorAll("button");
    const nextButton = Array.from(buttons).find(btn => btn.className.includes("arrowIcon") && btn.disabled);

    expect(nextButton).toBeDisabled();
  });

  it("should show first page button when current page is greater than 2", () => {
    render(<Pagination total={100} current={5} pageSize={10} onChange={mockOnChange} />);

    const firstPageButton = screen.getByText("1");
    expect(firstPageButton).toBeInTheDocument();

    fireEvent.click(firstPageButton);
    expect(mockOnChange).toHaveBeenCalledWith(1);
  });

  it("should show last page button when current page is less than total pages - 1", () => {
    render(<Pagination total={100} current={5} pageSize={10} onChange={mockOnChange} />);

    const lastPageButton = screen.getByText("10");
    expect(lastPageButton).toBeInTheDocument();

    fireEvent.click(lastPageButton);
    expect(mockOnChange).toHaveBeenCalledWith(10);
  });

  it("should show ellipsis when there are hidden pages at the start", () => {
    render(<Pagination total={100} current={8} pageSize={10} onChange={mockOnChange} />);

    const pagination = screen.getByTestId("pagination");
    const separators = Array.from(pagination.querySelectorAll("span")).filter(
      span => span.className && span.className.includes("separator"),
    );
    expect(separators.length).toBeGreaterThan(0);
  });

  it("should show visible pages around current page", () => {
    render(<Pagination total={100} current={5} pageSize={10} onChange={mockOnChange} />);

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("should mark current page as active", () => {
    render(<Pagination total={100} current={5} pageSize={10} onChange={mockOnChange} />);

    expect(screen.getByText("5")).toHaveClass("active");
  });

  it("should apply correct size class", () => {
    const { rerender } = render(<Pagination total={100} current={1} pageSize={10} onChange={mockOnChange} size="sm" />);
    const pagination = screen.getByTestId("pagination");
    expect(pagination).toHaveClass("sm");

    rerender(<Pagination total={100} current={1} pageSize={10} onChange={mockOnChange} size="lg" />);
    expect(pagination).toHaveClass("lg");
  });

  it("should apply custom className", () => {
    render(<Pagination total={100} current={1} pageSize={10} onChange={mockOnChange} className="custom-class" />);

    expect(screen.getByTestId("pagination")).toHaveClass("custom-class");
  });

  it("should calculate correct total pages", () => {
    const { rerender } = render(<Pagination total={100} current={10} pageSize={10} onChange={mockOnChange} />);

    const pagination = screen.getByTestId("pagination");
    const buttons = pagination.querySelectorAll("button");
    const nextButton = Array.from(buttons).find(btn => btn.className.includes("arrowIcon") && btn.disabled);
    expect(nextButton).toBeDisabled();

    rerender(<Pagination total={95} current={10} pageSize={10} onChange={mockOnChange} />);
    expect(nextButton).toBeDisabled();

    rerender(<Pagination total={91} current={9} pageSize={10} onChange={mockOnChange} />);
    expect(nextButton).not.toBeDisabled();
  });

  it("should handle edge case with 2 pages", () => {
    render(<Pagination total={20} current={1} pageSize={10} onChange={mockOnChange} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    const pagination = screen.getByTestId("pagination");
    const separators = Array.from(pagination.querySelectorAll("span")).filter(
      span => span.className && span.className.includes("separator"),
    );
    expect(separators.length).toBe(0);
  });

  it("should handle edge case with 3 pages", () => {
    render(<Pagination total={30} current={2} pageSize={10} onChange={mockOnChange} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
