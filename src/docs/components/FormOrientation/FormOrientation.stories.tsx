import type { Meta, StoryObj } from "@storybook/nextjs";

import FormOrientation from "./FormOrientation";
import Form, { Validations } from "@/components/Form";
import InputText from "@/components/InputText";
import Checkbox from "@/components/Checkbox";
import RadioGroup from "@/components/RadioGroup";
import Radio from "@/components/Radio";
import InputPassword from "@/components/InputPassword";
import Select from "@/components/Select";
import Grid from "@/components/Grid";

const meta: Meta<typeof FormOrientation> = {
  title: "_Hidden/FormOrientation",
  component: FormOrientation,
  tags: ["!autodocs", "!dev"],
};

export default meta;
type Story = StoryObj<typeof FormOrientation>;

export const Primary: Story = {
  render: () => (
    <div style={{ padding: 20, display: "flex", gap: 40, flexWrap: "wrap" }}>
      <Form onSubmit={() => {}} size="xs" style={{ width: 300 }} title="Vertical">
        <Form.Field name="inputName" label="Name" helperText="Your name and surname" validations={[Validations.Required]}>
          <InputText iconLeft="person" />
        </Form.Field>
        <Form.Field name="inputPassword" label="Password" helperText="Your Password" validations={[Validations.Required]}>
          <InputPassword />
        </Form.Field>
      </Form>
      <Form onSubmit={() => {}} size="xs" formOrientation="horizontal" style={{ width: 300 }} title="Horizontal">
        <Form.Field name="inputName" label="Name" helperText="Your name and surname" validations={[Validations.Required]}>
          <InputText iconLeft="person" />
        </Form.Field>
        <Form.Field name="inputPassword" label="Password" helperText="Your Password" validations={[Validations.Required]}>
          <InputPassword />
        </Form.Field>
      </Form>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
<Form onSubmit={() => {}} formOrientation="vertical" title="Vertical">
  <Form.Field name="inputName" label="Name" helperText="Your name and surname" validations={[Validations.Required]}>
    <InputText iconLeft="person" />
  </Form.Field>
  <Form.Field name="inputPassword" label="Password" helperText="Your Password" validations={[Validations.Required]}>
    <InputPassword />
  </Form.Field>
</Form>
<Form onSubmit={() => {}} formOrientation="horizontal" title="Horizontal">
  <Form.Field name="inputName" label="Name" helperText="Your name and surname" validations={[Validations.Required]}>
    <InputText iconLeft="person" />
  </Form.Field>
  <Form.Field name="inputPassword" label="Password" helperText="Your Password" validations={[Validations.Required]}>
    <InputPassword />
  </Form.Field>
</Form>
        `,
      },
    },
  },
};

export const LabelOrientationComparison: Story = {
  render: () => (
    <div style={{ padding: 20, display: "flex", gap: 40, flexWrap: "wrap" }}>
      <Form onSubmit={() => {}} size="xs" labelOrientation="vertical" style={{ width: 300 }} title="Vertical">
        <Form.Field name="inputName" label="Name" helperText="Your name and surname" validations={[Validations.Required]}>
          <InputText iconLeft="person" />
        </Form.Field>
      </Form>
      <Form onSubmit={() => {}} size="xs" labelOrientation="horizontal" style={{ width: 300 }} title="Horizontal">
        <Form.Field name="inputName" label="Name" helperText="Your name and surname" validations={[Validations.Required]}>
          <InputText iconLeft="person" />
        </Form.Field>
      </Form>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
<Form onSubmit={() => {}} labelOrientation="vertical" title="Vertical">
  <Form.Field name="inputName" label="Name" helperText="Your name and surname" validations={[Validations.Required]}>
    <InputText iconLeft="person" />
  </Form.Field>
</Form>
<Form onSubmit={() => {}} labelOrientation="horizontal" title="Horizontal">
  <Form.Field name="inputName" label="Name" helperText="Your name and surname" validations={[Validations.Required]}>
    <InputText iconLeft="person" />
  </Form.Field>
</Form>
        `,
      },
    },
  },
};

export const GroupOrientationComparison: Story = {
  render: () => (
    <div style={{ padding: 20, display: "flex", gap: 40, flexWrap: "wrap" }}>
      <Form onSubmit={() => {}} size="xs" style={{ width: 300 }} title="Vertical">
        <Form.FieldGroup orientation="vertical" helperText="Please choose your favourite sports" label="Sports" name="sports">
          <Checkbox label="Football" name="football" />
          <Checkbox label="Basketball" name="basketball" />
        </Form.FieldGroup>
      </Form>
      <Form onSubmit={() => {}} size="xs" style={{ width: 300 }} title="Horizontal">
        <Form.FieldGroup orientation="horizontal" helperText="Please choose your favourite sports" label="Sports" name="sports">
          <Checkbox label="Football" name="football" />
          <Checkbox label="Basketball" name="basketball" />
        </Form.FieldGroup>
      </Form>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
<Form onSubmit={() => {}} title="Vertical">
  <Form.FieldGroup orientation="vertical" helperText="Please choose your favourite sports" label="Sports" name="sports">
    <Checkbox label="Football" name="football" />
    <Checkbox label="Basketball" name="basketball" />
  </Form.FieldGroup>
</Form>
<Form onSubmit={() => {}} title="Horizontal">
  <Form.FieldGroup orientation="horizontal" helperText="Please choose your favourite sports" label="Sports" name="sports">
    <Checkbox label="Football" name="football" />
    <Checkbox label="Basketball" name="basketball" />
  </Form.FieldGroup>
</Form>
        `,
      },
    },
  },
};

export const RadioGroupOrientationComparison: Story = {
  render: () => (
    <div style={{ padding: 20, display: "flex", gap: 40, flexWrap: "wrap" }}>
      <Form onSubmit={() => {}} size="xs" style={{ width: 300 }} title="Vertical">
        <RadioGroup size="xs" name="language" orientation="vertical">
          <Radio label="HTML" value="html" />
          <Radio label="CSS" value="css" />
        </RadioGroup>
      </Form>
      <Form onSubmit={() => {}} size="xs" style={{ width: 300 }} title="Horizontal">
        <RadioGroup size="xs" name="language" orientation="horizontal">
          <Radio label="HTML" value="html" />
          <Radio label="CSS" value="css" />
        </RadioGroup>
      </Form>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
<Form onSubmit={() => {}} title="Vertical">
  <RadioGroup name="language" orientation="vertical">
    <Radio label="HTML" value="html" />
    <Radio label="CSS" value="css" />
  </RadioGroup>
</Form>
<Form onSubmit={() => {}} title="Horizontal">
  <RadioGroup name="language" orientation="horizontal">
    <Radio label="HTML" value="html" />
    <Radio label="CSS" value="css" />
  </RadioGroup>
</Form>
        `,
      },
    },
  },
};

export const GuideForm: Story = {
  render: () => (
    <div style={{ padding: 20, display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
      <Form onSubmit={data => alert(JSON.stringify(data))}>
        <Form.Field name="name" label="Name" validations={[Validations.Required]}>
          <InputText value="Predefined name" />
        </Form.Field>
        <Form.Field name="age" label="Age" helperText="How old are you?" validations={[Validations.Required]}>
          <Select
            data={[
              { label: "10", value: "10" },
              { label: "20", value: "20" },
              { label: "30", value: "30" },
            ]}
          />
        </Form.Field>
      </Form>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
<Form onSubmit={data => alert(JSON.stringify(data))}>

  <Form.Field name="name" label="Name" validations={[Validations.Required]}>
    <InputText value="Predefined name" />
  </Form.Field>

  <Form.Field name="age" label="Age" helperText="How old are you?" validations={[Validations.Required]}>
    <Select data={[{label: "10", value: "10"}, {label: "20", value: "20"}, {label: "30", value: "30"}]} />
  </Form.Field>
  
</Form>
        `,
      },
    },
  },
};

export const FormWithGrid: Story = {
  render: () => (
    <div style={{ padding: "20px 20px 40px" }}>
      <Form onSubmit={() => {}} size="sm">
        <Grid>
          <Grid.Row>
            <Grid.Col size={4}>
              <Form.Field name="name" label="Name">
                <InputText />
              </Form.Field>
            </Grid.Col>
            <Grid.Col size={4}>
              <Form.Field name="surname" label="Surname">
                <InputText />
              </Form.Field>
            </Grid.Col>
            <Grid.Col size={4}>
              <Form.Field name="age" label="Age">
                <InputText />
              </Form.Field>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col size={6}>
              <Form.Field name="city" label="City">
                <InputText />
              </Form.Field>
            </Grid.Col>
            <Grid.Col size={6}>
              <Form.Field name="country" label="Coutry">
                <InputText />
              </Form.Field>
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </Form>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
<Form onSubmit={() => {}}>
  <Grid>
  
    <Grid.Row>
      <Grid.Col size={4}>
        <Form.Field name="name" label="Name">
          <InputText />
        </Form.Field>
      </Grid.Col>
      <Grid.Col size={4}>
        <Form.Field name="surname" label="Surname">
          <InputText />
        </Form.Field>
      </Grid.Col>
      <Grid.Col size={4}>
        <Form.Field name="age" label="Age">
          <InputText />
        </Form.Field>
      </Grid.Col>
    </Grid.Row>
    
    <Grid.Row>
      <Grid.Col size={6}>
        <Form.Field name="city" label="City">
          <InputText />
        </Form.Field>
      </Grid.Col>
      <Grid.Col size={6}>
        <Form.Field name="country" label="Coutry">
          <InputText />
        </Form.Field>
      </Grid.Col>
    </Grid.Row>
    
  </Grid>
</Form>
        `,
      },
    },
  },
};
