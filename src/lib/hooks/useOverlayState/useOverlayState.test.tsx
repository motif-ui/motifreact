import { act, fireEvent, renderHook } from "@testing-library/react";
import { Profiler } from "react";
import type { PropsWithChildren } from "react";
import useOverlayState from "./useOverlayState";
import { browserClick } from "../../../utils/testUtils";

describe("useOverlayState", () => {
  const anchor = document.createElement("button");
  const overlay = document.createElement("div");
  const outside = document.createElement("div");
  const insideRefs = [{ current: anchor }, { current: overlay }];

  beforeAll(() => document.body.append(anchor, overlay, outside));
  afterAll(() => document.body.replaceChildren());

  describe("uncontrolled", () => {
    it("should open and close with show, hide and toggle", () => {
      const { result } = renderHook(() => useOverlayState({}));
      expect(result.current.open).toBe(false);

      act(() => result.current.show());
      expect(result.current.open).toBe(true);
      expect(result.current.attached).toBe(true);

      act(() => result.current.toggle());
      expect(result.current.open).toBe(false);

      act(() => result.current.toggle());
      act(() => result.current.hide());
      expect(result.current.open).toBe(false);
    });

    it("should be open initially when defaultOpen is true", () => {
      const { result } = renderHook(() => useOverlayState({ defaultOpen: true }));
      expect(result.current.open).toBe(true);
      expect(result.current.attached).toBe(true);
    });

    it("should call onClose only for the closes requested by the user, once per open cycle", () => {
      const onClose = jest.fn();
      const { result } = renderHook(() => useOverlayState({ onClose, insideRefs, closeOnEscape: true }));

      act(() => result.current.show());
      act(() => result.current.hide("escape"));
      act(() => result.current.hide("escape"));
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith("escape");

      act(() => result.current.show());
      act(() => result.current.hide());
      expect(result.current.open).toBe(false);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should stay attached during the exit transition when duration is given", () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useOverlayState({ defaultOpen: true, duration: 300 }));
      act(() => jest.runOnlyPendingTimers());

      act(() => result.current.hide());
      expect(result.current.visible).toBe(false);
      expect(result.current.attached).toBe(true);

      act(() => jest.advanceTimersByTime(300));
      expect(result.current.attached).toBe(false);
      jest.useRealTimers();
    });

    it("should commit the close and the exit transition start together", () => {
      jest.useFakeTimers();
      const onRender = jest.fn();
      const wrapper = ({ children }: PropsWithChildren) => (
        <Profiler id="overlay" onRender={onRender}>
          {children}
        </Profiler>
      );
      const { result } = renderHook(() => useOverlayState({ defaultOpen: true, duration: 300 }), { wrapper });
      act(() => jest.runOnlyPendingTimers());
      act(() => jest.runOnlyPendingTimers());

      onRender.mockClear();
      act(() => result.current.hide());
      expect(onRender).toHaveBeenCalledTimes(1);
      expect(result.current.visible).toBe(false);
      expect(result.current.attached).toBe(true);

      act(() => jest.advanceTimersByTime(300));
      expect(onRender).toHaveBeenCalledTimes(2);
      expect(result.current.attached).toBe(false);
      jest.useRealTimers();
    });

    it("should commit the close made by the open prop and the exit transition start together", () => {
      jest.useFakeTimers();
      const onRender = jest.fn();
      const wrapper = ({ children }: PropsWithChildren) => (
        <Profiler id="overlay" onRender={onRender}>
          {children}
        </Profiler>
      );
      const { result, rerender } = renderHook(({ open }) => useOverlayState({ open, duration: 300 }), {
        wrapper,
        initialProps: { open: true },
      });
      act(() => jest.runOnlyPendingTimers());
      act(() => jest.runOnlyPendingTimers());

      onRender.mockClear();
      rerender({ open: false });
      expect(onRender).toHaveBeenCalledTimes(1);
      expect(result.current.visible).toBe(false);
      expect(result.current.attached).toBe(true);
      jest.useRealTimers();
    });

    it("should not be attached on mount when it is closed and duration is given", () => {
      const { result } = renderHook(() => useOverlayState({ duration: 300 }));
      expect(result.current.attached).toBe(false);
    });
  });

  describe("controlled", () => {
    it("should follow the open prop and ignore show", () => {
      const { result, rerender } = renderHook(({ open }) => useOverlayState({ open }), { initialProps: { open: false } });

      act(() => result.current.show());
      expect(result.current.open).toBe(false);

      rerender({ open: true });
      expect(result.current.open).toBe(true);
    });

    it("should not call onClose when the open prop closes it", () => {
      const onClose = jest.fn();
      const { rerender } = renderHook(({ open }) => useOverlayState({ open, onClose }), { initialProps: { open: false } });

      rerender({ open: true });
      rerender({ open: false });
      expect(onClose).not.toHaveBeenCalled();
    });

    it("should request close without closing itself, and not call onClose again when the prop closes it", () => {
      const onClose = jest.fn();
      const { result, rerender } = renderHook(({ open }) => useOverlayState({ open, onClose, insideRefs, closeOnOutsideClick: true }), {
        initialProps: { open: true },
      });

      browserClick(outside);
      expect(onClose).toHaveBeenCalledWith("outsideClick");
      expect(result.current.open).toBe(true);

      rerender({ open: false });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should call onClose for each close request while the parent keeps it open", () => {
      const onClose = jest.fn();
      const { rerender } = renderHook(({ open }) => useOverlayState({ open, onClose, closeOnEscape: true }), {
        initialProps: { open: true },
      });

      fireEvent.keyDown(document, { key: "Escape" });
      fireEvent.keyDown(document, { key: "Escape" });
      expect(onClose).toHaveBeenCalledTimes(2);

      rerender({ open: false });
      fireEvent.keyDown(document, { key: "Escape" });
      expect(onClose).toHaveBeenCalledTimes(2);
    });

    it("should not close when the page is scrolled by touch, since the browser fires no click after it", () => {
      const onClose = jest.fn();
      renderHook(() => useOverlayState({ open: true, onClose, insideRefs, closeOnOutsideClick: true }));

      fireEvent.pointerDown(outside);
      fireEvent.touchEnd(outside);
      expect(onClose).not.toHaveBeenCalled();
    });

    it("should not close when a press started inside is released outside, e.g. while selecting text", () => {
      const onClose = jest.fn();
      renderHook(() => useOverlayState({ open: true, onClose, insideRefs, closeOnOutsideClick: true }));

      fireEvent.pointerDown(overlay);
      fireEvent.mouseUp(outside);
      fireEvent.click(outside);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("dismiss", () => {
    it("should close on outside click only when closeOnOutsideClick is true", () => {
      const { result, rerender } = renderHook(
        ({ closeOnOutsideClick }) => useOverlayState({ defaultOpen: true, insideRefs, closeOnOutsideClick }),
        {
          initialProps: { closeOnOutsideClick: false },
        },
      );

      browserClick(outside);
      expect(result.current.open).toBe(true);

      rerender({ closeOnOutsideClick: true });
      browserClick(anchor);
      browserClick(overlay);
      expect(result.current.open).toBe(true);

      browserClick(outside);
      expect(result.current.open).toBe(false);
    });

    it("should close on Escape only when closeOnEscape is true", () => {
      const onClose = jest.fn();
      const { result, rerender } = renderHook(({ closeOnEscape }) => useOverlayState({ defaultOpen: true, onClose, closeOnEscape }), {
        initialProps: { closeOnEscape: false },
      });

      fireEvent.keyDown(document, { key: "Escape" });
      expect(result.current.open).toBe(true);

      rerender({ closeOnEscape: true });
      fireEvent.keyDown(document, { key: "Enter" });
      expect(result.current.open).toBe(true);
      fireEvent.keyDown(document, { key: "Escape" });
      expect(result.current.open).toBe(false);
      expect(onClose).toHaveBeenCalledWith("escape");
    });

    it("should close on a scroll that moves the anchor when closeOnScroll is true", () => {
      const onClose = jest.fn();
      const { result } = renderHook(() => useOverlayState({ defaultOpen: true, onClose, insideRefs, closeOnScroll: true }));

      fireEvent.scroll(document);
      expect(result.current.open).toBe(false);
      expect(onClose).toHaveBeenCalledWith("scroll");
    });

    it("should ignore scrolls inside the overlay and in unrelated containers", () => {
      const { result } = renderHook(() => useOverlayState({ defaultOpen: true, insideRefs, closeOnScroll: true }));

      fireEvent.scroll(overlay);
      fireEvent.scroll(outside);
      expect(result.current.open).toBe(true);
    });

    it("should close only the topmost overlay on Escape, e.g. a popover opened in a modal", () => {
      const below = renderHook(() => useOverlayState({ defaultOpen: true, closeOnEscape: true }));
      const above = renderHook(() => useOverlayState({ defaultOpen: true, closeOnEscape: true }));

      fireEvent.keyDown(document, { key: "Escape" });
      expect(above.result.current.open).toBe(false);
      expect(below.result.current.open).toBe(true);

      fireEvent.keyDown(document, { key: "Escape" });
      expect(below.result.current.open).toBe(false);
    });

    it("should not close on Escape while an overlay that blocks the layers below is above it, e.g. a confirmation over a modal", () => {
      const below = renderHook(() => useOverlayState({ defaultOpen: true, closeOnEscape: true }));
      renderHook(() => useOverlayState({ defaultOpen: true, blocksLayersBelow: true }));

      fireEvent.keyDown(document, { key: "Escape" });
      expect(below.result.current.open).toBe(true);
    });

    it("should not close when clicked on an overlay opened above it, e.g. a confirmation over a modal", () => {
      const backdrop = document.createElement("div");
      const dialog = document.createElement("div");
      backdrop.append(dialog);
      document.body.append(backdrop);
      const below = renderHook(() => useOverlayState({ defaultOpen: true, insideRefs, closeOnOutsideClick: true }));
      const above = renderHook(() =>
        useOverlayState({
          defaultOpen: true,
          insideRefs: [{ current: dialog }],
          layerRefs: [{ current: backdrop }],
          closeOnOutsideClick: true,
        }),
      );

      // the backdrop of the one above is outside of it, but on its layer
      browserClick(backdrop);
      expect(above.result.current.open).toBe(false);
      expect(below.result.current.open).toBe(true);
      backdrop.remove();
    });

    it("should not listen while it is closed", () => {
      const onClose = jest.fn();
      renderHook(() => useOverlayState({ onClose, insideRefs, closeOnOutsideClick: true, closeOnEscape: true, closeOnScroll: true }));

      browserClick(outside);
      fireEvent.keyDown(document, { key: "Escape" });
      fireEvent.scroll(document);
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
