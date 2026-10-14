import { getCssAnchorInsets } from "./cssAnchor.ts";

describe("getCssAnchorInsets", () => {
  it("should touch the anchor with the inset on the opposite side and pin the aligned edge", () => {
    expect(getCssAnchorInsets("bottomRight")).toMatchObject({
      top: "anchor(bottom)",
      right: "anchor(right)",
      bottom: "auto",
      left: "auto",
    });
    expect(getCssAnchorInsets("topLeft")).toMatchObject({ bottom: "anchor(top)", left: "anchor(left)", top: "auto", right: "auto" });
  });

  it("should center it on the cross axis without an alignment", () => {
    expect(getCssAnchorInsets("bottom")).toMatchObject({ top: "anchor(bottom)", "justify-self": "anchor-center", "align-self": "" });
    expect(getCssAnchorInsets("left")).toMatchObject({ right: "anchor(left)", "justify-self": "", "align-self": "anchor-center" });
  });
});
