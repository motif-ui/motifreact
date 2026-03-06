import Form, { Validations } from "@/components/Form";
import InputText from "@/components/InputText";
import InputPassword from "@/components/InputPassword";

const FormOrientation = () => {
  return (
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
  );
};
export default FormOrientation;
