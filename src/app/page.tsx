"use client";

import Select from "@/components/Select";
import Form, { Validations } from "src/lib/components/Form";
import InputText from "@/components/InputText";
import Button from "@/components/Button";
import Grid from "@/components/Grid";

const Home = () => {
  return (
    <>
      <Select data={[{ label: "Türkiye", value: "TR" }]} filterable placeholder="Select a country..." />
      <br />
      <br />
      <Form
        onSubmit={console.log}
        dontClearOnSubmit
        submitButtonLabel="Submit Application"
        buttonPosition="right"
        labelOrientation="horizontal"
        formOrientation="horizontal"
        alternateButtons={[<Button key="1" label="Go Back" onClick={console.log} shape="outline" variant="primary" />]}
      >
        <Form.Field
          label="Passport Country"
          name="pasaportUsslkesi"
          validations={[Validations.Required]}
          helperText="Select the country that issued your passport"
        >
          <Select data={[{ label: "Türkiye", value: "TR" }]} filterable placeholder="Select a country..." />
        </Form.Field>
      </Form>
      <Form
        onSubmit={console.log}
        dontClearOnSubmit
        submitButtonLabel="Submit Application"
        buttonPosition="right"
        labelOrientation="horizontal"
        alternateButtons={[<Button key="1" label="Go Back" onClick={console.log} shape="outline" variant="primary" />]}
      >
        <Grid fluid leanToEdge>
          <Grid.Row>
            <Grid.Col size={12} md={6}>
              <Form.Field
                label="Application Number"
                name="basvuruNumarasi"
                validations={[Validations.Required]}
                helperText="Enter your application number"
              >
                <InputText placeholder="Enter number..." />
              </Form.Field>
            </Grid.Col>
            <Grid.Col size={12} md={6}>
              <Form.Field
                label="Passport Number"
                name="pasaportNumarasi"
                validations={[Validations.Required]}
                helperText="Enter your passport number"
              >
                <InputText placeholder="Enter passport number..." />
              </Form.Field>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row>
            <Grid.Col size={12} md={6}>
              <Form.Field
                label="Passport Country"
                name="pasaportUlkesi"
                validations={[Validations.Required]}
                helperText="Select the country that issued your passport"
              >
                <Select data={[{ label: "Türkiye", value: "TR" }]} filterable placeholder="Select a country..." />
              </Form.Field>
            </Grid.Col>
            <Grid.Col size={12} md={6}>
              <Form.Field
                label="Email Address"
                name="epostaAdresi"
                validations={[Validations.EMAIL, Validations.Required]}
                helperText="Enter your email address"
              >
                <InputText type="text" placeholder="example@email.com" iconLeft="mail" />
              </Form.Field>
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </Form>
    </>
  );
};

export default Home;
