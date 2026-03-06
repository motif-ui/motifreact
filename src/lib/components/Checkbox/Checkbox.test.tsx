import { render, screen, fireEvent } from "@testing-library/react";
import Checkbox from "./Checkbox";
import { InputSize } from "../Form/types";
import { userEvent } from "@testing-library/user-event";

describe("Checkbox", () => {
  it("should render with only required props", () => {
    expect(render(<Checkbox />).container).toMatchSnapshot();
  });

  it("should display label when label prop is given", () => {
    render(<Checkbox label="Test Checkbox" />);
    expect(screen.getByText("Test Checkbox")).toBeInTheDocument();
  });

  it("should be rendered as disabled and should prevent checkbox and label clicks when the disabled prop is true", () => {
    const handleChange = jest.fn();
    render(<Checkbox label="test" disabled onChange={handleChange} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
    fireEvent.click(screen.getByText("test"));
    expect(checkbox).not.toBeChecked();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("should be rendered as readOnly when readOnly prop is given", async () => {
    const handleChange = jest.fn();
    render(<Checkbox label="test" readOnly onChange={handleChange} />);
    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(screen.getByText("test"));
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("should be rendered as disabled and checked when disabled and checked props are both given", () => {
    render(<Checkbox disabled checked />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
    expect(checkbox).toBeChecked();
  });
  it("should be rendered as success variant when it is checked and success prop is true", () => {
    render(<Checkbox success checked />);
    const checkbox = screen.getByRole("checkbox");
    expect(screen.getByTestId("checkbox")).toHaveClass("success");
    expect(checkbox).toBeChecked();
  });

  it("should be rendered in success variant as disabled when it is checked, disabled and success prop is true", () => {
    render(<Checkbox disabled checked success />);
    const checkbox = screen.getByRole("checkbox");
    const container = screen.getByTestId("checkbox");
    expect(checkbox).toBeDisabled();
    expect(checkbox).toBeChecked();
    expect(container).toHaveClass("disabled");
    expect(container).toHaveClass("success");
  });

  it("should not be rendered in error state when disabled, checked and error props are all true", () => {
    render(<Checkbox disabled checked error />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
    expect(checkbox).toBeChecked();
    expect(screen.getByTestId("checkbox")).not.toHaveClass("error");
  });

  it("should display error when error prop is given", () => {
    const { getByTestId } = render(<Checkbox label="checkbox" error />);
    expect(getByTestId("checkbox")).toHaveClass("error");
  });

  it("should display as partially checked when partialCheck is true", () => {
    const { getByTestId } = render(<Checkbox label="partialTest" partialCheck />);
    expect(getByTestId("checkbox")).toHaveClass("partialCheck");
  });

  it("should allow partialCheck only when it is not checked", () => {
    const { getByLabelText } = render(<Checkbox label="partialTest" partialCheck />);
    const checkbox = getByLabelText("partialTest");
    expect(checkbox).not.toBeChecked();
    expect(checkbox.parentElement).toHaveClass("partialCheck");
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(checkbox.parentElement).not.toHaveClass("partialCheck");
  });

  it("should reflect the checked property to the component", () => {
    const { rerender } = render(<Checkbox checked />);
    expect(screen.getByRole("checkbox")).toBeChecked();
    rerender(<Checkbox />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("should check/uncheck itself when related label is clicked", () => {
    render(<Checkbox label="Option 1" />);
    fireEvent.click(screen.getByLabelText("Option 1"));
    expect(screen.getByRole("checkbox")).toBeChecked();
    fireEvent.click(screen.getByLabelText("Option 1"));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("should check the checkbox when given label is clicked", () => {
    render(<Checkbox label="Option 1" />);
    fireEvent.click(screen.getByText("Option 1"));
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("should be rendered with the size given in size prop", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];
    sizes.forEach(size => {
      const { container } = render(<Checkbox size={size} />);
      expect(container.firstElementChild).toHaveClass(size);
    });
  });
});
