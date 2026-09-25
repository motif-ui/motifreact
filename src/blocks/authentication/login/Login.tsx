"use client";

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
import styles from "./Login.module.scss";

const LOGO_MARK_URL = "https://cdn.jsdelivr.net/gh/motif-ui/assets@HEAD/images/motifui-logo-mark.svg";

const Login = () => {
  return (
    <Panel className={styles.panel} bordered>
      <BusinessCard
        icon={<ImageView src={LOGO_MARK_URL} alt="Motif UI" />}
        title="Log in to your account"
        description="Enter your credentials to access your account"
        position="center"
      />
      <Form onSubmit={() => {}} submitButtonLabel="Log In" buttonPosition="fluid">
        <Form.Field name="email" label="Email Address" validations={[Validations.Required, Validations.EMAIL]}>
          <InputText iconLeft="mail" placeholder="you@example.com" />
        </Form.Field>
        <Form.Field name="password" label="Password" validations={[Validations.Required]}>
          <InputPassword iconLeft="lock" toggleMask placeholder="Enter your password" />
        </Form.Field>
        <div className={styles.optionsRow}>
          <Checkbox>
            <Text text="Remember me" variant="body3" className={styles.text} />
          </Checkbox>
          <Link label="Forgot password?" url="/forgot-password" size="sm" />
        </div>
      </Form>
      <Divider size="sm" />
      <Text variant="body3" className={styles.text} style={{ textAlign: "center" }}>
        Don&apos;t have an account? <Link size="sm" label="Sign up" url="www.motif-ui.com/" />
      </Text>
    </Panel>
  );
};

export default Login;
