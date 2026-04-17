import "@testing-library/jest-dom";
import Alert from "@/components/Alert/Alert";
import { fireEvent, render, screen, act } from "@testing-library/react";

describe("Alert", () => {
  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { container, getByText } = render(<Alert message="This is a test message" />);
    expect(container).toMatchSnapshot();

    // variant: secondary
    expect(getByText("info")).toBeInTheDocument();
  });

  it("should be rendered with the given message in message prop", () => {
    render(<Alert message="Alert Message" />);
    expect(screen.getByText("Alert Message")).toBeInTheDocument();
  });

  it("should display title when title prop is given", () => {
    render(<Alert title="Alert Title" message="Alert Message" />);
    expect(screen.getByText("Alert Title")).toBeInTheDocument();
  });

  it("should hide icon when hideIcon prop is given", () => {
    render(<Alert message="Alert Message" hideIcon />);
    expect(screen.queryByText("info")).not.toBeInTheDocument();
  });

  it("should display close button when closable prop is given", () => {
    render(<Alert message="Alert Message" closable />);
    expect(screen.queryByText("close")).toBeInTheDocument();
  });

  it("should close the alert when close button is clicked", () => {
    jest.useFakeTimers();
    render(<Alert message="Alert Message" closable />);
    fireEvent.click(screen.queryByText("close") as HTMLElement);
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(screen.queryByText("Alert Message")).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  it("should be rendered in the color set of the variant that is given in the variant prop", () => {
    const { rerender, container } = render(<Alert variant="success" message="Alert Message" />);
    const alertContainer = container.firstChild;

    expect(alertContainer).toHaveClass("success");
    expect(screen.queryByText("check_circle")).toBeInTheDocument();

    rerender(<Alert variant="warning" message="Alert Message" />);
    expect(alertContainer).toHaveClass("warning");
    expect(screen.queryByText("warning")).toBeInTheDocument();

    rerender(<Alert variant="secondary" message="Alert Message" />);
    expect(alertContainer).toHaveClass("secondary");
    expect(screen.queryByText("info")).toBeInTheDocument();

    rerender(<Alert variant="danger" message="Alert Message" />);
    expect(alertContainer).toHaveClass("danger");
    expect(screen.queryByText("error")).toBeInTheDocument();

    rerender(<Alert variant="info" message="Alert Message" />);
    expect(alertContainer).toHaveClass("info");
    expect(screen.queryByText("info")).toBeInTheDocument();
  });

  it("should render given children as custom content", () => {
    render(
      <Alert>
        <div>Custom Child Content</div>
      </Alert>,
    );
    expect(screen.getByText("Custom Child Content")).toBeInTheDocument();
  });
});
