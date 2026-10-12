import {
  BusinessCard,
  Checkbox,
  Divider,
  Form,
  ImageView,
  InputPassword,
  InputText,
  Link,
  Panel,
  Text,
  Validations,
} from "@motif-ui/react";
import "./register.css";

const Register = () => (
  <Panel bordered className="register-panel">
    <BusinessCard
      icon={<ImageView src="https://cdn.jsdelivr.net/gh/motif-ui/assets@HEAD/images/motifui-logo-mark.svg" alt="Motif UI" />}
      title="Create your account"
      description="Start your journey with us today"
    />
    <Form onSubmit={console.log} buttonPosition="fluid" submitButtonLabel="Create Account">
      <Form.Field name="fullName" label="Full name" validations={[Validations.Required]}>
        <InputText placeholder="Jane Cooper" iconLeft="person" />
      </Form.Field>

      <Form.Field name="email" label="Email address" validations={[Validations.Required, Validations.EMAIL]}>
        <InputText placeholder="you@example.com" iconLeft="person" />
      </Form.Field>

      <Form.Field name="password" label="Password" validations={[Validations.Required]}>
        <InputPassword placeholder="Create a password" toggleMask />
      </Form.Field>

      <Form.Field name="confirmPassword" label="Confirm password" validations={[Validations.Required]}>
        <InputPassword placeholder="Re-enter your password" toggleMask />
      </Form.Field>

      <Form.Field name="confirmPolicy">
        <Checkbox>
          <Link label="I agree to the Terms & Privacy Policy" url="#" />
        </Checkbox>
      </Form.Field>
    </Form>
    <Divider size="sm" />
    <Text size="sm" center tone="softer">
      Already have an account? <Link size="sm" label="Log in" url="www.motif-ui.com/" targetBlank />
    </Text>
  </Panel>
);

export default Register;
