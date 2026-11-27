import "@testing-library/jest-dom";
import Textarea from "@/components/Textarea/Textarea";
import { render, screen } from "@testing-library/react";
import { InputSize } from "../Form/types";
import { runSnapshotDefaultsAndStandardPropsTest } from "../../../utils/testUtils";
import { StandardPropsWithRef } from "../../../lib/types";
describe("Textarea", () => {
  runSnapshotDefaultsAndStandardPropsTest((props: StandardPropsWithRef<HTMLDivElement>) => render(<Textarea {...props} />));

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

  it("should be rendered with the size given in size prop", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];
    sizes.forEach(size => {
      const { container } = render(<Textarea size={size} />);
      expect(container.firstElementChild).toHaveClass(size);
    });
  });

  it("should be rendered as disabled when disabled prop is given", () => {
    const { container } = render(<Textarea disabled />);
    expect(screen.getByTestId("textareaItem")).toBeDisabled();
    expect(container.firstElementChild).toHaveClass("disabled");
    expect(container.firstElementChild).not.toHaveClass("readOnly");
  });

  it("should be rendered as readOnly, not disabled, when readOnly prop is given", () => {
    const { container } = render(<Textarea readOnly />);
    expect(screen.getByTestId("textareaItem")).toHaveAttribute("readonly");
    expect(container.firstElementChild).toHaveClass("readOnly");
    expect(container.firstElementChild).not.toHaveClass("disabled");
  });

  it("should look disabled, not readOnly, when both props are given", () => {
    const { container } = render(<Textarea disabled readOnly />);
    expect(container.firstElementChild).toHaveClass("disabled");
    expect(container.firstElementChild).not.toHaveClass("readOnly");
  });
});
