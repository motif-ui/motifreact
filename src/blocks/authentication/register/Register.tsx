"use client";

import { BusinessCard, Checkbox, Divider, Form, InputPassword, InputText, Link, Panel, Text } from "@motif-ui/react";
import styles from "./Register.module.scss";
import { LOGO_MARK_URL } from "src/blocks/constants.ts";

const Register = () => {
  return (
    <Panel bordered style={{ padding: "32px" }} className={styles.panel}>
      <BusinessCard
        icon={<img src={LOGO_MARK_URL} alt="Motif UI" width="100%" height="100%" />}
        title="Create your account"
        description="Start your journey with us today"
      />
      <Form onSubmit={() => {}} fluidButtons>
        <Form.Field name="fullName" label="Full name">
          <InputText placeholder="Jane Cooper" iconLeft="person" />
        </Form.Field>

        <Form.Field name="email" label="Email address">
          <InputText placeholder="you@example.com" iconLeft="person" />
        </Form.Field>

        <Form.Field name="password" label="Password">
          <InputPassword placeholder="Create a password" toggleMask />
        </Form.Field>

        <Form.Field name="confirmPassword" label="Confirm password">
          <InputPassword placeholder="Re-enter your password" toggleMask />
        </Form.Field>

        <Form.Field name="confirmPolicy">
          <Checkbox style={{ padding: 0 }}>
            <Link label="I agree to the Terms & Privacy Policy" url="#" />
          </Checkbox>
        </Form.Field>
      </Form>
      <Divider size="sm" style={{ marginBlock: 0 }} />
      <div className={styles.footer}>
        <Text text="Already have an account?" variant="body3" className={styles.footerText} />
        <Link size="sm" label="Log in" url="#" />
      </div>
    </Panel>
  );
};

Register.displayName = "Register";
export default Register;
