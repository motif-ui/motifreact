import Offcanvas from "@/components/Offcanvas/Offcanvas";
import { fireEvent, render, screen, cleanup, act } from "@testing-library/react";
import { Size3, StandardPropsWithRef } from "../../types";
import { OffcanvasPosition } from "./types";
import { userEvent } from "@testing-library/user-event";
import { runSnapshotDefaultsAndStandardPropsTest } from "src/utils/testUtils.tsx";

const CONTENT = "Test content";

describe("Offcanvas", () => {
  runSnapshotDefaultsAndStandardPropsTest(
    (props: StandardPropsWithRef<HTMLDivElement>) =>
      render(
        <Offcanvas open {...props}>
          {CONTENT}
        </Offcanvas>,
      ),
    {
      getRoot: () => screen.queryByTestId("offcanvasBackdrop"),
      assertDefaults: () => {
        const root = screen.getByTestId("offcanvasBackdrop");
        // position: left
        expect(root).toHaveClass("left");
        // size: md
        expect(root).toHaveClass("md");
        // removeBackdrop: false
        expect(root).not.toHaveClass("removeBackdrop");
      },
    },
  );

  it("should render the offcanvas when open is true", () => {
    const { rerender } = render(<Offcanvas open={false}>{CONTENT}</Offcanvas>);
    expect(screen.queryByText(CONTENT)).not.toBeInTheDocument();
    rerender(<Offcanvas open>{CONTENT}</Offcanvas>);
    expect(screen.getByText(CONTENT)).toBeInTheDocument();
  });

  it("should slide in after opening and slide out before unmounting when open changes from true to false", () => {
    jest.useFakeTimers();
    const { rerender } = render(<Offcanvas open>{CONTENT}</Offcanvas>);
    const backdrop = screen.getByTestId("offcanvasBackdrop");
    expect(backdrop).not.toHaveClass("show");

    // The enter transition starts after two animation frames
    act(() => jest.runOnlyPendingTimers());
    act(() => jest.runOnlyPendingTimers());
    expect(backdrop).toHaveClass("show");

    rerender(<Offcanvas open={false}>{CONTENT}</Offcanvas>);
    expect(backdrop).not.toHaveClass("show");
    expect(screen.getByText(CONTENT)).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(300));
    expect(screen.queryByText(CONTENT)).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  it("should call onAfterClose once the exit transition has ended", () => {
    jest.useFakeTimers();
    const handleAfterClose = jest.fn();
    const { rerender } = render(
      <Offcanvas open onAfterClose={handleAfterClose}>
        {CONTENT}
      </Offcanvas>,
    );

    rerender(
      <Offcanvas open={false} onAfterClose={handleAfterClose}>
        {CONTENT}
      </Offcanvas>,
    );
    expect(handleAfterClose).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(300));
    expect(handleAfterClose).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it("should render title given in the title prop", () => {
    render(
      <Offcanvas open title="Offcanvas Title">
        {CONTENT}
      </Offcanvas>,
    );
    expect(screen.getByText("Offcanvas Title")).toBeInTheDocument();
  });

  it("should render close button to close the offcanvas when closable is true", async () => {
    const user = userEvent.setup({ delay: null });
    jest.useFakeTimers();

    const handleClose = jest.fn();
    const { rerender } = render(
      <Offcanvas open closable onClose={handleClose}>
        {CONTENT}
      </Offcanvas>,
    );
    const closeIcon = screen.getByTestId("iconButtonTestId");
    await act(async () => {
      await user.click(closeIcon);
      jest.advanceTimersByTime(300);
    });
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledWith("closeButton");

    rerender(
      <Offcanvas open closable={false} onClose={handleClose}>
        {CONTENT}
      </Offcanvas>,
    );
    expect(screen.queryByTestId("iconButtonTestId")).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  it("should close the offcanvas when clicked outside of it only when closable prop is true", async () => {
    const user = userEvent.setup({ delay: null });
    jest.useFakeTimers();

    const handleClose = jest.fn();
    const { rerender } = render(
      <Offcanvas open closable={false} onClose={handleClose}>
        {CONTENT}
      </Offcanvas>,
    );
    fireEvent.click(screen.getByTestId("offcanvasBackdrop"));
    expect(handleClose).not.toHaveBeenCalled();

    rerender(
      <Offcanvas open closable onClose={handleClose}>
        {CONTENT}
      </Offcanvas>,
    );
    await act(async () => {
      await user.click(screen.getByTestId("offcanvasBackdrop"));
      jest.advanceTimersByTime(300);
    });
    expect(handleClose).toHaveBeenCalledWith("outsideClick");
    jest.useRealTimers();
  });

  it("should close the offcanvas on Escape only when closable prop is true", () => {
    const handleClose = jest.fn();
    const { rerender } = render(
      <Offcanvas open closable={false} onClose={handleClose}>
        {CONTENT}
      </Offcanvas>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(handleClose).not.toHaveBeenCalled();

    rerender(
      <Offcanvas open closable onClose={handleClose}>
        {CONTENT}
      </Offcanvas>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledWith("escape");
  });

  it("should render children with the given content", () => {
    render(
      <Offcanvas open>
        <div>Child Content</div>
      </Offcanvas>,
    );
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("should be rendered with the given position in position prop", () => {
    const positions: OffcanvasPosition[] = ["top", "bottom", "left", "right"];
    positions.forEach(position => {
      render(
        <Offcanvas open position={position}>
          {CONTENT}
        </Offcanvas>,
      );
      expect(screen.getByTestId("offcanvasBackdrop")).toHaveClass(position);
      cleanup();
    });
  });

  it("should render in the width given in the size prop", () => {
    const sizes: Size3[] = ["sm", "md", "lg"];
    sizes.forEach(size => {
      render(
        <Offcanvas open size={size}>
          {CONTENT}
        </Offcanvas>,
      );
      expect(screen.getByTestId("offcanvasBackdrop")).toHaveClass(size);
      cleanup();
    });
  });

  it("should render without the backdrop when removeBackdrop is true", () => {
    render(
      <Offcanvas open removeBackdrop>
        {CONTENT}
      </Offcanvas>,
    );
    expect(screen.getByTestId("offcanvasBackdrop")).toHaveClass("removeBackdrop");
  });

  it("should add padding to the content only when includePadding is true", () => {
    const { rerender } = render(<Offcanvas open>{CONTENT}</Offcanvas>);
    expect(screen.getByTestId("offcanvasBackdrop")).not.toHaveClass("includePadding");

    rerender(
      <Offcanvas open includePadding>
        {CONTENT}
      </Offcanvas>,
    );
    expect(screen.getByTestId("offcanvasBackdrop")).toHaveClass("includePadding");
  });
});
