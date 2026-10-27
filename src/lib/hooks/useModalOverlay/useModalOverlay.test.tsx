import { fireEvent, render, screen } from "@testing-library/react";
import { createPortal } from "react-dom";
import { browserClick } from "../../../utils/testUtils";
import useModalOverlay from "./useModalOverlay";
import { ModalOverlayProps } from "./types";

type Props = Partial<ModalOverlayProps> & { name: string; withPortal?: boolean };

const TestModal = ({ name, withPortal, open = true, ...props }: Props) => {
  const { attached, rootRef, dialogRef, insideProps } = useModalOverlay({ open, ...props });

  return (
    attached &&
    createPortal(
      <div data-testid={`${name}Backdrop`} ref={rootRef}>
        <div data-testid={`${name}Dialog`} ref={dialogRef} tabIndex={-1} {...insideProps}>
          <button>{name} first</button>
          <button>{name} last</button>
          {withPortal && createPortal(<button>{name} portal</button>, document.body)}
        </div>
      </div>,
      document.body,
    )
  );
};

describe("useModalOverlay", () => {
  const offsetParent = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetParent");

  beforeAll(() => {
    // jsdom does no layout, so offsetParent is always null. The hook uses it to skip hidden elements.
    Object.defineProperty(HTMLElement.prototype, "offsetParent", {
      configurable: true,
      get(this: HTMLElement) {
        return this.parentElement;
      },
    });
  });

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, "offsetParent", offsetParent!);
  });

  // Returns whether the default action was prevented, like the browser does for a moved focus
  const pressTab = (target: HTMLElement, shiftKey = false) => !fireEvent.keyDown(target, { key: "Tab", shiftKey });

  describe("dismiss", () => {
    it("should call onClose with the reason on an outside click and Escape when enabled", () => {
      const onClose = jest.fn();
      render(<TestModal name="modal" onClose={onClose} closeOnOutsideClick closeOnEscape />);

      browserClick(screen.getByTestId("modalDialog"));
      expect(onClose).not.toHaveBeenCalled();

      browserClick(screen.getByTestId("modalBackdrop"));
      expect(onClose).toHaveBeenLastCalledWith("outsideClick");

      fireEvent.keyDown(document, { key: "Escape" });
      expect(onClose).toHaveBeenLastCalledWith("escape");
    });

    it("should not call onClose when it is not enabled", () => {
      const onClose = jest.fn();
      render(<TestModal name="modal" onClose={onClose} />);

      browserClick(screen.getByTestId("modalBackdrop"));
      fireEvent.keyDown(document, { key: "Escape" });
      expect(onClose).not.toHaveBeenCalled();
    });

    it("should not close on a click in an overlay rendered in its own portal from the dialog, e.g. a popover", () => {
      const onClose = jest.fn();
      render(<TestModal name="modal" onClose={onClose} closeOnOutsideClick withPortal />);

      browserClick(screen.getByText("modal portal"));
      expect(onClose).not.toHaveBeenCalled();
    });

    it("should close only the topmost modal, e.g. a confirmation opened over a modal", () => {
      const onBelowClose = jest.fn();
      const onAboveClose = jest.fn();
      render(<TestModal name="below" onClose={onBelowClose} closeOnOutsideClick closeOnEscape />);
      render(<TestModal name="above" onClose={onAboveClose} closeOnOutsideClick closeOnEscape />);

      browserClick(screen.getByTestId("aboveBackdrop"));
      fireEvent.keyDown(document, { key: "Escape" });
      expect(onAboveClose).toHaveBeenCalledTimes(2);
      expect(onBelowClose).not.toHaveBeenCalled();
    });

    it("should not let Escape close the modal below one that does not close on Escape", () => {
      const onClose = jest.fn();
      render(<TestModal name="below" onClose={onClose} closeOnEscape />);
      render(<TestModal name="above" />);

      fireEvent.keyDown(document, { key: "Escape" });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("scroll lock", () => {
    it("should lock the page's scroll while it is open", () => {
      const { rerender } = render(<TestModal name="modal" />);
      expect(document.documentElement.style.overflow).toBe("hidden");

      rerender(<TestModal name="modal" open={false} />);
      expect(document.documentElement.style.overflow).toBe("");
    });
  });

  describe("focus", () => {
    it("should move the focus into the dialog on open and back to the opener on close", () => {
      const opener = document.createElement("button");
      document.body.append(opener);
      opener.focus();

      const { rerender } = render(<TestModal name="modal" />);
      expect(screen.getByTestId("modalDialog")).toHaveFocus();

      rerender(<TestModal name="modal" open={false} />);
      expect(opener).toHaveFocus();
      opener.remove();
    });

    it("should not move the focus back when the user moved it elsewhere", () => {
      const opener = document.createElement("button");
      document.body.append(opener);
      opener.focus();
      const { rerender } = render(<TestModal name="below" />);
      const { rerender: rerenderAbove } = render(<TestModal name="above" />);

      // The focus is in the modal opened above when the one below closes
      rerender(<TestModal name="below" open={false} />);
      expect(screen.getByTestId("aboveDialog")).toHaveFocus();

      rerenderAbove(<TestModal name="above" open={false} />);
      opener.remove();
    });

    it("should keep the Tab focus in the dialog", () => {
      render(<TestModal name="modal" />);
      const dialog = screen.getByTestId("modalDialog");
      const first = screen.getByText("modal first");
      const last = screen.getByText("modal last");

      expect(pressTab(last)).toBe(true);
      expect(first).toHaveFocus();

      expect(pressTab(first, true)).toBe(true);
      expect(last).toHaveFocus();

      dialog.focus();
      expect(pressTab(dialog, true)).toBe(true);
      expect(last).toHaveFocus();

      // Between the first and the last, the browser moves the focus
      expect(pressTab(first)).toBe(false);
    });

    it("should leave the Tab to an overlay opened in the dialog that handled it, e.g. a select's focus bridge", () => {
      render(<TestModal name="modal" />);
      const last = screen.getByText("modal last");
      last.focus();
      const handleKeyDown = (e: KeyboardEvent) => e.preventDefault();
      document.addEventListener("keydown", handleKeyDown, { capture: true });

      pressTab(last);
      expect(last).toHaveFocus();
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
    });

    it("should bring the focus back when it moves out of the dialog, but not when it moves to an overlay opened in it", () => {
      const outside = document.createElement("button");
      document.body.prepend(outside);
      render(<TestModal name="modal" withPortal />);

      outside.focus();
      expect(screen.getByTestId("modalDialog")).toHaveFocus();

      screen.getByText("modal portal").focus();
      expect(screen.getByText("modal portal")).toHaveFocus();
      outside.remove();
    });

    it("should trap the focus only in the topmost modal", () => {
      render(<TestModal name="below" />);
      render(<TestModal name="above" />);
      expect(screen.getByTestId("aboveDialog")).toHaveFocus();

      screen.getByText("below first").focus();
      expect(screen.getByTestId("aboveDialog")).toHaveFocus();

      const last = screen.getByText("above last");
      pressTab(last);
      expect(screen.getByText("above first")).toHaveFocus();
    });
  });
});
