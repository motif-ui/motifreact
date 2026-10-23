import { act, fireEvent, renderHook } from "@testing-library/react";
import useOverlayPosition from "./useOverlayPosition";
import { OverlayPlaceOn } from "../../types";

// jsdom viewport is 1024 x 768. Where the overlay is placed is tested in placement.test.ts, how the hook applies it here.
type Rect = { top: number; left: number; width: number; height: number };

describe("useOverlayPosition", () => {
  const anchor = document.createElement("div");
  const overlay = document.createElement("div");
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

  const renderPosition = (placement: OverlayPlaceOn, options: { enabled?: boolean } = {}) =>
    renderHook(({ enabled }: { enabled: boolean }) => useOverlayPosition(anchorRef, overlayRef, { placement, enabled }), {
      initialProps: { enabled: true, ...options },
    });

  const scroll = (target: Node = document) => act(() => void fireEvent.scroll(target));
  // The placement is chosen again in the next frame after the window is resized, so the frame is run right away here
  const resize = () => {
    const frame = jest.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
      callback(0);
      return 0;
    });
    act(() => void fireEvent(window, new Event("resize")));
    frame.mockRestore();
  };
  // jsdom has no ResizeObserver, so a fake one lets the tests resize the observed elements
  const observeResizes = () => {
    const observer = { callback: (() => {}) as ResizeObserverCallback };
    Object.defineProperty(window, "ResizeObserver", {
      configurable: true,
      value: class {
        constructor(callback: ResizeObserverCallback) {
          observer.callback = callback;
        }
        observe() {}
        disconnect() {}
      },
    });
    return (target: Element) => act(() => observer.callback([{ target } as unknown as ResizeObserverEntry], {} as ResizeObserver));
  };
  const domPosition = () => ({ top: parseFloat(overlay.style.top), left: parseFloat(overlay.style.left) });

  beforeAll(() => document.body.append(anchor, overlay));

  beforeEach(() => {
    overlay.removeAttribute("style");
    overlay.style.margin = "0";
    setOverlaySize(200, 100);
    Object.defineProperty(overlay, "scrollWidth", { configurable: true, value: 0 });
    Object.defineProperty(overlay, "scrollHeight", { configurable: true, value: 0 });
    setAnchorRect({ top: 300, left: 400, width: 100, height: 40 });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete (window as { ResizeObserver?: unknown }).ResizeObserver;
  });

  afterAll(() => document.body.replaceChildren());

  it("should hide the overlay until it is enabled and after it is disabled", () => {
    const { result, rerender } = renderPosition("bottom", { enabled: false });
    expect(result.current.style).toEqual({ visibility: "hidden" });

    rerender({ enabled: true });
    expect(result.current.style).toEqual({});

    rerender({ enabled: false });
    expect(result.current.style).toEqual({ visibility: "hidden" });
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

  it("should write the position to the overlay and return the chosen placement", () => {
    setAnchorRect({ top: 700, left: 400, width: 100, height: 40 });
    const { result } = renderPosition("bottomLeft");
    expect(result.current.placement).toBe("topLeft");
    expect(domPosition()).toEqual({ top: 600, left: 400 });
  });

  it("should add the page scroll to the position since it is positioned in the document", () => {
    const scrollY = Object.getOwnPropertyDescriptor(window, "scrollY");
    Object.defineProperty(window, "scrollY", { configurable: true, value: 500 });
    renderPosition("bottomLeft");
    expect(domPosition()).toEqual({ top: 840, left: 400 });
    Object.defineProperty(window, "scrollY", scrollY!);
  });

  it("should fix it on the screen when its anchor is, e.g. in a modal, so a page scroll does not move it away", () => {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    document.body.append(modal);
    modal.append(anchor);
    const scrollY = Object.getOwnPropertyDescriptor(window, "scrollY");
    Object.defineProperty(window, "scrollY", { configurable: true, value: 500 });

    renderPosition("bottomLeft");
    expect(overlay.style.position).toBe("fixed");
    expect(domPosition()).toEqual({ top: 340, left: 400 });

    Object.defineProperty(window, "scrollY", scrollY!);
    document.body.append(anchor);
    modal.remove();
  });

  it("should calculate the position again when it is enabled again", () => {
    const { rerender } = renderPosition("bottomLeft");
    rerender({ enabled: false });

    setAnchorRect({ top: 100, left: 100, width: 100, height: 40 });
    rerender({ enabled: true });
    expect(domPosition()).toEqual({ top: 140, left: 100 });
  });

  it("should write where the anchor's edges are relative to the overlay, e.g. for a caret", () => {
    jest
      .spyOn(overlay, "getBoundingClientRect")
      .mockReturnValue({ top: 340, left: 350, right: 550, bottom: 440, width: 200, height: 100, x: 350, y: 340, toJSON: () => {} });
    renderPosition("bottom");
    expect(overlay.style.getPropertyValue("--overlay-anchor-left")).toBe("50px");
    expect(overlay.style.getPropertyValue("--overlay-anchor-right")).toBe("150px");
    expect(overlay.style.getPropertyValue("--overlay-anchor-top")).toBe("-40px");
    expect(overlay.style.getPropertyValue("--overlay-anchor-bottom")).toBe("0px");
  });

  it("should write the anchor's layout width before measuring, so an overlay sized by it is placed with that size", () => {
    // The layout width differs from the bounding width when the anchor is transformed, e.g. scaled in a modal popping in
    Object.defineProperty(anchor, "offsetWidth", { configurable: true, value: 300 });
    setAnchorRect({ top: 300, left: 800, width: 150, height: 40 });
    // The overlay is as wide as the variable, it would fit at the anchor's left with its own width of 200
    Object.defineProperty(overlay, "offsetWidth", {
      configurable: true,
      get: () => parseFloat(overlay.style.getPropertyValue("--overlay-anchor-width")) || 200,
    });

    renderPosition("bottomLeft");
    expect(overlay.style.getPropertyValue("--overlay-anchor-width")).toBe("300px");
    // 300 wide, it does not fit at the anchor's left edge, so it is aligned to its right edge
    expect(domPosition().left).toBe(950 - 300);

    Object.defineProperty(anchor, "offsetWidth", { configurable: true, value: 260 });
    resize();
    expect(overlay.style.getPropertyValue("--overlay-anchor-width")).toBe("260px");
    delete (anchor as { offsetWidth?: number }).offsetWidth;
  });

  it("should fit it again when the class of the chosen placement, rendered after it is chosen, changes its margins", () => {
    setAnchorRect({ top: 700, left: 400, width: 100, height: 40 });
    renderHook(() => {
      const result = useOverlayPosition(anchorRef, overlayRef, { placement: "bottomLeft", enabled: true });
      // e.g. a class of the flipped placement with other margins
      overlay.style.margin = result.placement === "topLeft" ? "4px" : "0";
      return result;
    });
    // 4px above the anchor, without the margins measured before the flipped placement rendered
    expect(domPosition()).toEqual({ top: 592, left: 396 });
  });

  describe("with JS positioning", () => {
    it("should follow the scrolls that move the anchor without rendering, keeping the shift", () => {
      const container = document.createElement("div");
      const unrelated = document.createElement("div");
      container.style.overflow = "auto";
      document.body.append(container, unrelated);
      container.append(anchor);
      setAnchorRect({ top: 300, left: 0, width: 40, height: 40 });
      const onRender = jest.fn();
      renderHook(() => {
        onRender();
        return useOverlayPosition(anchorRef, overlayRef, { placement: "bottom", enabled: true });
      });
      expect(domPosition()).toEqual({ top: 340, left: 0 });

      onRender.mockClear();
      setAnchorRect({ top: 720, left: -20, width: 40, height: 40 });
      scroll(unrelated);
      expect(domPosition()).toEqual({ top: 340, left: 0 });
      scroll(container);
      expect(domPosition()).toEqual({ top: 760, left: -20 });
      expect(onRender).not.toHaveBeenCalled();
      document.body.append(anchor);
      container.remove();
      unrelated.remove();
    });

    it("should follow the anchor when an animation that moved it ends, keeping its placement", () => {
      const { result } = renderPosition("bottomLeft");

      // e.g. a container moved by a transition, which moves the anchor without a scroll or a resize. bottomLeft does not
      // fit here, but an open overlay keeps its placement.
      setAnchorRect({ top: 700, left: 420, width: 100, height: 40 });
      act(() => void document.body.dispatchEvent(new Event("transitionend", { bubbles: true })));
      expect(domPosition()).toEqual({ top: 740, left: 420 });
      expect(result.current.placement).toBe("bottomLeft");
    });

    it("should follow the anchor when it resizes", () => {
      const resizeObserved = observeResizes();
      renderPosition("bottomLeft");

      setAnchorRect({ top: 300, left: 400, width: 100, height: 80 });
      resizeObserved(anchor);
      expect(domPosition()).toEqual({ top: 380, left: 400 });
    });
  });

  it("should shift it into the viewport again when its content resizes it, keeping its placement", () => {
    const resizeObserved = observeResizes();
    setAnchorRect({ top: 300, left: 800, width: 100, height: 40 });
    const { result } = renderPosition("bottomLeft");
    expect(domPosition()).toEqual({ top: 340, left: 800 });

    setOverlaySize(400, 100);
    resizeObserved(overlay);
    expect(domPosition()).toEqual({ top: 340, left: 624 });
    expect(result.current.placement).toBe("bottomLeft");
  });

  it("should not move it when it is observed without being resized, e.g. when the observation starts after a scroll", () => {
    const resizeObserved = observeResizes();
    renderPosition("bottomLeft");

    setAnchorRect({ top: 100, left: 400, width: 100, height: 40 });
    resizeObserved(overlay);
    expect(domPosition()).toEqual({ top: 340, left: 400 });
  });

  it("should choose the placement again on window resize, once per frame", () => {
    const frames: FrameRequestCallback[] = [];
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(callback => frames.push(callback));
    jest.spyOn(window, "cancelAnimationFrame").mockImplementation(id => void (frames[id - 1] = () => {}));
    const { result } = renderPosition("left");

    setAnchorRect({ top: 300, left: 50, width: 100, height: 40 });
    act(() => {
      fireEvent(window, new Event("resize"));
      fireEvent(window, new Event("resize"));
    });
    expect(result.current.placement).toBe("left");

    const anchorRect = jest.spyOn(anchor, "getBoundingClientRect");
    anchorRect.mockClear();
    act(() => frames.forEach(frame => frame(0)));
    // positioned once for the last event in the frame: measured for the position and for the anchor's offsets
    expect(anchorRect).toHaveBeenCalledTimes(2);
    expect(result.current.placement).toBe("right");
  });

  describe("with CSS anchor positioning", () => {
    const css = Object.getOwnPropertyDescriptor(window, "CSS");

    beforeEach(() => {
      Object.defineProperty(window, "CSS", { configurable: true, value: { supports: () => true } });
    });

    afterEach(() => {
      if (css) Object.defineProperty(window, "CSS", css);
      else delete (window as { CSS?: unknown }).CSS;
    });

    // Puts the overlay where the browser would place it with its anchor style, since jsdom does no layout
    const placeOverlayAt = (left: number, top: number) =>
      jest.spyOn(overlay, "getBoundingClientRect").mockImplementation(() => {
        const [x = 0, y = 0] = overlay.style.translate.split(" ").map(value => parseFloat(value) || 0);
        return { left: left + x, top: top + y, right: 0, bottom: 0, width: 200, height: 100, x: 0, y: 0, toJSON: () => {} };
      });
    // jsdom does not parse anchor() values, so the insets themselves are tested in cssAnchor.test.ts

    it("should keep it at the placement chosen on open with CSS", () => {
      setAnchorRect({ top: 300, left: 900, width: 100, height: 40 });
      placeOverlayAt(800, 340);
      const { result } = renderPosition("bottomLeft");

      expect(result.current.placement).toBe("bottomRight");
      expect(overlay.style.translate).toBe("0px 0px");
      expect(anchor.style.getPropertyValue("anchor-name")).toBe(overlay.style.getPropertyValue("position-anchor"));
    });

    it("should correct where CSS places it to the calculated position with a translate", () => {
      setAnchorRect({ top: 300, left: 0, width: 40, height: 40 });
      // CSS centers it on the anchor, the calculation shifts it into the viewport
      placeOverlayAt(-80, 340);
      renderPosition("bottom");

      expect(overlay.style.translate).toBe("80px 0px");
    });

    it("should not listen to scrolls, since the browser moves the overlay", () => {
      placeOverlayAt(400, 340);
      renderPosition("bottomLeft");

      setAnchorRect({ top: 720, left: 400, width: 100, height: 40 });
      const translate = jest.spyOn(overlay.style, "translate", "set");
      scroll();
      expect(translate).not.toHaveBeenCalled();
    });

    it("should choose the placement again on window resize", () => {
      placeOverlayAt(200, 270);
      const { result } = renderPosition("left");
      expect(result.current.placement).toBe("left");

      setAnchorRect({ top: 300, left: 50, width: 100, height: 40 });
      resize();
      expect(result.current.placement).toBe("right");
    });

    it("should shift it into the viewport again when its content resizes it, keeping its placement", () => {
      const resizeObserved = observeResizes();
      setAnchorRect({ top: 300, left: 800, width: 100, height: 40 });
      placeOverlayAt(800, 340);
      const { result } = renderPosition("bottomLeft");
      expect(overlay.style.translate).toBe("0px 0px");

      // CSS keeps the overlay at the anchor's left edge, so it is moved into the viewport with the translate
      setOverlaySize(400, 100);
      resizeObserved(overlay);
      expect(overlay.style.translate).toBe("-176px 0px");
      expect(result.current.placement).toBe("bottomLeft");
    });

    it("should keep the anchor names of the page and of other overlays on the same anchor", () => {
      placeOverlayAt(400, 340);
      const names = () => anchor.style.getPropertyValue("anchor-name").split(", ");
      anchor.style.setProperty("anchor-name", "--page");
      const tooltip = renderPosition("top");
      const tooltipName = overlay.style.getPropertyValue("position-anchor");
      const popover = renderPosition("bottomLeft");
      const popoverName = overlay.style.getPropertyValue("position-anchor");
      expect(names()).toEqual(["--page", tooltipName, popoverName]);

      // closing one keeps the other one attached
      tooltip.rerender({ enabled: false });
      expect(names()).toEqual(["--page", popoverName]);

      popover.rerender({ enabled: false });
      expect(names()).toEqual(["--page"]);
      anchor.style.removeProperty("anchor-name");
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
