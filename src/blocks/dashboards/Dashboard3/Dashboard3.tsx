"use client";

import { useState } from "react";
import { BusinessCard, Card, Divider, Form, Grid, IconButton, Link, ListView, MenuList, Panel, Select, Skeleton } from "@motif-ui/react";
import "./dashboard3.css";

const LOGO_URL = "https://cdn.jsdelivr.net/gh/motif-ui/assets@HEAD/images/motifui-logo.svg";

const MENU_ITEMS = [
  { label: "Dashboard", icon: "dashboard", active: true },
  { label: "Analytics", icon: "bar_chart" },
  { label: "Activity", icon: "speed" },
  { label: "Directory", icon: "groups", items: [{ label: "All Users" }, { label: "Workspaces" }] },
  { label: "Subscriptions", icon: "receipt_long" },
  { label: "Usage", icon: "flash_on" },
  { label: "Saved Reports", icon: "description" },
  { label: "Exports", icon: "upload" },
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
  description: "e-Government and Information...",
  date: "29.01.2024",
}));

const PRINTABLES = [
  { title: "Work Permissions", icon: "work", variant: "secondary" },
  { title: "Banned List", icon: "warning", variant: "secondary" },
  { title: "Residence Permits", icon: "how_to_reg", variant: "secondary" },
  { title: "Student List", icon: "local_library", variant: "secondary" },
] as const;

const Dashboard3 = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  return (
    <Grid fluid gutter="lg">
      <Grid.Row>
        <Grid.Col size={12} lg={menuCollapsed ? 1 : 3} xl={menuCollapsed ? 1 : 2}>
          <Grid fluid leanToEdge gutter="lg">
            <Grid.Row>
              <Grid.Col>
                <MenuList items={MENU_ITEMS} logo={LOGO_URL} enableCollapseButton onCollapsedChange={setMenuCollapsed} />
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </Grid.Col>

        <Grid.Col size={12} lg={menuCollapsed ? 11 : 9} xl={menuCollapsed ? 11 : 10}>
          <Panel bordered lean>
            <Grid fluid gutter="lg">
              <Grid.Row justifyCols="apart" colsAuto>
                <Grid.Col className="dashboard3-centered">
                  <Card style={{ background: "none" }} title="Dashboard" icon="dashboard" />
                </Grid.Col>
                <Grid.Col>
                  <Grid fluid leanToEdge gutter="lg">
                    <Grid.Row colsAuto>
                      <Grid.Col className="dashboard3-centered">
                        <IconButton name="search" onClick={console.log} />
                      </Grid.Col>
                      <Grid.Col className="dashboard3-centered">
                        <IconButton name="notifications" onClick={console.log} />
                      </Grid.Col>
                      <Grid.Col>
                        <Card
                          style={{ background: "none" }}
                          avatarText="MT"
                          title="Metin Tekin"
                          subtitle="Chief Executive Officer"
                          action={{ icon: "more_vert", onClick: console.log }}
                        />
                      </Grid.Col>
                    </Grid.Row>
                  </Grid>
                </Grid.Col>
              </Grid.Row>
            </Grid>
            <Divider />
            <Grid fluid gutter="lg">
              <Grid.Row>
                <Grid.Col size={12} xl={8}>
                  <Grid fluid leanToEdge gutter="lg">
                    <Grid.Row>
                      <Grid.Col>
                        <Panel type="elevated">
                          <Form className="dashboard3-filter" submitButtonLabel="List" formOrientation="horizontal" onSubmit={console.log}>
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

                    <Grid.Row>
                      {SHORTCUTS.map(({ title, icon }) => (
                        <Grid.Col key={title} size={12} md={4}>
                          <Card style={{ background: "none" }} elevated variant="secondary" icon={icon} title={title} />
                        </Grid.Col>
                      ))}
                    </Grid.Row>

                    <Grid.Row>
                      {STATS.map(({ count, label, icon, variant }) => (
                        <Grid.Col key={label} size={12} sm={6} md={4}>
                          <BusinessCard solid variant={variant} icon={icon} title={count} description={label} />
                        </Grid.Col>
                      ))}
                    </Grid.Row>

                    <Grid.Row>
                      <Grid.Col>
                        <Panel bordered title="Statistics">
                          <Skeleton />
                        </Panel>
                      </Grid.Col>
                    </Grid.Row>
                  </Grid>
                </Grid.Col>

                <Grid.Col size={12} xl={4}>
                  <Grid fluid leanToEdge gutter="lg">
                    <Grid.Row>
                      <Grid.Col>
                        <Panel type="elevated">
                          <ListView enableDividers enableMultiLine disableAvatars>
                            {ANNOUNCEMENTS.map(({ title, description, date }, index) => (
                              <ListView.Item key={index} title={title} description={description} alternateText={date} />
                            ))}
                          </ListView>
                          <Link label="All Announcements" url="#" icon="arrow_forward" iconPosition="right" />
                        </Panel>
                      </Grid.Col>
                    </Grid.Row>

                    <Grid.Row>
                      {PRINTABLES.map(({ title, icon, variant }) => (
                        <Grid.Col key={title} size={12}>
                          <Card style={{ background: "none" }} elevated variant={variant} icon={icon} title={title} subtitle="Print" />
                        </Grid.Col>
                      ))}
                    </Grid.Row>
                  </Grid>
                </Grid.Col>
              </Grid.Row>
            </Grid>
          </Panel>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
};

Dashboard3.displayName = "Dashboard3";
export default Dashboard3;
