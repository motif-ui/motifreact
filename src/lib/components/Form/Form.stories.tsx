import type { Meta, StoryObj } from "@storybook/nextjs";
import Form from "@/components/Form";
import { Validations } from "@/components/Form/validation/validations";
import InputText from "@/components/InputText";
import { FormSubmitData } from "@/components/Form/types";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import Textarea from "@/components/Textarea";
import InputPassword from "@/components/InputPassword";
import Switch from "@/components/Switch";
import RadioGroup from "@/components/RadioGroup";
import Radio from "@/components/Radio";
import UploadInput from "@/components/Upload/UploadInput";
import UploadList from "@/components/Upload/UploadList";
import UploadDragger from "@/components/Upload/UploadDragger";
import PinCodeItem from "@/components/PinCode/components/PinCodeItem";
import PinCode from "@/components/PinCode";
import InputDate from "@/components/InputDate";
import InputTime from "@/components/InputTime";
import InputDateTime from "@/components/InputDateTime";
import Slider from "@/components/Slider";
import SliderRange from "@/components/SliderRange";
import { LocaleKey } from "src/i18n/types";

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story, context) => (
      <div
        style={{
          ...(context.args.formOrientation === "horizontal" ? { width: "100%", overflow: "scroll" } : { width: 500, overflow: "initial" }),
          padding: 50,
          margin: "0 auto",
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
    formOrientation: { table: { defaultValue: { summary: "vertical" } } },
    labelOrientation: { table: { defaultValue: { summary: "vertical" } } },
    submitButtonLabel: { table: { defaultValue: { summary: "Gönder" } } },
    buttonPosition: { table: { defaultValue: { summary: "right" } } },
    clearButtonLabel: { table: { defaultValue: { summary: "Temizle" } } },
  },
  args: {
    onSubmit: (data: FormSubmitData, event) => {
      if (data.isValid) {
        fetch("https://jsonplaceholder.typicode.com/todos/1")
          .then(response => response.json())
          .then(json => {
            alert("Form is VALID! Check for the console log.");
            console.log(data, event);
            alert("Server response:\n\n" + JSON.stringify(json));
          })
          .catch(alert);
      } else {
        alert("Form is NOT VALID! Check for the console log.");
        console.log(data, event);
      }
    },
  },
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Primary: Story = {
  render: args => (
    <Form {...args}>
      <Form.Field name="inputName" label="Name" helperText="Your name and surname" validations={[Validations.Required]}>
        <InputText iconLeft="person" />
      </Form.Field>
      <Form.Field name="inputPassword" label="Password" helperText="Your Password" validations={[Validations.Required]}>
        <InputPassword />
      </Form.Field>
      <Form.Field name="inputAge" label="Age" helperText="Please enter as number" validations={[Validations.Required, Validations.Min(18)]}>
        <InputText />
      </Form.Field>
      <Form.Field name="inputBirthday" label="Birthday" helperText="Your Birthday" validations={[Validations.Required]}>
        <InputDate />
      </Form.Field>
      <Form.Field name="inputBirthtime" label="Birth Time" helperText="Your Birth Time" validations={[Validations.Required]}>
        <InputTime />
      </Form.Field>
      <Form.Field name="inputBirthDT" label="Birth DateTime" helperText="Your Birth Date&Time" validations={[Validations.Required]}>
        <InputDateTime />
      </Form.Field>
      <Form.Field name="inputAddress" label="Address" helperText="Your home address" validations={[Validations.Required]}>
        <Textarea maxLength={40} />
      </Form.Field>
      <Form.Field name="selectCity" label="City" helperText="Please select a city" validations={[Validations.Required]}>
        <Select
          data={[
            { label: "Ankara", value: "6" },
            { label: "İzmir", value: "35" },
            { label: "İstanbul", value: "34" },
          ]}
        />
      </Form.Field>
      <Form.Field name="selectCar" label="Cars" helperText="Please select a car or cars" validations={[Validations.Required]}>
        <Select
          multiple
          data={[
            { label: "Volvo", value: "01" },
            { label: "Mercedes", value: "02" },
            { label: "BMW", value: "03" },
          ]}
        />
      </Form.Field>
      <Form.Field
        name="pinCodeColor"
        label="Your favorite color"
        helperText="Only first 2 letters"
        validations={[Validations.RequiredArrayItems([0, 1])]}
      >
        <PinCode letterCase="upper" value={["", "", "U", "E"]}>
          <PinCodeItem />
          <PinCodeItem />
          <PinCodeItem masked disabled />
          <PinCodeItem masked disabled />
        </PinCode>
      </Form.Field>
      <Form.FieldGroup
        label="Which sports"
        helperText="Please select at least 2 sports"
        groupValidations={[Validations.Required, Validations.AtLeastN(2)]}
        name="sports"
      >
        <Checkbox label="Football" name="football" checked />
        <Checkbox label="Basketbol" name="basketball" />
        <Checkbox label="Tenis" name="tennis" />
      </Form.FieldGroup>
      <Form.Field name="radioGroupBW" label="Black or White" helperText="You have to choose one" validations={[Validations.Required]}>
        <RadioGroup name="radioGroupBW" orientation="horizontal">
          <Radio value="Black" label="Black" />
          <Radio value="White" label="White" />
        </RadioGroup>
      </Form.Field>
      <Form.Field
        name="termsSwitch"
        label="Terms and Conditions"
        helperText="I agree to the terms and conditions."
        validations={[Validations.Required]}
      >
        <Switch />
      </Form.Field>
      <Form.Field
        name="uploadPersonalDoc"
        label="Personal Document"
        helperText="Upload any type of personal document"
        validations={[Validations.RequiredUploadedFile]}
      >
        <UploadInput
          uploadRequest={{ url: "https://httpbin.org/post", method: "POST", headers: [{ key: "mtf", value: "ui" }] }}
          deleteRequest={{ url: "https://httpbin.org/post", method: "POST", headers: [{ key: "mtf", value: "ui" }] }}
        />
      </Form.Field>

      <Form.Field
        name="uploadIdentityCopy"
        label="Identity Register Copy"
        helperText="Upload any type of file, max size 1 MB"
        validations={[Validations.RequiredUploadedFile]}
      >
        <UploadList
          uploadRequest={{ url: "https://httpbin.org/post", method: "POST", headers: [{ key: "mtf", value: "ui" }] }}
          deleteRequest={{ url: "https://httpbin.org/post", method: "POST", headers: [{ key: "mtf", value: "ui" }] }}
          maxSize={1000000}
        />
      </Form.Field>

      <Form.Field
        name="uploadDraggerDoc"
        label="Dragger Document"
        helperText="Upload via drag & drop"
        validations={[Validations.RequiredUploadedFile]}
      >
        <UploadDragger
          uploadRequest={{ url: "https://httpbin.org/post", method: "POST", headers: [{ key: "mtf", value: "ui" }] }}
          deleteRequest={{ url: "https://httpbin.org/post", method: "POST", headers: [{ key: "mtf", value: "ui" }] }}
        />
      </Form.Field>

      <Form.Field
        name="sliderMinDistance"
        label="Minimum Distance"
        helperText="Please choose a minimum distance"
        validations={[Validations.Min(1)]}
      >
        <Slider />
      </Form.Field>

      <Form.Field
        name="sliderRangeAge"
        label="Age Between"
        helperText="Please choose an age range"
        validations={[
          {
            errorMessage: "Please select a value between 20 and 80." as LocaleKey,
            validate: value => {
              if (value === undefined) return false;
              const valueArray = value as number[];
              return valueArray[0] >= 20 && valueArray[1] <= 80;
            },
          },
        ]}
      >
        <SliderRange />
      </Form.Field>
    </Form>
  ),
};
