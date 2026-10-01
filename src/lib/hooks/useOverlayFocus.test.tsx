import { renderHook } from "@testing-library/react";
import type { KeyboardEvent } from "react";
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

  const pressTab = (onKeyDown: (e: KeyboardEvent) => void, target: HTMLElement, shiftKey = false) => {
    const preventDefault = jest.fn();
    onKeyDown({ key: "Tab", shiftKey, target, preventDefault } as unknown as KeyboardEvent);
    return preventDefault;
  };

  it("should move the focus from the last anchor element into the overlay", () => {
    const { result } = renderHook(() => useOverlayFocus(anchorRef, overlayRef, { enabled: true }));

    const preventDefault = pressTab(result.current.onKeyDown, input);
    expect(preventDefault).toHaveBeenCalled();
    expect(document.activeElement).toBe(firstButton);
  });

  it("should move the focus back to the anchor with Shift+Tab from the first overlay element", () => {
    const { result } = renderHook(() => useOverlayFocus(anchorRef, overlayRef, { enabled: true }));

    pressTab(result.current.onKeyDown, firstButton, true);
    expect(document.activeElement).toBe(input);
  });

  it("should call onLeave and focus the element after the anchor when tabbing from the last overlay element", () => {
    const onLeave = jest.fn();
    const { result } = renderHook(() => useOverlayFocus(anchorRef, overlayRef, { enabled: true, onLeave }));

    pressTab(result.current.onKeyDown, lastButton);
    expect(onLeave).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(nextButton);
  });

  it("should do nothing when it is not enabled", () => {
    const onLeave = jest.fn();
    input.focus();
    const { result } = renderHook(() => useOverlayFocus(anchorRef, overlayRef, { enabled: false, onLeave }));

    const preventDefault = pressTab(result.current.onKeyDown, input);
    pressTab(result.current.onKeyDown, lastButton);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(onLeave).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(input);
  });
});
