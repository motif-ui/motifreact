import { fireEvent, renderHook } from "@testing-library/react";
import useOverlayFocus from "./useOverlayFocus";

describe("useOverlayFocus", () => {
  const anchor = document.createElement("div");
  const input = document.createElement("input");
  const nextButton = document.createElement("button");
  const overlay = document.createElement("div");
  const firstButton = document.createElement("button");
  const lastButton = document.createElement("button");
  const anchorRef = { current: anchor };
  const overlayRef = { current: overlay };

  const offsetParent = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetParent");

  beforeAll(() => {
    // jsdom does no layout, so offsetParent is always null. The hook uses it to skip hidden elements.
    Object.defineProperty(HTMLElement.prototype, "offsetParent", {
      configurable: true,
      get(this: HTMLElement) {
        return this.parentElement;
      },
    });
    anchor.append(input);
    overlay.append(firstButton, lastButton);
    // overlay is rendered at the end of the body like a portal
    document.body.append(anchor, nextButton, overlay);
  });

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, "offsetParent", offsetParent!);
    document.body.replaceChildren();
  });

  // Returns whether the default action was prevented, like the browser does for a moved focus
  const pressTab = (target: HTMLElement, shiftKey = false) => !fireEvent.keyDown(target, { key: "Tab", shiftKey });

  it("should move the focus from the last anchor element into the overlay", () => {
    renderHook(() => useOverlayFocus(anchorRef, overlayRef, { enabled: true }));

    expect(pressTab(input)).toBe(true);
    expect(document.activeElement).toBe(firstButton);
  });

  it("should move the focus back to the anchor with Shift+Tab from the first overlay element", () => {
    renderHook(() => useOverlayFocus(anchorRef, overlayRef, { enabled: true }));

    pressTab(firstButton, true);
    expect(document.activeElement).toBe(input);
  });

  it("should call onLeave and focus the element after the anchor when tabbing from the last overlay element", () => {
    const onLeave = jest.fn();
    renderHook(() => useOverlayFocus(anchorRef, overlayRef, { enabled: true, onLeave }));

    pressTab(lastButton);
    expect(onLeave).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(nextButton);
  });

  it("should still bridge when an element inside stops the propagation of keydown", () => {
    renderHook(() => useOverlayFocus(anchorRef, overlayRef, { enabled: true }));
    const stop = (e: Event) => e.stopPropagation();
    input.addEventListener("keydown", stop);

    pressTab(input);
    expect(document.activeElement).toBe(firstButton);
    input.removeEventListener("keydown", stop);
  });

  it("should ignore the keys outside the anchor and the overlay", () => {
    const onLeave = jest.fn();
    nextButton.focus();
    renderHook(() => useOverlayFocus(anchorRef, overlayRef, { enabled: true, onLeave }));

    expect(pressTab(nextButton)).toBe(false);
    expect(document.activeElement).toBe(nextButton);
  });

  it("should do nothing when it is not enabled", () => {
    const onLeave = jest.fn();
    input.focus();
    renderHook(() => useOverlayFocus(anchorRef, overlayRef, { enabled: false, onLeave }));

    expect(pressTab(input)).toBe(false);
    pressTab(lastButton);
    expect(onLeave).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(input);
  });

  it("should stop listening when it is disabled", () => {
    input.focus();
    const { rerender } = renderHook(({ enabled }) => useOverlayFocus(anchorRef, overlayRef, { enabled }), {
      initialProps: { enabled: true },
    });
    rerender({ enabled: false });

    expect(pressTab(input)).toBe(false);
    expect(document.activeElement).toBe(input);
  });
});
