import { act, fireEvent, renderHook } from "@testing-library/react";
import useOverlayState from "./useOverlayState";

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

    it("should call onClose with the reason once per open cycle", () => {
      const onClose = jest.fn();
      const { result } = renderHook(() => useOverlayState({ onClose, insideRefs, closeOnEscape: true }));

      act(() => result.current.show());
      act(() => result.current.close("escape"));
      act(() => result.current.hide());
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith("escape");

      act(() => result.current.show());
      act(() => result.current.hide());
      expect(onClose).toHaveBeenCalledTimes(2);
      expect(onClose).toHaveBeenLastCalledWith("programmatic");
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

    it("should render the state change and the transition start together", () => {
      jest.useFakeTimers();
      let renders = 0;
      const { result } = renderHook(() => {
        renders++;
        return useOverlayState({ defaultOpen: true, duration: 300 });
      });
      act(() => jest.runOnlyPendingTimers());

      renders = 0;
      act(() => result.current.hide());
      expect(renders).toBe(1);
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

    it("should call onClose when the open prop becomes false, but not on mount", () => {
      const onClose = jest.fn();
      const { rerender } = renderHook(({ open }) => useOverlayState({ open, onClose }), { initialProps: { open: false } });
      expect(onClose).not.toHaveBeenCalled();

      rerender({ open: true });
      rerender({ open: false });
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith("programmatic");
    });

    it("should request close without closing itself, and not call onClose again when the prop closes it", () => {
      const onClose = jest.fn();
      const { result, rerender } = renderHook(({ open }) => useOverlayState({ open, onClose, insideRefs, closeOnOutsideClick: true }), {
        initialProps: { open: true },
      });

      fireEvent.mouseUp(outside);
      expect(onClose).toHaveBeenCalledWith("outsideClick");
      expect(result.current.open).toBe(true);

      rerender({ open: false });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should not call onClose again when its identity changes during the exit transition", () => {
      const { rerender } = renderHook(
        ({ open, onClose }: { open: boolean; onClose: () => void }) => useOverlayState({ open, onClose, duration: 300 }),
        {
          initialProps: { open: true, onClose: () => {} },
        },
      );
      const onClose = jest.fn();
      rerender({ open: false, onClose });
      rerender({ open: false, onClose: () => {} });
      expect(onClose).toHaveBeenCalledTimes(1);
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

      fireEvent.mouseUp(outside);
      expect(result.current.open).toBe(true);

      rerender({ closeOnOutsideClick: true });
      fireEvent.mouseUp(anchor);
      fireEvent.mouseUp(overlay);
      expect(result.current.open).toBe(true);

      fireEvent.touchEnd(outside);
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

    it("should not listen while it is closed", () => {
      const onClose = jest.fn();
      renderHook(() => useOverlayState({ onClose, insideRefs, closeOnOutsideClick: true, closeOnEscape: true, closeOnScroll: true }));

      fireEvent.mouseUp(outside);
      fireEvent.keyDown(document, { key: "Escape" });
      fireEvent.scroll(document);
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
