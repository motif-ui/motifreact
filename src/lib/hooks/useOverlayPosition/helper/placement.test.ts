import { calculatePosition, followAnchor, getCandidates, needsRefit } from "./placement.ts";
import { OverlayPlaceOn } from "../../../types.ts";

// jsdom viewport is 1024 x 768
type Rect = { top: number; left: number; width: number; height: number };

describe("placement", () => {
  const anchor = document.createElement("div");
  const overlay = document.createElement("div");

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

  // Text that wraps into lines of the given height when its width is limited by max-width
  const setWrappingOverlay = (naturalWidth: number, lineHeight: number) => {
    const width = () => Math.min(naturalWidth, parseFloat(overlay.style.maxWidth) || naturalWidth);
    Object.defineProperty(overlay, "offsetWidth", { configurable: true, get: width });
    Object.defineProperty(overlay, "offsetHeight", { configurable: true, get: () => Math.ceil(naturalWidth / width()) * lineHeight });
  };

  const place = (placement: OverlayPlaceOn, limitWidth = false) => calculatePosition(anchor, overlay, placement, limitWidth, false);

  beforeAll(() => document.body.append(anchor, overlay));

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

  it("should try the other alignment, then the opposite side", () => {
    expect(getCandidates("bottomLeft")).toEqual(["bottomLeft", "bottomRight", "topLeft", "topRight"]);
    expect(getCandidates("top")).toEqual(["top", "bottom"]);
  });

  it.each([
    { placement: "top", expected: { x: 350, y: 200 } },
    { placement: "topLeft", expected: { x: 400, y: 200 } },
    { placement: "topRight", expected: { x: 300, y: 200 } },
    { placement: "bottom", expected: { x: 350, y: 340 } },
    { placement: "bottomLeft", expected: { x: 400, y: 340 } },
    { placement: "bottomRight", expected: { x: 300, y: 340 } },
    { placement: "left", expected: { x: 200, y: 270 } },
    { placement: "right", expected: { x: 500, y: 270 } },
  ] as { placement: OverlayPlaceOn; expected: { x: number; y: number } }[])(
    "should place the overlay at $placement of the anchor",
    ({ placement, expected }) => {
      const position = place(placement);
      expect(position).toMatchObject({ ...expected, placement });
    },
  );

  it("should use the overlay's margin on the side facing the anchor as the gap", () => {
    overlay.style.margin = "4px";
    expect(place("bottomLeft")).toMatchObject({ x: 400, y: 344 });
    expect(place("topLeft")).toMatchObject({ x: 400, y: 196 });
  });

  it.each([
    { label: "near the bottom edge", anchorRect: { top: 700, left: 400, width: 100, height: 40 }, expected: "topLeft" },
    { label: "near the right edge", anchorRect: { top: 300, left: 900, width: 100, height: 40 }, expected: "bottomRight" },
    { label: "at the bottom-right corner", anchorRect: { top: 700, left: 900, width: 100, height: 40 }, expected: "topRight" },
    { label: "in the middle", anchorRect: { top: 300, left: 400, width: 100, height: 40 }, expected: "bottomLeft" },
  ])("should pick $expected for bottomLeft when the anchor is $label", ({ anchorRect, expected }) => {
    setAnchorRect(anchorRect);
    expect(place("bottomLeft").placement).toBe(expected);
  });

  it("should flip a centered placement to the opposite side", () => {
    setAnchorRect({ top: 20, left: 400, width: 100, height: 40 });
    expect(place("top").placement).toBe("bottom");
  });

  it("should shift the overlay horizontally into the viewport, and keep the shift", () => {
    setAnchorRect({ top: 300, left: 0, width: 40, height: 40 });
    expect(place("bottom")).toMatchObject({ placement: "bottom", x: 0, y: 340, shift: { x: 80, y: 0 } });
  });

  it("should keep the margins that do not face the anchor in the viewport, so they are its distance from the edges", () => {
    overlay.style.margin = "0 8px";
    setAnchorRect({ top: 300, left: 0, width: 40, height: 40 });
    expect(place("bottom").x).toBe(8);
  });

  it("should use the size of content that overflows the overlay, e.g. a fixed width form", () => {
    setAnchorRect({ top: 300, left: 700, width: 100, height: 40 });
    // the overlay box is 200px wide, but its content is 600px wide and does not fit at the anchor's left edge
    Object.defineProperty(overlay, "scrollWidth", { configurable: true, value: 600 });
    expect(place("bottomLeft").placement).toBe("bottomRight");
  });

  describe("when it does not fit into the viewport", () => {
    it("should flip to the side where it fits on its side, shifted along the anchor", () => {
      // too wide for both alignments at the anchor, but it fits above it when shifted
      setOverlaySize(900, 100);
      setAnchorRect({ top: 700, left: 400, width: 100, height: 40 });
      expect(place("bottomLeft")).toMatchObject({ placement: "topLeft", y: 600 });
    });

    it("should shift a left or right placement vertically into the viewport, along the anchor", () => {
      // the anchor is in the viewport near its bottom edge, the overlay centered on it overflows the viewport's bottom
      setAnchorRect({ top: 720, left: 400, width: 100, height: 40 });
      expect(place("right")).toMatchObject({ placement: "right", x: 500, y: 668 });
    });

    it("should keep the given alignment when it is wider than the viewport, since it is placed at the left edge anyway", () => {
      setOverlaySize(1100, 100);
      expect(place("bottomRight")).toMatchObject({ placement: "bottomRight", x: 0 });
    });

    it("should pick the one that overflows the least and keep it in the viewport, even if it covers the anchor", () => {
      setOverlaySize(200, 1000);
      setAnchorRect({ top: 600, left: 400, width: 100, height: 40 });
      expect(place("bottomLeft")).toMatchObject({ placement: "topLeft", y: 0 });
    });
  });

  describe("with limitWidth", () => {
    it("should limit the width to the space at the placement", () => {
      setWrappingOverlay(1000, 20);
      setAnchorRect({ top: 300, left: 600, width: 100, height: 40 });
      const position = place("bottomLeft", true);
      expect(position).toMatchObject({ placement: "bottomLeft", maxWidth: 424, size: { width: 424, height: 60 } });
      expect(overlay.style.maxWidth).toBe("424px");
    });

    it("should use the whole viewport width for the centered top and bottom placements", () => {
      setWrappingOverlay(2000, 20);
      expect(place("bottom", true).maxWidth).toBe(1024);
    });

    it("should judge the candidates by their wrapped size", () => {
      // too tall below the anchor at the space of bottomLeft, but bottomRight has more room and wraps into fewer lines
      setWrappingOverlay(2000, 100);
      setAnchorRect({ top: 300, left: 900, width: 100, height: 40 });
      expect(place("bottomLeft", true).placement).toBe("bottomRight");
    });

    it("should not limit the width below the content's minimum width", () => {
      // 224px of space at the right of the anchor
      setAnchorRect({ top: 300, left: 700, width: 100, height: 40 });
      // its content cannot be narrower than 300px, e.g. a long word
      Object.defineProperty(overlay, "scrollWidth", { configurable: true, get: () => (overlay.style.maxWidth === "0px" ? 300 : 0) });
      expect(place("right", true)).toMatchObject({ placement: "right", maxWidth: 300 });
    });

    it("should not limit the width without limitWidth", () => {
      setWrappingOverlay(2000, 20);
      place("bottom");
      expect(overlay.style.maxWidth).toBe("");
    });
  });

  it("should keep the placement and shift it into the viewport again when it is calculated with a previous position", () => {
    setAnchorRect({ top: 300, left: 800, width: 100, height: 40 });
    const opened = place("bottomLeft");
    expect(opened).toMatchObject({ placement: "bottomLeft", x: 800 });

    // its content grew, so bottomRight would be chosen on open, but the placement is kept
    setOverlaySize(400, 100);
    expect(calculatePosition(anchor, overlay, "bottomLeft", false, false, opened)).toMatchObject({ placement: "bottomLeft", x: 624 });
  });

  it("should move with the anchor keeping the shift, without measuring the overlay", () => {
    setAnchorRect({ top: 300, left: 0, width: 40, height: 40 });
    const opened = place("bottom");

    setOverlaySize(500, 500);
    setAnchorRect({ top: 100, left: -20, width: 40, height: 40 });
    expect(followAnchor(anchor, opened)).toMatchObject({ x: -20, y: 140, size: { width: 200, height: 100 } });
  });

  it("should tell when the overlay needs to be fitted again, by its size or its margins", () => {
    const opened = place("bottom");
    expect(needsRefit(overlay, opened)).toBe(false);

    overlay.style.margin = "0 8px";
    expect(needsRefit(overlay, opened)).toBe(true);

    overlay.style.margin = "0";
    setOverlaySize(300, 100);
    expect(needsRefit(overlay, opened)).toBe(true);
  });
});
