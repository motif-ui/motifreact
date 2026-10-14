"use client";

import Script from "next/script";
import { Card, Divider, Grid, InputDateRange, MenuList, Panel, ProgressBar, Tab, Link, BusinessCard, ListView, IconButton } from "src/lib";
import TabPanel from "src/lib/components/Tab/components/TabPanel";
import ListViewItem from "src/lib/components/ListView/Item/ListViewItem";
import OccupancyChart from "../../../chartJS/OccupancyCharts/OccupancyChart";
import CustomerSegmentsChart from "../../../chartJS/CustomerSegments/CustomerSegmentsChart";
import "./dashboard1.css";

const menuList = [
  {
    active: true,
    href: "#",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    href: "#",
    icon: "local_mall",
    label: "e-Commerce",
  },
  {
    href: "#",
    icon: "receipt",
    label: "Checkout",
  },
  {
    icon: "supervisor_account",
    label: "User Profile",
    items: [
      { href: "#", label: "All Users" },
      { href: "#", label: "Loyalty Members" },
      { href: "#", label: "Corporate Accounts" },
      { href: "#", label: "Corporate Accounts" },
    ],
  },
  {
    icon: "table_rows",
    label: "Forms & Table",
    items: [
      { href: "#", label: "Basic Form" },
      { href: "#", label: "Basic Table" },
      { href: "#", label: "Multi Step" },
    ],
  },
  {
    href: "#",
    icon: "lists",
    label: "Micropages",
  },
  {
    href: "#",
    icon: "crop_free",
    label: "Empty States",
  },
  {
    href: "#",
    icon: "shield",
    label: "Role Manager",
  },
  {
    href: "#",
    icon: "receipt_long",
    label: "Billing",
  },
  {
    href: "#",
    icon: "group",
    label: "Staff & Roles",
  },
];

const Dashboard1 = () => (
  <>
    <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="beforeInteractive" />
    <div className="layout">
      <div className="sidebar">
        <MenuList items={menuList} logo="https://cdn.jsdelivr.net/gh/motif-ui/assets/images/motifui-logo.svg" enableCollapseButton />
      </div>
      <div className="content">
        <Panel bordered lean>
          <Grid fluid gutter="lg">
            <Grid.Row>
              <Grid.Col size={12}>
                <Grid fluid leanToEdge>
                  <Grid.Row justifyCols="center">
                    <Grid.Col className="topbarLeft" size={12} md={6}>
                      <InputDateRange size="sm" value={[new Date("2026-10-08T06:08:27.792Z"), new Date("2026-10-14T21:00:00.000Z")]} />
                    </Grid.Col>
                    <Grid.Col className="topbarRight" size={12} md={6}>
                      <IconButton size="sm" name="search" variant="secondary" className="topbarIconButton" />
                      <IconButton size="sm" name="notifications" variant="secondary" className="topbarIconButton" />
                      <ListView enableMultiLine size="sm">
                        <ListViewItem description="Welcome back to Motif UI" id="1" title="Hello Metin" image="https://i.pravatar.cc/150" />
                      </ListView>
                    </Grid.Col>
                  </Grid.Row>
                </Grid>
              </Grid.Col>
              <Divider orientation="horizontal" />

              <Grid.Col size={12}>
                <Grid fluid leanToEdge>
                  <Grid.Row>
                    <Grid.Col size={12} lg={8} md={12} sm={12}>
                      <Grid gutter="md" leanToEdge fluid>
                        <Grid.Row>
                          <Grid.Col size={12} md={4}>
                            <BusinessCard
                              title="%78"
                              description="Occupancy Rate"
                              outline
                              position="left"
                              link={{
                                text: "+3.2%",
                                href: "https://motif-ui.com/",
                                targetBlank: true,
                              }}
                            />
                          </Grid.Col>
                          <Grid.Col size={12} md={4}>
                            <BusinessCard
                              title="$185.00"
                              description="Avg. Rate"
                              outline
                              position="left"
                              link={{ href: "https://motif-ui.com/", text: "+5.2%", targetBlank: true }}
                            />
                          </Grid.Col>
                          <Grid.Col size={12} md={4}>
                            <BusinessCard
                              title="$144.30"
                              description="Amount"
                              outline
                              position="left"
                              link={{ href: "https://motif-ui.com/", text: "+5.4%", targetBlank: true }}
                            />
                          </Grid.Col>
                        </Grid.Row>
                        <Grid.Row>
                          <Panel bordered className="fullWidth">
                            <OccupancyChart />
                          </Panel>
                        </Grid.Row>
                        <Grid.Row>
                          <Grid gutter="md" fluid leanToEdge>
                            <Grid.Row>
                              <Grid.Col size={12} xl={6}>
                                <Grid fluid gutter="md" leanToEdge>
                                  <Grid.Row>
                                    <Card
                                      className="fullWidth cardBg"
                                      outlined
                                      contentActionButton={{
                                        onClick: () => console.log(),
                                        text: "View Reports",
                                      }}
                                      contentAlternateButton={{
                                        onClick: () => console.log(),
                                        text: "Show Details",
                                      }}
                                      contentSubtitle="Room Capacity"
                                      contentTitle="58%"
                                    >
                                      <ProgressBar size="xl" progress={65} />
                                      <Link label="Occupied Rooms" url="https://motif-ui.com" iconPosition="left" />
                                    </Card>
                                  </Grid.Row>
                                  <Grid.Row>
                                    <Panel bordered className="fullWidth">
                                      <CustomerSegmentsChart />
                                    </Panel>
                                  </Grid.Row>
                                </Grid>
                              </Grid.Col>
                              <Grid.Col size={12} xl={6}>
                                <Grid.Row>
                                  <Card
                                    className="fullWidth cardBg"
                                    outlined
                                    contentActionButton={{
                                      onClick: () => console.log(),
                                      text: "View Reports",
                                    }}
                                    subtitle="Net Revenue $105.250"
                                    title="$105.250"
                                  >
                                    <ProgressBar size="xl" progress={35} />

                                    <Grid leanToEdge fluid>
                                      <Grid.Row>
                                        <Grid.Col size={12} lg={6}>
                                          <Card contentTitle="Offline Revenue" contentSubtitle="$612.150" outlined className="cardBg" />
                                        </Grid.Col>
                                        <Grid.Col size={12} lg={6}>
                                          <Card contentTitle="Platform Revenue" contentSubtitle="$300.000" outlined className="cardBg" />
                                        </Grid.Col>
                                      </Grid.Row>
                                    </Grid>

                                    <Link label="Channels" url="https://motif-ui.com" iconPosition="left" />

                                    <ListView enableDividers size="sm">
                                      <ListViewItem title="Booking.com" />
                                      <ListViewItem title="Airbnb.com" />
                                    </ListView>
                                  </Card>
                                </Grid.Row>
                              </Grid.Col>
                            </Grid.Row>
                          </Grid>
                        </Grid.Row>
                      </Grid>
                    </Grid.Col>
                    <Grid.Col size={12} lg={4} md={12} sm={12}>
                      <Tab
                        defaultTabId="arrivals"
                        tabs={[
                          {
                            id: "arrivals",
                            title: "Arrivals",
                          },
                          {
                            id: "departures",
                            title: "Departures",
                          },
                          {
                            icon: "house",
                            id: "house",
                            title: "House",
                          },
                        ]}
                      >
                        <TabPanel id="arrivals">
                          <div className="arrivalsList">
                            <Card outlined className="cardBg" contentTitle="John Doe" contentSubtitle="14:00 Check-In">
                              <Link label="via Direct" icon="language" iconPosition="left" />
                            </Card>
                            <Card outlined className="cardBg" title="Sarah & Tom Gibson" subtitle="10:00 Check-In">
                              <Link label="via Direct" icon="language" iconPosition="left" />
                              <ListView enableDividers>
                                <ListViewItem title="Room Type : Family" />
                                <ListViewItem title="Nights: 3" />
                              </ListView>
                            </Card>
                          </div>
                        </TabPanel>
                        <TabPanel id="departures">
                          <Card title="Platform Revenue" subtitle="$300.000" outlined className="cardBg" />
                        </TabPanel>
                        <TabPanel id="house">
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys
                          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a
                          type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
                          remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
                          Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions
                          of Lorem Ipsum.
                        </TabPanel>
                      </Tab>
                    </Grid.Col>
                  </Grid.Row>
                </Grid>
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </Panel>
      </div>
    </div>
  </>
);

export default Dashboard1;
