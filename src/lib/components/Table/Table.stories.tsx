import type { Meta, StoryObj } from "@storybook/nextjs";

import Table from "./Table";
import useServerTable from "./hooks/useServerTable";
import { generateMockTableData } from "../../../docs/data/table";
import Button from "@/components/Button";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  argTypes: {
    headerColsBackground: { table: { defaultValue: { summary: "medium" } } },
    footerColsBackground: { table: { defaultValue: { summary: "medium" } } },
  },
  args: {
    columns: [
      { title: "Name", dataKey: "name" },
      { title: "Surname", dataKey: "surname" },
      { title: "Age", dataKey: "age" },
      { title: "City", dataKey: "address.city" },
    ],
    data: generateMockTableData(6),
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

type RowData = { name: string; surname: string };

export const Primary: Story = {};

export const BasicUse: Story = {
  render: args => (
    <Table
      {...args}
      columns={[
        { title: "Name", dataKey: "name" },
        { title: "Surname", dataKey: "surname" },
      ]}
      data={[
        { name: "Name 1", surname: "Surname 1" },
        { name: "Name 2", surname: "Surname 2" },
      ]}
    />
  ),
};

const ServerSideBasicUseDemo = () => {
  const serverTable = useServerTable<{ name: string; email: string; company: { name: string } }>({
    url: "https://jsonplaceholder.typicode.com/users?_limit=3",
  });

  return (
    <Table
      columns={[
        { title: "Name", dataKey: "name" },
        { title: "Email", dataKey: "email" },
        { title: "Company", dataKey: "company.name" },
      ]}
      {...serverTable}
    />
  );
};

export const ServerSideBasicUse: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
const serverTable = useServerTable<User>({
  url: "https://api.example.com/users"
});

<Table columns={columns} {...serverTable} />
        `,
      },
    },
  },
  render: () => <ServerSideBasicUseDemo />,
};

const ServerSideParamsDemo = () => {
  const serverTable = useServerTable<{ name: string; email: string; company: { name: string } }>({
    url: "https://jsonplaceholder.typicode.com/users",
    pageSize: 3,
    queryStringKeys: {
      page: "_page",
      pageSize: "_limit",
      sortBy: "_sort",
      sortOrder: "_order",
      query: "q",
      columnFilter: dataKey => `${dataKey}_like`,
    },
    totalCount: { headerKey: "X-Total-Count" },
  });

  return (
    <Table
      columns={[
        { title: "Name", dataKey: "name", sorting: {} },
        { title: "Email", dataKey: "email", sorting: {}, filter: true },
        { title: "Company", dataKey: "company.name" },
      ]}
      filterableTable
      reflectDataChanges
      pagination={{ rowsPerPage: 3 }}
      {...serverTable}
    />
  );
};

export const ServerSideParams: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
const serverTable = useServerTable<User>({
  url: "https://api.example.com/users",
  pageSize: 3,
  queryStringKeys: {
    page: "_page",
    pageSize: "_limit",
    sortBy: "_sort",
    sortOrder: "_order",
    query: "q",
    columnFilter: (dataKey) => \`\${dataKey}_like\`
  },
  totalCount: { headerKey: "X-Total-Count" }
});

<Table columns={columns} filterableTable reflectDataChanges pagination={{ rowsPerPage: 3 }} {...serverTable} />
        `,
      },
    },
  },
  render: () => <ServerSideParamsDemo />,
};

const ServerSideFetcherDemo = () => {
  type DocsDummyUser = { id: number; firstName: string; lastName: string; email: string; gender: string };
  const serverTable = useServerTable<DocsDummyUser>({ pageSize: 3 }, async ({ page, pageSize = 3, sort, filters, signal }) => {
    const { dataKey, direction } = sort;
    const [filterKey, filterValue] = Object.entries(filters.columns).find(([, value]) => value) ?? [];
    // DummyJSON needs a different endpoint depending on what's active — something a fixed `url` + `params` could never express.
    const baseUrl = `https://dummyjson.com/users${filters.main ? "/search" : filterKey ? "/filter" : ""}`;

    const params = new URLSearchParams({ limit: String(pageSize), skip: String((page - 1) * pageSize) });
    if (dataKey && direction) {
      params.set("sortBy", dataKey);
      params.set("order", direction);
    }
    filters.main && params.set("q", filters.main);
    if (filterKey) {
      params.set("key", filterKey);
      params.set("value", filterValue as string);
    }

    const response = await fetch(`${baseUrl}?${params}`, { signal });
    const body = (await response.json()) as { users: DocsDummyUser[]; total: number };
    return { data: body.users, totalRecords: body.total };
  });

  return (
    <Table
      columns={[
        { title: "First Name", dataKey: "firstName", sorting: {} },
        { title: "Last Name", dataKey: "lastName", sorting: {} },
        { title: "Email", dataKey: "email" },
        { title: "Gender", dataKey: "gender", filter: true },
      ]}
      filterableTable
      reflectDataChanges
      pagination={{ rowsPerPage: 3 }}
      {...serverTable}
    />
  );
};

export const ServerSideFetcher: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
const serverTable = useServerTable<User>(
  { pageSize: 3 },
  async ({ page, pageSize, sort, filters, signal }) => {
    const { dataKey, direction } = sort;
    const [filterKey, filterValue] = Object.entries(filters.columns).find(([, value]) => value) ?? [];

    const baseUrl = \`https://api.example.com/users\${filters.main ? "/search" : filterKey ? "/filter" : ""}\`;

    const params = new URLSearchParams({ limit: String(pageSize), skip: String((page - 1) * pageSize) });
    if (dataKey && direction) params.set("sortBy", dataKey), params.set("order", direction);
    filters.main && params.set("q", filters.main);
    if (filterKey) params.set("key", filterKey), params.set("value", filterValue);

    const response = await fetch(\`\${baseUrl}?\${params}\`, { signal });
    const body = await response.json();
    return { data: body.users, totalRecords: body.total };
  }
);

<Table columns={columns} filterableTable reflectDataChanges pagination={{ rowsPerPage: 3 }} {...serverTable} />
        `,
      },
    },
  },
  render: () => <ServerSideFetcherDemo />,
};

export const CustomRender: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={[
    { title: "Name", dataKey: "name", render: text => <button>{text}</button> },
    { title: "Surname",
      render: row => (
        <a href={"https://www.google.com/?q=" + row.surname} target="_blank">
          {row.surname}
        </a>
      )
    }
  ]}
/>
        `,
      },
    },
  },
  render: () => (
    <Table
      columns={[
        { title: "Name", dataKey: "name", render: text => <button>{text as string}</button> },
        {
          title: "Surname",
          render: row => (
            <a href={"https://www.google.com/?q=" + (row as RowData).surname} target="_blank" rel="noreferrer">
              {(row as RowData).surname}
            </a>
          ),
        },
      ]}
      data={[
        { name: "Name 1", surname: "Surname 1" },
        { name: "Name 2", surname: "Surname 2" },
      ]}
    />
  ),
};

export const Sorting: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={[
    { title: "Name", dataKey: "name", sorting: {} },
    { title: "Surname", dataKey: "surname" }
  ]} />
        `,
      },
    },
  },
  render: () => (
    <Table
      data={[
        { name: "Name 2", surname: "Surname 2" },
        { name: "Name 3", surname: "Surname 3" },
        { name: "Name 1", surname: "Surname 1" },
      ]}
      columns={[
        { title: "Name", dataKey: "name", sorting: {} },
        { title: "Surname", dataKey: "surname" },
      ]}
    />
  ),
};

export const SortingCustom: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={[
    { title: "Name", dataKey: "name", sorting: {
        customSort: (a, b) => (typeof a === "string" && typeof b === "string" ? a.at(-1)!.localeCompare(b.at(-1)!) : 0)
      }
    },
    { title: "Surname", dataKey: "surname" }
  ]}
  />
        `,
      },
    },
  },
  render: () => (
    <Table
      data={[
        { name: "Mehmet", surname: "Aktas" },
        { name: "Salih", surname: "Akdas" },
        { name: "Necmi", surname: "Sengul" },
        { name: "Zehranur", surname: "Caliskan" },
      ]}
      columns={[
        {
          title: "Name",
          dataKey: "name",
          sorting: { customSort: (a, b) => (typeof a === "string" && typeof b === "string" ? a.at(-1)!.localeCompare(b.at(-1)!) : 0) },
        },
        { title: "Surname", dataKey: "surname" },
      ]}
    />
  ),
};

export const Header: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={columns}
  header="My Simple Table Header" />
  
  <Table
    data={data}
    columns={columns}
    header={
      <div style={{ background: "#2d2d2d", padding: 20, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontWeight: "bold", color: "#FFF", flex: 1 }}>My Custom Table Header</span>
        <Button label="Export" size="xs" icon="upload" />
        <Button label="Send Email" size="xs" icon="mail" variant="secondary" />
      </div>
    }
  />
        `,
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
      <Table
        data={[
          { name: "Name 2", surname: "Surname 2" },
          { name: "Name 3", surname: "Surname 3" },
          { name: "Name 1", surname: "Surname 1" },
        ]}
        columns={[
          { title: "Name", dataKey: "name" },
          { title: "Surname", dataKey: "surname" },
        ]}
        header="My Simple Table Header"
      />
      <Table
        data={[
          { name: "Name 2", surname: "Surname 2" },
          { name: "Name 3", surname: "Surname 3" },
          { name: "Name 1", surname: "Surname 1" },
        ]}
        columns={[
          { title: "Name", dataKey: "name" },
          { title: "Surname", dataKey: "surname" },
        ]}
        header={
          <div style={{ background: "#2d2d2d", padding: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: "bold", color: "#FFF", flex: 1 }}>My Custom Table Header</span>
            <Button label="Export" size="xs" icon="upload" />
            <Button label="Send Email" size="xs" icon="mail" variant="secondary" />
          </div>
        }
      />
    </div>
  ),
};
export const TitleAndSubtitle: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  title="Table Title"
  subtitle="Table Subtitle"
  data={data}
  columns={columns}
 />
  

        `,
      },
    },
  },
  render: () => (
    <>
      <Table
        title="Table Title"
        subtitle="Table Subtitle"
        data={[
          { name: "Name 2", surname: "Surname 2" },
          { name: "Name 3", surname: "Surname 3" },
          { name: "Name 1", surname: "Surname 1" },
        ]}
        columns={[
          { title: "Name", dataKey: "name" },
          { title: "Surname", dataKey: "surname" },
        ]}
      />
    </>
  ),
};

export const Footer: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={columns}
  footer={() => (
    <div
      style={{
        borderTop: "double 3px #AAA",
        background: "#f9f9f9",
        marginTop: 10,
        padding: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        gap: 10
      }}
    >
      <span>There are total {data.length} records.</span>
      <Button size="sm" label="Report Wrong Data" icon="folder" variant="warning" />
    </div>
  )}
/>
        `,
      },
    },
  },
  render: () => {
    const data = [
      { name: "Name 1", surname: "Surname 1" },
      { name: "Name 2", surname: "Surname 2" },
    ];
    const columns = [
      { title: "Name", dataKey: "name" },
      { title: "Surname", dataKey: "surname" },
    ];
    return (
      <Table
        data={data}
        columns={columns}
        footer={() => (
          <div
            style={{
              borderTop: "double 3px #AAA",
              background: "#f9f9f9",
              marginTop: 10,
              padding: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              gap: 10,
            }}
          >
            <span>There are total {data.length} records.</span>
            <Button size="sm" label="Report Wrong Data" icon="folder" variant="warning" />
          </div>
        )}
      />
    );
  },
};

export const FooterForColumns: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `<Table
    data={data}
    columns={[
      { title: "Name", dataKey: "name", footer: { render: () => "Custom Footer" } },
      { title: "Surname", dataKey: "surname" },
      { title: "Age", dataKey: "age", footer: {
        type: "avg",
        title: "Average Age",
        render: avg => <button onClick={() => alert(avg)}>🔢 {avg as string}</button>
      }},
      { title: "City", dataKey: "city" },
      { title: "Price", dataKey: "price", footer: {
        type: "sum",
        title: "Total Price"
      }}
    ]}
  />`,
      },
    },
  },
  render: () => {
    const data = [
      { name: "Name 1", surname: "Surname 1", age: 25, city: "Istanbul", price: 100 },
      { name: "Name 2", surname: "Surname 2", age: 30, city: "Ankara", price: 200 },
    ];

    return (
      <Table
        data={data}
        columns={[
          { title: "Name", dataKey: "name", footer: { render: () => "Custom Footer" } },
          { title: "Surname", dataKey: "surname" },
          {
            title: "Age",
            dataKey: "age",
            footer: {
              type: "avg",
              title: "Average Age",
              render: avg => <button onClick={() => alert(avg)}>🔢 {avg as string}</button>,
            },
          },
          { title: "City", dataKey: "city" },
          {
            title: "Price",
            dataKey: "price",
            footer: {
              type: "sum",
              title: "Total Price",
            },
          },
        ]}
      />
    );
  },
};

export const Filtering: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={columns}
  filterableTable
/>
        `,
      },
    },
  },
  render: () => {
    const data = [
      { name: "Dummy", age: "32" },
      { name: "Foo", age: "43" },
      { name: "Foo Bar", age: "54" },
      { name: "Dummy Foo Bar", age: "35" },
    ];
    const columns = [
      { title: "Full Name", dataKey: "name", filter: true, filterPlaceholder: "Search full name.." },
      { title: "Age", dataKey: "age", filter: true },
    ];
    return <Table data={data} columns={columns} filterableTable />;
  },
};

export const Selection: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={columns}
  selectable
  selectionKey="id"
  defaultSelectedIds={[2]}
  onSelectionChange={(changedIds, selected, selectedIds) => alert(JSON.stringify({ changedIds, selected, selectedIds }))}
/>
        `,
      },
    },
  },
  render: () => {
    const data = [
      { id: 1, name: "Foo", age: "43" },
      { id: 2, name: "Dummy", age: "32" },
    ];
    const columns = [
      { title: "Name", dataKey: "name", sorting: {} },
      { title: "Age", dataKey: "age", sorting: {} },
    ];
    return (
      <Table
        data={data}
        columns={columns}
        selectable
        selectionKey="id"
        defaultSelectedIds={[2]}
        onSelectionChange={(changedIds, selected, selectedIds) => alert(JSON.stringify({ changedIds, selected, selectedIds }))}
      />
    );
  },
};

export const Pagination: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={columns}
  pagination={{ rowsPerPage: 2, position: "right" }}
/>
        `,
      },
    },
  },
  render: () => {
    const data = [
      { name: "Foo name cell value here", age: "43" },
      { name: "Dummy name", age: "32" },
      { name: "Foo 2 name cell value here", age: "23" },
      { name: "Dummy 2 name", age: "44" },
      { name: "Foo 3 name cell value here", age: "25" },
    ];
    const columns = [
      { title: "Name", dataKey: "name", sorting: {} },
      { title: "Age", dataKey: "age", sorting: {} },
    ];
    return <Table data={data} columns={columns} pagination={{ rowsPerPage: 2, position: "center" }} hideTotalRecords />;
  },
};

export const RowNumbers: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  header="Fixed Row Numbers"
  data={data}
  columns={columns}
  showFixedRowNumbers
/>
<br />
<Table
  header="Dynamic Row Numbers"
  data={data}
  columns={[
    { title: "Seq", dataKey: "#" },
    { title: "Name", dataKey: "name", sorting: {} },
    { title: "Age", dataKey: "age", sorting: {} }
  ]}
/>
        `,
      },
    },
  },
  render: () => {
    const data = [
      { name: "Foo", age: "43" },
      { name: "Dummy", age: "32" },
    ];
    const columns = [
      { title: "Seq", dataKey: "#" },
      { title: "Name", dataKey: "name", sorting: {} },
      { title: "Age", dataKey: "age", sorting: {} },
    ];
    return <Table data={data} columns={columns} />;
  },
};

export const RowColoring: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={columns}
  rowColorCallback={rowData => (rowData.age > 80 ? "danger" : rowData.age < 30 ? "success" : undefined)}
/>
        `,
      },
    },
  },
  render: () => {
    const data = [
      { name: "Middle aged guy", age: 45 },
      { name: "Old man", age: 81 },
      { name: "Young woman", age: 28 },
      { name: "Retired guy", age: 62 },
    ];
    const columns = [
      { title: "Name", dataKey: "name" },
      { title: "Age", dataKey: "age" },
    ];
    return (
      <Table
        data={data}
        columns={columns}
        rowColorCallback={rowData => (rowData.age > 80 ? "danger" : rowData.age < 30 ? "success" : undefined)}
      />
    );
  },
};

export const Colspan: Story = {
  render: () => {
    type RowData = { fullName: string; age: number; city: string; merged: boolean };
    const data: RowData[] = [
      { fullName: "John Doe", age: 28, city: "New York", merged: true },
      { fullName: "Jane Smith", age: 34, city: "Los Angeles", merged: true },
      { fullName: "Alice Johnson", age: 29, city: "Chicago", merged: false },
      { fullName: "Bob Williams", age: 42, city: "Houston", merged: false },
    ];
    const columns = [
      {
        title: "Personal Info",
        dataKey: "fullName",
        colSpan: (row: unknown) => ((row as RowData).merged ? 2 : 1),
      },
      {
        title: "Age",
        dataKey: "age",
      },
      {
        title: "City",
        dataKey: "city",
      },
    ];
    return <Table data={data} columns={columns} border="cellBorders" />;
  },
};

export const Rowspan: Story = {
  render: () => {
    type RowData = { name: string; surname: string; age: number };
    const data = [
      { name: "Name 1", surname: "Surname 1", age: 25 },
      { name: "Name 1", surname: "Surname 2", age: 30 },
      { name: "Name 2", surname: "Surname 3", age: 22 },
      { name: "Name 2", surname: "Surname 4", age: 28 },
    ];
    const columns = [
      {
        title: "Name",
        dataKey: "name",
        rowSpan: (row: object) => {
          const rowData = row as RowData;
          return rowData.surname === "Surname 1" || rowData.surname === "Surname 3" ? 2 : 1;
        },
      },
      { title: "Surname", dataKey: "surname" },
      { title: "Age", dataKey: "age" },
    ];
    return <Table data={data} columns={columns} border="cellBorders" />;
  },
};
