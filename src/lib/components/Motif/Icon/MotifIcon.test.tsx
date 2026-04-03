import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import MotifIcon from "./MotifIcon";
import selectionJson from "./assets/selection.json";
import { Size7 } from "../../../types";

const motifIconDefaultNames = selectionJson.icons.map(icon => icon.properties.name);

describe("MotifIcon", () => {
  it("should render with only required props", () => {
    expect(render(<MotifIcon name="home" />).container).toMatchSnapshot();
  });

  it("should render the icon given in the name prop", () => {
    const { getByText } = render(<MotifIcon name="home" />);
    expect(getByText("home")).toBeInTheDocument();
  });

  it("should render all icons in motif default icons set", () => {
    motifIconDefaultNames.forEach(iconName => {
      const { getByText } = render(<MotifIcon name={iconName} />);
      expect(getByText(iconName)).toBeInTheDocument();
    });
  });

  it("should render with the size given in the size prop", () => {
    const sizes: Size7[] = ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"];

    sizes.forEach(size => {
      const { container } = render(<MotifIcon name="home" size={size} />);
      expect(container.firstChild).toHaveClass(size);
    });
  });

  it("should render with color variants given in the variant prop", () => {
    const variants: ("primary" | "secondary" | "info" | "success" | "warning" | "danger")[] = [
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "danger",
    ];

    variants.forEach(variant => {
      const { container } = render(<MotifIcon name="home" variant={variant} />);
      expect(container.firstChild).toHaveClass(variant);
    });
  });

  it("should have the css class given in the className prop", () => {
    const testClassName = "testClassName";
    const { container } = render(<MotifIcon name="home" className={testClassName} />);
    expect(container.firstChild).toHaveClass(testClassName);
  });

  it("should be colored by the color prop", () => {
    const { container } = render(<MotifIcon name="home" color="#355E3B" />);
    expect(container.firstChild).toHaveStyle("color: #355E3B");
  });

  it("should always apply 'motifIconsDefault' class regardless of context", () => {
    const { container } = render(<MotifIcon name="home" />);
    expect(container.firstChild).toHaveClass("motifIconsDefault");
  });

  it("should render a span element as the root element", () => {
    const { container } = render(<MotifIcon name="home" />);
    expect(container.firstChild).toBeInstanceOf(HTMLSpanElement);
  });

  it("should have displayName set to 'Icon'", () => {
    expect(MotifIcon.displayName).toBe("Icon");
  });
});
