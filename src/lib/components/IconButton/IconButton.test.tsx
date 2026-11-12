import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import IconButton from "./IconButton";
import { motifIconNames } from "../Icon/motif-icon-names";
import { MOTIF_ICONS_DEFAULT_CLASS } from "../../constants";
import { Size8LG } from "../../types";
import Icon from "@/components/Icon";
import MotifProvider from "../../motif/context/MotifProvider";
import { runSnapshotDefaultsAndStandardPropsTest } from "../../../utils/testUtils";
import { StandardPropsWithRef } from "../../../lib/types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";

jest.mock("../../motif/hooks/usePropsWithThemeDefaults", () => {
  const actual = jest.requireActual<{ default: typeof usePropsWithThemeDefaults }>("../../motif/hooks/usePropsWithThemeDefaults");
  return { __esModule: true, default: jest.fn(actual.default) };
});

describe("IconButton", () => {
  runSnapshotDefaultsAndStandardPropsTest((props: StandardPropsWithRef<HTMLButtonElement>) =>
    render(<IconButton name="account_circle" {...props} />),
  );

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
    const sizes: Size8LG[] = ["xxs", "sm", "md", "lg", "xs", "xl", "xxl", "xxxl"];

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
    const iconSpan = container.firstChild?.firstChild;
    expect(iconSpan).not.toHaveClass(MOTIF_ICONS_DEFAULT_CLASS);
    expect(iconSpan).toHaveClass(testClass);
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

  describe("memoization", () => {
    // usePropsWithThemeDefaults runs once per render of IconButton, so its calls count the renders
    const renderCount = () => jest.mocked(usePropsWithThemeDefaults).mock.calls.filter(([name]) => name === "IconButton").length;
    const CustomIcon = ({ name }: { name: string }) => <span>{name}</span>;
    const onClick = () => {};

    beforeEach(() => jest.mocked(usePropsWithThemeDefaults).mockClear());

    it("should not re-render when an inline icon element has the same type and props", () => {
      const { rerender } = render(<IconButton name={<CustomIcon name="home" />} size="md" onClick={onClick} />);
      rerender(<IconButton name={<CustomIcon name="home" />} size="md" onClick={onClick} />);
      expect(renderCount()).toBe(1);
    });

    it("should re-render when the icon element or another prop changes", () => {
      const { rerender } = render(<IconButton name={<CustomIcon name="home" />} size="md" onClick={onClick} />);
      rerender(<IconButton name={<CustomIcon name="info" />} size="md" onClick={onClick} />);
      rerender(<IconButton name={<CustomIcon name="info" />} size="lg" onClick={onClick} />);
      expect(renderCount()).toBe(3);
    });
  });
});
