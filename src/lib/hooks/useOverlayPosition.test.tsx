import { act, fireEvent, renderHook } from "@testing-library/react";
import useOverlayPosition from "./useOverlayPosition";
import { OverlayPosition } from "src/lib/types";

// jsdom viewport is 1024 x 768
type Rect = { top: number; left: number; width: number; height: number };

describe("useOverlayPosition", () => {
  const anchor = document.createElement("div");
  const overlay = document.createElement("div");
  const overlayContent = document.createElement("div");
  const anchorRef = { current: anchor };
  const overlayRef = { current: overlay };

  const setAnchorRect = ({ top, left, width, height }: Rect) =>
    jest.spyOn(anchor, "getBoundingClientRect").mockReturnValue({
      top,
      left,
      width,
      height,
      right: left + width,
      bottom: top + height,
      x: left,
      y: top,
      toJSON: () => {},
    });

  const setOverlaySize = (width: number, height: number) => {
    Object.defineProperty(overlay, "offsetWidth", { configurable: true, value: width });
    Object.defineProperty(overlay, "offsetHeight", { configurable: true, value: height });
  };

  const renderPosition = (placement: OverlayPosition, options: { enabled?: boolean; keepInView?: boolean } = {}) =>
    renderHook(({ enabled, keepInView }) => useOverlayPosition(anchorRef, overlayRef, { placement, enabled, keepInView }), {
      initialProps: { enabled: true, keepInView: false, ...options },
    });

  const scrollAndWaitFrame = (target: Node = document) => {
    fireEvent.scroll(target);
    act(() => jest.advanceTimersByTime(16));
  };

  beforeAll(() => {
    overlay.append(overlayContent);
    document.body.append(anchor, overlay);
  });

  beforeEach(() => {
    jest.useFakeTimers();
    overlay.style.margin = "0";
    setOverlaySize(200, 100);
    setAnchorRect({ top: 300, left: 400, width: 100, height: 40 });
  });

  afterEach(() => jest.useRealTimers());
  afterAll(() => document.body.replaceChildren());

  it("should return a hidden style until it is enabled and after it is disabled", () => {
    const { result, rerender } = renderPosition("bottom", { enabled: false });
    expect(result.current.style).toEqual({ top: 0, left: 0, visibility: "hidden" });

    rerender({ enabled: true, keepInView: false });
    expect(result.current.style).toEqual({ top: 340, left: 350 });

    rerender({ enabled: false, keepInView: false });
    expect(result.current.style).toEqual({ top: 0, left: 0, visibility: "hidden" });
  });

  it.each([
    { placement: "top", expected: { top: 200, left: 350 } },
    { placement: "topLeft", expected: { top: 200, left: 400 } },
    { placement: "topRight", expected: { top: 200, left: 300 } },
    { placement: "bottom", expected: { top: 340, left: 350 } },
    { placement: "bottomLeft", expected: { top: 340, left: 400 } },
    { placement: "bottomRight", expected: { top: 340, left: 300 } },
    { placement: "left", expected: { top: 270, left: 200 } },
    { placement: "right", expected: { top: 270, left: 500 } },
  ] as { placement: OverlayPosition; expected: { top: number; left: number } }[])(
    "should place the overlay at $placement of the anchor",
    ({ placement, expected }) => {
      const { result } = renderPosition(placement);
      expect(result.current.style).toEqual(expected);
      expect(result.current.placement).toBe(placement);
    },
  );

  it("should use the overlay's margin on the side facing the anchor as the gap", () => {
    overlay.style.margin = "4px";
    const { result: bottom } = renderPosition("bottomLeft");
    // the margin box is positioned, so the border box starts 4px below the anchor
    expect(bottom.current.style).toEqual({ top: 340, left: 396 });

    const { result: top } = renderPosition("topLeft");
    expect(top.current.style).toEqual({ top: 192, left: 396 });
  });

  it.each([
    { label: "near the bottom edge", anchorRect: { top: 700, left: 400, width: 100, height: 40 }, expected: "topLeft" },
    { label: "near the right edge", anchorRect: { top: 300, left: 900, width: 100, height: 40 }, expected: "bottomRight" },
    { label: "at the bottom-right corner", anchorRect: { top: 700, left: 900, width: 100, height: 40 }, expected: "topRight" },
    { label: "in the middle", anchorRect: { top: 300, left: 400, width: 100, height: 40 }, expected: "bottomLeft" },
  ])("should pick $expected for bottomLeft when the anchor is $label", ({ anchorRect, expected }) => {
    setAnchorRect(anchorRect);
    const { result } = renderPosition("bottomLeft");
    expect(result.current.placement).toBe(expected);
  });

  it("should flip a centered placement to the opposite side", () => {
    setAnchorRect({ top: 20, left: 400, width: 100, height: 40 });
    const { result } = renderPosition("top");
    expect(result.current.placement).toBe("bottom");
  });

  it("should shift the overlay into the viewport when no placement fits", () => {
    setAnchorRect({ top: 300, left: 0, width: 40, height: 40 });
    const { result } = renderPosition("bottom");
    expect(result.current.placement).toBe("bottom");
    expect(result.current.style).toEqual({ top: 340, left: 0 });
  });

  it("should add the page scroll to the position since it is positioned in the document", () => {
    const scrollY = Object.getOwnPropertyDescriptor(window, "scrollY");
    Object.defineProperty(window, "scrollY", { configurable: true, value: 500 });
    const { result } = renderPosition("bottomLeft");
    expect(result.current.style).toEqual({ top: 840, left: 400 });
    Object.defineProperty(window, "scrollY", scrollY!);
  });

  describe("while open", () => {
    it("should move together with the anchor on scroll, even out of the screen", () => {
      const { result } = renderPosition("bottomLeft");

      setAnchorRect({ top: 720, left: 400, width: 100, height: 40 });
      scrollAndWaitFrame();
      expect(result.current.placement).toBe("bottomLeft");
      expect(result.current.style).toEqual({ top: 760, left: 400 });
    });

    it("should keep the shift applied on open while following the anchor", () => {
      setAnchorRect({ top: 300, left: 0, width: 40, height: 40 });
      const { result } = renderPosition("bottom");

      setAnchorRect({ top: 250, left: 0, width: 40, height: 40 });
      scrollAndWaitFrame();
      expect(result.current.style).toEqual({ top: 290, left: 0 });
    });

    it("should flip and stay in the viewport on scroll when keepInView is true", () => {
      const { result } = renderPosition("bottomLeft", { keepInView: true });

      setAnchorRect({ top: 720, left: 400, width: 100, height: 40 });
      scrollAndWaitFrame();
      expect(result.current.placement).toBe("topLeft");
      expect(result.current.style).toEqual({ top: 620, left: 400 });
    });

    it("should stick to the viewport edge when keepInView is true and the anchor leaves the screen", () => {
      const { result } = renderPosition("bottomLeft", { keepInView: true });

      setAnchorRect({ top: -200, left: 400, width: 100, height: 40 });
      scrollAndWaitFrame();
      expect(result.current.style).toEqual({ top: 0, left: 400 });
    });

    it("should follow the anchor on window resize", () => {
      const { result } = renderPosition("bottomLeft");

      setAnchorRect({ top: 300, left: 250, width: 100, height: 40 });
      fireEvent(window, new Event("resize"));
      act(() => jest.advanceTimersByTime(16));
      expect(result.current.style).toEqual({ top: 340, left: 250 });
    });

    it("should ignore the scrolls inside the overlay", () => {
      const { result } = renderPosition("bottomLeft");

      setAnchorRect({ top: 100, left: 100, width: 100, height: 40 });
      scrollAndWaitFrame(overlayContent);
      expect(result.current.style).toEqual({ top: 340, left: 400 });
    });

    it("should update once per frame for many scroll events", () => {
      const { result } = renderPosition("bottomLeft");
      const spy = jest.spyOn(anchor, "getBoundingClientRect");
      spy.mockClear();

      fireEvent.scroll(document);
      fireEvent.scroll(document);
      fireEvent.scroll(document);
      act(() => jest.advanceTimersByTime(16));
      expect(spy).toHaveBeenCalledTimes(1);
      expect(result.current.placement).toBe("bottomLeft");
    });
  });
});
