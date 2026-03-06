import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Text from "@/components/Text/Text";
import { TextVariants } from "@/components/Text/types";

describe("Text", () => {
  it("should render with only required props", () => {
    expect(render(<Text text="Test Message" />).container).toMatchSnapshot();
  });

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
});
