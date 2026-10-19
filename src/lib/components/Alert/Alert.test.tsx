import "@testing-library/jest-dom";
import Alert from "@/components/Alert/Alert";
import { fireEvent, render, screen, act } from "@testing-library/react";
import { runSnapshotDefaultsAndStandardPropsTest } from "../../../utils/testUtils";
import { StandardPropsWithRef, Variant } from "../../../lib/types";
describe("Alert", () => {
  runSnapshotDefaultsAndStandardPropsTest(
    (props: StandardPropsWithRef<HTMLDivElement>) => render(<Alert message="This is a test message" {...props} />),
    {
      // variant: secondary
      assertDefaults: ({ getByText }) => expect(getByText("info")).toBeInTheDocument(),
    },
  );

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
    const variantIcons: [Variant, string][] = [
      ["primary", "info"],
      ["secondary", "info"],
      ["info", "info"],
      ["success", "check_circle"],
      ["warning", "warning"],
      ["danger", "error"],
    ];
    variantIcons.forEach(([variant, icon]) => {
      const { container, getByText, unmount } = render(<Alert variant={variant} message="Alert Message" />);
      expect(container.firstChild).toHaveClass(variant);
      expect(getByText(icon)).toBeInTheDocument();
      unmount();
    });
  });

  it("should call onClose callback when close button is clicked", () => {
    jest.useFakeTimers();
    const onClose = jest.fn();
    render(<Alert message="Alert Message" closable onClose={onClose} />);
    fireEvent.click(screen.queryByText("close") as HTMLElement);
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
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
