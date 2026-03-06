import { useState } from "react";
import styles from "./ThemeShowcase.module.scss";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Alert from "@/components/Alert";
import Chip from "@/components/Chip";
import InputText from "@/components/InputText";
import Textarea from "@/components/Textarea";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import Radio from "@/components/Radio";
import Switch from "@/components/Switch";
import ProgressBar from "@/components/ProgressBar";
import Slider from "@/components/Slider";
import Panel from "@/components/Panel";
import Text from "@/components/Text";
import Avatar from "@/components/Avatar";
import Tooltip from "@/components/Tooltip";
import Tab from "@/components/Tab";
import Form, { Validations } from "@/components/Form";
import RadioGroup from "@/components/RadioGroup";
import Grid from "@/components/Grid";
import ProgressCircle from "@/components/ProgressCircle";
import SliderRange from "@/components/SliderRange";
import BusinessCard from "@/components/BusinessCard";
import DatePicker from "@/components/DatePicker";
import { TimePicker } from "../../../lib";

const ThemeShowcase = () => {
  const [activeTab1, setActiveTab1] = useState("details");
  const [activeTab2, setActiveTab2] = useState("solid");

  return (
    <div className={styles.container}>
      <Grid fluid>
        {/* Color Palette Section */}
        <Grid.Row>
          <Grid.Col>
            <Text variant="h4" text="Color Palette" />
            <div className={styles.flexHorizontal1Rem}>
              <Avatar style={{ backgroundColor: "var(--theme-color-semantic-primary-primary-500)" }} size="lg" />
              <Avatar style={{ backgroundColor: "var(--theme-color-semantic-secondary-secondary-500)" }} size="lg" />
              <Avatar style={{ backgroundColor: "var(--theme-color-semantic-accent-accent-500)" }} size="lg" />
              <Avatar style={{ backgroundColor: "var(--theme-color-semantic-neutral-neutral-500)" }} size="lg" />
              <Avatar style={{ backgroundColor: "var(--theme-color-semantic-grayscale-grayscale-500)" }} size="lg" />
              <Avatar style={{ backgroundColor: "var(--theme-color-semantic-success-success-500)" }} size="lg" />
              <Avatar style={{ backgroundColor: "var(--theme-color-semantic-warning-warning-500)" }} size="lg" />
              <Avatar style={{ backgroundColor: "var(--theme-color-semantic-danger-danger-500)" }} size="lg" />
              <Avatar style={{ backgroundColor: "var(--theme-color-semantic-info-info-500)" }} size="lg" />
            </div>
          </Grid.Col>
        </Grid.Row>
        {/* Buttons Section */}
        <Grid.Row>
          <Grid.Col>
            <Text variant="h4" text="Buttons" />
            <div className={styles.flexHorizontal1Rem} style={{ marginBottom: "1rem" }}>
              <Button variant="primary" label="Primary" />
              <Button variant="secondary" label="Secondary" />
              <Button variant="success" label="Success" />
              <Button variant="danger" label="Danger" />
              <Button variant="warning" label="Warning" />
              <Button variant="info" label="Info" />
            </div>
            <div className={styles.flexHorizontal1Rem} style={{ alignItems: "flex-start" }}>
              <Button label="Large" size="lg" />
              <Button label="Small" size="sm" />
              <Button label="Pill" pill />
              <Button label="Disabled" disabled />
              <Button label="Outline" shape="outline" />
              <Button label="Text Only" shape="textonly" />
            </div>
          </Grid.Col>
        </Grid.Row>
        {/* Alerts Section */}
        <Grid.Row>
          <Grid.Col>
            <Text variant="h4" text="Alerts" />
            <div className={styles.flexVerticalHalfRem}>
              <Alert variant="success" message="Operation completed successfully!" />
              <Alert variant="warning" message="Warning: Please review your changes" />
              <Alert variant="danger" message="Error: Something went wrong" />
              <Alert variant="info" message="Information: This is an informational message" />
              <Alert variant="secondary" message="Neutral: This is a neutral alert" />
            </div>
          </Grid.Col>
        </Grid.Row>
        {/* Form Elements Section */}
        <Grid.Row>
          <Grid.Col className={styles.verticalPaddingNone}>
            <Text variant="h4">Form Elements</Text>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Form onSubmit={() => {}} enableClearButton title="Text Inputs">
              <Form.Field name="f1" label="Required Name" validations={[Validations.Required]}>
                <InputText placeholder="Enter your name" />
              </Form.Field>
              <Form.Field name="f2" label="E-Mail">
                <InputText placeholder="email@example.com" />
              </Form.Field>
              <Form.Field name="f3" label="Dont Edit" disabled>
                <InputText placeholder="Disabled input" />
              </Form.Field>
              <Form.Field name="f4" label="Message" helperText="This helper text provides additional info">
                <Textarea placeholder="Enter your message" rows={3} />
              </Form.Field>
            </Form>
          </Grid.Col>
          <Grid.Col>
            <Form onSubmit={() => {}} title="Select & Toggles">
              <Form.Field name="f5" label="Country">
                <Select
                  multiple
                  placeholder="Select country"
                  data={[
                    { label: "Turkey", value: "tr" },
                    { label: "United States", value: "us" },
                    { label: "Germany", value: "de" },
                  ]}
                />
              </Form.Field>
              <Form.Field name="f6" label="Option Selection">
                <RadioGroup name="f6" orientation="horizontal">
                  <Radio label="Option 1" value="option1" />
                  <Radio label="Option 2" value="option2" />
                </RadioGroup>
              </Form.Field>
              <Form.FieldGroup name="f7" label="Sample Field Group" orientation="vertical">
                <Checkbox name="c1" label="Check 1" />
                <Checkbox name="c2" label="Check 2" />
              </Form.FieldGroup>
              <Form.Field name="f8">
                <Switch label="Enable notifications" />
              </Form.Field>
            </Form>
          </Grid.Col>
        </Grid.Row>
        {/* Progress&Sliders Section */}
        <Grid.Row>
          <Grid.Col className={styles.verticalPaddingNone}>
            <Text variant="h4">Progress & Sliders</Text>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Text variant="h5" style={{ marginTop: 0 }} text="Bars" />
            <ProgressBar progress={75} variant="primary" style={{ marginBottom: "1rem" }} />
            <ProgressBar progress={50} variant="success" style={{ marginBottom: "1rem" }} />
            <ProgressBar progress={25} variant="warning" style={{ marginBottom: "1rem" }} />
            <ProgressBar progress={38} variant="danger" style={{ marginBottom: "1rem" }} />
            <ProgressBar progress={70} variant="info" style={{ marginBottom: "1rem" }} />
            <ProgressBar progress={90} variant="secondary" style={{ marginBottom: "1rem" }} />
            <Text variant="h5">Circles</Text>
            <div className={styles.progressCircleContainer}>
              <ProgressCircle progress={80} size="xl" showPercentage variant="success" />
              <ProgressCircle progress={25} size="lg" showPercentage variant="secondary" />
              <ProgressCircle progress={15} size="md" variant="info" />
              <ProgressCircle progress={50} size="sm" variant="danger" />
              <ProgressCircle progress={80} size="xs" variant="warning" />
            </div>
          </Grid.Col>
          <Grid.Col>
            <Text variant="h5" style={{ marginTop: 0 }}>
              Sliders
            </Text>
            <Slider min={20} max={80} value={60} />
            <SliderRange value={[12, 85]} variant="success" />
          </Grid.Col>
        </Grid.Row>
        {/* Pickers Section */}
        <Grid.Row>
          <Grid.Col>
            <Text variant="h4" text="Pickers" />
            <div className={styles.flexHorizontal1Rem}>
              <DatePicker variant="bordered" />
              <TimePicker variant="bordered" secondsEnabled value={{ hours: 6, minutes: 3, seconds: 1 }} />
            </div>
          </Grid.Col>
        </Grid.Row>
        {/* Tabs Section */}
        <Grid.Row>
          <Grid.Col>
            <Text variant="h4" text="Tabs" />
            <Tab
              tabs={[
                { id: "overview", title: "Overview" },
                { id: "details", title: "Details" },
                { id: "settings", title: "Settings" },
              ]}
              defaultTabId="details"
              onTabChange={id => setActiveTab1(id)}
            >
              {activeTab1 === "overview" && <Text text="Overview content goes here. This demonstrates tab content styling." />}
              {activeTab1 === "details" && <Text text="Details content with theme-aware colors and typography." />}
              {activeTab1 === "settings" && <Text text="Settings panel showing how tabs adapt to different themes." />}
            </Tab>
            <br />
            <Tab
              type="solid"
              position="left"
              tabs={[
                { id: "solid", title: "Solid" },
                { id: "positioned", title: "Positioned" },
                { id: "toLeft", title: "To Left" },
              ]}
              defaultTabId="solid"
              onTabChange={id => setActiveTab2(id)}
            >
              {activeTab2 === "solid" && <Text text="This section shows the tabs when they are solid." />}
              {activeTab2 === "positioned" && <Text text="There are also options to lean the tabs." />}
              {activeTab2 === "toLeft" && <Text text="As seen here, they may be leaned to the left." />}
            </Tab>
          </Grid.Col>
        </Grid.Row>
        {/* Cards & Panels Section */}
        <Grid.Row>
          <Grid.Col>
            <Text variant="h4" text="Cards & Panels" />
            <div className={`${styles.flexHorizontal1Rem} ${styles.cardsContainer}`}>
              <Card
                title="Card Component"
                subtitle="Themed card example"
                avatarText="TC"
                contentTitle="Card Content"
                contentText="This card demonstrates how theme colors are applied to various card elements including headers, content, and actions."
                contentActionButton={{ text: "Action", onClick: () => console.log("Action clicked") }}
                contentAlternateButton={{ text: "Cancel", onClick: () => console.log("Cancel clicked") }}
              />
              <Panel title="Panel Component" type="solid" bordered>
                <Text variant="body1" style={{ marginBottom: "1rem" }}>
                  Panels provide a contained surface for displaying content. They adapt their appearance based on the active theme.
                </Text>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Chip label="Tag 1" variant="primary" size="sm" />
                  <Chip label="Tag 2" variant="info" size="sm" />
                  <Chip label="Tag 3" variant="success" size="sm" />
                </div>
              </Panel>
              <BusinessCard
                title="Business Card"
                solid
                variant="info"
                description="Business card is a specialized form of the Card that has variants and less detail"
                icon="person"
                elevated
              />
            </div>
          </Grid.Col>
        </Grid.Row>
        {/* Chips & Interactive Elements Section */}
        <Grid.Row>
          <Grid.Col>
            <Text variant="h4" text="Chips & Interactive Elements" />
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col size={4}>
            <Text variant="h5" text="Chips" style={{ marginTop: 0 }} />
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <Chip label="Technology" variant="primary" />
              <Chip label="Design" variant="secondary" />
              <Chip label="Active" variant="success" />
              <Chip label="Important" variant="danger" />
              <Chip label="Pending" variant="warning" />
              <Chip label="Info" variant="info" />
            </div>
          </Grid.Col>
          <Grid.Col size={4}>
            <Text variant="h5" text="Avatars" style={{ marginTop: 0 }} />
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <Avatar image="https://picsum.photos/50/50" size="xl" />
              <Avatar icon="folder" size="lg" variant="success" />
              <Avatar letters="AB" size="md" />
              <Avatar letters="C" size="sm" variant="warning" />
              <Avatar letters="D" size="xs" variant="info" />
            </div>
          </Grid.Col>
          <Grid.Col size={4}>
            <Text variant="h5" text="Tooltip" style={{ marginTop: 0 }} />
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <Tooltip text="I am here" position="top">
                <Button label="Tooltip here ↑" size="sm" />
              </Tooltip>
              <Tooltip text="Now, I am here" position="bottom" variant="dark">
                <Button label="↓ Tooltip there" size="sm" />
              </Tooltip>
            </div>
          </Grid.Col>
        </Grid.Row>
        {/* Typography Section */}
        <Grid.Row>
          <Grid.Col>
            <Text variant="h4" text="Typography" />
            <div className={styles.flexVertical}>
              <Text
                variant="body1"
                text="Body 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              />
              <Text
                variant="body2"
                text="Body 2 - Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
              />
              <Text
                variant="body3"
                text="Body 3 - Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
              />
              <Text variant="h1" text="Heading 1 - Main Title" />
              <Text variant="h2" text="Heading 2 - Section Title" />
              <Text variant="h3" text="Heading 3 - Subsection" />
              <Text variant="h4" text="Heading 4 - Component Title" />
              <Text variant="h5" text="Heading 5 - Small Heading" />
              <Text variant="h6" text="Heading 6 - Smallest Heading" />
            </div>
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default ThemeShowcase;
