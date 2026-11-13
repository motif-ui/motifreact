"use client";

import {
  BusinessCard,
  Card,
  Container,
  Divider,
  Form,
  Grid,
  IconButton,
  ImageView,
  InputText,
  Link,
  ListView,
  MenuList,
  Panel,
  Select,
} from "@motif-ui/react";
import "./dashboard3.css";

const LOGO_URL = "https://cdn.jsdelivr.net/gh/motif-ui/assets@HEAD/images/motifui-logo.svg";

const MENU_ITEMS = [
  { label: "Dashboard", icon: "dashboard", active: true },
  { label: "Analytics", icon: "bar_chart" },
  { label: "Activity", icon: "speed" },
  { label: "Directory", icon: "groups", items: [{ label: "All Users" }, { label: "Workspaces" }] },
  { label: "Subscriptions", icon: "receipt_long" },
  { label: "Usage", icon: "flash_on", divider: true },
  { label: "Saved Reports", icon: "description" },
  { label: "Exports", icon: "upload", divider: true },
];

const FEEDBACK_TYPES = [
  { label: "All", value: "all" },
  { label: "Complaint", value: "complaint" },
  { label: "Suggestion", value: "suggestion" },
];

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Tasks", value: "tasks" },
  { label: "Permits", value: "permits" },
];

const DATES = [
  { label: "Last Week", value: "lastWeek" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Last Year", value: "lastYear" },
];

const SHORTCUTS = [
  { title: "Create a New Task", icon: "group_add" },
  { title: "Work Done Today", icon: "folder_shared" },
  { title: "Check Information", icon: "zoom_in" },
];

const STATS = [
  { count: "15", label: "PENDING TASKS", icon: "alarm", variant: "danger" },
  { count: "57", label: "APPOINTED", icon: "check_circle", variant: "info" },
  { count: "28", label: "UNDER REVIEW", icon: "plagiarism", variant: "primary" },
  { count: "462", label: "RESOLVED", icon: "check_circle", variant: "success" },
  { count: "5", label: "EXTRA TIME", icon: "check_circle", variant: "warning" },
  { count: "78", label: "RETURNED", icon: "check_circle", variant: "secondary" },
] as const;

const ANNOUNCEMENTS = Array.from({ length: 3 }, () => ({
  title: "Announcements Header",
  description: "Motif-UI Announcements...",
  date: "29.01.2024",
}));

const PRINTABLES = [
  { title: "Work Permissions", icon: "work", iconVariant: "primary" },
  { title: "Banned List", icon: "warning", iconVariant: "danger" },
  { title: "Residence Permits", icon: "how_to_reg", iconVariant: "success" },
  { title: "Student List", icon: "local_library", iconVariant: "warning" },
] as const;

const STATISTICS_CHART = {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { label: "Unfilled", data: [40, 61, 150, -60, 205, 120, -80, -50, 255, 120, 200, -95], fill: false },
      { label: "Dashed", data: [270, -42, -10, 120, 90, 255, 160, -45, 30, 165, 75, 240], borderDash: [5, 5], fill: false },
      { label: "Filled", data: [260, 195, 230, 170, 50, 130, 40, 150, 20, -20, 265, 160], fill: true },
    ],
  },
};

const STATISTICS_CHART_URL = `https://quickchart.io/chart?w=800&h=360&c=${encodeURIComponent(JSON.stringify(STATISTICS_CHART))}`;

const Dashboard3 = () => (
  <div className="layout">
    <div className="sidebar">
      <MenuList items={MENU_ITEMS} logo={LOGO_URL} enableCollapseButton />
    </div>
    <div className="content">
      <Panel bordered lean>
        <Container>
          <Grid gap="sm" padding="sm">
            <Grid.Row rowGap="sm">
              <Grid.Col className="topbar" size={12}>
                <Card className="topbarTitle" variant="neutral" icon="dashboard" title="Dashboard" />
                <InputText iconLeft="search" placeholder="Search..." />
                <IconButton size="sm" name="notifications" variant="secondary" className="topbarIconButton" />
                <Card
                  className="ceo-card"
                  variant="neutral"
                  title="Metin Tekin"
                  subtitle="Chief Executive Officer"
                  image="https://picsum.photos/seed/motifui-about-avatar/100"
                />
                <IconButton size="sm" name="more_vert" variant="secondary" className="topbarIconButton" />
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>
              <Divider orientation="horizontal" size="sm" />
            </Grid.Row>
            <Grid.Row>
              <Grid.Col size={12} xl={8}>
                <Grid.Row>
                  <Grid.Col size={12}>
                    <Panel type="elevated">
                      <Form submitButtonLabel="List" formOrientation="horizontal" onSubmit={console.log}>
                        <Form.Field name="feedbackType" label="Feedback Type">
                          <Select data={FEEDBACK_TYPES} placeholder="All" />
                        </Form.Field>
                        <Form.Field name="category" label="Category">
                          <Select data={CATEGORIES} placeholder="All" />
                        </Form.Field>
                        <Form.Field name="date" label="Date">
                          <Select data={DATES} placeholder="Last Month" />
                        </Form.Field>
                      </Form>
                    </Panel>
                  </Grid.Col>
                </Grid.Row>
                <Grid.Row columnGap="xs" stretchItems>
                  {SHORTCUTS.map(({ title, icon }) => (
                    <Grid.Col key={title} size={12} md={4}>
                      <Card elevated variant="neutral" iconVariant="primary" icon={icon} title={title} />
                    </Grid.Col>
                  ))}
                </Grid.Row>
                <Grid.Row columnGap="xs" stretchItems>
                  {STATS.map(({ count, label, icon, variant }) => (
                    <Grid.Col key={label} size={12} sm={6} md={4}>
                      <BusinessCard solid variant={variant} icon={icon} title={count} description={label} />
                    </Grid.Col>
                  ))}
                </Grid.Row>
                <Grid.Row>
                  <Grid.Col size={12}>
                    <Panel bordered title="Statistics">
                      <ImageView src={STATISTICS_CHART_URL} alt="Statistics chart" width="100%" />
                    </Panel>
                  </Grid.Col>
                </Grid.Row>
              </Grid.Col>
              <Grid.Col size={12} xl={4}>
                <Grid.Row>
                  <Grid.Col size={12}>
                    <Panel type="elevated">
                      <ListView enableDividers enableMultiLine disableAvatars>
                        {ANNOUNCEMENTS.map(({ title, description, date }, index) => (
                          <ListView.Item
                            key={index}
                            id={`announcement-${index}`}
                            title={title}
                            description={description}
                            alternateText={date}
                          />
                        ))}
                      </ListView>
                      <Link label="All Announcements" url="#" icon="arrow_forward" iconPosition="right" />
                    </Panel>
                  </Grid.Col>
                </Grid.Row>
                <Grid.Row stretchItems>
                  {PRINTABLES.map(({ title, icon, iconVariant }) => (
                    <Grid.Col key={title} size={12}>
                      <Card elevated variant="neutral" icon={icon} iconVariant={iconVariant} title={title} subtitle="Print" />
                    </Grid.Col>
                  ))}
                </Grid.Row>
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </Container>
      </Panel>
    </div>
  </div>
);

export default Dashboard3;
