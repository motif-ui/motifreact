import "@testing-library/jest-dom";
import Form from "@/components/Form";
import InputText from "@/components/InputText";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";
import { ButtonProps } from "./types";
import { runIconPropTest } from "../../../utils/testUtils";

describe("Button", () => {
  it("should render with only required props", () => {
    expect(render(<Button label="test" />).container).toMatchSnapshot();
  });

  it("should display label when label prop is given", () => {
    render(<Button label="This Is Button Label" />);
    expect(screen.getByText("This Is Button Label")).toBeInTheDocument();
  });

  it("should be rendered as given shape by shape prop", () => {
    const { container, rerender } = render(<Button label="test" shape="solid" />);
    expect(container.firstChild).toHaveClass("solid");
    rerender(<Button label="test" shape="outline" />);
    expect(container.firstChild).toHaveClass("outline");
    rerender(<Button label="test" shape="textonly" />);
    expect(container.firstChild).toHaveClass("textonly");
  });

  it("Should not be rendered when label and icon props are both not given", () => {
    const { container } = render(<Button />);
    expect(container.childElementCount).toBe(0);
  });

  it("should be rendered with the given type in type prop", () => {
    const variants = ["success", "primary", "secondary", "info", "warning", "danger"];

    for (const variant of variants) {
      const { container } = render(<Button label="test" variant={variant as ButtonProps["variant"]} />);
      expect(container.firstChild).toHaveClass(variant);
    }
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes = ["xxs", "sm", "md", "lg", "xs", "xl"];

    for (const size of sizes) {
      const { container } = render(<Button label="test" size={size as ButtonProps["size"]} />);
      expect(container.firstChild).toHaveClass(size);
    }
  });

  it("should be rendered as rounded corners when pill prop is given", () => {
    const { container } = render(<Button label="test" pill />);
    expect(container.firstChild).toHaveClass("pill");
  });

  it("should render the main icon given in the icon prop", () => {
    runIconPropTest(icon => render(<Button icon={icon} />), "icon");
  });

  it("should contain both the icon and the label when both props are set", () => {
    render(<Button icon="check" label="test label" />);
    expect(screen.getByText("check")).toBeInTheDocument();
    expect(screen.getByText("test label")).toBeInTheDocument();
  });

  it("should render the icon, considering the given position prop", () => {
    const { rerender, container } = render(<Button icon="home" iconPosition="left" />);
    expect(container.firstChild).toHaveClass("icon-left");

    rerender(<Button icon="home" iconPosition="right" />);
    expect(container.firstChild).toHaveClass("icon-right");
  });

  it("should be rendered as disabled when disabled prop is given", () => {
    const handleClick = jest.fn();
    render(<Button label="test" disabled onClick={handleClick} />);
    expect(screen.getByRole("button")).toHaveAttribute("disabled");
    expect(screen.getByRole("button")).toBeDisabled();
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(0);
  });

  it("calls onSubmit prop of form component when htmlType prop is given as submit", () => {
    const handleSubmit = jest.fn();
    render(
      <Form onSubmit={handleSubmit}>
        <Form.Field name="inputName" label="Name">
          <InputText />
        </Form.Field>
        <Button label="SubmitButton" htmlType="submit" />
      </Form>,
    );
    const button = screen.getByText("SubmitButton").parentElement;
    expect(button).toHaveAttribute("type", "submit");
    fireEvent.click(button!);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should be rendered as button htmlType when htmlType prop is given as button", () => {
    render(<Button label="test" htmlType="button" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("calls onClick prop when clicked", () => {
    const handleClick = jest.fn();
    render(<Button label="test" onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should fill the width %100 when fluid prop is true", () => {
    const { container } = render(<Button label="test" fluid />);
    expect(container.firstChild).toHaveClass("fluid");
  });
});
