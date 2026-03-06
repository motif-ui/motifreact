import InputText from "@/components/InputText";
import InputPassword from "@/components/InputPassword";
import Textarea from "@/components/Textarea";
import Checkbox from "@/components/Checkbox";
import RadioGroup from "@/components/RadioGroup";
import Radio from "@/components/Radio";
import Select from "@/components/Select";
import { MOCK } from "@/components/Upload/mock";
import { SelectGroupItem, SelectItem } from "@/components/Select/types";
import { screen } from "@testing-library/react";
import Switch from "@/components/Switch";
import UploadInput from "@/components/Upload/UploadInput";
import UploadList from "@/components/Upload/UploadList";
import PinCode from "@/components/PinCode";
import { ReactElement } from "react";
import { InputCommonProps } from "../../Form/types";
import InputDate from "@/components/InputDate";
import { DateUtils } from "../../../../utils/dateUtils";

export const mockFunction = jest.fn();

export const requiredProps = { uploadRequest: MOCK.uploadRequest, deleteRequest: MOCK.deleteRequest };

export const data: (SelectGroupItem | SelectItem)[] = [
  { label: "Item 1", value: "i1" },
  { label: "Item 2", value: "i2" },
];

export const expectedSubmitResponse = {
  isValid: true,
  values: {
    testGroup: {
      inputText: "Input Text",
      inputPassword: "Input Password",
      textarea: "Input Textarea",
      football: false,
      radioGroupBW: "radioBlack",
      select: { label: "Item 1", value: "i1" },
      inputDate: DateUtils.getTodayTimeless(),
      switch: false,
      pinCode: ["a", "b"],
    },
  },
};

export type mixedGroupItemObjType = {
  football?: boolean;
  basketball?: boolean;
  tennis?: boolean;
  selectOtherReadonly?: string[];
  selectOtherDisabled?: string[];
  inputReadonly2?: string;
  inputDisabled2?: string;
  textareaReadonly2?: string;
  textareaDisabled2?: string;
  inputSwitch4?: boolean;
  inputSwitch5?: boolean;
  inputSwitch6?: boolean;
  pinCodeReadonly2?: string[];
  pinCodeDisabled2?: string[];
};

export const getForm = (container: HTMLElement) => container.getElementsByTagName("form").item(0);
export const getFormField = (index: number) => screen.queryAllByTestId("formField").at(index);
export const getFormFieldGroup = (index: number) => screen.queryAllByTestId("formFieldGroup").at(index);

export const getAllInputItems = () => {
  const inputs: HTMLElement[] = [];

  inputs.push(screen.getAllByTestId("inputItem")[0]);
  inputs.push(screen.getByTestId("inputPassword"));
  inputs.push(screen.getByTestId("textareaItem").parentElement!);
  screen.getAllByTestId("checkbox").forEach(element => inputs.push(element));
  screen.getAllByTestId("radioItem").forEach(element => inputs.push(element));
  inputs.push(screen.getByTestId("selectItem"));
  inputs.push(screen.getByTestId("inputDate").firstElementChild as HTMLElement);
  inputs.push(screen.getByTestId("switchItem").parentElement!);
  inputs.push(screen.getByTestId("pinCode"));

  return inputs;
};

export const groupItems = [
  <InputText key="inputText" name="inputText" value="Input Text" />,
  <InputPassword key="inputPassword" name="inputPassword" value="Input Password" />,
  <Textarea key="textarea" name="textarea" value="Input Textarea" />,
  <Checkbox label="Football" name="football" key="football" />,
  <RadioGroup key="radioGroupBW" name="radioGroupBW" value="radioBlack">
    <Radio value="radioBlack" label="Black" />
    <Radio value="radioWhite" label="White" />
  </RadioGroup>,
  <Select key="select" name="select" data={data} value={["i1"]} />,
  <InputDate key="inputDate" name="inputDate" value={DateUtils.getTodayTimeless()} editable />,
  <Switch key="switch" name="switch" />,
  <PinCode name="pinCode" key="pinCode" value={["a", "b"]}>
    <PinCode.Item />
    <PinCode.Item />
  </PinCode>,
];

export const formItems: ReactElement<InputCommonProps>[] = [
  <InputText key="inputText" name="inputText" />,
  <InputPassword key="inputPassword" name="inputPassword" />,
  <RadioGroup key="radioGroupBW" name="radioGroupBW">
    <Radio value="radioBlack" label="Black" />
    <Radio value="radioWhite" label="White" />
  </RadioGroup>,
  <Select key="select" name="select" data={data} />,
  <Switch key="switch" name="switch" />,
  <UploadList {...requiredProps} name="officialFiles" key="uploadListOF" />,
  <UploadInput {...requiredProps} name="personalFiles" key="uploadInputPF" />,
  <Textarea key="textarea" name="textarea" />,
  <InputDate key="inputDate" name="inputDate" editable />,
  <PinCode name="pinCode" key="pinCode">
    <PinCode.Item />
    <PinCode.Item />
  </PinCode>,
];
