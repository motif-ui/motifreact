import Drawer from "@/components/Drawer/Drawer.tsx";
import { fireEvent, render, screen, cleanup, act } from "@testing-library/react";
import { Size3, StandardPropsWithRef } from "../../../types.ts";
import { DrawerPosition } from "../types.ts";
import { userEvent } from "@testing-library/user-event";
import { runSnapshotDefaultsAndStandardPropsTest } from "src/utils/testUtils.tsx";

const CONTENT = "Test content";

describe("Drawer", () => {
  runSnapshotDefaultsAndStandardPropsTest(
    (props: StandardPropsWithRef<HTMLDivElement>) =>
      render(
        <Drawer open {...props}>
          {CONTENT}
        </Drawer>,
      ),
    {
      getRoot: () => screen.queryByTestId("drawerBackdrop"),
      assertDefaults: () => {
        const root = screen.getByTestId("drawerBackdrop");
        // position: left
        expect(root).toHaveClass("left");
        // size: md
        expect(root).toHaveClass("md");
        // removeBackdrop: false
        expect(root).not.toHaveClass("removeBackdrop");
      },
    },
  );

  it("should render the drawer when open is true", () => {
    const { rerender } = render(<Drawer open={false}>{CONTENT}</Drawer>);
    expect(screen.queryByText(CONTENT)).not.toBeInTheDocument();
    rerender(<Drawer open>{CONTENT}</Drawer>);
    expect(screen.getByText(CONTENT)).toBeInTheDocument();
  });

  it("should slide in after opening and slide out before unmounting when open changes from true to false", () => {
    jest.useFakeTimers();
    const { rerender } = render(<Drawer open>{CONTENT}</Drawer>);
    const backdrop = screen.getByTestId("drawerBackdrop");
    expect(backdrop).not.toHaveClass("show");

    // The enter transition starts after two animation frames
    act(() => jest.runOnlyPendingTimers());
    act(() => jest.runOnlyPendingTimers());
    expect(backdrop).toHaveClass("show");

    rerender(<Drawer open={false}>{CONTENT}</Drawer>);
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
      <Drawer open onAfterClose={handleAfterClose}>
        {CONTENT}
      </Drawer>,
    );

    rerender(
      <Drawer open={false} onAfterClose={handleAfterClose}>
        {CONTENT}
      </Drawer>,
    );
    expect(handleAfterClose).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(300));
    expect(handleAfterClose).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it("should render title given in the title prop", () => {
    render(
      <Drawer open title="Drawer Title">
        {CONTENT}
      </Drawer>,
    );
    expect(screen.getByText("Drawer Title")).toBeInTheDocument();
  });

  it("should render close button to close the drawer when closable is true", async () => {
    const user = userEvent.setup({ delay: null });
    jest.useFakeTimers();

    const handleClose = jest.fn();
    const { rerender } = render(
      <Drawer open closable onClose={handleClose}>
        {CONTENT}
      </Drawer>,
    );
    const closeIcon = screen.getByTestId("iconButtonTestId");
    await act(async () => {
      await user.click(closeIcon);
      jest.advanceTimersByTime(300);
    });
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledWith("closeButton");

    rerender(
      <Drawer open closable={false} onClose={handleClose}>
        {CONTENT}
      </Drawer>,
    );
    expect(screen.queryByTestId("iconButtonTestId")).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  it("should close the drawer when clicked outside of it only when closable prop is true", async () => {
    const user = userEvent.setup({ delay: null });
    jest.useFakeTimers();

    const handleClose = jest.fn();
    const { rerender } = render(
      <Drawer open closable={false} onClose={handleClose}>
        {CONTENT}
      </Drawer>,
    );
    fireEvent.click(screen.getByTestId("drawerBackdrop"));
    expect(handleClose).not.toHaveBeenCalled();

    rerender(
      <Drawer open closable onClose={handleClose}>
        {CONTENT}
      </Drawer>,
    );
    await act(async () => {
      await user.click(screen.getByTestId("drawerBackdrop"));
      jest.advanceTimersByTime(300);
    });
    expect(handleClose).toHaveBeenCalledWith("outsideClick");
    jest.useRealTimers();
  });

  it("should close the drawer on Escape only when closable prop is true", () => {
    const handleClose = jest.fn();
    const { rerender } = render(
      <Drawer open closable={false} onClose={handleClose}>
        {CONTENT}
      </Drawer>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(handleClose).not.toHaveBeenCalled();

    rerender(
      <Drawer open closable onClose={handleClose}>
        {CONTENT}
      </Drawer>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledWith("escape");
  });

  it("should render children with the given content", () => {
    render(
      <Drawer open>
        <div>Child Content</div>
      </Drawer>,
    );
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("should be rendered with the given position in position prop", () => {
    const positions: DrawerPosition[] = ["top", "bottom", "left", "right"];
    positions.forEach(position => {
      render(
        <Drawer open position={position}>
          {CONTENT}
        </Drawer>,
      );
      expect(screen.getByTestId("drawerBackdrop")).toHaveClass(position);
      cleanup();
    });
  });

  it("should render in the width given in the size prop", () => {
    const sizes: Size3[] = ["sm", "md", "lg"];
    sizes.forEach(size => {
      render(
        <Drawer open size={size}>
          {CONTENT}
        </Drawer>,
      );
      expect(screen.getByTestId("drawerBackdrop")).toHaveClass(size);
      cleanup();
    });
  });

  it("should render without the backdrop when removeBackdrop is true", () => {
    render(
      <Drawer open removeBackdrop>
        {CONTENT}
      </Drawer>,
    );
    expect(screen.getByTestId("drawerBackdrop")).toHaveClass("removeBackdrop");
  });

  it("should add padding to the content only when includePadding is true", () => {
    const { rerender } = render(<Drawer open>{CONTENT}</Drawer>);
    expect(screen.getByTestId("drawerBackdrop")).not.toHaveClass("includePadding");

    rerender(
      <Drawer open includePadding>
        {CONTENT}
      </Drawer>,
    );
    expect(screen.getByTestId("drawerBackdrop")).toHaveClass("includePadding");
  });
});
