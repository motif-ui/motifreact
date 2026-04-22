import { cleanup, fireEvent, render, screen, act } from "@testing-library/react";
import { SelectGroupItem, SelectItem } from "@/components/Select/types";
import { Select, Validations } from "../../index";
import { userEvent } from "@testing-library/user-event";
import { InputSize } from "../Form/types";
import Form from "@/components/Form";
import { useEffect, useState } from "react";
import { t } from "./../../../utils/testUtils";

describe("Select", () => {
  const data: (SelectGroupItem | SelectItem)[] = [
    { label: "Item 1", value: "i1" },
    { label: "Item 2", value: "i2" },
  ];

  it("should be rendered with only required props", () => {
    expect(render(<Select data={data} />).container).toMatchSnapshot();
  });

  it("should display given icon in the icon prop", () => {
    render(<Select data={data} icon="home" />);
    expect(screen.queryByText("home")).toBeInTheDocument();
  });

  it("should display placeholder when placeholder prop is set", () => {
    render(<Select data={data} placeholder="Lütfen seçiniz" />);
    expect(screen.queryByPlaceholderText("Lütfen seçiniz")).toBeInTheDocument();
  });

  it("should load combobox with given data by data prop", () => {
    render(<Select data={data} />);
    fireEvent.click(screen.queryByRole("combobox")!);
    expect(screen.queryByText("Item 1")).toBeInTheDocument();
    expect(screen.queryByText("Item 2")).toBeInTheDocument();
  });

  it("should allow multiple selection when multiple prop is true", async () => {
    render(<Select data={data} multiple />);

    const user = userEvent.setup();
    await user.click(screen.queryByRole("combobox")!);
    // select
    await user.click(screen.queryByText("Item 1")!);
    await user.click(screen.queryByText("Item 2")!);
    // close
    await user.click(document.body);

    expect(screen.queryByDisplayValue("Item 1, Item 2")).toBeInTheDocument();
  });

  it("should show selected labels separately when multiple is true and filterable is true", async () => {
    render(<Select data={data} multiple filterable />);

    const user = userEvent.setup();
    await user.click(screen.queryByRole("combobox")!);
    // select
    await user.click(screen.queryByText("Item 2")!);
    await user.click(screen.queryByText("Item 1")!);
    // close
    await user.click(document.body);

    expect(screen.queryByDisplayValue("Item 2, Item 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Item 1")).toBeInTheDocument();
    expect(screen.queryByText("Item 2")).toBeInTheDocument();
  });

  it("should display loading icon when loading prop is true", () => {
    const { rerender } = render(<Select data={data} loading />);
    const progress = screen.queryByTestId("progressCircle");
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveClass("indeterminate");
    expect(screen.queryByText("arrow_drop_down")).not.toBeInTheDocument();

    rerender(<Select data={data} />);
    expect(screen.queryByText("cached")).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toHaveClass("loading");
    expect(screen.queryByText("arrow_drop_down")).toBeInTheDocument();
    expect(screen.queryByText("arrow_drop_down")).toHaveClass("arrowDown");
  });

  it("should preselect the items that matches the given values", () => {
    render(<Select data={data} value={["i1"]} />);
    expect(screen.queryByDisplayValue("Item 1")).toBeInTheDocument();
    fireEvent.click(screen.queryByRole("combobox")!);
    expect(screen.queryAllByRole("checkbox")[0]).toBeChecked();
    expect(screen.queryAllByRole("checkbox")[1]).not.toBeChecked();

    cleanup();

    render(<Select data={data} multiple value={["i1", "i2"]} />);
    expect(screen.queryByDisplayValue("Item 1, Item 2")).toBeInTheDocument();
    fireEvent.click(screen.queryByRole("combobox")!);
    expect(screen.queryAllByRole("checkbox")[0]).toBeChecked();
    expect(screen.queryAllByRole("checkbox")[1]).toBeChecked();

    cleanup();

    render(<Select data={data} value={["i3"]} />);
    fireEvent.click(screen.queryByRole("combobox")!);
    expect(screen.queryAllByRole("checkbox")[0]).not.toBeChecked();
    expect(screen.queryAllByRole("checkbox")[1]).not.toBeChecked();
  });

  it("should display success when success prop is true", () => {
    const { container } = render(<Select data={data} success />);
    expect(container.firstElementChild).toHaveClass("success");
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];
    sizes.forEach(size => {
      const { container } = render(<Select data={data} size={size} />);
      expect(container.firstElementChild).toHaveClass(size);
    });
  });

  it("should fire onChange event when any select option is clicked", () => {
    const handleChange = jest.fn();
    render(<Select data={data} onChange={handleChange} />);
    fireEvent.click(screen.queryByRole("combobox")!);
    fireEvent.click(screen.queryByText("Item 1")!);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("should be rendered as disabled when disabled prop is true", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<Select data={data} disabled onChange={handleChange} />);
    const combobox = screen.queryByRole("combobox");
    expect(combobox?.parentElement).toHaveClass("disabled");
    await user.click(combobox!);
    await user.click(screen.queryByText("Item 1")!);
    expect(handleChange).not.toHaveBeenCalled();
    expect(combobox?.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should be rendered as readOnly when readOnly prop is true", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<Select data={data} readOnly onChange={handleChange} />);
    const combobox = screen.queryByRole("combobox");
    expect(combobox?.parentElement).toHaveClass("disabled");
    await user.click(combobox!);
    await user.click(screen.queryByText("Item 1")!);
    expect(handleChange).not.toHaveBeenCalled();
    expect(combobox?.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should display error when error prop is true", () => {
    const { container } = render(<Select data={data} error />);
    expect(container.firstElementChild).toHaveClass("error");
  });

  it("should deselect the option when clicked a selected option", () => {
    render(<Select data={data} />);
    fireEvent.click(screen.queryByRole("combobox")!);
    fireEvent.click(screen.queryByText("Item 1")!);
    expect(screen.queryByDisplayValue("Item 1")).toBeInTheDocument();
    fireEvent.click(screen.queryByRole("combobox")!);
    fireEvent.click(screen.queryByText("Item 1")!);
    expect(screen.queryByDisplayValue("Item 1")).not.toBeInTheDocument();

    cleanup();

    render(<Select data={data} multiple />);
    fireEvent.click(screen.queryByRole("combobox")!);
    fireEvent.click(screen.queryByText("Item 1")!);
    fireEvent.click(screen.queryByText("Item 2")!);
    expect(screen.queryByDisplayValue("Item 1, Item 2")).toBeInTheDocument();
    fireEvent.click(screen.queryByText("Item 1")!);
    fireEvent.click(screen.queryByText("Item 2")!);
    expect(screen.queryByDisplayValue("Item 1, Item 2")).not.toBeInTheDocument();
  });

  it("should unselect the preselected item(s) given in the value prop", () => {
    render(<Select data={data} value={["i2"]} />);
    expect(screen.queryByDisplayValue("Item 2")).toBeInTheDocument();
    fireEvent.click(screen.queryByRole("combobox")!);
    fireEvent.click(screen.queryByText("Item 2")!);
    expect(screen.queryByDisplayValue("Item 2")).not.toBeInTheDocument();

    cleanup();

    render(<Select data={data} multiple value={["i1", "i2"]} />);
    expect(screen.queryByDisplayValue("Item 1, Item 2")).toBeInTheDocument();
    fireEvent.click(screen.queryByRole("combobox")!);
    fireEvent.click(screen.queryByText("Item 1")!);
    fireEvent.click(screen.queryByText("Item 2")!);
    expect(screen.queryByDisplayValue("Item 1, Item 2")).not.toBeInTheDocument();
  });

  it("should render text input when filterable prop is true", async () => {
    render(<Select data={data} filterable />);
    const user = userEvent.setup();
    await user.click(screen.queryByRole("combobox")!);
    expect(screen.queryByRole("textbox")).toBeInTheDocument();
  });

  it("should filter the options with the text entered in the text input in lower case using basic string match when filterable is true", async () => {
    const groupData: (SelectGroupItem | SelectItem)[] = [
      { label: "Item 1", value: "i1" },
      { label: "Item 2", value: "i2" },
      {
        groupLabel: "Cities",
        groupKey: "cities",
        items: [
          { label: "Ankara", value: "06" },
          { label: "Mexico City", value: "00" },
        ],
      },
      {
        groupLabel: "Districts",
        groupKey: "districs",
        items: [
          { label: "Gölbaşı", value: "golbasi" },
          { label: "Polatlı", value: "polatli" },
          { label: "Çankaya", value: "cankaya" },
        ],
      },
    ];

    render(<Select data={groupData} filterable />);
    const user = userEvent.setup();
    const input = screen.queryByRole("textbox")!;

    await user.click(screen.queryByRole("combobox")!);

    fireEvent.change(input, { target: { value: "1" } });
    expect(screen.queryByText("Item 1")).toBeInTheDocument();
    expect(screen.queryByText("Item 2")).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "item" } });
    expect(screen.queryByText("Item 2")).toBeInTheDocument();
    expect(screen.queryByText("Item 1")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "3" } });
    expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();

    // Group: Conflicted search
    fireEvent.change(input, { target: { value: "cit" } });
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Mexico City")).toBeInTheDocument();
    expect(screen.queryByText("Cities")).toBeInTheDocument();

    // Group: Only group label
    fireEvent.change(input, { target: { value: "cities" } });
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Ankara")).toBeInTheDocument();
    expect(screen.queryByText("Mexico City")).toBeInTheDocument();
    expect(screen.queryByText("Cities")).toBeInTheDocument();

    // Group: Only group item label
    // Group: Only group label
    fireEvent.change(input, { target: { value: "city" } });
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Ankara")).not.toBeInTheDocument();
    expect(screen.queryByText("Mexico City")).toBeInTheDocument();
    expect(screen.queryByText("Cities")).toBeInTheDocument();
  });

  it("should restore the selected label when an item is selected and items are filtered but user clicks outside without selecting a new item", async () => {
    render(<Select data={data} value={["i1"]} filterable />);

    expect(screen.queryByDisplayValue("Item 1")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.queryByRole("combobox")!);
    fireEvent.change(screen.queryByRole("textbox")!, { target: { value: "2" } });
    expect(screen.queryByDisplayValue("Item 1")).not.toBeInTheDocument();

    await user.click(document.body);
    expect(screen.queryByDisplayValue("Item 1")).toBeInTheDocument();
  });

  it("should render all the selected items in the input area when multiple items are selected and filterable is true", async () => {
    render(<Select data={data} filterable multiple />);
    const user = userEvent.setup();

    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Item 2")).not.toBeInTheDocument();

    await user.click(screen.queryByRole("combobox")!);
    await user.click(screen.queryByText("Item 1")!);
    await user.click(screen.queryByText("Item 2")!);
    await user.click(document.body);

    expect(screen.queryByText("Item 1")).toBeInTheDocument();
    expect(screen.queryByText("Item 2")).toBeInTheDocument();
  });

  it("should remove the selected item from the input area when multiple and filterable props are true and the remove button of the selected item is clicked", async () => {
    render(<Select data={data} value={["i1"]} filterable multiple />);

    expect(screen.queryByText("Item 1")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.queryByTestId("iconButtonTestId")!);
    await user.click(document.body);
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
  });

  it("should bring the results under the group when the group label is searched", async () => {
    const data: (SelectGroupItem | SelectItem)[] = [
      { label: "Item 1", value: "i1" },
      { label: "Item 2", value: "i2" },
      {
        groupLabel: "Cities",
        groupKey: "cities",
        items: [
          { label: "İstanbul", value: "34" },
          { label: "Ankara", value: "06" },
          { label: "İzmir", value: "35" },
        ],
      },
      {
        groupLabel: "Districts",
        groupKey: "districs",
        items: [
          { label: "Gölbaşı", value: "golbasi" },
          { label: "Polatlı", value: "polatli" },
          { label: "Çankaya", value: "cankaya" },
        ],
      },
    ];
    render(<Select data={data} filterable />);
    const user = userEvent.setup();
    await user.click(screen.queryByRole("combobox")!);
    fireEvent.change(screen.queryByRole("textbox")!, { target: { value: "Cities" } });
    expect(screen.queryByText("Cities")).toBeInTheDocument();
    expect(screen.queryByText("Ankara")).toBeInTheDocument();
    expect(screen.queryByText("Districts")).not.toBeInTheDocument();
  });

  it("should remove the text in the text input when no item is selected and the user clicks outside", async () => {
    render(<Select data={data} filterable />);
    const user = userEvent.setup();
    await user.click(screen.queryByRole("combobox")!);
    await user.type(screen.queryByRole("textbox")!, "searching text");
    await user.click(document.body);
    expect(screen.queryByDisplayValue("searching text")).not.toBeInTheDocument();
  });

  it("should close the combobox when the user clicks outside regardless of the filterable prop", async () => {
    const validateTheTest = async () => {
      await userEvent.click(screen.queryByRole("combobox")!);
      expect(screen.queryByRole("listbox")).toBeInTheDocument();
      await userEvent.click(document.body);
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    };

    const { rerender } = render(<Select data={data} />);
    await validateTheTest();
    rerender(<Select data={data} filterable />);
    await validateTheTest();
  });

  it("should close the combobox when the user clicks the input but the combobox itself regardless of the filterable prop", async () => {
    const validateTheTest = async () => {
      const inputItself = screen.queryByRole("combobox");
      await userEvent.click(inputItself!);
      expect(screen.queryByRole("listbox")).toBeInTheDocument();
      await userEvent.click(inputItself!);
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    };

    const { rerender } = render(<Select data={data} />);
    await validateTheTest();
    rerender(<Select data={data} filterable />);
    await validateTheTest();
  });

  it("should close the combobox when the user clicks on an item regardless of the filterable prop", async () => {
    const validateTheTest = async () => {
      await userEvent.click(screen.queryByRole("combobox")!);
      expect(screen.queryByRole("listbox")).toBeInTheDocument();
      await userEvent.click(screen.queryByText("Item 1")!);
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    };

    const { rerender } = render(<Select data={data} />);
    await validateTheTest();
    rerender(<Select data={data} filterable />);
    await validateTheTest();
  });

  it("should send asynchronously-set value to the form when Select is used inside a Form", async () => {
    const SelectWithValueSetAsynchronously100MsDelay = () => {
      const [value, setValue] = useState<string>();
      useEffect(() => {
        const timeout = setTimeout(() => setValue("i1"), 100);
        return () => clearTimeout(timeout);
      }, []);

      return (
        <Form onSubmit={jest.fn}>
          <Form.Field name="select" validations={[Validations.Required]}>
            <Select data={data} value={value} />
          </Form.Field>
        </Form>
      );
    };
    render(<SelectWithValueSetAsynchronously100MsDelay />);

    await userEvent.click(screen.getByText(t("form.submit")));
    expect(screen.queryAllByTestId("formField").at(0)).toHaveClass("error");

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await userEvent.click(screen.getByText(t("form.submit")));
    expect(screen.queryAllByTestId("formField").at(0)).not.toHaveClass("error");
  });

  it("should display value when label is not provided", async () => {
    render(<Select data={[{ value: "i1" }, { label: "Item 2", value: "i2" }]} />);

    const user = userEvent.setup();
    await user.click(screen.queryByRole("combobox")!);
    expect(screen.queryByText("i1")).toBeInTheDocument();
    expect(screen.queryByText("Item 2")).toBeInTheDocument();
  });
});
