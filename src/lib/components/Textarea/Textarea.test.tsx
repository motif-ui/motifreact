import "@testing-library/jest-dom";
import Textarea from "@/components/Textarea/Textarea";
import { render, screen } from "@testing-library/react";
import { InputSize } from "../Form/types";

describe("Textarea", () => {
  it("should render with only required props", () => {
    expect(render(<Textarea />).container).toMatchSnapshot();
  });

  it(" should update value on user input", () => {
    render(<Textarea value="Test Value" />);
    expect(screen.getByTestId("textareaItem")).toHaveValue("Test Value");
  });

  it("should not display character counter area when maximum length is not given ", () => {
    const { container } = render(<Textarea />);
    expect(container.firstChild?.childNodes[0]).not.toHaveClass("divider");
  });

  it("should display character count correctly", () => {
    render(<Textarea maxLength={50} value="test value" />);
    expect(screen.getByText("10/50")).toBeInTheDocument();
  });

  it("should truncate value exceeding maxLength", () => {
    const value = "This is too long";
    const maxLength = 10;
    render(<Textarea maxLength={maxLength} value={value} />);
    expect(screen.getByTestId("textareaItem").textContent.includes(value)).toBe(false);
    expect(screen.getByTestId("textareaItem").textContent).toBe(value.substring(0, maxLength));
  });

  it("should apply styles from style prop", () => {
    const { container } = render(<Textarea style={{ color: "red", width: 250 }} />);

    expect(container.firstElementChild).toHaveStyle({
      color: "rgb(255, 0, 0)",
      width: "250px",
    });
  });

  it("should be rendered with the size given in size prop", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];
    sizes.forEach(size => {
      const { container } = render(<Textarea size={size} />);
      expect(container.firstElementChild).toHaveClass(size);
    });
  });
});
