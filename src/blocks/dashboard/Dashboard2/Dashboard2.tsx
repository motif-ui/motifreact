"use client";

import { Button, Card, Divider, Grid, Icon, IconButton, InputText, ListView, MenuList, Panel, Tab, Table, Text } from "@motif-ui/react";
import Chart from "../components/Chart";
import "./Dashboard2.css";
import ListViewItem from "src/lib/components/ListView/Item/ListViewItem";

const revenueData = [
  { month: "January", dataset1: -35, dataset2: 80 },
  { month: "February", dataset1: 87, dataset2: 72 },
  { month: "March", dataset1: 32, dataset2: -53 },
  { month: "April", dataset1: 92, dataset2: 68 },
  { month: "May", dataset1: -25, dataset2: 60 },
  { month: "June", dataset1: 90, dataset2: -37 },
  { month: "July", dataset1: -28, dataset2: -80 },
  { month: "August", dataset1: 38, dataset2: 1 },
];

const revenueSeries = [
  { key: "dataset1", label: "Dataset 1", color: "#ff6384" },
  { key: "dataset2", label: "Dataset 2", color: "#36a2eb", fillColor: "#36a2eb80" },
];

const costsData = [
  { month: "January", dataset1: 18, dataset2: -80, dataset3: 22 },
  { month: "February", dataset1: -70, dataset2: -12, dataset3: -77 },
  { month: "March", dataset1: 81, dataset2: 47, dataset3: 92 },
  { month: "April", dataset1: 52, dataset2: 46, dataset3: 2 },
  { month: "May", dataset1: -30, dataset2: -95, dataset3: 59 },
  { month: "June", dataset1: 2, dataset2: -58, dataset3: -55 },
  { month: "July", dataset1: -27, dataset2: 14, dataset3: -86 },
];

const costsSeries = [
  { key: "dataset1", label: "Dataset 1", color: "#ff6384", stack: "stack0" },
  { key: "dataset2", label: "Dataset 2", color: "#36a2eb", stack: "stack0" },
  { key: "dataset3", label: "Dataset 3", color: "#4bc0c0", stack: "stack1" },
];

const navItems = [
  { label: "Dashboard", icon: "dashboard", active: true, href: "#" },
  { label: "e-Commerce", icon: "account_balance_wallet", href: "#" },
  { label: "Checkout", icon: "receipt_long", href: "#", divider: true },
  {
    label: "User Profile",
    divider: true,
    icon: "person",
    items: [
      { label: "All Users", href: "#" },
      { label: "Loyalty Members", href: "#", divider: true },
      { label: "Corporate Accounts", href: "#" },
      { label: "User Settings", href: "#" },
    ],
  },
  {
    label: "Forms & Table",
    divider: true,
    icon: "feed",
    items: [
      { label: "Basic Form", href: "#" },
      { label: "Basic Table", href: "#" },
      { label: "Multi Step", href: "#" },
    ],
  },
  {
    label: "Micropages",
    icon: "library_books",
    items: [
      { label: "Basic Form", href: "#" },
      { label: "Basic Table", href: "#" },
      { label: "Multi Step", href: "#" },
    ],
  },
  { label: "Role Manager", icon: "local_library", href: "#" },
  { label: "Billing", icon: "receipt", href: "#" },
  { label: "Staff & Roles", icon: "supervisor_account", href: "#", divider: true },
];

const stats = [
  {
    icon: "payments",
    title: "Gross Revenue",
    value: "$426,800.00",
    caption: "previous month",
  },
  {
    icon: "account_balance_wallet",
    title: "Net Profit",
    value: "$168,200.00",
    caption: "previous month",
  },
  {
    icon: "receipt_long",
    title: "Refund Rate",
    value: "4.2%",
    caption: "previous month",
  },
];

type TableRow = {
  referenceNo: string;
  name: string;
  surname: string;
  nationality: string;
  birthDate: string;
  requestDate: string;
};

const tableData: TableRow[] = [
  { referenceNo: "34567", name: "Jack", surname: "Taylor", nationality: "Çad", birthDate: "01.01.2005", requestDate: "30.10.2025" },
  {
    referenceNo: "34568",
    name: "Mohammed",
    surname: "Karamanlis",
    nationality: "Nigeria",
    birthDate: "12.12.2003",
    requestDate: "31.10.2025",
  },
  { referenceNo: "34569", name: "Suzan", surname: "Smith", nationality: "Somali", birthDate: "04.12.2009", requestDate: "31.10.2025" },
  { referenceNo: "34560", name: "John", surname: "Doe", nationality: "Nigeria", birthDate: "26.04.1989", requestDate: "31.10.2025" },
  { referenceNo: "34567", name: "Jack", surname: "Taylor", nationality: "Çad", birthDate: "01.01.2005", requestDate: "30.10.2025" },
  {
    referenceNo: "34568",
    name: "Mohammed",
    surname: "Karamanlis",
    nationality: "Nigeria",
    birthDate: "12.12.2003",
    requestDate: "31.10.2025",
  },
  { referenceNo: "34569", name: "Suzan", surname: "Smith", nationality: "Somali", birthDate: "04.12.2009", requestDate: "31.10.2025" },
  { referenceNo: "34560", name: "John", surname: "Doe", nationality: "Nigeria", birthDate: "26.04.1989", requestDate: "31.10.2025" },
  { referenceNo: "34567", name: "Jack", surname: "Taylor", nationality: "Çad", birthDate: "01.01.2005", requestDate: "30.10.2025" },
  {
    referenceNo: "34568",
    name: "Mohammed",
    surname: "Karamanlis",
    nationality: "Nigeria",
    birthDate: "12.12.2003",
    requestDate: "31.10.2025",
  },
  { referenceNo: "34569", name: "Suzan", surname: "Smith", nationality: "Somali", birthDate: "04.12.2009", requestDate: "31.10.2025" },
  { referenceNo: "34560", name: "John", surname: "Doe", nationality: "Nigeria", birthDate: "26.04.1989", requestDate: "31.10.2025" },
];

const Dashboard2 = () => {
  return (
    <div className="layout">
      <div className="sidebar">
        <MenuList
          enableCollapseButton
          items={navItems}
          logo="https://cdn.jsdelivr.net/gh/motif-ui/assets/images/motifui-logo.svg"
          size="sm"
          // footer={
          //   <ListView enableMultiLine size="sm">
          //     <ListViewItem
          //       title="Metin Tekin"
          //       description="metintekin@motifui.com"
          //       image="https://i.pravatar.cc/150"
          //       iconRight="more_vert"
          //       id="1"
          //     />
          //   </ListView>
          // }
        />
      </div>

      <div className="content">
        <Panel bordered>
          <Grid gutter="sm" leanToEdge fluid>
            <Grid.Row colsAuto justifyCols="apart">
              <Grid.Col className="headerTitle">
                <Icon size="xxl" name="dashboard" />
                <Text text="Dashboard" type="heading" weight="bold" marginless />
              </Grid.Col>
              <Grid.Col className="headerActions">
                <InputText iconLeft="search" placeholder="Search users, workspaces" />
                <IconButton name="notifications" variant="secondary" size="sm" />
                <ListView enableMultiLine size="sm">
                  <ListViewItem
                    title="Metin Tekin"
                    description="metintekin@motifui.com"
                    image="https://i.pravatar.cc/150"
                    iconRight="more_vert"
                    id="1"
                  />
                </ListView>
              </Grid.Col>
            </Grid.Row>

            <Grid.Row>
              <Grid.Col size={12}>
                <Divider size="sm" />
              </Grid.Col>
            </Grid.Row>

            <Grid.Row colsAuto justifyCols="apart">
              <Grid.Col>
                <Tab
                  tabs={[
                    { id: "1y", title: "1 Year" },
                    { id: "3m", title: "3 Months" },
                    { id: "30d", title: "30 Days" },
                  ]}
                  type="solid"
                  position="left"
                />
              </Grid.Col>
              <Grid.Col className="headerActions">
                <Button label="Export" shape="outline" icon="download" iconPosition="left" />
                <Button label="New Transaction" variant="primary" icon="add" iconPosition="left" />
              </Grid.Col>
            </Grid.Row>

            <Grid.Row>
              <Grid.Col size={12} lg={6}>
                <Card contentTitle="Revenue Overview" className="statCard" outlined>
                  <Text text="$4,702,000" type="heading" weight="bold" tone="soft" size="xl" marginless />

                  <Chart type="area" data={revenueData} xKey="month" series={revenueSeries} />
                </Card>
              </Grid.Col>
              <Grid.Col size={12} lg={6}>
                <Card contentTitle="Costs Breakdown" className="statCard" outlined>
                  <Text text="$2,405,600" type="heading" weight="bold" tone="soft" size="xl" marginless />

                  <Chart type="bar" data={costsData} xKey="month" series={costsSeries} />
                </Card>
              </Grid.Col>
            </Grid.Row>

            <Grid.Row>
              {stats.map(stat => (
                <Grid.Col size={12} md={4} key={stat.title}>
                  <Card icon={stat.icon} title={stat.title} subtitle={stat.value} outlined className="statCard" />
                </Grid.Col>
              ))}
            </Grid.Row>

            <Grid.Row>
              <Grid.Col size={12} className="tableScroll">
                <Table
                  data={tableData}
                  border="rowBorders"
                  filterableTable
                  fluid
                  pagination={{ rowsPerPage: 4, position: "center" }}
                  columns={[
                    { title: "Referans No", dataKey: "referenceNo", sorting: {}, filter: true },
                    { title: "Adı", dataKey: "name", filter: true },
                    { title: "Soyadı", dataKey: "surname", filter: true },
                    { title: "Uyruk", dataKey: "nationality", filter: true },
                    { title: "Doğum Tarihi", dataKey: "birthDate", sorting: {}, filter: true },
                    { title: "Talep Tarihi", dataKey: "requestDate", sorting: {}, filter: true },
                    {
                      title: "İşlemler",
                      render: () => (
                        <Grid gutter="xs" leanToEdge className="rowActions">
                          <Grid.Row colsAuto>
                            <Grid.Col>
                              <Button label="İptal" variant="danger" size="xs" icon="close" iconPosition="left" />
                            </Grid.Col>
                            <Grid.Col>
                              <Button label="İncele" variant="primary" size="xs" icon="visibility" iconPosition="left" />
                            </Grid.Col>
                          </Grid.Row>
                        </Grid>
                      ),
                    },
                  ]}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </Panel>
      </div>
    </div>
  );
};

export default Dashboard2;
