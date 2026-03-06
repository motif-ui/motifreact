import { render } from "@testing-library/react";
import DatePicker from "@/components/DatePicker";
import { Size4SM } from "../../../types";
import Picker from "@/components/Motif/Pickers/Picker";

export const runPickerTests = () => {
  describe("Picker", () => {
    it("should cover its container when fluid prop is set to true", () => {
      const { getByTestId } = render(<DatePicker fluid />);
      expect(getByTestId("Picker")).toHaveClass("fluid");
    });

    it("should render in size stated in the size prop", () => {
      const sizes: Size4SM[] = ["xs", "sm", "md", "lg"];
      const { rerender, getByTestId } = render(<DatePicker />);
      sizes.forEach(size => {
        rerender(<DatePicker size={size} />);
        expect(getByTestId("Picker")).toHaveClass(size);
      });
    });

    it("should be rendered in the variant given in the variant prop", () => {
      const variants: ("bordered" | "shadow" | "borderless")[] = ["shadow", "borderless", "bordered"];
      const { rerender, getByTestId } = render(<DatePicker />);

      variants.forEach(variant => {
        rerender(<DatePicker variant={variant} />);
        expect(getByTestId("Picker")).toHaveClass(variant);
      });
    });

    it("should apply the wide style when doubleWidth prop is true", () => {
      const { getByTestId } = render(<Picker size="md" variant="borderless" wide />);
      expect(getByTestId("Picker")).toHaveClass("wide");
    });

    it("should apply the class name given in the className prop", () => {
      const { getByTestId } = render(<Picker size="md" variant="borderless" className="test-class" />);
      expect(getByTestId("Picker")).toHaveClass("test-class");
    });
  });
};

runPickerTests();
