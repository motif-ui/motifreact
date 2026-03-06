import { getAllByTestId, render } from "@testing-library/react";
import PinCode from "@/components/PinCode/PinCode";
import { expectToThrow } from "../../../utils/testUtils";
import { userEvent } from "@testing-library/user-event";

const testPropMatchesClassName = (prop: { [key: string]: unknown }, className: string, inParent: boolean, inChild: boolean) => {
  const { container } = render(
    <PinCode {...prop}>
      <PinCode.Item />
      <PinCode.Item />
    </PinCode>,
  );
  inParent && expect(container.firstElementChild).toHaveClass(className);
  inChild && getAllByTestId(container, "pinCodeItem").forEach(i => expect(i).toHaveClass(className));
};

describe("PinCode", () => {
  it("should be rendered with only required props", () => {
    const { container } = render(
      <PinCode>
        <PinCode.Item />
        <PinCode.Item />
      </PinCode>,
    );
    expect(container).toMatchSnapshot();
  });

  it("should be rendered with default values", () => {
    const { container } = render(
      <PinCode>
        <PinCode.Item masked />
        <PinCode.Item masked />
      </PinCode>,
    );

    // size: "md"
    expect(container.firstElementChild).toHaveClass("md");
    getAllByTestId(container, "pinCodeItem").forEach(i => expect(i).toHaveClass("md"));
    // maskType : "asterisks"
    getAllByTestId(container, "pinCodeItem").forEach(i => expect(i).toHaveAttribute("type", "password"));
  });

  it("should should allow minimum 2 children", () => {
    expectToThrow(() =>
      render(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        <PinCode>
          <PinCode.Item />
        </PinCode>,
      ),
    );
  });

  it("should render in size given in the size prop", () => {
    ["xs", "sm", "md", "lg"].forEach(size => testPropMatchesClassName({ size }, size, true, true));
  });

  it("should render inputs as circle when circle prop is true", () => {
    testPropMatchesClassName({ circle: true }, "circle", true, false);
  });

  it("should render in success format when the success prop is true", () => {
    testPropMatchesClassName({ success: true }, "success", true, false);
  });

  it("should render in error format when the error prop is true", () => {
    testPropMatchesClassName({ error: true }, "error", true, false);
  });

  it("should fire onChange event when a value inside inputs are changed", async () => {
    const onChange = jest.fn();
    const { container } = render(
      <PinCode onChange={onChange}>
        <PinCode.Item />
        <PinCode.Item />
      </PinCode>,
    );

    const value = "x";
    const user = userEvent.setup();
    await user.type(container.getElementsByTagName("input")[0], value);
    expect(onChange).toHaveBeenCalledWith([value, ""]);
  });

  it("should return the value in onChange event as an array of chars as the elements are the values of the each PinCode.Item", async () => {
    const onChange = jest.fn();
    const { container } = render(
      <PinCode onChange={onChange}>
        <PinCode.Item />
        <PinCode.Item />
        <PinCode.Item />
      </PinCode>,
    );

    const user = userEvent.setup();
    await user.type(container.getElementsByTagName("input")[0], "a");
    await user.type(container.getElementsByTagName("input")[1], "b");
    await user.type(container.getElementsByTagName("input")[2], "c");
    expect(onChange).toHaveBeenCalledWith(["a", "b", "c"]);
  });

  it("should render as disabled when the disabled prop is true", async () => {
    const { container } = render(
      <PinCode disabled>
        <PinCode.Item />
        <PinCode.Item />
      </PinCode>,
    );
    getAllByTestId(container, "pinCodeItem").forEach(i => {
      expect(i).toHaveAttribute("disabled");
    });

    const onChange = jest.fn();
    const value = "x";
    await userEvent.setup().type(container.getElementsByTagName("input")[0], value);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should allow each input to have a value with max 1 length", async () => {
    const { container } = render(
      <PinCode>
        <PinCode.Item />
        <PinCode.Item />
      </PinCode>,
    );

    const value = "xxx";
    await userEvent.setup().type(container.getElementsByTagName("input")[0], value);
    expect(container.getElementsByTagName("input")[0]).toHaveValue("x");
  });

  it("should render all inputs disabled regardless of the inputs' disabled props, when the disabled prop is true", () => {
    const { container } = render(
      <PinCode disabled>
        <PinCode.Item disabled />
        <PinCode.Item />
      </PinCode>,
    );
    expect(container.getElementsByTagName("input")[0]).toHaveAttribute("disabled");
    expect(container.getElementsByTagName("input")[1]).toHaveAttribute("disabled");
  });

  it("should transform the value to uppercase/lowercase based on the letterCase prop", async () => {
    const onChange = jest.fn();
    const { container, rerender } = render(
      <PinCode letterCase="upper" onChange={onChange}>
        <PinCode.Item />
        <PinCode.Item />
      </PinCode>,
    );

    const value = "a";
    await userEvent.setup().type(container.getElementsByTagName("input")[0], value);
    expect(container.getElementsByTagName("input")[0]).toHaveValue(value.toUpperCase());
    expect(onChange).toHaveBeenCalledWith([value.toUpperCase(), ""]);

    rerender(
      <PinCode letterCase="lower" onChange={onChange}>
        <PinCode.Item />
        <PinCode.Item />
      </PinCode>,
    );

    expect(container.getElementsByTagName("input")[0]).toHaveValue(value.toLowerCase());
    expect(onChange).toHaveBeenCalledWith([value.toLowerCase(), ""]);
  });

  it("should render masked values as asterisks' when the mask prop is asterisks", () => {
    const { container } = render(
      <PinCode maskType="asterisks">
        <PinCode.Item masked />
        <PinCode.Item />
      </PinCode>,
    );
    expect(container.getElementsByTagName("input")[0]).toHaveAttribute("type", "password");
  });

  it("should disable any input item when the disabled prop of the PinCode.Item is true", async () => {
    const { container } = render(
      <PinCode>
        <PinCode.Item />
        <PinCode.Item disabled />
      </PinCode>,
    );

    const pinCode1 = container.getElementsByTagName("input")[1];
    expect(pinCode1).toHaveAttribute("disabled");
    const onChange = jest.fn();
    const value = "x";
    await userEvent.setup().type(pinCode1, value);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should mask the input when the mask prop of the PinCode.Item is true", () => {
    const { container, rerender } = render(
      <PinCode>
        <PinCode.Item />
        <PinCode.Item masked disabled />
      </PinCode>,
    );
    expect(container.getElementsByTagName("input")[1]).toHaveAttribute("type", "password");
    rerender(
      <PinCode maskType="number">
        <PinCode.Item />
        <PinCode.Item masked disabled />
      </PinCode>,
    );
    expect(container.getElementsByTagName("input")[1]).toHaveValue("2");
  });

  it("should render masked values as char numbers for each item (starting from 1) when the mask prop is number and PinCode.Item is disabled", () => {
    const { container } = render(
      <PinCode maskType="number">
        <PinCode.Item masked disabled />
        <PinCode.Item masked />
      </PinCode>,
    );
    expect(container.getElementsByTagName("input")[0]).toHaveValue("1");
    expect(container.getElementsByTagName("input")[1]).not.toHaveValue("2");
  });

  it("should render each string element of the value array in each PinCode.Item's input when the value prop of the PinCode is provided.", () => {
    const { container } = render(
      <PinCode value={["a", "b"]}>
        <PinCode.Item />
        <PinCode.Item />
      </PinCode>,
    );
    expect(container.getElementsByTagName("input")[0]).toHaveValue("a");
    expect(container.getElementsByTagName("input")[1]).toHaveValue("b");
  });

  it("should focus on the next non-disabled input when the value in an input is changed and it is not empty", async () => {
    const { container } = render(
      <PinCode>
        <PinCode.Item />
        <PinCode.Item />
        <PinCode.Item disabled />
        <PinCode.Item />
      </PinCode>,
    );

    const user = userEvent.setup();
    await user.type(container.getElementsByTagName("input")[0], "x");
    expect(container.getElementsByTagName("input")[1]).toHaveFocus();
    await user.type(container.getElementsByTagName("input")[1], "y");
    expect(container.getElementsByTagName("input")[3]).toHaveFocus();
  });

  it("should focus on the previous non-disabled input when the user deletes the value with backspace key", async () => {
    const { container } = render(
      <PinCode value={["x", "y", "z", "t"]}>
        <PinCode.Item />
        <PinCode.Item disabled />
        <PinCode.Item />
        <PinCode.Item />
      </PinCode>,
    );

    const user = userEvent.setup();
    await user.type(container.getElementsByTagName("input")[3], "{backspace}");
    expect(container.getElementsByTagName("input")[2]).toHaveFocus();
    await user.type(container.getElementsByTagName("input")[2], "{backspace}");
    expect(container.getElementsByTagName("input")[0]).toHaveFocus();
  });

  it("should render a nbsp instead of an input when the space prop of the PinCode.Item is true", () => {
    const { container } = render(
      <PinCode>
        <PinCode.Item />
        <PinCode.Item space />
        <PinCode.Item />
      </PinCode>,
    );
    expect(container.getElementsByTagName("input")[1]).toHaveClass("item_space");
    expect(container.getElementsByTagName("input")[1]).toHaveAttribute("disabled");
  });

  it("should return an empty string in onChange event's return value for the PinCode.Item when its space prop is true ", async () => {
    const onChange = jest.fn();
    const { container } = render(
      <PinCode onChange={onChange}>
        <PinCode.Item />
        <PinCode.Item space />
        <PinCode.Item />
      </PinCode>,
    );

    const user = userEvent.setup();
    await user.type(container.getElementsByTagName("input")[0], "a");
    expect(onChange).toHaveBeenCalledWith(["a", "", ""]);
  });
});
