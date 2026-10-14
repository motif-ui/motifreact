import {
  Panel,
  BusinessCard,
  Checkbox,
  Divider,
  Form,
  ImageView,
  InputPassword,
  InputText,
  Link,
  Text,
  Validations,
} from "@motif-ui/react";
import "./login.css";

const Login = () => (
  <Panel bordered className="login-panel">
    <BusinessCard
      icon={<ImageView src="https://cdn.jsdelivr.net/gh/motif-ui/assets@HEAD/images/motifui-logo-mark.svg" alt="Motif UI" />}
      title="Log in to your account"
      description="Enter your credentials to access your account"
    />
    <Form onSubmit={console.log} submitButtonLabel="Log In" buttonPosition="fluid">
      <Form.Field name="email" label="Email Address" validations={[Validations.Required, Validations.EMAIL]}>
        <InputText iconLeft="mail" placeholder="you@example.com" />
      </Form.Field>

      <Form.Field name="password" label="Password" validations={[Validations.Required]}>
        <InputPassword iconLeft="lock" toggleMask placeholder="Enter your password" />
      </Form.Field>

      <Form.Field name="rememberMe">
        <Checkbox label="Remember me">
          <Link label="Forgot password?" url="/forgot-password" size="sm" />
        </Checkbox>
      </Form.Field>
    </Form>
    <Divider size="sm" />
    <Text size="sm" center tone="softer">
      Don&apos;t have an account? <Link size="sm" label="Sign up" url="www.motif-ui.com/" targetBlank />
    </Text>
  </Panel>
);

export default Login;
