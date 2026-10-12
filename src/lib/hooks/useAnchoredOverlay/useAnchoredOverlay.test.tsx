import { act, fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { createPortal } from "react-dom";
import useAnchoredOverlay from "./useAnchoredOverlay";
import { browserClick } from "../../../utils/testUtils";
import { OverlayCloseReason } from "src/lib/types";

const TestOverlay = ({ onClose }: { onClose: (reason?: OverlayCloseReason) => void }) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { attached, style, placement, overlayRef, toggle } = useAnchoredOverlay({
    anchorRef,
    placement: "bottomLeft",
    onClose,
    closeOnOutsideClick: true,
    closeOnEscape: true,
  });

  return (
    <>
      <button ref={anchorRef} onClick={toggle}>
        anchor
      </button>
      <div>outside</div>
      {attached &&
        createPortal(
          <div ref={overlayRef} style={style} data-testid="overlay" data-placement={placement}>
            <button>inside</button>
          </div>,
          document.body,
        )}
    </>
  );
};

describe("useAnchoredOverlay", () => {
  it("should open, position and close the overlay with the given dismiss options", () => {
    const onClose = jest.fn();
    render(<TestOverlay onClose={onClose} />);

    browserClick(screen.getByText("anchor"));
    const overlay = screen.getByTestId("overlay");
    expect(overlay).toHaveAttribute("data-placement", "bottomLeft");
    expect(overlay.style.visibility).toBe("");

    browserClick(screen.getByText("inside"));
    expect(screen.getByTestId("overlay")).toBeInTheDocument();

    browserClick(screen.getByText("outside"));
    expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledWith("outsideClick");
  });

  it("should close on Escape", () => {
    const onClose = jest.fn();
    render(<TestOverlay onClose={onClose} />);

    browserClick(screen.getByText("anchor"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledWith("escape");
  });

  it("should toggle when the anchor is clicked with toggleOnAnchorClick, also after the anchor node is replaced", () => {
    const ClickToggled = ({ anchorKey }: { anchorKey: string }) => {
      const anchorRef = useRef<HTMLButtonElement>(null);
      const { attached, overlayRef } = useAnchoredOverlay({ anchorRef, placement: "bottom", toggleOnAnchorClick: true });
      return (
        <>
          <button key={anchorKey} ref={anchorRef}>
            anchor
          </button>
          {attached && createPortal(<div ref={overlayRef} data-testid="overlay" />, document.body)}
        </>
      );
    };
    const { rerender } = render(<ClickToggled anchorKey="first" />);
    browserClick(screen.getByText("anchor"));
    expect(screen.getByTestId("overlay")).toBeInTheDocument();
    browserClick(screen.getByText("anchor"));
    expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();

    rerender(<ClickToggled anchorKey="second" />);
    browserClick(screen.getByText("anchor"));
    expect(screen.getByTestId("overlay")).toBeInTheDocument();
  });

  it("should not toggle on anchor clicks without toggleOnAnchorClick", () => {
    const NotToggled = () => {
      const anchorRef = useRef<HTMLButtonElement>(null);
      const { attached, overlayRef } = useAnchoredOverlay({ anchorRef, placement: "bottom" });
      return (
        <>
          <button ref={anchorRef}>anchor</button>
          {attached && createPortal(<div ref={overlayRef} data-testid="overlay" />, document.body)}
        </>
      );
    };
    render(<NotToggled />);
    browserClick(screen.getByText("anchor"));
    expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
  });

  describe("with openOnHover", () => {
    const Hovered = ({ onClose }: { onClose?: (reason: OverlayCloseReason) => void }) => {
      const anchorRef = useRef<HTMLButtonElement>(null);
      const { attached, overlayRef } = useAnchoredOverlay({ anchorRef, placement: "top", openOnHover: true, onClose });
      return (
        <>
          <button ref={anchorRef}>anchor</button>
          <div>outside</div>
          {attached && createPortal(<div ref={overlayRef} data-testid="overlay" tabIndex={-1} />, document.body)}
        </>
      );
    };

    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it("should open on hover and close a moment after the pointer leaves the anchor and the overlay", () => {
      const onClose = jest.fn();
      render(<Hovered onClose={onClose} />);
      const anchor = screen.getByText("anchor");

      fireEvent.mouseOver(anchor);
      const overlay = screen.getByTestId("overlay");

      // crossing the gap to the overlay keeps it open
      fireEvent.mouseOut(anchor, { relatedTarget: document.body });
      act(() => void jest.advanceTimersByTime(50));
      fireEvent.mouseOver(overlay);
      act(() => void jest.advanceTimersByTime(200));
      expect(screen.getByTestId("overlay")).toBeInTheDocument();

      fireEvent.mouseOut(overlay, { relatedTarget: screen.getByText("outside") });
      act(() => void jest.advanceTimersByTime(100));
      expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
      expect(onClose).toHaveBeenCalledWith("hoverLeave");
    });

    it("should open when the anchor is focused and close when the focus leaves", () => {
      const onClose = jest.fn();
      render(<Hovered onClose={onClose} />);
      const anchor = screen.getByText("anchor");

      fireEvent.focusIn(anchor);
      expect(screen.getByTestId("overlay")).toBeInTheDocument();

      fireEvent.focusOut(anchor, { relatedTarget: null });
      act(() => void jest.advanceTimersByTime(100));
      expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
      expect(onClose).toHaveBeenCalledWith("focusLeave");
    });
  });

  it("should make the overlay as wide as the anchor with matchAnchorWidth", () => {
    const Matched = () => {
      const anchorRef = useRef<HTMLButtonElement>(null);
      const { attached, overlayRef } = useAnchoredOverlay({ anchorRef, placement: "bottom", matchAnchorWidth: true, defaultOpen: true });
      return (
        <>
          <button ref={anchorRef}>anchor</button>
          {attached && createPortal(<div ref={overlayRef} data-testid="overlay" />, document.body)}
        </>
      );
    };
    jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(new DOMRect(10, 10, 240, 30));
    render(<Matched />);
    expect(screen.getByTestId("overlay").style.width).toBe("240px");
    expect(screen.getByTestId("overlay").style.boxSizing).toBe("border-box");
    jest.restoreAllMocks();
  });
});
