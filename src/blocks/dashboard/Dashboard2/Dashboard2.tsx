import {
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Icon,
  IconButton,
  InputText,
  ListView,
  MenuList,
  Panel,
  Tab,
  Table,
  Text,
} from "@motif-ui/react";
import AreaChart from "../../chartJS/AreaChart/AreaChart";
import BarChart from "../../chartJS/BarChart/BarChart";
import "./dashboard2.css";

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
  { icon: "payments", title: "Gross Revenue", value: "$426,800.00", caption: "previous month" },
  { icon: "account_balance_wallet", title: "Net Profit", value: "$168,200.00", caption: "previous month" },
  { icon: "receipt_long", title: "Refund Rate", value: "4.2%", caption: "previous month" },
];

const tableData = [
  { refNo: "34567", name: "Jack", surname: "Taylor", nationality: "Çad", birthDate: "01.01.2005", requestDate: "30.10.2025" },
  { refNo: "34568", name: "Mohammed", surname: "Karamanlis", nationality: "Nigeria", birthDate: "12.12.2003", requestDate: "31.10.2025" },
  { refNo: "34569", name: "Suzan", surname: "Smith", nationality: "Somali", birthDate: "04.12.2009", requestDate: "31.10.2025" },
  { refNo: "34560", name: "John", surname: "Doe", nationality: "Nigeria", birthDate: "26.04.1989", requestDate: "31.10.2025" },
  { refNo: "34570", name: "Amina", surname: "Bello", nationality: "Gana", birthDate: "15.03.1995", requestDate: "01.11.2025" },
  { refNo: "34571", name: "Omar", surname: "Haddad", nationality: "Suriye", birthDate: "22.07.1992", requestDate: "01.11.2025" },
  { refNo: "34572", name: "Elena", surname: "Petrova", nationality: "Rusya", birthDate: "09.11.1998", requestDate: "02.11.2025" },
  { refNo: "34573", name: "Ali", surname: "Rezaei", nationality: "İran", birthDate: "30.05.2001", requestDate: "03.11.2025" },
  { refNo: "34574", name: "Fatima", surname: "Diallo", nationality: "Senegal", birthDate: "18.02.1997", requestDate: "03.11.2025" },
  { refNo: "34575", name: "Ivan", surname: "Kovalenko", nationality: "Ukrayna", birthDate: "07.09.1985", requestDate: "04.11.2025" },
  { refNo: "34576", name: "Layla", surname: "Rahimi", nationality: "Afganistan", birthDate: "11.06.2004", requestDate: "05.11.2025" },
  { refNo: "34577", name: "Samuel", surname: "Mensah", nationality: "Gana", birthDate: "25.12.1993", requestDate: "06.11.2025" },
];

const Dashboard2 = () => (
  <Container fluid className="dashboard-2">
    <MenuList enableCollapseButton items={navItems} logo="https://cdn.jsdelivr.net/gh/motif-ui/assets/images/motifui-logo.svg" size="sm" />

    <Panel bordered lean className="content">
      <Container>
        <Grid gap="sm" padding="sm">
          <Grid.Row rowGap="sm" colsAuto justifyCols="apart">
            <Grid.Col className="headerTitle">
              <Icon size="xxl" name="dashboard" />
              <Text text="Dashboard" type="caption" weight="bold" size="md" marginless />
            </Grid.Col>
            <Grid.Col className="navigation-right">
              <InputText iconLeft="search" placeholder="Search users, workspaces" />
              <IconButton name="notifications" variant="secondary" size="sm" />
              <ListView enableMultiLine size="sm" style={{ display: "inline-block" }}>
                <ListView.Item
                  title="Metin Tekin"
                  description="metintekin@motifui.com"
                  image="https://i.pravatar.cc/150"
                  iconRight="more_vert"
                  id="1"
                />
              </ListView>
            </Grid.Col>
          </Grid.Row>

          <Divider size="sm" />

          <Grid.Row colsAuto justifyCols="apart">
            <Grid.Col>
              <Tab
                tabs={[
                  { id: "1y", title: "1 Year" },
                  { id: "3m", title: "3 Months" },
                  { id: "30d", title: "30 Days" },
                ]}
                type="solid"
              />
            </Grid.Col>
            <Grid.Col className="headerActions">
              <Button label="Export" shape="outline" icon="download" iconPosition="left" />
              <Button label="New Transaction" variant="primary" icon="add" iconPosition="left" />
            </Grid.Col>
          </Grid.Row>

          <Grid.Row>
            <Grid.Col size={12} lg={6}>
              <Card contentTitle="Revenue Overview" variant="neutral" outlined>
                <Text text="$4,702,000" type="heading" weight="bold" tone="soft" size="xl" marginless />
                <AreaChart />
              </Card>
            </Grid.Col>
            <Grid.Col size={12} lg={6}>
              <Card contentTitle="Costs Breakdown" variant="neutral" outlined>
                <Text text="$2,405,600" type="heading" weight="bold" tone="soft" size="xl" marginless />
                <BarChart />
              </Card>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row>
            {stats.map(stat => (
              <Grid.Col size={12} md={4} key={stat.title}>
                <Card icon={stat.icon} title={stat.title} subtitle={stat.value} outlined variant="neutral" />
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
                  { title: "Referans No", dataKey: "refNo", sorting: {}, filter: true },
                  { title: "Adı", dataKey: "name", filter: true },
                  { title: "Soyadı", dataKey: "surname", filter: true },
                  { title: "Uyruk", dataKey: "nationality", filter: true },
                  { title: "Doğum Tarihi", dataKey: "birthDate", sorting: {}, filter: true },
                  { title: "Talep Tarihi", dataKey: "requestDate", sorting: {}, filter: true },
                  {
                    title: "İşlemler",
                    width: "220px",
                    render: () => (
                      <Grid gap="sm" padding="sm">
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
      </Container>
    </Panel>
  </Container>
);

export default Dashboard2;
