import { fireEvent, render } from "@testing-library/react";
import RadioGroup from "@/components/RadioGroup/RadioGroup";
import Radio from "@/components/Radio/Radio";
import { userEvent } from "@testing-library/user-event";
import { InputSize } from "../Form/types";

describe("RadioGroup", () => {
  it("should be rendered with only required props", () => {
    expect(
      render(
        <RadioGroup name="language">
          <Radio label="HTML" value="html" />
          <Radio label="CSS" value="css" />
        </RadioGroup>,
      ).container,
    ).toMatchSnapshot();
  });

  it("should be rendered as given in orientation prop", () => {
    const { container, rerender } = render(
      <RadioGroup name="language" orientation="horizontal">
        <Radio label="HTML" value="html" />
        <Radio label="CSS" value="css" />
      </RadioGroup>,
    );
    expect(container.firstElementChild!).toHaveClass("horizontal");
    expect(container.firstElementChild!).not.toHaveClass("vertical");

    rerender(
      <RadioGroup name="language" orientation="vertical">
        <Radio label="HTML" value="html" />
        <Radio label="CSS" value="css" />
      </RadioGroup>,
    );
    expect(container.firstElementChild!).not.toHaveClass("horizontal");
    expect(container.firstElementChild!).toHaveClass("vertical");
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];
    sizes.forEach(size => {
      const { container } = render(
        <RadioGroup name="language" size={size}>
          <Radio label="HTML" value="html" />
          <Radio label="CSS" value="css" />
        </RadioGroup>,
      );
      expect(container.firstElementChild!).toHaveClass(size);
      expect(container.firstElementChild?.childNodes[0]).toHaveClass(size);
      expect(container.firstElementChild?.childNodes[1]).toHaveClass(size);
    });
  });

  it("should check radio with the value given in the value prop", () => {
    const { getByDisplayValue } = render(
      <RadioGroup name="language" value="css">
        <Radio label="HTML" value="html" />
        <Radio label="CSS" value="css" />
      </RadioGroup>,
    );
    expect(getByDisplayValue("css")).toBeChecked();
    expect(getByDisplayValue("html")).not.toBeChecked();
  });

  it("should fire onChange event when any Radio child is clicked", () => {
    const handleChange = jest.fn();
    const { getByDisplayValue } = render(
      <RadioGroup name="language" onChange={handleChange}>
        <Radio label="HTML" value="html" />
        <Radio label="CSS" value="css" />
      </RadioGroup>,
    );
    fireEvent.click(getByDisplayValue("html"));
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(getByDisplayValue("css")).not.toBeChecked();
    expect(getByDisplayValue("html")).toBeChecked();
  });

  it("should check clicked radio and uncheck all other radios", () => {
    const { getByDisplayValue } = render(
      <RadioGroup name="language" value="html">
        <Radio label="HTML" value="html" />
        <Radio label="CSS" value="css" />
      </RadioGroup>,
    );
    const html = getByDisplayValue("html");
    const css = getByDisplayValue("css");
    expect(html).toBeChecked();
    expect(css).not.toBeChecked();
    fireEvent.click(css);
    expect(css).toBeChecked();
    expect(html).not.toBeChecked();
  });

  it("should render child element as disabled when disabled prop is given in child element", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <RadioGroup name="language" onChange={handleChange}>
        <Radio label="HTML" value="html" disabled />
        <Radio label="CSS" value="css" />
      </RadioGroup>,
    );
    const html = getByDisplayValue("html");

    expect(html).toBeDisabled();
    await user.click(html);
    expect(handleChange).toHaveBeenCalledTimes(0);
  });

  it("should render child element as checked when value equals to RadioGroup value", () => {
    const { getByDisplayValue } = render(
      <RadioGroup name="language" value="html">
        <Radio label="HTML" value="html" />
        <Radio label="CSS" value="css" />
      </RadioGroup>,
    );
    const html = getByDisplayValue("html");
    const css = getByDisplayValue("css");
    expect(html).toBeChecked();
    expect(css).not.toBeChecked();
  });

  it("should render child element as checked and disabled when value equals to RadioGroup value and disabled prop is given in child element", () => {
    const { getByDisplayValue } = render(
      <RadioGroup name="language" value="html">
        <Radio label="HTML" value="html" disabled />
        <Radio label="CSS" value="css" />
      </RadioGroup>,
    );
    const html = getByDisplayValue("html");
    expect(html).toBeChecked();
    expect(html).toBeDisabled();
  });

  it("should ignore children checked prop when value prop is given", () => {
    const { getByDisplayValue } = render(
      <RadioGroup name="language" value="css">
        <Radio label="HTML" value="html" checked />
        <Radio label="CSS" value="css" />
      </RadioGroup>,
    );
    expect(getByDisplayValue("html")).not.toBeChecked();
    expect(getByDisplayValue("css")).toBeChecked();
  });

  it("should reflect success, error properties to the children", () => {
    // ERROR
    const { container, rerender } = render(
      <RadioGroup name="language" error>
        <Radio label="HTML" value="html" />
        <Radio label="CSS" value="css" />
      </RadioGroup>,
    );
    expect(container.firstElementChild?.childNodes[0]).toHaveClass("error");
    expect(container.firstElementChild?.childNodes[1]).toHaveClass("error");

    // SUCCESS
    rerender(
      <RadioGroup name="language" success>
        <Radio label="HTML" value="html" />
        <Radio label="CSS" value="css" />
      </RadioGroup>,
    );
    expect(container.firstElementChild?.childNodes[0]).toHaveClass("success");
    expect(container.firstElementChild?.childNodes[1]).toHaveClass("success");
  });
});
