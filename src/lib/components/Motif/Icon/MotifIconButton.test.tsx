import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import MotifIconButton from "./MotifIconButton";
import selectionJson from "./assets/selection.json";
import { Size7 } from "../../../types";

const motifIconDefaultNames = selectionJson.icons.map(icon => icon.properties.name);

describe("MotifIconButton", () => {
  it("should render with only required props", () => {
    expect(render(<MotifIconButton name="home" />).container).toMatchSnapshot();
  });

  it("should render the icon given in the name prop", () => {
    const { getByText } = render(<MotifIconButton name="home" />);
    expect(getByText("home")).toBeInTheDocument();
  });

  it("should render all icons in motif default icons set", () => {
    motifIconDefaultNames.forEach(iconName => {
      const { getByText } = render(<MotifIconButton name={iconName} />);
      expect(getByText(iconName)).toBeInTheDocument();
    });
  });

  it("should render with the size given in the size prop", () => {
    const sizes: Size7[] = ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"];

    sizes.forEach(size => {
      const { container } = render(<MotifIconButton name="home" size={size} />);
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
      const { container } = render(<MotifIconButton name="home" variant={variant} />);
      expect(container.firstChild).toHaveClass(variant);
    });
  });

  it("should have the css class given in the className prop", () => {
    const testClassName = "testClassName";
    const { container } = render(<MotifIconButton name="home" className={testClassName} />);
    expect(container.firstChild).toHaveClass(testClassName);
  });

  it("should always apply 'motifIconsDefault' class regardless of context", () => {
    const { container } = render(<MotifIconButton name="home" />);
    expect(container.firstChild).toHaveClass("motifIconsDefault");
  });

  it("should render as disabled, both functionally and visually, when the disabled prop is true", () => {
    const { container } = render(<MotifIconButton name="home" disabled />);
    expect(container.firstChild).toHaveAttribute("disabled");

    const onClickSpy = jest.fn();
    const { container: onClickContainer } = render(<MotifIconButton name="home" onClick={onClickSpy} />);
    fireEvent.click(onClickContainer.firstChild as HTMLElement);
    expect(onClickSpy).toHaveBeenCalled();
  });

  it("should render a button element as the root element", () => {
    const { container } = render(<MotifIconButton name="home" />);
    expect(container.firstChild).toBeInstanceOf(HTMLButtonElement);
  });

  it("should have displayName set to 'IconButton'", () => {
    expect(MotifIconButton.displayName).toBe("IconButton");
  });

  it("should not fire onClick event when disabled", () => {
    const onClickSpy = jest.fn();
    const { getByTestId } = render(<MotifIconButton name="home" disabled onClick={onClickSpy} />);
    fireEvent.click(getByTestId("iconButtonTestId"));
    expect(onClickSpy).not.toHaveBeenCalled();
  });
});
