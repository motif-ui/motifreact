import { render, screen, fireEvent, act } from "@testing-library/react";
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
import UploadInput from "@/components/Upload/UploadInput";
import UploadList from "@/components/Upload/UploadList";
import Grid from "@/components/Grid";
import Row from "@/components/Grid/components/Row";
import Col from "@/components/Grid/components/Col";
import { MOCK } from "../../Upload/mock";
import { MESSAGE, STATUS } from "@/components/Upload/constants";
import { FileType } from "@/components/Upload/types";

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
import InputDate from "@/components/InputDate";
import InputTime from "@/components/InputTime";
import InputDateTime from "@/components/InputDateTime";
import { formatDate } from "@/components/InputDate/helper";
import { DateUtils } from "../../../../utils/dateUtils";
import Slider from "@/components/Slider";
import SliderRange from "@/components/SliderRange";
import { defaultDateFormat } from "@/components/Motif/Pickers/types";
import { LOCALE_DATE_TR_TR } from "@/components/DatePicker/locale/tr_TR";

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

    await user.click(screen.getByText("Temizle"));
    expect(inputItem1).toHaveValue("");
    expect(queryByDisplayValue("input2 value")).not.toBeInTheDocument();

    await user.click(screen.getByText("Gönder"));
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

  it("should clear form values by default when it is submitted and the form is valid", async () => {
    render(
      <Form onSubmit={jest.fn}>
        <Form.Field name="input" validations={[Validations.MinLength(5)]}>
          <InputText value="inp" />
        </Form.Field>
      </Form>,
    );

    const user = userEvent.setup();
    const inputItem = screen.getByTestId("inputItem").querySelector("input");

    await user.click(screen.getByText("Gönder"));
    expect(inputItem).toHaveValue("inp");

    await user.type(inputItem as Element, "ut value");
    await user.click(screen.getByText("Gönder"));
    expect(inputItem).toHaveValue("");
  });

  it("should not clear form values when dontClearOnSubmit is true", async () => {
    render(
      <Form onSubmit={jest.fn} dontClearOnSubmit>
        <Form.Field name="input" validations={[Validations.MinLength(5)]}>
          <InputText value="inp" />
        </Form.Field>
      </Form>,
    );

    const user = userEvent.setup();
    const inputItem = screen.getByTestId("inputItem").querySelector("input");

    await user.click(screen.getByText("Gönder"));
    expect(inputItem).toHaveValue("inp");

    await user.type(inputItem as Element, "ut value");
    await user.click(screen.getByText("Gönder"));
    expect(inputItem).toHaveValue("input value");
  });

  it("should render all form fields and elements in the given size unless it is set explicitly by the input itself", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];
    const titleHeadingMap = { xs: "h5", sm: "h4", md: "h3", lg: "h2" };

    const mainForm = (size: InputSize) => (
      <Form onSubmit={mockFunction} size={size} title="Form Title">
        <Form.Field name="input">
          <InputText />
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
    await user.click(inputItems[3].firstElementChild!);

    // Radio Group
    await user.click(inputItems[4].firstElementChild!);

    // Select
    expect(inputItems[6]).toHaveClass("disabled");
    await user.click(screen.queryByRole("combobox")!);
    await user.click(screen.queryByText("Item 2")!);

    // Input Date
    const newDateValue = new Date(2024, 1, 21);
    await user.type(
      screen.getByDisplayValue(formatDate(DateUtils.getTodayTimeless(), defaultDateFormat, LOCALE_DATE_TR_TR)),
      formatDate(newDateValue, defaultDateFormat, LOCALE_DATE_TR_TR),
    );

    // Switch
    await user.click(inputItems[8].firstElementChild!);

    // Pin Code
    expect(inputItems[9].getElementsByTagName("input")[0]).toHaveAttribute("disabled");
    await user.type(inputItems[9].getElementsByTagName("input")[0], value);
    await user.click(screen.getByText("Gönder"));
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
    expect(inputItems[9]).toHaveClass("success");
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
    expect(inputItems[0].firstElementChild).toHaveAttribute("readonly");
    await user.type(inputItems[0].firstElementChild!, value);

    // Input Password
    expect(inputItems[1].lastElementChild).toHaveAttribute("readonly");
    await user.type(inputItems[1].lastElementChild!, value);

    // Textarea
    expect(inputItems[2].firstElementChild).toHaveAttribute("readonly");
    await user.type(inputItems[2].firstElementChild!, value);

    // Checkbox
    expect(inputItems[3].firstElementChild).toHaveAttribute("readonly");

    // Radio Group
    expect(inputItems[4].firstElementChild).toHaveAttribute("readonly");
    expect(inputItems[5].firstElementChild).toHaveAttribute("readonly");

    // Select
    expect((inputItems[6].firstElementChild as HTMLDivElement).getAttribute("aria-readonly")).toBe("true");
    await user.click(screen.queryByRole("combobox")!);
    await user.click(screen.queryByText("Item 2")!);

    // Input Date
    const newDateValue = new Date(2024, 1, 21);
    expect(inputItems[7].children[1]).toHaveAttribute("readOnly");
    await user.type(inputItems[7].lastElementChild!, formatDate(newDateValue, defaultDateFormat, LOCALE_DATE_TR_TR));

    // Pin Code
    expect(screen.getAllByTestId("pinCodeItem")[0]).toHaveAttribute("readonly");
    await user.type(inputItems[9].getElementsByTagName("input")[0], value);

    await user.click(screen.getByText("Gönder"));
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
    await user.click(screen.getByText("Gönder"));
  });

  it("should render form items in error state when form is submitted and a validation fails", async () => {
    const validationMessage = "Lütfen bu alanı doldurunuz";
    const fileValidationMessage = "Lütfen en az bir dosya yükleyiniz";

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
    await user.click(screen.getByText("Gönder"));

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
    const validationMessage = "Lütfen bu alanı doldurunuz";
    const fileValidationMessage = "Lütfen en az bir dosya yükleyiniz";
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
    await user.click(screen.getByText("Gönder"));

    items.forEach((element, index) => {
      expect(getFormField(index)).toHaveClass("error");
      expect(getFormField(index)).toHaveTextContent(
        element.key === "uploadInputPF" || element.key === "uploadListOF" || element.key === "uploadDraggerDF"
          ? fileValidationMessage
          : validationMessage,
      );
    });

    await user.type(screen.getAllByTestId("inputItem")[0].firstElementChild!, value);
    await user.type(screen.getByTestId("inputPassword").lastElementChild!, value);
    await user.type(screen.getByTestId("inputDate").firstElementChild!.children[1] as HTMLInputElement, "12/12/2024");
    await user.type(screen.getAllByTestId("pinCodeItem")[0], value);
    await user.click(screen.getByText("Black"));
    await user.click(screen.queryByRole("combobox")!);
    await user.click(screen.queryByText("Item 1")!);
    await user.click(screen.getByTestId("switchItem"));
    await act(() =>
      fireEvent.drop(screen.getAllByText("Gözat..")[0].parentElement as Element, { dataTransfer: { files: [MOCK.filePng2mb] } }),
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

    items.forEach((element, index) => {
      expect(getFormField(index)).not.toHaveClass("error");
      expect(getFormField(index)).toHaveTextContent("Helper Text " + element.key);
    });
  });

  it("should be rendered as error and show component level message when required validation property and component level validation is given and form submitted", async () => {
    const maxSize = 1000000;
    const input1HelperText = "Input 1 Helper Text";
    const expectedErrorMessage = "Lütfen bu alandaki hatayı giderin.";

    const handleSubmit = (data: FormSubmitData) => {
      const submitValues = data.values;

      const { personalFiles } = submitValues;
      const submittedFiles = personalFiles ? (submitValues.personalFiles as FileType[]) : [];
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
        <Form.Field name="personalFiles" helperText={input1HelperText}>
          <UploadInput {...requiredProps} name="personalFiles" maxSize={maxSize} />
        </Form.Field>
      </Form>,
    );

    const user = userEvent.setup();
    const button = screen.getByText("Gönder");

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
    const expectedErrorMessage = "Dosyanızın boyutu maksimum 500 KB olabilir. 'test.gif' dosyanızın boyutu: 1 MB";

    const handleSubmit = (data: FormSubmitData) => {
      const submitValues = data.values;

      if (submitValues.personalFiles) {
        const officialFiles = submitValues.officialFiles as FileType[];
        const submittedFile = officialFiles[0];
        expect(submittedFile.status).toBe(STATUS.CHECK_FAIL);
        expect(submittedFile.file.size).toBe(MOCK.fileGif1mb.size);
        expect(submittedFile.file.name).toBe(MOCK.fileGif1mb.name);
        expect(submittedFile.messages?.length).toBe(1);
      }
    };

    render(
      <Form onSubmit={handleSubmit}>
        <Form.Field name="officialFiles" helperText={inputHelperText}>
          <UploadList {...requiredProps} name="officialFiles" maxSize={maxSize} />
        </Form.Field>
      </Form>,
    );

    const user = userEvent.setup();
    const button = screen.getByText("Gönder");

    // Upload List - Error State 1
    await user.click(button);

    const uploadItem = screen.queryByText(MESSAGE.PLEASE_DROP)?.parentElement;
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
        <Form onSubmit={handleSubmit} dontClearOnSubmit>
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
    const submitButton = screen.getByText("Gönder");

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
    await user.click(screen.getByText("Temizle"));

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
          <Form onSubmit={handleSubmit} dontClearOnSubmit>
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

    await userEvent.click(screen.getByText("Gönder"));
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
    await userEvent.click(screen.getByText("Gönder"));

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
});
