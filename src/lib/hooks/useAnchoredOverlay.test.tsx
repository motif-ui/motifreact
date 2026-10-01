import { act, fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { createPortal } from "react-dom";
import useAnchoredOverlay from "./useAnchoredOverlay";
import { OverlayCloseReason } from "src/lib/types";

const TestOverlay = ({ onClose }: { onClose: (reason: OverlayCloseReason) => void }) => {
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

    act(() => screen.getByText("anchor").click());
    const overlay = screen.getByTestId("overlay");
    expect(overlay).toHaveAttribute("data-placement", "bottomLeft");
    expect(overlay.style.visibility).toBe("");

    fireEvent.mouseUp(screen.getByText("inside"));
    expect(screen.getByTestId("overlay")).toBeInTheDocument();

    fireEvent.mouseUp(screen.getByText("outside"));
    expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledWith("outsideClick");
  });

  it("should close on Escape", () => {
    const onClose = jest.fn();
    render(<TestOverlay onClose={onClose} />);

    act(() => screen.getByText("anchor").click());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledWith("escape");
  });
});
