import { act, fireEvent, renderHook } from "@testing-library/react";
import useOverlayPosition from "./useOverlayPosition";
import { OverlayPosition } from "./types";

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

  type HookProps = { enabled: boolean; limitWidth?: boolean };
  const renderPosition = (placement: OverlayPosition, options: Partial<HookProps> = {}) =>
    renderHook(({ enabled, limitWidth }: HookProps) => useOverlayPosition(anchorRef, overlayRef, { placement, enabled, limitWidth }), {
      initialProps: { enabled: true, ...options },
    });

  // Text that wraps into lines of the given height when its width is limited by max-width
  const setWrappingOverlay = (naturalWidth: number, lineHeight: number) => {
    const width = () => Math.min(naturalWidth, parseFloat(overlay.style.maxWidth) || naturalWidth);
    Object.defineProperty(overlay, "offsetWidth", { configurable: true, get: width });
    Object.defineProperty(overlay, "offsetHeight", { configurable: true, get: () => Math.ceil(naturalWidth / width()) * lineHeight });
  };

  const scroll = (target: Node = document) => {
    act(() => {
      fireEvent.scroll(target);
    });
  };
  // While following the anchor, the position is written to the overlay element without a render
  const domPosition = () => ({ top: parseFloat(overlay.style.top), left: parseFloat(overlay.style.left) });

  beforeAll(() => {
    overlay.append(overlayContent);
    document.body.append(anchor, overlay);
  });

  beforeEach(() => {
    overlay.removeAttribute("style");
    overlay.style.margin = "0";
    setOverlaySize(200, 100);
    // content that fits its box, jsdom reports 0 otherwise
    Object.defineProperty(overlay, "scrollWidth", { configurable: true, value: 0 });
    Object.defineProperty(overlay, "scrollHeight", { configurable: true, value: 0 });
    setAnchorRect({ top: 300, left: 400, width: 100, height: 40 });
  });

  afterAll(() => document.body.replaceChildren());

  it("should return a hidden style until it is enabled and after it is disabled", () => {
    const { result, rerender } = renderPosition("bottom", { enabled: false });
    expect(result.current.style).toEqual({ top: 0, left: 0, visibility: "hidden" });

    rerender({ enabled: true });
    expect(result.current.style).toEqual({ top: 340, left: 350 });

    rerender({ enabled: false });
    expect(result.current.style).toEqual({ top: 0, left: 0, visibility: "hidden" });
  });

  it("should not render again when it is disabled", () => {
    const onRender = jest.fn();
    const { rerender } = renderHook(
      ({ enabled }) => {
        onRender();
        return useOverlayPosition(anchorRef, overlayRef, { placement: "bottom", enabled });
      },
      { initialProps: { enabled: true } },
    );

    onRender.mockClear();
    rerender({ enabled: false });
    expect(onRender).toHaveBeenCalledTimes(1);
  });

  it("should calculate the position again when it is enabled again", () => {
    const { result, rerender } = renderPosition("bottomLeft");
    rerender({ enabled: false });

    setAnchorRect({ top: 100, left: 100, width: 100, height: 40 });
    rerender({ enabled: true });
    expect(result.current.style).toEqual({ top: 140, left: 100 });
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

  it("should use the size of content that overflows the overlay, e.g. a fixed width form", () => {
    setAnchorRect({ top: 300, left: 700, width: 100, height: 40 });
    // the overlay box is 200px wide, but its content is 600px wide and does not fit at the anchor's left edge
    Object.defineProperty(overlay, "scrollWidth", { configurable: true, value: 600 });
    const { result } = renderPosition("bottomLeft");
    expect(result.current.placement).toBe("bottomRight");
  });

  describe("when it does not fit into the viewport", () => {
    const pageHeight = Object.getOwnPropertyDescriptor(document.documentElement, "scrollHeight");
    const setPageHeight = (height: number) =>
      Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: height });

    beforeEach(() => {
      // taller than the 768px viewport on both sides of the anchor
      setOverlaySize(200, 900);
    });

    afterEach(() => {
      if (pageHeight) Object.defineProperty(document.documentElement, "scrollHeight", pageHeight);
      else delete (document.documentElement as { scrollHeight?: number }).scrollHeight;
    });

    it("should flip to the side where the whole content fits before using the scrollable page", () => {
      setPageHeight(2000);
      // as wide as the viewport, so the centered top placement only fits after a shift, and only top has the height
      setOverlaySize(1024, 258);
      // 600px above the anchor and 136px below it in the 768px high viewport
      setAnchorRect({ top: 600, left: 600, width: 80, height: 32 });
      const { result } = renderPosition("bottom");

      expect(result.current.placement).toBe("top");
      expect(result.current.style).toEqual({ top: 342, left: 0 });
    });

    it("should prefer the alignment that fits without a shift", () => {
      setOverlaySize(200, 100);
      setAnchorRect({ top: 300, left: 900, width: 100, height: 40 });
      const { result } = renderPosition("bottomLeft");
      expect(result.current.placement).toBe("bottomRight");
    });

    it("should open next to the anchor when the page can be scrolled to it", () => {
      setPageHeight(2000);
      const { result } = renderPosition("bottom");

      expect(result.current.placement).toBe("bottom");
      // right below the anchor, out of the viewport at the bottom instead of covering the anchor
      expect(result.current.style).toEqual({ top: 340, left: 350 });
    });

    it("should pick the side that fits into the page", () => {
      setAnchorRect({ top: 1500, left: 400, width: 100, height: 40 });
      setPageHeight(1800);
      const { result } = renderPosition("bottom");

      expect(result.current.placement).toBe("top");
      expect(result.current.style).toEqual({ top: 600, left: 350 });
    });

    it("should be kept in the viewport when it does not fit into the page either", () => {
      setPageHeight(800);
      const { result } = renderPosition("bottom");
      expect(result.current.style).toEqual({ top: 0, left: 350 });
    });

    it("should measure the page without the overlay, and restore it", () => {
      setPageHeight(2000);
      overlay.style.display = "flex";
      renderPosition("bottom");
      expect(overlay.style.display).toBe("flex");
    });
  });

  describe("with limitWidth", () => {
    it("should limit the width to the space at the placement", () => {
      setWrappingOverlay(800, 20);
      const { result } = renderPosition("right", { limitWidth: true });

      // the anchor's right edge is at 500 in the 1024px wide viewport
      expect(result.current.style.maxWidth).toBe(524);
      expect(result.current.placement).toBe("right");
    });

    it("should use the whole viewport width for the centered top and bottom placements", () => {
      setWrappingOverlay(3000, 20);
      const { result } = renderPosition("top", { limitWidth: true });
      expect(result.current.style.maxWidth).toBe(1024);
    });

    it("should judge the candidates by their wrapped size", () => {
      setAnchorRect({ top: 300, left: 50, width: 100, height: 40 });
      // 50px on the left wraps into a column taller than the viewport, so the right side is chosen
      setWrappingOverlay(800, 60);
      const { result } = renderPosition("left", { limitWidth: true });

      expect(result.current.placement).toBe("right");
      expect(result.current.style.maxWidth).toBe(874);
    });

    it("should keep the max width while following the anchor", () => {
      setWrappingOverlay(800, 20);
      const { result } = renderPosition("right", { limitWidth: true });

      setAnchorRect({ top: 250, left: 400, width: 100, height: 40 });
      scroll();
      expect(overlay.style.maxWidth).toBe("524px");
      expect(result.current.style.maxWidth).toBe(524);
    });

    it("should not limit the width without limitWidth", () => {
      setWrappingOverlay(800, 20);
      const { result } = renderPosition("right");
      expect(result.current.style.maxWidth).toBeUndefined();
    });
  });

  describe("while open", () => {
    it("should move together with the anchor on scroll, even out of the screen, without rendering", () => {
      const onRender = jest.fn();
      renderHook(() => {
        onRender();
        return useOverlayPosition(anchorRef, overlayRef, { placement: "bottomLeft", enabled: true });
      });

      onRender.mockClear();
      setAnchorRect({ top: 720, left: 400, width: 100, height: 40 });
      scroll();
      expect(domPosition()).toEqual({ top: 760, left: 400 });
      expect(onRender).not.toHaveBeenCalled();
    });

    it("should use the latest position when it renders after following the anchor", () => {
      const { result, rerender } = renderPosition("bottomLeft");

      setAnchorRect({ top: 720, left: 400, width: 100, height: 40 });
      scroll();
      rerender({ enabled: true });
      expect(result.current.style).toEqual({ top: 760, left: 400 });
    });

    it("should keep the shift applied on open while following the anchor", () => {
      setAnchorRect({ top: 300, left: 0, width: 40, height: 40 });
      renderPosition("bottom");

      setAnchorRect({ top: 250, left: 0, width: 40, height: 40 });
      scroll();
      expect(domPosition()).toEqual({ top: 290, left: 0 });
    });

    it("should follow the anchor on window resize", () => {
      renderPosition("bottomLeft");

      setAnchorRect({ top: 300, left: 250, width: 100, height: 40 });
      act(() => {
        fireEvent(window, new Event("resize"));
      });
      expect(domPosition()).toEqual({ top: 340, left: 250 });
    });

    it("should ignore the scrolls inside the overlay", () => {
      const { result } = renderPosition("bottomLeft");

      setAnchorRect({ top: 100, left: 100, width: 100, height: 40 });
      scroll(overlayContent);
      expect(overlay.style.top).toBe("");
      expect(result.current.style).toEqual({ top: 340, left: 400 });
    });
  });

  describe("with CSS anchor positioning", () => {
    const css = Object.getOwnPropertyDescriptor(window, "CSS");

    beforeEach(() => {
      Object.defineProperty(window, "CSS", { configurable: true, value: { supports: () => true } });
    });

    afterEach(() => {
      jest.restoreAllMocks();
      if (css) Object.defineProperty(window, "CSS", css);
      else delete (window as { CSS?: unknown }).CSS;
    });

    // Puts the overlay where the browser would place it with the given style, since jsdom does no layout
    const placeOverlayAt = (left: number, top: number) =>
      jest.spyOn(overlay, "getBoundingClientRect").mockImplementation(() => {
        const [x = 0, y = 0] = overlay.style.translate.split(" ").map(value => parseFloat(value) || 0);
        return { left: left + x, top: top + y, right: 0, bottom: 0, width: 200, height: 100, x: 0, y: 0, toJSON: () => {} };
      });

    it("should follow the anchor with CSS at the placement chosen on open", () => {
      setAnchorRect({ top: 300, left: 900, width: 100, height: 40 });
      placeOverlayAt(800, 340);
      const { result } = renderPosition("bottomLeft");

      expect(result.current.placement).toBe("bottomRight");
      expect(result.current.style).toMatchObject({
        top: "anchor(bottom)",
        right: "anchor(right)",
        left: "auto",
        positionVisibility: "anchors-visible",
      });
      expect(result.current.style).not.toHaveProperty("positionTryFallbacks");
      expect(anchor.style.getPropertyValue("anchor-name")).toBe(result.current.style.positionAnchor);
    });

    it("should correct the CSS position to the calculated one with a translate", () => {
      setAnchorRect({ top: 300, left: 0, width: 40, height: 40 });
      // CSS centers it on the anchor, the calculation shifts it into the viewport
      placeOverlayAt(-80, 340);
      const { result } = renderPosition("bottom");

      expect(overlay.style.translate).toBe("80px 0px");
      expect(result.current.style).toMatchObject({ justifySelf: "anchor-center", translate: "80px 0px" });
    });

    it("should not listen to scrolls, since the browser moves the overlay", () => {
      placeOverlayAt(400, 340);
      renderPosition("bottomLeft");

      setAnchorRect({ top: 720, left: 400, width: 100, height: 40 });
      scroll();
      expect(overlay.style.top).toBe("");
    });

    it("should remove the anchor name when it is disabled", () => {
      placeOverlayAt(400, 340);
      const { rerender } = renderPosition("bottomLeft");
      expect(anchor.style.getPropertyValue("anchor-name")).not.toBe("");

      rerender({ enabled: false });
      expect(anchor.style.getPropertyValue("anchor-name")).toBe("");
    });
  });
});
