import {
  BusinessCard,
  Card,
  Container,
  Divider,
  Form,
  Grid,
  IconButton,
  InputText,
  Link,
  ListView,
  MenuList,
  Panel,
  Select,
} from "@motif-ui/react";
import LineChart from "../../chartJS/LineChart/LineChart";
import "./dashboard3.css";

const navItems = [
  { label: "Dashboard", icon: "dashboard", active: true, href: "#" },
  { label: "Analytics", icon: "bar_chart", href: "#" },
  { label: "Activity", icon: "speed", href: "#" },
  {
    label: "Directory",
    icon: "groups",
    items: [
      { label: "All Users", href: "#" },
      { label: "Workspaces", href: "#" },
    ],
  },
  { label: "Subscriptions", icon: "receipt_long", href: "#" },
  { label: "Usage", icon: "flash_on", href: "#", divider: true },
  { label: "Saved Reports", icon: "description", href: "#" },
  { label: "Exports", icon: "upload", href: "#", divider: true },
];

const feedbackTypes = [
  { label: "All", value: "all" },
  { label: "Complaint", value: "complaint" },
  { label: "Suggestion", value: "suggestion" },
];

const categories = [
  { label: "All", value: "all" },
  { label: "Tasks", value: "tasks" },
  { label: "Permits", value: "permits" },
];

const dates = [
  { label: "Last Week", value: "lastWeek" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Last Year", value: "lastYear" },
];

const shortcuts = [
  { icon: "group_add", title: "Create a New Task" },
  { icon: "folder_shared", title: "Work Done Today" },
  { icon: "zoom_in", title: "Check Information" },
];

const stats = [
  { icon: "alarm", title: "15", description: "PENDING TASKS", variant: "danger" },
  { icon: "check_circle", title: "57", description: "APPOINTED", variant: "info" },
  { icon: "plagiarism", title: "28", description: "UNDER REVIEW", variant: "primary" },
  { icon: "check_circle", title: "462", description: "RESOLVED", variant: "success" },
  { icon: "check_circle", title: "5", description: "EXTRA TIME", variant: "warning" },
  { icon: "check_circle", title: "78", description: "RETURNED", variant: "secondary" },
] as const;

const announcements = Array.from({ length: 3 }, (_, index) => ({
  id: `announcement-${index}`,
  title: "Announcements Header",
  description: "Motif-UI Announcements...",
  date: "29.01.2024",
}));

const printables = [
  { icon: "work", iconVariant: "primary", title: "Work Permissions" },
  { icon: "warning", iconVariant: "danger", title: "Banned List" },
  { icon: "how_to_reg", iconVariant: "success", title: "Residence Permits" },
  { icon: "local_library", iconVariant: "warning", title: "Student List" },
] as const;

const Dashboard3 = () => (
  <Container fluid className="dashboard-3">
    <MenuList enableCollapseButton items={navItems} logo="https://cdn.jsdelivr.net/gh/motif-ui/assets/images/motifui-logo.svg" />

    <Panel bordered lean className="content">
      <Container>
        <Grid gap="sm" padding="sm">
          <Grid.Row rowGap="sm" colsAuto justifyCols="apart">
            <Grid.Col>
              <Card icon="dashboard" title="Dashboard" variant="neutral" />
            </Grid.Col>
            <Grid.Col className="navigation-right">
              <InputText iconLeft="search" placeholder="Search..." />
              <IconButton name="notifications" variant="secondary" size="sm" />
              <Card
                className="profileCard"
                title="Metin Tekin"
                subtitle="Chief Executive Officer"
                image="https://picsum.photos/seed/motifui-about-avatar/100"
                variant="neutral"
              />
              <IconButton name="more_vert" variant="secondary" size="sm" />
            </Grid.Col>
          </Grid.Row>

          <Divider size="sm" />

          <Grid.Row>
            <Grid.Col size={12} xl={8}>
              <Grid.Row>
                <Grid.Col size={12}>
                  <Panel type="elevated">
                    <Form submitButtonLabel="List" formOrientation="horizontal" onSubmit={console.log}>
                      <Form.Field name="feedbackType" label="Feedback Type">
                        <Select data={feedbackTypes} placeholder="All" />
                      </Form.Field>
                      <Form.Field name="category" label="Category">
                        <Select data={categories} placeholder="All" />
                      </Form.Field>
                      <Form.Field name="date" label="Date">
                        <Select data={dates} placeholder="Last Month" />
                      </Form.Field>
                    </Form>
                  </Panel>
                </Grid.Col>
              </Grid.Row>

              <Grid.Row columnGap="xs" stretchItems>
                {shortcuts.map(shortcut => (
                  <Grid.Col size={12} md={4} key={shortcut.title}>
                    <Card icon={shortcut.icon} title={shortcut.title} iconVariant="primary" elevated variant="neutral" />
                  </Grid.Col>
                ))}
              </Grid.Row>

              <Grid.Row columnGap="xs" stretchItems>
                {stats.map(stat => (
                  <Grid.Col size={12} sm={6} md={4} key={stat.description}>
                    <BusinessCard icon={stat.icon} title={stat.title} description={stat.description} variant={stat.variant} solid />
                  </Grid.Col>
                ))}
              </Grid.Row>

              <Grid.Row>
                <Grid.Col size={12}>
                  <Panel bordered title="Statistics">
                    <LineChart />
                  </Panel>
                </Grid.Col>
              </Grid.Row>
            </Grid.Col>

            <Grid.Col size={12} xl={4}>
              <Grid.Row>
                <Grid.Col size={12}>
                  <Panel type="elevated">
                    <ListView enableDividers enableMultiLine disableAvatars>
                      {announcements.map(announcement => (
                        <ListView.Item
                          key={announcement.id}
                          id={announcement.id}
                          title={announcement.title}
                          description={announcement.description}
                          alternateText={announcement.date}
                        />
                      ))}
                    </ListView>
                    <Link label="All Announcements" url="#" icon="arrow_forward" iconPosition="right" />
                  </Panel>
                </Grid.Col>
              </Grid.Row>

              <Grid.Row stretchItems>
                {printables.map(printable => (
                  <Grid.Col size={12} key={printable.title}>
                    <Card
                      icon={printable.icon}
                      iconVariant={printable.iconVariant}
                      title={printable.title}
                      subtitle="Print"
                      elevated
                      variant="neutral"
                    />
                  </Grid.Col>
                ))}
              </Grid.Row>
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </Container>
    </Panel>
  </Container>
);

export default Dashboard3;
