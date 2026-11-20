import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import GlobalIconWrapper from "./GlobalIconWrapper";
import { runIconPropTest } from "../../../../utils/testUtils";

describe("GlobalIconWrapper", () => {
  it("should render the main icon given in the icon prop", () => {
    runIconPropTest(icon => render(<GlobalIconWrapper icon={icon} className="testClass" />), "testClass");
  });

  describe("memoization", () => {
    const renderSpy = jest.fn();
    const CustomIcon = ({ name }: { name: string }) => {
      renderSpy();
      return <span>{name}</span>;
    };

    beforeEach(() => renderSpy.mockClear());

    it("should not re-render when an inline icon element has the same type and props", () => {
      const { rerender } = render(<GlobalIconWrapper icon={<CustomIcon name="home" />} size="md" />);
      rerender(<GlobalIconWrapper icon={<CustomIcon name="home" />} size="md" />);
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it("should re-render when a prop of the icon element changes", () => {
      const { rerender, getByText } = render(<GlobalIconWrapper icon={<CustomIcon name="home" />} />);
      rerender(<GlobalIconWrapper icon={<CustomIcon name="info" />} />);
      expect(renderSpy).toHaveBeenCalledTimes(2);
      expect(getByText("info")).toBeInTheDocument();
    });

    it("should re-render when a wrapper prop changes", () => {
      const { rerender } = render(<GlobalIconWrapper icon={<CustomIcon name="home" />} size="md" />);
      rerender(<GlobalIconWrapper icon={<CustomIcon name="home" />} size="lg" />);
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });
});
