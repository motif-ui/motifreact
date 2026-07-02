import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { useRef, useState } from "react";
import Form from "@/components/Form/Form";
import InputText from "@/components/InputText";
import InputPassword from "@/components/InputPassword";
import { userEvent } from "@testing-library/user-event";
import Checkbox from "@/components/Checkbox";
import Textarea from "@/components/Textarea";
import Switch from "@/components/Switch";
import RadioGroup from "@/components/RadioGroup";
import Radio from "@/components/Radio";
import { FormRefType, FormSubmitData, InputSize, Orientation } from "../../Form/types";
import Button from "@/components/Button";
import UploadInput from "@/components/Upload/UploadInput";
import UploadList from "@/components/Upload/UploadList";
import UploadDragger from "@/components/Upload/UploadDragger";
import Grid from "@/components/Grid";
import Row from "@/components/Grid/components/Row";
import Col from "@/components/Grid/components/Col";
import { MOCK } from "../../Upload/mock";
import { MESSAGE, STATUS } from "@/components/Upload/constants";
import { FileType } from "@/components/Upload/types";
import { t, mockXHRs } from "src/utils/testUtils.tsx";

import {
  data,
  expectedSubmitResponse,
  mockFunction,
  requiredProps,
  mixedGroupItemObjType,
  getForm,
  getFormField,
  getFormFieldGroup,
  groupItems,
  getAllInputItems,
  formItems,
} from "./testHelper";
import PinCode from "@/components/PinCode";
import Select from "@/components/Select";
import { Validations } from "@/components/Form/validation/validations";
import InputNumber from "@/components/InputNumber";
import InputDate from "@/components/InputDate";
import InputTime from "@/components/InputTime";
import InputDateTime from "@/components/InputDateTime";
import { formatDate } from "@/components/InputDate/helper";
import { DateUtils } from "src/utils/dateUtils.ts";
import Slider from "@/components/Slider";
import SliderRange from "@/components/SliderRange";
import { defaultDateFormat } from "@/components/Motif/Pickers/types";
import { getDateLocale } from "src/i18n/helper.ts";

describe("Form", () => {
  it("should be rendered with only required props and items", () => {
    const mainForm = (
      <Form onSubmit={mockFunction}>
        <Form.Field name="inputName">
          <InputText name="inputName" />
        </Form.Field>
        <Form.Field name="inputName2">
          <InputText name="inputName2" />
        </Form.Field>
      </Form>
    );
    expect(render(mainForm).container).toMatchSnapshot();
  });

  it("should render all form items in given formOrientation prop", () => {
    const form = (orientation: Orientation) => (
      <Form onSubmit={mockFunction} formOrientation={orientation}>
        <Form.Field name="input">
          <InputText name="input" />
        </Form.Field>
      </Form>
    );
    const { container, rerender } = render(form("vertical"));
    expect(getForm(container)).toHaveClass("vertical");
    expect(getFormField(0)).toHaveClass("verticalForm");

    rerender(form("horizontal"));
    expect(getForm(container)).toHaveClass("horizontal");
    expect(getFormField(0)).toHaveClass("horizontalForm");
  });

  it("should render all form item elements in given labelOrientation prop", () => {
    const form = (orientation: Orientation) => (
      <Form onSubmit={mockFunction} labelOrientation={orientation}>
        <Form.Field name="input">
          <InputText name="input" />
        </Form.Field>
      </Form>
    );
    const { container, rerender } = render(form("vertical"));
    expect(getForm(container)).toHaveClass("verticalLabels");
    expect(getFormField(0)).toHaveClass("verticalLabel");

    rerender(form("horizontal"));
    expect(getForm(container)).toHaveClass("horizontalLabels");
    expect(getFormField(0)).toHaveClass("horizontalLabel");
  });

  it("should render form group items as given in the orientation prop", () => {
    const formGroup = (orientation: Orientation) => (
      <Form onSubmit={mockFunction}>
        <Form.FieldGroup name="testGroup" orientation={orientation}>
          <InputText key="textInput" name="textInput" />
          <InputPassword key="passwordInput" name="passwordInput" />
        </Form.FieldGroup>
      </Form>
    );
    const { rerender } = render(formGroup("vertical"));
    expect(getFormFieldGroup(0)).toHaveClass("verticalGroup");

    rerender(formGroup("horizontal"));
    expect(getFormFieldGroup(0)).toHaveClass("horizontalGroup");
  });

  it("should display submit button text as given in the submitButtonLabel prop", () => {
    const submitButtonLabel = "Submit Form";

    render(
      <Form onSubmit={mockFunction} submitButtonLabel={submitButtonLabel}>
        <Form.Field name="input">
          <InputText name="input" />
        </Form.Field>
      </Form>,
    );

    expect(screen.queryByRole("button")?.textContent).toBe(submitButtonLabel);
  });

  it("should render submit/clear buttons in the position given in the buttonPosition prop", () => {
    const form = (buttonPosition: "left" | "center" | "right") => (
      <Form onSubmit={mockFunction} buttonPosition={buttonPosition}>
        <Form.Field name="input">
          <InputText name="input" />
        </Form.Field>
      </Form>
    );

    const { rerender } = render(form("left"));
    const submitButtonArea = screen.queryByRole("button")?.parentElement;
    expect(submitButtonArea).toHaveClass("submitArea_align_left");

    rerender(form("center"));
    expect(submitButtonArea).toHaveClass("submitArea_align_center");

    rerender(form("right"));
    expect(submitButtonArea).toHaveClass("submitArea_align_right");
  });

  it("should enable clear button and should clear the form when clicked when enableClearButton is true", async () => {
    const handleSubmit = (data: FormSubmitData) => {
      expect(data.isValid).toBe(true);
      Object.values(data.values).forEach(value => expect(value).toBe(""));
    };

    const { getByDisplayValue, queryByDisplayValue } = render(
      <Form onSubmit={handleSubmit} enableClearButton>
        <Form.Field name="input">
          <InputText />
        </Form.Field>
        <Form.Field name="input2">
          <InputText value="input2 value" />
        </Form.Field>
      </Form>,
    );

    const user = userEvent.setup();
    const value = "Entered Text";
    const inputItem1 = screen.getAllByTestId("inputItem")[0].querySelector("input");

    expect(getByDisplayValue("input2 value")).toBeInTheDocument();

    await user.type(inputItem1 as Element, value);
    expect(inputItem1).toHaveValue(value);

    await user.click(screen.getByText(t("g.clear")));
    expect(inputItem1).toHaveValue("");
    expect(queryByDisplayValue("input2 value")).not.toBeInTheDocument();

    await user.click(screen.getByText(t("g.submit")));
  });

  it("should display clear button label as given in the clearButtonLabel prop", () => {
    const clearButtonLabel = "Clear Form";
    render(
      <Form onSubmit={mockFunction} enableClearButton clearButtonLabel={clearButtonLabel}>
        <Form.Field name="input">
          <InputText />
        </Form.Field>
      </Form>,
    );
    expect(screen.queryByText(clearButtonLabel)).toBeInTheDocument();
  });

  it("should not clear form values by default when it is submitted and the form is valid", async () => {
    render(
      <Form onSubmit={jest.fn}>
        <Form.Field name="input" validations={[Validations.MinLength(5)]}>
          <InputText value="inp" />
        </Form.Field>
      </Form>,
    );

    const user = userEvent.setup();
    const inputItem = screen.getByTestId("inputItem").querySelector("input");

    await user.click(screen.getByText(t("g.submit")));
    expect(inputItem).toHaveValue("inp");

    await user.type(inputItem as Element, "ut value");
    await user.click(screen.getByText(t("g.submit")));
    expect(inputItem).toHaveValue("input value");
  });

  it("should clear form values when resetIfValidatedOnSubmit is true", async () => {
    render(
      <Form onSubmit={jest.fn} resetIfValidatedOnSubmit>
        <Form.Field name="input" validations={[Validations.MinLength(5)]}>
          <InputText value="inp" />
        </Form.Field>
      </Form>,
    );

    const user = userEvent.setup();
    const inputItem = screen.getByTestId("inputItem").querySelector("input");

    await user.click(screen.getByText(t("g.submit")));
    expect(inputItem).toHaveValue("inp");

    await user.type(inputItem as Element, "ut value");
    await user.click(screen.getByText(t("g.submit")));
    expect(inputItem).toHaveValue("");
  });

  it("should render all form fields and elements in the given size unless it is set explicitly by the input itself", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];
    const titleHeadingMap = { xs: "h5", sm: "h4", md: "h3", lg: "h2" };

    const mainForm = (size: InputSize) => (
      <Form onSubmit={mockFunction} size={size} title="Form Title">
        <Form.Field name="input">
          <InputText />
        </Form.Field>
        <Form.Field name="inputNumber">
          <InputNumber />
        </Form.Field>
        <Form.Field name="inputSelect">
          <Select data={data} />
        </Form.Field>
        <Form.Field name="inputPassword">
          <InputPassword />
        </Form.Field>
        <Form.Field name="inputDate">
          <InputDate />
        </Form.Field>
        <Form.Field name="inputDateTime">
          <InputDateTime />
        </Form.Field>
        <Form.Field name="radioButton">
          <Radio value="radio" />
        </Form.Field>
        <Form.Field name="radioGroup">
          <RadioGroup name="radioGroup">
            <Radio value="childOne" />
            <Radio value="childTwo" />
          </RadioGroup>
        </Form.Field>
        <Form.Field name="slider">
          <Slider />
        </Form.Field>
        <Form.Field name="sliderRange">
          <SliderRange />
        </Form.Field>
        <Form.Field name="switch">
          <Switch />
        </Form.Field>
        <Form.Field name="checkBox">
          <Checkbox />
        </Form.Field>
        <Form.Field name="textArea">
          <Textarea />
        </Form.Field>
      </Form>
    );

    const { container, rerender, getByTestId, getAllByTestId } = render(mainForm("md"));
    const inputItems = getAllByTestId("inputItem");
    for (const size of sizes) {
      rerender(mainForm(size));
      expect(getForm(container)).toHaveClass(size);

      expect(container.querySelector(titleHeadingMap[size])).toHaveTextContent("Form Title");

      expect(getFormField(0)).toHaveClass(size);
      expect(getFormField(1)).toHaveClass(size);
      inputItems.forEach(item => {
        expect(item).toHaveClass(size);
      });
      expect(getByTestId("selectItem")).toHaveClass(size);
    }
  });

  it("should render asterisk in the label of the form item when any given validation has requiredValidation true", () => {
    const { getByText } = render(
      <Form onSubmit={mockFunction}>
        <Form.Field name="input" label="Input" validations={[Validations.Required]}>
          <InputText />
        </Form.Field>
      </Form>,
    );
    expect(getByText("Input").parentElement).toHaveClass("required");
  });

  it("should disable all items in FormFieldGroup when disabled prop is given to FormFieldGroup", async () => {
    const handleSubmit = (data: FormSubmitData) => {
      expect(data.isValid).toBe(true);
      expect(Object.keys(data.values).length).toBe(0);
    };

    render(
      <Form onSubmit={handleSubmit}>
        <Form.FieldGroup name="testGroup" disabled>
          {groupItems}
        </Form.FieldGroup>
      </Form>,
    );

    const user = userEvent.setup();
    const value = "Entered Text";
    const inputItems = getAllInputItems();

    expect(getFormFieldGroup(0)).toHaveClass("disabled");

    //PinCode is excluded and added separately below
    inputItems.slice(0, inputItems.length - 1).forEach(element => {
      expect(element).toHaveClass("disabled");
      for (const input of element.getElementsByTagName("input")) {
        expect(input).toHaveAttribute("disabled");
      }
    });

    // Input Text
    await user.type(screen.getByDisplayValue("Input Text"), value);
    // Input Password
    await user.type(screen.getByDisplayValue("Input Password"), value);

    // Textarea
    const textarea = screen.getByDisplayValue("Input Textarea");
    expect(textarea).toHaveAttribute("disabled");
    await user.type(textarea, value);

    // Checkbox
    await user.click(inputItems[4].firstElementChild!);

    // Radio Group
    await user.click(inputItems[5].firstElementChild!);

    // Select
    expect(inputItems[7]).toHaveClass("disabled");
    await user.click(screen.queryByRole("combobox")!);
    await user.click(screen.queryByText("Item 2")!);

    // Input Date
    const newDateValue = new Date(2024, 1, 21);
    await user.type(
      screen.getByDisplayValue(formatDate(DateUtils.getTodayTimeless(), defaultDateFormat, getDateLocale(t))),
      formatDate(newDateValue, defaultDateFormat, getDateLocale(t)),
    );

    // Switch
    await user.click(inputItems[9].firstElementChild!);

    // Pin Code
    expect(inputItems[10].getElementsByTagName("input")[0]).toHaveAttribute("disabled");
    await user.type(inputItems[10].getElementsByTagName("input")[0], value);
    await user.click(screen.getByText(t("g.submit")));
  });

  it("should pass success property to the items in FormFieldGroup", () => {
    render(
      <Form onSubmit={mockFunction}>
        <Form.FieldGroup name="testGroup" success>
          {groupItems}
        </Form.FieldGroup>
      </Form>,
    );

    expect(getFormFieldGroup(0)).toHaveClass("success");
    const inputItems = getAllInputItems();
    // Switch Item is sliced because switch component does not have success prop
    inputItems.slice(0, inputItems.length - 2).forEach(element => expect(element).toHaveClass("success"));
    // PinCode is added below
    expect(inputItems[10].firstElementChild).toHaveClass("success");
  });

  it("should render form in preview mode with all fields disabled and no submit button", () => {
    render(
      <Form onSubmit={mockFunction} preview>
        <Form.Field name="inputText" label="Input">
          <InputText name="inputText" value="Test Value" />
        </Form.Field>
        <Form.Field name="textareaField" label="Textarea">
          <Textarea name="textareaField" value="Test" />
        </Form.Field>
        <Form.FieldGroup name="testGroup"> {groupItems} </Form.FieldGroup>
      </Form>,
    );

    expect(screen.queryByText(t("g.submit"))).not.toBeInTheDocument();

    screen.queryAllByTestId("inputItem").forEach(item => {
      expect(item).toHaveClass("disabled");
    });

    screen.queryAllByTestId("textareaItem").forEach(item => {
      expect(item).toHaveAttribute("disabled");
    });
  });

  it("should prevent typing or editing all items in FormFieldGroup when readOnly prop is given", async () => {
    const handleSubmit = (data: FormSubmitData) => {
      expect(JSON.stringify(data)).toBe(JSON.stringify(expectedSubmitResponse));
    };

    render(
      <Form onSubmit={handleSubmit}>
        <Form.FieldGroup name="testGroup" readOnly>
          {groupItems}
        </Form.FieldGroup>
      </Form>,
    );

    const user = userEvent.setup();
    const value = "Entered Text";
    const inputItems = getAllInputItems();

    // Input Text
    expect(inputItems[0].querySelector("input")).toHaveAttribute("readonly");
    await user.type(inputItems[0].querySelector("input")!, value);

    // Input Password
    expect(inputItems[1].querySelector("input")).toHaveAttribute("readonly");
    await user.type(inputItems[1].querySelector("input")!, value);

    // Input Number
    expect(inputItems[2].querySelector("input")).toHaveAttribute("readonly");
    await user.type(inputItems[2].firstElementChild!, value);

    // Textarea
    expect(inputItems[3].firstElementChild).toHaveAttribute("readonly");
    await user.type(inputItems[3].firstElementChild!, value);

    // Checkbox
    expect(inputItems[4].firstElementChild).toHaveAttribute("readonly");

    // Radio Group
    expect(inputItems[5].firstElementChild).toHaveAttribute("readonly");
    expect(inputItems[6].firstElementChild).toHaveAttribute("readonly");

    // Select
    expect((inputItems[7].firstElementChild as HTMLDivElement).getAttribute("aria-readonly")).toBe("true");
    await user.click(screen.queryByRole("combobox")!);
    await user.click(screen.queryByText("Item 2")!);

    // Input Date
    const newDateValue = new Date(2024, 1, 21);
    expect(inputItems[8].querySelector("input")).toHaveAttribute("readOnly");
    await user.type(inputItems[8].querySelector("input")!, formatDate(newDateValue, defaultDateFormat, getDateLocale(t)));

    // Pin Code
    expect(inputItems[10].getElementsByTagName("input")[0]).toHaveAttribute("readonly");
    await user.type(inputItems[10].getElementsByTagName("input")[0], value);

    await user.click(screen.getByText(t("g.submit")));
  });

  it("should submit all form item values when readOnly prop is given", async () => {
    const handleSubmit = (data: FormSubmitData) => {
      const submitValues = data.values;

      // Input Text
      expect(submitValues.inputReadonly).toBe("Test");
      expect(submitValues.inputDisabled).toBe(undefined);

      // Input Date
      expect(submitValues.inputDateReadonly).toStrictEqual(DateUtils.getTodayTimeless());
      expect(submitValues.inputDateDisabled).toBe(undefined);

      // Select
      expect(submitValues.selectReadonly).toStrictEqual({ label: "Item 1", value: "i1" });
      expect(submitValues.selectDisabled).toBe(undefined);

      // Textarea
      expect(submitValues.textareaReadonly).toBe("Test");
      expect(submitValues.textareaDisabled).toBe(undefined);

      const mixedGroupItemObj = submitValues.mixedGroupItem as mixedGroupItemObjType;
      expect(mixedGroupItemObj.football).toBe(true);
      expect(mixedGroupItemObj.basketball).toBe(undefined);
      expect("tennis" in mixedGroupItemObj).toBe(true);
      expect(mixedGroupItemObj.tennis).toBe(false);
      expect(mixedGroupItemObj.inputReadonly2).toBe("Test");
      expect(mixedGroupItemObj.inputDisabled2).toBe(undefined);
      expect(mixedGroupItemObj.textareaReadonly2).toBe("Test");
      expect(mixedGroupItemObj.textareaDisabled2).toBe(undefined);
      expect(mixedGroupItemObj.inputSwitch4).toBe(true);
      expect(mixedGroupItemObj.inputSwitch5).toBe(false);
      expect("inputSwitch6" in mixedGroupItemObj).toBe(false);
      expect(mixedGroupItemObj.inputSwitch6).toBe(undefined);
      expect(mixedGroupItemObj.selectOtherReadonly).toStrictEqual({ label: "Item 1", value: "i1" });
      expect(mixedGroupItemObj.selectOtherDisabled).toBe(undefined);
      expect(mixedGroupItemObj.pinCodeReadonly2).toEqual(["t", "e"]);
      expect(mixedGroupItemObj.pinCodeDisabled2).toBe(undefined);

      // Switch
      expect("inputSwitch1" in submitValues).toBe(true);
      expect(submitValues.inputSwitch1).toBe(true);
      expect("inputSwitch3" in submitValues).toBe(false);
      expect(submitValues.inputSwitch3).toBe(undefined);
      expect("inputSwitch2" in submitValues).toBe(true);
      expect(submitValues.inputSwitch2).toBe(false);

      // Radio Group
      expect("radioGroupBW" in submitValues).toBe(true);
      expect(submitValues.radioGroupBW).toBe("radioBlack");

      // PinCode
      expect(submitValues.pinCodeReadonly).toEqual(["t", "e"]);
      expect(submitValues.pinCodeDisabled).toBe(undefined);
    };

    render(
      <Form onSubmit={handleSubmit}>
        <Form.Field name="inputReadonly" readOnly>
          <InputText name="inputReadonly" value="Test" />
        </Form.Field>
        <Form.Field name="inputDisabled" disabled>
          <InputText name="inputDisabled" value="Test" />
        </Form.Field>
        <Form.Field name="inputDateReadonly" readOnly>
          <InputDate name="inputDateReadonly" value={DateUtils.getTodayTimeless()} />
        </Form.Field>
        <Form.Field name="inputDateDisabled" disabled>
          <InputDate name="inputDateDisabled" value={DateUtils.getTodayTimeless()} />
        </Form.Field>
        <Form.Field name="selectReadonly" readOnly>
          <Select name="selectReadonly" data={data} value={["i1"]} />
        </Form.Field>
        <Form.Field name="selectDisabled" disabled>
          <Select name="selectDisabled" data={data} value={["i1"]} />
        </Form.Field>
        <Form.Field name="textareaReadonly" readOnly>
          <Textarea name="textareaReadonly" value="Test" />
        </Form.Field>
        <Form.Field name="textareaDisabled" disabled>
          <Textarea name="textareaDisabled" value="Test" />
        </Form.Field>

        <Form.FieldGroup name="mixedGroupItem" readOnly>
          <Checkbox label="Football" name="football" key="football" checked />
          <Checkbox label="Basketbol" name="basketball" key="basketball" disabled />
          <Checkbox label="Tenis" name="tennis" key="tennis" />
          <InputText key="inputReadonly2" name="inputReadonly2" value="Test" />
          <InputText key="inputDisabled2" name="inputDisabled2" value="Test" disabled />
          <Textarea key="textareaReadonly2" name="textareaReadonly2" value="Test" />
          <Textarea key="textareaDisabled2" name="textareaDisabled2" value="Test" disabled />
          <Switch key="inputSwitch4" name="inputSwitch4" checked />
          <Switch key="inputSwitch5" name="inputSwitch5" />
          <Switch key="inputSwitch6" name="inputSwitch6" disabled />
          <Select key="selectOtherReadonly" name="selectOtherReadonly" data={data} value={["i1"]} />
          <Select key="selectOtherDisabled" name="selectOtherDisabled" data={data} value={["i1"]} disabled />
          <PinCode key="pinCodeReadonly2" name="pinCodeReadonly2" value={["t", "e"]}>
            <PinCode.Item />
            <PinCode.Item />
          </PinCode>
          ,
          <PinCode key="pinCodeDisabled2" name="pinCodeDisabled2" value={["t", "e"]} disabled>
            <PinCode.Item />
            <PinCode.Item />
          </PinCode>
        </Form.FieldGroup>

        <Form.Field name="inputSwitch1" readOnly>
          <Switch name="inputSwitch1" checked />
        </Form.Field>
        <Form.Field name="inputSwitch3" disabled>
          <Switch name="inputSwitch3" />
        </Form.Field>
        <Form.Field name="inputSwitch2" readOnly>
          <Switch name="inputSwitch2" />
        </Form.Field>

        <Form.Field name="radioGroupBW" readOnly>
          <RadioGroup name="radioGroupBW" value="radioBlack">
            <Radio value="radioBlack" label="Black" />
            <Radio value="radioWhite" label="White" disabled />
            <Radio value="radioRed" label="Red" />
          </RadioGroup>
        </Form.Field>

        <Form.Field name="pinCodeReadonly" readOnly>
          <PinCode name="pinCodeReadonly" value={["t", "e"]}>
            <PinCode.Item />
            <PinCode.Item />
          </PinCode>
        </Form.Field>
        <Form.Field name="pinCodeDisabled" disabled>
          <PinCode name="pinCodeDisabled" value={["t", "e"]}>
            <PinCode.Item />
            <PinCode.Item />
          </PinCode>
        </Form.Field>
      </Form>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByText(t("g.submit")));
  });

  it("should render form items in error state when form is submitted and a validation fails", async () => {
    const validationMessage = "Please fill in this field";
    const fileValidationMessage = "Please upload at least one file";

    const items = [
      ...formItems.map(item => (
        <Form.Field
          name={item.props.name as string}
          label={"Label " + item.key}
          key={item.key}
          helperText={"Helper Text " + item.key}
          validations={
            item.key === "textarea"
              ? undefined
              : item.key === "uploadInputPF" || item.key === "uploadListOF" || item.key === "uploadDraggerDF"
                ? [Validations.RequiredUploadedFile]
                : [Validations.Required]
          }
        >
          {item}
        </Form.Field>
      )),
      <Form.FieldGroup
        label="Label Checkbox Group"
        helperText="Helper Text Checkbox Group"
        groupValidations={[Validations.Required, Validations.AtLeastN(2)]}
        name="inputCheckboxGroup"
        key="inputCheckboxGroup"
      >
        <Checkbox label="Voleybol" name="volleyball" key="volleyball" />,
        <Checkbox label="Basketbol" name="basketball" key="basketball" />,
        <Checkbox label="Tenis" name="tennis" key="tennis" />,
      </Form.FieldGroup>,
    ];

    render(<Form onSubmit={mockFunction}>{items}</Form>);

    const user = userEvent.setup();
    await user.click(screen.getByText(t("g.submit")));

    items.forEach((element, index) => {
      if (element.key === "textarea") {
        // Textarea
        expect(getFormField(index)).not.toHaveClass("error");
        expect(getFormField(index)).toHaveTextContent("Helper Text " + element.key);
      } else if (element.key === "uploadInputPF" || element.key === "uploadListOF" || element.key === "uploadDraggerDF") {
        // UploadList, UploadInput, UploadDragger
        expect(getFormField(index)).toHaveClass("error");
        expect(getFormField(index)).toHaveTextContent(fileValidationMessage);
      } else if (element.key != "inputCheckboxGroup") {
        // InputText, InputPassword, RadioGroup, Select, Switch, InputDate, PinCode
        expect(getFormField(index)).toHaveClass("error");
        expect(getFormField(index)).toHaveTextContent(validationMessage);
      }
    });

    // Checkbox Group - Error
    expect(getFormFieldGroup(0)).toHaveClass("error");
    expect(getFormFieldGroup(0)).toHaveTextContent(validationMessage);
    screen.getAllByTestId("checkbox").forEach(element => expect(element).toHaveClass("error"));
  });

  it("should remove error conditions after filling in incorrect inputs", async () => {
    const xhrSpy = mockXHRs();
    const validationMessage = "Please fill in this field";
    const fileValidationMessage = "Please upload at least one file";
    const value = "Entered Text";

    const items = formItems.map(item => (
      <Form.Field
        name={item.props.name as string}
        label={"Label " + item.key}
        key={item.key}
        helperText={"Helper Text " + item.key}
        validations={
          item.key === "uploadInputPF" || item.key === "uploadListOF" || item.key === "uploadDraggerDF"
            ? [Validations.RequiredUploadedFile]
            : [Validations.Required]
        }
      >
        {item}
      </Form.Field>
    ));

    render(<Form onSubmit={mockFunction}>{items}</Form>);

    const user = userEvent.setup();
    await user.click(screen.getByText(t("g.submit")));

    items.forEach((element, index) => {
      expect(getFormField(index)).toHaveClass("error");
      expect(getFormField(index)).toHaveTextContent(
        element.key === "uploadInputPF" || element.key === "uploadListOF" || element.key === "uploadDraggerDF"
          ? fileValidationMessage
          : validationMessage,
      );
    });

    await user.type(screen.getAllByTestId("inputItem")[0].querySelector("input")!, value);
    await user.type(screen.getAllByTestId("inputItem")[1].querySelector("input")!, value);
    await user.type(screen.getAllByTestId("inputItem")[2].querySelector("input")!, "42");
    await user.type(screen.getByTestId("inputDate").querySelector("input")!, "12/12/2024");
    await user.type(screen.getByTestId("pinCode").querySelectorAll("input")[0], value);
    await user.click(screen.getByText("Black"));
    await user.click(screen.queryByRole("combobox")!);
    await user.click(screen.queryByText("Item 1")!);
    await user.click(screen.getByTestId("switchItem"));
    await act(() =>
      fireEvent.drop(screen.getAllByText(t("g.browse"))[0].parentElement as Element, { dataTransfer: { files: [MOCK.filePng2mb] } }),
    );
    await act(() =>
      fireEvent.change(screen.getByTestId("uploadInputItem").parentElement?.querySelector("input[type=file]") as Element, {
        target: { files: [MOCK.filePng2mb] },
      }),
    );
    await act(() =>
      fireEvent.drop(screen.getByTestId("uploadDragger").firstElementChild as Element, {
        dataTransfer: { files: [MOCK.filePng2mb] },
      }),
    );
    await user.type(screen.getByTestId("textareaItem"), value);

    await waitFor(() => {
      items.forEach((element, index) => {
        expect(getFormField(index)).not.toHaveClass("error");
        expect(getFormField(index)).toHaveTextContent("Helper Text " + element.key);
      });
    });

    xhrSpy.mockRestore();
  });

  it("should be rendered as error and show component level message when required validation property and component level validation is given and form submitted", async () => {
    const maxSize = 1000000;
    const input1HelperText = "Input 1 Helper Text";
    const expectedErrorMessage = "Please fix the error in this field.";

    const handleSubmit = (data: FormSubmitData) => {
      const submitValues = data.values;

      const { files } = submitValues;
      const submittedFiles = files ? (submitValues.files as FileType[]) : [];
      if (submittedFiles.length) {
        const submittedFile = submittedFiles[0];
        expect(submittedFile.status).toBe(STATUS.CHECK_FAIL);
        expect(submittedFile.file.size).toBe(MOCK.filePng2mb.size);
        expect(submittedFile.file.name).toBe(MOCK.filePng2mb.name);
        expect(submittedFile.messages?.length).toBe(1);
      }
    };

    render(
      <Form onSubmit={handleSubmit}>
        <Form.Field name="files" helperText={input1HelperText}>
          <UploadInput {...requiredProps} name="files" maxSize={maxSize} />
        </Form.Field>
      </Form>,
    );

    const user = userEvent.setup();
    const button = screen.getByText(t("g.submit"));

    // Upload Input - Error State 1
    await user.click(button);

    const uploadItem1 = screen.getAllByTestId("uploadInputItem")[0];
    expect(uploadItem1).not.toHaveClass("error");
    expect(getFormField(0)).toHaveTextContent(input1HelperText);

    // Upload Inputs - Upload Progress
    const fileInput1 = uploadItem1.parentElement?.children[1];

    // Upload Item 1
    await act(() => fireEvent.change(fileInput1!, { target: { files: [MOCK.filePng2mb] } }));

    // Upload Item 1 - Errors
    expect(uploadItem1).toHaveClass("error");
    expect(getFormField(0)).toHaveTextContent(MOCK.filePng2mb.name);
    expect(getFormField(0)).toHaveTextContent(expectedErrorMessage);

    // for handleSubmit function
    await user.click(button);
  });

  it("should be rendered as error and show component level error message when required validation property and component level validation is given and form submitted", async () => {
    const maxSize = 500000;
    const inputHelperText = "Input Helper Text";
    const expectedErrorMessage = t(MESSAGE.MAX_SIZE_ERROR, {
      maxSize: "500 KB",
      fileName: MOCK.fileGif1mb.name,
      fileSize: "1 MB",
    });

    const handleSubmit = (data: FormSubmitData) => {
      const submitValues = data.values;
      if (submitValues.length) {
        const files = submitValues.files as FileType[];
        const submittedFile = files[0];
        expect(submittedFile.status).toBe(STATUS.CHECK_FAIL);
        expect(submittedFile.file.size).toBe(MOCK.fileGif1mb.size);
        expect(submittedFile.file.name).toBe(MOCK.fileGif1mb.name);
        expect(submittedFile.messages?.length).toBe(1);
      }
    };

    render(
      <Form onSubmit={handleSubmit}>
        <Form.Field name="files" helperText={inputHelperText}>
          <UploadList {...requiredProps} name="files" maxSize={maxSize} />
        </Form.Field>
      </Form>,
    );

    const user = userEvent.setup();
    const button = screen.getByText(t("g.submit"));

    // Upload List - Error State 1
    await user.click(button);

    const uploadItem = screen.queryByText(t(MESSAGE.PLEASE_DROP))?.parentElement;
    expect(uploadItem).not.toHaveClass("error");
    expect(getFormField(0)).toHaveTextContent(inputHelperText);

    // Upload Inputs - Upload Progress
    const fileInput = uploadItem?.parentElement?.parentElement?.children[1];

    // Upload Item
    await act(() => fireEvent.change(fileInput!, { target: { files: [MOCK.fileGif1mb] } }));

    // Upload Item - Errors
    expect(uploadItem).toHaveClass("error");
    expect(getFormField(0)).not.toHaveTextContent(inputHelperText);
    expect(getFormField(0)).toHaveTextContent(MOCK.fileGif1mb.name);
    expect(getFormField(0)).toHaveTextContent(expectedErrorMessage);

    // for handleSubmit function
    await user.click(button);
  });

  it("should be rendered as grid inside of form", () => {
    render(
      <Form onSubmit={() => {}}>
        <Grid>
          <Row>
            <Col size={3}>
              <Form.Field name="inputName">
                <InputText name="inputName" />
              </Form.Field>
            </Col>
            <Col size={3}>
              <Form.Field name="inputSurname">
                <InputText name="inputSurname" />
              </Form.Field>
            </Col>
            <Col size={3}>
              <Form.Field name="inputAge">
                <InputText name="inputAge" />
              </Form.Field>
            </Col>
          </Row>
          <Row>
            <Col size={6}>
              <Form.Field name="inputCity">
                <InputText name="inputCity" />
              </Form.Field>
            </Col>
            <Col md={6}>
              <Form.Field name="inputCountry">
                <InputText name="inputCountry" />
              </Form.Field>
            </Col>
          </Row>
        </Grid>
      </Form>,
    );

    expect(screen.getAllByTestId("grid-row")[0]).toHaveClass("row");
    expect(screen.getAllByTestId("grid-row")[0]?.parentElement).toHaveClass("Root");
    expect(screen.getAllByTestId("grid-row")[0]?.firstElementChild).toHaveClass("col-size-3");
    expect(screen.getAllByTestId("grid-row")[1]?.firstElementChild).toHaveClass("col-size-6");
    expect(screen.getAllByTestId("grid-row")[1]?.children[1]).toHaveClass("col-md-6");
  });

  it("should clear the form when clearForm function of the Form reference is called", async () => {
    const TestComponent = () => {
      const ref = useRef<FormRefType>(null);

      return (
        <>
          <Form onSubmit={jest.fn} ref={ref}>
            <Form.Field name="field">
              <InputText value="field value" />
            </Form.Field>
          </Form>
          <button onClick={() => ref.current?.clearForm()}>Custom Clear Button</button>
        </>
      );
    };

    render(<TestComponent />);

    const inputItem = screen.getByTestId("inputItem").querySelector("input");
    expect(inputItem).toHaveValue("field value");

    const user = userEvent.setup();
    await user.click(screen.getByText("Custom Clear Button"));
    expect(inputItem).toHaveValue("");
  });

  it("should remove the inputs values in form submit data when the inputs unmount from their groups", async () => {
    const submittedValues: FormSubmitData[] = [];

    const TestComponent = () => {
      const [value, setValue] = useState("all");

      const handleSubmit = (data: FormSubmitData) => {
        submittedValues.push(data);
      };

      return (
        <Form onSubmit={handleSubmit}>
          <Form.Field name="inputText1">
            <InputText value={value} onChange={newValue => setValue(newValue as string)} />
          </Form.Field>

          <Form.FieldGroup name="inputGroup1">
            <InputText name="inputText2" value="Value Text 2" />
            {value === "all" && <InputText name="inputText3" value="Value Text 3" />}
          </Form.FieldGroup>

          {value === "all" && (
            <Form.FieldGroup name="inputGroup2">
              <InputText name="inputText3" value="Value Text 3" />
              <InputText name="inputText4" value="Value Text 4" />
            </Form.FieldGroup>
          )}
        </Form>
      );
    };

    render(<TestComponent />);

    const user = userEvent.setup();
    const submitButton = screen.getByText(t("g.submit"));

    await user.click(submitButton);

    const input = screen.getByDisplayValue("all");
    await user.clear(input);
    await user.type(input, "some");

    await user.click(submitButton);

    expect(submittedValues[0].values).toEqual({
      inputText1: "all",
      inputGroup1: {
        inputText2: "Value Text 2",
        inputText3: "Value Text 3",
      },
      inputGroup2: {
        inputText3: "Value Text 3",
        inputText4: "Value Text 4",
      },
    });

    expect(submittedValues[1].values).toEqual({
      inputText1: "some",
      inputGroup1: {
        inputText2: "Value Text 2",
      },
    });
  });

  it("should display the title as given in the title prop", () => {
    const title = "Form Title";
    const { rerender } = render(<Form onSubmit={mockFunction} title={title} />);
    expect(screen.queryByText(title)).toBeInTheDocument();
    rerender(<Form onSubmit={mockFunction} />);
    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });

  it("should clear time,date and datetime input text values when clear button is clicked", async () => {
    render(
      <Form onSubmit={jest.fn} enableClearButton>
        <Form.Field name="inputDate">
          <InputDate value={new Date("10/10/2025")} />
        </Form.Field>
        <Form.Field name="inputTime">
          <InputTime value={{ hours: 18, minutes: 15, seconds: 33 }} secondsEnabled />
        </Form.Field>
        <Form.Field name="inputDateTime">
          <InputDateTime value={new Date("11/11/2025 12:30:45")} secondsEnabled />
        </Form.Field>
      </Form>,
    );

    const user = userEvent.setup();
    await user.click(screen.getByText(t("g.clear")));

    const emptyVal = "";
    expect(getFormField(0)?.querySelector("input")).toHaveValue(emptyVal);
    expect(getFormField(1)?.querySelector("input")).toHaveValue(emptyVal);
    expect(getFormField(2)?.querySelector("input")).toHaveValue(emptyVal);
  });

  it("should not submit the value of a form item which is initially rendered but then conditionally unmounted", async () => {
    const handleSubmit = jest.fn();

    const TestComponent = () => {
      const [isVisible, setIsVisible] = useState(true);

      return (
        <>
          <Form onSubmit={handleSubmit}>
            <Form.Field name="inputText1">
              <InputText value="Value Text 1" />
            </Form.Field>
            {isVisible && (
              <Form.Field name="inputText2">
                <InputText value="Value Text 2" />
              </Form.Field>
            )}
          </Form>
          <button onClick={() => setIsVisible(false)}>Hide Input</button>
        </>
      );
    };

    render(<TestComponent />);

    await userEvent.click(screen.getByText(t("g.submit")));
    expect(handleSubmit).toHaveBeenCalledWith(
      {
        values: {
          inputText1: "Value Text 1",
          inputText2: "Value Text 2",
        },
        isValid: true,
      },
      expect.anything(),
    );

    await userEvent.click(screen.getByText("Hide Input"));
    await userEvent.click(screen.getByText(t("g.submit")));

    expect(handleSubmit).toHaveBeenLastCalledWith(
      {
        values: {
          inputText1: "Value Text 1",
        },
        isValid: true,
      },
      expect.anything(),
    );
  });

  it("should render the form items and the submit area aligned regardless of the label availability when formAlignment is horizontal", () => {
    const labelOrientations = ["horizontal", "vertical"] as const;
    const cases = [{ hasLabel: false }, { hasLabel: true, label: "label" }];

    const checkAssertion = (field: HTMLElement, hasLabel: boolean) => {
      if (hasLabel) {
        expect(field).toHaveAttribute("data-has-label");
        expect(field.querySelector('[class*="label"]')).toBeInTheDocument();
      } else {
        expect(field).not.toHaveAttribute("data-has-label");
        expect(field.querySelector('[class*="label"]')).not.toBeInTheDocument();
      }
    };

    labelOrientations.forEach(labelOrientation => {
      cases.forEach(({ hasLabel, label }) => {
        const { rerender, unmount } = render(
          <Form onSubmit={mockFunction} formOrientation="horizontal" labelOrientation={labelOrientation}>
            <Form.Field name="input" {...(hasLabel && { label })}>
              <InputText />
            </Form.Field>
          </Form>,
        );

        checkAssertion(getFormField(0)!, hasLabel);

        rerender(
          <Form onSubmit={mockFunction} formOrientation="horizontal" labelOrientation={labelOrientation}>
            <Form.FieldGroup name="group1" {...(hasLabel && { label })}>
              <InputText name="group1" />
            </Form.FieldGroup>
          </Form>,
        );

        checkAssertion(getFormFieldGroup(0)!, hasLabel);
        unmount();
      });
    });
  });

  it("should not show any errors on initial render validateOnChange is set, even when all field values are invalid", () => {
    render(
      <Form onSubmit={mockFunction} validateOnChange>
        <Form.Field name="inputText" validations={[Validations.Required]}>
          <InputText />
        </Form.Field>
        <Form.Field name="inputPassword" validations={[Validations.Required]}>
          <InputPassword />
        </Form.Field>
        <Form.Field name="textarea" validations={[Validations.Required]}>
          <Textarea />
        </Form.Field>
        <Form.Field name="switch" validations={[Validations.Required]}>
          <Switch />
        </Form.Field>
        <Form.Field name="radioGroup" validations={[Validations.Required]}>
          <RadioGroup name="radioGroup">
            <Radio value="Black" label="Black" />
            <Radio value="White" label="White" />
          </RadioGroup>
        </Form.Field>
        <Form.Field name="select" validations={[Validations.Required]}>
          <Select data={data} />
        </Form.Field>
        <Form.FieldGroup name="sports" groupValidations={[Validations.Required, Validations.AtLeastN(2)]}>
          <Checkbox name="volleyball" label="Volleyball" />
          <Checkbox name="basketball" label="Basketball" />
          <Checkbox name="tennis" label="Tennis" />
        </Form.FieldGroup>
      </Form>,
    );

    screen.queryAllByTestId("formField").forEach(field => expect(field).not.toHaveClass("error"));
    expect(getFormFieldGroup(0)).not.toHaveClass("error");
  });

  it("should show and clear errors immediately for inputs when validateOnChange is set", async () => {
    const minMessage = (min: number) => `You must enter at least ${min}`;
    const minLengthMessage = (min: number) => `This field must be at least ${min} characters long`;
    const requiredMessage = "Please fill in this field";

    render(
      <Form onSubmit={mockFunction} validateOnChange>
        {/* 0: InputText — MinLength(3): invalid → valid */}
        <Form.Field name="inputText" validations={[Validations.MinLength(3)]}>
          <InputText />
        </Form.Field>
        {/* 1: Checkbox — Required, start checked: uncheck → error, recheck → clear */}
        <Form.Field name="check" validations={[Validations.Required]}>
          <Checkbox checked label="Accept" />
        </Form.Field>
        {/* 2: Slider — Min(50): below → error, above → clear */}
        <Form.Field name="mySlider" validations={[Validations.Min(50)]}>
          <Slider />
        </Form.Field>
        {/* 3: Select — Required: select item → no error */}
        <Form.Field name="mySelect" validations={[Validations.Required]}>
          <Select data={data} />
        </Form.Field>
        {/* 4: PinCode — RequiredArrayItems([0,1]): fill first only → error, fill second → clear */}
        <Form.Field name="myPinCode" validations={[Validations.RequiredArrayItems([0, 1])]}>
          <PinCode>
            <PinCode.Item />
            <PinCode.Item />
          </PinCode>
        </Form.Field>
      </Form>,
    );

    const user = userEvent.setup();

    // InputText: type 2 chars → error; type 1 more → clear
    const textInput = getFormField(0)?.querySelector("input") as HTMLInputElement;
    await user.type(textInput, "ab");
    expect(getFormField(0)).toHaveClass("error");
    expect(getFormField(0)).toHaveTextContent(minLengthMessage(3));
    await user.type(textInput, "c");
    expect(getFormField(0)).not.toHaveClass("error");

    // Checkbox: uncheck → error; recheck → clear
    const checkboxInput = screen.getByTestId("checkbox").querySelector("input") as HTMLInputElement;
    await user.click(checkboxInput);
    expect(getFormField(1)).toHaveClass("error");
    expect(getFormField(1)).toHaveTextContent(requiredMessage);
    await user.click(checkboxInput);
    expect(getFormField(1)).not.toHaveClass("error");

    // Slider: change to 30 → error; change to 60 → clear
    const sliderInput = screen.getByTestId("slider").querySelector("input[type='range']")!;
    await act(() => fireEvent.change(sliderInput, { target: { value: "30" } }));
    expect(getFormField(2)).toHaveClass("error");
    expect(getFormField(2)).toHaveTextContent(minMessage(50));
    await act(() => fireEvent.change(sliderInput, { target: { value: "60" } }));
    expect(getFormField(2)).not.toHaveClass("error");

    // Select: select an item → no error
    await user.click(screen.queryByRole("combobox")!);
    await user.click(screen.queryByText("Item 1")!);
    expect(getFormField(3)).not.toHaveClass("error");

    // PinCode: fill first item only → error; fill second → clear
    const pinCodeInputs = screen.getByTestId("pinCode").querySelectorAll("input");
    await user.type(pinCodeInputs[0], "a");
    expect(getFormField(4)).toHaveClass("error");
    expect(getFormField(4)).toHaveTextContent(requiredMessage);
    await user.type(pinCodeInputs[1], "b");
    expect(getFormField(4)).not.toHaveClass("error");
  });

  it("should show group validation error on FieldGroup immediately as inputs change when validateOnChange is set", async () => {
    const atLeastNMessage = (n: number) => `You must select at least ${n} items`;

    render(
      <Form onSubmit={mockFunction} validateOnChange>
        <Form.FieldGroup name="sports" groupValidations={[Validations.AtLeastN(2)]}>
          <Checkbox name="volleyball" label="Volleyball" />
          <Checkbox name="basketball" label="Basketball" />
          <Checkbox name="tennis" label="Tennis" />
        </Form.FieldGroup>
      </Form>,
    );

    const user = userEvent.setup();
    const checkboxInputs = screen.getAllByTestId("checkbox").map(el => el.querySelector("input") as HTMLInputElement);

    await user.click(checkboxInputs[0]);
    expect(getFormFieldGroup(0)).toHaveClass("error");
    expect(getFormFieldGroup(0)).toHaveTextContent(atLeastNMessage(2));

    await user.click(checkboxInputs[1]);
    expect(getFormFieldGroup(0)).not.toHaveClass("error");

    await user.click(checkboxInputs[0]);
    expect(getFormFieldGroup(0)).toHaveClass("error");
  });

  it("should not validate on change when validateOnChange is not set", async () => {
    render(
      <Form onSubmit={mockFunction}>
        <Form.Field name="inputText" validations={[Validations.Required]}>
          <InputText />
        </Form.Field>
      </Form>,
    );

    const user = userEvent.setup();
    const input = screen.getByTestId("inputItem").querySelector("input")!;

    await user.type(input, "hello");
    await user.clear(input);
    expect(getFormField(0)).not.toHaveClass("error");

    await user.click(screen.getByText(t("g.submit")));
    expect(getFormField(0)).toHaveClass("error");
  });

  it("should validate all fields on submit even when validateOnChange is set", async () => {
    render(
      <Form onSubmit={mockFunction} validateOnChange>
        <Form.Field name="inputText" validations={[Validations.Required]}>
          <InputText value="hello" />
        </Form.Field>
        <Form.Field name="inputPassword" validations={[Validations.Required]}>
          <InputPassword />
        </Form.Field>
      </Form>,
    );

    const user = userEvent.setup();

    expect(getFormField(0)).not.toHaveClass("error");
    expect(getFormField(1)).not.toHaveClass("error");

    await user.click(screen.getByText(t("g.submit")));

    expect(getFormField(0)).not.toHaveClass("error");
    expect(getFormField(1)).toHaveClass("error");
  });

  it("should not render the submit button when onSubmit is not provided", () => {
    render(
      <Form>
        <Form.Field name="inputText">
          <InputText />
        </Form.Field>
      </Form>,
    );
    expect(screen.queryByText(t("g.submit"))).not.toBeInTheDocument();
  });

  it("should render buttons (with the given props) in the submit area when alternateButtons prop is provided", async () => {
    const mockFunction = jest.fn();
    render(
      <Form
        alternateButtons={[
          <Button key="1" label="Custom 1" onClick={mockFunction} variant="warning" />,
          <Button key="2" label="Custom 2" onClick={mockFunction} icon="person" variant="danger" />,
        ]}
      >
        <Form.Field name="inputText">
          <InputText />
        </Form.Field>
      </Form>,
    );

    const button1 = screen.getByText("Custom 1").closest("button");
    expect(button1).toBeInTheDocument();
    expect(button1).toHaveClass("warning");

    const button2 = screen.getByText("Custom 2").closest("button");
    expect(button2).toBeInTheDocument();
    expect(button2).toHaveClass("danger");
    expect(button2).toHaveTextContent("person");

    const user = userEvent.setup();
    await user.click(button1!);
    expect(mockFunction).toHaveBeenCalledTimes(1);

    await user.click(button2!);
    expect(mockFunction).toHaveBeenCalledTimes(2);
  });

  it("should render alternate buttons with primary variant by default", () => {
    render(
      <Form alternateButtons={[<Button key="1" label="Custom 1" onClick={jest.fn()} />]}>
        <Form.Field name="inputText">
          <InputText />
        </Form.Field>
      </Form>,
    );

    expect(screen.getByText("Custom 1").closest("button")).toHaveClass("primary");
  });

  it("should include UploadInput, UploadDragger, UploadList value files in form submit data", async () => {
    const uploadValueServerFiles = [
      { id: "server-1", name: "file.pdf", type: "application/pdf", size: 2048 },
      { id: "server-2", name: "file.png", type: "image/png", size: 1024 },
      { id: "server-3", name: "file.tiff", type: "image/tiff", size: 512 },
    ];

    const handleSubmit = (data: FormSubmitData) => {
      const inputValues = [
        data.values.uploadInput as FileType[],
        data.values.uploadList as FileType[],
        data.values.uploadDragger as FileType[],
      ];

      inputValues.forEach((files, i) => {
        expect(files).toHaveLength(1);
        expect(files[0].id).toBe(uploadValueServerFiles[i].id);
        expect(files[0].file.name).toBe(uploadValueServerFiles[i].name);
        expect(files[0].status).toBe(STATUS.SUCCESS);
        expect(files[0].uploaded).toBe(true);
      });
    };

    render(
      <Form onSubmit={handleSubmit}>
        <Form.Field name="uploadInput">
          <UploadInput {...requiredProps} value={[uploadValueServerFiles[0]]} />
        </Form.Field>
        <Form.Field name="uploadList">
          <UploadList {...requiredProps} value={[uploadValueServerFiles[1]]} />
        </Form.Field>
        <Form.Field name="uploadDragger">
          <UploadDragger {...requiredProps} value={[uploadValueServerFiles[2]]} />
        </Form.Field>
      </Form>,
    );

    await userEvent.setup().click(screen.getByText(t("g.submit")));
  });

  it("should pass RequiredUploadedFile validation for UploadInput, UploadList, and UploadDragger when value files are present on mount", async () => {
    const serverFile = { id: "server-1", name: "server-doc.pdf", type: "application/pdf", size: 2048 };

    render(
      <Form onSubmit={mockFunction}>
        <Form.Field name="uploadInput" validations={[Validations.RequiredUploadedFile]}>
          <UploadInput {...requiredProps} value={[serverFile]} />
        </Form.Field>
        <Form.Field name="uploadList" validations={[Validations.RequiredUploadedFile]}>
          <UploadList {...requiredProps} value={[serverFile]} />
        </Form.Field>
        <Form.Field name="uploadDragger" validations={[Validations.RequiredUploadedFile]}>
          <UploadDragger {...requiredProps} value={[serverFile]} />
        </Form.Field>
      </Form>,
    );

    await userEvent.setup().click(screen.getByText(t("g.submit")));
    expect(getFormField(0)).not.toHaveClass("error");
    expect(getFormField(1)).not.toHaveClass("error");
    expect(getFormField(2)).not.toHaveClass("error");
  });

  it("should show the errors passed through externalErrors prop on initial render", () => {
    render(
      <Form onSubmit={mockFunction} externalErrors={{ inputName: "Server said no" }}>
        <Form.Field name="inputName">
          <InputText name="inputName" />
        </Form.Field>
      </Form>,
    );

    expect(getFormField(0)).toHaveClass("error");
    expect(getFormField(0)).toHaveTextContent("Server said no");
  });

  it("should update the displayed error when the errors prop changes", () => {
    const { rerender } = render(
      <Form onSubmit={mockFunction} externalErrors={{ inputName: "First error" }}>
        <Form.Field name="inputName">
          <InputText name="inputName" />
        </Form.Field>
      </Form>,
    );
    expect(getFormField(0)).toHaveTextContent("First error");

    rerender(
      <Form onSubmit={mockFunction} externalErrors={{ inputName: "Second error" }}>
        <Form.Field name="inputName">
          <InputText name="inputName" />
        </Form.Field>
      </Form>,
    );
    expect(getFormField(0)).toHaveClass("error");
    expect(getFormField(0)).toHaveTextContent("Second error");
  });

  it("should clear the external error when it is removed from the errors prop", () => {
    const { rerender } = render(
      <Form onSubmit={mockFunction} externalErrors={{ inputName: "Server said no" }}>
        <Form.Field name="inputName" helperText="Helper text">
          <InputText name="inputName" />
        </Form.Field>
      </Form>,
    );
    expect(getFormField(0)).toHaveClass("error");

    rerender(
      <Form onSubmit={mockFunction} externalErrors={{}}>
        <Form.Field name="inputName" helperText="Helper text">
          <InputText name="inputName" />
        </Form.Field>
      </Form>,
    );
    expect(getFormField(0)).not.toHaveClass("error");
    expect(getFormField(0)).toHaveTextContent("Helper text");
  });

  it("should clear the external error when the user edits the field", async () => {
    render(
      <Form onSubmit={mockFunction} externalErrors={{ inputName: "Server said no" }}>
        <Form.Field name="inputName" helperText="Helper text">
          <InputText name="inputName" />
        </Form.Field>
      </Form>,
    );
    expect(getFormField(0)).toHaveClass("error");

    const user = userEvent.setup();
    await user.type(screen.getAllByTestId("inputItem")[0].querySelector("input")!, "a");

    expect(getFormField(0)).not.toHaveClass("error");
    expect(getFormField(0)).toHaveTextContent("Helper text");
  });

  it("should show the external error on a Form.FieldGroup keyed by its name", () => {
    render(
      <Form onSubmit={mockFunction} externalErrors={{ inputCheckboxGroup: "At least one option is invalid" }}>
        <Form.FieldGroup name="inputCheckboxGroup" label="Group">
          <Checkbox label="Voleybol" name="volleyball" />
          <Checkbox label="Basketbol" name="basketball" />
        </Form.FieldGroup>
      </Form>,
    );

    expect(getFormFieldGroup(0)).toHaveClass("error");
    expect(getFormFieldGroup(0)).toHaveTextContent("At least one option is invalid");
  });

  it("should apply an already-known external error to a field that registers after the errors prop was set", () => {
    const ConditionalField = () => {
      const [show, setShow] = useState(false);
      return (
        <Form onSubmit={mockFunction} externalErrors={{ lateField: "Late error" }}>
          <Button label="Show" onClick={() => setShow(true)} />
          {show && (
            <Form.Field name="lateField">
              <InputText name="lateField" />
            </Form.Field>
          )}
        </Form>
      );
    };

    render(<ConditionalField />);
    expect(getFormField(0)).toBeUndefined();
    fireEvent.click(screen.getByText("Show"));

    expect(getFormField(0)).toHaveClass("error");
    expect(getFormField(0)).toHaveTextContent("Late error");
  });

  it("should not affect validate()'s isValid when an external error is active", async () => {
    const handleSubmit = jest.fn();
    render(
      <Form onSubmit={handleSubmit} externalErrors={{ inputName: "Server said no" }}>
        <Form.Field name="inputName">
          <InputText name="inputName" />
        </Form.Field>
      </Form>,
    );

    await userEvent.setup().click(screen.getByText(t("g.submit")));

    expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({ isValid: true }), expect.anything());
  });

  it("should clear a field's external error when its value is reset via resetIfValidatedOnSubmit", async () => {
    render(
      <Form onSubmit={mockFunction} externalErrors={{ inputName: "Server said no" }} resetIfValidatedOnSubmit>
        <Form.Field name="inputName">
          <InputText name="inputName" value="existing value" />
        </Form.Field>
      </Form>,
    );
    expect(getFormField(0)).toHaveClass("error");

    await userEvent.setup().click(screen.getByText(t("g.submit")));

    expect(getFormField(0)).not.toHaveClass("error");
    expect(screen.getAllByTestId("inputItem")[0].querySelector("input")).toHaveValue("");
  });

  it("should not show an external error on a disabled field", () => {
    const { rerender } = render(
      <Form onSubmit={mockFunction} externalErrors={{ inputName: "Server said no" }}>
        <Form.Field name="inputName" disabled>
          <InputText name="inputName" />
        </Form.Field>
      </Form>,
    );
    expect(getFormField(0)).not.toHaveClass("error");

    rerender(
      <Form onSubmit={mockFunction} externalErrors={{ inputName: "Different message" }}>
        <Form.Field name="inputName" disabled>
          <InputText name="inputName" />
        </Form.Field>
      </Form>,
    );
    expect(getFormField(0)).not.toHaveClass("error");
  });

  it("should not apply an external error to a disabled field that registers after the errors prop was set", () => {
    const ConditionalDisabledField = () => {
      const [show, setShow] = useState(false);
      return (
        <Form onSubmit={mockFunction} externalErrors={{ lateField: "Late error" }}>
          <Button label="Show" onClick={() => setShow(true)} />
          {show && (
            <Form.Field name="lateField" disabled>
              <InputText name="lateField" />
            </Form.Field>
          )}
        </Form>
      );
    };

    render(<ConditionalDisabledField />);
    fireEvent.click(screen.getByText("Show"));

    expect(getFormField(0)).not.toHaveClass("error");
  });

  it("should keep a field's internal error on screen instead of an externalErrors update while it's still active", async () => {
    const maxSize = 1000000;

    const { rerender } = render(
      <Form onSubmit={mockFunction} externalErrors={{}}>
        <Form.Field name="files">
          <UploadInput {...requiredProps} name="files" maxSize={maxSize} />
        </Form.Field>
      </Form>,
    );

    const uploadItem = screen.getAllByTestId("uploadInputItem")[0];
    const fileInput = uploadItem.parentElement?.children[1];
    await act(() => fireEvent.change(fileInput!, { target: { files: [MOCK.filePng2mb] } }));

    expect(uploadItem).toHaveClass("error");
    expect(getFormField(0)).toHaveTextContent(t("form.fieldError"));

    rerender(
      <Form onSubmit={mockFunction} externalErrors={{ files: "Server says: this file was already used before" }}>
        <Form.Field name="files">
          <UploadInput {...requiredProps} name="files" maxSize={maxSize} />
        </Form.Field>
      </Form>,
    );

    expect(getFormField(0)).toHaveTextContent(t("form.fieldError"));
    expect(getFormField(0)).not.toHaveTextContent("Server says: this file was already used before");
  });
});
