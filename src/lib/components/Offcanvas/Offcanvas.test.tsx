import Offcanvas from "@/components/Offcanvas/Offcanvas";
import { fireEvent, render, screen, cleanup, act } from "@testing-library/react";
import { Size3, StandardPropsWithRef } from "../../types";
import { OffcanvasPosition } from "./types";
import { userEvent } from "@testing-library/user-event";
import { runSnapshotDefaultsAndStandardPropsTest } from "src/utils/testUtils.tsx";

describe("Offcanvas", () => {
  runSnapshotDefaultsAndStandardPropsTest(
    (props: StandardPropsWithRef<HTMLDivElement>) =>
      render(
        <Offcanvas open {...props}>
          Test Content
        </Offcanvas>,
      ),
    { getRoot: () => screen.queryByTestId("offcanvasBackdrop") },
  );

  it("should render the offcanvas when open is true", () => {
    const { rerender } = render(<Offcanvas open={false}>Test content</Offcanvas>);
    expect(screen.queryByText("Test content")).not.toBeInTheDocument();
    rerender(<Offcanvas open>Test content</Offcanvas>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("should unmount the offcanvas when open changes from true to false", () => {
    const { rerender } = render(<Offcanvas open>Test content</Offcanvas>);
    expect(screen.getByText("Test content")).toBeInTheDocument();

    act(() => {
      rerender(<Offcanvas open={false}>Test content</Offcanvas>);
    });
    expect(screen.queryByText("Test content")).not.toBeInTheDocument();
  });

  it("should render title given in the title prop", () => {
    render(
      <Offcanvas open title="Offcanvas Title">
        Test content
      </Offcanvas>,
    );
    expect(screen.getByText("Offcanvas Title")).toBeInTheDocument();
  });

  it("should render close button to close the offcanvas when closable is true", () => {
    const handleClose = jest.fn();
    const { rerender } = render(
      <Offcanvas open closable onClose={handleClose}>
        Test content
      </Offcanvas>,
    );
    const closeIcon = screen.getByTestId("iconButtonTestId");
    expect(closeIcon).toBeInTheDocument();
    fireEvent.click(closeIcon);
    expect(handleClose).toHaveBeenCalledTimes(1);
    rerender(
      <Offcanvas open closable={false} onClose={handleClose}>
        Test content
      </Offcanvas>,
    );
    expect(screen.queryByTestId("iconButtonTestId")).not.toBeInTheDocument();
  });

  it("should close the offcanvas when clicked outside of it when closable prop is true", async () => {
    const user = userEvent.setup();

    const handleClose = jest.fn();
    const { rerender } = render(
      <Offcanvas open closable onClose={handleClose}>
        Test content
      </Offcanvas>,
    );

    await user.click(screen.getByTestId("offcanvasBackdrop"));
    expect(handleClose).toHaveBeenCalled();

    const handleClose2 = jest.fn();
    rerender(
      <Offcanvas open closable={false} onClose={handleClose2}>
        Test content
      </Offcanvas>,
    );
    fireEvent.click(screen.getByTestId("offcanvasBackdrop"));
    expect(handleClose2).not.toHaveBeenCalled();
  });

  it("should render children with the given content", () => {
    render(
      <Offcanvas open>
        <div>Child Content</div>
      </Offcanvas>,
    );
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("should have a default position of left", () => {
    render(<Offcanvas open>Test content</Offcanvas>);
    expect(screen.getByTestId("offcanvasBackdrop")).toHaveClass("left");
  });

  it("should be rendered with the given position in position prop", () => {
    const positions: OffcanvasPosition[] = ["top", "bottom", "left", "right"];
    for (const position of positions) {
      render(
        <Offcanvas open position={position}>
          Test content
        </Offcanvas>,
      );

      expect(screen.getByTestId("offcanvasBackdrop")).toHaveClass(position);
      cleanup();
    }
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes: Size3[] = ["sm", "md", "lg"];
    for (const size of sizes) {
      render(
        <Offcanvas open size={size}>
          Test content
        </Offcanvas>,
      );

      expect(screen.getByTestId("offcanvasBackdrop")).toHaveClass(size);
      cleanup();
    }
  });

  it("should not have the hideBackdrop class by default", () => {
    render(<Offcanvas open>Test content</Offcanvas>);
    expect(screen.getByTestId("offcanvasBackdrop")).not.toHaveClass("hideBackdrop");
  });

  it("should render without the darkened backdrop when hideBackdrop is true", () => {
    render(
      <Offcanvas open hideBackdrop>
        Test content
      </Offcanvas>,
    );
    expect(screen.getByTestId("offcanvasBackdrop")).toHaveClass("hideBackdrop");
  });
});
