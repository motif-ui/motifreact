import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Text from "@/components/Text/Text";
import { TextProps, TextVariants } from "@/components/Text/types";
import { runSnapshotDefaultsAndStandardPropsTest } from "../../../utils/testUtils";
import { StandardPropsWithRef } from "../../../lib/types";
describe("Text", () => {
  runSnapshotDefaultsAndStandardPropsTest((props: StandardPropsWithRef<HTMLSpanElement>) =>
    render(<Text text="Test Message" {...props} />),
  );

  it("should be rendered as italic when italic prop is given", () => {
    const { container } = render(<Text text="Italic Text" italic />);
    expect(container.firstElementChild).toHaveClass("italic");
  });

  it("should be rendered as underline when underline prop is given", () => {
    const { container } = render(<Text text="Underline Text" underline />);
    expect(container.firstElementChild).toHaveClass("underline");
  });

  it("should render with both italic and underline props", () => {
    const { container } = render(<Text text="Italic and Underline Text" italic underline />);
    expect(container.firstElementChild).toHaveClass("italic");
    expect(container.firstElementChild).toHaveClass("underline");
  });

  it("should be rendered with the given variant in variant prop", () => {
    const variants: TextVariants[] = [
      "title1",
      "title2",
      "title3",
      "body1",
      "body2",
      "body3",
      "body4",
      "body5",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p1",
      "p2",
      "p3",
    ];
    for (const variant of variants) {
      const { container } = render(<Text variant={variant}>Test</Text>);
      expect(container.firstElementChild).toHaveClass(variant);
    }
  });

  it("should render with the given type in type prop and with its related element", () => {
    const types = [
      { type: "body", tag: "SPAN" },
      { type: "paragraph", tag: "P" },
      { type: "caption", tag: "SPAN" },
      { type: "display", tag: "H1" },
      { type: "heading", tag: "H3" },
    ] as const;
    for (const { type, tag } of types) {
      const { container, unmount } = render(<Text text="Test" type={type} />);
      expect(container.firstElementChild).toHaveClass(type);
      expect(container.firstElementChild?.tagName).toBe(tag);
      unmount();
    }
  });

  it("should render in the given size in size prop", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
    for (const size of sizes) {
      const { container, unmount } = render(<Text text="Test" size={size} />);
      expect(container.firstElementChild).toHaveClass(size);
      unmount();
    }
  });

  it("should render with the heading element related to the given size when type is heading", () => {
    const headings = [
      { size: "xs", tag: "H5" },
      { size: "sm", tag: "H4" },
      { size: "md", tag: "H3" },
      { size: "lg", tag: "H2" },
      { size: "xl", tag: "H1" },
    ] as const;
    for (const { size, tag } of headings) {
      const { container, unmount } = render(<Text text="Test" type="heading" size={size} />);
      expect(container.firstElementChild?.tagName).toBe(tag);
      unmount();
    }
  });

  it("should render with the given weight in weight prop", () => {
    const weights = ["light", "regular", "medium", "semibold", "bold"] as const;
    for (const weight of weights) {
      const { container, unmount } = render(<Text text="Test" weight={weight} />);
      expect(container.firstElementChild).toHaveClass(weight);
      unmount();
    }
  });

  it("should render with the given tone in tone prop", () => {
    const tones: NonNullable<TextProps["tone"]>[] = ["softer", "soft", "normal", "strong", "stronger"];
    for (const tone of tones) {
      const { container, unmount } = render(<Text text="Test" tone={tone} />);
      expect(container.firstElementChild).toHaveClass(tone);
      unmount();
    }
  });

  it("should render as centered when center prop is given", () => {
    const { container } = render(<Text text="Test" center />);
    expect(container.firstElementChild).toHaveClass("center");
  });

  it("should render without margin when marginless prop is given", () => {
    const { container } = render(<Text text="Test" marginless />);
    expect(container.firstElementChild).toHaveClass("marginless");
  });

  it("should render in uppercase when uppercase prop is given", () => {
    const { container } = render(<Text text="Test" uppercase />);
    expect(container.firstElementChild).toHaveClass("uppercase");
  });
});
