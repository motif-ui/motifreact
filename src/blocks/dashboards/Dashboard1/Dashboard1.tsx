"use client";

import Script from "next/script";
import {
  Card,
  Divider,
  Grid,
  InputDateRange,
  MenuList,
  Panel,
  ProgressBar,
  Tab,
  Link,
  BusinessCard,
  ListView,
  IconButton,
  InputText,
  Text,
  Container,
} from "@motif-ui/react";
import OccupancyChart from "../../chartJS/OccupancyCharts/OccupancyChart";
import CustomerSegmentsChart from "../../chartJS/CustomerSegments/CustomerSegmentsChart";
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
    divider: true,
  },
  {
    href: "#",
    icon: "crop_free",
    label: "Empty States",
    divider: true,
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
    divider: true,
  },
  {
    href: "#",
    icon: "group",
    label: "Staff & Roles",
  },
];

const businessCards = [
  { title: "%78", description: "Occupancy Rate", linkText: "+3.2%" },
  { title: "$185.00", description: "Avg. Rate", linkText: "+5.2%" },
  { title: "$144.30", description: "Amount", linkText: "+5.4%" },
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
          <Container>
            <Grid gap="sm" padding="sm">
              <Grid.Row>
                <Grid.Col className="headerActions" size={12} lg={4}>
                  <InputDateRange size="sm" value={[new Date("2026-10-08T06:08:27.792Z"), new Date("2026-10-14T21:00:00.000Z")]} />
                </Grid.Col>
                <Grid.Col size={12} lg={8}>
                  <Grid.Row gap="xs">
                    <Grid.Col className="headerActions" size={12} md={7}>
                      <InputText className="headerSearch" iconLeft="search" placeholder="Search..." />
                      <IconButton size="sm" name="notifications" variant="secondary" />
                    </Grid.Col>
                    <Grid.Col size={12} md={5}>
                      <ListView enableMultiLine size="sm">
                        <ListView.Item
                          description="Chief Executive Officer"
                          id="1"
                          title="Hello Metin"
                          image="https://picsum.photos/seed/motifui-about-avatar/100"
                          iconRight="more_vert"
                        />
                      </ListView>
                    </Grid.Col>
                  </Grid.Row>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Divider orientation="horizontal" size="sm" />
              </Grid.Row>
              <Grid.Row>
                <Grid.Col size={12} lg={8}>
                  <Grid.Row columnGap="xs" stretchItems>
                    {businessCards.map(card => (
                      <Grid.Col key={card.description} size={12} md={4}>
                        <BusinessCard
                          title={card.title}
                          description={card.description}
                          outline
                          position="left"
                          link={{ href: "https://motif-ui.com/", text: card.linkText, targetBlank: true }}
                        />
                      </Grid.Col>
                    ))}
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Col size={12}>
                      <Panel bordered>
                        <OccupancyChart />
                      </Panel>
                    </Grid.Col>
                  </Grid.Row>
                  <Grid.Row stretchItems>
                    <Grid.Col size={12} xl={6}>
                      <Grid.Row stretchItems>
                        <Grid.Col size={12}>
                          <Card
                            outlined
                            variant="neutral"
                            buttonsPosition="center"
                            contentActionButton={{
                              onClick: () => {},
                              text: "View Reports",
                            }}
                            contentAlternateButton={{
                              onClick: () => {},
                              text: "Show Details",
                            }}
                            contentSubtitle="Room Capacity"
                            contentTitle="58%"
                          >
                            <ProgressBar size="xl" progress={65} />
                            <Link label="Occupied Rooms" url="https://motif-ui.com" iconPosition="left" />
                          </Card>
                        </Grid.Col>
                      </Grid.Row>
                      <Grid.Row stretchItems>
                        <Grid.Col size={12}>
                          <Panel bordered>
                            <CustomerSegmentsChart />
                          </Panel>
                        </Grid.Col>
                      </Grid.Row>
                    </Grid.Col>
                    <Grid.Col size={12} xl={6}>
                      <Card
                        outlined
                        buttonsPosition="center"
                        contentActionButton={{
                          onClick: () => {},
                          text: "View Reports",
                        }}
                        contentAlternateButton={{
                          onClick: () => {},
                          text: "Show Details",
                        }}
                        contentSubtitle="Net Revenue $105.250"
                        contentTitle="$105.250"
                        variant="neutral"
                      >
                        <ProgressBar size="xl" progress={35} />
                        <Grid.Row stretchItems>
                          <Grid.Col size={12} lg={6}>
                            <Card contentTitle="Offline Revenue" contentSubtitle="$612.150" outlined variant="neutral" />
                          </Grid.Col>
                          <Grid.Col size={12} lg={6}>
                            <Card contentTitle="Platform Revenue" contentSubtitle="$300.000" outlined variant="neutral" />
                          </Grid.Col>
                        </Grid.Row>
                        <Link label="Channels" url="https://motif-ui.com" iconPosition="left" />
                        <ListView enableDividers size="sm">
                          <ListView.Item title="Booking.com" />
                          <ListView.Item title="Airbnb.com" />
                        </ListView>
                      </Card>
                    </Grid.Col>
                  </Grid.Row>
                </Grid.Col>
                <Grid.Col size={12} lg={4}>
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
                    <Tab.Panel id="arrivals">
                      <Grid.Row>
                        <Grid.Col size={12}>
                          <Card outlined variant="neutral" title="John Doe" subtitle="14:00 Check-In">
                            <Link label="via Direct" icon="language" iconPosition="left" />
                          </Card>
                        </Grid.Col>
                        <Grid.Col size={12}>
                          <Card outlined variant="neutral" title="Sarah & Tom Gibson" subtitle="10:00 Check-In">
                            <Link label="via Direct" icon="language" iconPosition="left" />
                            <ListView enableDividers>
                              <ListView.Item title="Room Type: Family" />
                              <ListView.Item title="Nights: 3" />
                            </ListView>
                          </Card>
                        </Grid.Col>
                      </Grid.Row>
                    </Tab.Panel>
                    <Tab.Panel id="departures">
                      <Card title="Platform Revenue" subtitle="$300.000" outlined variant="neutral" />
                    </Tab.Panel>
                    <Tab.Panel id="house">
                      <Text
                        type="body"
                        size="sm"
                        text=" Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard
                    dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen
                    book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially
                    unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more
                    recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                      />
                    </Tab.Panel>
                  </Tab>
                </Grid.Col>
              </Grid.Row>
            </Grid>
          </Container>
        </Panel>
      </div>
    </div>
  </>
);

export default Dashboard1;
