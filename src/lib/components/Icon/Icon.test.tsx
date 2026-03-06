import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Icon from "./Icon";
import { motifIconNames } from "./motif-icon-names";
import { MOTIF_ICONS_DEFAULT_CLASS } from "../../constants";
import { Size7 } from "../../types";
import MotifIcon from "@/components/Motif/Icon/MotifIcon";
import MotifProvider from "../../motif/context/MotifProvider";

describe("Icon", () => {
  it("should be rendered with only required props", () => {
    expect(render(<Icon name="account_circle" />).container).toMatchSnapshot();
  });

  it("should render the icon given in the name prop or child as string", () => {
    const { getByText, rerender } = render(<Icon name="testIcon" />);
    expect(getByText("testIcon")).toBeInTheDocument();
    rerender(<Icon>testIcon2</Icon>);
    expect(getByText("testIcon2")).toBeInTheDocument();
  });

  it("should render all icons in motifIcons set", () => {
    motifIconNames.forEach(iconName => {
      expect(render(<Icon name={iconName} />).container).toMatchSnapshot();
    });
  });

  it("should be rendered with the size prop", () => {
    const sizes: Size7[] = ["xxs", "sm", "md", "lg", "xs", "xl", "xxl"];

    for (const size of sizes) {
      const { container } = render(<Icon name="account_circle" size={size} />);
      expect(container.firstChild).toHaveClass(size);
    }
  });

  it("should be rendered with different colors considering the given variant prop", () => {
    const variants: ("primary" | "secondary" | "info" | "success" | "warning" | "danger")[] = [
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "danger",
    ];

    for (const variant of variants) {
      const { container } = render(<Icon name="account_circle" variant={variant} />);
      expect(container.firstChild).toHaveClass(variant);
    }
  });

  it("should be rendered using a different icon class name given in iconClass prop", () => {
    const testClass = "testIconClass";
    const { container } = render(
      <MotifProvider>
        <Icon name="account_circle" iconClass={testClass} />
      </MotifProvider>,
    );
    expect(container.firstChild).not.toHaveClass(MOTIF_ICONS_DEFAULT_CLASS);
    expect(container.firstChild).toHaveClass(testClass);
  });

  it("should apply the styles in the css class given in className prop", () => {
    const testClassName = "testClassName";
    const { container } = render(<Icon name="account_circle" className={testClassName} />);
    expect(container.firstChild).toHaveClass(testClassName);
  });

  it("should be colored by the color prop", () => {
    expect(render(<Icon name="info" color="#355E3B" />).container.firstChild).toHaveStyle("color: #355E3B");
  });

  it("should apply given svgColorType", () => {
    const types: ("fill" | "stroke")[] = ["fill", "stroke"];
    types.forEach(type => {
      const { container, unmount } = render(<Icon name="account_circle" svgColorType={type} />);
      expect(container.firstChild).toHaveClass(type);
      unmount();
    });
  });

  it("should render given svg children as icon", () => {
    const { container } = render(
      <Icon>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
          />
        </svg>
      </Icon>,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    expect(container.querySelector("svg")).toHaveAttribute("fill", "none");
    expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 24 24");
  });

  it("should render any type of given children icon", () => {
    const { getByText } = render(
      <Icon>
        <i>test</i>
      </Icon>,
    );
    expect(getByText("test")).toBeInTheDocument();
    expect(getByText("test").parentElement).toBeInstanceOf(HTMLSpanElement);
  });

  it("should render only one element when Icon is given as children", () => {
    const { getByText, rerender } = render(
      <Icon>
        <Icon name="test" />
      </Icon>,
    );
    expect(getByText("test")).toBeInTheDocument();
    expect(getByText("test").parentElement).not.toBeInstanceOf(HTMLSpanElement);
    rerender(
      <Icon>
        <MotifIcon name="test2" />
      </Icon>,
    );
    expect(getByText("test2")).toBeInTheDocument();
    expect(getByText("test2").parentElement).not.toBeInstanceOf(HTMLSpanElement);
  });
});
