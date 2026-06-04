import type { Meta, StoryObj } from "@storybook/nextjs";

import Table from "./Table";
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
    <>
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
      <br />
      <br />
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
    </>
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
      { title: "Full Name", dataKey: "name", filter: true },
      { title: "Age", dataKey: "age", filter: true },
    ];
    return (
      <div style={{ width: 600 }}>
        <Table data={data} columns={columns} filterableTable />
      </div>
    );
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
  selectionKey="selected"
  onSelect={selection => alert(JSON.stringify(selection))}
/>
        `,
      },
    },
  },
  render: () => {
    const data = [
      { name: "Foo", age: "43" },
      { name: "Dummy", age: "32", selected: true },
    ];
    const columns = [
      { title: "Name", dataKey: "name", sorting: {} },
      { title: "Age", dataKey: "age", sorting: {} },
    ];
    return (
      <div style={{ width: 600 }}>
        <Table data={data} columns={columns} selectable selectionKey="selected" onSelect={selection => alert(JSON.stringify(selection))} />
      </div>
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
      { name: "Foo", age: "43" },
      { name: "Dummy", age: "32" },
      { name: "Foo 2", age: "23" },
      { name: "Dummy 2", age: "44" },
      { name: "Foo 3", age: "25" },
    ];
    const columns = [
      { title: "Name", dataKey: "name", sorting: {} },
      { title: "Age", dataKey: "age", sorting: {} },
    ];
    return (
      <div style={{ width: 600 }}>
        <Table data={data} columns={columns} pagination={{ rowsPerPage: 2, position: "right" }} />
      </div>
    );
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
    return (
      <div style={{ width: 600 }}>
        <Table data={data} columns={columns} />
      </div>
    );
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
      <div style={{ width: 600 }}>
        <Table
          data={data}
          columns={columns}
          rowColorCallback={rowData => (rowData.age > 80 ? "danger" : rowData.age < 30 ? "success" : undefined)}
        />
      </div>
    );
  },
};

export const ColSpan: Story = {
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
    return (
      <div style={{ width: 800 }}>
        <Table data={data} columns={columns} border="cellBorders" />
      </div>
    );
  },
};

export const RowSpan: Story = {
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
        // İsim bazlı gruplama: İlk ve üçüncü satırda 2 satır kapla diyoruz.
        // Bir sonraki satırlar TableBody tarafından otomatik olarak atlanır.
        rowSpan: (row: object) => {
          const rowData = row as RowData;
          return rowData.surname === "Surname 1" || rowData.surname === "Surname 3" ? 2 : 1;
        },
      },
      { title: "Surname", dataKey: "surname" },
      { title: "Age", dataKey: "age" },
    ];
    return (
      <div style={{ width: 600 }}>
        <Table data={data} columns={columns} border="cellBorders" />
      </div>
    );
  },
};

export const FilteredRowSpanAndColSpan: Story = {
  render: () => {
    type RowData = {
      department: string;
      employee: string;
      role: string;
      status: "Active" | "Passive";
      firstInGroup: boolean;
      summary?: boolean;
    };

    const allData: RowData[] = [
      { department: "Engineering", employee: "John", role: "Frontend", status: "Active", firstInGroup: true },
      { department: "Engineering", employee: "Jane", role: "Backend", status: "Active", firstInGroup: false },
      { department: "Engineering", employee: "Bob", role: "DevOps", status: "Passive", firstInGroup: false },
      { department: "Sales", employee: "Alice", role: "Lead", status: "Active", firstInGroup: true },
      { department: "Sales", employee: "Charlie", role: "Representative", status: "Passive", firstInGroup: false },
      { department: "Active Team Total", employee: "3 employees", role: "", status: "Active", firstInGroup: true, summary: true },
    ];

    const data = allData.filter(row => row.status === "Active");
    const groupSizes = data.reduce<Record<string, number>>((acc, row) => {
      if (!row.summary) acc[row.department] = (acc[row.department] ?? 0) + 1;
      return acc;
    }, {});

    return (
      <div style={{ width: 800 }}>
        <Table
          data={data}
          border="cellBorders"
          filterableTable
          columns={[
            {
              title: "Department",
              dataKey: "department",
              filter: true,
              rowSpan: (row: object) => {
                const rowData = row as RowData;
                return rowData.firstInGroup && !rowData.summary ? groupSizes[rowData.department] : 1;
              },
            },
            {
              title: "Employee",
              dataKey: "employee",
              filter: true,
              colSpan: (row: object) => ((row as RowData).summary ? 2 : 1),
            },
            { title: "Role", dataKey: "role", filter: true },
            { title: "Status", dataKey: "status", filter: true },
          ]}
        />
      </div>
    );
  },
};
