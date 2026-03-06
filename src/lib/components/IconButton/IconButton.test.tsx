import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import IconButton from "./IconButton";
import { motifIconNames } from "../Icon/motif-icon-names";
import { MOTIF_ICONS_DEFAULT_CLASS } from "../../constants";
import { Size7 } from "../../types";
import Icon from "@/components/Icon";
import MotifProvider from "../../motif/context/MotifProvider";

describe("IconButton", () => {
  it("should be rendered with only required props", () => {
    expect(render(<IconButton name="account_circle" />).container).toMatchSnapshot();
  });

  it("should render the icon given in the name prop", () => {
    const { getByText } = render(<Icon name="testIcon" />);
    expect(getByText("testIcon")).toBeInTheDocument();
  });

  it("should render all icons in motifIcons set", () => {
    motifIconNames.forEach(iconName => {
      expect(render(<IconButton name={iconName} />).container).toMatchSnapshot();
    });
  });

  it("should be rendered with the size prop", () => {
    const sizes: Size7[] = ["xxs", "sm", "md", "lg", "xs", "xl", "xxl"];

    for (const size of sizes) {
      const { container } = render(<IconButton name="account_circle" size={size} />);
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
      const { container } = render(<IconButton name="account_circle" variant={variant} />);
      expect(container.firstChild).toHaveClass(variant);
    }
  });

  it("should be rendered using a different icon class name given in iconClass prop", () => {
    const testClass = "testIconClass";
    const { container } = render(
      <MotifProvider>
        <IconButton name="account_circle" iconClass={testClass} />
      </MotifProvider>,
    );
    expect(container.firstChild).not.toHaveClass(MOTIF_ICONS_DEFAULT_CLASS);
    expect(container.firstChild).toHaveClass(testClass);
  });

  it("should apply the styles in the css class given in className prop", () => {
    const testClassName = "testClassName";
    const { container } = render(<IconButton name="account_circle" className={testClassName} />);
    expect(container.firstChild).toHaveClass(testClassName);
  });

  it("should be rendered as disabled when disabled prop is given", () => {
    const { container } = render(<IconButton name="account_circle" disabled />);
    expect(container.firstChild).toHaveAttribute("disabled");
  });

  it("should fire onClick event when clicked", () => {
    const onClickSpy = jest.fn();
    const { getByTestId } = render(<IconButton name="account_circle" onClick={onClickSpy} />);
    fireEvent.click(getByTestId("iconButtonTestId"));
    expect(onClickSpy).toHaveBeenCalled();
  });
});
